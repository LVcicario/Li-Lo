'use client'

import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { createClient } from '@/lib/supabase/client'
import {
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

interface CEODashboardStats {
  totalRevenue: number
  monthlyRevenue: number
  totalOrders: number
  monthlyOrders: number
  totalCustomers: number
  newCustomers: number
  totalProducts: number
  lowStockProducts: number
  averageOrderValue: number
  conversionRate: number
  topSellingProducts: TopProduct[]
  recentOrders: RecentOrder[]
  revenueGrowth: number
  orderGrowth: number
  customerGrowth: number
}

interface TopProduct {
  id: string
  name: string
  brand: string
  totalSold: number
  revenue: number
  image_url?: string
}

interface RecentOrder {
  id: string
  order_number: string
  customer_email: string
  total_amount: number
  status: string
  created_at: string
}

export default function CEODashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<CEODashboardStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    monthlyOrders: 0,
    totalCustomers: 0,
    newCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    topSellingProducts: [],
    recentOrders: [],
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    const supabase = createClient()

    try {
      // Get date ranges
      const now = new Date()
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

      // Get all orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id, total_amount, status, customer_email, order_number, created_at')
        .order('created_at', { ascending: false })

      // Get current month orders
      const { data: currentMonthOrders } = await supabase
        .from('orders')
        .select('id, total_amount')
        .gte('created_at', currentMonth.toISOString())

      // Get last month orders for growth calculation
      const { data: lastMonthOrders } = await supabase
        .from('orders')
        .select('id, total_amount')
        .gte('created_at', lastMonth.toISOString())
        .lt('created_at', currentMonth.toISOString())

      // Get customers data
      const { count: totalCustomers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer')

      const { count: newCustomers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer')
        .gte('created_at', currentMonth.toISOString())

      const { count: lastMonthCustomers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer')
        .gte('created_at', lastMonth.toISOString())
        .lt('created_at', currentMonth.toISOString())

      // Get products data
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      const { count: lowStockProducts } = await supabase
        .from('product_variants')
        .select('*', { count: 'exact', head: true })
        .lt('stock_quantity', 10)
        .eq('is_active', true)

      // Get top selling products
      const { data: topProducts } = await supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          price,
          products (
            id,
            name,
            brand,
            images
          )
        `)
        .limit(1000)

      // Process top selling products
      const productSales = new Map()
      topProducts?.forEach(item => {
        const productId = item.product_id
        if (!productSales.has(productId)) {
          productSales.set(productId, {
            id: productId,
            name: (item.products as any)?.name || 'Unknown',
            brand: (item.products as any)?.brand || 'Unknown',
            image_url: (item.products as any)?.images?.[0],
            totalSold: 0,
            revenue: 0
          })
        }
        const product = productSales.get(productId)
        product.totalSold += item.quantity
        product.revenue += item.quantity * item.price
      })

      const topSellingProducts = Array.from(productSales.values())
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 5)

      // Calculate stats
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
      const monthlyRevenue = currentMonthOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
      const lastMonthRevenue = lastMonthOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

      const totalOrdersCount = orders?.length || 0
      const monthlyOrdersCount = currentMonthOrders?.length || 0
      const lastMonthOrdersCount = lastMonthOrders?.length || 0

      const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0

      // Calculate growth rates
      const revenueGrowth = lastMonthRevenue > 0
        ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0

      const orderGrowth = lastMonthOrdersCount > 0
        ? ((monthlyOrdersCount - lastMonthOrdersCount) / lastMonthOrdersCount) * 100
        : 0

      const customerGrowth = (lastMonthCustomers || 0) > 0
        ? (((newCustomers || 0) - (lastMonthCustomers || 0)) / (lastMonthCustomers || 0)) * 100
        : 0

      setStats({
        totalRevenue,
        monthlyRevenue,
        totalOrders: totalOrdersCount,
        monthlyOrders: monthlyOrdersCount,
        totalCustomers: totalCustomers || 0,
        newCustomers: newCustomers || 0,
        totalProducts: totalProducts || 0,
        lowStockProducts: lowStockProducts || 0,
        averageOrderValue,
        conversionRate: 0, // Would need to calculate based on website visits
        topSellingProducts,
        recentOrders: orders?.slice(0, 8) || [],
        revenueGrowth,
        orderGrowth,
        customerGrowth
      })

    } catch (error) {
      console.error('Error loading CEO dashboard data:', error)
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

  const formatGrowth = (growth: number) => {
    return growth >= 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? ArrowUpRight : ArrowDownRight
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">CEO Dashboard</h1>
        <p className="text-gray-600">Complete business overview and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatPrice(stats.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                {React.createElement(getGrowthIcon(stats.revenueGrowth), {
                  className: `w-4 h-4 ${getGrowthColor(stats.revenueGrowth)}`
                })}
                <span className={`text-sm font-medium ml-1 ${getGrowthColor(stats.revenueGrowth)}`}>
                  {formatGrowth(stats.revenueGrowth)}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatPrice(stats.monthlyRevenue)}</p>
              <div className="flex items-center mt-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 ml-1">This month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
              <div className="flex items-center mt-2">
                {React.createElement(getGrowthIcon(stats.orderGrowth), {
                  className: `w-4 h-4 ${getGrowthColor(stats.orderGrowth)}`
                })}
                <span className={`text-sm font-medium ml-1 ${getGrowthColor(stats.orderGrowth)}`}>
                  {formatGrowth(stats.orderGrowth)}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCustomers}</p>
              <div className="flex items-center mt-2">
                {React.createElement(getGrowthIcon(stats.customerGrowth), {
                  className: `w-4 h-4 ${getGrowthColor(stats.customerGrowth)}`
                })}
                <span className={`text-sm font-medium ml-1 ${getGrowthColor(stats.customerGrowth)}`}>
                  {formatGrowth(stats.customerGrowth)}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatPrice(stats.averageOrderValue)}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.monthlyOrders}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.newCustomers}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
              <Link
                href="/ceo/analytics"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.topSellingProducts.length > 0 ? stats.topSellingProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{product.totalSold} sold</p>
                    <p className="text-sm text-gray-500">{formatPrice(product.revenue)}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No sales data yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link
                href="/ceo/orders"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentOrders.length > 0 ? stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.order_number}</p>
                        <p className="text-sm text-gray-600">{order.customer_email}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatPrice(order.total_amount)}</p>
                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link
          href="/ceo/financial"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Financial Reports</h3>
              <p className="text-gray-600">Detailed financial analysis</p>
            </div>
          </div>
        </Link>

        <Link
          href="/ceo/analytics"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
              <p className="text-gray-600">Business intelligence</p>
            </div>
          </div>
        </Link>

        <Link
          href="/ceo/customers"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Customer Insights</h3>
              <p className="text-gray-600">Customer analytics</p>
            </div>
          </div>
        </Link>

        <Link
          href="/ceo/users"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <p className="text-gray-600">Manage system users</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}