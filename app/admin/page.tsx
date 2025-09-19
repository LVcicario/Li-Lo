'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/auth-store';
import { Users, Package, BarChart3, ShoppingCart, Settings, Plus, Eye, Edit3, Trash2 } from 'lucide-react';
import { useLanguageStore } from '@/lib/i18n';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, loading, checkUser } = useAuthStore();
  const { t } = useLanguageStore();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const stats = [
    { label: 'Total Products', value: '247', icon: Package, change: '+12%' },
    { label: 'Total Users', value: '1,234', icon: Users, change: '+8%' },
    { label: 'Orders Today', value: '45', icon: ShoppingCart, change: '+23%' },
    { label: 'Revenue', value: '€42,350', icon: BarChart3, change: '+15%' },
  ];

  const recentProducts = [
    { id: 1, name: 'Air Jordan 1 Retro High OG "Chicago"', price: '€1,200', stock: 5, status: 'Active' },
    { id: 2, name: 'Nike Dunk Low "Panda"', price: '€350', stock: 12, status: 'Active' },
    { id: 3, name: 'Yeezy Boost 350 V2 "Zebra"', price: '€800', stock: 3, status: 'Low Stock' },
    { id: 4, name: 'Travis Scott x Air Jordan 1', price: '€2,500', stock: 0, status: 'Out of Stock' },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tighter mb-2">ADMIN DASHBOARD</h1>
          <p className="text-gray-400 font-mono">Complete control over your Li-Lo platform</p>
        </motion.div>

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
                className="bg-gray-900/50 border border-white/20 rounded-xl p-6 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-green-400 text-sm font-mono">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                <Package className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Manage Products</h3>
                <p className="text-gray-400 text-sm">Add, edit, delete sneakers</p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-lg text-sm font-mono hover:bg-purple-500/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm font-mono hover:bg-white/20 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View All
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Manage Users</h3>
                <p className="text-gray-400 text-sm">View and manage customers</p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg text-sm font-mono hover:bg-blue-500/30 transition-colors"
              >
                <Users className="w-4 h-4" />
                View Users
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm font-mono hover:bg-white/20 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Roles
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Analytics</h3>
                <p className="text-gray-400 text-sm">View detailed reports</p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg text-sm font-mono hover:bg-green-500/30 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Reports
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm font-mono hover:bg-white/20 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Export
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Recent Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 border border-white/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Products</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-lg font-mono text-sm font-bold hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-mono text-sm text-gray-400">PRODUCT</th>
                  <th className="text-left py-3 px-4 font-mono text-sm text-gray-400">PRICE</th>
                  <th className="text-left py-3 px-4 font-mono text-sm text-gray-400">STOCK</th>
                  <th className="text-left py-3 px-4 font-mono text-sm text-gray-400">STATUS</th>
                  <th className="text-right py-3 px-4 font-mono text-sm text-gray-400">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-400">ID: {product.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold">{product.price}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-mono ${
                        product.stock === 0 ? 'bg-red-500/20 text-red-400' :
                        product.stock <= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-mono ${
                        product.status === 'Out of Stock' ? 'bg-red-500/20 text-red-400' :
                        product.status === 'Low Stock' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 justify-end">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4 text-gray-400 hover:text-accent" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}