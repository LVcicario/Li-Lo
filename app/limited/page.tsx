'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Timer, Lock, Unlock, TrendingUp } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { getAllProducts } from '@/lib/products-service'
import { useCurrencyStore } from '@/lib/currency-store'

export default function LimitedPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 18
  })
  const [limitedDrops, setLimitedDrops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { format: formatPriceStore } = useCurrencyStore()

  // Load limited edition sneakers from database
  useEffect(() => {
    async function loadProducts() {
      const products = await getAllProducts()

      // Filter for limited products or get expensive ones
      let limited = products.filter(p => p.category === 'limited')

      // If no limited products, get next 4 most expensive after top 6
      if (limited.length === 0) {
        limited = products
          .sort((a, b) => b.price - a.price)
          .slice(6, 10) // Get products 7-10 by price
      }

      // Transform to match the expected format
      const transformed = limited.map((p, index) => ({
        id: p.id,
        name: p.name.toUpperCase(),
        price: p.price,
        originalPrice: Math.round(p.price * 0.7),
        image: p.images[0] || '/placeholder-sneaker.jpg',
        available: p.stock > 0,
        stock: p.stock || Math.floor(Math.random() * 10),
        totalStock: 25,
        dropTime: p.stock === 0 ? 'SOLD OUT' : `${48 - index * 12}:00:00`,
        trend: `+${p.valueTrend?.percentage || 45}%`
      }))

      setLimitedDrops(transformed.slice(0, 4))
      setLoading(false)
    }
    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[60vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black" />

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0 opacity-20"
        >
          <Image
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920&h=1080&fit=crop"
            alt="Background"
            fill
            className="object-cover"
          />
        </motion.div>

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block mb-6"
          >
            <Timer className="w-20 h-20 text-red-500" />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl lg:text-9xl font-bold tracking-tighter mb-4"
          >
            LIMITED EDITION
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-400 mb-8"
          >
            EXCLUSIVE DROPS • LIMITED TIME • NEVER RESTOCKED
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-4"
          >
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-4xl font-bold font-mono"
                >
                  {value.toString().padStart(2, '0')}
                </motion.div>
                <p className="text-xs text-gray-500 uppercase">{unit}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold tracking-tighter mb-4">
            CURRENT DROPS
          </h2>
          <p className="text-gray-400">
            Once they're gone, they're gone forever
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {limitedDrops.map((drop, index) => (
            <motion.div
              key={drop.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative h-[500px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="relative h-full"
                >
                  <Image
                    src={drop.image}
                    alt={drop.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
                  {drop.available ? (
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-3 py-1 bg-red-500 text-white text-xs font-mono font-bold"
                    >
                      {drop.dropTime}
                    </motion.div>
                  ) : (
                    <div className="px-3 py-1 bg-black/80 text-gray-500 text-xs font-mono font-bold">
                      SOLD OUT
                    </div>
                  )}

                  <div className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-500 text-xs font-mono">
                    {drop.trend}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <h3 className="text-3xl font-bold tracking-tighter mb-2">
                    {drop.name}
                  </h3>

                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold">{formatPrice(drop.price)}</p>
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice(drop.originalPrice)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        {drop.stock} / {drop.totalStock} LEFT
                      </p>
                      <div className="w-32 h-2 bg-white/20 mt-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(drop.stock / drop.totalStock) * 100}%` }}
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/sneakers/${drop.id}`}
                    className={`block w-full py-4 text-center font-mono text-sm tracking-wider transition-all ${
                      drop.available
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {drop.available ? 'PURCHASE NOW' : 'OUT OF STOCK'}
                  </Link>
                </div>

                {drop.available && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-0"
                    animate={{
                      background: [
                        'radial-gradient(circle at 50% 50%, rgba(255,0,0,0.2) 0%, transparent 70%)',
                        'radial-gradient(circle at 60% 60%, rgba(255,0,0,0.3) 0%, transparent 70%)',
                        'radial-gradient(circle at 40% 40%, rgba(255,0,0,0.2) 0%, transparent 70%)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center p-12 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30"
        >
          <Lock className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-3xl font-bold tracking-tighter mb-4">
            UNLOCK EARLY ACCESS
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            VIP members get 48-hour early access to all limited drops.
            Never miss out on the sneakers you want.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-mono text-sm tracking-wider"
          >
            BECOME VIP
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}