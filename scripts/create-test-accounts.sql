-- =============================================
-- CREATE TEST ACCOUNTS
-- Generate test users for all roles
-- =============================================

-- Note: Execute this via Supabase SQL Editor or apply_migration
-- Passwords will be: LiLo2025!

-- 1. CLIENT TEST ACCOUNT
-- Email: client@li-lo.com
-- Password: LiLo2025!
-- User will be created via Supabase Auth, then profile updated

-- 2. WORKER/SELLER TEST ACCOUNT
-- Email: worker@li-lo.com
-- Password: LiLo2025!

-- 3. CEO/ADMIN TEST ACCOUNT
-- Email: ceo@li-lo.com
-- Password: LiLo2025!

-- Update profiles after users are created via Auth
-- This query should be run AFTER creating users in Supabase Auth Dashboard

-- Example profile updates (replace with actual user IDs after auth creation):
/*
UPDATE profiles
SET
  role = 'client',
  first_name = 'John',
  last_name = 'Client',
  phone = '+33612345678',
  updated_at = NOW()
WHERE email = 'client@li-lo.com';

UPDATE profiles
SET
  role = 'worker',
  first_name = 'Sarah',
  last_name = 'Worker',
  phone = '+33612345679',
  updated_at = NOW()
WHERE email = 'worker@li-lo.com';

UPDATE profiles
SET
  role = 'super_admin',
  first_name = 'Michael',
  last_name = 'CEO',
  phone = '+33612345680',
  updated_at = NOW()
WHERE email = 'ceo@li-lo.com';
*/

-- Create sample membership for client
/*
INSERT INTO user_memberships (user_id, tier_id, tier, status, billing_period, current_period_end)
SELECT
  p.id,
  mt.id,
  'silver',
  'active',
  'monthly',
  NOW() + INTERVAL '30 days'
FROM profiles p
CROSS JOIN membership_tiers mt
WHERE p.email = 'client@li-lo.com'
AND mt.tier = 'silver'
ON CONFLICT (user_id) DO NOTHING;
*/

-- Create sample orders for client
/*
INSERT INTO orders (user_id, order_number, status, payment_status, total_amount, subtotal, tax, shipping_cost)
SELECT
  p.id,
  'LLO-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0'),
  'delivered',
  'paid',
  459.00,
  420.00,
  39.00,
  0.00
FROM profiles p
WHERE p.email = 'client@li-lo.com';
*/

-- Add some wishlist items for client
/*
INSERT INTO drop_wishlist (user_id, drop_id, notify_on_drop)
SELECT
  p.id,
  d.id,
  true
FROM profiles p
CROSS JOIN drops d
WHERE p.email = 'client@li-lo.com'
LIMIT 3;
*/