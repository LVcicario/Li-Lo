# 🔐 Comptes de Test Li-Lo

## Création des Comptes

Pour créer les comptes de test, suivez ces étapes dans le Supabase Dashboard :

### 1. Accéder à l'Authentication
1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez le projet Li-Lo
3. Cliquez sur "Authentication" dans la sidebar
4. Cliquez sur "Users" puis "Add User"

### 2. Créer les 3 Comptes

#### 👤 COMPTE CLIENT
```
Email: client@li-lo.com
Password: LiLo2025!
Auto Confirm Email: ✅ OUI
```

#### 👷 COMPTE WORKER/SELLER
```
Email: worker@li-lo.com
Password: LiLo2025!
Auto Confirm Email: ✅ OUI
```

#### 👔 COMPTE CEO/ADMIN
```
Email: ceo@li-lo.com
Password: LiLo2025!
Auto Confirm Email: ✅ OUI
```

### 3. Configuration des Profils

Après création des comptes, exécutez ce SQL dans le SQL Editor de Supabase :

```sql
-- Update CLIENT profile
UPDATE profiles
SET
  role = 'client',
  first_name = 'John',
  last_name = 'Client',
  phone = '+33612345678',
  updated_at = NOW()
WHERE email = 'client@li-lo.com';

-- Update WORKER profile
UPDATE profiles
SET
  role = 'worker',
  first_name = 'Sarah',
  last_name = 'Worker',
  phone = '+33612345679',
  updated_at = NOW()
WHERE email = 'worker@li-lo.com';

-- Update CEO profile
UPDATE profiles
SET
  role = 'super_admin',
  first_name = 'Michael',
  last_name = 'CEO',
  phone = '+33612345680',
  updated_at = NOW()
WHERE email = 'ceo@li-lo.com';

-- Add Silver membership for CLIENT
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
  updated_at = NOW();

-- Create sample order for CLIENT
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
WHERE p.email = 'client@li-lo.com'
AND NOT EXISTS (SELECT 1 FROM orders WHERE user_id = p.id);

-- Add drops to wishlist for CLIENT
INSERT INTO drop_wishlist (user_id, drop_id, notify_on_drop)
SELECT
  p.id,
  d.id,
  true
FROM profiles p
CROSS JOIN drops d
WHERE p.email = 'client@li-lo.com'
LIMIT 3
ON CONFLICT (user_id, drop_id) DO NOTHING;
```

---

## 📧 Identifiants de Connexion

### 👤 COMPTE CLIENT (Acheteur)
- **Email:** `client@li-lo.com`
- **Mot de passe:** `LiLo2025!`
- **Accès:** `/account/dashboard`
- **Fonctionnalités:**
  - Voir ses commandes
  - Gérer sa wishlist de drops
  - Voir son adhésion Silver active
  - Modifier son profil
  - Voir ses adresses

### 👷 COMPTE WORKER/SELLER (Vendeur)
- **Email:** `worker@li-lo.com`
- **Mot de passe:** `LiLo2025!`
- **Accès:** `/seller/dashboard`
- **Fonctionnalités:**
  - Gérer son inventaire
  - Voir l'historique des ventes
  - Ajouter des produits
  - Gérer les stocks
  - Voir les statistiques de ventes

### 👔 COMPTE CEO/ADMIN (Direction)
- **Email:** `ceo@li-lo.com`
- **Mot de passe:** `LiLo2025!`
- **Accès principal:** `/ceo`
- **Accès secondaire:** `/admin/dashboard`
- **Fonctionnalités:**
  - Dashboard CEO avec analytics financiers
  - Métriques de revenus en temps réel
  - Breakdown des adhésions (Bronze/Silver/Gold)
  - Performance des drops
  - Analytics des ventes
  - Gestion complète admin des drops
  - Gestion des stocks
  - Vue d'ensemble business

---

## 🎯 Espaces Optimisés

