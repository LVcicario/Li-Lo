#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testAccounts = [
  {
    email: 'client@li-lo.com',
    password: 'LiLo2025!',
    role: 'client',
    firstName: 'John',
    lastName: 'Client',
    phone: '+33612345678'
  },
  {
    email: 'worker@li-lo.com',
    password: 'LiLo2025!',
    role: 'seller',
    firstName: 'Sarah',
    lastName: 'Worker',
    phone: '+33612345679'
  },
  {
    email: 'ceo@li-lo.com',
    password: 'LiLo2025!',
    role: 'ceo',
    firstName: 'Michael',
    lastName: 'CEO',
    phone: '+33612345680'
  }
];

async function createTestAccounts() {
  console.log('🚀 Li-Lo Test Accounts Setup\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('Creating 3 test accounts with Auth + Profiles + Test Data');
  console.log('═══════════════════════════════════════════════════════════\n');

  const createdUsers: Array<{ email: string; id: string; role: string }> = [];

  // Step 1: Create Auth Users
  console.log('📧 STEP 1: Creating Auth Users\n');

  for (const account of testAccounts) {
    try {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const userExists = existingUsers?.users?.find(u => u.email === account.email);

      if (userExists) {
        console.log(`   ✓ ${account.email} already exists (${account.role})`);
        createdUsers.push({
          email: account.email,
          id: userExists.id,
          role: account.role
        });
        continue;
      }

      // Create new user with auto-confirmed email
      const { data, error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          first_name: account.firstName,
          last_name: account.lastName,
          phone: account.phone
        }
      });

      if (error) {
        console.error(`   ✗ Failed to create ${account.email}:`, error.message);
        continue;
      }

      console.log(`   ✓ Created ${account.email} (${account.role})`);

      if (data.user) {
        createdUsers.push({
          email: account.email,
          id: data.user.id,
          role: account.role
        });
      }

    } catch (error: any) {
      console.error(`   ✗ Error creating ${account.email}:`, error.message);
    }
  }

  console.log(`\n   Created/Found ${createdUsers.length}/3 users\n`);

  // Step 2: Update Profiles with Roles
  console.log('👤 STEP 2: Configuring Profiles & Roles\n');

  for (const user of createdUsers) {
    try {
      const account = testAccounts.find(a => a.email === user.email);
      if (!account) continue;

      const { error } = await supabase
        .from('profiles')
        .update({
          role: account.role,
          first_name: account.firstName,
          last_name: account.lastName,
          phone: account.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error(`   ✗ Failed to update profile for ${user.email}:`, error.message);
      } else {
        console.log(`   ✓ Updated profile for ${user.email} → role: ${account.role}`);
      }

    } catch (error: any) {
      console.error(`   ✗ Error updating profile:`, error.message);
    }
  }

  // Step 3: Add Client Test Data
  console.log('\n💎 STEP 3: Adding Test Data for Client\n');

  const clientUser = createdUsers.find(u => u.email === 'client@li-lo.com');

  if (clientUser) {
    try {
      // Add Silver Membership
      const { data: silverTier } = await supabase
        .from('membership_tiers')
        .select('id')
        .eq('tier', 'silver')
        .single();

      if (silverTier) {
        const { error: membershipError } = await supabase
          .from('user_memberships')
          .upsert({
            user_id: clientUser.id,
            tier_id: silverTier.id,
            tier: 'silver',
            status: 'active',
            billing_period: 'monthly',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (membershipError) {
          console.error(`   ✗ Failed to add membership:`, membershipError.message);
        } else {
          console.log(`   ✓ Added Silver membership (30 days)`);
        }
      }

      // Add Sample Order
      const { data: existingOrders } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', clientUser.id)
        .limit(1);

      if (!existingOrders || existingOrders.length === 0) {
        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: clientUser.id,
            order_number: 'LLO-12345',
            status: 'delivered',
            payment_status: 'paid',
            total_amount: 459.00,
            subtotal: 420.00,
            tax: 39.00,
            shipping_cost: 0.00,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          });

        if (orderError) {
          console.error(`   ✗ Failed to create order:`, orderError.message);
        } else {
          console.log(`   ✓ Added sample order (€459, delivered)`);
        }
      } else {
        console.log(`   ✓ Sample order already exists`);
      }

      // Add Drops to Wishlist
      const { data: drops } = await supabase
        .from('drops')
        .select('id')
        .order('drop_date', { ascending: false })
        .limit(3);

      if (drops && drops.length > 0) {
        let addedCount = 0;
        for (const drop of drops) {
          const { error: wishlistError } = await supabase
            .from('drop_wishlist')
            .insert({
              user_id: clientUser.id,
              drop_id: drop.id,
              notify_on_drop: true
            })
            .select()
            .single();

          if (!wishlistError) {
            addedCount++;
          }
        }

        if (addedCount > 0) {
          console.log(`   ✓ Added ${addedCount} drops to wishlist`);
        } else {
          console.log(`   ✓ Drops already in wishlist`);
        }
      } else {
        console.log(`   ⚠ No drops available to add to wishlist`);
      }

    } catch (error: any) {
      console.error(`   ✗ Error adding test data:`, error.message);
    }
  }

  // Step 4: Verification
  console.log('\n✅ STEP 4: Verification\n');

  for (const user of createdUsers) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, role, first_name, last_name')
      .eq('id', user.id)
      .single();

    if (profile) {
      const account = testAccounts.find(a => a.email === user.email);
      console.log(`   ✓ ${profile.email.padEnd(25)} → ${profile.role.padEnd(12)} (${profile.first_name} ${profile.last_name})`);
    }
  }

  // Final Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('✨ Test Accounts Setup Complete!');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('🔑 LOGIN CREDENTIALS:\n');
  console.log('   CLIENT:  client@li-lo.com  /  LiLo2025!');
  console.log('   WORKER:  worker@li-lo.com  /  LiLo2025!');
  console.log('   CEO:     ceo@li-lo.com     /  LiLo2025!\n');

  console.log('🌐 TEST URLS:\n');
  console.log('   Client:  http://localhost:3000/account/dashboard');
  console.log('   Worker:  http://localhost:3000/seller/dashboard');
  console.log('   CEO:     http://localhost:3000/ceo\n');

  console.log('📋 CLIENT TEST DATA:\n');
  console.log('   • Silver membership (30 days)');
  console.log('   • 1 sample order (€459, delivered)');
  console.log('   • 3 drops in wishlist\n');
}

createTestAccounts()
  .then(() => {
    console.log('✅ Script completed successfully\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });