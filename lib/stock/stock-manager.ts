import { createClient } from '@/lib/supabase/client';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface StockUpdate {
  product_id: string;
  variant_id: string;
  old_quantity: number;
  new_quantity: number;
  change_type: 'sale' | 'restock' | 'adjustment' | 'reservation' | 'release';
  timestamp: string;
  user_id?: string;
  order_id?: string;
  notes?: string;
}

export interface StockAlert {
  id: string;
  product_id: string;
  variant_id: string;
  alert_type: 'low_stock' | 'out_of_stock' | 'back_in_stock';
  threshold: number;
  current_stock: number;
  triggered_at: string;
  resolved: boolean;
}

export interface ReservationItem {
  id: string;
  product_id: string;
  variant_id: string;
  user_id: string;
  quantity: number;
  expires_at: string;
  order_id?: string;
  status: 'active' | 'expired' | 'fulfilled' | 'cancelled';
}

interface StockState {
  stockLevels: Map<string, number>; // variant_id -> quantity
  reservations: Map<string, ReservationItem[]>; // variant_id -> reservations
  alerts: StockAlert[];
  updates: StockUpdate[];
  isConnected: boolean;

  // Core functions
  checkStock: (variantId: string) => Promise<number>;
  updateStock: (variantId: string, quantity: number, type: StockUpdate['change_type']) => Promise<void>;
  reserveStock: (variantId: string, quantity: number, userId: string, duration?: number) => Promise<ReservationItem>;
  releaseReservation: (reservationId: string) => Promise<void>;
  fulfillReservation: (reservationId: string, orderId: string) => Promise<void>;

  // Batch operations
  batchUpdateStock: (updates: Array<{ variantId: string; quantity: number }>) => Promise<void>;
  transferStock: (fromVariantId: string, toVariantId: string, quantity: number) => Promise<void>;

  // Monitoring
  subscribeToStock: (variantId: string) => void;
  unsubscribeFromStock: (variantId: string) => void;
  getStockHistory: (variantId: string, days?: number) => Promise<StockUpdate[]>;

  // Alerts
  setLowStockAlert: (variantId: string, threshold: number) => Promise<void>;
  clearAlert: (alertId: string) => Promise<void>;
  checkAlerts: (variantId: string, currentStock: number) => Promise<void>;

  // Analytics
  getStockMetrics: () => Promise<{
    totalValue: number;
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    turnoverRate: number;
  }>;
}

