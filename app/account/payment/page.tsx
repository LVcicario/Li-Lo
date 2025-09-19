'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export default function PaymentPage() {
  const router = useRouter();
  const { user, checkUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([
    {
      id: '1',
      type: 'Visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Mastercard',
      last4: '8888',
      expiry: '06/26',
      isDefault: false,
    },
  ]);

  useEffect(() => {
    checkUser().then(() => {
      if (!user) {
        router.push('/auth/login');
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/account/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Payment Methods</h1>
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            <Plus className="w-5 h-5" />
            Add Card
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8" />
                  <div>
                    <p className="font-semibold">
                      {card.type} ending in {card.last4}
                    </p>
                    <p className="text-sm text-gray-600">Expires {card.expiry}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
              {card.isDefault ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Default
                </span>
              ) : (
                <button className="text-sm text-black hover:underline">
                  Set as default
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}