import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import type { ProductData } from '@/lib/product-data';

export interface WishlistItem {
  id: string;
  product_id: string;
  product: ProductData;
  user_id: string;
  added_at: string;
  notify_price_drop: boolean;
  notify_back_in_stock: boolean;
  target_price?: number;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  size_preference?: string;
  price_history: PricePoint[];
}

export interface PricePoint {
  date: string;
  price: number;
  currency: 'EUR' | 'USD';
}

export interface PriceAlert {
  id: string;
  product_id: string;
  user_id: string;
  type: 'price_drop' | 'back_in_stock' | 'target_price';
  triggered_at: string;
  old_price?: number;
  new_price?: number;
  message: string;
  read: boolean;
}

interface WishlistState {
  items: WishlistItem[];
  alerts: PriceAlert[];
  loading: boolean;
  syncing: boolean;

  // Core functions
  addItem: (productId: string, options?: Partial<WishlistItem>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItem: (itemId: string, updates: Partial<WishlistItem>) => Promise<void>;
  clearWishlist: () => Promise<void>;

  // Price tracking
  setPriceAlert: (productId: string, targetPrice: number) => Promise<void>;
  removePriceAlert: (productId: string) => Promise<void>;
  checkPriceChanges: () => Promise<void>;

  // Stock notifications
  setStockAlert: (productId: string, size?: string) => Promise<void>;
  removeStockAlert: (productId: string) => Promise<void>;

  // Sync and load
  syncWithServer: (userId: string) => Promise<void>;
  loadWishlist: (userId?: string) => Promise<void>;

  // Analytics
  getMostWantedItems: () => WishlistItem[];
  getPriceDropItems: () => WishlistItem[];
  getWishlistValue: () => { total: number; currency: string };

  // Sharing
  createShareableLink: () => Promise<string>;
  loadSharedWishlist: (shareId: string) => Promise<WishlistItem[]>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      alerts: [],
      loading: false,
      syncing: false,

      addItem: async (productId: string, options?: Partial<WishlistItem>) => {
        const supabase = createClient();
        set({ loading: true });

        try {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();

          if (!user) {
            // Store locally if not authenticated
            const localItem: WishlistItem = {
              id: `local_${Date.now()}`,
              product_id: productId,
              product: {} as ProductData, // Will be fetched
              user_id: 'anonymous',
              added_at: new Date().toISOString(),
              notify_price_drop: true,
              notify_back_in_stock: true,
              priority: 'medium',
              price_history: [],
              ...options
            };

            // Fetch product data
            const { data: product } = await supabase
              .from('products')
              .select('*')
              .eq('id', productId)
              .single();

            if (product) {
              localItem.product = product;
              localItem.price_history = [{
                date: new Date().toISOString(),
                price: product.base_price,
                currency: 'EUR'
              }];
            }

            set(state => ({
              items: [...state.items, localItem],
              loading: false
            }));
          } else {
            // Save to database
            const { data, error } = await supabase
              .from('wishlist_items')
              .insert({
                user_id: user.id,
                product_id: productId,
                notify_price_drop: options?.notify_price_drop ?? true,
                notify_back_in_stock: options?.notify_back_in_stock ?? true,
                target_price: options?.target_price,
                notes: options?.notes,
                priority: options?.priority || 'medium',
                size_preference: options?.size_preference
              })
              .select(`
                *,
                product:products(*)
              `)
              .single();

            if (error) throw error;

            // Add initial price point
            await supabase.from('price_history').insert({
              product_id: productId,
              price: data.product.base_price,
              currency: 'EUR'
            });

            set(state => ({
              items: [...state.items, data],
              loading: false
            }));

            // Track event
            await supabase.from('analytics_events').insert({
              user_id: user.id,
              event_type: 'wishlist_add',
              product_id: productId
            });
          }
        } catch (error) {
          console.error('Add to wishlist error:', error);
          set({ loading: false });
          throw error;
        }
      },

      removeItem: async (itemId: string) => {
        const supabase = createClient();
        set({ loading: true });

        try {
          if (itemId.startsWith('local_')) {
            // Remove local item
            set(state => ({
              items: state.items.filter(item => item.id !== itemId),
              loading: false
            }));
          } else {
            // Remove from database
            const { error } = await supabase
              .from('wishlist_items')
              .delete()
              .eq('id', itemId);

            if (error) throw error;

            set(state => ({
              items: state.items.filter(item => item.id !== itemId),
              loading: false
            }));
          }
        } catch (error) {
          console.error('Remove from wishlist error:', error);
          set({ loading: false });
          throw error;
        }
      },

      updateItem: async (itemId: string, updates: Partial<WishlistItem>) => {
        const supabase = createClient();

        try {
          if (itemId.startsWith('local_')) {
            // Update local item
            set(state => ({
              items: state.items.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
              )
            }));
          } else {
            // Update in database
            const { error } = await supabase
              .from('wishlist_items')
              .update(updates)
              .eq('id', itemId);

            if (error) throw error;

            set(state => ({
              items: state.items.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
              )
            }));
          }
        } catch (error) {
          console.error('Update wishlist item error:', error);
          throw error;
        }
      },

      clearWishlist: async () => {
        const supabase = createClient();
        set({ loading: true });

        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            const { error } = await supabase
              .from('wishlist_items')
              .delete()
              .eq('user_id', user.id);

            if (error) throw error;
          }

          set({ items: [], loading: false });
        } catch (error) {
          console.error('Clear wishlist error:', error);
          set({ loading: false });
          throw error;
        }
      },

      setPriceAlert: async (productId: string, targetPrice: number) => {
        const supabase = createClient();

        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            await supabase
              .from('price_alerts')
              .upsert({
                user_id: user.id,
                product_id: productId,
                target_price: targetPrice,
                active: true
              });
          }

          // Update local item
          set(state => ({
            items: state.items.map(item =>
              item.product_id === productId
                ? { ...item, target_price: targetPrice, notify_price_drop: true }
                : item
            )
          }));
        } catch (error) {
          console.error('Set price alert error:', error);
          throw error;
        }
      },

      removePriceAlert: async (productId: string) => {
        const supabase = createClient();

        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            await supabase
              .from('price_alerts')
              .delete()
              .eq('user_id', user.id)
              .eq('product_id', productId);
          }

          // Update local item
          set(state => ({
            items: state.items.map(item =>
              item.product_id === productId
                ? { ...item, target_price: undefined, notify_price_drop: false }
                : item
            )
          }));
        } catch (error) {
          console.error('Remove price alert error:', error);
          throw error;
        }
      },

      checkPriceChanges: async () => {
        const supabase = createClient();
        const { items } = get();

        try {
          for (const item of items) {
            // Get current price
            const { data: product } = await supabase
              .from('products')
              .select('base_price, sale_price')
              .eq('id', item.product_id)
              .single();

            if (product) {
              const currentPrice = product.sale_price || product.base_price;
              const lastPrice = item.price_history[item.price_history.length - 1]?.price;

              // Check for price drop
              if (lastPrice && currentPrice < lastPrice) {
                // Create alert
                const alert: PriceAlert = {
                  id: `alert_${Date.now()}`,
                  product_id: item.product_id,
                  user_id: item.user_id,
                  type: 'price_drop',
                  triggered_at: new Date().toISOString(),
                  old_price: lastPrice,
                  new_price: currentPrice,
                  message: `Price dropped from €${lastPrice} to €${currentPrice}!`,
                  read: false
                };

                set(state => ({
                  alerts: [...state.alerts, alert]
                }));

                // Send notification (would integrate with push notifications)
                console.log('Price drop alert:', alert);
              }

              // Check target price
              if (item.target_price && currentPrice <= item.target_price) {
                const alert: PriceAlert = {
                  id: `alert_${Date.now()}`,
                  product_id: item.product_id,
                  user_id: item.user_id,
                  type: 'target_price',
                  triggered_at: new Date().toISOString(),
                  new_price: currentPrice,
                  message: `Target price reached! Now €${currentPrice}`,
                  read: false
                };

                set(state => ({
                  alerts: [...state.alerts, alert]
                }));
              }

              // Update price history
              if (currentPrice !== lastPrice) {
                const newPricePoint: PricePoint = {
                  date: new Date().toISOString(),
                  price: currentPrice,
                  currency: 'EUR'
                };

                await get().updateItem(item.id, {
                  price_history: [...item.price_history, newPricePoint]
                });
              }
            }
          }
        } catch (error) {
          console.error('Check price changes error:', error);
        }
      },

      setStockAlert: async (productId: string, size?: string) => {
        const supabase = createClient();

        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            await supabase
              .from('stock_alerts')
              .upsert({
                user_id: user.id,
                product_id: productId,
                size_preference: size,
                active: true
              });
          }

          // Update local item
          set(state => ({
            items: state.items.map(item =>
              item.product_id === productId
                ? { ...item, notify_back_in_stock: true, size_preference: size }
                : item
            )
          }));
        } catch (error) {
          console.error('Set stock alert error:', error);
          throw error;
        }
      },

      removeStockAlert: async (productId: string) => {
        const supabase = createClient();

        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            await supabase
              .from('stock_alerts')
              .delete()
              .eq('user_id', user.id)
              .eq('product_id', productId);
          }

          // Update local item
          set(state => ({
            items: state.items.map(item =>
              item.product_id === productId
                ? { ...item, notify_back_in_stock: false }
                : item
            )
          }));
        } catch (error) {
          console.error('Remove stock alert error:', error);
          throw error;
        }
      },

      syncWithServer: async (userId: string) => {
        const supabase = createClient();
        set({ syncing: true });

        try {
          // Get server wishlist
          const { data: serverItems } = await supabase
            .from('wishlist_items')
            .select(`
              *,
              product:products(*),
              price_history:price_history(*)
            `)
            .eq('user_id', userId);

          // Merge with local items
          const { items: localItems } = get();
          const localOnlyItems = localItems.filter(item => item.id.startsWith('local_'));

          // Upload local items to server
          for (const localItem of localOnlyItems) {
            await get().addItem(localItem.product_id, localItem);
          }

          // Update state with server items
          set({
            items: serverItems || [],
            syncing: false
          });
        } catch (error) {
          console.error('Sync wishlist error:', error);
          set({ syncing: false });
        }
      },

      loadWishlist: async (userId?: string) => {
        const supabase = createClient();
        set({ loading: true });

        try {
          if (userId) {
            const { data } = await supabase
              .from('wishlist_items')
              .select(`
                *,
                product:products(
                  *,
                  brand:brands(*),
                  category:categories(*),
                  images:product_images(*),
                  variants:product_variants(*)
                ),
                price_history:price_history(*)
              `)
              .eq('user_id', userId)
              .order('added_at', { ascending: false });

            set({
              items: data || [],
              loading: false
            });
          } else {
            // Load from local storage (handled by zustand persist)
            set({ loading: false });
          }
        } catch (error) {
          console.error('Load wishlist error:', error);
          set({ loading: false });
        }
      },

      getMostWantedItems: () => {
        const { items } = get();
        return items
          .filter(item => item.priority === 'high')
          .sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime());
      },

      getPriceDropItems: () => {
        const { items } = get();
        return items.filter(item => {
          if (item.price_history.length < 2) return false;
          const currentPrice = item.price_history[item.price_history.length - 1].price;
          const previousPrice = item.price_history[item.price_history.length - 2].price;
          return currentPrice < previousPrice;
        });
      },

      getWishlistValue: () => {
        const { items } = get();
        const total = items.reduce((sum, item) => {
          return sum + (item.product.base_price || 0);
        }, 0);

        return {
          total,
          currency: 'EUR'
        };
      },

      createShareableLink: async () => {
        const supabase = createClient();
        const { items } = get();

        try {
          const { data, error } = await supabase
            .from('shared_wishlists')
            .insert({
              items: items.map(item => item.product_id),
              created_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            })
            .select('id')
            .single();

          if (error) throw error;

          return `${window.location.origin}/wishlist/shared/${data.id}`;
        } catch (error) {
          console.error('Create shareable link error:', error);
          throw error;
        }
      },

      loadSharedWishlist: async (shareId: string) => {
        const supabase = createClient();

        try {
          const { data } = await supabase
            .from('shared_wishlists')
            .select('items')
            .eq('id', shareId)
            .single();

          if (!data) throw new Error('Shared wishlist not found');

          const { data: products } = await supabase
            .from('products')
            .select(`
              *,
              brand:brands(*),
              category:categories(*),
              images:product_images(*),
              variants:product_variants(*)
            `)
            .in('id', data.items);

          return products?.map(product => ({
            id: `shared_${product.id}`,
            product_id: product.id,
            product,
            user_id: 'shared',
            added_at: new Date().toISOString(),
            notify_price_drop: false,
            notify_back_in_stock: false,
            priority: 'medium' as const,
            price_history: []
          })) || [];
        } catch (error) {
          console.error('Load shared wishlist error:', error);
          throw error;
        }
      }
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({
        items: state.items.filter(item => item.id.startsWith('local_')),
        alerts: state.alerts
      })
    }
  )
);

// Auto-check price changes every hour
if (typeof window !== 'undefined') {
  setInterval(() => {
    useWishlistStore.getState().checkPriceChanges();
  }, 60 * 60 * 1000);
}