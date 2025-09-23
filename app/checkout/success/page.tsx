'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Mail, ArrowRight, Loader2, AlertCircle, Star, Heart } from 'lucide-react'
import { formatCurrency } from '@/lib/sneaker-data'
import Link from 'next/link'
import Image from 'next/image'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

interface OrderData {
  id: string
  order_number: string
  total_amount: number
  currency: string
  status: string
  payment_status: string
  customer_email: string
  created_at: string
  order_items: Array<{
    id: string
    product_name: string
    size: string
    quantity: number
    unit_price: number
    total_price: number
    product: {
      name: string
      slug: string
      brand: { name: string }
    }
  }>
}

interface SessionData {
  id: string
  payment_status: string
  customer_details: any
  shipping_details: any
  amount_total: number
  currency: string
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)

  const sessionId = searchParams.get('session_id')
  const orderId = searchParams.get('order_id')

  useEffect(() => {
    if (!sessionId) {
      setError('Invalid session')
      setLoading(false)
      return
    }

    // Fetch order and session data
    const fetchOrderData = async () => {
      try {
        const response = await fetch(`/api/stripe/checkout?session_id=${sessionId}&order_id=${orderId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch order data')
        }

        setSessionData(data.session)
        setOrderData(data.order)

        // Trigger confetti animation on successful load
        if (data.session.payment_status === 'paid') {
          const colors = ['#000000', '#666666', '#ffffff', '#FFD700'] // Black, gray, white, gold

          // Multiple confetti bursts
          setTimeout(() => {
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors,
            })
          }, 300)

          setTimeout(() => {
            confetti({
              particleCount: 100,
              spread: 60,
              origin: { y: 0.7, x: 0.3 },
              colors,
            })
          }, 600)

          setTimeout(() => {
            confetti({
              particleCount: 100,
              spread: 60,
              origin: { y: 0.7, x: 0.7 },
              colors,
            })
          }, 900)
        }

      } catch (err: any) {
        console.error('Error fetching order data:', err)
        setError(err.message)
        toast.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [sessionId, orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white font-mono tracking-wider">PROCESSING YOUR ORDER...</p>
        </div>
      </div>
    )
  }

  if (error || !sessionData || !orderData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Order Error</h1>
          <p className="text-gray-400 mb-6">{error || 'Unable to load order details'}</p>
          <Link
            href="/"
            className="bg-white text-black px-6 py-3 font-mono tracking-wider hover:bg-gray-200 transition-colors"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    )
  }

  const isPaid = sessionData.payment_status === 'paid'
  const orderTotal = orderData.total_amount || (sessionData.amount_total / 100)
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Success Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-14 h-14 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter mb-4"
          >
            ORDER CONFIRMED
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-400 font-mono tracking-wider"
          >
            {isPaid ? 'PAYMENT SUCCESSFUL' : 'PROCESSING PAYMENT'}
          </motion.p>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div>
              <h2 className="text-2xl font-bold mb-6 font-mono tracking-wider">ORDER DETAILS</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                  <span className="text-gray-400 font-mono text-sm">ORDER NUMBER</span>
                  <span className="font-bold text-lg">{orderData.order_number}</span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                  <span className="text-gray-400 font-mono text-sm">TOTAL AMOUNT</span>
                  <span className="font-bold text-2xl">{formatCurrency(orderTotal, orderData.currency as 'USD' | 'EUR')}</span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                  <span className="text-gray-400 font-mono text-sm">PAYMENT STATUS</span>
                  <span className={`font-bold ${isPaid ? 'text-green-400' : 'text-yellow-400'}`}>
                    {isPaid ? 'PAID' : 'PROCESSING'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-mono text-sm">ESTIMATED DELIVERY</span>
                  <span className="font-bold">{estimatedDelivery}</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <h2 className="text-2xl font-bold mb-6 font-mono tracking-wider">SHIPPING TO</h2>

              {sessionData.customer_details && (
                <div className="space-y-2 text-sm">
                  <p className="font-bold">{sessionData.customer_details.name}</p>
                  <p className="text-gray-400">{sessionData.customer_details.email}</p>
                  {sessionData.shipping_details?.address && (
                    <div className="mt-4 text-gray-300">
                      <p>{sessionData.shipping_details.address.line1}</p>
                      {sessionData.shipping_details.address.line2 && (
                        <p>{sessionData.shipping_details.address.line2}</p>
                      )}
                      <p>
                        {sessionData.shipping_details.address.city}, {sessionData.shipping_details.address.state} {sessionData.shipping_details.address.postal_code}
                      </p>
                      <p>{sessionData.shipping_details.address.country}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Order Items */}
        {orderData.order_items && orderData.order_items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-6 font-mono tracking-wider">YOUR ITEMS</h2>

            <div className="space-y-4">
              {orderData.order_items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.product_name}</h3>
                    <p className="text-gray-400 font-mono text-sm">{item.product.brand.name}</p>
                    <p className="text-gray-400 text-sm">Size: {item.size}</p>
                    <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">{formatCurrency(item.total_price, orderData.currency as 'USD' | 'EUR')}</p>
                    <p className="text-gray-400 text-sm">{formatCurrency(item.unit_price, orderData.currency as 'USD' | 'EUR')} each</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="text-center p-6 bg-gray-900 border border-gray-700 rounded-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold mb-2 font-mono">EMAIL CONFIRMATION</h3>
            <p className="text-sm text-gray-400">
              Order confirmation sent to {sessionData.customer_details?.email}
            </p>
          </div>

          <div className="text-center p-6 bg-gray-900 border border-gray-700 rounded-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold mb-2 font-mono">TRACKING UPDATES</h3>
            <p className="text-sm text-gray-400">
              You'll receive tracking info once your rare finds ship
            </p>
          </div>

          <div className="text-center p-6 bg-gray-900 border border-gray-700 rounded-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold mb-2 font-mono">WHITE GLOVE SERVICE</h3>
            <p className="text-sm text-gray-400">
              Premium packaging and authentication included
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <Link
            href={`/account/orders/${orderData.id}`}
            className="flex-1 bg-white text-black py-4 px-6 font-mono text-sm tracking-wider text-center hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            VIEW ORDER DETAILS
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/exclusive"
            className="flex-1 border border-gray-600 py-4 px-6 font-mono text-sm tracking-wider text-center hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
          >
            SHOP MORE EXCLUSIVES
            <Heart className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <p className="text-gray-400 font-mono text-sm mb-2">
            Questions about your order?
          </p>
          <Link
            href="/contact"
            className="text-white underline hover:text-gray-300 transition-colors font-mono text-sm tracking-wider"
          >
            CONTACT SUPPORT
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}