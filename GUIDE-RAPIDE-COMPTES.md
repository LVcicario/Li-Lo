# 🚀 Guide Rapide - Création des Comptes de Test

## ✅ Le serveur local est démarré !
**URL:** http://localhost:3000

---

## 📝 Étape 1 : Créer les Comptes dans Supabase

### Aller sur Supabase Dashboard
1. Ouvre https://supabase.com/dashboard
2. Sélectionne ton projet Li-Lo
3. Va dans **Authentication** → **Users** (sidebar gauche)
4. Clique sur **"Add User"** (bouton vert en haut à droite)

### Créer ces 3 comptes (un par un):

#### 👤 Compte 1 : CLIENT
```
Email: client@li-lo.com
Password: LiLo2025!
☑️ Cocher "Auto Confirm Email"
```
→ Cliquer "Create user"

#### 👷 Compte 2 : WORKER
```
Email: worker@li-lo.com
Password: LiLo2025!
☑️ Cocher "Auto Confirm Email"
```
→ Cliquer "Create user"

#### 👔 Compte 3 : CEO
```
Email: ceo@li-lo.com
Password: LiLo2025!
☑️ Cocher "Auto Confirm Email"
```
→ Cliquer "Create user"

---

## 📝 Étape 2 : Configurer les Rôles

### Aller dans SQL Editor
1. Dans Supabase Dashboard, clique sur **"SQL Editor"** (sidebar gauche)
2. Clique sur **"New query"**
3. **Copie-colle ce SQL complet** :

```sql
-- =============================================
-- CONFIGURATION COMPLÈTE DES COMPTES DE TEST
-- =============================================

-- 1. UPDATE ROLES
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

-- 2. ADD SILVER MEMBERSHIP FOR CLIENT
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
ON CONFLICT (user_id) DO UPDATE
SET
  tier = 'silver',
  status = 'active',
  current_period_end = NOW() + INTERVAL '30 days',
  updated_at = NOW();

-- 3. CREATE SAMPLE ORDER FOR CLIENT
INSERT INTO orders (user_id, order_number, status, payment_status, total_amount, subtotal, tax, shipping_cost, created_at)
SELECT
  p.id,
  'LLO-12345',
  'delivered',
  'paid',
  459.00,
  420.00,
  39.00,
  0.00,
  NOW() - INTERVAL '5 days'
FROM profiles p
WHERE p.email = 'client@li-lo.com'
ON CONFLICT DO NOTHING;

-- 4. ADD DROPS TO WISHLIST FOR CLIENT
INSERT INTO drop_wishlist (user_id, drop_id, notify_on_drop)
SELECT
  p.id,
  d.id,
  true
FROM profiles p
CROSS JOIN (
  SELECT id FROM drops ORDER BY drop_date DESC LIMIT 3
) d
WHERE p.email = 'client@li-lo.com'
ON CONFLICT (user_id, drop_id) DO NOTHING;

-- 5. VERIFY SETUP
SELECT
  'CLIENT' as account_type,
  p.email,
  p.role,
  p.first_name,
  um.tier as membership,
  um.status as membership_status,
  COUNT(DISTINCT o.id) as orders_count,
  COUNT(DISTINCT dw.id) as wishlist_count
FROM profiles p
LEFT JOIN user_memberships um ON um.user_id = p.id
LEFT JOIN orders o ON o.user_id = p.id
LEFT JOIN drop_wishlist dw ON dw.user_id = p.id
WHERE p.email = 'client@li-lo.com'
GROUP BY p.email, p.role, p.first_name, um.tier, um.status

UNION ALL

SELECT
  'WORKER' as account_type,
  email,
  role,
  first_name,
  NULL as membership,
  NULL as membership_status,
  0 as orders_count,
  0 as wishlist_count
FROM profiles
WHERE email = 'worker@li-lo.com'

UNION ALL

SELECT
  'CEO' as account_type,
  email,
  role,
  first_name,
  NULL as membership,
  NULL as membership_status,
  0 as orders_count,
  0 as wishlist_count
FROM profiles
WHERE email = 'ceo@li-lo.com';
```

4. Clique sur **"Run"** (ou Ctrl+Enter)
5. Tu devrais voir un tableau avec les 3 comptes configurés !

---

## 🎯 Étape 3 : Tester les Connexions

### Test 1 : COMPTE CLIENT
1. Ouvre http://localhost:3000/auth/login
2. Login avec :
   - Email: `client@li-lo.com`
   - Password: `LiLo2025!`
