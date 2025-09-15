'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, X, Plus, Minus, ShoppingBag, Lock } from 'lucide-react'
import { iconicSneakers, formatCurrency } from '@/lib/sneaker-data'

type CartItem = {
  id: string
  sneaker: {
    id: number
    name: string
    brand: string
    price: number
    image: string
    category: string
  }
  size: number
  quantity: number
}

export default function CartPage() {
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD')
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      sneaker: {
        id: 1,
        name: iconicSneakers[3].name,
        brand: iconicSneakers[3].brand,
        price: iconicSneakers[3].price,
        image: iconicSneakers[3].images[0],
        category: iconicSneakers[3].category,
      },
      size: 10,
      quantity: 1
    },
    {
      id: '2',
      sneaker: {
        id: 2,
        name: iconicSneakers[4].name,
        brand: iconicSneakers[4].brand,
        price: iconicSneakers[4].price,
        image: iconicSneakers[4].images[0],
        category: iconicSneakers[4].category,
      },
      size: 9,
      quantity: 1
    }
  ])

  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta)
          return { ...item, quantity: newQuantity }
        }
        return item
      })
    )
  }

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.sneaker.price * item.quantity), 0)
  const shipping = subtotal > 10000 ? 0 : 500 // Free shipping on orders over $10k
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax - discount

  const applyPromoCode = () => {
    if (promoCode === 'RARE10') {
      setDiscount(subtotal * 0.1)
    }
  }

  if (cartItems.length === 0) {
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
        <Link
          href="/sneakers"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-sm">CONTINUE SHOPPING</span>
        </Link>

        <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter mb-8">SHOPPING CART</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 p-6 border border-white/10"
                >
                  <div className="relative w-full sm:w-32 h-48 sm:h-32 bg-gradient-to-b from-gray-900 to-black">
                    <Image
                      src={item.sneaker.image}
                      alt={item.sneaker.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <span className="text-xs font-mono text-gray-500">{item.sneaker.brand}</span>
                      <h3 className="text-xl font-bold">{item.sneaker.name}</h3>
                      <p className="text-sm text-gray-400">Size: {item.size} US</p>
                      <span className="inline-block px-2 py-1 bg-white/10 text-xs font-mono uppercase mt-1">
                        {item.sneaker.category}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 border border-white/30 hover:bg-white hover:text-black transition-colors flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 border border-white/30 hover:bg-white hover:text-black transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start space-y-0 sm:space-y-4">
                    <p className="text-xl font-bold">{formatCurrency(item.sneaker.price * item.quantity, currency)}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <div className="p-6 border border-white/10 space-y-6">
              <h2 className="text-2xl font-bold tracking-tighter">ORDER SUMMARY</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-mono">{formatCurrency(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-mono">{shipping === 0 ? 'FREE' : formatCurrency(shipping, currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax</span>
                  <span className="font-mono">{formatCurrency(tax, currency)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Discount</span>
                    <span className="font-mono">-{formatCurrency(discount, currency)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total, currency)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="PROMO CODE"
                    className="flex-1 px-4 py-3 bg-transparent border border-white/30 font-mono text-sm placeholder:text-gray-500 focus:outline-none focus:border-white"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-6 py-3 border border-white/30 font-mono text-sm hover:bg-white hover:text-black transition-colors"
                  >
                    APPLY
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>PROCEED TO CHECKOUT</span>
              </motion.button>

              <div className="space-y-2 text-xs text-gray-500 text-center">
                <p>Secure checkout powered by Stripe</p>
                <p>Free returns within 14 days</p>
              </div>
            </div>

            <div className="mt-6 p-4 border border-white/10">
              <h3 className="font-mono text-sm tracking-wider mb-3">WE ACCEPT</h3>
              <div className="flex space-x-3">
                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-xs">VISA</div>
                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-xs">MC</div>
                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-xs">AMEX</div>
                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-xs">PP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}