'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, X, Plus, Minus, ShoppingBag, Lock, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { formatCurrency } from '@/lib/sneaker-data'

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems
  } = useCartStore()

  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD')
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const subtotal = getTotalPrice()
  const shipping = subtotal > 500 ? 0 : 25
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax - discount

  const applyPromoCode = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (promoCode === 'RARE10') {
        setDiscount(subtotal * 0.1)
      } else if (promoCode === 'WELCOME15') {
        setDiscount(subtotal * 0.15)
      } else {
        setDiscount(0)
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleUpdateQuantity = (id: string, size: string, quantity: number) => {
    try {
      updateQuantity(id, size, quantity)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const handleRemoveItem = (id: string, size: string) => {
    try {
      removeItem(id, size)
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-600" />
          <h1 className="text-4xl font-bold tracking-tighter mb-4">YOUR CART IS EMPTY</h1>
          <p className="text-gray-400 mb-8">Add some rare sneakers to your collection</p>
          <Link
            href="/sneakers"
            className="inline-flex items-center px-8 py-4 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="container mx-auto px-4 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/sneakers"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm">CONTINUE SHOPPING</span>
          </Link>
        </nav>

        <header className="mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter mb-2">SHOPPING CART</h1>
          <p className="text-gray-400 font-mono text-sm">
            {getTotalItems()} {getTotalItems() === 1 ? 'ITEM' : 'ITEMS'} IN YOUR CART
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.article
                  key={`${item.id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 p-6 border border-white/10 bg-black/50"
                >
                  <div className="relative w-full sm:w-32 h-48 sm:h-32 bg-gradient-to-b from-gray-900 to-black flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 128px"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <p className="text-gray-400 text-sm">Size: {item.size}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.size)}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-white/10 rounded-full transition-colors"
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-mono">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
                          className="p-1 hover:bg-white/10 rounded-full transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xl font-bold">{formatCurrency(item.price * item.quantity, currency)}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>

            {/* Clear Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearCart}
              className="w-full p-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-mono text-sm"
            >
              CLEAR CART
            </motion.button>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="border border-white/10 p-6 bg-black/50">
              <h2 className="text-xl font-bold mb-4">ORDER SUMMARY</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>{formatCurrency(subtotal, currency)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping, currency)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (VAT)</span>
                  <span>{formatCurrency(tax, currency)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount, currency)}</span>
                  </div>
                )}

                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total, currency)}</span>
                  </div>
                </div>
              </div>

              {subtotal < 500 && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                  <div className="flex items-center space-x-2 text-blue-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Add {formatCurrency(500 - subtotal, currency)} more for free shipping</span>
                  </div>
                </div>
              )}

              {/* Promo Code */}
              <div className="mt-6 space-y-3">
                <label htmlFor="promo-code" className="block text-sm font-mono">PROMO CODE</label>
                <div className="flex space-x-2">
                  <input
                    id="promo-code"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 bg-black border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white/30"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={!promoCode || isLoading}
                    className="px-4 py-2 bg-white text-black font-mono text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'APPLYING...' : 'APPLY'}
                  </button>
                </div>
                {promoCode && discount === 0 && !isLoading && (
                  <p className="text-red-400 text-sm">Invalid promo code. Try RARE10 or WELCOME15</p>
                )}
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="mt-6 w-full bg-white text-black font-mono text-sm tracking-wider py-4 px-6 hover:bg-gray-200 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>SECURE CHECKOUT</span>
              </Link>
            </div>

            {/* Security Info */}
            <div className="text-xs text-gray-400 space-y-1">
              <p>🔒 SSL encrypted checkout</p>
              <p>📦 Free returns within 30 days</p>
              <p>✓ Authenticity guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}