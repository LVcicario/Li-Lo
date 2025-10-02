import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendOrderConfirmationEmail } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_webhook_secret_placeholder'
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session

      // Extract order details from metadata
      const metadata = session.metadata || {}
      const orderId = metadata.order_id || `ORDER_${Date.now()}`
      const customerName = metadata.customer_name || 'Customer'
      const customerEmail = metadata.customer_email || session.customer_email || ''

      let shippingAddress = {
        address: '',
        city: '',
        postalCode: '',
        country: ''
      }

      try {
        if (metadata.shipping_address) {
          shippingAddress = JSON.parse(metadata.shipping_address)
        }
      } catch (e) {
        console.error('Failed to parse shipping address:', e)
      }

      let items = []
      try {
        if (metadata.items) {
          items = JSON.parse(metadata.items)
        }
      } catch (e) {
        console.error('Failed to parse items:', e)
      }

      // Send confirmation email
      if (customerEmail) {
        await sendOrderConfirmationEmail({
          orderId,
          customerName,
          customerEmail,
          items: items.map((item: any) => ({
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price
          })),
          subtotal: (session.amount_subtotal || 0) / 100,
          shipping: 0, // Calculate based on your logic
          tax: ((session.amount_total || 0) - (session.amount_subtotal || 0)) / 100,
          total: (session.amount_total || 0) / 100,
          shippingAddress
        })

        console.log(`Order confirmation email sent for ${orderId} to ${customerEmail}`)
      }

      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}