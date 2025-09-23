import { redirect } from 'next/navigation';

export type UserRole = 'customer' | 'admin' | 'super_admin';

export const ROLE_ROUTES = {
  customer: '/client',
  admin: '/admin',
  super_admin: '/ceo'
} as const;

export const PROTECTED_ROUTES = {
  '/client': ['customer'],
  '/admin': ['admin', 'super_admin'],
  '/ceo': ['super_admin']
} as const;

export function getDefaultRoute(role: UserRole): string {
  return ROLE_ROUTES[role];
}

export function hasRouteAccess(route: string, userRole: UserRole): boolean {
  // Find matching protected route (check for route prefixes)
  const protectedRoute = Object.keys(PROTECTED_ROUTES).find(key => route.startsWith(key));

  if (!protectedRoute) {
    // If it's not a protected route, allow access
    return true;
  }

  const allowedRoles = PROTECTED_ROUTES[protectedRoute as keyof typeof PROTECTED_ROUTES];
  return (allowedRoles as readonly UserRole[]).includes(userRole);
}

export function redirectToRole(role: UserRole) {
  redirect(getDefaultRoute(role));
}

export function checkRouteAccess(route: string, userRole: UserRole) {
  if (!hasRouteAccess(route, userRole)) {
    redirect(getDefaultRoute(userRole));
  }
}