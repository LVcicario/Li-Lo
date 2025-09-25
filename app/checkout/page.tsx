'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  ChevronRight,
  ShieldCheck,
  Truck,
  Loader2,
  AlertCircle,
  Star,
  Package,
  Gift
} from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { createClient } from '@/lib/supabase/client'
import { useCurrencyStore } from '@/lib/currency-store'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, loadCart, isLoading: cartLoading } = useCartStore()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { currency, format: formatPrice } = useCurrencyStore()
  const [discountCode, setDiscountCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [applyingDiscount, setApplyingDiscount] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'US',
    state: '',
    saveInfo: false,
  })

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setFormData(prev => ({
          ...prev,
          email: user.email || ''
        }))
      } else {
        router.push('/auth/login?redirect=/checkout')
      }
    }

    getUser()
    loadCart()
  }, [])

  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      router.push('/cart')
    }
  }, [items, cartLoading, router])

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const applyDiscountCode = async () => {
    if (!discountCode.trim()) return

    setApplyingDiscount(true)
    try {
      const response = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: discountCode,
          subtotal: getTotalPrice()
        })
      })

      const data = await response.json()
      if (response.ok) {
        setDiscountAmount(data.discount_amount)
        toast.success(`Discount applied: ${formatPrice(data.discount_amount)} off!`)
      } else {
        toast.error(data.error || 'Invalid discount code')
      }
    } catch (error) {
      toast.error('Failed to apply discount code')
    } finally {
      setApplyingDiscount(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Please log in to complete your order')
        router.push('/auth/login?redirect=/checkout')
        return
      }

      // Validate form data
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode', 'country']
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])

      if (missingFields.length > 0) {
        toast.error('Please fill in all required fields')
        setLoading(false)
        return
      }

      // Prepare shipping and billing addresses
      const shippingAddress = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_line_1: formData.address,
        city: formData.city,
        state_province: formData.state,
        postal_code: formData.postalCode,
        country: formData.country,
        phone: formData.phone
      }

      const billingAddress = shippingAddress // Same as shipping for now

      // Create Stripe checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_items: items,
          shipping_address: shippingAddress,
          billing_address: billingAddress,
          discount_code: discountCode || null,
          currency: currency
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }

    } catch (error: any) {
      console.error('Checkout error:', error)
      toast.error(error.message || 'Failed to process checkout')
    } finally {
      setLoading(false)
    }
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal > 100 ? 0 : (currency === 'USD' ? 19.99 : 15.00)
  const taxRate = formData.country === 'US' ? 0.08 : 0.20 // 8% US, 20% EU
  const tax = subtotal * taxRate
  const total = subtotal + shipping + tax - discountAmount

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white font-mono tracking-wider">LOADING CHECKOUT...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4 font-mono">CART EMPTY</h1>
          <p className="text-gray-400 mb-6">Add some rare finds to continue</p>
          <Link
            href="/exclusive"
            className="bg-white text-black px-6 py-3 font-mono tracking-wider hover:bg-gray-200 transition-colors"
          >
            SHOP EXCLUSIVES
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-mono"
          >
            SECURE CHECKOUT
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 font-mono tracking-wider"
          >
            COMPLETING YOUR RARE FIND ACQUISITION
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-gray-700 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold mb-8 font-mono tracking-wider">SHIPPING DETAILS</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-mono tracking-wider">
                      EMAIL ADDRESS
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-mono tracking-wider">
                        FIRST NAME
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                          placeholder="John"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-mono tracking-wider">
                        LAST NAME
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-mono tracking-wider">
                      PHONE NUMBER
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-mono tracking-wider">
                      STREET ADDRESS
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        placeholder="123 Luxury Ave"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-mono tracking-wider">
                        ZIP CODE
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        placeholder="10001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-mono tracking-wider">
                        CITY
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-mono tracking-wider">
                        COUNTRY
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-4 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="FR">France</option>
                        <option value="DE">Germany</option>
                        <option value="IT">Italy</option>
                        <option value="ES">Spain</option>
                        <option value="JP">Japan</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>

                  {formData.country === 'US' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-mono tracking-wider">
                        STATE
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required={formData.country === 'US'}
                        className="w-full px-4 py-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        placeholder="NY"
                      />
                    </div>
                  )}

                  <div className="flex items-center pt-4">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleChange}
                      className="w-5 h-5 text-white bg-gray-800 border-gray-600 focus:ring-white focus:ring-2 rounded"
                    />
                    <label className="ml-3 text-sm text-gray-300 font-mono">
                      SAVE FOR FUTURE ORDERS
                    </label>
                  </div>

                  <div className="flex items-center gap-4 p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <ShieldCheck className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="font-medium text-green-400 font-mono text-sm">SECURE CHECKOUT</p>
                      <p className="text-xs text-gray-400">Your information is encrypted and protected</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-white text-black px-8 py-4 font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        PROCESSING...
                      </>
                    ) : (
                      <>
                        PROCEED TO PAYMENT
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-8 sticky top-6"
            >
              <h2 className="text-2xl font-bold mb-6 font-mono tracking-wider">ORDER SUMMARY</h2>

              <div className="space-y-4 mb-8">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-gray-400 font-mono">{item.brand}</p>
                      <p className="text-xs text-gray-400">Size {item.size} • Qty {item.quantity}</p>
                      <p className="font-bold text-sm mt-1">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2 font-mono tracking-wider">
                  DISCOUNT CODE
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={applyDiscountCode}
                    disabled={applyingDiscount || !discountCode.trim()}
                    className="px-4 py-3 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                  >
                    {applyingDiscount ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'APPLY'
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-700 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-mono">SUBTOTAL</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-mono">SHIPPING</span>
                  <span className="font-mono">
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-mono">
                    TAX ({formData.country === 'US' ? '8%' : '20% VAT'})
                  </span>
                  <span className="font-mono">{formatPrice(tax)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span className="font-mono">DISCOUNT</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl border-t border-gray-700 pt-3">
                  <span className="font-mono tracking-wider">TOTAL</span>
                  <span className="font-mono">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm font-medium text-yellow-400 font-mono">AUTHENTICITY GUARANTEED</p>
                    <p className="text-xs text-gray-400">Every item verified and certified</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <Package className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-blue-400 font-mono">WHITE GLOVE DELIVERY</p>
                    <p className="text-xs text-gray-400">Premium packaging included</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <Gift className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-purple-400 font-mono">EXCLUSIVE ACCESS</p>
                    <p className="text-xs text-gray-400">Priority for future drops</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 font-mono">
                  By placing this order, you agree to our{' '}
                  <Link href="/terms-of-service" className="text-white underline hover:text-gray-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" className="text-white underline hover:text-gray-300">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}