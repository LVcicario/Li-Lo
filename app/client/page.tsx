'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { createClient } from '@/lib/supabase/client'
import { Package, User, MessageCircle, Clock } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  deliveredOrders: number
  openTickets: number
}

export default function ClientDashboard() {
  const { user, profile } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    openTickets: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    const supabase = createClient()

    try {
      // Get order statistics
      const { data: orders } = await supabase
        .from('orders')
        .select('id, status, total_amount, created_at, order_number')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (orders) {
        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)).length,
          deliveredOrders: orders.filter(o => o.status === 'delivered').length,
          openTickets: 0 // We'll load this separately
        })
        setRecentOrders(orders.slice(0, 5))
      }

      // Get support ticket count
      const { data: tickets } = await supabase
        .from('support_tickets')
        .select('id')
        .eq('user_id', user!.id)
        .in('status', ['open', 'in_progress'])

      if (tickets) {
        setStats(prev => ({ ...prev, openTickets: tickets.length }))
      }
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
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'shipped': return 'text-blue-600 bg-blue-100'
      case 'processing': return 'text-yellow-600 bg-yellow-100'
      case 'confirmed': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.first_name || 'Customer'}
        </h1>
        <p className="text-gray-600">
          Here's an overview of your account and recent activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{stats.deliveredOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.openTickets}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link
              href="/client/orders"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all orders
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/client/orders/${order.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No orders yet</p>
              <Link
                href="/sneakers"
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Start shopping
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/client/profile"
          className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center">
            <User className="w-8 h-8 text-gray-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Profile</h3>
              <p className="text-sm text-gray-600">Manage your personal information</p>
            </div>
          </div>
        </Link>

        <Link
          href="/client/support"
          className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 text-gray-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Support</h3>
              <p className="text-sm text-gray-600">Get help with your orders</p>
            </div>
          </div>
        </Link>

        <Link
          href="/sneakers"
          className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center">
            <Package className="w-8 h-8 text-gray-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Shop Sneakers</h3>
              <p className="text-sm text-gray-600">Discover new collections</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}