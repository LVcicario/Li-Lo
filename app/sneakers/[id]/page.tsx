'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Heart, Share2, Star, Shield, Truck, RefreshCw, Package, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getProduct, type ProductData } from '@/lib/product-data'
import { useParams } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import { useCurrencyStore } from '@/lib/currency-store'
import { WishlistButton } from '@/components/WishlistButton'
import { toast } from 'sonner'

export default function SneakerDetailPage() {
  const params = useParams()
  const { addItem } = useCartStore()
  const { format: formatPrice } = useCurrencyStore()
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      try {
        const productData = await getProduct(params.id as string)
        setProduct(productData)
      } catch (error) {
        console.error('Error loading product:', error)
        toast.error('Product not found')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadProduct()
    }
  }, [params.id])

  // Update selected variant when size changes
  useEffect(() => {
    if (product && selectedSize) {
      const variant = product.variants.find(v => v.size === selectedSize && v.is_active)
      setSelectedVariant(variant)
    }
  }, [product, selectedSize])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white font-mono tracking-wider">LOADING PRODUCT...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4 font-mono">PRODUCT NOT FOUND</h1>
          <p className="text-gray-400 mb-6">This legendary piece doesn't exist in our vault</p>
          <Link
            href="/sneakers"
            className="bg-white text-black px-6 py-3 font-mono tracking-wider hover:bg-gray-200 transition-colors"
          >
            BROWSE COLLECTION
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedVariant) {
      toast.error('Please select a size')
      return
    }

    if (selectedVariant.stock_quantity < quantity) {
      toast.error(`Only ${selectedVariant.stock_quantity} items available in this size`)
      return
    }

    setAddingToCart(true)
    try {
      await addItem({
        product_id: product.id,
        variant_id: selectedVariant.id,
        name: product.name,
        brand: product.brand.name,
        price: product.base_price,
        size: selectedSize,
        quantity: quantity,
        image: product.images[0]?.url || '',
        sku: selectedVariant.sku,
        max_quantity: selectedVariant.stock_quantity
      })

      toast.success(`Added ${product.name} (Size ${selectedSize}) to cart`)
    } catch (error: any) {
      console.error('Failed to add item to cart:', error)
      toast.error(error.message || 'Failed to add item to cart')
    } finally {
      setAddingToCart(false)
    }
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
                src={product.images[selectedImage]?.url || '/placeholder-sneaker.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
              <WishlistButton
                productId={product.id}
                productName={product.name}
                className="absolute top-4 right-4"
                size="md"
              />

              {/* Stock indicator */}
              {!product.in_stock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-2xl font-mono font-bold">SOLD OUT</span>
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
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
                    src={image.url}
                    alt={image.alt_text || `${product.name} ${index + 1}`}
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
                <span className="text-xs font-mono text-gray-500">{product.brand.name}</span>
                <span className="text-xs font-mono text-gray-500">•</span>
                <span className="text-xs font-mono text-gray-500">{product.category.name}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn(
                      "w-4 h-4",
                      i < Math.ceil(product.rarity_score / 2)
                        ? "fill-white text-white"
                        : "text-gray-600"
                    )} />
                  ))}
                </div>
                <span className="text-sm text-gray-400">Rarity: {product.rarity_score}/10</span>
                {product.total_stock > 0 && (
                  <div className="flex items-center gap-1 text-sm text-green-400">
                    <Package className="w-4 h-4" />
                    <span>{product.total_stock} in stock</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold">{formatPrice(product.base_price)}</p>
                {product.resale_value && product.resale_value > product.base_price && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Resale Value:</span>
                    <span className="text-lg font-semibold text-green-500">
                      {formatPrice(product.resale_value)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-gray-400 leading-relaxed">{product.story}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.category_type === 'grail' && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-mono font-bold">
                    GRAIL
                  </span>
                )}
                {product.has_authenticity_certificate && (
                  <span className="px-3 py-1 bg-green-500/20 border border-green-500 text-green-500 text-xs font-mono flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    CERTIFIED
                  </span>
                )}
                <span className="px-3 py-1 bg-white/10 text-white text-xs font-mono uppercase">
                  {product.category_type}
                </span>
                {product.is_limited_edition && (
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500 text-purple-500 text-xs font-mono">
                    LIMITED EDITION
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-mono text-sm tracking-wider mb-4">SELECT SIZE</h3>
              <div className="grid grid-cols-5 gap-2">
                {product.variants
                  .filter(variant => variant.is_active)
                  .sort((a, b) => parseFloat(a.size) - parseFloat(b.size))
                  .map((variant) => {
                    const isAvailable = variant.stock_quantity > 0
                    const isSelected = selectedSize === variant.size
                    return (
                      <div key={variant.id} className="relative">
                        <button
                          onClick={() => isAvailable && setSelectedSize(variant.size)}
                          disabled={!isAvailable}
                          className={cn(
                            "w-full py-3 border font-mono text-sm transition-all relative",
                            isSelected
                              ? "bg-white text-black border-white"
                              : isAvailable
                              ? "border-white/30 hover:border-white"
                              : "border-white/10 text-gray-600 cursor-not-allowed"
                          )}
                        >
                          {variant.size}
                          {isAvailable && variant.stock_quantity <= 3 && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                          )}
                        </button>
                        {isAvailable && (
                          <div className="text-xs text-gray-500 text-center mt-1">
                            {variant.stock_quantity} left
                          </div>
                        )}
                      </div>
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
                  disabled={quantity <= 1}
                  className="w-10 h-10 border border-white/30 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="w-12 text-center font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!selectedVariant || quantity >= selectedVariant.stock_quantity}
                  className="w-10 h-10 border border-white/30 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              {selectedVariant && (
                <p className="text-xs text-gray-500 mt-2">
                  Max quantity: {selectedVariant.stock_quantity}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.in_stock || !selectedSize || addingToCart}
                className="w-full py-4 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>ADDING...</span>
                  </>
                ) : !product.in_stock ? (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    <span>SOLD OUT</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>ADD TO CART</span>
                  </>
                )}
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
                  <dd className="font-mono">{product.sku}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-400">Color</dt>
                  <dd className="font-mono">{product.colorway}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-400">Materials</dt>
                  <dd className="font-mono">{product.material}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-400">Release Year</dt>
                  <dd className="font-mono">{product.release_year}</dd>
                </div>
                {product.edition_name && (
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-400">Edition</dt>
                    <dd className="font-mono">{product.edition_name}</dd>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-400">Rarity Rating</dt>
                  <dd className="font-mono">{product.rarity_score}/10</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-400">Total Stock</dt>
                  <dd className="font-mono">{product.total_stock} pairs</dd>
                </div>
                {product.total_produced && (
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-400">Total Produced</dt>
                    <dd className="font-mono">{product.total_produced.toLocaleString()} pairs</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h3 className="font-mono text-sm tracking-wider mb-4">KEY FEATURES</h3>
              <ul className="space-y-2">
                {product.has_authenticity_certificate && (
                  <li className="flex items-start space-x-2 text-sm">
                    <span className="text-gray-400">•</span>
                    <span>Authentic {product.verified_by || 'Li-Lo'} certification</span>
                  </li>
                )}
                {product.total_produced && (
                  <li className="flex items-start space-x-2 text-sm">
                    <span className="text-gray-400">•</span>
                    <span>Only {product.total_produced.toLocaleString()} pairs ever made</span>
                  </li>
                )}
                <li className="flex items-start space-x-2 text-sm">
                  <span className="text-gray-400">•</span>
                  <span>Premium {product.material} construction</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <span className="text-gray-400">•</span>
                  <span>Released in {product.release_year}</span>
                </li>
                {product.value_trend_percentage && product.value_trend_percentage > 0 && (
                  <li className="flex items-start space-x-2 text-sm">
                    <span className="text-gray-400">•</span>
                    <span>Current value trend: +{product.value_trend_percentage}%</span>
                  </li>
                )}
                {product.is_limited_edition && (
                  <li className="flex items-start space-x-2 text-sm">
                    <span className="text-gray-400">•</span>
                    <span>Limited edition release</span>
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}