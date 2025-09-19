'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useLanguageStore } from '@/lib/i18n'

export function CategoryShowcase() {
  const { t } = useLanguageStore()

  const categories = [
    {
      name: t('nav.exclusive'),
      description: t('pages.home.beyondLimits'),
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&h=800&fit=crop",
      href: "/exclusive",
      count: "6 GRAILS"
    },
    {
      name: t('nav.limitedEdition'),
      description: t('pages.home.handpickedExcellence'),
      image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=1200&h=800&fit=crop",
      href: "/limited-edition",
      count: "9 ITEMS"
    },
    {
      name: t('pages.home.iconicCollection'),
      description: t('pages.home.legendaryItems'),
      image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&h=800&fit=crop",
      href: "/sneakers",
      count: "16 LEGENDS"
    }
  ]

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
            {t('nav.collections').toUpperCase()}
          </h2>
          <p className="font-mono text-sm text-gray-400 tracking-wider">
            {t('hero.subtitle').toUpperCase()}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
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
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <span className="font-mono text-xs text-gray-400 mb-2">{category.count}</span>
                    <h3 className="text-3xl font-bold tracking-tighter mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{category.description}</p>
                    <div className="flex items-center space-x-2 text-sm font-mono tracking-wider group-hover:text-accent transition-colors">
                      <span>{t('product.explore')}</span>
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