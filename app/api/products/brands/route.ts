import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: brands, error } = await supabase
      .from('brands')
      .select('*')
      .order('name')

    if (error) throw error

    return NextResponse.json(brands || [])
  } catch (error) {
    console.error('Brands API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}