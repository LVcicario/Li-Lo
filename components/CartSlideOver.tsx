'use client'

import { Fragment, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { formatCurrency } from '@/lib/sneaker-data'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'

export default function CartSlideOver() {
  const {
    items,
    isOpen,
    isLoading,
    toggleCart,
    removeItem,
    updateQuantity,
    getTotalPrice,
    loadCart
  } = useCartStore()

  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set())
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD')

  // Load cart on mount
  useEffect(() => {
    if (isOpen) {
      loadCart()
    }
  }, [isOpen, loadCart])

  const handleRemoveItem = async (id: string, size: string) => {
    setLoadingItems(prev => new Set(prev).add(id))
    try {
      await removeItem(id, size)
      toast.success('Item removed from cart')
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item')
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleUpdateQuantity = async (id: string, size: string, quantity: number) => {
    setLoadingItems(prev => new Set(prev).add(id))
    try {
      await updateQuantity(id, size, quantity)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update quantity')
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleCart}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-black text-white shadow-2xl z-50"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-4 bg-black text-white">
                <h2 className="text-lg font-semibold font-mono tracking-wider">
                  CART ({items.length})
                </h2>
                <div className="flex items-center gap-3">
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <button
                    onClick={toggleCart}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4 bg-black text-white">
                {isLoading && items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
                    <p className="text-gray-400 font-mono">Loading cart...</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
                    <p className="text-gray-400 mb-2 font-mono tracking-wider">YOUR CART IS EMPTY</p>
                    <p className="text-sm text-gray-500 mb-6">Add some rare finds to get started</p>
                    <button
                      onClick={toggleCart}
                      className="bg-white text-black px-6 py-3 font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors"
                    >
                      CONTINUE SHOPPING
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => {
                      const isItemLoading = loadingItems.has(item.id)
                      const isLowStock = item.max_quantity && item.max_quantity <= 3

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          className={`relative flex gap-4 bg-gray-900 border border-gray-800 rounded-lg p-4 transition-opacity ${
                            isItemLoading ? 'opacity-50' : ''
                          }`}
                        >
                          {isItemLoading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                              <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                          )}

                          <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-gray-500" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm truncate">{item.name}</h3>
                            <p className="text-xs text-gray-400 font-mono tracking-wider">{item.brand}</p>
                            <p className="text-xs text-gray-400 mt-1">Size: {item.size}</p>
                            <p className="font-bold mt-2">{formatCurrency(item.price, currency)}</p>

                            {isLowStock && (
                              <div className="flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3 h-3 text-amber-500" />
                                <span className="text-xs text-amber-500">
                                  Only {item.max_quantity} left
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-end justify-between">
                            <button
                              onClick={() => handleRemoveItem(item.id, item.size)}
                              disabled={isItemLoading}
                              className="text-red-400 hover:text-red-300 disabled:opacity-50 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity - 1)}
                                disabled={isItemLoading || item.quantity <= 1}
                                className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 disabled:hover:bg-transparent"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-mono">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
                                disabled={isItemLoading || (item.max_quantity && item.quantity >= item.max_quantity)}
                                className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 disabled:hover:bg-transparent"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-800 px-6 py-6 bg-black">
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-mono">SUBTOTAL</span>
                      <span className="font-mono">{formatCurrency(getTotalPrice(), currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-mono">SHIPPING</span>
                      <span className="font-mono">FREE</span>
                    </div>
                    <div className="border-t border-gray-800 pt-2 flex justify-between">
                      <span className="font-bold font-mono tracking-wider">TOTAL</span>
                      <span className="font-bold text-xl font-mono">{formatCurrency(getTotalPrice(), currency)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/checkout"
                      onClick={toggleCart}
                      className="block w-full bg-white text-black text-center py-4 font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors"
                    >
                      PROCEED TO CHECKOUT
                    </Link>

                    <button
                      onClick={toggleCart}
                      className="block w-full text-center py-3 border border-gray-700 font-mono text-sm tracking-wider hover:bg-gray-900 transition-colors"
                    >
                      CONTINUE SHOPPING
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}