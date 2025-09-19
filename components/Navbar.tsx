'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag, Search, Globe, DollarSign, User, Shield, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { useAuthStore } from '@/lib/auth-store'
import { SearchModal } from '@/components/SearchModal'
import { useLanguageStore } from '@/lib/i18n'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { getTotalItems, toggleCart } = useCartStore()
  const { user, isAdmin, isSeller } = useAuthStore()
  const { currentLanguage, setLanguage, t, initializeLanguage } = useLanguageStore()
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    useCartStore.persist.rehydrate()
    initializeLanguage()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/collections', label: t('nav.collections') },
    { href: '/sneakers', label: t('nav.allSneakers') },
    { href: '/exclusive', label: t('nav.exclusive') },
    { href: '/limited-edition', label: t('nav.limitedEdition') },
    { href: '/about', label: t('nav.about') },
  ]

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass-effect py-4" : "bg-transparent py-6"
      )}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="group">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <span className="text-2xl lg:text-3xl font-bold tracking-tighter">
                  LI-LO
                </span>
                <span className="text-xs font-mono text-gray-400 hidden lg:block">
                  ULTRA.RARE
                </span>
              </motion.div>
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-mono tracking-wider hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden lg:block">
                <button
                  onClick={() => {
                    setShowLangMenu(!showLangMenu)
                    setShowCurrencyMenu(false)
                  }}
                  className="flex items-center space-x-1 px-3 py-2 hover:bg-white/10 rounded-full transition-colors text-sm font-mono"
                >
                  <Globe className="w-4 h-4" />
                  <span>{currentLanguage.toUpperCase()}</span>
                </button>
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 bg-black border border-white/20 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setLanguage('en')
                          setShowLangMenu(false)
                        }}
                        className={cn(
                          "block w-full px-4 py-2 text-left hover:bg-white/10 text-sm",
                          currentLanguage === 'en' && 'bg-white/10'
                        )}
                      >
                        🇬🇧 English
                      </button>
                      <button
                        onClick={() => {
                          setLanguage('fr')
                          setShowLangMenu(false)
                        }}
                        className={cn(
                          "block w-full px-4 py-2 text-left hover:bg-white/10 text-sm",
                          currentLanguage === 'fr' && 'bg-white/10'
                        )}
                      >
                        🇫🇷 Français
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative hidden lg:block">
                <button
                  onClick={() => {
                    setShowCurrencyMenu(!showCurrencyMenu)
                    setShowLangMenu(false)
                  }}
                  className="flex items-center space-x-1 px-3 py-2 hover:bg-white/10 rounded-full transition-colors text-sm font-mono"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{currency}</span>
                </button>
                <AnimatePresence>
                  {showCurrencyMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 bg-black border border-white/20 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setCurrency('USD')
                          setShowCurrencyMenu(false)
                        }}
                        className={cn(
                          "block w-full px-4 py-2 text-left hover:bg-white/10 text-sm",
                          currency === 'USD' && 'bg-white/10'
                        )}
                      >
                        $ USD
                      </button>
                      <button
                        onClick={() => {
                          setCurrency('EUR')
                          setShowCurrencyMenu(false)
                        }}
                        className={cn(
                          "block w-full px-4 py-2 text-left hover:bg-white/10 text-sm",
                          currency === 'EUR' && 'bg-white/10'
                        )}
                      >
                        € EUR
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setShowSearch(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Search sneakers"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Role-based navigation */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                  title="Admin Dashboard"
                >
                  <Shield className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                </Link>
              )}
              {isSeller && !isAdmin && (
                <Link
                  href="/seller"
                  className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                  title="Seller Dashboard"
                >
                  <Package className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                </Link>
              )}
              <Link
                href={user ? '/account/dashboard' : '/auth/login'}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                onClick={toggleCart}
                className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-black z-40 lg:hidden"
          >
            <div className="flex flex-col h-full pt-20 px-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-4 text-2xl font-mono tracking-wider hover:text-accent transition-colors border-b border-white/10"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  )
}