export const useStockManager = create<StockState>()(
  subscribeWithSelector((set, get) => ({
    stockLevels: new Map(),
    reservations: new Map(),
    alerts: [],
    updates: [],
    isConnected: false,

    checkStock: async (variantId: string) => {
      const supabase = createClient();

      try {
        // Get current stock
        const { data: variant } = await supabase
          .from('product_variants')
          .select('stock_quantity, reserved_quantity')
          .eq('id', variantId)
          .single();

        if (!variant) return 0;

        // Calculate available stock
        const available = variant.stock_quantity - (variant.reserved_quantity || 0);

        // Update local cache
        set(state => {
          const newLevels = new Map(state.stockLevels);
          newLevels.set(variantId, available);
          return { stockLevels: newLevels };
        });

        return available;
      } catch (error) {
        console.error('Check stock error:', error);
        return 0;
      }
    },

    updateStock: async (variantId: string, quantity: number, type: StockUpdate['change_type']) => {
      const supabase = createClient();

      try {
        // Start transaction
        const { data: variant } = await supabase
          .from('product_variants')
          .select('stock_quantity, product_id')
          .eq('id', variantId)
          .single();

        if (!variant) throw new Error('Variant not found');

        const newQuantity = variant.stock_quantity + quantity;

        if (newQuantity < 0) {
          throw new Error('Insufficient stock');
        }

        // Update stock
        await supabase
          .from('product_variants')
          .update({ stock_quantity: newQuantity })
          .eq('id', variantId);

        // Record update
        const update: StockUpdate = {
          product_id: variant.product_id,
          variant_id: variantId,
          old_quantity: variant.stock_quantity,
          new_quantity: newQuantity,
          change_type: type,
          timestamp: new Date().toISOString()
        };

        await supabase.from('stock_updates').insert(update);

        // Update local state
        set(state => {
          const newLevels = new Map(state.stockLevels);
          newLevels.set(variantId, newQuantity);
          return {
            stockLevels: newLevels,
            updates: [update, ...state.updates].slice(0, 100)
          };
        });

        // Check for alerts
        await get().checkAlerts(variantId, newQuantity);

        // Emit real-time update
        await supabase.from('stock_events').insert({
          variant_id: variantId,
          event_type: 'stock_updated',
          data: { new_quantity: newQuantity }
        });

      } catch (error) {
        console.error('Update stock error:', error);
        throw error;
      }
    },

    reserveStock: async (variantId: string, quantity: number, userId: string, duration = 15) => {
      const supabase = createClient();

      try {
        // Check available stock
        const available = await get().checkStock(variantId);

        if (available < quantity) {
          throw new Error('Insufficient stock for reservation');
        }

        // Create reservation
        const reservation: ReservationItem = {
          id: `res_${Date.now()}`,
          product_id: '', // Will be filled from variant
          variant_id: variantId,
          user_id: userId,
          quantity,
          expires_at: new Date(Date.now() + duration * 60 * 1000).toISOString(),
          status: 'active'
        };

        // Get product ID
        const { data: variant } = await supabase
          .from('product_variants')
          .select('product_id')
          .eq('id', variantId)
          .single();

        reservation.product_id = variant?.product_id || '';

        // Save reservation
        await supabase.from('stock_reservations').insert(reservation);

        // Update reserved quantity
        await supabase.rpc('increment_reserved_stock', {
          p_variant_id: variantId,
          p_quantity: quantity
        });

        // Update local state
        set(state => {
          const variantReservations = state.reservations.get(variantId) || [];
          const newReservations = new Map(state.reservations);
          newReservations.set(variantId, [...variantReservations, reservation]);
          return { reservations: newReservations };
        });

        // Set timer to auto-release
        setTimeout(() => {
          get().releaseReservation(reservation.id);
        }, duration * 60 * 1000);

        return reservation;
      } catch (error) {
        console.error('Reserve stock error:', error);
        throw error;
      }
    },

    releaseReservation: async (reservationId: string) => {
      const supabase = createClient();

      try {
        // Get reservation
        const { data: reservation } = await supabase
          .from('stock_reservations')
          .select('*')
          .eq('id', reservationId)
          .eq('status', 'active')
          .single();

        if (!reservation) return;

        // Update reservation status
        await supabase
          .from('stock_reservations')
          .update({ status: 'expired' })
          .eq('id', reservationId);

        // Release reserved stock
        await supabase.rpc('decrement_reserved_stock', {
          p_variant_id: reservation.variant_id,
          p_quantity: reservation.quantity
        });

        // Update local state
        set(state => {
          const newReservations = new Map(state.reservations);
          const variantReservations = newReservations.get(reservation.variant_id) || [];
          newReservations.set(
            reservation.variant_id,
            variantReservations.filter(r => r.id !== reservationId)
          );
          return { reservations: newReservations };
        });

        // Notify waiting users
        await supabase.from('stock_events').insert({
          variant_id: reservation.variant_id,
          event_type: 'stock_released',
          data: { quantity: reservation.quantity }
        });

      } catch (error) {
        console.error('Release reservation error:', error);
      }
    },

    fulfillReservation: async (reservationId: string, orderId: string) => {
      const supabase = createClient();

      try {
        // Get reservation
        const { data: reservation } = await supabase
          .from('stock_reservations')
          .select('*')
          .eq('id', reservationId)
          .eq('status', 'active')
          .single();

        if (!reservation) throw new Error('Reservation not found');

        // Update reservation
        await supabase
          .from('stock_reservations')
          .update({
            status: 'fulfilled',
            order_id: orderId
          })
          .eq('id', reservationId);

        // Decrease actual stock
        await supabase.rpc('decrement_stock', {
          p_variant_id: reservation.variant_id,
          p_quantity: reservation.quantity
        });

        // Decrease reserved stock
        await supabase.rpc('decrement_reserved_stock', {
          p_variant_id: reservation.variant_id,
          p_quantity: reservation.quantity
        });

        // Record stock update
        await get().updateStock(
          reservation.variant_id,
          -reservation.quantity,
          'sale'
        );

      } catch (error) {
        console.error('Fulfill reservation error:', error);
        throw error;
      }
    },

    batchUpdateStock: async (updates: Array<{ variantId: string; quantity: number }>) => {
      const supabase = createClient();

      try {
        // Process updates in transaction
        for (const update of updates) {
          await get().updateStock(update.variantId, update.quantity, 'adjustment');
        }

        // Emit batch update event
        await supabase.from('stock_events').insert({
          event_type: 'batch_update',
          data: { updates }
        });

      } catch (error) {
        console.error('Batch update error:', error);
        throw error;
      }
    },

    transferStock: async (fromVariantId: string, toVariantId: string, quantity: number) => {
      try {
        // Check source stock
        const sourceStock = await get().checkStock(fromVariantId);
        if (sourceStock < quantity) {
          throw new Error('Insufficient stock for transfer');
        }

        // Perform transfer
        await get().updateStock(fromVariantId, -quantity, 'adjustment');
        await get().updateStock(toVariantId, quantity, 'adjustment');

      } catch (error) {
        console.error('Transfer stock error:', error);
        throw error;
      }
    },

    subscribeToStock: (variantId: string) => {
      const supabase = createClient();

      // Subscribe to real-time updates
      const subscription = supabase
        .channel(`stock:${variantId}`)
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'product_variants',
            filter: `id=eq.${variantId}`
          },
          (payload) => {
            // Update local stock level
            if (payload.new) {
              set(state => {
                const newLevels = new Map(state.stockLevels);
                newLevels.set(variantId, (payload.new as any).stock_quantity);
                return { stockLevels: newLevels };
              });
            }
          }
        )
        .subscribe();
    },

    unsubscribeFromStock: (variantId: string) => {
      const supabase = createClient();
      supabase.channel(`stock:${variantId}`).unsubscribe();
    },

    getStockHistory: async (variantId: string, days = 30) => {
      const supabase = createClient();

      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data } = await supabase
        .from('stock_updates')
        .select('*')
        .eq('variant_id', variantId)
        .gte('timestamp', since.toISOString())
        .order('timestamp', { ascending: false });

      return data || [];
    },

    setLowStockAlert: async (variantId: string, threshold: number) => {
      const supabase = createClient();

      await supabase
        .from('stock_alerts_config')
        .upsert({
          variant_id: variantId,
          low_stock_threshold: threshold,
          active: true
        });
    },

    clearAlert: async (alertId: string) => {
      const supabase = createClient();

      await supabase
        .from('stock_alerts')
        .update({ resolved: true })
        .eq('id', alertId);

      set(state => ({
        alerts: state.alerts.filter(a => a.id !== alertId)
      }));
    },

    getStockMetrics: async () => {
      const supabase = createClient();

      const { data: metrics } = await supabase.rpc('get_stock_metrics');

      return metrics || {
        totalValue: 0,
        totalItems: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        turnoverRate: 0
      };
    },

    checkAlerts: async (variantId: string, currentStock: number) => {
      const supabase = createClient();

      // Check alert thresholds
      const { data: config } = await supabase
        .from('stock_alerts_config')
        .select('*')
        .eq('variant_id', variantId)
        .eq('active', true)
        .single();

      if (!config) return;

      // Check for low stock
      if (currentStock <= config.low_stock_threshold && currentStock > 0) {
        const alert: StockAlert = {
          id: `alert_${Date.now()}`,
          product_id: '', // Will be filled
          variant_id: variantId,
          alert_type: 'low_stock',
          threshold: config.low_stock_threshold,
          current_stock: currentStock,
          triggered_at: new Date().toISOString(),
          resolved: false
        };

        await supabase.from('stock_alerts').insert(alert);

        set(state => ({
          alerts: [alert, ...state.alerts]
        }));
      }

      // Check for out of stock
      if (currentStock === 0) {
        const alert: StockAlert = {
          id: `alert_${Date.now()}`,
          product_id: '', // Will be filled
          variant_id: variantId,
          alert_type: 'out_of_stock',
          threshold: 0,
          current_stock: 0,
          triggered_at: new Date().toISOString(),
          resolved: false
        };

        await supabase.from('stock_alerts').insert(alert);

        set(state => ({
          alerts: [alert, ...state.alerts]
        }));
      }
    }
  }))
);

// Initialize real-time connection
if (typeof window !== 'undefined') {
  const supabase = createClient();

  // Subscribe to all stock updates
  supabase
    .channel('global-stock')
    .on('postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'stock_updates'
      },
      (payload) => {
        console.log('Stock update received:', payload);
      }
    )
    .subscribe((status) => {
      useStockManager.setState({ isConnected: status === 'SUBSCRIBED' });
    });

  // Clean up expired reservations every minute
  setInterval(() => {
    const { reservations } = useStockManager.getState();
    const now = new Date();

    reservations.forEach((variantReservations, variantId) => {
      variantReservations.forEach(reservation => {
        if (reservation.status === 'active' && new Date(reservation.expires_at) < now) {
          useStockManager.getState().releaseReservation(reservation.id);
        }
      });
    });
  }, 60000);
}