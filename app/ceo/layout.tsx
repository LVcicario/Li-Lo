'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Timer,
  BarChart3,
  Tags,
  DollarSign,
  TrendingUp,
  UserCheck
} from 'lucide-react'

export default function CEOLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userRole, checkUser, signOut, loading, profile } = useAuthStore()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    checkUser().then(() => {
      if (!loading) {
        if (!user) {
          router.push('/auth/login')
        } else if (userRole !== 'ceo') {
          // Redirect non-CEO users to their appropriate dashboard
          const dashboardUrl = userRole === 'seller' ? '/seller/dashboard' : '/account/dashboard'
          router.push(dashboardUrl)
        }
      }
    })
  }, [user, userRole, loading])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user || userRole !== 'ceo') {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/ceo', icon: LayoutDashboard },
    { name: 'Analytics', href: '/ceo/analytics', icon: TrendingUp },
    { name: 'Financial', href: '/ceo/financial', icon: DollarSign },
    { name: 'Products', href: '/ceo/products', icon: Package },
    { name: 'Inventory', href: '/ceo/inventory', icon: BarChart3 },
    { name: 'Orders', href: '/ceo/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/ceo/customers', icon: Users },
    { name: 'Categories', href: '/ceo/categories', icon: Tags },
    { name: 'Drop Timers', href: '/ceo/drops', icon: Timer },
    { name: 'Support', href: '/ceo/support', icon: MessageSquare },
    { name: 'User Management', href: '/ceo/users', icon: UserCheck },
    { name: 'Settings', href: '/ceo/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent navigation={navigation} profile={profile} onSignOut={handleSignOut} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent navigation={navigation} profile={profile} onSignOut={handleSignOut} />
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
                    placeholder="Search analytics, financials, users..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <Bell className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ navigation, profile, onSignOut }: any) {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Li-Lo CEO
        </Link>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {profile?.first_name?.[0] || profile?.email[0].toUpperCase()}
            </span>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.first_name ? `${profile.first_name} ${profile?.last_name || ''}` : profile?.email}
            </p>
            <p className="text-xs text-gray-500">Chief Executive Officer</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item: any) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors group"
          >
            <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={onSignOut}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  )
}