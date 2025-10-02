'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Truck, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { useCartStore } from '@/lib/cart-store-simple'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCartStore()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // Clear cart on successful order
    clearCart()

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Fetch order details if needed
    if (sessionId) {
      // In a real app, you'd fetch order details from your backend
      // For now, we'll just set dummy data
      setOrderDetails({
        orderId: `ORDER_${Date.now()}`,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      })
    }
  }, [sessionId, clearCart])

  return (
    <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-8"
        >
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          ORDER CONFIRMED!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-400 mb-8"
        >
          Thank you for your purchase. Your order is being processed.
        </motion.p>

        {orderDetails && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-white mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Order Number</p>
                  <p className="text-white font-mono">{orderDetails.orderId}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-white mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Estimated Delivery</p>
                  <p className="text-white">{orderDetails.estimatedDelivery}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-white mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Confirmation</p>
                  <p className="text-white">Sent to your email</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-white mb-4">What's Next?</h2>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 text-black font-bold flex items-center justify-center">
                ✓
              </div>
              <div>
                <p className="text-white font-semibold">Order Confirmation</p>
                <p className="text-gray-400 text-sm">Check your email for order details</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 text-white font-bold flex items-center justify-center">
                2
              </div>
              <div>
                <p className="text-white font-semibold">Processing</p>
                <p className="text-gray-400 text-sm">We're preparing your order</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 text-white font-bold flex items-center justify-center">
                3
              </div>
              <div>
                <p className="text-white font-semibold">Shipping</p>
                <p className="text-gray-400 text-sm">You'll receive tracking information</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 text-white font-bold flex items-center justify-center">
                4
              </div>
              <div>
                <p className="text-white font-semibold">Delivery</p>
                <p className="text-gray-400 text-sm">Your sneakers will arrive in 5-7 days</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/sneakers"
            className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="px-6 py-3 border border-gray-700 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors"
          >
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}