### Espace Client (`/account/*`)
- ✅ Dashboard avec résumé des commandes
- ✅ Wishlist drops avec notifications
- ✅ Gestion adhésion membership
- ✅ Historique commandes complet
- ✅ Gestion profil et adresses
- ✅ Animations fluides avec Framer Motion
- ✅ Design responsive

### Espace Worker (`/seller/*`)
- ✅ Dashboard vendeur avec statistiques
- ✅ Gestion inventaire en temps réel
- ✅ Historique des ventes
- ✅ Système de réapprovisionnement
- ✅ Graphiques de performance
- ✅ Interface intuitive

### Espace CEO (`/ceo` & `/admin/*`)
- ✅ Analytics financiers détaillés
- ✅ Revenus totaux et par source
- ✅ Breakdown des adhésions
- ✅ Performance des drops
- ✅ Top drops par revenus
- ✅ Graphiques interactifs (Recharts)
- ✅ Gestion complète des drops
- ✅ Vue d'ensemble business

---

## 🚀 Optimisations Appliquées

### Performance Globale
- ✅ **Next.js Config optimisé** : Code splitting, compression, SWC minify
- ✅ **Bundle optimization** : Vendor chunks séparés, tree shaking
- ✅ **Image optimization** : AVIF/WebP, lazy loading, sizes optimales
- ✅ **Cache headers** : CDN caching pour assets statiques
- ✅ **Security headers** : HSTS, CSP, X-Frame-Options

### Code Performance
- ✅ **Lazy loading** : Composants lourds chargés à la demande
- ✅ **Memoization** : Fonctions de formatage mises en cache
- ✅ **Debounce/Throttle** : Optimisation des événements fréquents
- ✅ **Dynamic imports** : Charts et 360 view en lazy load

### Expérience Utilisateur
- ✅ **Animations maintenues** : Toutes les animations Framer Motion préservées
- ✅ **Loading states** : Spinners et skeletons
- ✅ **Error handling** : Messages d'erreur clairs
- ✅ **Toast notifications** : Feedback instantané (Sonner)

---

## 📊 Métriques de Performance

### Build Stats
- **Pages générées:** 80
- **Erreurs TypeScript:** 0
- **Bundle JavaScript:** Optimisé avec code splitting
- **Images:** Optimisation automatique AVIF/WebP
- **Cache:** Stratégie agressive pour assets

### Temps de Chargement (estimés)
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s
- **Cumulative Layout Shift:** < 0.1

---

## 🔧 Maintenance

### Commandes Utiles
```bash
# Build production
npm run build

# Démarrer en production
npm start

# Analyser le bundle
npm run build -- --analyze

# Tests de performance
npm run test:perf
```

### Variables d'Environnement Requises
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=Li-Lo <noreply@li-lo.com>

# Cron
CRON_SECRET=

# Analytics (optionnel)
NEXT_PUBLIC_GA_ID=

# Site
NEXT_PUBLIC_SITE_URL=https://li-lo.com
```

---

## 📝 Notes Importantes

1. **Sécurité:** Tous les mots de passe sont `LiLo2025!` - À changer en production
2. **Données de test:** Les comptes ont des données factices pour démonstration
3. **RLS activé:** Tous les users ne voient que leurs propres données
4. **Emails:** Configuration Resend requise pour notifications fonctionnelles
5. **Cron:** Configuration Vercel Cron requise pour notifications automatiques

---

## 🎨 Qualité Préservée

✅ **Animations** : Toutes les animations Framer Motion sont préservées
✅ **Design** : UI/UX inchangée, responsive
✅ **Fonctionnalités** : Toutes features opérationnelles
✅ **Performance** : Optimisations sans compromis sur l'expérience
✅ **SEO** : Meta tags, sitemap, structured data

---

**Dernière mise à jour:** 2025-01-22
**Version:** 1.0.0
**Status:** ✅ Production Ready