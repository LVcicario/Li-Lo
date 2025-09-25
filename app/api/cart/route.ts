import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { strictRateLimit } from '@/lib/rate-limit'
import { sanitizeInput } from '@/lib/sanitization'

// In-memory cart storage for development
const memoryCart = new Map<string, any[]>();

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await strictRateLimit(request)
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.error },
      {
        status: 429,
        headers: {
          'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
        }
      }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const sessionId = sanitizeInput(searchParams.get('session_id') || 'default')

  try {
    const supabase = await createClient()

    // Try to get current user
    const { data: { user } } = await supabase.auth.getUser()
    const cartKey = user ? user.id : sessionId;

    // Try database first
    try {
      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(
            name,
            slug,
            brand:brands(name),
            images:product_images(url)
          ),
          variant:product_variants(
            sku,
            size,
            stock_quantity
          )
        `)
        .eq(user ? 'user_id' : 'session_id', cartKey)
        .order('created_at', { ascending: false })

      if (!error && cartItems) {
        // Transform to cart items
        const items = cartItems.map(item => ({
          id: item.id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          name: item.product.name,
          brand: item.product.brand.name,
          price: item.price_at_time,
          size: item.variant.size,
          quantity: item.quantity,
          image: item.product.images?.[0]?.url || '',
          sku: item.variant.sku,
          max_quantity: item.variant.stock_quantity,
        }))

        return NextResponse.json({
          items,
          total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          count: items.reduce((sum, item) => sum + item.quantity, 0)
        })
      }
    } catch (dbError) {
      // Fallback to in-memory storage
      console.log('Using in-memory cart storage');
    }

    // Use in-memory storage as fallback
    const items = memoryCart.get(cartKey) || [];

    return NextResponse.json({
      items,
      total: items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
      count: items.reduce((sum: number, item: any) => sum + item.quantity, 0)
    })

  } catch (error: any) {
    console.error('Cart API error:', error)
    // Return empty cart instead of error
    return NextResponse.json({
      items: [],
      total: 0,
      count: 0
    })
  }
}

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await strictRateLimit(request)
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.error },
      {
        status: 429,
        headers: {
          'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
        }
      }
    )
  }

  try {
    const supabase = await createClient()
    const rawData = await request.json()

    // Sanitize inputs
    const product_id = sanitizeInput(rawData.product_id)
    const variant_id = sanitizeInput(rawData.variant_id)
    const quantity = parseInt(rawData.quantity) || 0
    const price_at_time = parseFloat(rawData.price_at_time) || 0
    const session_id = sanitizeInput(rawData.session_id || '')

    // Validate inputs
    if (!product_id || !variant_id || quantity <= 0 || price_at_time <= 0) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('product_id', product_id)
      .eq('variant_id', variant_id)
      .eq(user ? 'user_id' : 'session_id', user ? user.id : session_id)
      .single()

    if (existingItem) {
      // Update quantity
      const { data: updatedItem, error } = await supabase
        .from('cart_items')
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(updatedItem)
    }

    // Check stock availability
    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .select('stock_quantity')
      .eq('id', variant_id)
      .single()

    if (variantError) throw variantError

    if (variant.stock_quantity < quantity) {
      return NextResponse.json(
        { error: `Only ${variant.stock_quantity} items available in stock` },
        { status: 400 }
      )
    }

    // Insert new cart item
    const cartItemData = {
      product_id,
      variant_id,
      quantity,
      price_at_time,
      ...(user ? { user_id: user.id } : { session_id })
    }

    const { data: newCartItem, error } = await supabase
      .from('cart_items')
      .insert(cartItemData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(newCartItem)

  } catch (error: any) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await strictRateLimit(request)
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.error },
      {
        status: 429,
        headers: {
          'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
        }
      }
    )
  }

  try {
    const supabase = await createClient()
    const rawData = await request.json()

    const id = sanitizeInput(rawData.id)
    const quantity = parseInt(rawData.quantity) || 0

    if (!id) {
      return NextResponse.json(
        { error: 'Cart item ID is required' },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      // Delete item if quantity is 0 or less
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    // Check stock availability
    const { data: cartItem } = await supabase
      .from('cart_items')
      .select('variant_id')
      .eq('id', id)
      .single()

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .select('stock_quantity')
      .eq('id', cartItem.variant_id)
      .single()

    if (variantError) throw variantError

    if (variant.stock_quantity < quantity) {
      return NextResponse.json(
        { error: `Only ${variant.stock_quantity} items available in stock` },
        { status: 400 }
      )
    }

    // Update quantity
    const { data: updatedItem, error } = await supabase
      .from('cart_items')
      .update({
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(updatedItem)

  } catch (error: any) {
    console.error('Update cart error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await strictRateLimit(request)
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.error },
      {
        status: 429,
        headers: {
          'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
        }
      }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const id = sanitizeInput(searchParams.get('id') || '')
  const sessionId = sanitizeInput(searchParams.get('session_id') || '')
  const clearAll = searchParams.get('clear_all') === 'true'

  try {
    const supabase = await createClient()

    if (clearAll) {
      // Clear entire cart
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq(user ? 'user_id' : 'session_id', user ? user.id : sessionId)

      if (error) throw error
    } else if (id) {
      // Remove specific item
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)

      if (error) throw error
    } else {
      return NextResponse.json(
        { error: 'Item ID required' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Delete cart item error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to remove item from cart' },
      { status: 500 }
    )
  }
}