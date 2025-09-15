'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function NotFound() {
  const [glitchText, setGlitchText] = useState('404')

  useEffect(() => {
    const interval = setInterval(() => {
      const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const randomGlitch = Array.from({ length: 3 }, () =>
        Math.random() > 0.5 ? '4' : glitchChars[Math.floor(Math.random() * glitchChars.length)]
      ).join('')
      setGlitchText(randomGlitch)
      setTimeout(() => setGlitchText('404'), 100)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative mb-8"
        >
          <motion.h1
            animate={{
              textShadow: [
                '0 0 20px rgba(255,0,0,0.8)',
                '0 0 40px rgba(255,0,0,1)',
                '0 0 20px rgba(255,0,0,0.8)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[200px] lg:text-[300px] font-bold tracking-tighter leading-none"
          >
            {glitchText}
          </motion.h1>

          <motion.div
            animate={{
              opacity: [0, 1, 1, 0],
              scaleX: [1, 1.1, 0.9, 1]
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <h1 className="text-[200px] lg:text-[300px] font-bold tracking-tighter text-red-500/50">
              404
            </h1>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter mb-4">
            GRAIL NOT FOUND
          </h2>
          <p className="text-xl text-gray-400 mb-2">
            This sneaker is so rare, even we can't find it.
          </p>
          <p className="text-sm text-gray-500 mb-12">
            The page you're looking for has been moved, deleted, or never existed in this dimension.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              RETURN HOME
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/sneakers"
              className="inline-flex items-center px-8 py-4 border border-white/30 font-mono text-sm tracking-wider hover:bg-white/10 transition-colors"
            >
              <Search className="w-4 h-4 mr-2" />
              BROWSE SNEAKERS
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16"
        >
          <p className="text-xs text-gray-600 font-mono">
            ERROR CODE: SNEAKER_NOT_IN_VAULT
          </p>
          <p className="text-xs text-gray-600 font-mono">
            TIMESTAMP: {new Date().toISOString()}
          </p>
        </motion.div>

        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-1/2 left-10 text-gray-800 text-9xl font-bold -rotate-12 pointer-events-none select-none"
        >
          404
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.5
          }}
          className="absolute top-1/2 right-10 text-gray-800 text-9xl font-bold rotate-12 pointer-events-none select-none"
        >
          404
        </motion.div>
      </div>
    </div>
  )
}