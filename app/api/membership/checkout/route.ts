import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const MEMBERSHIP_PRICES = {
  bronze: {
    monthly: 19.99,
    yearly: 199.99,
    name: 'Bronze Membership',
    benefits: ['Early Access', 'Member Pricing', 'Newsletter']
  },
  silver: {
    monthly: 49.99,
    yearly: 499.99,
    name: 'Silver Membership',
    benefits: ['All Bronze Benefits', 'Exclusive Drops', 'Priority Support', 'Free Shipping']
  },
  gold: {
    monthly: 99.99,
    yearly: 999.99,
    name: 'Gold Membership',
    benefits: ['All Silver Benefits', 'VIP Events', 'Personal Shopper', 'First Access to Grails']
  }
};

export async function POST(req: Request) {
  try {
    const { tier, period } = await req.json();

    if (!tier || !period) {
      return NextResponse.json(
        { error: 'Missing tier or period' },
        { status: 400 }
      );
    }

    const membership = MEMBERSHIP_PRICES[tier as keyof typeof MEMBERSHIP_PRICES];
    if (!membership) {
      return NextResponse.json(
        { error: 'Invalid membership tier' },
        { status: 400 }
      );
    }

    const amount = period === 'yearly' ? membership.yearly : membership.monthly;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: membership.name,
              description: membership.benefits.join(' • '),
              images: ['https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500'],
            },
            recurring: {
              interval: period === 'yearly' ? 'year' : 'month',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        tier,
        period
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/?membership=success&tier=${tier}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/membership`,
    });

    return NextResponse.json({
      success: true,
      url: session.url
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}