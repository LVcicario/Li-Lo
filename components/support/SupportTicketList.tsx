'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  Filter,
  Search,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface SupportTicket {
  id: string
  user_id: string
  order_id?: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  created_at: string
  updated_at: string
  responses: {
    id: string
    message: string
    is_admin: boolean
    created_at: string
    user_name?: string
  }[]
  user: {
    name: string
    email: string
  }
}

interface SupportTicketListProps {
  userId?: string
  isAdmin?: boolean
}

export function SupportTicketList({ userId, isAdmin = false }: SupportTicketListProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [responseText, setResponseText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [userId, isAdmin, statusFilter, priorityFilter])

  const fetchTickets = async () => {
    try {
      const supabase = createClient()

      let query = supabase
        .from('support_tickets')
        .select(`
          *,
          user:users!support_tickets_user_id_fkey(name, email),
          responses:ticket_responses(
            id,
            message,
            is_admin,
            created_at,
            user:users!ticket_responses_user_id_fkey(name)
          )
        `)
        .order('created_at', { ascending: false })

      if (!isAdmin && userId) {
        query = query.eq('user_id', userId)
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      if (priorityFilter !== 'all') {
        query = query.eq('priority', priorityFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setTickets(data || [])
    } catch (error: any) {
      console.error('Error fetching tickets:', error)
      toast.error('Failed to load support tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('support_tickets')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId)

      if (error) throw error

      toast.success('Ticket status updated')
      fetchTickets()
    } catch (error: any) {
      console.error('Error updating ticket:', error)
      toast.error('Failed to update ticket status')
    }
  }

  const handleResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket || !responseText.trim()) return

    setSubmitting(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Please login to respond')
        return
      }

      const { error } = await supabase
        .from('ticket_responses')
        .insert({
          ticket_id: selectedTicket.id,
          user_id: user.id,
          message: responseText,
          is_admin: isAdmin
        })

      if (error) throw error

      // Update ticket status if admin is responding
      if (isAdmin && selectedTicket.status === 'open') {
        await handleStatusUpdate(selectedTicket.id, 'in_progress')
      }

      toast.success('Response sent successfully')
      setResponseText('')
      fetchTickets()
    } catch (error: any) {
      console.error('Error sending response:', error)
      toast.error('Failed to send response')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4" />
      case 'in_progress':
        return <Clock className="w-4 h-4" />
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />
      case 'closed':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'in_progress':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'resolved':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'closed':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
      default:
        return ''
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'high':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'low':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
      default:
        return ''
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        ticket.subject.toLowerCase().includes(query) ||
        ticket.message.toLowerCase().includes(query) ||
        ticket.user?.email.toLowerCase().includes(query)
      )
    }
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {filteredTickets.length === 0 ? (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No support tickets found</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedTicket(ticket)}
                className={cn(
                  "bg-gray-900 border rounded-xl p-4 cursor-pointer transition-all hover:border-white",
                  selectedTicket?.id === ticket.id ? "border-white" : "border-gray-700"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white line-clamp-1">
                    {ticket.subject}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                  {ticket.message}
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    "px-2 py-1 text-xs rounded-full border flex items-center gap-1",
                    getStatusColor(ticket.status)
                  )}>
                    {getStatusIcon(ticket.status)}
                    {ticket.status.replace('_', ' ')}
                  </span>

                  <span className={cn(
                    "px-2 py-1 text-xs rounded-full border",
                    getPriorityColor(ticket.priority)
                  )}>
                    {ticket.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {isAdmin ? ticket.user?.email : 'You'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(ticket.created_at), 'MMM d')}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="bg-gray-900 border border-gray-700 rounded-xl">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-2">{selectedTicket.subject}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {selectedTicket.user?.name || selectedTicket.user?.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(selectedTicket.created_at), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  </div>

                  {isAdmin && (
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleStatusUpdate(selectedTicket.id, e.target.value)}
                      className={cn(
                        "px-3 py-1 rounded-lg border text-sm",
                        getStatusColor(selectedTicket.status),
                        "bg-transparent"
                      )}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  )}
                </div>

                <div className="flex gap-2">
                  <span className={cn(
                    "px-2 py-1 text-xs rounded-full border",
                    getPriorityColor(selectedTicket.priority)
                  )}>
                    Priority: {selectedTicket.priority}
                  </span>
                  {selectedTicket.order_id && (
                    <span className="px-2 py-1 text-xs rounded-full border border-gray-600 text-gray-400">
                      Order: {selectedTicket.order_id.slice(0, 8)}...
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 max-h-[400px] overflow-y-auto space-y-4">
                {/* Original Message */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{selectedTicket.user?.name}</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(selectedTicket.created_at), 'h:mm a')}
                    </span>
                  </div>
                  <p className="text-gray-300">{selectedTicket.message}</p>
                </div>

                {/* Responses */}
                {selectedTicket.responses?.map((response) => (
                  <div
                    key={response.id}
                    className={cn(
                      "rounded-lg p-4",
                      response.is_admin
                        ? "bg-blue-500/10 border border-blue-500/20 ml-8"
                        : "bg-gray-800 mr-8"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">
                        {response.is_admin ? 'Support Team' : response.user_name}
                      </span>
                      {response.is_admin && (
                        <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded">
                          Admin
                        </span>
                      )}
                      <span className="text-xs text-gray-500 ml-auto">
                        {format(new Date(response.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-gray-300">{response.message}</p>
                  </div>
                ))}
              </div>

              {/* Response Form */}
              {selectedTicket.status !== 'closed' && (
                <form onSubmit={handleResponse} className="p-6 border-t border-gray-700">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your response..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none mb-4"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submitting || !responseText.trim()}
                      className="px-6 py-2 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'SENDING...' : 'SEND RESPONSE'}
                    </button>
                    {isAdmin && selectedTicket.status !== 'resolved' && (
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(selectedTicket.id, 'resolved')}
                        className="px-6 py-2 bg-green-500 text-white font-mono text-sm tracking-wider hover:bg-green-600 transition-colors"
                      >
                        MARK AS RESOLVED
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-12 text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}