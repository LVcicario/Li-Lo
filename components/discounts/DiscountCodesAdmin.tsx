'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Percent,
  Users,
  Tag,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface DiscountCode {
  id: string
  code: string
  description?: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_purchase?: number
  max_uses?: number
  uses_count: number
  valid_from: string
  valid_to?: string
  is_active: boolean
  membership_tier?: 'bronze' | 'silver' | 'gold'
  created_at: string
  updated_at: string
}

export function DiscountCodesAdmin() {
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterActive, setFilterActive] = useState<string>('all')
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 10,
    min_purchase: 0,
    max_uses: 0,
    valid_from: new Date().toISOString().split('T')[0],
    valid_to: '',
    is_active: true,
    membership_tier: '' as '' | 'bronze' | 'silver' | 'gold'
  })

  useEffect(() => {
    fetchDiscountCodes()
  }, [filterActive])

  const fetchDiscountCodes = async () => {
    try {
      const supabase = createClient()

      let query = supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterActive === 'active') {
        query = query.eq('is_active', true)
      } else if (filterActive === 'inactive') {
        query = query.eq('is_active', false)
      }

      const { data, error } = await query

      if (error) throw error
      setCodes(data || [])
    } catch (error: any) {
      console.error('Error fetching discount codes:', error)
      toast.error('Failed to load discount codes')
    } finally {
      setLoading(false)
    }
  }

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, code })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code || formData.discount_value <= 0) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()

      const codeData = {
        code: formData.code.toUpperCase(),
        description: formData.description || null,
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        min_purchase: formData.min_purchase || null,
        max_uses: formData.max_uses || null,
        valid_from: formData.valid_from,
        valid_to: formData.valid_to || null,
        is_active: formData.is_active,
        membership_tier: formData.membership_tier || null,
        uses_count: editingCode ? editingCode.uses_count : 0
      }

      if (editingCode) {
        const { error } = await supabase
          .from('discount_codes')
          .update(codeData)
          .eq('id', editingCode.id)

        if (error) throw error
        toast.success('Discount code updated successfully')
      } else {
        const { error } = await supabase
          .from('discount_codes')
          .insert(codeData)

        if (error) throw error
        toast.success('Discount code created successfully')
      }

      // Reset form
      resetForm()
      fetchDiscountCodes()
    } catch (error: any) {
      console.error('Error saving discount code:', error)
      if (error.code === '23505') {
        toast.error('This discount code already exists')
      } else {
        toast.error(error.message || 'Failed to save discount code')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (code: DiscountCode) => {
    setEditingCode(code)
    setFormData({
      code: code.code,
      description: code.description || '',
      discount_type: code.discount_type,
      discount_value: code.discount_value,
      min_purchase: code.min_purchase || 0,
      max_uses: code.max_uses || 0,
      valid_from: code.valid_from.split('T')[0],
      valid_to: code.valid_to ? code.valid_to.split('T')[0] : '',
      is_active: code.is_active,
      membership_tier: code.membership_tier || ''
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount code?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Discount code deleted')
      fetchDiscountCodes()
    } catch (error: any) {
      console.error('Error deleting discount code:', error)
      toast.error('Failed to delete discount code')
    }
  }

  const toggleActive = async (id: string, currentState: boolean) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('discount_codes')
        .update({ is_active: !currentState })
        .eq('id', id)

      if (error) throw error
      toast.success(`Discount code ${!currentState ? 'activated' : 'deactivated'}`)
      fetchDiscountCodes()
    } catch (error: any) {
      console.error('Error toggling discount code:', error)
      toast.error('Failed to update discount code')
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success('Code copied to clipboard')
  }

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 10,
      min_purchase: 0,
      max_uses: 0,
      valid_from: new Date().toISOString().split('T')[0],
      valid_to: '',
      is_active: true,
      membership_tier: ''
    })
    setEditingCode(null)
    setShowCreateForm(false)
  }

  const filteredCodes = codes.filter(code => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        code.code.toLowerCase().includes(query) ||
        code.description?.toLowerCase().includes(query)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-mono tracking-wider">
          DISCOUNT CODES MANAGEMENT
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-6 py-2 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          CREATE CODE
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterActive('all')}
              className={cn(
                "px-4 py-2 rounded-lg font-mono text-sm transition-colors",
                filterActive === 'all'
                  ? "bg-white text-black"
                  : "bg-gray-800 text-gray-300 border border-gray-600 hover:border-gray-400"
              )}
            >
              ALL
            </button>
            <button
              onClick={() => setFilterActive('active')}
              className={cn(
                "px-4 py-2 rounded-lg font-mono text-sm transition-colors",
                filterActive === 'active'
                  ? "bg-green-500 text-white"
                  : "bg-gray-800 text-gray-300 border border-gray-600 hover:border-gray-400"
              )}
            >
              ACTIVE
            </button>
            <button
              onClick={() => setFilterActive('inactive')}
              className={cn(
                "px-4 py-2 rounded-lg font-mono text-sm transition-colors",
                filterActive === 'inactive'
                  ? "bg-red-500 text-white"
                  : "bg-gray-800 text-gray-300 border border-gray-600 hover:border-gray-400"
              )}
            >
              INACTIVE
            </button>
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-6">
            {editingCode ? 'EDIT DISCOUNT CODE' : 'CREATE NEW DISCOUNT CODE'}
          </h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Code <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="SAVE20"
                  maxLength={20}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                <button
                  type="button"
                  onClick={generateRandomCode}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Summer sale discount"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Value <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                  max={formData.discount_type === 'percentage' ? '100' : undefined}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white pr-12"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {formData.discount_type === 'percentage' ? '%' : '€'}
                </span>
              </div>
            </div>

            {/* Min Purchase */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Minimum Purchase
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.min_purchase}
                  onChange={(e) => setFormData({ ...formData, min_purchase: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
              </div>
            </div>

            {/* Max Uses */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Uses (0 = unlimited)
              </label>
              <input
                type="number"
                value={formData.max_uses}
                onChange={(e) => setFormData({ ...formData, max_uses: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            {/* Valid From */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Valid From <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.valid_from}
                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
            </div>

            {/* Valid To */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Valid To
              </label>
              <input
                type="date"
                value={formData.valid_to}
                onChange={(e) => setFormData({ ...formData, valid_to: e.target.value })}
                min={formData.valid_from}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            {/* Membership Tier */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Membership Tier (Optional)
              </label>
              <select
                value={formData.membership_tier}
                onChange={(e) => setFormData({ ...formData, membership_tier: e.target.value as any })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="">All Members</option>
                <option value="bronze">Bronze Only</option>
                <option value="silver">Silver & Above</option>
                <option value="gold">Gold Only</option>
              </select>
            </div>

            {/* Active Status */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-300">Active</span>
              </label>
            </div>

            {/* Actions */}
            <div className="md:col-span-2 flex gap-2 pt-4 border-t border-gray-700">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    SAVING...
                  </>
                ) : (
                  <>
                    {editingCode ? 'UPDATE' : 'CREATE'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-700 text-white font-mono text-sm tracking-wider hover:bg-gray-600 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Codes List */}
      <div className="grid gap-4">
        {filteredCodes.length === 0 ? (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-12 text-center">
            <Tag className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No discount codes found</p>
          </div>
        ) : (
          filteredCodes.map((code) => (
            <motion.div
              key={code.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold font-mono">{code.code}</h3>
                    <button
                      onClick={() => copyCode(code.code)}
                      className="p-1 hover:bg-gray-800 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                    {code.is_active ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {code.description && (
                    <p className="text-sm text-gray-400">{code.description}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(code.id, code.is_active)}
                    className={cn(
                      "px-3 py-1 rounded text-xs font-mono transition-colors",
                      code.is_active
                        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                    )}
                  >
                    {code.is_active ? 'DEACTIVATE' : 'ACTIVATE'}
                  </button>
                  <button
                    onClick={() => handleEdit(code)}
                    className="p-2 hover:bg-gray-800 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(code.id)}
                    className="p-2 hover:bg-gray-800 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block">Discount</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    {code.discount_type === 'percentage' ? (
                      <>
                        <Percent className="w-3 h-3" />
                        {code.discount_value}%
                      </>
                    ) : (
                      <>€{code.discount_value}</>
                    )}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 block">Usage</span>
                  <span className="text-white font-medium">
                    {code.uses_count} / {code.max_uses || '∞'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 block">Min Purchase</span>
                  <span className="text-white font-medium">
                    {code.min_purchase ? `€${code.min_purchase}` : '-'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 block">Valid Period</span>
                  <span className="text-white font-medium text-xs">
                    {format(new Date(code.valid_from), 'MMM d, yyyy')}
                    {code.valid_to && (
                      <> - {format(new Date(code.valid_to), 'MMM d, yyyy')}</>
                    )}
                  </span>
                </div>
              </div>

              {code.membership_tier && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs">
                    <Users className="w-3 h-3" />
                    {code.membership_tier.toUpperCase()} MEMBERS ONLY
                  </span>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}