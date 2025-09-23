'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Filter, X, Grid, List, TrendingUp, Award, Lock, Shield, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getProducts, getBrands, getCategories, formatCurrency, type ProductData, type ProductFilters, type ProductSort } from '@/lib/product-data'

function SneakersContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const [products, setProducts] = useState<ProductData[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD')
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    brands: [] as string[],
    categories: [] as string[],
    category_types: [] as string[],
    priceRange: [0, 100000] as [number, number],
    sizes: [] as string[],
    in_stock_only: false,
  })

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [productsData, brandsData, categoriesData] = await Promise.all([
          getProducts(
            searchQuery ? { search: searchQuery } : {},
            getSortConfig(sortBy)
          ),
          getBrands(),
          getCategories()
        ])

        setProducts(productsData)
        setBrands(brandsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [searchQuery])

  // Apply filters and sorting when they change
  useEffect(() => {
    const applyFilters = async () => {
      if (loading) return

      setLoading(true)
      try {
        const productFilters: ProductFilters = {}

        if (searchQuery) productFilters.search = searchQuery
        if (filters.brands.length > 0) productFilters.brands = filters.brands
        if (filters.categories.length > 0) productFilters.categories = filters.categories
        if (filters.category_types.length > 0) productFilters.category_types = filters.category_types
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) {
          productFilters.price_range = filters.priceRange
        }
        if (filters.sizes.length > 0) productFilters.sizes = filters.sizes
        if (filters.in_stock_only) productFilters.in_stock_only = true

        const productsData = await getProducts(productFilters, getSortConfig(sortBy))
        setProducts(productsData)
      } catch (error) {
        console.error('Error applying filters:', error)
      } finally {
        setLoading(false)
      }
    }

    applyFilters()
  }, [filters, sortBy])

  const getSortConfig = (sortBy: string): ProductSort => {
    switch (sortBy) {
      case 'price-low':
        return { field: 'base_price', direction: 'asc' }
      case 'price-high':
        return { field: 'base_price', direction: 'desc' }
      case 'rarity':
        return { field: 'rarity_score', direction: 'desc' }
      case 'name':
        return { field: 'name', direction: 'asc' }
      case 'release-date':
        return { field: 'release_date', direction: 'desc' }
      case 'stock':
        return { field: 'total_stock', direction: 'desc' }
      case 'featured':
      default:
        return { field: 'featured_rank', direction: 'asc' }
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-4">
            {searchQuery ? `SEARCH: "${searchQuery.toUpperCase()}"` : 'ICONIC COLLECTION'}
          </h1>
          <p className="font-mono text-sm text-gray-400 tracking-wider">
            {products.length} {searchQuery ? 'RESULTS' : 'LEGENDARY ITEMS'} • AUTHENTICATED • INVESTMENT GRADE
          </p>
          {searchQuery && products.length === 0 && !loading && (
            <div className="mt-8 p-6 border border-white/10 bg-white/5 rounded-lg">
              <p className="text-gray-300 mb-2">No sneakers found for "{searchQuery}"</p>
              <p className="text-gray-400 text-sm">Try searching for different keywords or browse our full collection below.</p>
            </div>
          )}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="lg:w-72 fixed lg:relative inset-y-0 left-0 z-40 bg-black lg:bg-transparent p-6 lg:p-0 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="text-xl font-bold">FILTERS</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-mono text-sm tracking-wider mb-4">BRANDS</h3>
                    <div className="space-y-2">
                      {brands.map(brand => (
                        <label key={brand.slug} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.brands.includes(brand.slug)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({
                                  ...prev,
                                  brands: [...prev.brands, brand.slug]
                                }))
                              } else {
                                setFilters(prev => ({
                                  ...prev,
                                  brands: prev.brands.filter(b => b !== brand.slug)
                                }))
                              }
                            }}
                            className="w-4 h-4 bg-transparent border border-white/30"
                          />
                          <span className="text-sm">{brand.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-mono text-sm tracking-wider mb-4">CATEGORIES</h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <label key={category.slug} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(category.slug)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({
                                  ...prev,
                                  categories: [...prev.categories, category.slug]
                                }))
                              } else {
                                setFilters(prev => ({
                                  ...prev,
                                  categories: prev.categories.filter(c => c !== category.slug)
                                }))
                              }
                            }}
                            className="w-4 h-4 bg-transparent border border-white/30"
                          />
                          <span className="text-sm uppercase">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-mono text-sm tracking-wider mb-4">TYPE</h3>
                    <div className="space-y-2">
                      {['grail', 'exclusive', 'limited', 'rare'].map(type => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.category_types.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({
                                  ...prev,
                                  category_types: [...prev.category_types, type]
                                }))
                              } else {
                                setFilters(prev => ({
                                  ...prev,
                                  category_types: prev.category_types.filter(t => t !== type)
                                }))
                              }
                            }}
                            className="w-4 h-4 bg-transparent border border-white/30"
                          />
                          <span className="text-sm uppercase">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-mono text-sm tracking-wider mb-4">PRICE RANGE</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, priceRange: [0, 1000] }))}
                        className="block w-full text-left text-sm hover:text-white transition-colors"
                      >
                        Under {formatCurrency(1000, currency)}
                      </button>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, priceRange: [1000, 5000] }))}
                        className="block w-full text-left text-sm hover:text-white transition-colors"
                      >
                        {formatCurrency(1000, currency)} - {formatCurrency(5000, currency)}
                      </button>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, priceRange: [5000, 20000] }))}
                        className="block w-full text-left text-sm hover:text-white transition-colors"
                      >
                        {formatCurrency(5000, currency)} - {formatCurrency(20000, currency)}
                      </button>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, priceRange: [20000, 100000] }))}
                        className="block w-full text-left text-sm hover:text-white transition-colors"
                      >
                        Above {formatCurrency(20000, currency)}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-mono text-sm tracking-wider mb-4">AVAILABILITY</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.in_stock_only}
                          onChange={(e) => {
                            setFilters(prev => ({
                              ...prev,
                              in_stock_only: e.target.checked
                            }))
                          }}
                          className="w-4 h-4 bg-transparent border border-white/30"
                        />
                        <span className="text-sm">IN STOCK ONLY</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => setFilters({
                      brands: [],
                      categories: [],
                      category_types: [],
                      priceRange: [0, 100000],
                      sizes: [],
                      in_stock_only: false,
                    })}
                    className="w-full py-2 border border-white/30 font-mono text-sm tracking-wider hover:bg-white hover:text-black transition-colors"
                  >
                    CLEAR ALL
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-white/30 font-mono text-sm"
              >
                <Filter className="w-4 h-4" />
                <span>FILTERS</span>
              </button>

              <div className="flex items-center space-x-4 ml-auto">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR')}
                  className="bg-transparent border border-white/30 px-3 py-2 font-mono text-sm"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border border-white/30 px-4 py-2 font-mono text-sm"
                >
                  <option value="featured">FEATURED</option>
                  <option value="price-low">PRICE: LOW TO HIGH</option>
                  <option value="price-high">PRICE: HIGH TO LOW</option>
                  <option value="rarity">RARITY</option>
                  <option value="release-date">RELEASE DATE</option>
                  <option value="stock">STOCK LEVEL</option>
                  <option value="name">NAME</option>
                </select>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2",
                      viewMode === 'grid' ? 'text-white' : 'text-gray-500'
                    )}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2",
                      viewMode === 'list' ? 'text-white' : 'text-gray-500'
                    )}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-800 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-800 rounded mb-2"></div>
                    <div className="h-4 bg-gray-800 rounded w-2/3 mb-2"></div>
                    <div className="h-6 bg-gray-800 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                layout
                className={cn(
                  "grid gap-6",
                  viewMode === 'grid'
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                )}
              >
                <AnimatePresence>
                  {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "group",
                      viewMode === 'list' && "flex space-x-6"
                    )}
                  >
                    <Link href={`/sneakers/${product.slug}`} className={cn(
                      viewMode === 'list' && "flex space-x-6 flex-1"
                    )}>
                      <div className={cn(
                        "relative overflow-hidden bg-gradient-to-b from-gray-900 to-black",
                        viewMode === 'list' ? "w-48 h-48" : "aspect-square"
                      )}>
                        <Image
                          src={product.images[0]?.url || '/placeholder-sneaker.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
                          {product.category_type === 'grail' && (
                            <motion.span
                              animate={{ opacity: [0.7, 1, 0.7] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-mono font-bold"
                            >
                              GRAIL
                            </motion.span>
                          )}
                          {!product.in_stock && (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-mono font-bold">
                              SOLD OUT
                            </span>
                          )}
                          {product.rarity_score >= 9 && (
                            <span className="px-2 py-1 bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              RARE
                            </span>
                          )}
                          {product.has_authenticity_certificate && (
                            <span className="px-2 py-1 bg-green-500/20 border border-green-500 text-green-500 text-xs font-mono flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                            </span>
                          )}
                          {product.total_stock > 0 && product.total_stock <= 3 && (
                            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-mono font-bold flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              LOW STOCK
                            </span>
                          )}
                        </div>

                        {/* Value Trend */}
                        {product.value_trend_percentage && product.value_trend_percentage > 0 && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm text-green-500 text-xs font-mono flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{product.value_trend_percentage}%
                          </div>
                        )}

                        {/* Edition Badge */}
                        {product.edition_name && (
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-mono">
                            {product.edition_name}
                          </div>
                        )}
                      </div>

                      <div className={cn(
                        "p-4",
                        viewMode === 'grid' && "border border-white/10 border-t-0",
                        viewMode === 'list' && "flex-1 flex flex-col justify-center"
                      )}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono text-gray-500">{product.brand.name}</span>
                          <span className="text-xs font-mono text-gray-400">{product.release_year}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                        <p className="text-xs text-gray-400 mb-2">{product.colorway}</p>

                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-2xl font-bold">{formatCurrency(product.base_price, currency)}</p>
                            {product.resale_value && product.resale_value > product.base_price && (
                              <p className="text-xs text-gray-500">
                                Resale: {formatCurrency(product.resale_value, currency)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <span>Rarity</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={cn(
                                      "w-1.5 h-1.5 rounded-full",
                                      i < Math.ceil(product.rarity_score / 2)
                                        ? "bg-yellow-500"
                                        : "bg-gray-700"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                            {product.in_stock && (
                              <p className="text-xs text-gray-500 mt-1">
                                {product.total_stock} available
                              </p>
                            )}
                          </div>
                        </div>

                        {product.short_description && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                            {product.short_description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SneakersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 animate-pulse mx-auto mb-4 text-white" />
          <p className="text-white">Loading sneakers...</p>
        </div>
      </div>
    }>
      <SneakersContent />
    </Suspense>
  )
}