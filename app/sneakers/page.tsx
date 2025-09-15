'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Filter, X, Grid, List, TrendingUp, Award, Lock, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { iconicSneakers, formatCurrency, type SneakerData } from '@/lib/sneaker-data'

export default function SneakersPage() {
  const [sneakers, setSneakers] = useState<SneakerData[]>([])
  const [filteredSneakers, setFilteredSneakers] = useState<SneakerData[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD')
  const [filters, setFilters] = useState({
    brands: [] as string[],
    categories: [] as string[],
    priceRange: [0, 10000000],
    sizes: [] as number[],
  })

  useEffect(() => {
    setSneakers(iconicSneakers)
    setFilteredSneakers(iconicSneakers)
  }, [])

  useEffect(() => {
    let result = [...sneakers]

    if (filters.brands.length > 0) {
      result = result.filter(s => filters.brands.includes(s.brand))
    }
    if (filters.categories.length > 0) {
      result = result.filter(s => filters.categories.includes(s.category))
    }

    result = result.filter(s => s.price >= filters.priceRange[0] && s.price <= filters.priceRange[1])

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rarity':
        result.sort((a, b) => b.rarity.rating - a.rarity.rating)
        break
      case 'trending':
        result.sort((a, b) => b.valueTrend.percentage - a.valueTrend.percentage)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'featured':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    setFilteredSneakers(result)
  }, [filters, sortBy, sneakers])

  const uniqueBrands = Array.from(new Set(sneakers.map(s => s.brand)))
  const uniqueCategories = Array.from(new Set(sneakers.map(s => s.category)))

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-4">
            ICONIC COLLECTION
          </h1>
          <p className="font-mono text-sm text-gray-400 tracking-wider">
            {filteredSneakers.length} LEGENDARY ITEMS • AUTHENTICATED • INVESTMENT GRADE
          </p>
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
                      {uniqueBrands.map(brand => (
                        <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.brands.includes(brand)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({
                                  ...prev,
                                  brands: [...prev.brands, brand]
                                }))
                              } else {
                                setFilters(prev => ({
                                  ...prev,
                                  brands: prev.brands.filter(b => b !== brand)
                                }))
                              }
                            }}
                            className="w-4 h-4 bg-transparent border border-white/30"
                          />
                          <span className="text-sm">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-mono text-sm tracking-wider mb-4">CATEGORIES</h3>
                    <div className="space-y-2">
                      {uniqueCategories.map(category => (
                        <label key={category} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({
                                  ...prev,
                                  categories: [...prev.categories, category]
                                }))
                              } else {
                                setFilters(prev => ({
                                  ...prev,
                                  categories: prev.categories.filter(c => c !== category)
                                }))
                              }
                            }}
                            className="w-4 h-4 bg-transparent border border-white/30"
                          />
                          <span className="text-sm uppercase">{category}</span>
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
                        onClick={() => setFilters(prev => ({ ...prev, priceRange: [20000, 10000000] }))}
                        className="block w-full text-left text-sm hover:text-white transition-colors"
                      >
                        Above {formatCurrency(20000, currency)}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setFilters({
                      brands: [],
                      categories: [],
                      priceRange: [0, 10000000],
                      sizes: []
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
                  <option value="trending">TRENDING</option>
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
                {filteredSneakers.map((sneaker, index) => (
                  <motion.div
                    key={sneaker.id}
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
                    <Link href={`/sneakers/${sneaker.id}`} className={cn(
                      viewMode === 'list' && "flex space-x-6 flex-1"
                    )}>
                      <div className={cn(
                        "relative overflow-hidden bg-gradient-to-b from-gray-900 to-black",
                        viewMode === 'list' ? "w-48 h-48" : "aspect-square"
                      )}>
                        <Image
                          src={sneaker.images[0]}
                          alt={sneaker.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
                          {sneaker.category === 'grail' && (
                            <motion.span
                              animate={{ opacity: [0.7, 1, 0.7] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-mono font-bold"
                            >
                              GRAIL
                            </motion.span>
                          )}
                          {sneaker.stock === 0 && (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-mono font-bold">
                              SOLD OUT
                            </span>
                          )}
                          {sneaker.rarity.rating >= 9 && (
                            <span className="px-2 py-1 bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              RARE
                            </span>
                          )}
                          {sneaker.authenticity.certificate && (
                            <span className="px-2 py-1 bg-green-500/20 border border-green-500 text-green-500 text-xs font-mono flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        {/* Value Trend */}
                        {sneaker.valueTrend.percentage > 0 && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm text-green-500 text-xs font-mono flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{sneaker.valueTrend.percentage}%
                          </div>
                        )}

                        {/* Edition Badge */}
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-mono">
                          {sneaker.edition}
                        </div>
                      </div>

                      <div className={cn(
                        "p-4",
                        viewMode === 'grid' && "border border-white/10 border-t-0",
                        viewMode === 'list' && "flex-1 flex flex-col justify-center"
                      )}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono text-gray-500">{sneaker.brand}</span>
                          <span className="text-xs font-mono text-gray-400">{sneaker.releaseYear}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{sneaker.name}</h3>
                        <p className="text-xs text-gray-400 mb-2">{sneaker.color}</p>

                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-2xl font-bold">{formatCurrency(sneaker.price, currency)}</p>
                            {sneaker.resaleValue > sneaker.price && (
                              <p className="text-xs text-gray-500">
                                Resale: {formatCurrency(sneaker.resaleValue, currency)}
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
                                      i < Math.ceil(sneaker.rarity.rating / 2)
                                        ? "bg-yellow-500"
                                        : "bg-gray-700"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                            {sneaker.stock > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                {sneaker.stock} available
                              </p>
                            )}
                          </div>
                        </div>

                        {sneaker.story && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                            {sneaker.story}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}