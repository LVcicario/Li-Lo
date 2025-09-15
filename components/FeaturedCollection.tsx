'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, TrendingUp } from 'lucide-react'
import { iconicSneakers, formatCurrency } from '@/lib/sneaker-data'

export function FeaturedCollection() {
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD')

  // Select 4 featured sneakers from our collection
  const featuredSneakers = [
    iconicSneakers[0], // Jordan Dynasty Collection
    iconicSneakers[1], // Last Dance Jordan
    iconicSneakers[3], // Dior x Jordan
    iconicSneakers[5], // Travis Scott Fragment
  ]

  return (
    <section className="py-20 lg:py-32 bg-black">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-4">
            FEATURED DROPS
          </h2>
          <p className="font-mono text-sm text-gray-400 tracking-wider">
            HANDPICKED EXCELLENCE FROM OUR VAULT
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSneakers.map((sneaker, index) => (
            <motion.div
              key={sneaker.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <Link href={`/sneakers/${sneaker.id}`}>
                <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-black">
                  {sneaker.featured && (
                    <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-accent text-black text-xs font-mono tracking-wider">
                      FEATURED
                    </span>
                  )}
                  {sneaker.category === 'grail' && (
                    <motion.span
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-4 right-4 z-10 px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-mono font-bold"
                    >
                      GRAIL
                    </motion.span>
                  )}
                  <div className="aspect-square relative">
                    <Image
                      src={sneaker.images[0]}
                      alt={sneaker.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-4 border border-white/10 border-t-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-gray-500">{sneaker.brand}</span>
                    <div className="flex">
                      {[...Array(Math.ceil(sneaker.rarity.rating / 2))].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-white text-white" />
                      ))}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                    {sneaker.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">{formatCurrency(sneaker.price, currency)}</span>
                      {sneaker.valueTrend.percentage > 0 && (
                        <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>+{sneaker.valueTrend.percentage}%</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-mono text-gray-400 uppercase">{sneaker.category}</span>
                  </div>
                </div>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-2 py-3 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center group"
              >
                ADD TO CART
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/collections"
            className="inline-flex items-center px-8 py-4 border border-white/30 font-mono text-sm tracking-wider hover:bg-white hover:text-black transition-all duration-300"
          >
            VIEW ALL COLLECTIONS
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}