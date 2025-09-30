// =============================================
// DROPS TYPES - Li-Lo E-Commerce Platform
// =============================================

import { MembershipTier } from './membership';

export type DropType = 'standard' | 'exclusive' | 'ultra_rare' | 'collab';

export type DropStatus =
  | 'scheduled'
  | 'announced'
  | 'live'
  | 'sold_out'
  | 'ended'
  | 'cancelled';

export type NotificationType =
  | 'all'
  | 'announcement'
  | 'early_access'
  | 'live'
  | 'restock';

export type DropAccessType = 'early_access' | 'public' | 'vip';

export interface Drop {
  id: string;
  name: string;
  slug: string;
  description?: string;
  drop_type: DropType;
  tier_requirement?: MembershipTier;

  // Timing
  announcement_date?: string;
  drop_date: string;
  end_date?: string;

  // Early access (hours before public)
  early_access_bronze: number;
  early_access_silver: number;
  early_access_gold: number;

  // Quantity
  total_quantity?: number;
  remaining_quantity?: number;

  // Status
  status: DropStatus;

  // Media
  banner_image_url?: string;
  teaser_video_url?: string;
  featured_image_url?: string;

  // Metadata
  tags?: string[];
  is_featured: boolean;

  created_at: string;
  updated_at: string;
}

export interface DropProduct {
  id: string;
  drop_id: string;
  product_id: string;

  // Drop-specific pricing by tier
  drop_price?: number;
  bronze_price?: number;
  silver_price?: number;
  gold_price?: number;

  // Stock
  drop_quantity?: number;
  sold_quantity: number;

  // Display
  sort_order: number;
  is_featured: boolean;

  created_at: string;
  updated_at: string;

  // Populated fields
  product?: any; // Will be populated with full product data
}

export interface DropNotification {
  id: string;
  user_id: string;
  drop_id: string;
  notification_type: NotificationType;

  // Channels
  notify_email: boolean;
  notify_push: boolean;
  notify_sms: boolean;

  // Status
  is_notified: boolean;
  notified_at?: string;

  created_at: string;
}

export interface DropAccessLog {
  id: string;
  drop_id: string;
  user_id?: string;
  tier?: MembershipTier;
  access_type: DropAccessType;
  accessed_at: string;
}

export interface DropWithProducts extends Drop {
  products: DropProduct[];
  product_count: number;
}

export interface DropCalendarItem {
  drop: Drop;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  userHasAccess: boolean;
  accessTime: Date;
  isLive: boolean;
  isSoldOut: boolean;
}

// Helper functions
export function getDropStatusBadge(status: DropStatus): {
  label: string;
  color: string;
} {
  const badges: Record<DropStatus, { label: string; color: string }> = {
    scheduled: { label: 'Coming Soon', color: 'blue' },
    announced: { label: 'Announced', color: 'purple' },
    live: { label: 'Live Now', color: 'green' },
    sold_out: { label: 'Sold Out', color: 'red' },
    ended: { label: 'Ended', color: 'gray' },
    cancelled: { label: 'Cancelled', color: 'gray' },
  };

  return badges[status];
}

export function getDropTypeBadge(type: DropType): {
  label: string;
  color: string;
} {
  const badges: Record<DropType, { label: string; color: string }> = {
    standard: { label: 'Standard', color: 'gray' },
    exclusive: { label: 'Exclusive', color: 'purple' },
    ultra_rare: { label: 'Ultra Rare', color: 'gold' },
    collab: { label: 'Collaboration', color: 'pink' },
  };

  return badges[type];
}

export function calculateCountdown(dropDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
} {
  const now = new Date();
  const diff = dropDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isLive: false };
}

export function getPriceForTier(
  dropProduct: DropProduct,
  tier: MembershipTier | null
): number {
  if (!tier || tier === 'bronze') {
    return dropProduct.bronze_price || dropProduct.drop_price || 0;
  }

  if (tier === 'silver') {
    return dropProduct.silver_price || dropProduct.bronze_price || dropProduct.drop_price || 0;
  }

  if (tier === 'gold') {
    return dropProduct.gold_price || dropProduct.silver_price || dropProduct.bronze_price || dropProduct.drop_price || 0;
  }

  return dropProduct.drop_price || 0;
}

export function canAccessDrop(
  drop: Drop,
  userTier: MembershipTier | null,
  currentTime: Date = new Date()
): {
  canAccess: boolean;
  reason?: string;
  accessTime?: Date;
} {
  const dropDate = new Date(drop.drop_date);

  // Check if drop has ended
  if (drop.end_date && new Date(drop.end_date) < currentTime) {
    return { canAccess: false, reason: 'Drop has ended' };
  }

  // Check if drop is sold out
  if (drop.status === 'sold_out') {
    return { canAccess: false, reason: 'Drop is sold out' };
  }

  // Check tier requirement
  if (drop.tier_requirement) {
    const tierHierarchy: Record<MembershipTier, number> = {
      bronze: 1,
      silver: 2,
      gold: 3,
    };

    const userLevel = userTier ? tierHierarchy[userTier] : 0;
    const requiredLevel = tierHierarchy[drop.tier_requirement];

    if (userLevel < requiredLevel) {
      return {
        canAccess: false,
        reason: `Requires ${drop.tier_requirement} membership or higher`,
      };
    }
  }

  // Calculate early access time based on tier
  let earlyAccessHours = 0;
  if (userTier === 'gold') {
    earlyAccessHours = drop.early_access_gold;
  } else if (userTier === 'silver') {
    earlyAccessHours = drop.early_access_silver;
  } else if (userTier === 'bronze') {
    earlyAccessHours = drop.early_access_bronze;
  }

  const accessTime = new Date(dropDate.getTime() - earlyAccessHours * 60 * 60 * 1000);

  // Check if current time is before access time
  if (currentTime < accessTime) {
    return {
      canAccess: false,
      reason: `Early access starts in ${Math.ceil((accessTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60))} hours`,
      accessTime,
    };
  }

  return { canAccess: true, accessTime };
}