import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://slbjfaqsdhwsusctqggk.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Sneaker = {
  id: string
  name: string
  brand: string
  model: string
  price: number
  description: string
  images: string[]
  sizes: number[]
  color: string
  release_date: string
  category: 'rare' | 'ultra-premium' | 'limited' | 'exclusive'
  stock: number
  featured: boolean
  created_at: string
}

export type CartItem = {
  id: string
  sneaker_id: string
  quantity: number
  size: number
  sneaker?: Sneaker
}