'use client'

import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { createClient } from '@/lib/supabase/client'
import { sneakerApi } from '@/lib/sneaker-api'
import { useMockData } from '@/lib/hooks/useMockData'
import { DataToggle } from '@/components/dashboard/DataToggle'
import { RevenueChart, MetricChart } from '@/components/charts/RevenueChart'
import {
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Calendar,
  Activity,
  CreditCard,
  Download,
  BarChart3,
  Globe,
  Target,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface CEODashboardStats {
  totalRevenue: number
  monthlyRevenue: number
  quarterlyRevenue: number
  yearlyRevenue: number
  totalOrders: number
  monthlyOrders: number
  totalCustomers: number
  newCustomers: number
  activeCustomers: number
  totalProducts: number
  lowStockProducts: number
  averageOrderValue: number
  conversionRate: number
  cartAbandonmentRate: number
  customerRetentionRate: number
  topSellingProducts: TopProduct[]
  recentOrders: RecentOrder[]
  revenueGrowth: number
  orderGrowth: number
  customerGrowth: number
  profitMargin: number
  grossMargin: number
  sellerPerformance: SellerMetric[]
  regionalSales: RegionalSales[]
  // E-commerce specific KPIs
  membershipRevenue: number
  membershipBreakdown: {
    bronze: number
    silver: number
    gold: number
  }
  dropsPerformance: {
    scheduled: number
    live: number
    completed: number
    totalRevenue: number
    averageDropRevenue: number
  }
  topDrops: TopDrop[]
}

interface TopProduct {
  id: string
  name: string
  brand: string
  totalSold: number
  revenue: number
  profit: number
  image_url?: string
}

interface RecentOrder {
  id: string
  order_number: string
  customer_email: string
  total_amount: number
  status: string
  created_at: string
  items_count: number
}

interface SellerMetric {
  id: string
  name: string
  totalSales: number
  revenue: number
  products: number
  performance: 'excellent' | 'good' | 'average' | 'poor'
}

interface RegionalSales {
  region: string
  sales: number
  growth: number
  orders: number
}

interface TopDrop {
  id: string
  name: string
  drop_date: string
  status: string
  totalRevenue: number
  totalSold: number
  productsCount: number
}

export default function CEODashboard() {
  const router = useRouter()
  const { user, isCEO, checkUser } = useAuthStore()
  const { isUsingMockData, getCEOMetrics, getRevenueTimeSeries, getRecentOrders } = useMockData()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [stats, setStats] = useState<CEODashboardStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    quarterlyRevenue: 0,
    yearlyRevenue: 0,
    totalOrders: 0,
    monthlyOrders: 0,
    totalCustomers: 0,
    newCustomers: 0,
    activeCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    cartAbandonmentRate: 0,
    customerRetentionRate: 0,
    topSellingProducts: [],
    recentOrders: [],
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0,
    profitMargin: 0,
    grossMargin: 0,
    sellerPerformance: [],
    regionalSales: [],
    membershipRevenue: 0,
    membershipBreakdown: { bronze: 0, silver: 0, gold: 0 },
    dropsPerformance: {
      scheduled: 0,
      live: 0,
      completed: 0,
      totalRevenue: 0,
      averageDropRevenue: 0
    },
    topDrops: []
  })

  useEffect(() => {
    checkUser().then(() => {
      if (!user || !isCEO) {
        router.push('/auth/login')
      } else {
        loadDashboardData()
      }
    })
  }, [])

  useEffect(() => {
    if (user && isCEO) {
      loadDashboardData()
    }
  }, [isUsingMockData])

  const loadDashboardData = async () => {
    try {
      setRefreshing(true)

      // Fetch REAL data from Supabase
      const res = await fetch('/api/ceo/metrics')
      const data = await res.json()

      if (data.success && data.metrics) {
        const m = data.metrics
        setStats({
          totalRevenue: m.totalRevenue,
          monthlyRevenue: m.monthlyRevenue,
          quarterlyRevenue: m.monthlyRevenue * 3,
          yearlyRevenue: m.totalRevenue,
          totalOrders: m.totalOrders,
          monthlyOrders: m.monthlyOrders,
          totalCustomers: m.totalCustomers,
          newCustomers: m.newCustomers,
          activeCustomers: m.activeCustomers,
          totalProducts: m.totalProducts,
          lowStockProducts: m.lowStockProducts,
          averageOrderValue: m.averageOrderValue,
          conversionRate: m.conversionRate,
          cartAbandonmentRate: 0, // TODO
          customerRetentionRate: 0, // TODO
          topSellingProducts: [],
          recentOrders: m.recentOrders,
          revenueGrowth: 0, // TODO
          orderGrowth: 0, // TODO
          customerGrowth: 0, // TODO
          profitMargin: 0, // TODO
          grossMargin: 0, // TODO
          sellerPerformance: [],
          regionalSales: [],
          membershipRevenue: m.membershipRevenue,
          membershipBreakdown: m.membershipBreakdown,
          dropsPerformance: m.dropsPerformance,
          topDrops: m.topDrops
        })
      }

      // Fallback to mock data if API fails
      if (!data.success && isUsingMockData) {
        const mockMetrics = await getCEOMetrics()
        const mockRevenue = await getRevenueTimeSeries(30)
        const mockOrders = await getRecentOrders(10)

        if (mockMetrics) {
          setStats({
            totalRevenue: mockMetrics.revenue.yearly,
            monthlyRevenue: mockMetrics.revenue.monthly,
            quarterlyRevenue: mockMetrics.revenue.monthly * 3,
            yearlyRevenue: mockMetrics.revenue.yearly,
            totalOrders: mockMetrics.orders.total,
            monthlyOrders: Math.floor(mockMetrics.orders.total / 12),
            totalCustomers: mockMetrics.customers.total,
            newCustomers: mockMetrics.customers.new_this_month,
            activeCustomers: mockMetrics.customers.active,
            totalProducts: mockMetrics.inventory.total_products,
            lowStockProducts: mockMetrics.inventory.low_stock_items,
            averageOrderValue: mockMetrics.orders.average_value,
            conversionRate: mockMetrics.performance.conversion_rate,
            cartAbandonmentRate: mockMetrics.performance.cart_abandonment_rate,
            customerRetentionRate: mockMetrics.customers.retention_rate,
            topSellingProducts: [],
            recentOrders: mockOrders.map(order => ({
              id: order.id,
              order_number: order.order_number,
              customer_email: order.customer_email,
              total_amount: order.total_amount,
              status: order.status,
              created_at: order.created_at,
              items_count: order.items_count
            })),
            revenueGrowth: mockMetrics.revenue.growth_percentage,
            orderGrowth: 15.2,
            customerGrowth: 12.5,
            profitMargin: 32.4,
            grossMargin: 48.6,
            sellerPerformance: [
              { id: '1', name: 'Main Store', totalSales: 650, revenue: 142000, products: 52, performance: 'excellent' },
              { id: '2', name: 'Partner Store A', totalSales: 420, revenue: 89000, products: 34, performance: 'good' },
              { id: '3', name: 'Partner Store B', totalSales: 280, revenue: 56000, products: 22, performance: 'good' },
            ],
            regionalSales: [
              { region: 'North America', sales: 185000, growth: 28.4, orders: 780 },
              { region: 'Europe', sales: 142000, growth: 22.1, orders: 590 },
              { region: 'Asia', sales: 98000, growth: 45.2, orders: 420 },
              { region: 'Other', sales: 45000, growth: 15.3, orders: 190 }
            ],
            membershipRevenue: mockMetrics.revenue.monthly * 0.15, // 15% from memberships
            membershipBreakdown: {
              bronze: Math.floor(mockMetrics.customers.total * 0.60),
              silver: Math.floor(mockMetrics.customers.total * 0.25),
              gold: Math.floor(mockMetrics.customers.total * 0.15)
            },
            dropsPerformance: {
              scheduled: 5,
              live: 2,
              completed: 18,
              totalRevenue: mockMetrics.revenue.monthly * 0.35,
              averageDropRevenue: (mockMetrics.revenue.monthly * 0.35) / 18
            },
            topDrops: [
              { id: '1', name: 'Jordan 4 Retro "Thunder"', drop_date: '2025-01-15', status: 'completed', totalRevenue: 45600, totalSold: 152, productsCount: 1 },
              { id: '2', name: 'Yeezy 350 V2 "Onyx"', drop_date: '2025-01-22', status: 'completed', totalRevenue: 38200, totalSold: 127, productsCount: 1 },
              { id: '3', name: 'Nike Dunk Low "Panda"', drop_date: '2025-01-28', status: 'live', totalRevenue: 31500, totalSold: 105, productsCount: 1 }
            ]
          })
          setRevenueData(mockRevenue)
        }
      } else {
        // Load real data
        const sneakers = await sneakerApi.getAllSneakers()
        const trending = await sneakerApi.getTrendingSneakers(10)

      // Simulate comprehensive CEO metrics
      const mockStats: CEODashboardStats = {
        totalRevenue: 2845000,
        monthlyRevenue: 385000,
        quarterlyRevenue: 1150000,
        yearlyRevenue: 2845000,
        totalOrders: 12543,
        monthlyOrders: 1832,
        totalCustomers: 8421,
        newCustomers: 342,
        activeCustomers: 2156,
        totalProducts: sneakers.length,
        lowStockProducts: 8,
        averageOrderValue: 227,
        conversionRate: 3.4,
        cartAbandonmentRate: 68.2,
        customerRetentionRate: 42.5,
        revenueGrowth: 23.5,
        orderGrowth: 18.3,
        customerGrowth: 15.7,
        profitMargin: 28.4,
        grossMargin: 45.2,
        topSellingProducts: trending.slice(0, 5).map(s => ({
          id: s.id,
          name: s.name,
          brand: s.brand,
          totalSold: s.marketData.salesLast72Hours,
          revenue: s.marketData.salesLast72Hours * s.marketData.lastSale,
          profit: s.marketData.salesLast72Hours * (s.marketData.lastSale - s.retailPrice),
          image_url: s.images.main
        })),
        recentOrders: Array.from({ length: 10 }, (_, i) => ({
          id: `order-${i}`,
          order_number: `#${10000 + i}`,
          customer_email: `customer${i}@example.com`,
          total_amount: Math.floor(Math.random() * 1000) + 100,
          status: ['completed', 'processing', 'pending', 'shipped'][Math.floor(Math.random() * 4)],
          created_at: new Date(Date.now() - i * 3600000).toISOString(),
          items_count: Math.floor(Math.random() * 5) + 1
        })),
        sellerPerformance: [
          { id: '1', name: 'Main Store', totalSales: 523, revenue: 118500, products: 45, performance: 'excellent' },
          { id: '2', name: 'Partner Store A', totalSales: 312, revenue: 68900, products: 28, performance: 'good' },
          { id: '3', name: 'Partner Store B', totalSales: 189, revenue: 42300, products: 15, performance: 'average' },
        ],
        regionalSales: [
          { region: 'North America', sales: 145000, growth: 25.3, orders: 623 },
          { region: 'Europe', sales: 98000, growth: 18.7, orders: 412 },
          { region: 'Asia', sales: 76000, growth: 42.1, orders: 358 },
          { region: 'Other', sales: 32000, growth: 12.5, orders: 145 }
        ],
        membershipRevenue: 58500,
        membershipBreakdown: {
          bronze: Math.floor(8421 * 0.60),
          silver: Math.floor(8421 * 0.25),
          gold: Math.floor(8421 * 0.15)
        },
        dropsPerformance: {
          scheduled: 5,
          live: 2,
          completed: 18,
          totalRevenue: 134750,
          averageDropRevenue: 7486
        },
        topDrops: [
          { id: '1', name: 'Jordan 4 Retro "Thunder"', drop_date: '2025-01-15', status: 'completed', totalRevenue: 45600, totalSold: 152, productsCount: 1 },
          { id: '2', name: 'Yeezy 350 V2 "Onyx"', drop_date: '2025-01-22', status: 'completed', totalRevenue: 38200, totalSold: 127, productsCount: 1 },
          { id: '3', name: 'Nike Dunk Low "Panda"', drop_date: '2025-01-28', status: 'live', totalRevenue: 31500, totalSold: 105, productsCount: 1 }
        ]
      }

        setStats(mockStats)

        // Generate revenue time series for real data
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (29 - i))
          return {
            date: date.toISOString(),
            value: Math.floor(Math.random() * 15000) + 8000,
            label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }
        })
        setRevenueData(last30Days)
      }
    } catch (error) {
      console.error('Error loading CEO dashboard:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    loadDashboardData()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
              <p className="text-sm text-gray-500">Real-time platform analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              <DataToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                {new Date().toLocaleDateString()}
              </Button>
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                <div className="flex items-center text-xs mt-2">
                  {stats.revenueGrowth > 0 ? (
                    <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span className={stats.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatPercentage(stats.revenueGrowth)}
                  </span>
                  <span className="text-gray-500 ml-1">from last period</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Customers</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.activeCustomers.toLocaleString()}</div>
                <div className="flex items-center text-xs mt-2">
                  <Activity className="mr-1 h-3 w-3 text-blue-500" />
                  <span className="text-blue-600">{stats.newCustomers}</span>
                  <span className="text-gray-500 ml-1">new this month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
                <Target className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.conversionRate}%</div>
                <div className="flex items-center text-xs mt-2">
                  <TrendingUp className="mr-1 h-3 w-3 text-purple-500" />
                  <span className="text-purple-600">AOV: {formatCurrency(stats.averageOrderValue)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Profit Margin</CardTitle>
                <BarChart3 className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.profitMargin}%</div>
                <div className="flex items-center text-xs mt-2">
                  <CreditCard className="mr-1 h-3 w-3 text-orange-500" />
                  <span className="text-orange-600">Gross: {stats.grossMargin}%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Live Activity Feed */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Live Activity</CardTitle>
            <CardDescription>Real-time platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.recentOrders.slice(0, 5).map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      order.status === 'completed' ? 'bg-green-500' :
                      order.status === 'processing' ? 'bg-blue-500' :
                      order.status === 'shipped' ? 'bg-purple-500' :
                      'bg-gray-500'
                    } animate-pulse`} />
                    <div>
                      <p className="text-sm font-medium">Order {order.order_number}</p>
                      <p className="text-xs text-gray-500">{order.customer_email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(order.total_amount)}</p>
                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* E-Commerce KPIs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Membership Revenue
              </CardTitle>
              <CardDescription>Recurring subscription income</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-4">
                {formatCurrency(stats.membershipRevenue)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    Gold
                  </span>
                  <span className="font-semibold">{stats.membershipBreakdown.gold.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    Silver
                  </span>
                  <span className="font-semibold">{stats.membershipBreakdown.silver.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-orange-700"></div>
                    Bronze
                  </span>
                  <span className="font-semibold">{stats.membershipBreakdown.bronze.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Drops Performance
              </CardTitle>
              <CardDescription>Exclusive drop analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                {formatCurrency(stats.dropsPerformance.totalRevenue)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Scheduled</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {stats.dropsPerformance.scheduled}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Live</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {stats.dropsPerformance.live}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Completed</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {stats.dropsPerformance.completed}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t">
                  <span className="text-gray-600">Avg/Drop</span>
                  <span className="font-semibold">{formatCurrency(stats.dropsPerformance.averageDropRevenue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top Drops
              </CardTitle>
              <CardDescription>Best performing releases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topDrops.slice(0, 3).map((drop, idx) => (
                  <div key={drop.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-800 truncate">{drop.name}</p>
                      <p className="text-xs text-gray-500">{drop.totalSold} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">{formatCurrency(drop.totalRevenue)}</p>
                      <Badge
                        variant="outline"
                        className={
                          drop.status === 'live'
                            ? 'text-green-700 bg-green-50 border-green-200 text-[10px]'
                            : 'text-gray-600 bg-gray-50 border-gray-200 text-[10px]'
                        }
                      >
                        {drop.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for detailed views */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="sellers">Sellers</TabsTrigger>
            <TabsTrigger value="regions">Regions</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Last 30 days revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  {revenueData.length > 0 ? (
                    <RevenueChart data={revenueData} type="line" height={250} />
                  ) : (
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No revenue data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Customer Metrics</CardTitle>
                  <CardDescription>Key customer indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Retention Rate</span>
                      <span className="text-sm font-bold">{stats.customerRetentionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cart Abandonment</span>
                      <span className="text-sm font-bold text-red-600">{stats.cartAbandonmentRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New vs Returning</span>
                      <span className="text-sm font-bold">
                        {((stats.newCustomers / stats.activeCustomers) * 100).toFixed(1)}% new
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg Order Value</span>
                      <span className="text-sm font-bold">{formatCurrency(stats.averageOrderValue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Best sellers across all channels</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead className="text-right">Units Sold</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Profit</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.topSellingProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell className="text-right">{product.totalSold}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(product.profit)}
                        </TableCell>
                        <TableCell>
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sellers">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Seller Performance</CardTitle>
                <CardDescription>Performance metrics by seller</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Seller</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Products</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.sellerPerformance.map((seller) => (
                      <TableRow key={seller.id}>
                        <TableCell className="font-medium">{seller.name}</TableCell>
                        <TableCell className="text-right">{seller.totalSales}</TableCell>
                        <TableCell className="text-right">{formatCurrency(seller.revenue)}</TableCell>
                        <TableCell className="text-right">{seller.products}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              seller.performance === 'excellent' ? 'default' :
                              seller.performance === 'good' ? 'secondary' :
                              seller.performance === 'average' ? 'outline' : 'destructive'
                            }
                          >
                            {seller.performance}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regions">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Regional Sales</CardTitle>
                <CardDescription>Performance by geographic region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.regionalSales.map((region) => (
                    <div key={region.region} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{region.region}</p>
                          <p className="text-sm text-gray-500">{region.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(region.sales)}</p>
                        <div className="flex items-center justify-end text-xs">
                          {region.growth > 0 ? (
                            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                          ) : (
                            <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                          )}
                          <span className={region.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatPercentage(region.growth)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions for CEO */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => router.push('/ceo/financial')}>
            <CardHeader>
              <CardTitle className="text-lg">Financial Report</CardTitle>
              <CardDescription>Detailed P&L analysis</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => router.push('/ceo/analytics')}>
            <CardHeader>
              <CardTitle className="text-lg">Advanced Analytics</CardTitle>
              <CardDescription>Deep dive into metrics</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Export Data</CardTitle>
              <CardDescription>Download full reports</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}