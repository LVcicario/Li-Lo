// =============================================
// DROP NOTIFICATION API ROUTE
// POST /api/drops/[id]/notify - Subscribe to drop notifications
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: dropId } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notification_type = 'all' } = body;

    // Check if drop exists
    const { data: drop, error: dropError } = await supabase
      .from('drops')
      .select('id, name')
      .eq('id', dropId)
      .single();

    if (dropError || !drop) {
      return NextResponse.json(
        { error: 'Drop not found' },
        { status: 404 }
      );
    }

    // Check if notification already exists
    const { data: existing } = await supabase
      .from('drop_notifications')
      .select('id')
      .eq('user_id', user.id)
      .eq('drop_id', dropId)
      .eq('notification_type', notification_type)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Already subscribed to notifications',
      });
    }

    // Create notification subscription
    const { data: notification, error: notifyError } = await supabase
      .from('drop_notifications')
      .insert({
        user_id: user.id,
        drop_id: dropId,
        notification_type,
        notify_email: true,
        notify_push: true,
      })
      .select()
      .single();

    if (notifyError) {
      console.error('Error creating notification:', notifyError);
      return NextResponse.json(
        { error: 'Failed to enable notifications' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      notification,
      message: `You'll be notified about ${drop.name}`,
    });
  } catch (error) {
    console.error('Drop notification API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}