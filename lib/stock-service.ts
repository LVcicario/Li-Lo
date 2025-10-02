import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface StockUpdate {
  product_id: string
  variant_id: string
  size: string
  quantity: number
  action: 'increment' | 'decrement' | 'set'
  timestamp: string
}

export interface ProductStock {
  id: string
  product_id: string
  variant_id: string
  size: string
  stock_quantity: number
  reserved_quantity: number
  available_quantity: number
  last_updated: string
}

class StockService {
  private supabase = createClient()
  private channels: Map<string, RealtimeChannel> = new Map()

  /**
   * Get current stock for a product variant
   */
  async getStock(variantId: string): Promise<ProductStock | null> {
    try {
      const { data, error } = await this.supabase
        .from('product_variants')
        .select(`
          id,
          product_id,
          size,
          stock_quantity,
          reserved_quantity
        `)
        .eq('id', variantId)
        .single()

      if (error) throw error

      return {
        id: data.id,
        product_id: data.product_id,
        variant_id: data.id,
        size: data.size,
        stock_quantity: data.stock_quantity,
        reserved_quantity: data.reserved_quantity || 0,
        available_quantity: data.stock_quantity - (data.reserved_quantity || 0),
        last_updated: new Date().toISOString()
      }
    } catch (error: any) {
      console.error('Error fetching stock:', error)
      return null
    }
  }

  /**
   * Get stock for all variants of a product
   */
  async getProductStock(productId: string): Promise<ProductStock[]> {
    try {
      const { data, error } = await this.supabase
        .from('product_variants')
        .select(`
          id,
          product_id,
          size,
          stock_quantity,
          reserved_quantity
        `)
        .eq('product_id', productId)
        .order('size')

      if (error) throw error

      return data.map(variant => ({
        id: variant.id,
        product_id: variant.product_id,
        variant_id: variant.id,
        size: variant.size,
        stock_quantity: variant.stock_quantity,
        reserved_quantity: variant.reserved_quantity || 0,
        available_quantity: variant.stock_quantity - (variant.reserved_quantity || 0),
        last_updated: new Date().toISOString()
      }))
    } catch (error: any) {
      console.error('Error fetching product stock:', error)
      return []
    }
  }

  /**
   * Update stock for a variant (worker/seller only)
   */
  async updateStock(
    variantId: string,
    quantity: number,
    action: 'increment' | 'decrement' | 'set'
  ): Promise<boolean> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('Authentication required')

