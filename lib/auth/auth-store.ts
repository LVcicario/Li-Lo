import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  role: 'customer' | 'admin' | 'vip' | 'seller';
  loyalty_points: number;
  vip_tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'black';
  verified: boolean;
  created_at: string;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    language: 'en' | 'fr';
    currency: 'EUR' | 'USD';
    shoe_size?: string;
    favorite_brands?: string[];
  };
}

interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;

  // Authentication methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signInWithProvider: (provider: 'google' | 'apple' | 'facebook') => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;

  // Profile methods
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;

  // Session management
  refreshSession: () => Promise<void>;
  checkSession: () => Promise<void>;

  // Loyalty program
  addLoyaltyPoints: (points: number) => Promise<void>;
  checkVipStatus: () => Promise<void>;

  // 2FA
  enableTwoFactor: () => Promise<void>;
  verifyTwoFactor: (code: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: false,
      initialized: false,

      signIn: async (email: string, password: string) => {
        set({ loading: true });
        const supabase = createClient();

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            // Fetch full user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            const authUser: AuthUser = {
              id: data.user.id,
              email: data.user.email!,
              username: profile?.username,
              full_name: profile?.full_name,
              avatar_url: profile?.avatar_url,
              phone: profile?.phone,
              role: profile?.role || 'customer',
              loyalty_points: profile?.loyalty_points || 0,
              vip_tier: profile?.vip_tier || 'bronze',
              verified: data.user.email_confirmed_at !== null,
              created_at: data.user.created_at,
              preferences: profile?.preferences || {
                notifications: true,
                newsletter: true,
                language: 'fr',
                currency: 'EUR',
              },
            };

            set({
              user: authUser,
              session: data.session,
              loading: false
            });

            // Track login event
            await supabase.from('activity_logs').insert({
              user_id: data.user.id,
              action: 'login',
              metadata: { method: 'password' }
            });
          }
        } catch (error: any) {
          console.error('Sign in error:', error);
          set({ loading: false });
          throw new Error(error.message || 'Failed to sign in');
        }
      },

      signUp: async (email: string, password: string, metadata?: any) => {
        set({ loading: true });
        const supabase = createClient();

        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: metadata,
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) throw error;

          if (data.user) {
            // Create profile
            await supabase.from('profiles').insert({
              id: data.user.id,
              email: data.user.email,
              username: metadata?.username,
              full_name: metadata?.full_name,
              role: 'customer',
              loyalty_points: 100, // Welcome bonus
              vip_tier: 'bronze',
              preferences: {
                notifications: true,
                newsletter: true,
                language: 'fr',
                currency: 'EUR',
              },
            });

            // Send welcome email
            await supabase.from('email_queue').insert({
              to: data.user.email,
              template: 'welcome',
              data: { name: metadata?.full_name || 'Customer' },
            });

            set({ loading: false });
          }
        } catch (error: any) {
          console.error('Sign up error:', error);
          set({ loading: false });
          throw new Error(error.message || 'Failed to sign up');
        }
      },

      signInWithProvider: async (provider: 'google' | 'apple' | 'facebook') => {
        set({ loading: true });
        const supabase = createClient();

        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: provider as any,
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) throw error;
        } catch (error: any) {
          console.error('OAuth sign in error:', error);
          set({ loading: false });
          throw new Error(error.message || 'Failed to sign in with provider');
        }
      },

      signOut: async () => {
        set({ loading: true });
        const supabase = createClient();
        const { user } = get();

        try {
          // Track logout event
          if (user) {
            await supabase.from('activity_logs').insert({
              user_id: user.id,
              action: 'logout',
            });
          }

          const { error } = await supabase.auth.signOut();
          if (error) throw error;

          set({
            user: null,
            session: null,
            loading: false
          });
        } catch (error: any) {
          console.error('Sign out error:', error);
          set({ loading: false });
          throw new Error(error.message || 'Failed to sign out');
        }
      },

      resetPassword: async (email: string) => {
        const supabase = createClient();

        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          });

          if (error) throw error;
        } catch (error: any) {
          console.error('Reset password error:', error);
          throw new Error(error.message || 'Failed to send reset email');
        }
      },

      updatePassword: async (newPassword: string) => {
        const supabase = createClient();

        try {
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          if (error) throw error;
        } catch (error: any) {
          console.error('Update password error:', error);
          throw new Error(error.message || 'Failed to update password');
        }
      },

      updateProfile: async (updates: Partial<AuthUser>) => {
        const supabase = createClient();
        const { user } = get();

        if (!user) throw new Error('Not authenticated');

        try {
          const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

          if (error) throw error;

          set({
            user: { ...user, ...updates }
          });
        } catch (error: any) {
          console.error('Update profile error:', error);
          throw new Error(error.message || 'Failed to update profile');
        }
      },

      uploadAvatar: async (file: File) => {
        const supabase = createClient();
        const { user } = get();

        if (!user) throw new Error('Not authenticated');

        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          const filePath = `avatars/${fileName}`;

          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

          // Update profile
          await get().updateProfile({ avatar_url: publicUrl });

          return publicUrl;
        } catch (error: any) {
          console.error('Upload avatar error:', error);
          throw new Error(error.message || 'Failed to upload avatar');
        }
      },

      refreshSession: async () => {
        const supabase = createClient();

        try {
          const { data: { session }, error } = await supabase.auth.refreshSession();

          if (error) throw error;

          if (session) {
            set({ session });
          }
        } catch (error: any) {
          console.error('Refresh session error:', error);
          throw new Error(error.message || 'Failed to refresh session');
        }
      },

      checkSession: async () => {
        const supabase = createClient();
        set({ loading: true });

        try {
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            // Fetch full user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email!,
              username: profile?.username,
              full_name: profile?.full_name,
              avatar_url: profile?.avatar_url,
              phone: profile?.phone,
              role: profile?.role || 'customer',
              loyalty_points: profile?.loyalty_points || 0,
              vip_tier: profile?.vip_tier || 'bronze',
              verified: session.user.email_confirmed_at !== null,
              created_at: session.user.created_at,
              preferences: profile?.preferences || {
                notifications: true,
                newsletter: true,
                language: 'fr',
                currency: 'EUR',
              },
            };

            set({
              user: authUser,
              session,
              loading: false,
              initialized: true
            });
          } else {
            set({
              user: null,
              session: null,
              loading: false,
              initialized: true
            });
          }
        } catch (error: any) {
          console.error('Check session error:', error);
          set({ loading: false, initialized: true });
        }
      },

      addLoyaltyPoints: async (points: number) => {
        const supabase = createClient();
        const { user } = get();

        if (!user) throw new Error('Not authenticated');

        try {
          const newPoints = user.loyalty_points + points;

          await supabase
            .from('profiles')
            .update({ loyalty_points: newPoints })
            .eq('id', user.id);

          set({
            user: { ...user, loyalty_points: newPoints }
          });

          // Check for VIP tier upgrade
          await get().checkVipStatus();
        } catch (error: any) {
          console.error('Add loyalty points error:', error);
          throw new Error(error.message || 'Failed to add loyalty points');
        }
      },

      checkVipStatus: async () => {
        const { user } = get();
        if (!user) return;

        let newTier: typeof user.vip_tier = 'bronze';

        if (user.loyalty_points >= 10000) newTier = 'black';
        else if (user.loyalty_points >= 5000) newTier = 'platinum';
        else if (user.loyalty_points >= 2500) newTier = 'gold';
        else if (user.loyalty_points >= 1000) newTier = 'silver';

        if (newTier !== user.vip_tier) {
          await get().updateProfile({ vip_tier: newTier });

          // Notify user of tier upgrade
          const supabase = createClient();
          await supabase.from('notifications').insert({
            user_id: user.id,
            type: 'vip_upgrade',
            title: 'VIP Tier Upgrade!',
            message: `Congratulations! You've been upgraded to ${newTier} tier.`,
          });
        }
      },

      enableTwoFactor: async () => {
        const supabase = createClient();
        const { user } = get();

        if (!user) throw new Error('Not authenticated');

        try {
          // Enable 2FA logic here
          // This would typically involve generating a secret and QR code
          console.log('2FA enabled for user:', user.id);
        } catch (error: any) {
          console.error('Enable 2FA error:', error);
          throw new Error(error.message || 'Failed to enable 2FA');
        }
      },

      verifyTwoFactor: async (code: string) => {
        const supabase = createClient();
        const { user } = get();

        if (!user) throw new Error('Not authenticated');

        try {
          // Verify 2FA code logic here
          console.log('Verifying 2FA code:', code);
        } catch (error: any) {
          console.error('Verify 2FA error:', error);
          throw new Error(error.message || 'Failed to verify 2FA code');
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
);

// Initialize auth on app start
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkSession();
}