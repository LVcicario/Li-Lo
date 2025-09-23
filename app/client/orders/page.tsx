'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { createClient } from '@/lib/supabase/client'
import { Package, Eye, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  total_amount: number
  created_at: string
  shipped_at?: string
  delivered_at?: string
  tracking_number?: string
  items: OrderItem[]
}

interface OrderItem {
  id: string
  product_name: string
  size: string
  quantity: number
  unit_price: number
  total_price: number
}

export default function ClientOrders() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user])

  const loadOrders = async () => {
    const supabase = createClient()

    try {
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          payment_status,
          total_amount,
          created_at,
          shipped_at,
          delivered_at,
          tracking_number,
          order_items (
            id,
            product_name,
            size,
            quantity,
            unit_price,
            total_price
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (ordersData) {
        const formattedOrders = ordersData.map(order => ({
          ...order,
          items: order.order_items || []
        }))
        setOrders(formattedOrders)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-600" />
      case 'processing':
        return <Package className="w-5 h-5 text-yellow-600" />
      case 'confirmed':
        return <Clock className="w-5 h-5 text-purple-600" />
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100 border-green-200'
      case 'shipped': return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'processing': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'confirmed': return 'text-purple-600 bg-purple-100 border-purple-200'
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    if (filter === 'active') return ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status)
    if (filter === 'delivered') return order.status === 'delivered'
    return true
  })

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
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        {['all', 'active', 'delivered'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === filterOption
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.order_number}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Ordered on {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-2 text-sm font-medium">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(order.total_amount)}
                    </p>
                    {order.tracking_number && (
                      <p className="text-sm text-gray-600">
                        Tracking: {order.tracking_number}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} • Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">
                        {formatPrice(item.total_price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Actions */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {order.shipped_at && (
                      <p className="text-sm text-gray-600">
                        Shipped: {new Date(order.shipped_at).toLocaleDateString()}
                      </p>
                    )}
                    {order.delivered_at && (
                      <p className="text-sm text-gray-600">
                        Delivered: {new Date(order.delivered_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/client/orders/${order.id}`}
                      className="inline-flex items-center px-3 py-1 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Link>
                    {order.status === 'delivered' && (
                      <button className="inline-flex items-center px-3 py-1 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? "You haven't placed any orders yet."
                : `No ${filter} orders found.`}
            </p>
            <Link
              href="/sneakers"
              className="inline-flex items-center px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}