      // Check if user has permission (seller or CEO)
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || !['seller', 'ceo'].includes(profile.role)) {
        throw new Error('Insufficient permissions')
      }

      // Get current stock
      const { data: current, error: fetchError } = await this.supabase
        .from('product_variants')
        .select('stock_quantity')
        .eq('id', variantId)
        .single()

      if (fetchError) throw fetchError

      let newQuantity = current.stock_quantity

      switch (action) {
        case 'increment':
          newQuantity += quantity
          break
        case 'decrement':
          newQuantity = Math.max(0, newQuantity - quantity)
          break
        case 'set':
          newQuantity = Math.max(0, quantity)
          break
      }

      // Update stock
      const { error: updateError } = await this.supabase
        .from('product_variants')
        .update({
          stock_quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', variantId)

      if (updateError) throw updateError

      // Log the stock change
      await this.supabase.from('stock_movements').insert({
        variant_id: variantId,
        user_id: user.id,
        quantity_change: action === 'set' ? newQuantity - current.stock_quantity :
                        action === 'increment' ? quantity : -quantity,
        new_quantity: newQuantity,
        reason: `Manual ${action}`,
        created_at: new Date().toISOString()
      })

      return true
    } catch (error: any) {
      console.error('Error updating stock:', error)
      return false
    }
  }

  /**
   * Reserve stock for checkout (prevents overselling)
   */
  async reserveStock(variantId: string, quantity: number): Promise<boolean> {
    try {
      // Use database transaction to prevent race conditions
      const { data: variant, error: fetchError } = await this.supabase
        .from('product_variants')
        .select('stock_quantity, reserved_quantity')
        .eq('id', variantId)
        .single()

      if (fetchError) throw fetchError

      const available = variant.stock_quantity - (variant.reserved_quantity || 0)

      if (available < quantity) {
        throw new Error(`Insufficient stock. Only ${available} items available.`)
      }

      // Reserve the stock
      const { error: updateError } = await this.supabase
        .from('product_variants')
        .update({
          reserved_quantity: (variant.reserved_quantity || 0) + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', variantId)

      if (updateError) throw updateError

      return true
    } catch (error: any) {
      console.error('Error reserving stock:', error)
      return false
    }
  }

  /**
   * Release reserved stock (e.g., when checkout is cancelled)
   */
  async releaseStock(variantId: string, quantity: number): Promise<boolean> {
    try {
      const { data: variant, error: fetchError } = await this.supabase
        .from('product_variants')
        .select('reserved_quantity')
        .eq('id', variantId)
        .single()

      if (fetchError) throw fetchError

      const newReserved = Math.max(0, (variant.reserved_quantity || 0) - quantity)

      const { error: updateError } = await this.supabase
        .from('product_variants')
        .update({
          reserved_quantity: newReserved,
          updated_at: new Date().toISOString()
        })
        .eq('id', variantId)

      if (updateError) throw updateError

      return true
    } catch (error: any) {
      console.error('Error releasing stock:', error)
      return false
    }
  }

  /**
   * Confirm stock purchase (converts reserved to sold)
   */
  async confirmPurchase(variantId: string, quantity: number): Promise<boolean> {
    try {
      const { data: variant, error: fetchError } = await this.supabase
        .from('product_variants')
        .select('stock_quantity, reserved_quantity')
        .eq('id', variantId)
        .single()

      if (fetchError) throw fetchError

      const newStock = Math.max(0, variant.stock_quantity - quantity)
      const newReserved = Math.max(0, (variant.reserved_quantity || 0) - quantity)

      const { error: updateError } = await this.supabase
        .from('product_variants')
        .update({
          stock_quantity: newStock,
          reserved_quantity: newReserved,
          updated_at: new Date().toISOString()
        })
        .eq('id', variantId)

      if (updateError) throw updateError

      // Log the sale
      const { data: { user } } = await this.supabase.auth.getUser()

      await this.supabase.from('stock_movements').insert({
        variant_id: variantId,
        user_id: user?.id,
        quantity_change: -quantity,
        new_quantity: newStock,
        reason: 'Sale confirmed',
        created_at: new Date().toISOString()
      })

      return true
    } catch (error: any) {
      console.error('Error confirming purchase:', error)
      return false
    }
  }

  /**
   * Subscribe to real-time stock updates for a product
   */
  subscribeToStock(
    productId: string,
    callback: (stock: ProductStock) => void
  ): () => void {
    const channelName = `stock-${productId}`

    // Clean up existing subscription if any
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe()
    }

    // Create new subscription
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'product_variants',
          filter: `product_id=eq.${productId}`
        },
        async (payload) => {
          const stock: ProductStock = {
            id: payload.new.id,
            product_id: payload.new.product_id,
            variant_id: payload.new.id,
            size: payload.new.size,
            stock_quantity: payload.new.stock_quantity,
            reserved_quantity: payload.new.reserved_quantity || 0,
            available_quantity: payload.new.stock_quantity - (payload.new.reserved_quantity || 0),
            last_updated: payload.new.updated_at || new Date().toISOString()
          }
          callback(stock)
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)

    // Return unsubscribe function
    return () => {
      channel.unsubscribe()
      this.channels.delete(channelName)
    }
  }

  /**
   * Check if a product/variant is sold out
   */
  async isSoldOut(variantId: string): Promise<boolean> {
    const stock = await this.getStock(variantId)
    return stock ? stock.available_quantity <= 0 : true
  }

  /**
   * Get low stock products (for worker dashboard)
   */
  async getLowStockProducts(threshold: number = 5): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('product_variants')
        .select(`
          id,
          size,
          stock_quantity,
          product:products(
            id,
            name,
            sku,
            brand:brands(name),
            images:product_images(url)
          )
        `)
        .lte('stock_quantity', threshold)
        .order('stock_quantity', { ascending: true })

      if (error) throw error

      return data || []
    } catch (error: any) {
      console.error('Error fetching low stock products:', error)
      return []
    }
  }

  /**
   * Bulk update stock (for CSV import)
   */
  async bulkUpdateStock(updates: Array<{ variantId: string, quantity: number }>): Promise<boolean> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('Authentication required')

      // Check permissions
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || !['seller', 'ceo'].includes(profile.role)) {
        throw new Error('Insufficient permissions')
      }

      // Process updates in batch
      for (const update of updates) {
        await this.updateStock(update.variantId, update.quantity, 'set')
      }

      return true
    } catch (error: any) {
      console.error('Error in bulk stock update:', error)
      return false
    }
  }

  /**
   * Clean up all subscriptions
   */
  cleanup() {
    this.channels.forEach(channel => channel.unsubscribe())
    this.channels.clear()
  }
}

// Export singleton instance
export const stockService = new StockService()

// Export types and functions for easy use
export const getStock = stockService.getStock.bind(stockService)
export const getProductStock = stockService.getProductStock.bind(stockService)
export const updateStock = stockService.updateStock.bind(stockService)
export const reserveStock = stockService.reserveStock.bind(stockService)
export const releaseStock = stockService.releaseStock.bind(stockService)
export const confirmPurchase = stockService.confirmPurchase.bind(stockService)
export const subscribeToStock = stockService.subscribeToStock.bind(stockService)
export const isSoldOut = stockService.isSoldOut.bind(stockService)
export const getLowStockProducts = stockService.getLowStockProducts.bind(stockService)
export const bulkUpdateStock = stockService.bulkUpdateStock.bind(stockService)