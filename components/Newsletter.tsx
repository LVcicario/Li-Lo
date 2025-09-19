'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Send } from 'lucide-react'
import { useLanguageStore } from '@/lib/i18n'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const { t } = useLanguageStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    setTimeout(() => {
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 3000)
    }, 1000)
  }

  return (
    <section className="py-20 lg:py-32 bg-black border-t border-white/10">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter mb-4">
            {t('footer.newsletter')}
          </h2>
          <p className="font-mono text-sm text-gray-400 tracking-wider mb-8">
            {t('footer.newsletterText')}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('checkout.email').toUpperCase()}
              required
              className="flex-1 px-6 py-4 bg-transparent border border-white/30 font-mono text-sm tracking-wider placeholder:text-gray-500 focus:outline-none focus:border-white transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="px-8 py-4 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {status === 'loading' ? (
                t('common.loading')
              ) : status === 'success' ? (
                t('account.welcome')
              ) : (
                <>
                  {t('footer.subscribe')}
                  <Send className="ml-2 w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {status === 'success' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-green-500 font-mono"
            >
              {t('notifications.subscribed')}
            </motion.p>
          )}

          <p className="mt-8 text-xs text-gray-500 font-mono">
            {t('footer.newsletterText')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}