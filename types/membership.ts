// =============================================
// MEMBERSHIP TYPES - Li-Lo E-Commerce Platform
// =============================================

export type MembershipTier = 'bronze' | 'silver' | 'gold';

export type MembershipStatus = 'active' | 'cancelled' | 'expired' | 'trial';

export type BillingPeriod = 'monthly' | 'yearly';

export interface MembershipTierConfig {
  id: string;
  tier: MembershipTier;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  early_access_hours: number;
  exclusive_drops: boolean;
  discount_percentage: number;
  free_shipping: boolean;
  priority_support: boolean;
  badge_color: string;
  badge_icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserMembership {
  id: string;
  user_id: string;
  tier_id: string;
  tier: MembershipTier;
  status: MembershipStatus;
  billing_period: BillingPeriod;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  started_at: string;
  current_period_start: string;
  current_period_end?: string;
  cancelled_at?: string;
  expires_at?: string;
  trial_start?: string;
  trial_end?: string;
  is_trial: boolean;
  created_at: string;
  updated_at: string;
}

export interface MembershipBenefit {
  id: string;
  user_membership_id: string;
  benefit_type: 'early_access' | 'discount' | 'free_shipping' | 'vip_event' | 'priority_support';
  benefit_value: string;
  used_at?: string;
  order_id?: string;
  created_at: string;
}

export interface MembershipUpgradeRequest {
  user_id: string;
  current_tier: MembershipTier;
  target_tier: MembershipTier;
  billing_period: BillingPeriod;
}

export interface MembershipCheckoutSession {
  tier: MembershipTier;
  billing_period: BillingPeriod;
  price: number;
  stripe_session_id: string;
  success_url: string;
  cancel_url: string;
}

// Helper type for membership comparison
export const TIER_HIERARCHY: Record<MembershipTier, number> = {
  bronze: 1,
  silver: 2,
  gold: 3,
};

// Check if user has required tier access
export function hasRequiredTier(
  userTier: MembershipTier | null,
  requiredTier: MembershipTier | null
): boolean {
  if (!requiredTier) return true; // No requirement
  if (!userTier) return requiredTier === 'bronze'; // Default to bronze
  return TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[requiredTier];
}

// Calculate discount for tier
export function calculateMembershipDiscount(
  price: number,
  tier: MembershipTier | null
): number {
  if (!tier) return 0;

  const discounts: Record<MembershipTier, number> = {
    bronze: 0,
    silver: 0.1, // 10%
    gold: 0.2, // 20%
  };

  return price * discounts[tier];
}

// Get early access time for tier
export function getEarlyAccessTime(
  dropDate: Date,
  tier: MembershipTier | null
): Date {
  const hours: Record<MembershipTier, number> = {
    bronze: 0,
    silver: 12,
    gold: 24,
  };

  const accessHours = tier ? hours[tier] : 0;
  return new Date(dropDate.getTime() - accessHours * 60 * 60 * 1000);
}