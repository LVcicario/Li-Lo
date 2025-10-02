import nodemailer from 'nodemailer'

// Create transporter using Gmail SMTP from .env.local
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'marketia.teams@gmail.com',
    pass: process.env.SMTP_PASS || 'klle osid epxu bxcr'
  }
})

export interface OrderDetails {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    size: string
    quantity: number
    price: number
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
}

export async function sendOrderConfirmationEmail(orderDetails: OrderDetails) {
  const {
    orderId,
    customerName,
    customerEmail,
    items,
    total,
    shippingAddress
  } = orderDetails

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">
        ${item.name} (Size ${item.size})
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
        €${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('')

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: #fff; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .order-info { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; }
        .total { font-size: 24px; font-weight: bold; color: #000; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LI-LO SNEAKERS</h1>
          <p>Order Confirmation</p>
        </div>

        <div class="content">
          <h2>Thank you for your order, ${customerName}!</h2>
          <p>Your order has been successfully placed and is being processed.</p>

          <div class="order-info">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>

            <h4>Items Ordered:</h4>
            <table>
              <thead>
                <tr>
                  <th style="text-align: left; padding: 10px; border-bottom: 2px solid #000;">Item</th>
                  <th style="text-align: center; padding: 10px; border-bottom: 2px solid #000;">Qty</th>
                  <th style="text-align: right; padding: 10px; border-bottom: 2px solid #000;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 15px; text-align: right;"><strong>TOTAL:</strong></td>
                  <td style="padding: 15px; text-align: right;" class="total">€${total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <h4>Shipping Address:</h4>
            <p>
              ${shippingAddress.address}<br>
              ${shippingAddress.city}, ${shippingAddress.postalCode}<br>
              ${shippingAddress.country}
            </p>

            <h4>Estimated Delivery:</h4>
            <p>5-7 business days</p>
          </div>

          <p>You will receive a shipping confirmation email once your order has been dispatched.</p>
          <p>If you have any questions about your order, please contact us at support@li-lo.com</p>
        </div>

        <div class="footer">
          <p>© 2025 LI-LO Sneakers. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: '"LI-LO Sneakers" <marketia.teams@gmail.com>',
      to: customerEmail,
      subject: `Order Confirmation - ${orderId}`,
      html: emailHtml
    })

    console.log('Order confirmation email sent to:', customerEmail)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}