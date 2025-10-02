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
  const { user, profile, signOut } = useAuthStore()
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {profile?.first_name || 'Sneakerhead'}!
          </h1>
          <p className="text-gray-400">
            Here's an overview of your account and recent activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Pending Orders</p>
                <p className="text-2xl font-bold text-white">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Delivered</p>
                <p className="text-2xl font-bold text-white">{stats.deliveredOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center">
              <MessageCircle className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Open Tickets</p>
                <p className="text-2xl font-bold text-white">{stats.openTickets}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 mb-8">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
              <Link
                href="/client/orders"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                View all orders →
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length > 0 ? (
              <table className="w-full">
                <thead className="bg-black">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Order Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/client/orders/${order.id}`}
                          className="text-sm font-medium text-white hover:text-gray-300"
                        >
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                          order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' :
                          order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-gray-500/20 text-gray-500'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No orders yet</p>
                <Link
                  href="/sneakers"
                  className="inline-flex items-center px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Start shopping →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/client/profile"
            className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <User className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">Update Profile</h3>
                <p className="text-sm text-gray-400">Manage your personal information</p>
              </div>
            </div>
          </Link>

          <Link
            href="/client/support"
            className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <MessageCircle className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">Contact Support</h3>
                <p className="text-sm text-gray-400">Get help with your orders</p>
              </div>
            </div>
          </Link>

          <Link
            href="/sneakers"
            className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <Package className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">Shop Sneakers</h3>
                <p className="text-sm text-gray-400">Discover new collections</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}