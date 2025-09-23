'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { createClient } from '@/lib/supabase/client'
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  Search,
  Filter,
  Edit,
  Eye,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  Download
} from 'lucide-react'
import Link from 'next/link'

interface InventoryItem {
  id: string
  product_id: string
  product_name: string
  brand_name: string
  sku: string
  size: string
  stock_quantity: number
  reserved_quantity: number
  available_quantity: number
  price_adjustment: number
  base_price: number
  final_price: number
  last_updated: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
}

interface StockMovement {
  id: string
  variant_id: string
  movement_type: string
  quantity: number
  notes: string
  performed_by_name: string
  created_at: string
}

export default function AdminInventory() {
  const { user } = useAuthStore()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([])
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showStockModal, setShowStockModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [stockAdjustment, setStockAdjustment] = useState({
    quantity: 0,
    type: 'inbound' as 'inbound' | 'outbound' | 'adjustment',
    notes: ''
  })

  useEffect(() => {
    if (user) {
      loadInventoryData()
      loadStockMovements()
    }
  }, [user])

  useEffect(() => {
    filterAndSortInventory()
  }, [inventory, searchTerm, statusFilter, sortBy])

  const loadInventoryData = async () => {
    const supabase = createClient()

    try {
      const { data } = await supabase
        .from('product_variants')
        .select(`
          id,
          sku,
          size,
          stock_quantity,
          reserved_quantity,
          price_adjustment,
          updated_at,
          product:products (
            id,
            name,
            base_price,
            brand:brands (
              name
            )
          )
        `)
        .eq('is_active', true)
        .order('stock_quantity', { ascending: true })

      if (data) {
        const formatted = data.map(item => {
          const available = item.stock_quantity - item.reserved_quantity
          const finalPrice = (item.product as any).base_price + (item.price_adjustment || 0)

          let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock'
          if (item.stock_quantity === 0) status = 'out_of_stock'
          else if (item.stock_quantity < 10) status = 'low_stock'

          return {
            id: item.id,
            product_id: (item.product as any).id,
            product_name: (item.product as any).name,
            brand_name: (item.product as any).brand.name,
            sku: item.sku,
            size: item.size,
            stock_quantity: item.stock_quantity,
            reserved_quantity: item.reserved_quantity,
            available_quantity: available,
            price_adjustment: item.price_adjustment || 0,
            base_price: (item.product as any).base_price,
            final_price: finalPrice,
            last_updated: item.updated_at,
            status
          }
        })
        setInventory(formatted)
      }
    } catch (error) {
      console.error('Error loading inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStockMovements = async () => {
    const supabase = createClient()

    try {
      const { data } = await supabase
        .from('stock_movements')
        .select(`
          id,
          variant_id,
          movement_type,
          quantity,
          notes,
          created_at,
          performed_by:profiles (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (data) {
        const formatted = data.map(movement => ({
          ...movement,
          performed_by_name: movement.performed_by
            ? `${(movement.performed_by as any).first_name || ''} ${(movement.performed_by as any).last_name || ''}`.trim() || (movement.performed_by as any).email
            : 'System'
        }))
        setStockMovements(formatted)
      }
    } catch (error) {
      console.error('Error loading stock movements:', error)
    }
  }

  const filterAndSortInventory = () => {
    let filtered = inventory

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.product_name.localeCompare(b.product_name)
        case 'stock':
          return a.stock_quantity - b.stock_quantity
        case 'brand':
          return a.brand_name.localeCompare(b.brand_name)
        case 'updated':
          return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
        default:
          return 0
      }
    })

    setFilteredInventory(filtered)
  }

  const updateStock = async () => {
    if (!selectedItem) return

    const supabase = createClient()

    try {
      let newQuantity = selectedItem.stock_quantity
      let movementQuantity = stockAdjustment.quantity

      if (stockAdjustment.type === 'inbound') {
        newQuantity += stockAdjustment.quantity
      } else if (stockAdjustment.type === 'outbound') {
        newQuantity -= stockAdjustment.quantity
        movementQuantity = -stockAdjustment.quantity
      } else {
        // adjustment - can be positive or negative
        newQuantity = stockAdjustment.quantity
        movementQuantity = stockAdjustment.quantity - selectedItem.stock_quantity
      }

      // Update stock quantity
      const { error: updateError } = await supabase
        .from('product_variants')
        .update({
          stock_quantity: Math.max(0, newQuantity),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedItem.id)

      if (updateError) throw updateError

      // Record stock movement
      const { error: movementError } = await supabase
        .from('stock_movements')
        .insert({
          variant_id: selectedItem.id,
          movement_type: stockAdjustment.type,
          quantity: movementQuantity,
          notes: stockAdjustment.notes,
          performed_by: user!.id
        })

      if (movementError) throw movementError

      // Refresh data
      loadInventoryData()
      loadStockMovements()
      setShowStockModal(false)
      setSelectedItem(null)
      setStockAdjustment({ quantity: 0, type: 'inbound', notes: '' })
    } catch (error) {
      console.error('Error updating stock:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'out_of_stock':
        return 'Out of Stock'
      case 'low_stock':
        return 'Low Stock'
      default:
        return 'In Stock'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage stock levels and track inventory movements</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadInventoryData}
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {inventory.filter(i => i.status === 'low_stock').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingDown className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {inventory.filter(i => i.status === 'out_of_stock').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(inventory.reduce((sum, item) => sum + (item.stock_quantity * item.final_price), 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products, brands, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="stock">Sort by Stock Level</option>
              <option value="brand">Sort by Brand</option>
              <option value="updated">Sort by Last Updated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                      <div className="text-sm text-gray-500">{item.brand_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{item.stock_quantity}</span>
                      {item.reserved_quantity > 0 && (
                        <span className="text-gray-500 ml-1">({item.reserved_quantity} reserved)</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.available_quantity} available
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(item.final_price)}
                    {item.price_adjustment !== 0 && (
                      <div className="text-xs text-gray-500">
                        {item.price_adjustment > 0 ? '+' : ''}{formatPrice(item.price_adjustment)} adj
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item)
                          setShowStockModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/products/${item.product_id}`}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No products have been added to inventory yet'}
            </p>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {showStockModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Adjust Stock: {selectedItem.product_name} (Size {selectedItem.size})
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock: {selectedItem.stock_quantity}
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjustment Type
                </label>
                <select
                  value={stockAdjustment.type}
                  onChange={(e) => setStockAdjustment({ ...stockAdjustment, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="inbound">Stock In (+)</option>
                  <option value="outbound">Stock Out (-)</option>
                  <option value="adjustment">Set Exact Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {stockAdjustment.type === 'adjustment' ? 'New Stock Level' : 'Quantity'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockAdjustment.quantity}
                  onChange={(e) => setStockAdjustment({ ...stockAdjustment, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={stockAdjustment.notes}
                  onChange={(e) => setStockAdjustment({ ...stockAdjustment, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Reason for adjustment..."
                />
              </div>

              {stockAdjustment.type !== 'adjustment' && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {stockAdjustment.type === 'inbound'
                    ? `New stock level will be: ${selectedItem.stock_quantity + stockAdjustment.quantity}`
                    : `New stock level will be: ${Math.max(0, selectedItem.stock_quantity - stockAdjustment.quantity)}`
                  }
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowStockModal(false)
                  setSelectedItem(null)
                  setStockAdjustment({ quantity: 0, type: 'inbound', notes: '' })
                }}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={updateStock}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Stock Movements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Stock Movements</h3>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {stockMovements.slice(0, 10).map((movement) => (
              <div key={movement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      movement.movement_type === 'inbound' ? 'bg-green-100' :
                      movement.movement_type === 'outbound' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      {movement.movement_type === 'inbound' ? <Plus className="w-4 h-4 text-green-600" /> :
                       movement.movement_type === 'outbound' ? <Minus className="w-4 h-4 text-red-600" /> :
                       <RefreshCcw className="w-4 h-4 text-yellow-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {movement.movement_type.charAt(0).toUpperCase() + movement.movement_type.slice(1)}
                        <span className="ml-2 text-gray-600">
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {movement.notes || 'No notes'} • by {movement.performed_by_name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(movement.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}

            {stockMovements.length === 0 && (
              <div className="text-center py-8">
                <RefreshCcw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No stock movements recorded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}