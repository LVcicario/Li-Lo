'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react'
import { iconicSneakers, formatCurrency } from '@/lib/sneaker-data'

interface SearchResult {
  id: string
  name: string
  brand: string
  price: number
  image: string
  category: string
  href: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Popular searches
  const popularSearches = ['Jordan', 'Yeezy', 'Travis Scott', 'Off-White', 'Dunk', 'Air Force']

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Perform search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // Simulate API delay
    const timeoutId = setTimeout(() => {
      const searchResults = iconicSneakers
        .filter(sneaker =>
          sneaker.name.toLowerCase().includes(query.toLowerCase()) ||
          sneaker.brand.toLowerCase().includes(query.toLowerCase()) ||
          sneaker.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
        .map(sneaker => ({
          id: sneaker.id.toString(),
          name: sneaker.name,
          brand: sneaker.brand,
          price: sneaker.price,
          image: sneaker.images[0],
          category: sneaker.category,
          href: `/sneakers/${sneaker.id}`
        }))

      setResults(searchResults)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // Add to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))

    // Navigate to search results
    window.location.href = `/sneakers?q=${encodeURIComponent(searchQuery)}`
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-0 z-50 mx-4 mt-20 max-w-3xl lg:mx-auto"
          >
            <div className="bg-black border border-white/20 rounded-lg shadow-2xl">
              {/* Search Header */}
              <div className="flex items-center p-4 border-b border-white/10">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && query.trim()) {
                      handleSearch(query)
                    }
                    if (e.key === 'Escape') {
                      onClose()
                    }
                  }}
                  placeholder="Search sneakers, brands, or styles..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 text-lg outline-none"
                />
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Content */}
              <div className="max-h-96 overflow-y-auto">
                {query.trim() === '' ? (
                  <div className="p-6">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-mono text-sm text-gray-400">RECENT SEARCHES</h3>
                          <button
                            onClick={clearRecentSearches}
                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="space-y-2">
                          {recentSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => handleSearch(search)}
                              className="block w-full text-left p-2 hover:bg-white/5 rounded transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <Search className="w-4 h-4 text-gray-500" />
                                <span>{search}</span>
                                <ArrowRight className="w-4 h-4 text-gray-500 ml-auto" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Searches */}
                    <div>
                      <div className="flex items-center mb-4">
                        <TrendingUp className="w-4 h-4 text-gray-400 mr-2" />
                        <h3 className="font-mono text-sm text-gray-400">TRENDING SEARCHES</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleSearch(term)}
                            className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-sm transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    {isSearching ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <span className="ml-3 text-gray-400">Searching...</span>
                      </div>
                    ) : results.length > 0 ? (
                      <>
                        <div className="mb-4">
                          <p className="font-mono text-sm text-gray-400">
                            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                          </p>
                        </div>
                        <div className="space-y-3">
                          {results.map((result) => (
                            <Link
                              key={result.id}
                              href={result.href}
                              onClick={() => {
                                handleSearch(query)
                                onClose()
                              }}
                              className="flex items-center space-x-3 p-3 hover:bg-white/5 rounded-lg transition-colors group"
                            >
                              <div className="relative w-16 h-16 bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={result.image}
                                  alt={result.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate group-hover:text-white transition-colors">
                                  {result.name}
                                </h4>
                                <p className="text-sm text-gray-400">{result.brand}</p>
                                <p className="text-sm font-mono">{formatCurrency(result.price, 'USD')}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                            </Link>
                          ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/10">
                          <button
                            onClick={() => handleSearch(query)}
                            className="w-full p-3 bg-white text-black font-mono text-sm hover:bg-gray-200 transition-colors"
                          >
                            VIEW ALL RESULTS FOR "{query.toUpperCase()}"
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No results found</h3>
                        <p className="text-gray-400 text-sm">
                          Try searching for different keywords or check your spelling
                        </p>
                        <div className="mt-4">
                          <Link
                            href="/sneakers"
                            onClick={onClose}
                            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors text-sm"
                          >
                            Browse All Sneakers
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}