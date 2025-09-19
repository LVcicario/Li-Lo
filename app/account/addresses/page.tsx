'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export default function AddressesPage() {
  const router = useRouter();
  const { user, checkUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      name: 'Home',
      street: '123 Fashion Street',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Office',
      street: '456 Business Avenue',
      city: 'Lyon',
      postalCode: '69001',
      country: 'France',
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
          <h1 className="text-3xl font-bold">Shipping Addresses</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            <Plus className="w-5 h-5" />
            Add Address
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold">{address.name}</h3>
                  {address.isDefault && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600">
                {address.street}<br />
                {address.postalCode} {address.city}<br />
                {address.country}
              </p>
              {!address.isDefault && (
                <button className="mt-4 text-sm text-black hover:underline">
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