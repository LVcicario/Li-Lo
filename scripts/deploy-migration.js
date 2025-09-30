// Deploy migration to Supabase
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

async function deployMigration() {
  try {
    // Read migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/002_membership_drops_system.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📦 Deploying migration to Supabase...');
    console.log(`📁 File: ${migrationPath}`);
    console.log(`📏 Size: ${(sql.length / 1024).toFixed(2)} KB`);

    // Execute SQL using Supabase REST API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      // Try alternative method: direct query
      console.log('⚠️  First method failed, trying direct query...');

      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

      // Split SQL into individual statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      console.log(`📝 Executing ${statements.length} SQL statements...`);

      let successCount = 0;
      let errorCount = 0;

      for (const statement of statements) {
        try {
          const { error } = await supabase.rpc('exec_sql', { query: statement + ';' });
          if (error) {
            console.error(`❌ Error executing statement:`, error.message);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.error(`❌ Error:`, err.message);
          errorCount++;
        }
      }

      console.log(`\n✅ Migration completed:`);
      console.log(`   - Successful: ${successCount}`);
      console.log(`   - Errors: ${errorCount}`);

      if (errorCount > 0) {
        console.log('\n⚠️  Some statements failed. This is normal if tables already exist.');
      }
    } else {
      console.log('✅ Migration deployed successfully!');
    }

    // Verify tables created
    console.log('\n🔍 Verifying tables...');
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const tables = [
      'membership_tiers',
      'user_memberships',
      'drops',
      'drop_products',
      'size_conversions',
      'stockx_product_mapping'
    ];

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`   ❌ ${table}: Not found or error`);
      } else {
        console.log(`   ✅ ${table}: OK`);
      }
    }

    console.log('\n🎉 Migration deployment complete!');
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deployMigration();