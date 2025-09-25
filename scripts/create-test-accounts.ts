#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
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
    email: 'ceo@li-lo.com',
    password: 'CEO2024#Secure',
    metadata: {
      firstName: 'Chief',
      lastName: 'Executive',
      role: 'ceo'
    }
  },
  {
    email: 'seller@li-lo.com',
    password: 'Seller2024#Safe',
    metadata: {
      firstName: 'Store',
      lastName: 'Manager',
      role: 'seller'
    }
  },
  {
    email: 'test.client@example.com',
    password: 'Client2024#Test',
    metadata: {
      firstName: 'Test',
      lastName: 'Client',
      role: 'client'
    }
  }
];

async function createTestAccounts() {
  console.log('🔐 Creating Test Accounts for Role-Based System\n');

  for (const account of testAccounts) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase.auth.admin.listUsers();
      const userExists = existingUser?.users?.some(u => u.email === account.email);

      if (userExists) {
        console.log(`✓ Account already exists: ${account.email}`);
        continue;
      }

      // Create new user
      const { data, error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: account.metadata
      });

      if (error) {
        console.error(`❌ Failed to create ${account.email}:`, error.message);
      } else {
        console.log(`✅ Created account: ${account.email} (Role: ${account.metadata.role})`);
      }

      // Also insert into role_assignments table
      const { error: roleError } = await supabase
        .from('role_assignments')
        .upsert({
          email: account.email,
          assigned_role: account.metadata.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        });

      if (roleError) {
        console.error(`⚠️  Failed to assign role for ${account.email}:`, roleError.message);
      }

    } catch (error) {
      console.error(`❌ Error creating ${account.email}:`, error);
    }
  }

  console.log('\n✨ Test accounts creation complete!');
  console.log('\nTest Accounts:');
  console.log('═══════════════════════════════════════');
  console.log('CEO:    ceo@li-lo.com / CEO2024#Secure');
  console.log('Seller: seller@li-lo.com / Seller2024#Safe');
  console.log('Client: test.client@example.com / Client2024#Test');
  console.log('═══════════════════════════════════════');
}

createTestAccounts().catch(console.error);