'use client'

import { motion } from 'framer-motion'

export function MarqueeSection() {
  const text = "ULTRA RARE COLLECTION • EXCLUSIVE DROPS • LIMITED EDITION • PREMIUM SNEAKERS • "

  return (
    <section className="relative py-6 border-y border-white/10 overflow-hidden bg-black">
      <div className="flex">
        <motion.div
          animate={{ x: '-100%' }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex shrink-0"
        >
          <span className="text-3xl md:text-5xl font-mono tracking-wider text-gray-200 whitespace-nowrap px-4">
            {text}
          </span>
          <span className="text-3xl md:text-5xl font-mono tracking-wider text-gray-200 whitespace-nowrap px-4">
            {text}
          </span>
        </motion.div>
        <motion.div
          animate={{ x: '-100%' }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex shrink-0"
        >
          <span className="text-3xl md:text-5xl font-mono tracking-wider text-gray-200 whitespace-nowrap px-4">
            {text}
          </span>
          <span className="text-3xl md:text-5xl font-mono tracking-wider text-gray-200 whitespace-nowrap px-4">
            {text}
          </span>
        </motion.div>
      </div>
    </section>
  )
}