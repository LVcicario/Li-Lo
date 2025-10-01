'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useLanguageStore } from '@/lib/i18n'
import { useState, useEffect } from 'react'
import { getAllProducts, Product } from '@/lib/products-service'

export function CategoryShowcase() {
  const { t } = useLanguageStore()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      try {
        const products = await getAllProducts()

        // Compter les produits par catégorie
        const categoryData: { [key: string]: { count: number, image: string } } = {
          'grail': { count: 0, image: '' },
          'exclusive': { count: 0, image: '' },
          'limited': { count: 0, image: '' }
        }

        products.forEach((product: Product) => {
          if (product.category === 'grail' || product.category === 'exclusive' || product.category === 'limited') {
            categoryData[product.category].count++
            // Prendre la première image de chaque catégorie
            if (!categoryData[product.category].image && product.images[0]) {
              categoryData[product.category].image = product.images[0]
            }
          }
        })

        const categoriesArray = [
          {
            name: t('categories.grail'),
            description: t('categories.grailDescription'),
            image: categoryData['grail'].image || '/placeholder-sneaker.jpg',
            href: "/sneakers?category=grail",
            count: `${categoryData['grail'].count} ${t('categories.items')}`
          },
          {
            name: t('categories.exclusive'),
            description: t('categories.exclusiveDescription'),
            image: categoryData['exclusive'].image || '/placeholder-sneaker.jpg',
            href: "/sneakers?category=exclusive",
            count: `${categoryData['exclusive'].count} ${t('categories.items')}`
          },
          {
            name: t('categories.limited'),
            description: t('categories.limitedDescription'),
            image: categoryData['limited'].image || '/placeholder-sneaker.jpg',
            href: "/sneakers",
            count: `${products.length} ${t('categories.totalItems')}`
          }
        ]

        setCategories(categoriesArray)
        setLoading(false)
      } catch (error) {
        console.error('Error loading categories:', error)
        // Fallback sur des catégories par défaut
        setCategories([
          {
            name: "EXCLUSIVE",
            description: "BEYOND LIMITS",
            image: "/placeholder-sneaker.jpg",
            href: "/sneakers",
            count: "0 ITEMS"
          },
          {
            name: "LIMITED EDITION",
            description: "HANDPICKED EXCELLENCE",
            image: "/placeholder-sneaker.jpg",
            href: "/sneakers",
            count: "0 ITEMS"
          },
          {
            name: "ICONIC COLLECTION",
            description: "LEGENDARY ITEMS",
            image: "/placeholder-sneaker.jpg",
            href: "/sneakers",
            count: "0 LEGENDS"
          }
        ])
        setLoading(false)
      }
    }
    loadCategories()
  }, [t])

  if (loading) {
    return (
      <section className="py-20 lg:py-32 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-4">
              {t('collections.title')}
            </h2>
            <p className="font-mono text-sm text-gray-400 tracking-wider">
              Loading...
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-800 rounded-lg h-96" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-4">
            {t('collections.title')}
          </h2>
          <p className="font-mono text-sm text-gray-400 tracking-wider">
            {t('collections.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {categories.map((category: any, index: number) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={category.href} className="group block relative overflow-hidden">
                <div className="aspect-[4/5] relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    quality={95}
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <span className="font-mono text-xs text-gray-400 mb-2">{category.count}</span>
                    <h3 className="text-3xl font-bold tracking-tighter mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{category.description}</p>
                    <div className="flex items-center space-x-2 text-sm font-mono tracking-wider group-hover:text-accent transition-colors">
                      <span>EXPLORE</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}