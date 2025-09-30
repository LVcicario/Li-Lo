// =============================================
// SETUP TEST ACCOUNTS
// Create test users via Supabase Admin API
// Run: npx tsx scripts/setup-test-accounts.ts
// =============================================

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const TEST_ACCOUNTS = [
  {
    email: 'client@li-lo.com',
    password: 'LiLo2025!',
    role: 'client',
    first_name: 'John',
    last_name: 'Client',
    phone: '+33612345678',
  },
  {
    email: 'worker@li-lo.com',
    password: 'LiLo2025!',
    role: 'worker',
    first_name: 'Sarah',
    last_name: 'Worker',
    phone: '+33612345679',
  },
  {
    email: 'ceo@li-lo.com',
    password: 'LiLo2025!',
    role: 'super_admin',
    first_name: 'Michael',
    last_name: 'CEO',
    phone: '+33612345680',
  },
];

async function setupTestAccounts() {
  console.log('🚀 Setting up test accounts...\n');

  for (const account of TEST_ACCOUNTS) {
    try {
      console.log(`Creating ${account.role}: ${account.email}`);

      // Create user via Admin API
      const { data: user, error: authError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
      });

      if (authError) {
        console.error(`❌ Error creating ${account.email}:`, authError.message);
        continue;
      }

      console.log(`✅ User created: ${user.user.id}`);

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: account.role,
          first_name: account.first_name,
          last_name: account.last_name,
          phone: account.phone,
        })
        .eq('id', user.user.id);

      if (profileError) {
        console.error(`❌ Error updating profile:`, profileError.message);
        continue;
      }

      console.log(`✅ Profile updated with role: ${account.role}`);

      // Special setup for client account
      if (account.role === 'client') {
        // Add Silver membership
        const { data: silverTier } = await supabase
          .from('membership_tiers')
          .select('id')
          .eq('tier', 'silver')
          .single();

        if (silverTier) {
          const periodEnd = new Date();
          periodEnd.setDate(periodEnd.getDate() + 30);

          await supabase
            .from('user_memberships')
            .upsert({
              user_id: user.user.id,
              tier_id: silverTier.id,
              tier: 'silver',
              status: 'active',
              billing_period: 'monthly',
              current_period_end: periodEnd.toISOString(),
            });

          console.log(`✅ Silver membership added`);
        }

        // Add sample order
        const orderNumber = `LLO-${Math.floor(10000 + Math.random() * 90000)}`;
        const { data: order } = await supabase
          .from('orders')
          .insert({
            user_id: user.user.id,
            order_number: orderNumber,
            status: 'delivered',
            payment_status: 'paid',
            total_amount: 459.00,
            subtotal: 420.00,
            tax: 39.00,
            shipping_cost: 0.00,
          })
          .select()
          .single();

        if (order) {
          console.log(`✅ Sample order created: ${orderNumber}`);
        }

        // Add drops to wishlist
        const { data: drops } = await supabase
          .from('drops')
          .select('id')
          .limit(3);

        if (drops && drops.length > 0) {
          for (const drop of drops) {
            await supabase
              .from('drop_wishlist')
              .insert({
                user_id: user.user.id,
                drop_id: drop.id,
                notify_on_drop: true,
              });
          }
          console.log(`✅ Added ${drops.length} drops to wishlist`);
        }
      }

      console.log(`\n`);

    } catch (error) {
      console.error(`❌ Unexpected error:`, error);
    }
  }

  console.log('\n✨ Test accounts setup complete!\n');
  console.log('📧 LOGIN CREDENTIALS:\n');
  console.log('CLIENT ACCOUNT:');
  console.log('  Email: client@li-lo.com');
  console.log('  Password: LiLo2025!');
  console.log('  Access: /account/dashboard\n');

  console.log('WORKER/SELLER ACCOUNT:');
  console.log('  Email: worker@li-lo.com');
  console.log('  Password: LiLo2025!');
  console.log('  Access: /seller/dashboard\n');

  console.log('CEO/ADMIN ACCOUNT:');
  console.log('  Email: ceo@li-lo.com');
  console.log('  Password: LiLo2025!');
  console.log('  Access: /ceo or /admin/dashboard\n');
}

setupTestAccounts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });