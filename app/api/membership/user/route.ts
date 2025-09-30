// =============================================
// USER MEMBERSHIP API ROUTES
// GET /api/membership/user - Get current user's membership
// POST /api/membership/user - Create/update user membership
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user's membership with tier details
    const { data: membership, error } = await supabase
      .from('user_memberships')
      .select(`
        *,
        tier:membership_tiers(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Error fetching user membership:', error);
      return NextResponse.json(
        { error: 'Failed to fetch membership' },
        { status: 500 }
      );
    }

    // If no membership, user has default bronze
    if (!membership) {
      return NextResponse.json({
        success: true,
        membership: null,
        tier: 'bronze',
        hasMembership: false,
      });
    }

    return NextResponse.json({
      success: true,
      membership,
      tier: membership.tier,
      hasMembership: true,
    });
  } catch (error) {
    console.error('User membership API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tier, billing_period, stripe_subscription_id, stripe_customer_id } = body;

    // Validate tier
    if (!['bronze', 'silver', 'gold'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid membership tier' },
        { status: 400 }
      );
    }

    // Get tier details
    const { data: tierConfig, error: tierError } = await supabase
      .from('membership_tiers')
      .select('*')
      .eq('tier', tier)
      .single();

    if (tierError || !tierConfig) {
      return NextResponse.json(
        { error: 'Membership tier not found' },
        { status: 404 }
      );
    }

    // Calculate period end (30 days for monthly, 365 for yearly)
    const periodDays = billing_period === 'yearly' ? 365 : 30;
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setDate(currentPeriodEnd.getDate() + periodDays);

    // Cancel existing active membership
    await supabase
      .from('user_memberships')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('status', 'active');

    // Create new membership
    const { data: newMembership, error: createError } = await supabase
      .from('user_memberships')
      .insert({
        user_id: user.id,
        tier_id: tierConfig.id,
        tier,
        status: 'active',
        billing_period: billing_period || 'monthly',
        stripe_subscription_id,
        stripe_customer_id,
        current_period_start: new Date().toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        expires_at: currentPeriodEnd.toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating membership:', createError);
      return NextResponse.json(
        { error: 'Failed to create membership' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      membership: newMembership,
    });
  } catch (error) {
    console.error('Create membership API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}