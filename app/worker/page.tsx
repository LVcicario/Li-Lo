'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Plus, Minus, Edit, Trash2, Search, Filter, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  base_price: number
  stock: number
  category: string
  brand: string
  image_url: string
}

export default function WorkerDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [editingStock, setEditingStock] = useState<string | null>(null)
  const [tempStock, setTempStock] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name')

      if (!error && data) {
        setProducts(data.map((p: any) => ({
          id: p.id,
          name: p.name,
          base_price: p.base_price,
          stock: p.stock_quantity || 0,
          category: p.category_type || 'standard',
          brand: p.brand_id || 'Unknown',
          image_url: p.primary_image_url
        })))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStock = async (productId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', productId)

      if (!error) {
        setProducts(prev => prev.map(p =>
          p.id === productId ? { ...p, stock: newStock } : p
        ))
        setEditingStock(null)
      }
    } catch (error) {
      console.error('Error updating stock:', error)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const lowStockCount = products.filter(p => p.stock < 5).length
  const outOfStockCount = products.filter(p => p.stock === 0).length

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Worker Dashboard</h1>
          <p className="text-gray-400">Inventory Management System</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 p-6 rounded-lg"
          >
            <Package className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-gray-400 text-sm">Total Products</p>
            <p className="text-3xl font-bold">{products.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 p-6 rounded-lg"
          >
            <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-gray-400 text-sm">Total Stock</p>
            <p className="text-3xl font-bold">{totalStock}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-yellow-800 p-6 rounded-lg"
          >
            <Package className="w-8 h-8 text-yellow-500 mb-2" />
            <p className="text-gray-400 text-sm">Low Stock</p>
            <p className="text-3xl font-bold text-yellow-500">{lowStockCount}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 border border-red-800 p-6 rounded-lg"
          >
            <Package className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-gray-400 text-sm">Out of Stock</p>
            <p className="text-3xl font-bold text-red-500">{outOfStockCount}</p>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-white transition-colors"
          >
            <option value="all">All Categories</option>
            <option value="standard">Standard</option>
            <option value="limited">Limited Edition</option>
            <option value="exclusive">Exclusive</option>
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-black border-b border-gray-800">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">Product</th>
                <th className="text-left px-6 py-4 font-semibold">Category</th>
                <th className="text-left px-6 py-4 font-semibold">Price</th>
                <th className="text-left px-6 py-4 font-semibold">Stock</th>
                <th className="text-left px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg overflow-hidden">
                          {product.image_url && (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.category === 'exclusive' ? 'bg-purple-900 text-purple-300' :
                        product.category === 'limited' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">€{product.base_price}</td>
                    <td className="px-6 py-4">
                      {editingStock === product.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const newStock = Math.max(0, (tempStock[product.id] || product.stock) - 1)
                              setTempStock({ ...tempStock, [product.id]: newStock })
                            }}
                            className="p-1 hover:bg-gray-700 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={tempStock[product.id] ?? product.stock}
                            onChange={(e) => setTempStock({ ...tempStock, [product.id]: parseInt(e.target.value) || 0 })}
                            className="w-16 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-center"
                            min="0"
                          />
                          <button
                            onClick={() => {
                              const newStock = (tempStock[product.id] || product.stock) + 1
                              setTempStock({ ...tempStock, [product.id]: newStock })
                            }}
                            className="p-1 hover:bg-gray-700 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className={`font-semibold ${
                          product.stock === 0 ? 'text-red-500' :
                          product.stock < 5 ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>
                          {product.stock}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingStock === product.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              updateStock(product.id, tempStock[product.id] ?? product.stock)
                            }}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingStock(null)
                              setTempStock({})
                            }}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingStock(product.id)
                            setTempStock({ [product.id]: product.stock })
                          }}
                          className="p-2 hover:bg-gray-700 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}