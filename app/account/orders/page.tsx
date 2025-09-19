'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  Truck,
  Download,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

type Order = {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'In Transit' | 'Delivered' | 'Cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  shipping: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    trackingNumber?: string;
    carrier?: string;
  };
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, checkUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const mockOrders: Order[] = [
    {
      id: 'ORD-2024-001',
      date: '2024-12-15',
      status: 'Delivered',
      total: 459,
      items: [
        {
          id: '1',
          name: 'Air Jordan 1 Retro High',
          size: '10',
          quantity: 1,
          price: 459,
          image: '/api/placeholder/100/100',
        },
      ],
      shipping: {
        address: '123 Fashion Street',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        trackingNumber: 'FR123456789',
        carrier: 'DHL',
      },
    },
    {
      id: 'ORD-2024-002',
      date: '2024-12-10',
      status: 'In Transit',
      total: 1578,
      items: [
        {
          id: '2',
          name: 'Nike Dunk Low',
          size: '9',
          quantity: 1,
          price: 789,
          image: '/api/placeholder/100/100',
        },
        {
          id: '3',
          name: 'Yeezy Boost 350 V2',
          size: '9.5',
          quantity: 1,
          price: 789,
          image: '/api/placeholder/100/100',
        },
      ],
      shipping: {
        address: '123 Fashion Street',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        trackingNumber: 'FR987654321',
        carrier: 'UPS',
      },
    },
  ];

  useEffect(() => {
    checkUser().then(() => {
      if (!user) {
        router.push('/auth/login');
      }
      setLoading(false);
    });
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return CheckCircle;
      case 'In Transit':
      case 'Shipped':
        return Truck;
      case 'Processing':
        return Clock;
      default:
        return Package;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/account/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Order History</h1>

        {mockOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              When you make your first purchase, it will appear here.
            </p>
            <Link
              href="/sneakers"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {mockOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{order.id}</h3>
                        <p className="text-gray-600 text-sm">
                          Ordered on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <StatusIcon className="w-5 h-5" />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Size: {item.size} | Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">€{item.price}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-4 border-t">
                      <p className="text-lg font-bold">
                        Total: €{order.total}
                      </p>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        {order.shipping.trackingNumber && (
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Truck className="w-4 h-4" />
                            Track Order
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        {order.status === 'Delivered' && (
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <RotateCcw className="w-4 h-4" />
                            Return
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Order Details</h2>
                    <p className="text-gray-600">{selectedOrder.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Items</h3>
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex gap-4 mb-3">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg"></div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Size: {item.size} | Quantity: {item.quantity}
                          </p>
                          <p className="font-medium">€{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Shipping Address</h3>
                    <p className="text-gray-600">
                      {selectedOrder.shipping.address}<br />
                      {selectedOrder.shipping.postalCode} {selectedOrder.shipping.city}<br />
                      {selectedOrder.shipping.country}
                    </p>
                  </div>

                  {selectedOrder.shipping.trackingNumber && (
                    <div>
                      <h3 className="font-semibold mb-3">Tracking Information</h3>
                      <p className="text-gray-600">
                        Carrier: {selectedOrder.shipping.carrier}<br />
                        Tracking Number: {selectedOrder.shipping.trackingNumber}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span>€{selectedOrder.total}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>€{selectedOrder.total}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800">
                      <Download className="w-5 h-5" />
                      Download Invoice
                    </button>
                    {selectedOrder.status === 'Delivered' && (
                      <Link
                        href="/returns"
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Start Return
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}