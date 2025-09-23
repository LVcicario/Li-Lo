'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { createClient } from '@/lib/supabase/client'
import {
  Timer,
  Plus,
  Play,
  Pause,
  Square,
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  Bell,
  Clock,
  Package,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface ProductDrop {
  id: string
  product_id: string
  product_name: string
  product_image: string
  name: string
  description: string
  drop_date: string
  early_access_date?: string
  end_date?: string
  status: 'scheduled' | 'live' | 'ended' | 'cancelled'
  is_active: boolean
  is_featured: boolean
  max_per_customer: number
  require_authentication: boolean
  enable_waitlist: boolean
  notify_users: boolean
  notification_sent: boolean
  waitlist_count: number
  created_at: string
}

export default function AdminDrops() {
  const { user } = useAuthStore()
  const [drops, setDrops] = useState<ProductDrop[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDrop, setSelectedDrop] = useState<ProductDrop | null>(null)
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      loadDrops()
      loadProducts()
    }
  }, [user])

  const loadDrops = async () => {
    const supabase = createClient()

    try {
      const { data } = await supabase
        .from('product_drops')
        .select(`
          id,
          product_id,
          name,
          description,
          drop_date,
          early_access_date,
          end_date,
          status,
          is_active,
          is_featured,
          max_per_customer,
          require_authentication,
          enable_waitlist,
          notify_users,
          notification_sent,
          created_at,
          product:products (
            name,
            product_images (
              url,
              is_primary
            )
          ),
          drop_waitlist (count)
        `)
        .order('drop_date', { ascending: true })

      if (data) {
        const formatted = data.map(drop => ({
          ...drop,
          product_name: (drop.product as any)?.name || 'Unknown Product',
          product_image: (drop.product as any)?.product_images?.find((img: any) => img.is_primary)?.url ||
                        (drop.product as any)?.product_images?.[0]?.url || '/placeholder.jpg',
          waitlist_count: (drop.drop_waitlist as any)?.[0]?.count || 0
        }))
        setDrops(formatted)
      }
    } catch (error) {
      console.error('Error loading drops:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    const supabase = createClient()

    try {
      const { data } = await supabase
        .from('products')
        .select('id, name, base_price')
        .eq('status', 'active')
        .order('name')

      if (data) {
        setProducts(data)
      }
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const updateDropStatus = async (dropId: string, newStatus: string) => {
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('product_drops')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', dropId)

      if (error) throw error

      loadDrops()
    } catch (error) {
      console.error('Error updating drop status:', error)
    }
  }

  const deleteDrop = async (dropId: string) => {
    if (!confirm('Are you sure you want to delete this drop? This action cannot be undone.')) {
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('product_drops')
        .delete()
        .eq('id', dropId)

      if (error) throw error

      loadDrops()
    } catch (error) {
      console.error('Error deleting drop:', error)
    }
  }

  const getStatusBadge = (status: string, dropDate: string) => {
    const now = new Date()
    const drop = new Date(dropDate)

    if (status === 'cancelled') {
      return 'bg-red-100 text-red-800 border-red-200'
    }

    if (status === 'ended') {
      return 'bg-gray-100 text-gray-800 border-gray-200'
    }

    if (status === 'live') {
      return 'bg-green-100 text-green-800 border-green-200'
    }

    if (status === 'scheduled') {
      if (drop > now) {
        return 'bg-blue-100 text-blue-800 border-blue-200'
      } else {
        return 'bg-yellow-100 text-yellow-800 border-yellow-200' // Should be live
      }
    }

    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusText = (status: string, dropDate: string) => {
    const now = new Date()
    const drop = new Date(dropDate)

    if (status === 'cancelled') return 'Cancelled'
    if (status === 'ended') return 'Ended'
    if (status === 'live') return 'Live'
    if (status === 'scheduled') {
      if (drop > now) return 'Scheduled'
      else return 'Ready to Go Live'
    }

    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  const getTimeUntilDrop = (dropDate: string) => {
    const now = new Date()
    const drop = new Date(dropDate)
    const diff = drop.getTime() - now.getTime()

    if (diff <= 0) return 'Drop time has passed'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  const liveDrops = drops.filter(d => d.status === 'live')
  const scheduledDrops = drops.filter(d => d.status === 'scheduled')
  const pastDrops = drops.filter(d => d.status === 'ended' || d.status === 'cancelled')

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
          <h1 className="text-2xl font-bold text-gray-900">Drop Management</h1>
          <p className="text-gray-600">Schedule and manage product drops and releases</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Drop
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Play className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Live Drops</p>
              <p className="text-2xl font-bold text-gray-900">{liveDrops.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{scheduledDrops.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Waitlist</p>
              <p className="text-2xl font-bold text-gray-900">
                {drops.reduce((sum, drop) => sum + drop.waitlist_count, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Timer className="w-8 h-8 text-gray-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Drops</p>
              <p className="text-2xl font-bold text-gray-900">{drops.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Drops Alert */}
      {liveDrops.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                {liveDrops.length} Drop{liveDrops.length > 1 ? 's' : ''} Currently Live
              </h3>
              <p className="text-green-700">
                Monitor these active drops and ensure they're running smoothly
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live Drops */}
      {liveDrops.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 text-green-600">🔴 Live Drops</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveDrops.map((drop) => (
                <DropCard
                  key={drop.id}
                  drop={drop}
                  onUpdateStatus={updateDropStatus}
                  onDelete={deleteDrop}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Drops */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">📅 Scheduled Drops</h3>
        </div>
        <div className="p-6">
          {scheduledDrops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduledDrops.map((drop) => (
                <DropCard
                  key={drop.id}
                  drop={drop}
                  onUpdateStatus={updateDropStatus}
                  onDelete={deleteDrop}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Drops</h3>
              <p className="text-gray-600 mb-4">Create your first drop to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Drop
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Past Drops */}
      {pastDrops.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">📊 Past Drops</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastDrops.slice(0, 6).map((drop) => (
                <DropCard
                  key={drop.id}
                  drop={drop}
                  onUpdateStatus={updateDropStatus}
                  onDelete={deleteDrop}
                />
              ))}
            </div>
            {pastDrops.length > 6 && (
              <div className="text-center mt-6">
                <Link
                  href="/admin/drops/history"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All Past Drops →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Drop Modal */}
      <CreateDropModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        products={products}
        onSuccess={loadDrops}
      />
    </div>
  )
}

function DropCard({
  drop,
  onUpdateStatus,
  onDelete
}: {
  drop: ProductDrop
  onUpdateStatus: (id: string, status: string) => void
  onDelete: (id: string) => void
}) {
  const getTimeUntilDrop = (dropDate: string) => {
    const now = new Date()
    const dropTime = new Date(dropDate)
    const diff = dropTime.getTime() - now.getTime()

    if (diff <= 0) return 'Drop time has passed'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800 border-green-200'
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ended': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 truncate">{drop.name}</h4>
          <p className="text-sm text-gray-600 truncate">{drop.product_name}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(drop.status)}`}>
          {drop.status.charAt(0).toUpperCase() + drop.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(drop.drop_date).toLocaleString()}
        </div>

        {drop.status === 'scheduled' && (
          <div className="flex items-center text-blue-600">
            <Clock className="w-4 h-4 mr-2" />
            {getTimeUntilDrop(drop.drop_date)}
          </div>
        )}

        {drop.waitlist_count > 0 && (
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            {drop.waitlist_count} on waitlist
          </div>
        )}
      </div>

      {drop.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{drop.description}</p>
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          {drop.status === 'scheduled' && (
            <button
              onClick={() => onUpdateStatus(drop.id, 'live')}
              className="p-1 text-green-600 hover:text-green-800"
              title="Start Drop"
            >
              <Play className="w-4 h-4" />
            </button>
          )}

          {drop.status === 'live' && (
            <button
              onClick={() => onUpdateStatus(drop.id, 'ended')}
              className="p-1 text-red-600 hover:text-red-800"
              title="End Drop"
            >
              <Square className="w-4 h-4" />
            </button>
          )}

          <Link
            href={`/admin/drops/${drop.id}`}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        <button
          onClick={() => onDelete(drop.id)}
          className="p-1 text-red-600 hover:text-red-800"
          title="Delete Drop"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function CreateDropModal({
  isOpen,
  onClose,
  products,
  onSuccess
}: {
  isOpen: boolean
  onClose: () => void
  products: any[]
  onSuccess: () => void
}) {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({
    product_id: '',
    name: '',
    description: '',
    drop_date: '',
    early_access_date: '',
    end_date: '',
    max_per_customer: 1,
    require_authentication: true,
    enable_waitlist: true,
    notify_users: true,
    is_featured: false
  })

  const createDrop = async () => {
    if (!formData.product_id || !formData.name || !formData.drop_date) {
      alert('Please fill in all required fields')
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('product_drops')
        .insert({
          ...formData,
          created_by: user!.id,
          status: 'scheduled'
        })

      if (error) throw error

      onSuccess()
      onClose()
      setFormData({
        product_id: '',
        name: '',
        description: '',
        drop_date: '',
        early_access_date: '',
        end_date: '',
        max_per_customer: 1,
        require_authentication: true,
        enable_waitlist: true,
        notify_users: true,
        is_featured: false
      })
    } catch (error) {
      console.error('Error creating drop:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Drop</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product *
            </label>
            <select
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Drop Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="e.g., Jordan 1 Midnight Release"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Special drop description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drop Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.drop_date}
                onChange={(e) => setFormData({ ...formData, drop_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Early Access Date
              </label>
              <input
                type="datetime-local"
                value={formData.early_access_date}
                onChange={(e) => setFormData({ ...formData, early_access_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Per Customer
              </label>
              <input
                type="number"
                min="1"
                value={formData.max_per_customer}
                onChange={(e) => setFormData({ ...formData, max_per_customer: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="require_auth"
                checked={formData.require_authentication}
                onChange={(e) => setFormData({ ...formData, require_authentication: e.target.checked })}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <label htmlFor="require_auth" className="ml-2 text-sm text-gray-700">
                Require Authentication
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enable_waitlist"
                checked={formData.enable_waitlist}
                onChange={(e) => setFormData({ ...formData, enable_waitlist: e.target.checked })}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <label htmlFor="enable_waitlist" className="ml-2 text-sm text-gray-700">
                Enable Waitlist
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="notify_users"
                checked={formData.notify_users}
                onChange={(e) => setFormData({ ...formData, notify_users: e.target.checked })}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <label htmlFor="notify_users" className="ml-2 text-sm text-gray-700">
                Notify Users
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700">
                Featured Drop
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={createDrop}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Create Drop
          </button>
        </div>
      </div>
    </div>
  )
}