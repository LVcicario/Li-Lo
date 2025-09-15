'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Heart, Share2, Star, Shield, Truck, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { iconicSneakers, formatCurrency } from '@/lib/sneaker-data'
import { useParams } from 'next/navigation'

export default function SneakerDetailPage() {
  const params = useParams()
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD')

  // Find the sneaker by ID from our real data
  const sneakerData = iconicSneakers.find(s => s.id === params.id) || iconicSneakers[0]

  const sneaker = {
    ...sneakerData,
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
    availableSizes: [8, 9, 10, 11], // Some sizes might be sold out
    sku: `LI-${sneakerData.brand.slice(0,2)}-${sneakerData.id}`,
    features: [
      `Authentic ${sneakerData.authenticity.verifiedBy} certification`,
      `Only ${sneakerData.rarity.produced} pairs ever made`,
      `Premium ${sneakerData.materials?.join(', ') || 'leather and suede'} construction`,
      `Released in ${sneakerData.releaseYear}`,
      `Current value trend: +${sneakerData.valueTrend.percentage}%`
    ]
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }
    console.log('Adding to cart:', { sneaker, size: selectedSize, quantity })
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="container mx-auto px-4 lg:px-8">
        <Link
          href="/sneakers"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-sm">BACK TO SNEAKERS</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square bg-gradient-to-b from-gray-900 to-black overflow-hidden"
            >
              <Image
                src={sneaker.images[selectedImage]}
                alt={sneaker.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
              >
                <Heart className={cn("w-5 h-5", isWishlisted && "fill-red-500 text-red-500")} />
              </button>
            </motion.div>

            <div className="grid grid-cols-4 gap-2">
              {sneaker.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative aspect-square overflow-hidden border-2 transition-all",
                    selectedImage === index
                      ? "border-white"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${sneaker.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-mono text-gray-500">{sneaker.brand}</span>
                <span className="text-xs font-mono text-gray-500">•</span>
                <span className="text-xs font-mono text-gray-500">{sneaker.category}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-2">
                {sneaker.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn(
                      "w-4 h-4",
                      i < Math.ceil(sneaker.rarity.rating / 2)
                        ? "fill-white text-white"
                        : "text-gray-600"
                    )} />
                  ))}
                </div>
                <span className="text-sm text-gray-400">Rarity: {sneaker.rarity.rating}/10</span>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold">{formatCurrency(sneaker.price, currency)}</p>
                {sneaker.resaleValue > sneaker.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Resale Value:</span>
                    <span className="text-lg font-semibold text-green-500">
                      {formatCurrency(sneaker.resaleValue, currency)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-gray-400 leading-relaxed">{sneaker.story}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {sneaker.category === 'grail' && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-mono font-bold">
                    GRAIL
                  </span>
                )}
                {sneaker.authenticity.certificate && (
                  <span className="px-3 py-1 bg-green-500/20 border border-green-500 text-green-500 text-xs font-mono flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    CERTIFIED
                  </span>
                )}
                <span className="px-3 py-1 bg-white/10 text-white text-xs font-mono uppercase">
                  {sneaker.category}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-mono text-sm tracking-wider mb-4">SELECT SIZE</h3>
              <div className="grid grid-cols-5 gap-2">
                {sneaker.sizes.map((size) => {
                  const isAvailable = sneaker.availableSizes.includes(size)
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={cn(
                        "py-3 border font-mono text-sm transition-all",
                        selectedSize === size
                          ? "bg-white text-black border-white"
                          : isAvailable
                          ? "border-white/30 hover:border-white"
                          : "border-white/10 text-gray-600 cursor-not-allowed"
                      )}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
              <Link
                href="/size-guide"
                className="inline-block mt-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Size Guide
              </Link>
            </div>

            <div>
              <h3 className="font-mono text-sm tracking-wider mb-4">QUANTITY</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-white/30 hover:bg-white hover:text-black transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-white/30 hover:bg-white hover:text-black transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full py-4 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>ADD TO CART</span>
              </motion.button>

              <button className="w-full py-4 border border-white/30 font-mono text-sm tracking-wider hover:bg-white hover:text-black transition-colors flex items-center justify-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>SHARE</span>
              </button>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-mono text-sm">100% AUTHENTIC</p>
                  <p className="text-xs text-gray-500">Verified by our experts</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-mono text-sm">FREE WORLDWIDE SHIPPING</p>
                  <p className="text-xs text-gray-500">On orders over $10,000</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-mono text-sm">14-DAY RETURNS</p>
                  <p className="text-xs text-gray-500">No questions asked</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h3 className="font-mono text-sm tracking-wider mb-4">PRODUCT DETAILS</h3>
              <dl className="space-y-2">
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-400">SKU</dt>
                  <dd className="font-mono">{sneaker.sku}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-400">Color</dt>
                  <dd className="font-mono">{sneaker.color}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-400">Materials</dt>
                  <dd className="font-mono">{sneaker.materials?.join(', ') || 'Premium Leather'}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-400">Release Year</dt>
                  <dd className="font-mono">{sneaker.releaseYear}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-400">Edition</dt>
                  <dd className="font-mono">{sneaker.edition}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-400">Rarity Rating</dt>
                  <dd className="font-mono">{sneaker.rarity.rating}/10</dd>
                </div>
              </dl>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h3 className="font-mono text-sm tracking-wider mb-4">KEY FEATURES</h3>
              <ul className="space-y-2">
                {sneaker.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <span className="text-gray-400">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}