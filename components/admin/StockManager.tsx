'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, Package, AlertTriangle, Check } from 'lucide-react'
import { useProductStock } from '@/hooks/useProducts'

interface StockManagerProps {
  productId: string
  productName: string
}

export function StockManager({ productId, productName }: StockManagerProps) {
  const { stockData, loading, updateStock, refetch } = useProductStock(productId)
  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [action, setAction] = useState<'add' | 'remove' | 'set'>('add')
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleStockUpdate = async () => {
    if (!selectedVariant || !quantity) {
      setMessage({ text: 'Please select a variant and enter quantity', type: 'error' })
      return
    }

    try {
      setUpdating(true)
      const result = await updateStock(selectedVariant, action, quantity)
      setMessage({
        text: `Stock updated: ${result.oldStock} → ${result.newStock} (${result.change > 0 ? '+' : ''}${result.change})`,
        type: 'success'
      })
      setQuantity(1)
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to update stock', type: 'error' })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!stockData) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-400">No stock data available</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-accent" />
        <h3 className="text-xl font-bold">{productName} - Stock Management</h3>
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-accent">{stockData.totalStock}</div>
          <div className="text-sm text-gray-400">Total Stock</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{stockData.availableSizes.length}</div>
          <div className="text-sm text-gray-400">Available Sizes</div>
        </div>
      </div>

      {/* Variants Table */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4">Stock by Size</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-3 text-gray-400 font-mono text-xs">SIZE</th>
                <th className="pb-3 text-gray-400 font-mono text-xs">STOCK</th>
                <th className="pb-3 text-gray-400 font-mono text-xs">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {stockData.variants?.map((variant: any) => (
                <tr key={variant.id} className="border-b border-gray-800">
                  <td className="py-3 font-mono">{variant.size}</td>
                  <td className="py-3">
                    <span className={`font-bold ${
                      variant.stock_quantity > 5 ? 'text-green-400' :
                      variant.stock_quantity > 0 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {variant.stock_quantity}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-mono ${
                      variant.stock_quantity > 5
                        ? 'bg-green-500/20 text-green-400'
                        : variant.stock_quantity > 0
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {variant.stock_quantity > 5 ? 'IN STOCK' :
                       variant.stock_quantity > 0 ? 'LOW STOCK' : 'OUT OF STOCK'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Update Form */}
      <div className="border-t border-gray-800 pt-6">
        <h4 className="text-lg font-semibold mb-4">Update Stock</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Size Selection */}
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">SIZE</label>
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-accent focus:outline-none"
            >
              <option value="">Select Size</option>
              {stockData.variants?.map((variant: any) => (
                <option key={variant.id} value={variant.id}>
                  Size {variant.size} (Stock: {variant.stock_quantity})
                </option>
              ))}
            </select>
          </div>

          {/* Action Selection */}
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">ACTION</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as 'add' | 'remove' | 'set')}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-accent focus:outline-none"
            >
              <option value="add">Add Stock</option>
              <option value="remove">Remove Stock</option>
              <option value="set">Set Stock</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">QUANTITY</label>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-accent focus:outline-none"
              placeholder="Enter quantity"
            />
          </div>

          {/* Update Button */}
          <div className="flex items-end">
            <motion.button
              onClick={handleStockUpdate}
              disabled={updating || !selectedVariant || !quantity}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full px-4 py-2 rounded font-mono text-sm tracking-wider transition-all ${
                updating || !selectedVariant || !quantity
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : action === 'add'
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : action === 'remove'
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-accent hover:bg-yellow-500 text-black'
              }`}
            >
              {updating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  UPDATING...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  {action === 'add' && <Plus className="w-4 h-4" />}
                  {action === 'remove' && <Minus className="w-4 h-4" />}
                  {action === 'set' && <Package className="w-4 h-4" />}
                  {action.toUpperCase()} STOCK
                </div>
              )}
            </motion.button>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {message.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span className="font-mono text-sm">{message.text}</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}