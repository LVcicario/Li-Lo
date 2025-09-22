import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'

export interface CartItem {
  id: string
  product_id: string
  variant_id: string
  name: string
  brand: string
  price: number
  size: string
  quantity: number
  image: string
  sku: string
  max_quantity?: number
  session_id?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  sessionId: string
  addItem: (item: Omit<CartItem, 'id' | 'session_id'>) => Promise<void>
  removeItem: (id: string, size: string) => Promise<void>
  updateQuantity: (id: string, size: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  toggleCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  syncCart: () => Promise<void>
  loadCart: () => Promise<void>
}

// Generate session ID for guest users
const generateSessionId = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('li-lo-session-id')
    if (stored) return stored

    const newSessionId = uuidv4()
    localStorage.setItem('li-lo-session-id', newSessionId)
    return newSessionId
  }
  return uuidv4()
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      sessionId: generateSessionId(),

      addItem: async (item) => {
        const supabase = createClient()
        const { sessionId } = get()

        try {
          set({ isLoading: true })

          // Get current user
          const { data: { user } } = await supabase.auth.getUser()

          // Check if item already exists in cart
          const existingItem = get().items.find(
            (i) => i.product_id === item.product_id && i.size === item.size
          )

          if (existingItem) {
            // Update quantity instead of adding new item
            await get().updateQuantity(existingItem.id, item.size, existingItem.quantity + item.quantity)
            return
          }

          // Check stock availability
          const { data: variant, error: variantError } = await supabase
            .from('product_variants')
            .select('stock_quantity')
            .eq('id', item.variant_id)
            .single()

          if (variantError) throw variantError

          if (variant.stock_quantity < item.quantity) {
            throw new Error(`Only ${variant.stock_quantity} items available in stock`)
          }

          // Insert into database
          const cartItemData = {
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price_at_time: item.price,
            ...(user ? { user_id: user.id } : { session_id: sessionId })
          }

          const { data: newCartItem, error } = await supabase
            .from('cart_items')
            .insert(cartItemData)
            .select()
            .single()

          if (error) throw error

          // Add to local state
          const cartItem: CartItem = {
            id: newCartItem.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            name: item.name,
            brand: item.brand,
            price: item.price,
            size: item.size,
            quantity: item.quantity,
            image: item.image,
            sku: item.sku,
            max_quantity: variant.stock_quantity,
            session_id: sessionId
          }

          set((state) => ({
            items: [...state.items, cartItem]
          }))

        } catch (error: any) {
          console.error('Error adding item to cart:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      removeItem: async (id, size) => {
        const supabase = createClient()

        try {
          set({ isLoading: true })

          // Remove from database
          const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', id)

          if (error) throw error

          // Remove from local state
          set((state) => ({
            items: state.items.filter(item => item.id !== id)
          }))

        } catch (error: any) {
          console.error('Error removing item from cart:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      updateQuantity: async (id, size, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(id, size)
          return
        }

        const supabase = createClient()

        try {
          set({ isLoading: true })

          const item = get().items.find(i => i.id === id)
          if (!item) return

          // Check stock availability
          const { data: variant, error: variantError } = await supabase
            .from('product_variants')
            .select('stock_quantity')
            .eq('id', item.variant_id)
            .single()

          if (variantError) throw variantError

          if (variant.stock_quantity < quantity) {
            throw new Error(`Only ${variant.stock_quantity} items available in stock`)
          }

          // Update in database
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity, updated_at: new Date().toISOString() })
            .eq('id', id)

          if (error) throw error

          // Update local state
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id
                ? { ...item, quantity, max_quantity: variant.stock_quantity }
                : item
            )
          }))

        } catch (error: any) {
          console.error('Error updating cart quantity:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      clearCart: async () => {
        const supabase = createClient()
        const { sessionId } = get()

        try {
          set({ isLoading: true })

          // Get current user
          const { data: { user } } = await supabase.auth.getUser()

          // Clear from database
          const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq(user ? 'user_id' : 'session_id', user ? user.id : sessionId)

          if (error) throw error

          // Clear local state
          set({ items: [] })

        } catch (error: any) {
          console.error('Error clearing cart:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalPrice: () => {
        const { items } = get()
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },

      syncCart: async () => {
        // Sync guest cart to user account after login
        const supabase = createClient()
        const { sessionId } = get()

        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return

          // Get guest cart items
          const { data: guestItems, error: guestError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('session_id', sessionId)

          if (guestError) throw guestError

          if (guestItems && guestItems.length > 0) {
            // Update guest items to be associated with user
            const { error: updateError } = await supabase
              .from('cart_items')
              .update({ user_id: user.id, session_id: null })
              .eq('session_id', sessionId)

            if (updateError) throw updateError

            // Reload cart
            await get().loadCart()
          }

        } catch (error: any) {
          console.error('Error syncing cart:', error)
        }
      },

      loadCart: async () => {
        const supabase = createClient()
        const { sessionId } = get()

        try {
          set({ isLoading: true })

          // Get current user
          const { data: { user } } = await supabase.auth.getUser()

          // Load cart items from database
          const { data: cartItems, error } = await supabase
            .from('cart_items')
            .select(`
              *,
              product:products(
                name,
                slug,
                brand:brands(name),
                images:product_images(url)
              ),
              variant:product_variants(
                sku,
                size,
                stock_quantity
              )
            `)
            .eq(user ? 'user_id' : 'session_id', user ? user.id : sessionId)
            .order('created_at', { ascending: false })

          if (error) throw error

          // Transform to cart items
          const items: CartItem[] = cartItems?.map(item => ({
            id: item.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            name: item.product.name,
            brand: item.product.brand.name,
            price: item.price_at_time,
            size: item.variant.size,
            quantity: item.quantity,
            image: item.product.images?.[0]?.url || '',
            sku: item.variant.sku,
            max_quantity: item.variant.stock_quantity,
            session_id: sessionId
          })) || []

          set({ items })

        } catch (error: any) {
          console.error('Error loading cart:', error)
        } finally {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
      partialize: (state) => ({
        sessionId: state.sessionId,
        // Don't persist items as they come from database
      })
    }
  )
)