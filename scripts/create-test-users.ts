import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mrrlohamkffxfiwspkki.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface TestUser {
  email: string
  password: string
  role: 'ceo' | 'admin' | 'seller' | 'client'
  firstName: string
  lastName: string
  phone: string
}

const testUsers: TestUser[] = [
  {
    email: 'ceo@li-lo.com',
    password: 'CeoLiLo2025!',
    role: 'ceo',
    firstName: 'Laurent',
    lastName: 'Dumont',
    phone: '+33 1 23 45 67 89'
  },
  {
    email: 'admin@li-lo.com',
    password: 'AdminLiLo2025!',
    role: 'admin',
    firstName: 'Sophie',
    lastName: 'Martin',
    phone: '+33 1 23 45 67 90'
  },
  {
    email: 'seller@li-lo.com',
    password: 'SellerLiLo2025!',
    role: 'seller',
    firstName: 'Pierre',
    lastName: 'Dubois',
    phone: '+33 1 23 45 67 91'
  },
  {
    email: 'client@li-lo.com',
    password: 'ClientLiLo2025!',
    role: 'client',
    firstName: 'Marie',
    lastName: 'Leclerc',
    phone: '+33 1 23 45 67 92'
  }
]

async function createTestUsers() {
  console.log('🚀 Creating test users for Li-Lo...\n')

  for (const user of testUsers) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          first_name: user.firstName,
          last_name: user.lastName,
          role: user.role
        }
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`⚠️  User ${user.email} already exists`)

          // Update existing user's profile
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              first_name: user.firstName,
              last_name: user.lastName,
              role: user.role,
              phone: user.phone,
              email_verified: true,
              is_active: true,
              updated_at: new Date().toISOString()
            })
            .eq('email', user.email)

          if (!updateError) {
            console.log(`✅ Updated profile for ${user.email}`)
          }
          continue
        }
        throw authError
      }

      // Create or update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user!.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          role: user.role,
          phone: user.phone,
          email_verified: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (profileError) {
        console.error(`❌ Error creating profile for ${user.email}:`, profileError)
        continue
      }

      console.log(`✅ Created user: ${user.email} (Role: ${user.role.toUpperCase()})`)
      console.log(`   Password: ${user.password}`)
      console.log(`   Dashboard: /${user.role === 'client' ? 'account' : user.role}/dashboard\n`)

    } catch (error) {
      console.error(`❌ Error creating user ${user.email}:`, error)
    }
  }

  // Add role-specific permissions
  console.log('\n📝 Setting up role-based access...')

  // CEO access
  const { error: ceoError } = await supabase
    .from('ceo_access')
    .upsert({
      user_id: (await supabase.from('profiles').select('id').eq('email', 'ceo@li-lo.com').single()).data?.id,
      can_view_analytics: true,
      can_manage_sellers: true,
      can_view_financials: true,
      can_manage_products: true,
      created_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })

  if (!ceoError) {
    console.log('✅ CEO permissions configured')
  }

  // Seller permissions
  const sellers = await supabase
    .from('profiles')
    .select('id')
    .in('email', ['admin@li-lo.com', 'seller@li-lo.com'])

  for (const seller of sellers.data || []) {
    await supabase
      .from('seller_permissions')
      .upsert({
        user_id: seller.id,
        can_manage_inventory: true,
        can_view_orders: true,
        can_manage_products: true,
        can_view_analytics: true,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
  }
  console.log('✅ Seller permissions configured')

  console.log('\n🎉 All test users created successfully!')
  console.log('\n📋 Login credentials:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  testUsers.forEach(user => {
    console.log(`${user.role.toUpperCase().padEnd(6)} | Email: ${user.email.padEnd(20)} | Password: ${user.password}`)
  })
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

createTestUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })