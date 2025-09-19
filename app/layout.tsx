import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ClientProviders } from '@/components/ClientProviders'
import CookieConsent from '@/components/CookieConsent'
import CartSlideOver from '@/components/CartSlideOver'

export const metadata: Metadata = {
  title: 'Li-Lo | Rare & Ultra Premium Sneakers',
  description: 'Discover the most exclusive and rare sneaker collection. Ultra premium footwear for true collectors.',
  keywords: 'rare sneakers, premium sneakers, exclusive footwear, limited edition, collector sneakers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-black text-white antialiased" suppressHydrationWarning>
        <ClientProviders />
        <Navbar />
        <main className="relative">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <CartSlideOver />
      </body>
    </html>
  )
}