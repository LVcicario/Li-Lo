import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

type UserRole = 'customer' | 'admin' | 'super_admin';

interface AuthState {
  user: User | null;
  profile: any | null;
  loading: boolean;
  userRole: UserRole;
  isCustomer: boolean;
  isAdmin: boolean;
  isCEO: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

// Updated permissions to match your requirements
const permissions = {
  customer: ['view_orders', 'manage_profile', 'create_support_tickets', 'view_products'],
  admin: ['manage_products', 'manage_inventory', 'manage_orders', 'manage_categories', 'manage_drops', 'respond_support', 'view_basic_analytics'],
  super_admin: ['manage_products', 'manage_inventory', 'manage_orders', 'manage_categories', 'manage_drops', 'respond_support', 'view_analytics', 'view_financial_data', 'manage_users', 'system_admin']
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  userRole: 'customer',
  isCustomer: true,
  isAdmin: false,
  isCEO: false,

  signIn: async (email: string, password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get the profile from the database to get the role
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const role = profile?.role || 'customer';

    set({
      user: data.user,
      profile,
      userRole: role,
      isCustomer: role === 'customer',
      isAdmin: role === 'admin',
      isCEO: role === 'super_admin'
    });

    // Update last login
    await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);
  },

  signUp: async (email: string, password: string, metadata?: any) => {
    const supabase = createClient();

    // Always register as customer - admin accounts are set up manually
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...metadata,
          email,
          role: 'customer'
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
          role: 'customer'
        });
    }

    set({
      user: data.user,
      profile: { role: 'customer', email, ...metadata },
      userRole: 'customer',
      isCustomer: true,
      isAdmin: false,
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
      userRole: 'customer',
      isCustomer: true,
      isAdmin: false,
      isCEO: false
    });
  },

  checkUser: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Get profile from database
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const role = profile?.role || 'customer';

      set({
        user,
        profile,
        loading: false,
        userRole: role,
        isCustomer: role === 'customer',
        isAdmin: role === 'admin',
        isCEO: role === 'super_admin'
      });
    } else {
      set({
        user: null,
        profile: null,
        loading: false,
        userRole: 'customer',
        isCustomer: true,
        isAdmin: false,
        isCEO: false
      });
    }
  },

  hasPermission: (permission: string) => {
    const { userRole } = get();
    return (permissions[userRole] as string[] | undefined)?.includes(permission) || false;
  },
}));