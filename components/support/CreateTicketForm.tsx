'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  HelpCircle,
  Package,
  CreditCard,
  Truck,
  AlertCircle,
  MessageCircle,
  Loader2
} from 'lucide-react'

interface CreateTicketFormProps {
  userId?: string
  orderId?: string
  onSuccess?: () => void
}

const ticketCategories = [
  { id: 'order', label: 'Order Issue', icon: Package },
  { id: 'payment', label: 'Payment Problem', icon: CreditCard },
  { id: 'shipping', label: 'Shipping Inquiry', icon: Truck },
  { id: 'product', label: 'Product Question', icon: HelpCircle },
  { id: 'account', label: 'Account Support', icon: AlertCircle },
  { id: 'other', label: 'Other', icon: MessageCircle }
]

const priorityLevels = [
  { id: 'low', label: 'Low', description: 'General inquiry' },
  { id: 'medium', label: 'Medium', description: 'Needs attention' },
  { id: 'high', label: 'High', description: 'Important issue' },
  { id: 'urgent', label: 'Urgent', description: 'Requires immediate help' }
]

export function CreateTicketForm({ userId, orderId, onSuccess }: CreateTicketFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [category, setCategory] = useState('order')
  const [priority, setPriority] = useState('medium')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [orderNumber, setOrderNumber] = useState(orderId || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Please login to submit a support ticket')
        router.push('/auth/login')
        return
      }

      // Create ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          order_id: orderNumber || null,
          subject,
          message,
          category,
          priority,
          status: 'open'
        })
        .select()
        .single()

      if (ticketError) throw ticketError

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action: 'ticket_created',
          entity_type: 'support_ticket',
          entity_id: ticket.id,
          details: { subject, category, priority }
        })

      toast.success('Support ticket created successfully!')

      // Reset form
      setSubject('')
      setMessage('')
      setOrderNumber('')
      setCategory('order')
      setPriority('medium')

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error('Error creating ticket:', error)
      toast.error(error.message || 'Failed to create support ticket')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-700 rounded-2xl p-8"
    >
      <h2 className="text-2xl font-bold mb-6 font-mono tracking-wider">
        CREATE SUPPORT TICKET
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ticketCategories.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-lg border transition-all ${
                    category === cat.id
                      ? 'bg-white text-black border-white'
                      : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Priority Level */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Priority
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {priorityLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setPriority(level.id)}
                className={`p-3 rounded-lg border transition-all ${
                  priority === level.id
                    ? 'bg-white text-black border-white'
                    : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="text-sm font-medium">{level.label}</div>
                <div className="text-xs opacity-70">{level.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Order Number (Optional) */}
        {category === 'order' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Order Number (Optional)
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter your order number if applicable"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
          </div>
        )}

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of your issue"
            maxLength={100}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {subject.length}/100 characters
          </p>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Provide detailed information about your issue..."
            rows={6}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Please be as specific as possible to help us assist you better
          </p>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-400 mb-2">Quick Tips:</h4>
          <ul className="text-xs text-blue-300 space-y-1">
            <li>• Include order numbers for order-related issues</li>
            <li>• Describe the issue step-by-step if it's a technical problem</li>
            <li>• Attach any relevant information or error messages</li>
            <li>• We typically respond within 24 hours</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !subject.trim() || !message.trim()}
          className="w-full py-4 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              SUBMITTING...
            </>
          ) : (
            'SUBMIT TICKET'
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Your ticket will be assigned to our support team and you'll receive updates via email.
        </p>
      </form>
    </motion.div>
  )
}