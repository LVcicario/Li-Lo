// =============================================
// SINGLE DROP API ROUTES
// GET /api/drops/[id] - Get drop details
// PUT /api/drops/[id] - Update drop (admin only)
// DELETE /api/drops/[id] - Delete drop (admin only)
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { canAccessDrop } from '@/types/drops';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

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

    // Fetch drop with products
    const { data: drop, error } = await supabase
      .from('drops')
      .select(`
        *,
        drop_products(
          *,
          product:products(
            *,
            images:product_images(*),
            variants:product_variants(*)
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching drop:', error);
      return NextResponse.json(
        { error: 'Drop not found' },
        { status: 404 }
      );
    }

    // Check access
    const access = canAccessDrop(drop, userTier);

    return NextResponse.json({
      success: true,
      drop: {
        ...drop,
        userHasAccess: access.canAccess,
        accessReason: access.reason,
        accessTime: access.accessTime,
      },
      userTier,
    });
  } catch (error) {
    console.error('Drop detail API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check admin access
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Update drop
    const { data: updatedDrop, error: updateError } = await supabase
      .from('drops')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating drop:', updateError);
      return NextResponse.json(
        { error: 'Failed to update drop' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      drop: updatedDrop,
    });
  } catch (error) {
    console.error('Update drop API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check admin access
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Delete drop (cascade will handle drop_products)
    const { error: deleteError } = await supabase
      .from('drops')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting drop:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete drop' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Drop deleted successfully',
    });
  } catch (error) {
    console.error('Delete drop API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}