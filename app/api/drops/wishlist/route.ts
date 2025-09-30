// =============================================
// DROP WISHLIST API
// Manage user's wishlist for drops
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/drops/wishlist
 * Get user's wishlist drops
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get wishlist with drop details
    const { data: wishlist, error: wishlistError } = await supabase
      .from('drop_wishlist')
      .select(`
        id,
        drop_id,
        notify_on_drop,
        created_at,
        drops!inner(
          id,
          name,
          description,
          slug,
          drop_date,
          status,
          image_url,
          early_access_gold,
          early_access_silver
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (wishlistError) {
      console.error('Error fetching wishlist:', wishlistError);
      return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }

    // Format response
    const formattedWishlist = wishlist.map((item: any) => ({
      wishlist_id: item.id,
      notify_on_drop: item.notify_on_drop,
      added_at: item.created_at,
      drop: item.drops,
    }));

    return NextResponse.json({
      success: true,
      wishlist: formattedWishlist,
      count: wishlist.length,
    });

  } catch (error) {
    console.error('Wishlist API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/drops/wishlist
 * Add drop to wishlist
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { drop_id, notify_on_drop = true } = body;

    if (!drop_id) {
      return NextResponse.json({ error: 'drop_id is required' }, { status: 400 });
    }

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if drop exists
    const { data: drop, error: dropError } = await supabase
      .from('drops')
      .select('id, name')
      .eq('id', drop_id)
      .single();

    if (dropError || !drop) {
      return NextResponse.json({ error: 'Drop not found' }, { status: 404 });
    }

    // Add to wishlist
    const { data: wishlistItem, error: insertError } = await supabase
      .from('drop_wishlist')
      .insert({
        user_id: user.id,
        drop_id,
        notify_on_drop,
      })
      .select()
      .single();

    if (insertError) {
      // Check if already in wishlist
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'Drop already in wishlist' }, { status: 409 });
      }

      console.error('Error adding to wishlist:', insertError);
      return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Drop added to wishlist',
      wishlist_item: wishlistItem,
    });

  } catch (error) {
    console.error('Wishlist API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/drops/wishlist
 * Remove drop from wishlist
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const drop_id = searchParams.get('drop_id');

    if (!drop_id) {
      return NextResponse.json({ error: 'drop_id is required' }, { status: 400 });
    }

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Remove from wishlist
    const { error: deleteError } = await supabase
      .from('drop_wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('drop_id', drop_id);

    if (deleteError) {
      console.error('Error removing from wishlist:', deleteError);
      return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Drop removed from wishlist',
    });

  } catch (error) {
    console.error('Wishlist API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}