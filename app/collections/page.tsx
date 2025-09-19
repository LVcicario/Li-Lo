'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, Crown, Zap, Diamond } from 'lucide-react'

export default function CollectionsPage() {
  const [activeCollection, setActiveCollection] = useState('all')

  const collections = [
    {
      id: 'exclusive',
      name: 'EXCLUSIVE GRAILS',
      description: 'The absolute pinnacle of sneaker luxury',
      icon: Crown,
      image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1920&h=1080&fit=crop',
      items: 6,
      priceRange: '$1M - $8M',
      featured: true,
      gradient: 'from-yellow-500 to-amber-600'
    },
    {
      id: 'limited-edition',
      name: 'LIMITED EDITION',
      description: 'Vault-secured premium collection',
      icon: Diamond,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1920&h=1080&fit=crop',
      items: 9,
      priceRange: '$5K - $500K',
      featured: true,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'sneakers',
      name: 'COMPLETE COLLECTION',
      description: "All 16 legendary pieces",
      icon: Zap,
      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=1920&h=1080&fit=crop',
      items: 16,
      priceRange: '$5K - $8M',
      featured: false,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'about',
      name: 'OUR STORY',
      description: 'Learn about Li-Lo heritage',
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1920&h=1080&fit=crop',
      items: 0,
      priceRange: 'Priceless',
      featured: false,
      gradient: 'from-red-500 to-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-black pt-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[50vh] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920&h=1080&fit=crop"
            alt="Collections"
            fill
            className="object-cover"
          />
        </motion.div>

        <div className="relative z-20 h-full flex items-center justify-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <motion.h1
              animate={{
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.5)",
                  "0 0 40px rgba(255,255,255,0.8)",
                  "0 0 20px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl lg:text-9xl font-bold tracking-tighter mb-4"
            >
              COLLECTIONS
            </motion.h1>
            <p className="font-mono text-sm text-gray-300 tracking-[0.3em]">
              CURATED EXCELLENCE • VERIFIED AUTHENTICITY
            </p>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-px h-20 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </motion.div>

      <div className="container mx-auto px-4 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 mb-12 justify-center"
        >
          {['all', 'featured', 'new', 'exclusive'].map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCollection(filter)}
              className={`px-6 py-3 font-mono text-sm tracking-wider transition-all ${
                activeCollection === filter
                  ? 'bg-white text-black'
                  : 'border border-white/30 hover:bg-white/10'
              }`}
            >
              {filter.toUpperCase()}
            </motion.button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {collections
              .filter(col => activeCollection === 'all' ||
                            (activeCollection === 'featured' && col.featured) ||
                            activeCollection === 'new' ||
                            activeCollection === 'exclusive')
              .map((collection, index) => {
                const Icon = collection.icon
                return (
                  <motion.div
                    key={collection.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group relative"
                  >
                    <Link href={`/${collection.id}`}>
                      <div className="relative h-[400px] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={collection.image}
                            alt={collection.name}
                            fill
                            className="object-cover"
                          />
                        </motion.div>

                        {collection.featured && (
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute top-4 right-4 z-20"
                          >
                            <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-mono font-bold">
                              FEATURED
                            </span>
                          </motion.div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="flex items-center space-x-3 mb-3"
                          >
                            <div className={`p-2 bg-gradient-to-r ${collection.gradient} rounded-lg`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-mono text-xs text-gray-400">
                              {collection.items} ITEMS
                            </span>
                          </motion.div>

                          <h2 className="text-4xl font-bold tracking-tighter mb-2">
                            {collection.name}
                          </h2>
                          <p className="text-gray-400 mb-4">
                            {collection.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm">
                              {collection.priceRange}
                            </span>
                            <motion.div
                              initial={{ x: 0 }}
                              whileHover={{ x: 10 }}
                              className="flex items-center space-x-2 text-sm font-mono"
                            >
                              <span>EXPLORE</span>
                              <ArrowRight className="w-4 h-4" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${collection.gradient} opacity-5 blur-xl`} />
                    </motion.div>
                  </motion.div>
                )
              })}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-bold tracking-tighter mb-4">
            NEED SOMETHING SPECIFIC?
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Our concierge service can source any rare sneaker in existence.
            Available 24/7 for our VIP members.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 font-mono text-sm tracking-wider"
          >
            CONTACT CONCIERGE
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}