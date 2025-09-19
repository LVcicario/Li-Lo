'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  ShoppingBag,
  TrendingUp,
  Clock,
  Star,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export default function CustomerDashboard() {
  const router = useRouter();
  const { user, signOut, checkUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser().then(() => {
      if (!user) {
        router.push('/auth/login');
      }
      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Orders', value: '12', icon: Package, change: '+2 this month' },
    { label: 'Wishlist Items', value: '8', icon: Heart, change: '3 available' },
    { label: 'Loyalty Points', value: '2,450', icon: Star, change: '250 pending' },
    { label: 'Member Since', value: '2023', icon: Clock, change: 'Gold tier' },
  ];

  const recentOrders = [
    { id: 'ORD-001', date: '2024-12-15', status: 'Delivered', total: '€459.00', items: 1 },
    { id: 'ORD-002', date: '2024-12-10', status: 'In Transit', total: '€789.00', items: 2 },
    { id: 'ORD-003', date: '2024-11-28', status: 'Delivered', total: '€1,299.00', items: 1 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.user_metadata?.first_name || 'Customer'}</h1>
          <p className="text-gray-600 mt-1">Manage your account and track your orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-8 h-8 text-black" />
                  <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">{order.items} item(s)</p>
                      <p className="font-bold">{order.total}</p>
                    </div>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="text-sm text-black hover:underline mt-2 inline-block"
                    >
                      View Details →
                    </Link>
                  </div>
                ))}
              </div>
              <Link
                href="/account/orders"
                className="mt-4 inline-block text-black hover:underline font-medium"
              >
                View All Orders →
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Exclusive Offers</h2>
              <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2">Gold Member Exclusive</h3>
                <p className="mb-4">Get 20% off on your next limited edition purchase</p>
                <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100">
                  Shop Now
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Quick Links</h2>
              <nav className="space-y-2">
                <Link
                  href="/account/profile"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Profile Settings</span>
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Package className="w-5 h-5" />
                  <span>Order History</span>
                </Link>
                <Link
                  href="/account/wishlist"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </Link>
                <Link
                  href="/account/addresses"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Addresses</span>
                </Link>
                <Link
                  href="/account/payment"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Methods</span>
                </Link>
                <Link
                  href="/account/preferences"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span>Preferences</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg transition-colors w-full text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Need Help?</h2>
              <p className="text-gray-600 mb-4">
                Our customer support team is here to assist you with any questions or concerns.
              </p>
              <Link
                href="/contact"
                className="block w-full text-center bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}