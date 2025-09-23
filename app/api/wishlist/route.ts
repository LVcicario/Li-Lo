import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ items: [] })
    }

    // Load wishlist items from database
    const { data: wishlistItems, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        product:products(
          name,
          slug,
          base_price,
          category_type,
          status,
          brand:brands(name),
          images:product_images(url)
        ),
        variant:product_variants(
          sku,
          size,
          stock_quantity
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Transform to wishlist items
    const items = wishlistItems?.map(item => ({
      id: item.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      name: item.product.name,
      brand: item.product.brand.name,
      price: item.product.base_price,
      size: item.variant?.size,
      image: item.product.images?.[0]?.url || '',
      sku: item.variant?.sku || item.product.slug,
      slug: item.product.slug,
      category_type: item.product.category_type,
      is_available: item.product.status === 'active' && (item.variant?.stock_quantity > 0 || !item.variant),
      notes: item.notes,
      created_at: item.created_at
    })) || []

    return NextResponse.json({
      items,
      count: items.length
    })

  } catch (error: any) {
    console.error('Wishlist API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { product_id, variant_id, notes } = await request.json()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Please log in to add items to your wishlist' },
        { status: 401 }
      )
    }

    // Check if item already exists
    let query = supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product_id)

    if (variant_id) {
      query = query.eq('variant_id', variant_id)
    } else {
      query = query.is('variant_id', null)
    }

    const { data: existingItem } = await query.single()

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item already in wishlist' },
        { status: 400 }
      )
    }

    // Insert new wishlist item
    const wishlistData = {
      user_id: user.id,
      product_id,
      variant_id: variant_id || null,
      notes: notes || null
    }

    const { data: newWishlistItem, error } = await supabase
      .from('wishlist_items')
      .insert(wishlistData)
      .select(`
        *,
        product:products(
          name,
          slug,
          base_price,
          category_type,
          status,
          brand:brands(name),
          images:product_images(url)
        ),
        variant:product_variants(
          sku,
          size,
          stock_quantity
        )
      `)
      .single()

    if (error) throw error

    // Transform response
    const item = {
      id: newWishlistItem.id,
      product_id: newWishlistItem.product_id,
      variant_id: newWishlistItem.variant_id,
      name: newWishlistItem.product.name,
      brand: newWishlistItem.product.brand.name,
      price: newWishlistItem.product.base_price,
      size: newWishlistItem.variant?.size,
      image: newWishlistItem.product.images?.[0]?.url || '',
      sku: newWishlistItem.variant?.sku || newWishlistItem.product.slug,
      slug: newWishlistItem.product.slug,
      category_type: newWishlistItem.product.category_type,
      is_available: newWishlistItem.product.status === 'active' && (newWishlistItem.variant?.stock_quantity > 0 || !newWishlistItem.variant),
      notes: newWishlistItem.notes,
      created_at: newWishlistItem.created_at
    }

    return NextResponse.json(item)

  } catch (error: any) {
    console.error('Add to wishlist error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add item to wishlist' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { id, notes } = await request.json()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Please log in to update your wishlist' },
        { status: 401 }
      )
    }

    // Update notes
    const { data: updatedItem, error } = await supabase
      .from('wishlist_items')
      .update({
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns this item
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(updatedItem)

  } catch (error: any) {
    console.error('Update wishlist error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update wishlist item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')
  const product_id = searchParams.get('product_id')
  const variant_id = searchParams.get('variant_id')
  const clearAll = searchParams.get('clear_all') === 'true'

  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Please log in to manage your wishlist' },
        { status: 401 }
      )
    }

    if (clearAll) {
      // Clear entire wishlist
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error
    } else if (id) {
      // Remove specific item by ID
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user owns this item

      if (error) throw error
    } else if (product_id) {
      // Remove by product_id and optional variant_id
      let query = supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', product_id)

      if (variant_id) {
        query = query.eq('variant_id', variant_id)
      } else {
        query = query.is('variant_id', null)
      }

      const { error } = await query

      if (error) throw error
    } else {
      return NextResponse.json(
        { error: 'Item identifier required' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Delete wishlist item error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to remove item from wishlist' },
      { status: 500 }
    )
  }
}