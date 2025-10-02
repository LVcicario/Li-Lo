import { type NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// Define role-based route access
const ROUTE_PERMISSIONS = {
  '/ceo': ['ceo'],
  '/seller': ['seller', 'ceo'],
  '/worker': ['seller', 'ceo'],  // Worker is same as seller
  '/client': ['client', 'seller', 'ceo'],  // All authenticated users
  '/account': ['client', 'seller', 'ceo'],
  '/checkout': ['client', 'seller', 'ceo'],
  '/orders': ['client', 'seller', 'ceo']
}

export async function authSecurityMiddleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  try {
    const { data: { session } } = await supabase.auth.getSession()
    const pathname = request.nextUrl.pathname

    // Check if user is authenticated for protected routes
    const isProtectedRoute = Object.keys(ROUTE_PERMISSIONS).some(route =>
      pathname.startsWith(route)
    )

    // Redirect to login if accessing protected route without auth
    if (isProtectedRoute && !session) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check role-based access if user is authenticated
    if (session && isProtectedRoute) {
      // Get user profile with role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      const userRole = profile?.role || 'client'

      // Check if user has permission for this route
      for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
        if (pathname.startsWith(route)) {
          if (!allowedRoles.includes(userRole)) {
            // Redirect to unauthorized page
            return NextResponse.redirect(new URL('/unauthorized', request.url))
          }
          break
        }
      }

      // Add user role to headers for use in server components
      res.headers.set('x-user-role', userRole)
    }

    // Redirect authenticated users away from auth pages
    if (session && (pathname === '/auth/login' || pathname === '/auth/register')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      const userRole = profile?.role || 'client'
      const dashboardUrl = userRole === 'ceo' ? '/ceo' :
                           userRole === 'seller' ? '/seller' :
                           '/client'

      return NextResponse.redirect(new URL(dashboardUrl, request.url))
    }

    return res
  } catch (error) {
    console.error('Auth security middleware error:', error)
    return res
  }
}