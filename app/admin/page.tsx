'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { createClient } from '@/lib/supabase/client'
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  lowStockProducts: number
  openTickets: number
}

interface RecentOrder {
  id: string
  order_number: string
  customer_email: string
  status: string
  total_amount: number
  created_at: string
}

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    openTickets: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    const supabase = createClient()

    try {
      // Get products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // Get orders data
      const { data: orders, count: ordersCount } = await supabase
        .from('orders')
        .select('id, status, total_amount, customer_email, order_number, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })

      // Get recent orders
      const recentOrdersData = orders?.slice(0, 5) || []

      // Get low stock count
      const { count: lowStockCount } = await supabase
        .from('product_variants')
        .select('*', { count: 'exact', head: true })
        .lt('stock_quantity', 10)
        .eq('is_active', true)

      // Get support tickets count
      const { count: ticketsCount } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true })
        .in('status', ['open', 'in_progress'])

      // Calculate stats
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
      const pendingOrders = orders?.filter(o =>
        ['pending', 'confirmed', 'processing'].includes(o.status)
      ).length || 0

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        pendingOrders,
        totalRevenue,
        lowStockProducts: lowStockCount || 0,
        openTickets: ticketsCount || 0
      })

      setRecentOrders(recentOrdersData)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(stats.lowStockProducts > 0 || stats.openTickets > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.lowStockProducts > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">Low Stock Alert</h3>
                  <p className="text-yellow-700">
                    {stats.lowStockProducts} products are running low on stock
                  </p>
                  <Link
                    href="/admin/inventory"
                    className="text-yellow-600 hover:text-yellow-800 font-medium text-sm mt-1 inline-block"
                  >
                    View inventory →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {stats.openTickets > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center">
                <Users className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">Support Tickets</h3>
                  <p className="text-blue-700">
                    {stats.openTickets} tickets require your attention
                  </p>
                  <Link
                    href="/admin/support"
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-1 inline-block"
                  >
                    View tickets →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all →
            </Link>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {recentOrders.length > 0 ? recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900">{order.order_number}</p>
                      <p className="text-sm text-gray-600">{order.customer_email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatPrice(order.total_amount)}</p>
                  <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <Eye className="w-4 h-4" />
                </Link>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Manage Products</h3>
              <p className="text-gray-600">Add, edit, and organize products</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/drops"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Drop Timers</h3>
              <p className="text-gray-600">Schedule product releases</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/support"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Support Center</h3>
              <p className="text-gray-600">Manage customer tickets</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}