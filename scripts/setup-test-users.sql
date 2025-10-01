-- Script pour créer les utilisateurs de test dans Supabase
-- À exécuter dans la console SQL de Supabase

-- Note: Les utilisateurs doivent être créés via l'API Auth de Supabase
-- Ce script prépare les profiles une fois que les utilisateurs sont créés

-- 1. S'assurer que les profiles existent pour les utilisateurs de test
INSERT INTO profiles (id, email, first_name, last_name, role, created_at, updated_at)
VALUES
  -- CEO Account
  (gen_random_uuid(), 'ceo@li-lo.com', 'CEO', 'Li-Lo', 'ceo', NOW(), NOW()),
  -- Seller Account
  (gen_random_uuid(), 'worker@li-lo.com', 'Worker', 'Li-Lo', 'seller', NOW(), NOW()),
  -- Client Account
  (gen_random_uuid(), 'client@li-lo.com', 'Client', 'Test', 'client', NOW(), NOW())
ON CONFLICT (email)
DO UPDATE SET
  role = EXCLUDED.role,
  updated_at = NOW();

-- 2. Créer les role assignments pour garantir les bonnes permissions
INSERT INTO role_assignments (email, assigned_role, assigned_by, is_active, created_at)
VALUES
  ('ceo@li-lo.com', 'ceo', 'system', true, NOW()),
  ('worker@li-lo.com', 'seller', 'system', true, NOW()),
  ('client@li-lo.com', 'client', 'system', true, NOW())
ON CONFLICT (email)
DO UPDATE SET
  assigned_role = EXCLUDED.assigned_role,
  is_active = true;

-- 3. S'assurer que les permissions sont correctement configurées
-- CEO a toutes les permissions
INSERT INTO user_permissions (user_email, permission, granted_by, created_at)
VALUES
  ('ceo@li-lo.com', 'all_permissions', 'system', NOW()),
  ('ceo@li-lo.com', 'view_analytics', 'system', NOW()),
  ('ceo@li-lo.com', 'manage_platform', 'system', NOW())
ON CONFLICT DO NOTHING;

-- Seller a les permissions de gestion des produits
INSERT INTO user_permissions (user_email, permission, granted_by, created_at)
VALUES
  ('worker@li-lo.com', 'manage_products', 'system', NOW()),
  ('worker@li-lo.com', 'manage_inventory', 'system', NOW()),
  ('worker@li-lo.com', 'manage_orders', 'system', NOW())
ON CONFLICT DO NOTHING;

-- Client a les permissions basiques
INSERT INTO user_permissions (user_email, permission, granted_by, created_at)
VALUES
  ('client@li-lo.com', 'view_products', 'system', NOW()),
  ('client@li-lo.com', 'create_orders', 'system', NOW()),
  ('client@li-lo.com', 'manage_profile', 'system', NOW())
ON CONFLICT DO NOTHING;