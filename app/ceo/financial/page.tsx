'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { createClient } from '@/lib/supabase/client'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Target,
  CreditCard
} from 'lucide-react'

interface FinancialData {
  totalRevenue: number
  totalCosts: number
  grossProfit: number
  netProfit: number
  profitMargin: number
  monthlyRevenue: FinancialPeriod[]
  topCategories: CategoryRevenue[]
  paymentMethods: PaymentMethodData[]
  averageOrderValue: number
  customerLifetimeValue: number
  refundRate: number
  totalRefunds: number
}

interface FinancialPeriod {
  period: string
  revenue: number
  costs: number
  profit: number
  orders: number
}

interface CategoryRevenue {
  category: string
  revenue: number
  orders: number
  percentage: number
}

interface PaymentMethodData {
  method: string
  amount: number
  count: number
  percentage: number
}

export default function FinancialPage() {
  const { user } = useAuthStore()
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalRevenue: 0,
    totalCosts: 0,
    grossProfit: 0,
    netProfit: 0,
    profitMargin: 0,
    monthlyRevenue: [],
    topCategories: [],
    paymentMethods: [],
    averageOrderValue: 0,
    customerLifetimeValue: 0,
    refundRate: 0,
    totalRefunds: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('12months')

  useEffect(() => {
    if (user) {
      loadFinancialData()
    }
  }, [user, selectedPeriod])

  const loadFinancialData = async () => {
    const supabase = createClient()

    try {
      // Get all orders with order items
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          customer_id,
          order_items (
            quantity,
            price,
            products (
              categories (
                name
              )
            )
          )
        `)
        .eq('status', 'delivered')

      // Calculate basic metrics
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
      const totalOrders = orders?.length || 0
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Estimate costs (in a real app, this would come from cost tracking)
      const estimatedCosts = totalRevenue * 0.6 // Assuming 60% cost of goods
      const grossProfit = totalRevenue - estimatedCosts
      const netProfit = grossProfit * 0.8 // Assuming 20% operational costs
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

      // Calculate monthly revenue
      const monthlyData = new Map<string, { revenue: number; costs: number; orders: number }>()
      orders?.forEach(order => {
        const month = new Date(order.created_at).toISOString().slice(0, 7) // YYYY-MM
        if (!monthlyData.has(month)) {
          monthlyData.set(month, { revenue: 0, costs: 0, orders: 0 })
        }
        const data = monthlyData.get(month)!
        data.revenue += order.total_amount || 0
        data.costs += (order.total_amount || 0) * 0.6
        data.orders += 1
      })

      const monthlyRevenue: FinancialPeriod[] = Array.from(monthlyData.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-12) // Last 12 months
        .map(([period, data]) => ({
          period,
          revenue: data.revenue,
          costs: data.costs,
          profit: data.revenue - data.costs,
          orders: data.orders
        }))

      // Calculate category revenue
      const categoryData = new Map<string, { revenue: number; orders: number }>()
      orders?.forEach(order => {
        order.order_items?.forEach(item => {
          const category = (item.products as any)?.categories?.name || 'Uncategorized'
          if (!categoryData.has(category)) {
            categoryData.set(category, { revenue: 0, orders: 0 })
          }
          const data = categoryData.get(category)!
          data.revenue += item.quantity * item.price
        })
        // Count order for the category
        const categories = new Set(order.order_items?.map(item => (item.products as any)?.categories?.name || 'Uncategorized'))
        categories.forEach(category => {
          categoryData.get(category)!.orders += 1 / categories.size // Proportional split
        })
      })

      const topCategories: CategoryRevenue[] = Array.from(categoryData.entries())
        .map(([category, data]) => ({
          category,
          revenue: data.revenue,
          orders: Math.round(data.orders),
          percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      // Mock payment methods data (in reality, this would come from payment processor)
      const paymentMethods: PaymentMethodData[] = [
        { method: 'Credit Card', amount: totalRevenue * 0.7, count: Math.round(totalOrders * 0.7), percentage: 70 },
        { method: 'PayPal', amount: totalRevenue * 0.2, count: Math.round(totalOrders * 0.2), percentage: 20 },
        { method: 'Bank Transfer', amount: totalRevenue * 0.1, count: Math.round(totalOrders * 0.1), percentage: 10 }
      ]

      // Get customer data for CLV
      const { data: customers } = await supabase
        .from('profiles')
        .select('id, created_at')
        .eq('role', 'customer')

      const customerLifetimeValue = customers && customers.length > 0 ? totalRevenue / customers.length : 0

      // Mock refund data (in reality, this would come from refund tracking)
      const totalRefunds = totalRevenue * 0.02 // Assuming 2% refund rate
      const refundRate = 2.0

      setFinancialData({
        totalRevenue,
        totalCosts: estimatedCosts,
        grossProfit,
        netProfit,
        profitMargin,
        monthlyRevenue,
        topCategories,
        paymentMethods,
        averageOrderValue,
        customerLifetimeValue,
        refundRate,
        totalRefunds
      })

    } catch (error) {
      console.error('Error loading financial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`
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
          <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-600">Complete financial analysis and reporting</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="3months">Last 3 months</option>
            <option value="6months">Last 6 months</option>
            <option value="12months">Last 12 months</option>
            <option value="all">All time</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatPrice(financialData.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gross Profit</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatPrice(financialData.grossProfit)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatPrice(financialData.netProfit)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatPercentage(financialData.profitMargin)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue & Profit</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {financialData.monthlyRevenue.map((period) => (
              <div key={period.period} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{new Date(period.period + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    <p className="text-sm text-gray-600">{period.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatPrice(period.revenue)}</p>
                  <p className="text-sm text-green-600">+{formatPrice(period.profit)} profit</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories by Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Revenue by Category</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {financialData.topCategories.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">{category.category}</p>
                      <p className="text-sm text-gray-600">{category.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(category.revenue)}</p>
                    <p className="text-sm text-gray-600">{formatPercentage(category.percentage)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {financialData.paymentMethods.map((method) => (
                <div key={method.method} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{method.method}</p>
                      <p className="text-sm text-gray-600">{method.count} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(method.amount)}</p>
                    <p className="text-sm text-gray-600">{formatPercentage(method.percentage)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatPrice(financialData.averageOrderValue)}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <DollarSign className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customer Lifetime Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatPrice(financialData.customerLifetimeValue)}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Refund Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatPercentage(financialData.refundRate)}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Refunds</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatPrice(financialData.totalRefunds)}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <DollarSign className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}