'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Shield, Diamond, Fingerprint, Award, Clock, Globe, TrendingUp } from 'lucide-react'
import { iconicSneakers, formatCurrency } from '@/lib/sneaker-data'

export default function LimitedEditionPage() {
  const [isVaultOpen, setIsVaultOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState('platinum')
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD')
  const { scrollY } = useScroll()
  const vaultRotate = useTransform(scrollY, [0, 500], [0, 360])

  const premiumTiers = {
    platinum: {
      name: 'PLATINUM',
      color: 'from-gray-300 to-gray-500',
      minPrice: 800,
      benefits: ['Personal Shopper', '24/7 Support', 'Priority Access']
    },
    diamond: {
      name: 'DIAMOND',
      color: 'from-blue-300 to-blue-600',
      minPrice: 1500,
      benefits: ['Concierge Service', 'Private Events', 'Custom Orders']
    },
    obsidian: {
      name: 'OBSIDIAN',
      color: 'from-purple-600 to-black',
      minPrice: 3000,
      benefits: ['Unlimited Access', 'Global Delivery', 'Lifetime Warranty']
    }
  }

  // Select limited edition items from our collection and categorize by tier
  const vaultItems = iconicSneakers.slice(0, 9).map((sneaker, index) => {
    let tier = 'platinum'
    if (sneaker.price > 100000) tier = 'obsidian'
    else if (sneaker.price > 10000) tier = 'diamond'

    return {
      ...sneaker,
      tier
    }
  })

  useEffect(() => {
    const timer = setTimeout(() => setIsVaultOpen(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black pt-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />

        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative z-10">
          <motion.div
            style={{ rotateY: vaultRotate }}
            className="mb-8 flex justify-center"
          >
            <motion.div
              animate={isVaultOpen ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 2, type: 'spring' }}
              className="relative"
            >
              <Diamond className="w-32 h-32 text-white" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-32 h-32 border-4 border-white/20 rounded-full" />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl lg:text-8xl font-bold tracking-tighter text-center mb-4"
          >
            LIMITED EDITION
          </motion.h1>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 text-center mb-2"
          >
            EXCLUSIVE COLLECTION
          </motion.p>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center space-x-8 mt-8"
          >
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-xs font-mono text-gray-500">SECURED</p>
            </div>
            <div className="text-center">
              <Fingerprint className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-xs font-mono text-gray-500">VERIFIED</p>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-xs font-mono text-gray-500">CERTIFIED</p>
            </div>
          </motion.div>
        </div>

        {isVaultOpen && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: 'spring' }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
          </motion.div>
        )}
      </motion.div>

      <div className="container mx-auto px-4 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tighter text-center mb-8">
            SELECT YOUR TIER
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {Object.entries(premiumTiers).map(([key, tier]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTier(key)}
                className={`p-6 border ${
                  selectedTier === key ? 'border-white bg-white/10' : 'border-white/30'
                } transition-all`}
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${tier.color} rounded-full`} />
                <h3 className="font-bold text-xl mb-2">{tier.name}</h3>
                <p className="font-mono text-sm text-gray-400 mb-4">
                  FROM {formatCurrency(tier.minPrice, currency)}
                </p>
                <ul className="space-y-1">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="text-xs text-gray-500">• {benefit}</li>
                  ))}
                </ul>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {vaultItems
            .filter(item => selectedTier === 'obsidian' ||
                          (selectedTier === 'diamond' && item.tier !== 'obsidian') ||
                          (selectedTier === 'platinum' && item.tier === 'platinum'))
            .map((item, index) => (
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
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    {item.rarity.produced < 100 && (
                      <span className="px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-mono">
                        1/{item.rarity.produced}
                      </span>
                    )}
                    {item.category === 'grail' && (
                      <motion.span
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-mono font-bold"
                      >
                        GRAIL
                      </motion.span>
                    )}
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${premiumTiers[item.tier as keyof typeof premiumTiers].color}`} />
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end p-6"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="w-4 h-4" />
                        <span className="text-xs font-mono">WORLDWIDE EXCLUSIVE</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-mono">24H DELIVERY</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="p-6 border border-white/10 border-t-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-gray-500">{item.brand}</span>
                    {item.authenticity.certificate && (
                      <Shield className="w-3 h-3 text-green-500" />
                    )}
                    {item.valueTrend.percentage > 0 && (
                      <div className="flex items-center gap-1 text-green-500">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-xs">+{item.valueTrend.percentage}%</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold tracking-tighter mb-2">{item.name}</h3>
                  <p className="text-xs text-gray-400 mb-1">{item.edition}</p>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{item.story}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold block">{formatCurrency(item.price, currency)}</span>
                      {item.resaleValue > item.price && (
                        <span className="text-xs text-gray-500">
                          Resale: {formatCurrency(item.resaleValue, currency)}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/sneakers/${item.id}`}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-mono tracking-wider hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      ACQUIRE
                    </Link>
                  </div>
                </div>

                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                />
              </motion.div>
            ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center max-w-3xl mx-auto"
        >
          <h3 className="text-3xl font-bold tracking-tighter mb-4">
            BECOME A VAULT MEMBER
          </h3>
          <p className="text-gray-400 mb-8">
            Join the most exclusive sneaker community in the world.
            Access pieces that money alone cannot buy.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors"
          >
            APPLY FOR MEMBERSHIP
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}