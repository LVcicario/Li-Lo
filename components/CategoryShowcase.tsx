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
      name: "EXCLUSIVE",
      description: "BEYOND LIMITS",
      image: "https://images.unsplash.com/photo-1612902456551-333ac5afa26e?w=1200&h=1200&fit=crop&q=100",
      href: "/exclusive",
      count: "6 GRAILS"
    },
    {
      name: "LIMITED EDITION",
      description: "HANDPICKED EXCELLENCE",
      image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=1200&h=1200&fit=crop&q=100",
      href: "/limited-edition",
      count: "9 ITEMS"
    },
    {
      name: "ICONIC COLLECTION",
      description: "LEGENDARY ITEMS",
      image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=1200&h=1200&fit=crop&q=100",
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
            COLLECTIONS
          </h2>
          <p className="font-mono text-sm text-gray-400 tracking-wider">
            CURATED FOR THE ELITE
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