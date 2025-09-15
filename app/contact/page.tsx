'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Instagram, Twitter } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise(resolve => setTimeout(resolve, 2000))

    setSubmitted(true)
    setIsSubmitting(false)
    setFormData({ name: '', email: '', subject: '', message: '' })

    setTimeout(() => setSubmitted(false), 5000)
  }

  const locations = [
    {
      city: 'MIAMI',
      address: '1234 Biscayne Blvd',
      phone: '+1 305 555 0100',
      hours: '10AM - 8PM EST',
      email: 'miami@li-lo.com'
    },
    {
      city: 'NEW YORK',
      address: '5678 Madison Ave',
      phone: '+1 212 555 0200',
      hours: '10AM - 9PM EST',
      email: 'ny@li-lo.com'
    },
    {
      city: 'TOKYO',
      address: '9012 Shibuya Crossing',
      phone: '+81 3 5555 0300',
      hours: '11AM - 9PM JST',
      email: 'tokyo@li-lo.com'
    }
  ]

  return (
    <div className="min-h-screen bg-black pt-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 lg:px-8 py-20"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter mb-4">
            GET IN TOUCH
          </h1>
          <p className="text-xl text-gray-400">
            We're here to help with your sneaker dreams
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter mb-8">SEND US A MESSAGE</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="relative"
                >
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 focus:border-white/50 outline-none transition-all"
                    placeholder="YOUR NAME"
                  />
                </motion.div>

                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="relative"
                >
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 focus:border-white/50 outline-none transition-all"
                    placeholder="YOUR EMAIL"
                  />
                </motion.div>
              </div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 focus:border-white/50 outline-none transition-all"
                  placeholder="SUBJECT"
                />
              </motion.div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 focus:border-white/50 outline-none transition-all resize-none"
                  placeholder="YOUR MESSAGE"
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting || submitted}
                className="w-full py-4 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>SENDING...</span>
                ) : submitted ? (
                  <span>MESSAGE SENT!</span>
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-500/20 border border-green-500/50 text-green-500 text-sm"
              >
                Thank you for your message. We'll get back to you within 24 hours.
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tighter mb-8">OUR LOCATIONS</h2>

              <div className="space-y-6">
                {locations.map((location, index) => (
                  <motion.div
                    key={location.city}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ x: 10 }}
                    className="p-6 border border-white/20 hover:border-white/40 transition-all"
                  >
                    <h3 className="text-xl font-bold mb-4">{location.city}</h3>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4" />
                        <span>{location.address}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4" />
                        <span>{location.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4" />
                        <span>{location.hours}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4" />
                        <span>{location.email}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/20"
            >
              <h3 className="text-xl font-bold mb-4">VIP CONCIERGE</h3>
              <p className="text-sm text-gray-400 mb-4">
                For exclusive access and personalized service
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">WhatsApp: +1 786 VIP LILO</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">vip@li-lo.com</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-xl font-bold mb-4">FOLLOW US</h3>
              <div className="flex space-x-4">
                <motion.a
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  href="#"
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  href="#"
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}