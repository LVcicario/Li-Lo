'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguageStore } from '@/lib/i18n'
import { getFeaturedProducts, Product } from '@/lib/products-service'

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const { t } = useLanguageStore()

  // Charger les vraies données de la DB
  useEffect(() => {
    async function loadProducts() {
      const featuredProducts = await getFeaturedProducts(3)
      setProducts(featuredProducts)
    }
    loadProducts()
  }, [])

  // Utiliser les vraies données produits ou fallback sur les données par défaut
  const slides = products.length > 0 ? products.map((product) => ({
    title: product.name.split(' ').slice(0, 2).join(' ').toUpperCase(),
    subtitle: product.category.toUpperCase(),
    description: product.name.toUpperCase(),
    image: product.images[0] || '/placeholder-sneaker.jpg',
    cta: t('hero.shopNow'),
    productId: product.id
  })) : [
    {
      title: t('pages.home.heroTitle'),
      subtitle: t('pages.home.heroSubtitle'),
      description: t('pages.home.heroDescription'),
      image: '/placeholder-sneaker.jpg',
      cta: t('hero.shopNow'),
      productId: null
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: currentSlide === index ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
          <motion.img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: currentSlide === index ? 1 : 1.2 }}
            transition={{ duration: 10, ease: 'linear' }}
          />
        </motion.div>
      ))}

      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-white text-white mx-1" />
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-sm tracking-[0.3em] text-gray-300 mb-4"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6"
            >
              {slides[currentSlide].title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-mono text-sm lg:text-base tracking-wider text-gray-400 mb-12"
            >
              {slides[currentSlide].description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href={slides[currentSlide].productId ? `/sneakers/${slides[currentSlide].productId}` : "/collections"}
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-all duration-300"
              >
                {slides[currentSlide].cta}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href="/sneakers"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/30 font-mono text-sm tracking-wider hover:bg-white/10 transition-all duration-300"
              >
                LEARN MORE
              </Link>
            </motion.div>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-12 h-1 transition-all duration-300 ${
                  currentSlide === index ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 right-10 z-30 hidden lg:block"
      >
        <p className="font-mono text-xs text-gray-500">
          MIAMI 25.7617° N, 80.1918° W
        </p>
      </motion.div>
    </section>
  )
}