'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { createClient } from '@/lib/supabase/client'
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  Star,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Eye
} from 'lucide-react'
import Link from 'next/link'

interface AnalyticsData {
  productPerformance: ProductPerformance[]
  customerInsights: CustomerInsights
  salesTrends: SalesTrend[]
  topBrands: BrandPerformance[]
  orderStatusDistribution: StatusDistribution[]
  recentActivity: ActivityEvent[]
  conversionMetrics: ConversionMetrics
}

interface ProductPerformance {
  id: string
  name: string
  brand: string
  totalSold: number
  revenue: number
  averageRating: number
  stockLevel: number
  profitMargin: number
  image_url?: string
}

interface CustomerInsights {
  totalCustomers: number
  newCustomersThisMonth: number
  returningCustomers: number
  averageOrdersPerCustomer: number
  topCustomerSegments: CustomerSegment[]
}

interface CustomerSegment {
  segment: string
  count: number
  averageValue: number
  percentage: number
}

interface SalesTrend {
  date: string
  sales: number
  orders: number
  customers: number
}

interface BrandPerformance {
  brand: string
  revenue: number
  units: number
  products: number
  marketShare: number
}

interface StatusDistribution {
  status: string
  count: number
  percentage: number
  value: number
}

interface ActivityEvent {
  id: string
  type: string
  description: string
  timestamp: string
  value?: number
}

interface ConversionMetrics {
  visitorToCustomer: number
  browseToCart: number
  cartToCheckout: number
  checkoutToOrder: number
}

