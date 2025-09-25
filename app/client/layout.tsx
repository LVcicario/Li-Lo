'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { User, Package, MessageCircle, Settings, LogOut, Home } from 'lucide-react'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userRole, checkUser, signOut, loading } = useAuthStore()
  const isClient = userRole === 'client'
  const router = useRouter()

  useEffect(() => {
    checkUser().then(() => {
      if (!loading) {
        if (!user) {
          router.push('/auth/login')
        } else if (!isClient) {
          // Redirect to appropriate dashboard based on role
          const dashboardUrl = userRole === 'ceo' ? '/ceo' : userRole === 'seller' ? '/seller/dashboard' : '/'
          router.push(dashboardUrl)
        }
      }
    })
  }, [user, userRole, isClient, loading])

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

  if (!user || !isClient) {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/client', icon: Home },
    { name: 'My Orders', href: '/client/orders', icon: Package },
    { name: 'Personal Info', href: '/client/profile', icon: User },
    { name: 'Support', href: '/client/support', icon: MessageCircle },
    { name: 'Settings', href: '/client/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Li-Lo Client
            </Link>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500">Customer</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Sign Out */}
          <div className="px-4 py-6 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}