3. Tu devrais être redirigé vers `/account/dashboard`
4. **Vérifie :**
   - ✅ Badge "Silver Member" visible
   - ✅ 1 commande dans l'historique
   - ✅ Statistiques affichées

### Test 2 : COMPTE WORKER
1. Déconnecte-toi (logout)
2. Login avec :
   - Email: `worker@li-lo.com`
   - Password: `LiLo2025!`
3. Va sur http://localhost:3000/seller/dashboard
4. **Vérifie :**
   - ✅ Dashboard vendeur affiché
   - ✅ Statistiques vendeur
   - ✅ Menu inventaire accessible

### Test 3 : COMPTE CEO
1. Déconnecte-toi (logout)
2. Login avec :
   - Email: `ceo@li-lo.com`
   - Password: `LiLo2025!`
3. Va sur http://localhost:3000/ceo
4. **Vérifie :**
   - ✅ Dashboard CEO avec analytics
   - ✅ Graphiques financiers
   - ✅ Métriques en temps réel

---

## 🔍 Vérifications Rapides

### Si le dashboard est vide :
```sql
-- Vérifier les rôles
SELECT email, role FROM profiles
WHERE email IN ('client@li-lo.com', 'worker@li-lo.com', 'ceo@li-lo.com');
```

### Si pas d'adhésion pour client :
```sql
-- Vérifier membership
SELECT p.email, um.tier, um.status, um.current_period_end
FROM profiles p
LEFT JOIN user_memberships um ON um.user_id = p.id
WHERE p.email = 'client@li-lo.com';
```

### Si pas de wishlist :
```sql
-- Compter wishlist
SELECT p.email, COUNT(dw.id) as wishlist_count
FROM profiles p
LEFT JOIN drop_wishlist dw ON dw.user_id = p.id
WHERE p.email = 'client@li-lo.com'
GROUP BY p.email;
```

---

## 📊 URLs à Tester

### Pages Publiques
- Homepage : http://localhost:3000
- Drops : http://localhost:3000/drops
- Sneakers : http://localhost:3000/sneakers
- Membership : http://localhost:3000/membership

### Espace Client (après login client)
- Dashboard : http://localhost:3000/account/dashboard
- Wishlist Drops : http://localhost:3000/account/drops-wishlist
- Commandes : http://localhost:3000/account/orders
- Profil : http://localhost:3000/account/profile

### Espace Worker (après login worker)
- Dashboard : http://localhost:3000/seller/dashboard
- Inventaire : http://localhost:3000/seller/inventory
- Historique : http://localhost:3000/seller/history

### Espace CEO (après login ceo)
- Dashboard CEO : http://localhost:3000/ceo
- Analytics : http://localhost:3000/ceo/analytics
- Financier : http://localhost:3000/ceo/financial
- Admin Drops : http://localhost:3000/admin/drops
- Admin Dashboard : http://localhost:3000/admin/dashboard

---

## ✅ Checklist de Test

### Fonctionnalités Client
- [ ] Login fonctionne
- [ ] Dashboard affiche badge Silver
- [ ] 1 commande visible
- [ ] Wishlist drops chargée
- [ ] Profil modifiable
- [ ] Logout fonctionne

### Fonctionnalités Worker
- [ ] Login fonctionne
- [ ] Dashboard vendeur accessible
- [ ] Inventaire affiche
- [ ] Stats visibles
- [ ] Logout fonctionne

### Fonctionnalités CEO
- [ ] Login fonctionne
- [ ] Dashboard CEO accessible
- [ ] Analytics affichent
- [ ] Graphiques chargent
- [ ] Admin dashboard accessible
- [ ] Gestion drops fonctionne
- [ ] Logout fonctionne

---

## 🆘 Problèmes Courants

### "Email already registered"
→ Les comptes existent déjà, passe directement à l'Étape 2 (SQL)

### "Invalid login credentials"
→ Vérifie que tu as bien coché "Auto Confirm Email" lors de la création

### "Access denied"
→ Exécute à nouveau le SQL de l'Étape 2 pour configurer les rôles

### Dashboard vide
→ Les données de test n'ont pas été créées, réexécute le SQL complet

---

## 🎉 C'est Prêt !

Une fois les 3 étapes complétées, tu peux tester tous les espaces :

**CLIENT** : http://localhost:3000/account/dashboard
**WORKER** : http://localhost:3000/seller/dashboard
**CEO** : http://localhost:3000/ceo

**Tous les mots de passe** : `LiLo2025!`

---

**Le site tourne sur :** http://localhost:3000 ✅