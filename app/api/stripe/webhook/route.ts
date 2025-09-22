import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CONFIG } from '@/lib/env-validation'
import Stripe from 'stripe'

const stripe = new Stripe(CONFIG.STRIPE.SECRET_KEY, {
  apiVersion: CONFIG.STRIPE.API_VERSION,
})

const webhookSecret = CONFIG.STRIPE.WEBHOOK_SECRET

// Track processed events to prevent duplicates
const processedEvents = new Set<string>()

// Clean up old processed events every hour
setInterval(() => {
  processedEvents.clear()
}, 60 * 60 * 1000)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Check for duplicate events
  if (processedEvents.has(event.id)) {
    console.log(`Duplicate event received: ${event.id}`)
    return NextResponse.json({ received: true })
  }

  console.log(`Processing Stripe webhook: ${event.type} (${event.id})`)

  try {
    const supabase = await createClient()

    // Mark event as being processed
    processedEvents.add(event.id)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout session completed:', session.id)

        // Get order ID from metadata
        const orderId = session.metadata?.order_id
        if (!orderId) {
          console.error('No order ID in session metadata')
          break
        }

        // Update order status
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            payment_intent_id: session.payment_intent as string,
            shipping_address: session.shipping_details,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId)

        if (orderError) {
          console.error('Error updating order:', orderError)
          break
        }

        // Update inventory (reduce stock)
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('variant_id, quantity')
          .eq('order_id', orderId)

        if (itemsError) {
          console.error('Error fetching order items:', itemsError)
          break
        }

        // Update stock for each item
        for (const item of orderItems) {
          // Get current stock first
          const { data: variant, error: fetchError } = await supabase
            .from('product_variants')
            .select('stock_quantity')
            .eq('id', item.variant_id)
            .single()

          if (fetchError || !variant) {
            console.error('Error fetching variant for stock update:', fetchError)
            continue
          }

          const newStock = Math.max(0, variant.stock_quantity - item.quantity)

          const { error: stockError } = await supabase
            .from('product_variants')
            .update({
              stock_quantity: newStock,
              updated_at: new Date().toISOString()
            })
            .eq('id', item.variant_id)

          if (stockError) {
            console.error('Error updating stock:', stockError)
          }

          // Log stock movement
          await supabase
            .from('stock_movements')
            .insert({
              variant_id: item.variant_id,
              movement_type: 'outbound',
              quantity: -item.quantity,
              reference_type: 'order',
              reference_id: orderId,
              notes: `Order ${session.metadata?.order_number} payment confirmed`
            })
        }

        // Clear user's cart
        const userId = session.metadata?.user_id
        if (userId) {
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)
        }

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment intent succeeded:', paymentIntent.id)

        // Find order by payment intent ID
        const { data: order, error: findError } = await supabase
          .from('orders')
          .select('id')
          .eq('payment_intent_id', paymentIntent.id)
          .single()

        if (findError || !order) {
          console.error('Order not found for payment intent:', paymentIntent.id)
          break
        }

        // Ensure order is marked as paid
        await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id)

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment intent failed:', paymentIntent.id)

        // Find order by payment intent ID
        const { data: order, error: findError } = await supabase
          .from('orders')
          .select('id')
          .eq('payment_intent_id', paymentIntent.id)
          .single()

        if (findError || !order) {
          console.error('Order not found for payment intent:', paymentIntent.id)
          break
        }

        // Mark order as failed
        await supabase
          .from('orders')
          .update({
            status: 'cancelled',
            payment_status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id)

        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Invoice payment succeeded:', invoice.id)

        // Handle subscription or recurring payment if needed
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('Subscription deleted:', subscription.id)

        // Handle subscription cancellation if needed
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout session expired:', session.id)

        // Get order ID from metadata
        const orderId = session.metadata?.order_id
        if (orderId) {
          // Cancel the order
          await supabase
            .from('orders')
            .update({
              status: 'cancelled',
              payment_status: 'failed',
              updated_at: new Date().toISOString()
            })
            .eq('id', orderId)
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    console.log(`Successfully processed webhook: ${event.type} (${event.id})`)
    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error(`Webhook handler error for ${event.type} (${event.id}):`, error)

    // Remove from processed events on error so it can be retried
    processedEvents.delete(event.id)

    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}