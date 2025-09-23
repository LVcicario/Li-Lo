import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

export interface WishlistItem {
  id: string
  product_id: string
  variant_id?: string
  name: string
  brand: string
  price: number
  size?: string
  image: string
  sku: string
  slug: string
  category_type: 'grail' | 'exclusive' | 'limited' | 'rare'
  is_available: boolean
  notes?: string
}

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  addItem: (item: Omit<WishlistItem, 'id'>) => Promise<void>
  removeItem: (product_id: string, variant_id?: string) => Promise<void>
  updateNotes: (id: string, notes: string) => Promise<void>
  isInWishlist: (product_id: string, variant_id?: string) => boolean
  clearWishlist: () => Promise<void>
  loadWishlist: () => Promise<void>
  getTotalItems: () => number
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (item) => {
        const supabase = createClient()

        try {
          set({ isLoading: true })

          // Get current user
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) {
            throw new Error('Please log in to add items to your wishlist')
          }

          // Check if item already exists
          const existingItem = get().items.find(
            (i) => i.product_id === item.product_id && i.variant_id === item.variant_id
          )

          if (existingItem) {
            throw new Error('Item already in wishlist')
          }

          // Insert into database
          const wishlistData = {
            user_id: user.id,
            product_id: item.product_id,
            variant_id: item.variant_id || null,
            notes: item.notes || null
          }

          const { data: newWishlistItem, error } = await supabase
            .from('wishlist_items')
            .insert(wishlistData)
            .select()
            .single()

          if (error) throw error

          // Add to local state
          const wishlistItem: WishlistItem = {
            id: newWishlistItem.id,
            ...item
          }

          set((state) => ({
            items: [...state.items, wishlistItem]
          }))

        } catch (error: any) {
          console.error('Error adding item to wishlist:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      removeItem: async (product_id, variant_id) => {
        const supabase = createClient()

        try {
          set({ isLoading: true })

          // Get current user
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) {
            throw new Error('Please log in to manage your wishlist')
          }

          // Build query
          let query = supabase
            .from('wishlist_items')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', product_id)

          if (variant_id) {
            query = query.eq('variant_id', variant_id)
          } else {
            query = query.is('variant_id', null)
          }

          const { error } = await query

          if (error) throw error

          // Remove from local state
          set((state) => ({
            items: state.items.filter(item =>
              !(item.product_id === product_id &&
                (variant_id ? item.variant_id === variant_id : !item.variant_id))
            )
          }))

        } catch (error: any) {
          console.error('Error removing item from wishlist:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      updateNotes: async (id, notes) => {
        const supabase = createClient()

        try {
          set({ isLoading: true })

          // Update in database
          const { error } = await supabase
            .from('wishlist_items')
            .update({ notes, updated_at: new Date().toISOString() })
            .eq('id', id)

          if (error) throw error

          // Update local state
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? { ...item, notes } : item
            )
          }))

        } catch (error: any) {
          console.error('Error updating wishlist notes:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      isInWishlist: (product_id, variant_id) => {
        const { items } = get()
        return items.some(item =>
          item.product_id === product_id &&
          (variant_id ? item.variant_id === variant_id : !item.variant_id)
        )
      },

      clearWishlist: async () => {
        const supabase = createClient()

        try {
          set({ isLoading: true })

          // Get current user
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) {
            throw new Error('Please log in to manage your wishlist')
          }

          // Clear from database
          const { error } = await supabase
            .from('wishlist_items')
            .delete()
            .eq('user_id', user.id)

          if (error) throw error

          // Clear local state
          set({ items: [] })

        } catch (error: any) {
          console.error('Error clearing wishlist:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      loadWishlist: async () => {
        const supabase = createClient()

        try {
          set({ isLoading: true })

          // Get current user
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) {
            set({ items: [] })
            return
          }

          // Load wishlist items from database
          const { data: wishlistItems, error } = await supabase
            .from('wishlist_items')
            .select(`
              *,
              product:products(
                name,
                slug,
                base_price,
                category_type,
                status,
                brand:brands(name),
                images:product_images(url)
              ),
              variant:product_variants(
                sku,
                size,
                stock_quantity
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) throw error

          // Transform to wishlist items
          const items: WishlistItem[] = wishlistItems?.map(item => ({
            id: item.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            name: item.product.name,
            brand: item.product.brand.name,
            price: item.product.base_price,
            size: item.variant?.size,
            image: item.product.images?.[0]?.url || '',
            sku: item.variant?.sku || item.product.slug,
            slug: item.product.slug,
            category_type: item.product.category_type,
            is_available: item.product.status === 'active' && (item.variant?.stock_quantity > 0 || !item.variant),
            notes: item.notes
          })) || []

          set({ items })

        } catch (error: any) {
          console.error('Error loading wishlist:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      getTotalItems: () => {
        const { items } = get()
        return items.length
      }
    }),
    {
      name: 'wishlist-storage',
      skipHydration: true,
      partialize: (state) => ({
        // Don't persist items as they come from database
      })
    }
  )
)