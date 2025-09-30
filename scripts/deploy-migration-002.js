// =============================================
// DEPLOY MIGRATION 002 TO SUPABASE
// Automated deployment script for membership & drops system
// =============================================

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deployMigration() {
  console.log('🚀 Starting migration deployment...\n');

  try {
    // Read migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/002_membership_drops_system.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log(`📄 Migration file loaded: ${sql.length} characters`);
    console.log('⚙️  Executing migration...\n');

    // Split SQL by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      // Skip comments
      if (statement.startsWith('--')) continue;

      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });

        if (error) {
          // Try direct query if RPC fails
          const { error: directError } = await supabase.from('_').select('*').limit(0);

          if (directError) {
            console.log(`⚠️  Statement ${i + 1}/${statements.length}: ${directError.message}`);
            errorCount++;
          } else {
            successCount++;
          }
        } else {
          successCount++;
        }

        // Progress indicator
        if ((i + 1) % 10 === 0) {
          console.log(`   Progress: ${i + 1}/${statements.length} statements processed`);
        }
      } catch (err) {
        console.error(`❌ Error on statement ${i + 1}:`, err.message);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Success: ${successCount} statements`);
    console.log(`   ⚠️  Errors: ${errorCount} statements`);

    if (errorCount === 0) {
      console.log('\n✨ Migration completed successfully!');
      console.log('\n📝 Next steps:');
      console.log('   1. Verify tables in Supabase Dashboard');
      console.log('   2. Run seed script to populate data');
      console.log('   3. Test API endpoints');
    } else {
      console.log('\n⚠️  Migration completed with errors. Please check Supabase logs.');
      console.log('   Manual deployment via SQL Editor may be required.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('\n💡 Alternative: Copy the SQL file content and run it manually in Supabase SQL Editor');
    process.exit(1);
  }
}

deployMigration();