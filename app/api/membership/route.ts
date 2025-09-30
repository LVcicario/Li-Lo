// =============================================
// MEMBERSHIP API ROUTES
// GET /api/membership - Get all membership tiers
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Fetch all active membership tiers
    const { data: tiers, error } = await supabase
      .from('membership_tiers')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching membership tiers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch membership tiers' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tiers: tiers || [],
    });
  } catch (error) {
    console.error('Membership API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}