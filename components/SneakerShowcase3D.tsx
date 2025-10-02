'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'
import { getFeaturedForShowcase, Product } from '@/lib/products-service'
import { Shield, Award } from 'lucide-react'
import { useCurrencyStore } from '@/lib/currency-store'

export function SneakerShowcase3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const { format: formatPrice } = useCurrencyStore()
  const [sneakers, setSneakers] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

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

  // Charger les produits depuis la DB
  useEffect(() => {
    async function loadShowcaseProducts() {
      const products = await getFeaturedForShowcase(3)
      setSneakers(products)
      setLoading(false)
    }
    loadShowcaseProducts()
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    mouseX.set(x)
    mouseY.set(y)
  }

  if (loading) {
    return (
      <section className="py-20 lg:py-32 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-4">
              CROWN JEWELS
            </h2>
            <p className="font-mono text-sm text-gray-400 tracking-wider">
              THE MOST EXCLUSIVE PIECES IN EXISTENCE
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-800 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-800 rounded mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

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
                      src={sneaker.images[0] || '/placeholder-sneaker.jpg'}
                      alt={sneaker.name}
                      fill
                      className="object-contain p-8 bg-gradient-to-br from-gray-100 to-white"
                      priority={index === 0}
                      quality={95}
                    />
                  </motion.div>

                  {/* Overlay on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered && index === 1 ? 1 : 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: isHovered && index === 1 ? 1 : 0.8 }}
                      className="text-center"
                    >
                      <p className="font-mono text-xs tracking-wider mb-2">EXPLORE</p>
                      <p className="text-2xl font-bold">360° VIEW</p>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Product Info */}
                <div className="p-6 bg-black border border-white/10 border-t-0">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-gray-500">{sneaker.brand}</span>
                      <Shield className="w-3 h-3 text-green-500" />
                      {sneaker.category === 'grail' && (
                        <Award className="w-3 h-3 text-purple-500" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold tracking-tighter mb-2">
                      {sneaker.name}
                    </h3>
                    <p className="text-3xl font-bold mb-2">
                      {formatPrice(sneaker.price)}
                    </p>
                    <p className="font-mono text-xs text-gray-400 uppercase">
                      {sneaker.category === 'grail' ? '1 of 1 - GRAIL' : 'LIMITED EDITION'}
                      {' • '}
                      {sneaker.stock > 0 ? `${sneaker.stock} AVAILABLE` : 'SOLD OUT'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {sneaker.story || sneaker.description}
                    </p>
                  </motion.div>
                </div>

                {/* Glow effect for special items */}
                {index === 1 && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-blue-500/10 rounded-lg blur-lg pointer-events-none" />
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}