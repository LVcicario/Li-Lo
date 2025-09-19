'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, signOut, checkUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    checkUser().then(() => {
      if (!user || !isAdmin) {
        router.push('/admin/login');
      }
      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Revenue',
      value: '€125,430',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      label: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      icon: ShoppingBag,
      color: 'bg-blue-500',
    },
    {
      label: 'Active Users',
      value: '8,549',
      change: '+23.1%',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      label: 'Products',
      value: '156',
      change: '+4 new',
      icon: Package,
      color: 'bg-orange-500',
    },
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      product: 'Air Jordan 1 Retro',
      amount: '€459.00',
      status: 'Processing',
      date: '2024-12-20',
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      product: 'Nike Dunk Low',
      amount: '€789.00',
      status: 'Shipped',
      date: '2024-12-19',
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      product: 'Yeezy Boost 350',
      amount: '€1,299.00',
      status: 'Delivered',
      date: '2024-12-18',
    },
  ];

  const topProducts = [
    { name: 'Air Jordan 1 Retro', sales: 234, revenue: '€107,586' },
    { name: 'Nike Dunk Low', sales: 189, revenue: '€86,445' },
    { name: 'Yeezy Boost 350', sales: 156, revenue: '€202,644' },
    { name: 'New Balance 550', sales: 143, revenue: '€62,892' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 h-screen fixed left-0 top-0">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white">Li-Lo Admin</h1>
          </div>

          <nav className="mt-6">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-6 py-3 bg-gray-700 text-white"
            >
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700"
            >
              <Package className="w-5 h-5" />
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700"
            >
              <ShoppingBag className="w-5 h-5" />
              Orders
            </Link>
            <Link
              href="/admin/customers"
              className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700"
            >
              <Users className="w-5 h-5" />
              Customers
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700"
            >
              <TrendingUp className="w-5 h-5" />
              Analytics
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>

          <div className="absolute bottom-0 w-full p-6">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 text-gray-300 hover:text-white w-full"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          {/* Header */}
          <div className="bg-gray-800 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-300 hover:text-white">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-white font-medium">Admin User</p>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                </div>
                <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
              <p className="text-gray-400">Welcome back! Here's what's happening with your store.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders */}
              <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Recent Orders</h3>
                  <Link href="/admin/orders" className="text-blue-400 hover:text-blue-300 text-sm">
                    View All →
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 text-sm">
                        <th className="pb-4">Order ID</th>
                        <th className="pb-4">Customer</th>
                        <th className="pb-4">Product</th>
                        <th className="pb-4">Amount</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-t border-gray-700">
                          <td className="py-4 text-white">{order.id}</td>
                          <td className="py-4 text-white">{order.customer}</td>
                          <td className="py-4 text-gray-300">{order.product}</td>
                          <td className="py-4 text-white font-medium">{order.amount}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Delivered'
                                ? 'bg-green-900 text-green-300'
                                : order.status === 'Shipped'
                                ? 'bg-blue-900 text-blue-300'
                                : 'bg-yellow-900 text-yellow-300'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1 text-gray-400 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-white">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Top Products</h3>
                  <Link href="/admin/products" className="text-blue-400 hover:text-blue-300 text-sm">
                    View All →
                  </Link>
                </div>

                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm">#{index + 1}</span>
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-gray-400 text-sm">{product.sales} sales</p>
                        </div>
                      </div>
                      <p className="text-white font-bold">{product.revenue}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link
                  href="/admin/products/new"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Add Product
                </Link>
                <Link
                  href="/admin/orders"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  <Package className="w-5 h-5" />
                  Manage Orders
                </Link>
                <Link
                  href="/admin/customers"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  <Users className="w-5 h-5" />
                  View Customers
                </Link>
                <Link
                  href="/admin/analytics"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  <BarChart3 className="w-5 h-5" />
                  Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}