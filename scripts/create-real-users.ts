import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mrrlohamkffxfiwspkki.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sbp_4df42c77dd863c7834c167bce44ab1b78b2086b0'

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

async function createRealUsers() {
  console.log('🚀 Creating REAL users in Supabase...\n')

  for (const user of testUsers) {
    try {
      // First check if user already exists
      const { data: existingUser } = await supabase.auth.admin.listUsers()
      const userExists = existingUser?.users?.some(u => u.email === user.email)

      if (userExists) {
        console.log(`⚠️  User ${user.email} already exists - updating...`)

        // Get the existing user
        const existing = existingUser?.users?.find(u => u.email === user.email)
        if (existing) {
          // Update profile
          await supabase
            .from('profiles')
            .upsert({
              id: existing.id,
              email: user.email,
              first_name: user.firstName,
              last_name: user.lastName,
              role: user.role === 'client' ? 'customer' : user.role, // Map client to customer
              phone: user.phone,
              email_verified: true,
              is_active: true,
              updated_at: new Date().toISOString()
            })
          console.log(`✅ Updated profile for ${user.email}`)
        }
        continue
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          first_name: user.firstName,
          last_name: user.lastName,
          role: user.role
        }
      })

      if (authError) {
        throw authError
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user!.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          role: user.role === 'client' ? 'customer' : user.role, // Map client to customer for DB constraint
          phone: user.phone,
          email_verified: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error(`❌ Error creating profile for ${user.email}:`, profileError)
        continue
      }

      console.log(`✅ Created user: ${user.email} (Role: ${user.role.toUpperCase()})`)
      console.log(`   Password: ${user.password}`)
      console.log(`   Dashboard: /${user.role === 'client' ? 'account' : user.role}/dashboard\n`)

    } catch (error: any) {
      console.error(`❌ Error with user ${user.email}:`, error.message)
    }
  }

  // Set up role-based permissions
  console.log('\n📝 Setting up role-based permissions...')

  try {
    // Get user IDs
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email, role')
      .in('email', testUsers.map(u => u.email))

    if (profiles) {
      // CEO permissions
      const ceoProfile = profiles.find(p => p.email === 'ceo@li-lo.com')
      if (ceoProfile) {
        await supabase
          .from('ceo_access')
          .upsert({
            user_id: ceoProfile.id,
            can_view_analytics: true,
            can_manage_sellers: true,
            can_view_financials: true,
            can_manage_products: true,
            created_at: new Date().toISOString()
          })
        console.log('✅ CEO permissions configured')
      }

      // Seller permissions
      const sellerProfiles = profiles.filter(p =>
        p.email === 'admin@li-lo.com' || p.email === 'seller@li-lo.com'
      )

      for (const seller of sellerProfiles) {
        await supabase
          .from('seller_permissions')
          .upsert({
            user_id: seller.id,
            can_manage_inventory: true,
            can_view_orders: true,
            can_manage_products: true,
            can_view_analytics: true,
            created_at: new Date().toISOString()
          })
      }
      console.log('✅ Seller permissions configured')
    }
  } catch (error) {
    console.error('Error setting permissions:', error)
  }

  console.log('\n🎉 User creation complete!')
  console.log('\n📋 Login credentials:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  testUsers.forEach(user => {
    console.log(`${user.role.toUpperCase().padEnd(6)} | Email: ${user.email.padEnd(20)} | Password: ${user.password}`)
  })
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n✅ All users can now login with real Supabase authentication!')
}

createRealUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })