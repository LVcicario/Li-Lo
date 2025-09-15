'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Lock, Crown, Star, Eye, ChevronRight, Sparkles, Shield, TrendingUp } from 'lucide-react'
import { iconicSneakers, formatCurrency } from '@/lib/sneaker-data'

export default function ExclusivePage() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD')

  // Filter exclusive and grail sneakers from our collection
  const exclusiveSneakers = iconicSneakers.filter(s =>
    s.category === 'exclusive' || s.category === 'grail'
  ).slice(0, 6)

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.toLowerCase() === 'elite') {
      setIsUnlocked(true)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />

        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at center, purple 0%, transparent 70%)',
            backgroundSize: '200% 200%',
          }}
        />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <Crown className="w-20 h-20 text-yellow-500" />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl lg:text-9xl font-bold tracking-tighter mb-6"
          >
            EXCLUSIVE
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-400 mb-2"
          >
            THE MOST EXCLUSIVE SNEAKERS IN EXISTENCE
          </motion.p>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-mono text-sm text-gray-500 mb-12"
          >
            AUTHENTICATED • VERIFIED • EXCLUSIVE ACCESS ONLY
          </motion.p>

          {!isUnlocked && (
            <motion.form
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleUnlock}
              className="max-w-md mx-auto"
            >
              <div className="flex space-x-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ENTER ACCESS CODE"
                  className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 font-mono text-sm placeholder:text-gray-500 focus:outline-none focus:border-white/50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 font-mono text-sm"
                >
                  UNLOCK
                </motion.button>
              </div>
              <p className="mt-4 text-xs text-gray-600 font-mono">
                HINT: MEMBERS KNOW THE CODE
              </p>
            </motion.form>
          )}

          {isUnlocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-500/20 border border-green-500/50 rounded-full"
            >
              <Sparkles className="w-5 h-5 text-green-500" />
              <span className="font-mono text-sm text-green-500">ACCESS GRANTED</span>
            </motion.div>
          )}
        </div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ChevronRight className="w-6 h-6 rotate-90" />
        </motion.div>
      </motion.div>

      <div className="container mx-auto px-4 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {exclusiveSneakers.map((sneaker, index) => (
            <motion.div
              key={sneaker.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredItem(sneaker.id)}
              onHoverEnd={() => setHoveredItem(null)}
              className="group relative"
            >
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20">
                <AnimatePresence>
                  {index > 2 && !isUnlocked && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex items-center justify-center"
                    >
                      <Lock className="w-12 h-12 text-white/50" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  animate={hoveredItem === sneaker.id ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={sneaker.images[0]}
                    alt={sneaker.name}
                    fill
                    className={`object-cover ${!isUnlocked && index > 2 ? 'blur-xl' : ''}`}
                  />
                </motion.div>

                <div className="absolute top-4 left-4 z-10">
                  {sneaker.category === 'grail' && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-mono font-bold"
                    >
                      GRAIL
                    </motion.div>
                  )}
                  {sneaker.rarity.produced < 100 && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-3 py-1 bg-red-500 text-white text-xs font-mono font-bold mt-2"
                    >
                      1 OF {sneaker.rarity.produced}
                    </motion.div>
                  )}
                </div>

                <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded">
                  <Eye className="w-3 h-3" />
                  <span className="text-xs font-mono">{(Math.random() * 20 + 2).toFixed(1)}K</span>
                </div>

                {hoveredItem === sneaker.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"
                  />
                )}
              </div>

              <div className="p-6 border border-white/10 border-t-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  {index > 2 && !isUnlocked && (
                    <Lock className="w-4 h-4 text-gray-500" />
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-gray-500">{sneaker.brand}</span>
                  {sneaker.authenticity.certificate && (
                    <Shield className="w-3 h-3 text-green-500" />
                  )}
                  {sneaker.valueTrend.percentage > 0 && (
                    <div className="flex items-center gap-1 text-green-500">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+{sneaker.valueTrend.percentage}%</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold tracking-tighter mb-1">
                  {!isUnlocked && index > 2 ? 'CLASSIFIED' : sneaker.name}
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  {!isUnlocked && index > 2 ? '••••••••' : sneaker.edition}
                </p>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                  {!isUnlocked && index > 2 ? 'AUTHENTICATION REQUIRED' : sneaker.story}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold block">
                      {!isUnlocked && index > 2 ? '•••••' : formatCurrency(sneaker.price, currency)}
                    </span>
                    {sneaker.resaleValue > sneaker.price && (
                      <span className="text-xs text-gray-500">
                        Resale: {formatCurrency(sneaker.resaleValue, currency)}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/sneakers/${sneaker.id}`}
                    className="px-4 py-2 bg-white text-black text-xs font-mono tracking-wider hover:bg-gray-200 transition-colors"
                  >
                    {!isUnlocked && index > 2 ? 'LOCKED' : 'VIEW'}
                  </Link>
                </div>
              </div>

              {hoveredItem === sneaker.id && (
                <motion.div
                  layoutId="hover-glow"
                  className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-xl pointer-events-none"
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}