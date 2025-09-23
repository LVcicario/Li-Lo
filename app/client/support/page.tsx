'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { createClient } from '@/lib/supabase/client'
import { Plus, MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface SupportTicket {
  id: string
  subject: string
  status: string
  priority: string
  category: string
  created_at: string
  updated_at: string
  message_count: number
}

export default function ClientSupport() {
  const { user } = useAuthStore()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewTicketForm, setShowNewTicketForm] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: ''
  })

  useEffect(() => {
    if (user) {
      loadTickets()
    }
  }, [user])

  const loadTickets = async () => {
    const supabase = createClient()

    try {
      // Get tickets with message count
      const { data: ticketsData } = await supabase
        .from('support_tickets')
        .select(`
          id,
          subject,
          status,
          priority,
          category,
          created_at,
          updated_at,
          support_messages (count)
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (ticketsData) {
        const formattedTickets = ticketsData.map(ticket => ({
          ...ticket,
          message_count: ticket.support_messages?.[0]?.count || 0
        }))
        setTickets(formattedTickets)
      }
    } catch (error) {
      console.error('Error loading tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTicket = async () => {
    if (!newTicket.subject || !newTicket.message) return

    const supabase = createClient()

    try {
      // Create ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user!.id,
          subject: newTicket.subject,
          category: newTicket.category,
          priority: newTicket.priority
        })
        .select()
        .single()

      if (ticketError) throw ticketError

      // Create initial message
      const { error: messageError } = await supabase
        .from('support_messages')
        .insert({
          ticket_id: ticket.id,
          user_id: user!.id,
          message: newTicket.message,
          is_staff_reply: false
        })

      if (messageError) throw messageError

      // Reset form and reload tickets
      setNewTicket({ subject: '', category: 'general', priority: 'medium', message: '' })
      setShowNewTicketForm(false)
      loadTickets()
    } catch (error) {
      console.error('Error creating ticket:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'closed':
        return <AlertCircle className="w-5 h-5 text-gray-600" />
      default:
        return <MessageCircle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-100 border-green-200'
      case 'in_progress': return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'closed': return 'text-gray-600 bg-gray-100 border-gray-200'
      default: return 'text-yellow-600 bg-yellow-100 border-yellow-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'low': return 'text-gray-600 bg-gray-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600">Get help with your orders and account</p>
        </div>
        <button
          onClick={() => setShowNewTicketForm(!showNewTicketForm)}
          className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </button>
      </div>

      {/* New Ticket Form */}
      {showNewTicketForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Support Ticket</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Brief description of your issue"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="order">Order Issue</option>
                  <option value="product">Product Question</option>
                  <option value="account">Account</option>
                  <option value="technical">Technical</option>
                  <option value="payment">Payment</option>
                  <option value="shipping">Shipping</option>
                  <option value="return">Return/Exchange</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={newTicket.message}
                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Please describe your issue in detail..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={createTicket}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
              >
                Create Ticket
              </button>
              <button
                onClick={() => setShowNewTicketForm(false)}
                className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {ticket.subject}
                    </h3>
                    <div className={`flex items-center px-2 py-1 rounded-full border ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1 text-xs font-medium">
                        {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Category: {ticket.category}</span>
                    <span>•</span>
                    <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{ticket.message_count} messages</span>
                  </div>
                </div>

                <Link
                  href={`/client/support/${ticket.id}`}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No support tickets</h3>
            <p className="text-gray-600 mb-6">
              You haven't created any support tickets yet.
            </p>
            <button
              onClick={() => setShowNewTicketForm(true)}
              className="inline-flex items-center px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  )
}