'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, Twitter, Youtube, Mail } from 'lucide-react'

export function Footer() {
  const footerLinks = {
    Shop: [
      { href: '/sneakers', label: 'All Sneakers' },
      { href: '/exclusive', label: 'Exclusive Collection' },
      { href: '/limited-edition', label: 'Limited Edition' },
      { href: '/new-arrivals', label: 'New Arrivals' },
    ],
    Support: [
      { href: '/size-guide', label: 'Size Guide' },
      { href: '/shipping', label: 'Shipping' },
      { href: '/returns', label: 'Returns' },
      { href: '/contact', label: 'Contact' },
    ],
    Company: [
      { href: '/about', label: 'About Us' },
      { href: '/authenticity', label: 'Authenticity' },
      { href: '/terms', label: 'Terms' },
      { href: '/privacy', label: 'Privacy' },
    ],
  }

  const socialLinks = [
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Twitter, label: 'Twitter' },
    { href: '#', icon: Youtube, label: 'YouTube' },
    { href: '#', icon: Mail, label: 'Email' },
  ]

  return (
    <footer className="bg-black border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold tracking-tighter mb-4">LI-LO</h3>
              <p className="font-mono text-sm text-gray-400 mb-6">
                ULTRA RARE PREMIUM SNEAKERS<br />
                FOR TRUE COLLECTORS
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-mono text-sm tracking-wider mb-4">{category.toUpperCase()}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs font-mono text-gray-400">
              © 2024 LI-LO. ALL RIGHTS RESERVED.
            </p>
            <p className="text-xs font-mono text-gray-400 mt-4 sm:mt-0">
              MIAMI, FL • NEW YORK, NY • TOKYO, JP
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}