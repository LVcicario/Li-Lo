'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { useProducts } from '@/hooks/useProducts'
import { StockManager } from '@/components/admin/StockManager'
import { Package, Search, Filter, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function StockManagementPage() {
  const { user, userRole } = useAuthStore()
  const isSeller = userRole === 'seller' || userRole === 'ceo'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  // Fetch products for stock management
  const { products, loading, error } = useProducts({
    limit: 50,
    search: searchQuery
  })

  // Redirect if not admin
  useEffect(() => {
    if (!isSeller && !loading) {
      window.location.href = '/auth/login'
    }
  }, [isSeller, loading])

  if (!isSeller) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">Admin privileges required</p>
          <Link href="/auth/login" className="bg-accent text-black px-6 py-3 rounded-lg font-mono tracking-wider hover:bg-yellow-500 transition-colors">
            LOGIN
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Package className="w-8 h-8 text-accent" />
            <div>
              <h1 className="text-4xl font-bold tracking-tighter">Stock Management</h1>
              <p className="text-gray-400 font-mono">Manage inventory levels and stock movements</p>
            </div>
          </div>

          <Link
            href="/admin"
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-mono text-sm tracking-wider transition-colors"
          >
            ← BACK TO ADMIN
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name, brand, or SKU..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Product Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Products List */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Filter className="w-5 h-5 text-accent" />
              Products ({products.length})
            </h2>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-800 rounded-lg h-16" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-400 py-8">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                <p>Error loading products: {error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <Package className="w-12 h-12 mx-auto mb-4" />
                <p>No products found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedProduct === product.id
                        ? 'bg-accent/20 border-accent text-white'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        <p className="text-sm text-gray-400">{product.brand?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm">
                          Stock: <span className="font-bold">{product.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0}</span>
                        </p>
                        <p className="text-xs text-gray-400">
                          ${parseFloat(String(product.base_price || 0)).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stock Manager */}
          <div>
            {selectedProduct ? (
              <StockManager
                productId={selectedProduct}
                productName={products.find(p => p.id === selectedProduct)?.name || 'Unknown Product'}
              />
            ) : (
              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Select a Product</h3>
                <p className="text-gray-400">Choose a product from the list to manage its stock levels</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 font-mono text-sm">TOTAL PRODUCTS</p>
                <p className="text-3xl font-bold text-white">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-accent" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 font-mono text-sm">LOW STOCK ITEMS</p>
                <p className="text-3xl font-bold text-yellow-500">
                  {products.filter(p =>
                    p.variants?.some(v => v.stock_quantity > 0 && v.stock_quantity <= 5)
                  ).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 font-mono text-sm">OUT OF STOCK</p>
                <p className="text-3xl font-bold text-red-500">
                  {products.filter(p =>
                    !p.variants?.some(v => v.stock_quantity > 0)
                  ).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}