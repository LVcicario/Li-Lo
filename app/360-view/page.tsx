'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, Rotate3d, Star, Zap } from 'lucide-react'
import Product360Viewer from '@/components/Product360Viewer'
import { getProductsWith360Support, getProductImages } from '@/lib/product-360'
import { formatCurrency } from '@/lib/sneaker-data'

interface Product360 {
  id: string
  name: string
  base_price: number
  primary_image_url: string
  images_360_count: number
  rarity_score: number
  brand_id: string
  slug: string
}

export default function View360Page() {
  const [products, setProducts] = useState<Product360[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product360 | null>(null)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const productsData = await getProductsWith360Support()
        setProducts(productsData)

        if (productsData.length > 0) {
          const firstProduct = productsData[0]
          setSelectedProduct(firstProduct)

          // Charger les images 360° du premier produit
          const imageData = await getProductImages(firstProduct.id)
          if (imageData.has360View) {
            setSelectedImages(imageData.images360.map(img => img.url))
          }
        }
      } catch (error) {
        console.error('Error loading 360° products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handleProductSelect = async (product: Product360) => {
    setSelectedProduct(product)

    try {
      const imageData = await getProductImages(product.id)
      if (imageData.has360View) {
        setSelectedImages(imageData.images360.map(img => img.url))
      }
    } catch (error) {
      console.error('Error loading product images:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Rotate3d className="w-16 h-16 animate-spin text-white mx-auto mb-4" />
          <p className="text-white font-mono tracking-wider">LOADING 360° EXPERIENCE...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <Rotate3d className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-mono">
                360° VIEW
              </h1>
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-gray-400 font-mono tracking-wider max-w-2xl mx-auto">
              EXPERIENCE OUR PREMIUM SNEAKERS IN IMMERSIVE 360° DETAIL
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-blue-400 font-mono">
                <Zap className="w-4 h-4" />
                DRAG TO ROTATE
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-400 font-mono">
                <Star className="w-4 h-4" />
                AUTHENTIC PRODUCTS
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Product List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold mb-6 font-mono tracking-wider">
                360° PRODUCTS
              </h2>

              <div className="space-y-4">
                {products.map((product, index) => (
                  <motion.button
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleProductSelect(product)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      selectedProduct?.id === product.id
                        ? 'border-blue-400 bg-blue-400/10'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Rotate3d className="w-5 h-5 text-blue-400" />
                      <span className="font-mono text-xs text-blue-400">
                        {product.images_360_count} VIEWS
                      </span>
                    </div>

                    <h3 className="font-bold text-sm mb-1 line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">
                        {formatCurrency(product.base_price, 'USD')}
                      </span>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < (product.rarity_score || 0) / 2
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-8">
                  <Rotate3d className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-mono text-sm">
                    NO 360° PRODUCTS AVAILABLE
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* 360° Viewer */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6"
            >
              {selectedProduct && selectedImages.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold font-mono tracking-wider">
                        {selectedProduct.name}
                      </h2>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-3xl font-bold">
                          {formatCurrency(selectedProduct.base_price, 'USD')}
                        </span>
                        <div className="flex items-center gap-1">
                          <Rotate3d className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-blue-400 font-mono">
                            {selectedImages.length} ANGLES
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/sneakers/${selectedProduct.slug}`}
                      className="bg-white text-black px-6 py-3 font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors rounded-lg"
                    >
                      VIEW DETAILS
                    </Link>
                  </div>

                  <div className="aspect-square max-w-2xl mx-auto">
                    <Product360Viewer
                      images={selectedImages}
                      productName={selectedProduct.name}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-gray-400 font-mono">
                      <Eye className="w-4 h-4" />
                      DRAG TO ROTATE • SPACE TO AUTO-ROTATE • ARROWS TO NAVIGATE
                    </div>
                  </div>
                </>
              ) : (
                <div className="aspect-square flex items-center justify-center text-center">
                  <div>
                    <Rotate3d className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">SELECT A PRODUCT</h3>
                    <p className="text-gray-400 font-mono text-sm">
                      CHOOSE A SNEAKER TO EXPERIENCE 360° VIEW
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <Rotate3d className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 font-mono">360° ROTATION</h3>
            <p className="text-gray-400 text-sm">
              Drag to rotate and see every angle of your future grail
            </p>
          </div>

          <div className="text-center">
            <Eye className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 font-mono">PREMIUM DETAIL</h3>
            <p className="text-gray-400 text-sm">
              Inspect authentic materials and craftsmanship up close
            </p>
          </div>

          <div className="text-center">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 font-mono">AUTHENTIC PRODUCTS</h3>
            <p className="text-gray-400 text-sm">
              Every sneaker verified by our authentication team
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}