export default function AnalyticsPage() {
  const { user } = useAuthStore()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    productPerformance: [],
    customerInsights: {
      totalCustomers: 0,
      newCustomersThisMonth: 0,
      returningCustomers: 0,
      averageOrdersPerCustomer: 0,
      topCustomerSegments: []
    },
    salesTrends: [],
    topBrands: [],
    orderStatusDistribution: [],
    recentActivity: [],
    conversionMetrics: {
      visitorToCustomer: 0,
      browseToCart: 0,
      cartToCheckout: 0,
      checkoutToOrder: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days')

  useEffect(() => {
    if (user) {
      loadAnalyticsData()
    }
  }, [user, selectedTimeRange])

  const loadAnalyticsData = async () => {
    const supabase = createClient()

    try {
      // Get date range
      const now = new Date()
      const daysBack = selectedTimeRange === '7days' ? 7 : selectedTimeRange === '30days' ? 30 : 90
      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

      // Get product performance
      const { data: orderItems } = await supabase
        .from('order_items')
        .select(`
          quantity,
          price,
          products (
            id,
            name,
            brand,
            images,
            product_variants (
              stock_quantity
            )
          ),
          orders (
            created_at,
            status
          )
        `)
        .gte('orders.created_at', startDate.toISOString())

      // Process product performance
      const productMap = new Map()
      orderItems?.forEach(item => {
        const product = item.products
        if (!product) return

        const key = (product as any).id
        if (!productMap.has(key)) {
          productMap.set(key, {
            id: (product as any).id,
            name: (product as any).name,
            brand: (product as any).brand,
            totalSold: 0,
            revenue: 0,
            averageRating: 4.2 + Math.random() * 0.8, // Mock rating
            stockLevel: (product as any).product_variants?.[0]?.stock_quantity || 0,
            profitMargin: 20 + Math.random() * 30, // Mock profit margin
            image_url: (product as any).images?.[0]
          })
        }

        const productData = productMap.get(key)
        productData.totalSold += item.quantity
        productData.revenue += item.quantity * item.price
      })

      const productPerformance = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)

      // Get customer insights
      const { data: customers } = await supabase
        .from('profiles')
        .select('id, created_at')
        .eq('role', 'customer')

      const { data: orders } = await supabase
        .from('orders')
        .select('customer_id, total_amount, created_at, status')

      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const newCustomersThisMonth = customers?.filter(c =>
        new Date(c.created_at) >= currentMonth
      ).length || 0

      // Calculate returning customers
      const customerOrderCounts = new Map()
      orders?.forEach(order => {
        const count = customerOrderCounts.get(order.customer_id) || 0
        customerOrderCounts.set(order.customer_id, count + 1)
      })

      const returningCustomers = Array.from(customerOrderCounts.values())
        .filter(count => count > 1).length

      const averageOrdersPerCustomer = customers && customers.length > 0
        ? (orders?.length || 0) / customers.length
        : 0

      // Mock customer segments
      const topCustomerSegments: CustomerSegment[] = [
        { segment: 'High Value', count: Math.round((customers?.length || 0) * 0.2), averageValue: 450, percentage: 20 },
        { segment: 'Regular', count: Math.round((customers?.length || 0) * 0.5), averageValue: 180, percentage: 50 },
        { segment: 'New', count: Math.round((customers?.length || 0) * 0.3), averageValue: 120, percentage: 30 }
      ]

      // Generate sales trends
      const salesTrends: SalesTrend[] = []
      for (let i = daysBack; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const dayOrders = orders?.filter(order =>
          new Date(order.created_at).toDateString() === date.toDateString()
        ) || []

        salesTrends.push({
          date: date.toISOString().split('T')[0],
          sales: dayOrders.reduce((sum, order) => sum + order.total_amount, 0),
          orders: dayOrders.length,
          customers: new Set(dayOrders.map(o => o.customer_id)).size
        })
      }

      // Calculate brand performance
      const brandMap = new Map()
      productPerformance.forEach(product => {
        if (!brandMap.has(product.brand)) {
          brandMap.set(product.brand, {
            brand: product.brand,
            revenue: 0,
            units: 0,
            products: 0
          })
        }
        const brand = brandMap.get(product.brand)
        brand.revenue += product.revenue
        brand.units += product.totalSold
        brand.products += 1
      })

      const totalRevenue = Array.from(brandMap.values()).reduce((sum, brand) => sum + brand.revenue, 0)
      const topBrands = Array.from(brandMap.values())
        .map(brand => ({
          ...brand,
          marketShare: totalRevenue > 0 ? (brand.revenue / totalRevenue) * 100 : 0
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      // Calculate order status distribution
      const statusMap = new Map()
      orders?.forEach(order => {
        const count = statusMap.get(order.status) || 0
        statusMap.set(order.status, count + 1)
      })

      const totalOrders = orders?.length || 0
      const orderStatusDistribution = Array.from(statusMap.entries())
        .map(([status, count]) => ({
          status,
          count,
          percentage: totalOrders > 0 ? (count / totalOrders) * 100 : 0,
          value: orders?.filter(o => o.status === status).reduce((sum, o) => sum + o.total_amount, 0) || 0
        }))

      // Mock recent activity
      const recentActivity: ActivityEvent[] = [
        { id: '1', type: 'order', description: 'New order placed', timestamp: new Date().toISOString(), value: 299 },
        { id: '2', type: 'customer', description: 'New customer registered', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: '3', type: 'product', description: 'Product went out of stock', timestamp: new Date(Date.now() - 7200000).toISOString() },
        { id: '4', type: 'order', description: 'Order shipped', timestamp: new Date(Date.now() - 10800000).toISOString(), value: 180 }
      ]

      // Mock conversion metrics
      const conversionMetrics: ConversionMetrics = {
        visitorToCustomer: 2.5,
        browseToCart: 15.3,
        cartToCheckout: 68.2,
        checkoutToOrder: 85.7
      }

      setAnalyticsData({
        productPerformance,
        customerInsights: {
          totalCustomers: customers?.length || 0,
          newCustomersThisMonth,
          returningCustomers,
          averageOrdersPerCustomer,
          topCustomerSegments
        },
        salesTrends,
        topBrands,
        orderStatusDistribution,
        recentActivity,
        conversionMetrics
      })

    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Analytics</h1>
          <p className="text-gray-600">Advanced insights and performance metrics</p>
        </div>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
        </select>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Visitors</p>
              <p className="text-2xl font-bold text-gray-900">100%</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(analyticsData.conversionMetrics.visitorToCustomer)}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Cart Conversion</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(analyticsData.conversionMetrics.cartToCheckout)}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Order Completion</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(analyticsData.conversionMetrics.checkoutToOrder)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Customer Insights</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.customerInsights.totalCustomers}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-green-600">+{analyticsData.customerInsights.newCustomersThisMonth}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Returning Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.customerInsights.returningCustomers}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Orders/Customer</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.customerInsights.averageOrdersPerCustomer.toFixed(1)}</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Customer Segments</h4>
              {analyticsData.customerInsights.topCustomerSegments.map((segment) => (
                <div key={segment.segment} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{segment.segment}</p>
                    <p className="text-sm text-gray-600">{segment.count} customers</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(segment.averageValue)}</p>
                    <p className="text-sm text-gray-600">{formatPercentage(segment.percentage)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.orderStatusDistribution.map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(status.status)}`}>
                      {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-600">{status.count} orders</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(status.value)}</p>
                    <p className="text-sm text-gray-600">{formatPercentage(status.percentage)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
            <Link
              href="/ceo/products"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all →
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analyticsData.productPerformance.map((product, index) => (
              <div key={product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{product.averageRating.toFixed(1)}</span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{product.totalSold} sold</p>
                  <p className="text-sm text-gray-600">Stock: {product.stockLevel}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatPrice(product.revenue)}</p>
                  <p className="text-sm text-green-600">{formatPercentage(product.profitMargin)} margin</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Performance & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Brands</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.topBrands.map((brand) => (
                <div key={brand.brand} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{brand.brand}</p>
                    <p className="text-sm text-gray-600">{brand.products} products • {brand.units} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(brand.revenue)}</p>
                    <p className="text-sm text-gray-600">{formatPercentage(brand.marketShare)} market share</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.recentActivity.map((event) => (
                <div key={event.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Activity className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{event.description}</p>
                    <p className="text-sm text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
                  </div>
                  {event.value && (
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(event.value)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}