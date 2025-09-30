#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log('🔍 Debug: Testing Supabase Auth User Creation\n');
console.log('URL:', supabaseUrl);
console.log('Service Key (first 20 chars):', supabaseServiceKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testCreateUser() {
  try {
    console.log('\n📧 Attempting to create test user...\n');

    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test123@li-lo.com',
      password: 'LiLo2025!',
      email_confirm: true,
      user_metadata: {
        first_name: 'Test',
        last_name: 'User',
        phone: '+33612345999'
      }
    });

    if (error) {
      console.error('❌ Error Details:');
      console.error('   Message:', error.message);
      console.error('   Status:', error.status);
      console.error('   Name:', error.name);
      console.error('   Full Error:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Success! User created:');
      console.log('   ID:', data.user?.id);
      console.log('   Email:', data.user?.email);
      console.log('   Email Confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');
    }
  } catch (err: any) {
    console.error('❌ Exception caught:');
    console.error(err);
  }
}

testCreateUser();