// =============================================
// MEMBERSHIP CHECKOUT API ROUTE
// POST /api/membership/checkout - Create Stripe checkout session
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

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
    const { tier, billing_period = 'monthly' } = body;

    // Validate tier
    if (!['bronze', 'silver', 'gold'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid membership tier' },
        { status: 400 }
      );
    }

    // Get tier configuration
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

    // Bronze is free
    if (tier === 'bronze') {
      return NextResponse.json(
        { error: 'Bronze membership is free' },
        { status: 400 }
      );
    }

    // Calculate price
    const price = billing_period === 'yearly'
      ? tierConfig.price_yearly
      : tierConfig.price_monthly;

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    // Create or retrieve Stripe customer
    let customerId: string;

    const { data: existingMembership } = await supabase
      .from('user_memberships')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (existingMembership?.stripe_customer_id) {
      customerId = existingMembership.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: profile?.email || user.email!,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tierConfig.name} Membership`,
              description: tierConfig.description,
              images: [
                // Add tier badge image if available
              ],
            },
            unit_amount: Math.round(price * 100), // Convert to cents
            recurring: {
              interval: billing_period === 'yearly' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/membership`,
      metadata: {
        user_id: user.id,
        tier: tier,
        billing_period: billing_period,
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Membership checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}