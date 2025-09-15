'use client'

import { motion } from 'framer-motion'
import { Hero } from '@/components/Hero'
import { FeaturedCollection } from '@/components/FeaturedCollection'
import { CategoryShowcase } from '@/components/CategoryShowcase'
import { Newsletter } from '@/components/Newsletter'
import { MarqueeSection } from '@/components/MarqueeSection'
import { SneakerShowcase3D } from '@/components/SneakerShowcase3D'
import { ParallaxBanner } from '@/components/ParallaxBanner'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black">
      <Hero />
      <MarqueeSection />
      <SneakerShowcase3D />
      <ParallaxBanner />
      <FeaturedCollection />
      <CategoryShowcase />
      <Newsletter />
    </div>
  )
}