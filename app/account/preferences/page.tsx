'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bell, Mail, Smartphone, Globe, Moon } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export default function PreferencesPage() {
  const router = useRouter();
  const { user, checkUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newsletter: true,
    orderUpdates: true,
    promotions: false,
    language: 'en',
    currency: 'EUR',
    darkMode: false,
  });

  useEffect(() => {
    checkUser().then(() => {
      if (!user) {
        router.push('/auth/login');
      }
      setLoading(false);
    });
  }, []);

  const handleToggle = (key: string) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
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

        <h1 className="text-3xl font-bold mb-8">Preferences</h1>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h2>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', icon: Mail },
                { key: 'smsNotifications', label: 'SMS Notifications', icon: Smartphone },
                { key: 'pushNotifications', label: 'Push Notifications', icon: Bell },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <span>{item.label}</span>
                    </div>
                    <button
                      onClick={() => handleToggle(item.key)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        preferences[item.key as keyof typeof preferences]
                          ? 'bg-black'
                          : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences[item.key as keyof typeof preferences]
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Communication Preferences</h2>
            <div className="space-y-4">
              {[
                { key: 'newsletter', label: 'Weekly Newsletter' },
                { key: 'orderUpdates', label: 'Order Updates' },
                { key: 'promotions', label: 'Promotional Offers' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <button
                    onClick={() => handleToggle(item.key)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      preferences[item.key as keyof typeof preferences]
                        ? 'bg-black'
                        : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences[item.key as keyof typeof preferences]
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Regional Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg">
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg">
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}