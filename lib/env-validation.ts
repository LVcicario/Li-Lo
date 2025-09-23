// Environment variable validation
const requiredEnvVars = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
] as const

const optionalEnvVars = [
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'RESEND_API_KEY',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS'
] as const

interface EnvValidationResult {
  isValid: boolean
  missing: string[]
  warnings: string[]
}

export function validateEnvironment(): EnvValidationResult {
  const missing: string[] = []
  const warnings: string[] = []

  // Check required environment variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }

  // Check optional environment variables and warn if missing
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      warnings.push(`Optional environment variable missing: ${envVar}`)
    }
  }

  // Additional validation
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    missing.push('STRIPE_SECRET_KEY (invalid format - should start with sk_)')
  }

  if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
      !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
    warnings.push('STRIPE_PUBLISHABLE_KEY format may be invalid - should start with pk_')
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('supabase.co')) {
    warnings.push('SUPABASE_URL format may be invalid')
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings
  }
}

// Runtime check for server-side code
export function ensureEnvironment(): void {
  const validation = validateEnvironment()

  if (!validation.isValid) {
    console.error('❌ Environment validation failed!')
    console.error('Missing required environment variables:')
    validation.missing.forEach(envVar => {
      console.error(`  - ${envVar}`)
    })
    throw new Error('Missing required environment variables. Check your .env.local file.')
  }

  if (validation.warnings.length > 0) {
    console.warn('⚠️  Environment warnings:')
    validation.warnings.forEach(warning => {
      console.warn(`  - ${warning}`)
    })
  }

  console.log('✅ Environment validation passed')
}

// Constants for the application
export const CONFIG = {
  STRIPE: {
    SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    API_VERSION: '2025-08-27.basil' as const
  },
  SUPABASE: {
    URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!
  },
  SHIPPING: {
    FREE_THRESHOLD: 100,
    RATES: {
      STANDARD: { USD: 19.99, EUR: 15.00 },
      EXPRESS: { USD: 39.99, EUR: 29.99 },
      WHITE_GLOVE: { USD: 99.99, EUR: 79.99 }
    }
  },
  TAX_RATES: {
    US: 0.08,
    EU: 0.20,
    DEFAULT: 0.10
  }
} as const