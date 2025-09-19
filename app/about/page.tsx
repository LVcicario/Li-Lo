'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { MapPin, Users, Trophy, Zap } from 'lucide-react'
import { useLanguageStore } from '@/lib/i18n'

export default function AboutPage() {
  const { t } = useLanguageStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  const timeline = [
    { year: '2020', event: t('pages.about.2020'), description: t('pages.about.2020Desc') },
    { year: '2021', event: t('pages.about.2021'), description: t('pages.about.2021Desc') },
    { year: '2022', event: t('pages.about.2022'), description: t('pages.about.2022Desc') },
    { year: '2023', event: t('pages.about.2023'), description: t('pages.about.2023Desc') },
    { year: '2024', event: t('pages.about.2024'), description: t('pages.about.2024Desc') }
  ]

  const values = [
    { icon: Trophy, title: t('pages.about.excellence'), description: t('pages.about.excellenceDesc') },
    { icon: Users, title: t('pages.about.community2'), description: t('pages.about.communityDesc2') },
    { icon: Zap, title: t('pages.about.innovation'), description: t('pages.about.innovationDesc') },
    { icon: MapPin, title: t('pages.about.global'), description: t('pages.about.globalDesc') }
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-black pt-24">
      <motion.div
        style={{ opacity, scale }}
        className="fixed inset-0 z-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920&h=1080&fit=crop"
          alt="Background"
          fill
          className="object-cover opacity-20"
        />
      </motion.div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto px-4 lg:px-8 py-20"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-20"
          >
            <h1 className="text-7xl lg:text-9xl font-bold tracking-tighter mb-6">
              {t('pages.about.title')}
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('pages.about.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold tracking-tighter">{t('pages.about.ourStory')}</h2>
              <p className="text-gray-400 leading-relaxed">
                {t('pages.about.storyDescription')}
              </p>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative h-[500px]"
            >
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
                alt="Founders"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-4xl font-bold tracking-tighter text-center mb-16">{t('pages.about.timeline')}</h2>

            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-gradient-to-b from-white via-white/50 to-transparent" />

              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'} mb-16`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'pl-8'}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="inline-block"
                    >
                      <span className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        {item.year}
                      </span>
                      <h3 className="text-2xl font-bold mt-2 mb-2">{item.event}</h3>
                      <p className="text-gray-400">{item.description}</p>
                    </motion.div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.5 }}
                    className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-4xl font-bold tracking-tighter text-center mb-16">{t('pages.about.values')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="text-center"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="inline-block mb-4"
                    >
                      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </motion.div>
                    <h3 className="font-bold text-xl mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-400">{value.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center py-20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/3 to-pink-500/3 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-5xl font-bold tracking-tighter mb-6">
                {t('pages.about.joinTheRevolution')}
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                {t('pages.about.revolutionDesc')}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors"
              >
                {t('pages.about.getExclusiveAccess')}
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-t border-white/10"
          >
            <div className="text-center">
              <motion.p
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl font-bold mb-2"
              >
                500+
              </motion.p>
              <p className="text-sm text-gray-400">Rare Sneakers</p>
            </div>
            <div className="text-center">
              <motion.p
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="text-4xl font-bold mb-2"
              >
                10K+
              </motion.p>
              <p className="text-sm text-gray-400">Members</p>
            </div>
            <div className="text-center">
              <motion.p
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="text-4xl font-bold mb-2"
              >
                50+
              </motion.p>
              <p className="text-sm text-gray-400">Countries</p>
            </div>
            <div className="text-center">
              <motion.p
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                className="text-4xl font-bold mb-2"
              >
                24/7
              </motion.p>
              <p className="text-sm text-gray-400">Support</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}