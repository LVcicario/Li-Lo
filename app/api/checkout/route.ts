import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendOrderConfirmationEmail } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, shippingInfo, subtotal, shipping, tax, total } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${item.name} (Size ${item.size})`,
          images: item.image ? [item.image] : [],
          metadata: {
            product_id: item.id,
            size: item.size
          }
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    // Add shipping as a line item if applicable
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Shipping',
            description: 'Standard Delivery (5-7 business days)',
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      })
    }

    // Add tax as a line item
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Tax (VAT 20%)',
        },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: shippingInfo.email,
      metadata: {
        order_id: `ORDER_${Date.now()}`,
        customer_name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        customer_email: shippingInfo.email,
        shipping_address: JSON.stringify({
          line1: shippingInfo.address,
          city: shippingInfo.city,
          postal_code: shippingInfo.postalCode,
          country: shippingInfo.country,
        }),
        items: JSON.stringify(items)
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/checkout`,
    })

    // Store order info for email sending after successful payment
    // In a real app, you'd store this in a database
    if (session.url) {
      // Send confirmation email will be triggered by Stripe webhook after payment
      // For now, we'll just return the checkout URL
    }

    return NextResponse.json({
      success: true,
      url: session.url
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}