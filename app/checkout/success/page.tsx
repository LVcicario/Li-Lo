'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function CheckoutSuccessPage() {
  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#000000', '#666666', '#ffffff'],
    });
  }, []);

  const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Order Number</p>
            <p className="text-2xl font-bold text-gray-900">{orderNumber}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-semibold mb-1">Email Confirmation</h3>
              <p className="text-sm text-gray-600">
                We've sent a confirmation email with your order details
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-semibold mb-1">Shipping Updates</h3>
              <p className="text-sm text-gray-600">
                You'll receive tracking information once your order ships
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-semibold mb-1">Delivery Time</h3>
              <p className="text-sm text-gray-600">
                Estimated delivery in 5-7 business days
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/account/orders"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              View Order Details
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/"
              className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help? <Link href="/contact" className="text-black underline">Contact our support team</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}