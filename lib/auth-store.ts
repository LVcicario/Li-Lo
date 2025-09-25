import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

type UserRole = 'client' | 'seller' | 'ceo';

interface AuthState {
  user: User | null;
  profile: any | null;
  loading: boolean;
  userRole: UserRole;
  isClient: boolean;
  isSeller: boolean;
  isCEO: boolean;
  signIn: (email: string, password: string) => Promise<string>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  getDashboardUrl: () => string;
}

// Updated permissions for the new role system
const permissions = {
  client: ['view_orders', 'manage_profile', 'create_support_tickets', 'view_products', 'manage_wishlist', 'write_reviews'],
  seller: ['manage_products', 'manage_inventory', 'manage_orders', 'manage_prices', 'view_sales_analytics', 'manage_stock', 'process_orders'],
  ceo: ['all_permissions', 'view_analytics', 'view_financial_data', 'manage_sellers', 'system_admin', 'export_data', 'manage_platform']
};

// Special email patterns for role assignment
const ROLE_EMAIL_PATTERNS = {
  ceo: ['ceo@li-lo.com'],
  seller: ['seller@li-lo.com', 'admin@li-lo.com', /^seller-.*@li-lo\.com$/],
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  userRole: 'client',
  isClient: true,
  isSeller: false,
  isCEO: false,

  signIn: async (email: string, password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Check for role assignment based on email
    const { data: roleAssignment } = await supabase
      .from('role_assignments')
      .select('assigned_role')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    // Get the profile from the database
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // Determine role: first check role_assignments, then profile, then default to 'client'
    const role = roleAssignment?.assigned_role || profile?.role || 'client' as UserRole;

    // Update profile with correct role if needed
    if (profile && profile.role !== role) {
      await supabase
        .from('profiles')
        .update({ role })
        .eq('id', data.user.id);
    }

    set({
      user: data.user,
      profile: { ...profile, role },
      userRole: role,
      isClient: role === 'client',
      isSeller: role === 'seller',
      isCEO: role === 'ceo'
    });

    // Update last login
    await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id: data.user.id,
        user_role: role,
        action: 'login',
        resource_type: 'auth',
        details: { email, timestamp: new Date().toISOString() }
      });

    // Return dashboard URL for proper routing
    return get().getDashboardUrl();
  },

  signUp: async (email: string, password: string, metadata?: any) => {
    const supabase = createClient();

    // Always register as client - seller and CEO accounts are assigned via role_assignments
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...metadata,
          email,
          role: 'client'
        },
      },
    });

    if (error) throw error;

    // Create profile record
    if (data.user) {
      await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          first_name: metadata?.first_name,
          last_name: metadata?.last_name,
          role: 'client',
          onboarding_completed: false
        });
    }

    set({
      user: data.user,
      profile: { role: 'client', email, ...metadata },
      userRole: 'client',
      isClient: true,
      isSeller: false,
      isCEO: false
    });
  },

  signOut: async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    set({
      user: null,
      profile: null,
      userRole: 'client',
      isClient: true,
      isSeller: false,
      isCEO: false
    });
  },

  checkUser: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Check for role assignment
      const { data: roleAssignment } = await supabase
        .from('role_assignments')
        .select('assigned_role')
        .eq('email', user.email!)
        .eq('is_active', true)
        .single();

      // Get profile from database
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const role = roleAssignment?.assigned_role || profile?.role || 'client' as UserRole;

      set({
        user,
        profile: { ...profile, role },
        loading: false,
        userRole: role,
        isClient: role === 'client',
        isSeller: role === 'seller',
        isCEO: role === 'ceo'
      });
    } else {
      set({
        user: null,
        profile: null,
        loading: false,
        userRole: 'client',
        isClient: true,
        isSeller: false,
        isCEO: false
      });
    }
  },

  hasPermission: (permission: string) => {
    const { userRole } = get();
    // CEO has all permissions
    if (userRole === 'ceo') return true;
    return (permissions[userRole] as string[] | undefined)?.includes(permission) || false;
  },

  getDashboardUrl: () => {
    const { userRole } = get();
    switch (userRole) {
      case 'ceo':
        return '/ceo';
      case 'seller':
        return '/seller/dashboard';
      default:
        return '/account/dashboard';
    }
  },
}));