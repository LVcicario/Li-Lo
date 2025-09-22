import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { paymentRateLimit } from '@/lib/rate-limit'
import { sanitizeAndValidateFormData } from '@/lib/sanitization'
import { CONFIG } from '@/lib/env-validation'
import Stripe from 'stripe'

const stripe = new Stripe(CONFIG.STRIPE.SECRET_KEY, {
  apiVersion: CONFIG.STRIPE.API_VERSION,
})

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await paymentRateLimit(request)
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.error },
      {
        status: 429,
        headers: {
          'Retry-After': rateLimitResult.retryAfter?.toString() || '3600'
        }
      }
    )
  }

  try {
    const rawData = await request.json()

    // Validate and sanitize shipping address
    const shippingValidation = sanitizeAndValidateFormData(rawData.shipping_address)
    if (!shippingValidation.isValid) {
      return NextResponse.json(
        { error: `Invalid shipping address: ${shippingValidation.errors.join(', ')}` },
        { status: 400 }
      )
    }

    const { cart_items, billing_address, discount_code, currency = 'USD' } = rawData
    const shipping_address = shippingValidation.sanitizedData
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Please log in to proceed with checkout' },
        { status: 401 }
      )
    }

    // Validate cart items and get latest data
    const cartItemIds = cart_items.map((item: any) => item.id)
    const { data: validCartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(
          id,
          name,
          slug,
          base_price,
          brand:brands(name),
          images:product_images(url)
        ),
        variant:product_variants(
          id,
          sku,
          size,
          stock_quantity
        )
      `)
      .in('id', cartItemIds)
      .eq('user_id', user.id)

    if (cartError) throw cartError
    if (!validCartItems || validCartItems.length === 0) {
      return NextResponse.json(
        { error: 'No valid cart items found' },
        { status: 400 }
      )
    }

    // Check stock availability
    for (const item of validCartItems) {
      if (item.variant.stock_quantity < item.quantity) {
        return NextResponse.json(
          { error: `${item.product.name} (Size ${item.variant.size}) has insufficient stock. Only ${item.variant.stock_quantity} available.` },
          { status: 400 }
        )
      }
    }

    // Calculate totals
    const subtotal = validCartItems.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0)
    let discountAmount = 0
    let discountCodeData = null

    // Apply discount code if provided
    if (discount_code) {
      const { data: discount, error: discountError } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', discount_code.toUpperCase())
        .eq('is_active', true)
        .single()

      if (!discountError && discount) {
        const now = new Date()
        const startsAt = discount.starts_at ? new Date(discount.starts_at) : null
        const expiresAt = discount.expires_at ? new Date(discount.expires_at) : null

        if ((!startsAt || now >= startsAt) && (!expiresAt || now <= expiresAt)) {
          if (!discount.usage_limit || discount.used_count < discount.usage_limit) {
            if (!discount.minimum_order_amount || subtotal >= discount.minimum_order_amount) {
              discountCodeData = discount

              if (discount.type === 'percentage') {
                discountAmount = subtotal * (discount.value / 100)
                if (discount.maximum_discount_amount) {
                  discountAmount = Math.min(discountAmount, discount.maximum_discount_amount)
                }
              } else if (discount.type === 'fixed_amount') {
                discountAmount = Math.min(discount.value, subtotal)
              }
            }
          }
        }
      }
    }

    const total = subtotal - discountAmount
    const currencyCode = currency.toLowerCase()

    // Convert to cents
    const totalCents = Math.round(total * 100)

    // Create order in database first
    const orderData = {
      user_id: user.id,
      subtotal,
      discount_amount: discountAmount,
      total_amount: total,
      currency: currency,
      customer_email: user.email!,
      billing_address: billing_address,
      shipping_address: shipping_address,
      status: 'pending',
      payment_status: 'pending'
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = validCartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.product.name,
      product_sku: item.product.slug,
      variant_sku: item.variant.sku,
      size: item.variant.size,
      quantity: item.quantity,
      unit_price: item.price_at_time,
      total_price: item.price_at_time * item.quantity
    }))

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (orderItemsError) throw orderItemsError

    // Record discount usage if applicable
    if (discountCodeData && discountAmount > 0) {
      await supabase
        .from('discount_code_usage')
        .insert({
          discount_code_id: discountCodeData.id,
          order_id: order.id,
          user_id: user.id,
          discount_amount: discountAmount
        })

      // Update usage count
      await supabase
        .from('discount_codes')
        .update({ used_count: discountCodeData.used_count + 1 })
        .eq('id', discountCodeData.id)
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email!,
      line_items: validCartItems.map((item) => ({
        price_data: {
          currency: currencyCode,
          product_data: {
            name: item.product.name,
            description: `${item.product.brand.name} - Size: ${item.variant.size}`,
            images: item.product.images?.[0]?.url ? [item.product.images[0].url] : [],
            metadata: {
              product_id: item.product_id,
              variant_id: item.variant_id,
              order_id: order.id,
              size: item.variant.size,
            },
          },
          unit_amount: Math.round(item.price_at_time * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${request.headers.get('origin')}/cart?order_cancelled=${order.id}`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: currency === 'USD' ? 1999 : 1500, // $19.99 or €15.00
              currency: currencyCode,
            },
            display_name: 'Li-Lo Standard Delivery',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: currency === 'USD' ? 3999 : 2999, // $39.99 or €29.99
              currency: currencyCode,
            },
            display_name: 'Li-Lo Express Delivery',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 2,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: currency === 'USD' ? 9999 : 7999, // $99.99 or €79.99
              currency: currencyCode,
            },
            display_name: 'Li-Lo White Glove Service',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 1,
              },
            },
          },
        },
      ],
      discounts: discountAmount > 0 ? [{
        coupon: await stripe.coupons.create({
          amount_off: Math.round(discountAmount * 100),
          currency: currencyCode,
          duration: 'once',
          name: `Li-Lo Discount - ${discount_code}`,
        }).then(coupon => coupon.id)
      }] : undefined,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
        user_id: user.id,
        discount_code: discount_code || '',
        original_subtotal: subtotal.toString(),
        discount_amount: discountAmount.toString(),
      },
      locale: 'auto',
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      custom_text: {
        submit: {
          message: 'Complete your Li-Lo luxury sneaker purchase'
        },
        shipping_address: {
          message: 'Please provide your shipping address for these exclusive items'
        }
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `Li-Lo Order ${order.order_number}`,
          metadata: {
            order_id: order.id,
            order_number: order.order_number
          }
        }
      }
    })

    // Update order with payment intent ID
    await supabase
      .from('orders')
      .update({ payment_intent_id: session.id })
      .eq('id', order.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      order_id: order.id,
      order_number: order.order_number
    })

  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionId = searchParams.get('session_id')
  const orderId = searchParams.get('order_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
  }

  try {
    const supabase = await createClient()

    // Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer', 'payment_intent'],
    })

    // Update order status based on payment status
    if (orderId && session.payment_status === 'paid') {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          shipping_address: session.shipping_details,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (updateError) {
        console.error('Error updating order:', updateError)
      } else {
        // Clear cart after successful payment
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)
        }
      }
    }

    // Get order details if orderId provided
    let orderDetails = null
    if (orderId) {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items:order_items(
            *,
            product:products(name, slug, brand:brands(name)),
            variant:product_variants(size, sku)
          )
        `)
        .eq('id', orderId)
        .single()

      if (!orderError) {
        orderDetails = order
      }
    }

    return NextResponse.json({
      session: {
        id: session.id,
        payment_status: session.payment_status,
        customer_details: session.customer_details,
        shipping_details: session.shipping_details,
        amount_total: session.amount_total,
        amount_subtotal: session.amount_subtotal,
        currency: session.currency,
      },
      order: orderDetails,
      line_items: session.line_items?.data,
    })
  } catch (error: any) {
    console.error('Stripe session retrieval error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve session' },
      { status: 500 }
    )
  }
}