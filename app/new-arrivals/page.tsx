'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, TrendingUp, Clock, Fire } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function NewArrivalsPage() {
  const newArrivals = [
    {
      id: 1,
      name: "TRAVIS SCOTT REVERSE",
      brand: "JORDAN",
      price: 28000,
      image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=800&fit=crop",
      isNew: true,
      isHot: true,
      arrivedDays: 1,
      category: "ULTRA RARE"
    },
    {
      id: 2,
      name: "OFF-WHITE DUNK",
      brand: "NIKE",
      price: 15000,
      image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop",
      isNew: true,
      isHot: false,
      arrivedDays: 2,
      category: "EXCLUSIVE"
    },
    {
      id: 3,
      name: "YEEZY 700 V3",
      brand: "ADIDAS",
      price: 8500,
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop",
      isNew: true,
      isHot: true,
      arrivedDays: 3,
      category: "LIMITED"
    },
    {
      id: 4,
      name: "SACAI VAPORWAFFLE",
      brand: "NIKE",
      price: 12000,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
      isNew: false,
      isHot: false,
      arrivedDays: 5,
      category: "PREMIUM"
    },
    {
      id: 5,
      name: "FRAGMENT DESIGN",
      brand: "JORDAN",
      price: 35000,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop",
      isNew: true,
      isHot: true,
      arrivedDays: 0,
      category: "ULTRA RARE"
    },
    {
      id: 6,
      name: "KAWS COLLAB",
      brand: "JORDAN",
      price: 45000,
      image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&h=800&fit=crop",
      isNew: true,
      isHot: true,
      arrivedDays: 0,
      category: "GRAIL"
    }
  ]

  return (
    <div className="min-h-screen bg-black pt-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[40vh] flex items-center justify-center overflow-hidden"
      >
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(45deg, #ff00ff 0%, #00ffff 50%, #ffff00 100%)',
            backgroundSize: '300% 300%',
            opacity: 0.1
          }}
        />

        <div className="relative z-10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-20 h-20 text-yellow-500" />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl lg:text-8xl font-bold tracking-tighter mb-4"
          >
            NEW ARRIVALS
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400"
          >
            FRESH HEAT • JUST LANDED • GET THEM FIRST
          </motion.p>
        </div>

        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-10 right-10"
        >
          <div className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-mono text-sm font-bold">
            UPDATED DAILY
          </div>
        </motion.div>
      </motion.div>

      <div className="container mx-auto px-4 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 mb-12 justify-center"
        >
          {['ALL', 'TODAY', 'THIS WEEK', 'HOT'].map((filter, index) => (
            <motion.button
              key={filter}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 border border-white/30 hover:bg-white hover:text-black font-mono text-sm tracking-wider transition-all"
            >
              {filter}
              {filter === 'HOT' && (
                <Fire className="inline-block w-4 h-4 ml-2 text-orange-500" />
              )}
            </motion.button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newArrivals.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                  {item.arrivedDays === 0 && (
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-mono font-bold"
                    >
                      JUST DROPPED
                    </motion.span>
                  )}
                  {item.isNew && (
                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-mono font-bold">
                      NEW
                    </span>
                  )}
                  {item.isHot && (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-mono font-bold"
                    >
                      HOT
                    </motion.span>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end p-6"
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-500">+24% VALUE</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {item.arrivedDays === 0 ? 'TODAY' : `${item.arrivedDays}D AGO`}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/sneakers/${item.id}`}
                      className="block w-full py-3 text-center bg-white text-black font-mono text-sm hover:bg-gray-200 transition-colors"
                    >
                      QUICK VIEW
                    </Link>
                  </div>
                </motion.div>
              </div>

              <div className="p-6 border border-white/10 border-t-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-gray-500">{item.brand}</span>
                  <span className="text-xs font-mono text-gray-400">{item.category}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tighter mb-2">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{formatPrice(item.price)}</span>
                  <Link
                    href={`/sneakers/${item.id}`}
                    className="px-4 py-2 bg-white/10 hover:bg-white hover:text-black text-xs font-mono tracking-wider transition-all"
                  >
                    VIEW
                  </Link>
                </div>
              </div>

              {item.isHot && (
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-red-500/5 to-orange-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-bold tracking-tighter mb-4">
            NEVER MISS A DROP
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get instant notifications when new grails arrive.
            Be the first to know, be the first to own.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-mono text-sm tracking-wider"
          >
            ENABLE NOTIFICATIONS
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}