// =============================================
// DROP NOTIFICATION SENDER API
// Cron job to notify users about upcoming drops
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendDropNotificationEmail } from '@/lib/email/resend';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Get all drops happening in next 24 hours that haven't been notified
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const { data: upcomingDrops, error: dropsError } = await supabase
      .from('drops')
      .select('id, name, drop_date, slug')
      .gte('drop_date', now.toISOString())
      .lte('drop_date', tomorrow.toISOString())
      .eq('status', 'scheduled');

    if (dropsError) {
      console.error('Error fetching drops:', dropsError);
      return NextResponse.json({ error: 'Failed to fetch drops' }, { status: 500 });
    }

    if (!upcomingDrops || upcomingDrops.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No upcoming drops to notify',
        notified: 0
      });
    }

    let totalNotified = 0;

    // For each drop, get subscribers and send notifications
    for (const drop of upcomingDrops) {
      const { data: subscribers, error: subsError } = await supabase
        .from('drop_notifications')
        .select(`
          id,
          user_id,
          notify_email,
          profiles!inner(email, first_name)
        `)
        .eq('drop_id', drop.id)
        .eq('is_notified', false)
        .eq('notify_email', true);

      if (subsError) {
        console.error(`Error fetching subscribers for drop ${drop.id}:`, subsError);
        continue;
      }

      if (!subscribers || subscribers.length === 0) continue;

      // Send email to each subscriber
      for (const sub of subscribers) {
        const profile = (sub as any).profiles;

        console.log(`📧 Sending email to ${profile.email} about drop: ${drop.name}`);

        // Send email via Resend
        const emailResult = await sendDropNotificationEmail({
          to: profile.email,
          firstName: profile.first_name || 'Sneaker Head',
          dropName: drop.name,
          dropDate: new Date(drop.drop_date),
          dropSlug: drop.slug,
        });

        if (emailResult.success) {
          // Mark as notified only if email sent successfully
          await supabase
            .from('drop_notifications')
            .update({
              is_notified: true,
              notified_at: now.toISOString()
            })
            .eq('id', sub.id);

          totalNotified++;
        } else {
          console.error(`Failed to send email to ${profile.email}:`, emailResult.error);
        }
      }

      // Update drop status to 'announced' if not already
      await supabase
        .from('drops')
        .update({ status: 'announced' })
        .eq('id', drop.id)
        .eq('status', 'scheduled');
    }

    return NextResponse.json({
      success: true,
      message: `Notified ${totalNotified} subscribers about ${upcomingDrops.length} drops`,
      dropsProcessed: upcomingDrops.length,
      notified: totalNotified,
    });

  } catch (error) {
    console.error('Notification cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint for manual trigger (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check admin access
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Trigger notification manually
    return POST(request);

  } catch (error) {
    console.error('Manual trigger error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}