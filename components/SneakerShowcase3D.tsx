'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'
import { iconicSneakers, formatCurrency } from '@/lib/sneaker-data'
import { Shield, Award } from 'lucide-react'

export function SneakerShowcase3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD')

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    damping: 20,
    stiffness: 300
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    damping: 20,
    stiffness: 300
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    mouseX.set(x)
    mouseY.set(y)
  }

  // Select 3 crown jewel sneakers from our collection
  const sneakers = [
    iconicSneakers[2], // Nike Air Yeezy 1 Prototype
    iconicSneakers[4], // Off-White Chicago
    iconicSneakers[6], // Travis Scott Dunk
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-4">
            CROWN JEWELS
          </h2>
          <p className="font-mono text-sm text-gray-400 tracking-wider">
            THE MOST EXCLUSIVE PIECES IN EXISTENCE
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {sneakers.map((sneaker, index) => (
            <motion.div
              key={sneaker.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              ref={index === 1 ? containerRef : undefined}
              onMouseMove={index === 1 ? handleMouseMove : undefined}
              onMouseEnter={() => index === 1 && setIsHovered(true)}
              onMouseLeave={() => {
                if (index === 1) {
                  setIsHovered(false)
                  mouseX.set(0)
                  mouseY.set(0)
                }
              }}
              className="relative group"
              style={{ perspective: 1000 }}
            >
              <motion.div
                style={index === 1 ? {
                  rotateX: rotateX,
                  rotateY: rotateY,
                  transformStyle: "preserve-3d"
                } : {}}
                className="relative"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
                  <motion.div
                    animate={index === 1 && isHovered ? {
                      scale: 1.1,
                      rotateZ: 5
                    } : {
                      scale: 1,
                      rotateZ: 0
                    }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={sneaker.images[0]}
                      alt={sneaker.name}
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  {index === 1 && (
                    <motion.div
                      animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-red-500/5 via-transparent to-transparent pointer-events-none"
                    />
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                      className="text-center"
                    >
                      <p className="font-mono text-xs tracking-wider mb-2">EXPLORE</p>
                      <p className="text-2xl font-bold">360° VIEW</p>
                    </motion.div>
                  </motion.div>
                </div>

                <div className="p-6 bg-black border border-white/10 border-t-0">
                  <motion.div
                    animate={index === 1 && isHovered ? {
                      x: [0, -5, 5, -5, 5, 0],
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-gray-500">{sneaker.brand}</span>
                      {sneaker.authenticity.certificate && (
                        <Shield className="w-3 h-3 text-green-500" />
                      )}
                      {sneaker.rarity.rating >= 9 && (
                        <Award className="w-3 h-3 text-purple-500" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold tracking-tighter mb-2">{sneaker.name}</h3>
                    <p className="text-3xl font-bold mb-2">{formatCurrency(sneaker.price, currency)}</p>
                    <p className="font-mono text-xs text-gray-400 uppercase">
                      {sneaker.edition} • {sneaker.releaseYear}
                    </p>
                    {sneaker.story && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                        {sneaker.story}
                      </p>
                    )}
                  </motion.div>
                </div>

                {index === 1 && (
                  <motion.div
                    animate={isHovered ? {
                      opacity: [0, 1, 1, 0],
                      scale: [0.8, 1.2, 1.2, 0.8],
                    } : { opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -inset-1 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-blue-500/10 rounded-lg blur-lg pointer-events-none"
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}