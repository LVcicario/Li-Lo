'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Phone, Calendar, MapPin, Save } from 'lucide-react'

interface ProfileData {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  date_of_birth?: string
  gender?: string
  language_preference?: string
  currency_preference?: string
}

interface Address {
  id: string
  type: string
  label?: string
  first_name: string
  last_name: string
  company?: string
  address_line_1: string
  address_line_2?: string
  city: string
  state_province?: string
  postal_code: string
  country: string
  phone?: string
  is_default: boolean
}

export default function ClientProfile() {
  const { user, profile, checkUser } = useAuthStore()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      loadProfileData()
    }
  }, [user])

  const loadProfileData = async () => {
    const supabase = createClient()

    try {
      // Get profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()

      if (profileData) {
        setProfileData(profileData)
      }

      // Get addresses
      const { data: addressData } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user!.id)
        .order('is_default', { ascending: false })

      if (addressData) {
        setAddresses(addressData)
      }
    } catch (error) {
      console.error('Error loading profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    if (!profileData) return

    setSaving(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone: profileData.phone,
          date_of_birth: profileData.date_of_birth,
          gender: profileData.gender,
          language_preference: profileData.language_preference,
          currency_preference: profileData.currency_preference,
          updated_at: new Date().toISOString()
        })
        .eq('id', user!.id)

      if (error) throw error

      // Update auth store
      checkUser()

      // Show success message (you can implement toast here)
      console.log('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!profileData) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
        <p className="text-gray-600">Manage your account details and preferences</p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              First Name
            </label>
            <input
              type="text"
              value={profileData.first_name || ''}
              onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Last Name
            </label>
            <input
              type="text"
              value={profileData.last_name || ''}
              onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Enter your last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              value={profileData.email}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone || ''}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date of Birth
            </label>
            <input
              type="date"
              value={profileData.date_of_birth || ''}
              onChange={(e) => setProfileData({ ...profileData, date_of_birth: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              value={profileData.gender || ''}
              onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={profileData.language_preference || 'en'}
              onChange={(e) => setProfileData({ ...profileData, language_preference: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={profileData.currency_preference || 'EUR'}
              onChange={(e) => setProfileData({ ...profileData, currency_preference: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={updateProfile}
            disabled={saving}
            className="inline-flex items-center px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Addresses */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Saved Addresses</h2>
          <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50">
            Add New Address
          </button>
        </div>

        <div className="space-y-4">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {address.label || address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                      </span>
                      {address.is_default && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {address.first_name} {address.last_name}
                      {address.company && <span className="block">{address.company}</span>}
                      <span className="block">{address.address_line_1}</span>
                      {address.address_line_2 && <span className="block">{address.address_line_2}</span>}
                      <span className="block">
                        {address.city}, {address.state_province} {address.postal_code}
                      </span>
                      <span className="block">{address.country}</span>
                      {address.phone && <span className="block">{address.phone}</span>}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-sm text-gray-600 hover:text-gray-900">Edit</button>
                    <button className="text-sm text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No addresses saved yet</p>
              <button className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800">
                Add Your First Address
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}