import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Predefined discount codes for testing
const DISCOUNT_CODES = {
  'WELCOME10': {
    code: 'WELCOME10',
    name: 'Welcome Discount',
    description: '10% off your first order',
    type: 'percentage',
    value: 10,
    is_active: true,
    minimum_order_amount: 100
  },
  'SNEAKER20': {
    code: 'SNEAKER20',
    name: 'Sneaker Sale',
    description: '20% off selected sneakers',
    type: 'percentage',
    value: 20,
    is_active: true,
    minimum_order_amount: 200
  },
  'FREESHIP': {
    code: 'FREESHIP',
    name: 'Free Shipping',
    description: 'Free shipping on all orders',
    type: 'free_shipping',
    value: 0,
    is_active: true,
    minimum_order_amount: 0
  },
  'SAVE50': {
    code: 'SAVE50',
    name: '$50 Off',
    description: '$50 off orders over $500',
    type: 'fixed_amount',
    value: 50,
    is_active: true,
    minimum_order_amount: 500
  }
}

// Support GET for testing
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Discount validation endpoint',
    available_codes: Object.keys(DISCOUNT_CODES),
    usage: 'POST /api/discount/validate with { code: "CODE", subtotal: 100 }'
  })
}

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Discount code is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    let discount = null;

    // Try database first
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single()

      if (!error && data) {
        discount = data;
      }
    } catch (dbError) {
      console.log('Using fallback discount codes');
    }

    // Fallback to predefined codes
    if (!discount) {
      discount = DISCOUNT_CODES[code.toUpperCase() as keyof typeof DISCOUNT_CODES];
    }

    if (!discount) {
      return NextResponse.json(
        { error: 'Invalid discount code' },
        { status: 400 }
      )
    }

    // Check if discount is still valid
    const now = new Date()
    const startsAt = discount.starts_at ? new Date(discount.starts_at) : null
    const expiresAt = discount.expires_at ? new Date(discount.expires_at) : null

    if (startsAt && now < startsAt) {
      return NextResponse.json(
        { error: 'Discount code is not yet active' },
        { status: 400 }
      )
    }

    if (expiresAt && now > expiresAt) {
      return NextResponse.json(
        { error: 'Discount code has expired' },
        { status: 400 }
      )
    }

    // Check usage limit
    if (discount.usage_limit && discount.used_count >= discount.usage_limit) {
      return NextResponse.json(
        { error: 'Discount code has reached its usage limit' },
        { status: 400 }
      )
    }

    // Check minimum order amount
    if (discount.minimum_order_amount && subtotal < discount.minimum_order_amount) {
      return NextResponse.json(
        {
          error: `Minimum order amount of $${discount.minimum_order_amount} required`
        },
        { status: 400 }
      )
    }

    // Calculate discount amount
    let discountAmount = 0

    if (discount.type === 'percentage') {
      discountAmount = subtotal * (discount.value / 100)
      if (discount.maximum_discount_amount) {
        discountAmount = Math.min(discountAmount, discount.maximum_discount_amount)
      }
    } else if (discount.type === 'fixed_amount') {
      discountAmount = Math.min(discount.value, subtotal)
    } else if (discount.type === 'free_shipping') {
      // For free shipping, we'll return a special indicator
      discountAmount = 0 // Will be handled in checkout
    }

    return NextResponse.json({
      valid: true,
      discount_amount: discountAmount,
      discount_type: discount.type,
      discount_name: discount.name,
      discount_description: discount.description
    })

  } catch (error: any) {
    console.error('Discount validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate discount code' },
      { status: 500 }
    )
  }
}