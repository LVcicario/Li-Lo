// =============================================
// SEED MEMBERSHIP & DROPS DATA
// Populate initial data for production use
// =============================================

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// =============================================
// MEMBERSHIP TIERS DATA
// =============================================
const membershipTiers = [
  {
    tier: 'bronze',
    name: 'Bronze',
    description: 'Free membership with standard access',
    price_monthly: 0.00,
    price_yearly: 0.00,
    features: JSON.stringify([
      'Access to standard drops',
      'Browse all products',
      'Standard shipping rates',
      'Email support',
      'Community access'
    ]),
    early_access_hours: 0,
    exclusive_drops: false,
    discount_percentage: 0.00,
    free_shipping: false,
    priority_support: false,
    badge_color: '#CD7F32',
    badge_icon: 'bronze-badge',
    sort_order: 1
  },
  {
    tier: 'silver',
    name: 'Silver',
    description: 'Premium membership with exclusive perks',
    price_monthly: 29.99,
    price_yearly: 299.90, // 2 months free
    features: JSON.stringify([
      'All Bronze features',
      '12h early access to drops',
      '10% discount on all purchases',
      'Free standard shipping',
      'Priority email support',
      'Exclusive Silver-only drops',
      'Early sale access',
      'Birthday rewards'
    ]),
    early_access_hours: 12,
    exclusive_drops: true,
    discount_percentage: 10.00,
    free_shipping: true,
    priority_support: true,
    badge_color: '#C0C0C0',
    badge_icon: 'silver-badge',
    sort_order: 2
  },
  {
    tier: 'gold',
    name: 'Gold',
    description: 'VIP membership with ultimate benefits',
    price_monthly: 99.99,
    price_yearly: 999.90, // 2 months free
    features: JSON.stringify([
      'All Silver features',
      '24h early access to ALL drops',
      '20% discount on all purchases',
      'Free express shipping worldwide',
      '24/7 VIP phone support',
      'Exclusive Gold-only ultra-rare drops',
      'Private shopping events',
      'Concierge service',
      'Sneaker authentication',
      'Storage & protection services',
      'Resale priority listing'
    ]),
    early_access_hours: 24,
    exclusive_drops: true,
    discount_percentage: 20.00,
    free_shipping: true,
    priority_support: true,
    badge_color: '#FFD700',
    badge_icon: 'gold-badge',
    sort_order: 3
  }
];

// =============================================
// SIZE CONVERSIONS DATA (EU 37-47)
// =============================================
const sizeConversions = [
  { eu_size: 37, us_men_size: '5.5-6', us_women_size: '6.5-7', uk_size: '4.5-5', cm: 23.5 },
  { eu_size: 38, us_men_size: '6-6.5', us_women_size: '7.5-8', uk_size: '5-5.5', cm: 24.0 },
  { eu_size: 39, us_men_size: '6.5-7', us_women_size: '8.5-9', uk_size: '6-6.5', cm: 24.5 },
  { eu_size: 40, us_men_size: '7-7.5', us_women_size: '9-9.5', uk_size: '6.5-7', cm: 25.0 },
  { eu_size: 41, us_men_size: '8', us_women_size: '10', uk_size: '7.5', cm: 25.5 },
  { eu_size: 42, us_men_size: '8.5', us_women_size: '10.5', uk_size: '8', cm: 26.0 },
  { eu_size: 42.5, us_men_size: '9', us_women_size: '11', uk_size: '8.5', cm: 26.5 },
  { eu_size: 43, us_men_size: '9.5', us_women_size: '11.5', uk_size: '9', cm: 27.0 },
  { eu_size: 44, us_men_size: '10', us_women_size: '12', uk_size: '9.5', cm: 27.5 },
  { eu_size: 44.5, us_men_size: '10.5', us_women_size: '12.5', uk_size: '10', cm: 28.0 },
  { eu_size: 45, us_men_size: '11', us_women_size: '13', uk_size: '10.5', cm: 28.5 },
  { eu_size: 45.5, us_men_size: '11.5', us_women_size: '13.5', uk_size: '11', cm: 29.0 },
  { eu_size: 46, us_men_size: '12', us_women_size: '14', uk_size: '11.5', cm: 29.5 },
  { eu_size: 47, us_men_size: '13', us_women_size: '15', uk_size: '12.5', cm: 30.5 }
];

// =============================================
// SEED FUNCTIONS
// =============================================

async function seedMembershipTiers() {
  console.log('📦 Seeding membership tiers...');

  for (const tier of membershipTiers) {
    const { data, error } = await supabase
      .from('membership_tiers')
      .upsert(tier, { onConflict: 'tier' })
      .select();

    if (error) {
      console.error(`   ❌ Error seeding ${tier.tier}:`, error.message);
    } else {
      console.log(`   ✅ ${tier.name} tier created`);
    }
  }
}

async function seedSizeConversions() {
  console.log('\n📏 Seeding size conversions...');

  const { data, error } = await supabase
    .from('size_conversions')
    .upsert(sizeConversions, { onConflict: 'eu_size' })
    .select();

  if (error) {
    console.error('   ❌ Error seeding size conversions:', error.message);
  } else {
    console.log(`   ✅ ${sizeConversions.length} size conversions created`);
  }
}

async function createTestBrands() {
  console.log('\n🏷️  Creating test brands...');

  const brands = [
    { name: 'Nike', slug: 'nike', logo_url: null },
    { name: 'Adidas', slug: 'adidas', logo_url: null },
    { name: 'Jordan', slug: 'jordan', logo_url: null },
    { name: 'New Balance', slug: 'new-balance', logo_url: null },
    { name: 'Yeezy', slug: 'yeezy', logo_url: null }
  ];

  for (const brand of brands) {
    const { error } = await supabase
      .from('brands')
      .upsert(brand, { onConflict: 'slug' });

    if (error && !error.message.includes('already exists')) {
      console.error(`   ⚠️  Error creating ${brand.name}:`, error.message);
    } else {
      console.log(`   ✅ ${brand.name} brand ready`);
    }
  }
}

async function verifyTables() {
  console.log('\n🔍 Verifying tables...');

  const tables = [
    'membership_tiers',
    'user_memberships',
    'drops',
    'drop_products',
    'drop_notifications',
    'size_conversions',
    'stockx_product_mapping'
  ];

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`   ❌ ${table}: NOT FOUND`);
    } else {
      console.log(`   ✅ ${table}: OK`);
    }
  }
}

// =============================================
// MAIN EXECUTION
// =============================================

async function main() {
  console.log('🌱 Starting seed process...\n');

  try {
    await verifyTables();
    await seedMembershipTiers();
    await seedSizeConversions();
    await createTestBrands();

    console.log('\n✨ Seed completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   - 3 membership tiers created (Bronze, Silver, Gold)');
    console.log('   - 14 size conversions created (EU 37-47)');
    console.log('   - 5 test brands created');
    console.log('\n🎯 Next steps:');
    console.log('   1. Create products via admin dashboard');
    console.log('   2. Create drops and link products');
    console.log('   3. Test membership signup flow');
    console.log('   4. Test drop access with different tiers');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

main();