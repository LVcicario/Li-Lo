// =============================================
// RESEND EMAIL SERVICE
// Centralized email sending functionality
// =============================================

import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'Li-Lo <noreply@li-lo.com>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export interface DropNotificationEmailProps {
  to: string;
  firstName: string;
  dropName: string;
  dropDate: Date;
  dropSlug: string;
}

export interface WelcomeEmailProps {
  to: string;
  firstName: string;
  tier: 'bronze' | 'silver' | 'gold';
}

export interface OrderConfirmationEmailProps {
  to: string;
  firstName: string;
  orderNumber: string;
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: any;
}

/**
 * Send drop notification email
 */
export async function sendDropNotificationEmail({
  to,
  firstName,
  dropName,
  dropDate,
  dropSlug,
}: DropNotificationEmailProps) {
  if (!resend) {
    console.warn('Resend API key not configured, skipping email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `🔥 Drop Alert: ${dropName} drops in 24 hours!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Drop Alert</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔥 Drop Alert!</h1>
          </div>

          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hey ${firstName}! 👟</h2>

            <p style="font-size: 16px; margin: 20px 0;">
              <strong style="font-size: 18px; color: #667eea;">${dropName}</strong> drops tomorrow!
            </p>

            <p style="font-size: 16px;">
              Don't miss out on this exclusive release. As a Li-Lo member, you get early access before anyone else.
            </p>

            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0; font-size: 14px; color: #718096;">
                <strong>Drop Time:</strong><br>
                ${dropDate.toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${SITE_URL}/drops/${dropSlug}"
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                View Drop Details →
              </a>
            </div>

            <p style="font-size: 14px; color: #718096; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              You're receiving this because you subscribed to notifications for this drop.
              <a href="${SITE_URL}/account/notifications" style="color: #667eea;">Manage preferences</a>
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #718096; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Li-Lo. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend email error:', error);
      return { success: false, error };
    }

    console.log('✅ Drop notification email sent:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Error sending drop notification email:', error);
    return { success: false, error };
  }
}

/**
 * Send welcome email for new members
 */
export async function sendWelcomeEmail({
  to,
  firstName,
  tier,
}: WelcomeEmailProps) {
  if (!resend) {
    console.warn('Resend API key not configured, skipping email');
    return { success: false, error: 'Email service not configured' };
  }

  const tierEmoji = tier === 'gold' ? '👑' : tier === 'silver' ? '⚡' : '✨';
  const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${tierEmoji} Welcome to ${tierName} Membership!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Li-Lo</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${tierEmoji} Welcome to ${tierName}!</h1>
          </div>

          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hey ${firstName}! 🎉</h2>

            <p style="font-size: 16px;">
              Thank you for joining Li-Lo as a <strong>${tierName} member</strong>! Your membership is now active and you're ready to experience exclusive sneaker drops like never before.
            </p>

            <h3 style="color: #667eea; margin-top: 30px;">Your Benefits:</h3>
            <ul style="font-size: 15px; line-height: 2;">
              ${tier === 'gold' ? `
                <li>24h early access to ALL drops</li>
                <li>20% discount on all purchases</li>
                <li>Free express shipping worldwide</li>
                <li>24/7 VIP phone support</li>
                <li>Exclusive Gold-only ultra-rare drops</li>
              ` : tier === 'silver' ? `
                <li>12h early access to drops</li>
                <li>10% discount on all purchases</li>
                <li>Free standard shipping</li>
                <li>Priority email support</li>
                <li>Exclusive Silver-only drops</li>
              ` : `
                <li>Access to all standard drops</li>
                <li>Browse exclusive collections</li>
                <li>Email support</li>
              `}
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${SITE_URL}/drops"
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin-right: 10px;">
                Explore Drops
              </a>
              <a href="${SITE_URL}/sneakers"
                 style="display: inline-block; background: white; color: #667eea; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; border: 2px solid #667eea;">
                Start Shopping
              </a>
            </div>

            <p style="font-size: 14px; color: #718096; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              Need help? Visit our <a href="${SITE_URL}/help" style="color: #667eea;">Help Center</a> or reply to this email.
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #718096; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Li-Lo. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend email error:', error);
      return { success: false, error };
    }

    console.log('✅ Welcome email sent:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail({
  to,
  firstName,
  orderNumber,
  items,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps) {
  if (!resend) {
    console.warn('Resend API key not configured, skipping email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Order Confirmation #${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✓ Order Confirmed!</h1>
          </div>

          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hey ${firstName}!</h2>

            <p style="font-size: 16px;">
              Thank you for your order! We've received your payment and your sneakers will be shipped soon.
            </p>

            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #718096;">
                <strong>Order Number:</strong> #${orderNumber}
              </p>
            </div>

            <h3 style="color: #667eea; margin-top: 30px;">Order Items:</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              ${items.map(item => `
                <tr style="border-bottom: 1px solid #e0e0e0;">
                  <td style="padding: 15px 0;">
                    <strong>${item.name}</strong><br>
                    <span style="color: #718096; font-size: 14px;">Size: ${item.size} | Qty: ${item.quantity}</span>
                  </td>
                  <td style="padding: 15px 0; text-align: right;">
                    €${item.price.toFixed(2)}
                  </td>
                </tr>
              `).join('')}
              <tr>
                <td style="padding: 15px 0; font-weight: bold; font-size: 18px;">Total</td>
                <td style="padding: 15px 0; text-align: right; font-weight: bold; font-size: 18px;">€${total.toFixed(2)}</td>
              </tr>
            </table>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${SITE_URL}/account/orders"
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Track Your Order
              </a>
            </div>

            <p style="font-size: 14px; color: #718096; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              Questions? Contact our support team at <a href="mailto:support@li-lo.com" style="color: #667eea;">support@li-lo.com</a>
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #718096; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Li-Lo. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend email error:', error);
      return { success: false, error };
    }

    console.log('✅ Order confirmation email sent:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error };
  }
}