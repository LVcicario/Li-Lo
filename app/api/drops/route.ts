// =============================================
// DROPS API ROUTES
// GET /api/drops - Get all active drops
// POST /api/drops - Create new drop (admin only)
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { canAccessDrop } from '@/types/drops';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get current user's membership tier
    const { data: { user } } = await supabase.auth.getUser();
    let userTier: 'bronze' | 'silver' | 'gold' | null = null;

    if (user) {
      const { data: membership } = await supabase
        .from('user_memberships')
        .select('tier')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      userTier = membership?.tier || 'bronze';
    }

    // Build query
    let query = supabase
      .from('drops')
      .select(`
        *,
        drop_products(
          *,
          product:products(*)
        )
      `)
      .order('drop_date', { ascending: false })
      .limit(limit);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    } else {
      // Default: show upcoming and live drops
      query = query.in('status', ['scheduled', 'announced', 'live']);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data: drops, error } = await query;

    if (error) {
      console.error('Error fetching drops:', error);
      return NextResponse.json(
        { error: 'Failed to fetch drops' },
        { status: 500 }
      );
    }

    // Add access information for each drop
    const dropsWithAccess = drops?.map(drop => {
      const access = canAccessDrop(drop, userTier);
      return {
        ...drop,
        userHasAccess: access.canAccess,
        accessReason: access.reason,
        accessTime: access.accessTime,
      };
    }) || [];

    return NextResponse.json({
      success: true,
      drops: dropsWithAccess,
      userTier,
    });
  } catch (error) {
    console.error('Drops API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      drop_type,
      tier_requirement,
      drop_date,
      end_date,
      total_quantity,
      products, // Array of product IDs with pricing
    } = body;

    // Validate required fields
    if (!name || !slug || !drop_date) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, drop_date' },
        { status: 400 }
      );
    }

    // Create drop
    const { data: newDrop, error: dropError } = await supabase
      .from('drops')
      .insert({
        name,
        slug,
        description,
        drop_type: drop_type || 'standard',
        tier_requirement,
        drop_date,
        end_date,
        total_quantity,
        remaining_quantity: total_quantity,
        early_access_bronze: 0,
        early_access_silver: 12,
        early_access_gold: 24,
      })
      .select()
      .single();

    if (dropError) {
      console.error('Error creating drop:', dropError);
      return NextResponse.json(
        { error: 'Failed to create drop' },
        { status: 500 }
      );
    }

    // Add products to drop if provided
    if (products && products.length > 0) {
      const dropProducts = products.map((p: any) => ({
        drop_id: newDrop.id,
        product_id: p.product_id,
        drop_price: p.drop_price,
        bronze_price: p.bronze_price,
        silver_price: p.silver_price,
        gold_price: p.gold_price,
        drop_quantity: p.quantity,
        sold_quantity: 0,
      }));

      const { error: productsError } = await supabase
        .from('drop_products')
        .insert(dropProducts);

      if (productsError) {
        console.error('Error adding products to drop:', productsError);
        // Rollback: delete the drop
        await supabase.from('drops').delete().eq('id', newDrop.id);
        return NextResponse.json(
          { error: 'Failed to add products to drop' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      drop: newDrop,
    });
  } catch (error) {
    console.error('Create drop API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}