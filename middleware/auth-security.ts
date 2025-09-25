import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function authSecurityMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get session
  const { data: { session } } = await supabase.auth.getSession();

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/sneakers',
    '/exclusive',
    '/limited',
    '/about',
    '/contact',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/api/products',
    '/api/stripe/webhook'
  ];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Role-based route protection
  const routeProtection = {
    '/ceo': 'ceo',
    '/seller': 'seller',
    '/account': 'client'
  };

  // Check if route requires specific role
  for (const [route, requiredRole] of Object.entries(routeProtection)) {
    if (pathname.startsWith(route)) {
      if (!session) {
        // Redirect to login if not authenticated
        const url = request.nextUrl.clone();
        url.pathname = '/auth/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }

      // Get user role from email
      const email = session.user.email?.toLowerCase() || '';
      let userRole = 'client';

      if (email === 'ceo@li-lo.com') {
        userRole = 'ceo';
      } else if (email === 'seller@li-lo.com' || email.includes('seller')) {
        userRole = 'seller';
      }

      // Check if user has required role
      if (userRole !== requiredRole && requiredRole !== 'client') {
        // CEO can access everything
        if (userRole === 'ceo') {
          continue;
        }

        // Redirect to appropriate dashboard
        const url = request.nextUrl.clone();
        switch (userRole) {
          case 'seller':
            url.pathname = '/seller/dashboard';
            break;
          case 'client':
            url.pathname = '/account/dashboard';
            break;
          default:
            url.pathname = '/';
        }
        return NextResponse.redirect(url);
      }
    }
  }

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // CSP for additional security
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co; " +
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com"
  );

  return response;
}