'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCard, Lock, Package, Truck, Mail, MapPin, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { useCurrencyStore } from '@/lib/currency-store'
import { useAuthStore } from '@/lib/auth-store'
import { createClient } from '@/lib/supabase/client'
import { reserveStock, releaseStock } from '@/lib/stock-service'
import { toast } from 'sonner'
import Image from 'next/image'

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { format: formatPrice } = useCurrencyStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'FR'
  })

  const subtotal = getTotalPrice()
  const shipping = subtotal > 150 ? 0 : 15
  const tax = subtotal * 0.20
  const total = subtotal + shipping + tax

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items.length, router])

  useEffect(() => {
    // Check authentication and load user info
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setIsAuthenticated(true)
        // Pre-fill form with user info
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, email, phone, address')
          .eq('id', user.id)
          .single()

        if (profile) {
          setShippingInfo(prev => ({
            ...prev,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            email: profile.email || user.email || '',
            phone: profile.phone || ''
          }))
        }
      }
    }
    checkAuth()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode']
    for (const field of required) {
      if (!shippingInfo[field as keyof ShippingInfo]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shippingInfo.email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleCheckout = async () => {
    if (!validateForm()) return

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to complete your purchase')
      router.push('/auth/login?redirect=/checkout')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Please login to continue')
      }

      // Reserve stock for each item
      const stockReservations: Array<{ variantId: string, quantity: number }> = []
      for (const item of items) {
        const success = await reserveStock(item.variant_id, item.quantity)
        if (!success) {
          throw new Error(`${item.name} (Size ${item.size}) is no longer available in the requested quantity`)
        }
        stockReservations.push({ variantId: item.variant_id, quantity: item.quantity })
      }

      // Create order in database
      const orderNumber = `LI-LO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: 'pending',
          items: items.map(item => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price
          })),
          subtotal,
          shipping,
          tax,
          total_amount: total,
          shipping_address: shippingInfo,
          payment_method: 'stripe',
          payment_status: 'pending'
        })
        .select()
        .single()

      if (orderError) {
        // Release reserved stock if order creation fails
        for (const reservation of stockReservations) {
          await releaseStock(reservation.variantId, reservation.quantity)
        }
        throw orderError
      }

      // Call Stripe checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          items: items.map(item => ({
            id: item.product_id,
            variant_id: item.variant_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            image: item.image
          })),
          shippingInfo,
          subtotal,
          shipping,
          tax,
          total
        })
      })

      const data = await response.json()

      if (!response.ok) {
        // Release reserved stock if payment fails
        for (const reservation of stockReservations) {
          await releaseStock(reservation.variantId, reservation.quantity)
        }
        throw new Error(data.error || 'Checkout failed')
      }

      if (data.url) {
        // Clear cart after successful checkout initiation
        clearCart()
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      toast.error(error.message || 'Failed to process checkout')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-white">CHECKOUT</h1>

          {!isAuthenticated && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-yellow-400 font-medium">Login required</p>
                <p className="text-yellow-400/80 text-sm">
                  Please{' '}
                  <a href="/auth/login?redirect=/checkout" className="underline hover:text-yellow-300">
                    login
                  </a>{' '}
                  or{' '}
                  <a href="/auth/register?redirect=/checkout" className="underline hover:text-yellow-300">
                    create an account
                  </a>{' '}
                  to complete your purchase.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Form */}
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Contact Information</h2>
                </div>

                <div className="space-y-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Shipping Address</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
                    />

                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
                    />

                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={shippingInfo.postalCode}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
                    />
                  </div>

                  <select
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-white focus:outline-none"
                  >
                    <option value="FR">France</option>
                    <option value="BE">Belgium</option>
                    <option value="CH">Switzerland</option>
                    <option value="DE">Germany</option>
                    <option value="ES">Spain</option>
                    <option value="IT">Italy</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-28 h-fit">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Order Summary</h2>
                </div>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm">{item.name}</h3>
                        <p className="text-gray-400 text-xs">Size: {item.size} | Qty: {item.quantity}</p>
                        <p className="text-white font-bold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax (20%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-white text-xl font-bold pt-2 border-t border-gray-700">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full mt-6 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      SECURE PAYMENT
                    </>
                  )}
                </motion.button>

                <p className="text-center text-gray-500 text-xs mt-4">
                  Secured payment powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}