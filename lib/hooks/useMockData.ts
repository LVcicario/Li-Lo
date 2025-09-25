import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockDataGenerator, MockMetrics, MockOrder, MockProduct, MockCustomer } from '@/lib/mock/mockDataGenerator';

interface MockDataStore {
  isUsingMockData: boolean;
  toggleMockData: () => void;

  // CEO Dashboard Data
  getCEOMetrics: () => Promise<MockMetrics | null>;
  getRevenueTimeSeries: (days?: number) => Promise<Array<{ date: string; value: number; label: string }>>;
  getTopProducts: (limit?: number) => Promise<MockProduct[]>;
  getRecentOrders: (limit?: number) => Promise<MockOrder[]>;

  // Seller Dashboard Data
  getInventory: () => Promise<MockProduct[]>;
  getReorderSuggestions: (count?: number) => Promise<Array<{
    product: MockProduct;
    currentStock: number;
    suggestedQuantity: number;
    estimatedDemand: number;
    urgency: 'low' | 'medium' | 'high' | 'critical';
  }>>;
  getStockHistory: (productId: string, days?: number) => Promise<any[]>;

  // Client Dashboard Data
  getCustomerOrders: (customerId: string) => Promise<MockOrder[]>;
  getOrderById: (orderId: string) => Promise<MockOrder | null>;
  trackOrder: (orderId: string) => Promise<{
    status: string;
    location: string;
    estimatedDelivery: string;
    events: Array<{
      timestamp: string;
      status: string;
      location: string;
      description: string;
    }>;
  }>;
}

export const useMockData = create<MockDataStore>()(
  persist(
    (set, get) => ({
      isUsingMockData: false,

      toggleMockData: () => set((state) => ({ isUsingMockData: !state.isUsingMockData })),

      getCEOMetrics: async () => {
        if (!get().isUsingMockData) return null;

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return mockDataGenerator.generateMetrics();
      },

      getRevenueTimeSeries: async (days = 30) => {
        if (!get().isUsingMockData) return [];

        await new Promise(resolve => setTimeout(resolve, 300));

        return mockDataGenerator.generateTimeSeriesData(days, 'revenue');
      },

      getTopProducts: async (limit = 10) => {
        if (!get().isUsingMockData) return [];

        await new Promise(resolve => setTimeout(resolve, 400));

        return Array.from({ length: limit }, () => mockDataGenerator.generateProduct())
          .sort((a, b) => b.sales_last_30_days - a.sales_last_30_days);
      },

      getRecentOrders: async (limit = 10) => {
        if (!get().isUsingMockData) return [];

        await new Promise(resolve => setTimeout(resolve, 300));

        return Array.from({ length: limit }, (_, i) => mockDataGenerator.generateOrder(i));
      },

      getInventory: async () => {
        if (!get().isUsingMockData) return [];

        await new Promise(resolve => setTimeout(resolve, 500));

        return Array.from({ length: 50 }, () => mockDataGenerator.generateProduct());
      },

      getReorderSuggestions: async (count = 5) => {
        if (!get().isUsingMockData) return [];

        await new Promise(resolve => setTimeout(resolve, 400));

        return mockDataGenerator.generateReorderSuggestions(count);
      },

      getStockHistory: async (productId: string, days = 30) => {
        if (!get().isUsingMockData) return [];

        await new Promise(resolve => setTimeout(resolve, 300));

        return mockDataGenerator.generateStockHistory(productId, days);
      },

      getCustomerOrders: async (customerId: string) => {
        if (!get().isUsingMockData) return [];

        await new Promise(resolve => setTimeout(resolve, 400));

        return Array.from({ length: 8 }, (_, i) => {
          const order = mockDataGenerator.generateOrder(i * 10);
          order.customer_id = customerId;
          return order;
        });
      },

      getOrderById: async (orderId: string) => {
        if (!get().isUsingMockData) return null;

        await new Promise(resolve => setTimeout(resolve, 200));

        const order = mockDataGenerator.generateOrder(5);
        order.id = orderId;
        return order;
      },

      trackOrder: async (orderId: string) => {
        if (!get().isUsingMockData) {
          return {
            status: 'unknown',
            location: 'N/A',
            estimatedDelivery: 'N/A',
            events: []
          };
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        const events = [
          {
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Order Placed',
            location: 'Online',
            description: 'Your order has been confirmed and is being processed'
          },
          {
            timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Processing',
            location: 'Warehouse - Paris',
            description: 'Your items are being prepared for shipment'
          },
          {
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Shipped',
            location: 'Distribution Center - Paris',
            description: 'Your package has been handed to the carrier'
          },
          {
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'In Transit',
            location: 'Lyon Sorting Facility',
            description: 'Package is on its way to the destination'
          },
          {
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            status: 'Out for Delivery',
            location: 'Local Delivery Station',
            description: 'Your package is out for delivery today'
          }
        ];

        return {
          status: 'Out for Delivery',
          location: 'Local Delivery Station',
          estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          events
        };
      }
    }),
    {
      name: 'mock-data-store',
      partialize: (state) => ({ isUsingMockData: state.isUsingMockData })
    }
  )
);