import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

type UserRole = 'admin' | 'seller' | 'customer';

interface AuthState {
  user: User | null;
  loading: boolean;
  userRole: UserRole;
  isAdmin: boolean;
  isSeller: boolean;
  isCustomer: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const permissions = {
  admin: ['manage_products', 'manage_users', 'view_analytics', 'manage_orders', 'view_inventory'],
  seller: ['view_inventory', 'manage_orders'],
  customer: []
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  userRole: 'customer',
  isAdmin: false,
  isSeller: false,
  isCustomer: true,

  signIn: async (email: string, password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const role = (data.user?.user_metadata?.role as UserRole) || 'customer';
    set({
      user: data.user,
      userRole: role,
      isAdmin: role === 'admin',
      isSeller: role === 'seller',
      isCustomer: role === 'customer'
    });
  },

  signUp: async (email: string, password: string, metadata?: any) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { ...metadata, role: metadata?.role || 'customer' },
      },
    });

    if (error) throw error;

    const role = (metadata?.role as UserRole) || 'customer';
    set({
      user: data.user,
      userRole: role,
      isAdmin: role === 'admin',
      isSeller: role === 'seller',
      isCustomer: role === 'customer'
    });
  },

  signOut: async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({
      user: null,
      userRole: 'customer',
      isAdmin: false,
      isSeller: false,
      isCustomer: true
    });
  },

  checkUser: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const role = (user?.user_metadata?.role as UserRole) || 'customer';
    set({
      user,
      loading: false,
      userRole: role,
      isAdmin: role === 'admin',
      isSeller: role === 'seller',
      isCustomer: role === 'customer'
    });
  },

  hasPermission: (permission: string) => {
    const { userRole } = get();
    return permissions[userRole]?.includes(permission) || false;
  },
}));