'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/auth-store';
import { Package, AlertTriangle, TrendingUp, Truck, RefreshCw, Search } from 'lucide-react';
import { useLanguageStore } from '@/lib/i18n';

export default function SellerDashboard() {
  const router = useRouter();
  const { user, isSeller, isAdmin, loading, checkUser } = useAuthStore();
  const { t } = useLanguageStore();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  useEffect(() => {
    if (!loading && (!user || (!isSeller && !isAdmin))) {
      router.push('/auth/login');
    }
  }, [user, isSeller, isAdmin, loading, router]);

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

  if (!user || (!isSeller && !isAdmin)) {
    return null;
  }

  const inventoryStats = [
    { label: 'Total Products', value: '247', icon: Package, status: 'normal' },
    { label: 'Low Stock Items', value: '12', icon: AlertTriangle, status: 'warning' },
    { label: 'Out of Stock', value: '3', icon: AlertTriangle, status: 'critical' },
    { label: 'Reorder Needed', value: '8', icon: RefreshCw, status: 'action' },
  ];

  const stockItems = [
    { id: 1, name: 'Air Jordan 1 Retro High OG "Chicago"', sku: 'AJ1-CHI-001', stock: 5, reorderLevel: 10, status: 'Low Stock', needsReorder: true },
    { id: 2, name: 'Nike Dunk Low "Panda"', sku: 'NK-PDA-002', stock: 25, reorderLevel: 15, status: 'Good Stock', needsReorder: false },
    { id: 3, name: 'Yeezy Boost 350 V2 "Zebra"', sku: 'YZ-ZBR-003', stock: 0, reorderLevel: 8, status: 'Out of Stock', needsReorder: true },
    { id: 4, name: 'Travis Scott x Air Jordan 1', sku: 'TS-AJ1-004', stock: 2, reorderLevel: 5, status: 'Critical', needsReorder: true },
    { id: 5, name: 'Off-White x Nike Air Force 1', sku: 'OW-AF1-005', stock: 8, reorderLevel: 12, status: 'Low Stock', needsReorder: true },
    { id: 6, name: 'Adidas Yeezy 700 "Wave Runner"', sku: 'YZ-WR-006', stock: 15, reorderLevel: 10, status: 'Good Stock', needsReorder: false },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Out of Stock': return 'bg-red-500/20 text-red-400 border-red-500/20';
      case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/20';
      case 'Low Stock': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      case 'Good Stock': return 'bg-green-500/20 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tighter mb-2">SELLER DASHBOARD</h1>
          <p className="text-gray-400 font-mono">Stock management and inventory control</p>
        </motion.div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {inventoryStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-xl p-6 transition-colors ${
                  stat.status === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                  stat.status === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  stat.status === 'action' ? 'bg-blue-500/10 border-blue-500/30' :
                  'bg-gray-900/50 border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${
                    stat.status === 'critical' ? 'bg-red-500/20' :
                    stat.status === 'warning' ? 'bg-yellow-500/20' :
                    stat.status === 'action' ? 'bg-blue-500/20' :
                    'bg-accent/20'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      stat.status === 'critical' ? 'text-red-400' :
                      stat.status === 'warning' ? 'text-yellow-400' :
                      stat.status === 'action' ? 'text-blue-400' :
                      'text-accent'
                    }`} />
                  </div>
                  {stat.status !== 'normal' && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-3 h-3 rounded-full ${
                        stat.status === 'critical' ? 'bg-red-500' :
                        stat.status === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                    />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-accent/20 to-yellow-500/20 border border-accent/30 rounded-xl p-6 text-left hover:border-accent/50 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-accent/20 rounded-lg">
                <RefreshCw className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Generate Reorder Report</h3>
                <p className="text-gray-400 text-sm">Create order list for suppliers</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6 text-left hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Stock Analytics</h3>
                <p className="text-gray-400 text-sm">View stock movement trends</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 text-left hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Truck className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Incoming Shipments</h3>
                <p className="text-gray-400 text-sm">Track pending deliveries</p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Inventory Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 border border-white/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Inventory Overview</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-lg font-mono text-sm font-bold hover:bg-accent/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </motion.button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-mono text-sm text-gray-400">PRODUCT</th>
                  <th className="text-left py-3 px-4 font-mono text-sm text-gray-400">SKU</th>
                  <th className="text-left py-3 px-4 font-mono text-sm text-gray-400">STOCK</th>
                  <th className="text-left py-3 px-4 font-mono text-sm text-gray-400">REORDER LVL</th>
                  <th className="text-left py-3 px-4 font-mono text-sm text-gray-400">STATUS</th>
                  <th className="text-center py-3 px-4 font-mono text-sm text-gray-400">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {stockItems.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-400">ID: {item.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-gray-300">{item.sku}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        item.stock === 0 ? 'bg-red-500 text-black' :
                        item.stock <= item.reorderLevel ? 'bg-yellow-500 text-black' :
                        'bg-green-500 text-black'
                      }`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-gray-300">{item.reorderLevel}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded border text-xs font-mono ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {item.needsReorder && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-accent text-black rounded-lg font-mono text-xs font-bold hover:bg-accent/90 transition-colors"
                        >
                          REORDER
                        </motion.button>
                      )}
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