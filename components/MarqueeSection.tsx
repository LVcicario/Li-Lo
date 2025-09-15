'use client'

import { motion } from 'framer-motion'

export function MarqueeSection() {
  const text = "ULTRA RARE • PREMIUM COLLECTION • EXCLUSIVE ACCESS • LIMITED EDITION • "

  return (
    <section className="relative py-8 border-y border-white/10 overflow-hidden bg-black">
      <div className="flex">
        <motion.div
          animate={{ x: '-100%' }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex shrink-0"
        >
          <span className="text-4xl md:text-6xl font-bold tracking-tighter whitespace-nowrap px-4">
            {text}
          </span>
          <span className="text-4xl md:text-6xl font-bold tracking-tighter whitespace-nowrap px-4">
            {text}
          </span>
        </motion.div>
        <motion.div
          animate={{ x: '-100%' }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex shrink-0"
        >
          <span className="text-4xl md:text-6xl font-bold tracking-tighter whitespace-nowrap px-4">
            {text}
          </span>
          <span className="text-4xl md:text-6xl font-bold tracking-tighter whitespace-nowrap px-4">
            {text}
          </span>
        </motion.div>
      </div>
    </section>
  )
}