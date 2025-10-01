# 🚨 PROTOCOLE DE VÉRIFICATION PRODUCTION - LI-LO

**Version** : 1.0.0
**Date** : 2025-10-01
**Temps total estimé** : 8 heures

---

## 📋 CHECKLIST PRÉ-PRODUCTION

### ✅ Phase 0 : Préparation (30 min)

```bash
# 1. Vérifier l'état du repository
git status
git log --oneline -10

# 2. Créer une branche de production
git checkout -b production-release

# 3. Vérifier les dépendances
npm audit
npm outdated

# 4. Backup de la base de données
# Aller dans Supabase Dashboard > Backups
```

---

## 🔧 Phase 1 : Configuration Environnement (2h)

### 1.1 Variables d'Environnement

**Créer `.env.production.local`** :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://mrrlohamkffxfiwspkki.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe Production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Resend Email
RESEND_API_KEY=re_xxxxx

# App Config
NEXT_PUBLIC_APP_URL=https://li-lo.com
NODE_ENV=production
```

### 1.2 Configuration Resend

```bash
# 1. Créer compte sur https://resend.com
# 2. Vérifier domaine
# 3. Obtenir API key
# 4. Test email
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_xxxxx' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "Li-Lo <noreply@li-lo.com>",
    "to": "test@example.com",
    "subject": "Test Li-Lo",
    "html": "<p>Test email</p>"
  }'
```

### 1.3 Configuration Stripe

```bash
# 1. Activer compte production Stripe
# 2. Obtenir live keys depuis Dashboard
# 3. Configurer webhook endpoint
#    URL: https://li-lo.com/api/stripe/webhook
#    Events: checkout.session.completed, payment_intent.succeeded, etc.
# 4. Sauvegarder webhook secret
```

---

## 🧪 Phase 2 : Tests Locaux (2h)

### 2.1 Build de Production

```bash
# Clean build
rm -rf .next node_modules
npm install
npm run build

# Vérifier le résultat
# ✓ Compiled successfully
# ✓ Linting and checking validity
# ✓ Collecting page data
# ✓ Generating static pages (80/80)
```

### 2.2 Tests Fonctionnels Locaux

```bash
# Démarrer en mode production
npm start

# Ouvrir http://localhost:3000
```

**Checklist Manuelle** :

#### A. Authentication Flow
```
□ Register nouveau compte
  - Email valide requis
  - Password 8+ caractères
  - Vérification email reçu
□ Login avec compte créé
  - Session persistante
  - Redirect après login
□ Forgot password
  - Email reset reçu
  - Nouveau password fonctionne
□ Logout
  - Session supprimée
  - Routes protégées inaccessibles
```

#### B. E-Commerce Flow
```
□ Catalogue produits
  - 36 produits visibles
  - Images chargent
  - Pagination fonctionne
□ Search & Filtres
  - Search "Jordan" → résultats
  - Filtre par marque → update
  - Sort par prix → ordre correct
□ Product Detail
  - Toutes les tailles affichées
  - Stock temps réel
  - Add to cart fonctionne
□ Panier
  - Quantité modifiable
  - Prix recalculé
  - Remove item OK
□ Checkout
  - Form validation
  - Stripe payment sheet
  - Test card: 4242 4242 4242 4242
□ Order Confirmation
  - Page success affichée
  - Email confirmation (si Resend OK)
  - Stock déduit en DB
```

#### C. Dashboards
```
□ CEO Dashboard (/ceo)
  - KPIs chargent
  - Charts affichés
  - Real-time data
□ Seller Dashboard (/seller)
  - Stock modifiable
  - History visible
  - Actions logged
□ Client Dashboard (/client)
  - Orders listées
  - Profile editable
  - Wishlist fonctionne
```

### 2.3 Tests API

```bash
# Test products endpoint
curl http://localhost:3000/api/products

# Test avec filtres
curl "http://localhost:3000/api/products?brands=nike&min_price=100&max_price=500"

# Test cart (nécessite auth)
curl -H "Authorization: Bearer xxx" \
  http://localhost:3000/api/cart
```

---

## 🚀 Phase 3 : Déploiement Production (1h)

### 3.1 Déploiement Vercel

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# Alternative: Via GitHub
# - Push to main branch
# - Auto-deploy configuré
```

### 3.2 Configuration Vercel

**Dashboard Vercel > Settings > Environment Variables** :

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
NEXT_PUBLIC_APP_URL
```

### 3.3 Configuration DNS

```
# Domaine li-lo.com
A Record → 76.76.21.21 (Vercel IP)
CNAME → cname.vercel-dns.com
```

---

## ✅ Phase 4 : Validation Production (2h)

### 4.1 Smoke Tests Production

```bash
# 1. Homepage loads
curl -I https://li-lo.com

# 2. API responds
curl https://li-lo.com/api/products

# 3. Static assets load
curl -I https://li-lo.com/_next/static/...
```

### 4.2 Tests Fonctionnels Production

**Répéter tous les tests de la Phase 2.2 sur production**

### 4.3 Monitoring Setup

```javascript
// 1. UptimeRobot
// URL: https://li-lo.com
// Check every: 5 minutes
// Alert: Email + SMS

// 2. Google Analytics
// Add to app/layout.tsx
<Script
  strategy="afterInteractive"
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXX`}
/>

// 3. Sentry (optionnel)
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 4.4 Webhook Stripe Validation

```bash
# Test avec Stripe CLI
stripe listen --forward-to https://li-lo.com/api/stripe/webhook

# Créer un test payment
stripe trigger payment_intent.succeeded
```

---

## 📊 Phase 5 : Performance & Load Testing (1h)

### 5.1 Lighthouse Audit

```bash
# Chrome DevTools > Lighthouse
# Run audit on:
- Performance
- Accessibility
- Best Practices
- SEO

# Objectifs:
- Performance > 90
- Accessibility > 95
- SEO > 95
```

### 5.2 Load Testing (k6)

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Stay
    { duration: '2m', target: 0 },   // Ramp down
  ],
};

export default function () {
  let response = http.get('https://li-lo.com');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });
  sleep(1);
}
```

```bash
# Run test
k6 run load-test.js
```

---

## 🔒 Phase 6 : Sécurité Finale (30 min)

### 6.1 Security Headers

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

### 6.2 Secrets Rotation

```bash
# 1. Rotate Supabase service key
# 2. Update Stripe webhook secret
# 3. Regenerate Resend API key si nécessaire
```

---

## 📱 Phase 7 : Tests Cross-Platform (30 min)

### Devices à Tester

```
Desktop:
□ Chrome (Windows/Mac)
□ Firefox
□ Safari (Mac)
□ Edge

Mobile:
□ iPhone Safari
□ Android Chrome
□ iPad Safari

Resolutions:
□ 320px (Mobile S)
□ 768px (Tablet)
□ 1024px (Desktop)
□ 1920px (Full HD)
```

---

## 🎯 CRITÈRES DE SUCCÈS

### ✅ Go/No-Go Decision

**GO si tous les points suivants sont validés** :

```
□ Build production sans erreurs
□ Tous les tests Phase 2.2 passent
□ Stripe webhook reçoit les events
□ Emails envoyés correctement
□ Performance > 90 (Lighthouse)
□ Pas d'erreurs console en production
□ SSL certificat valide
□ Load test < 1% error rate
□ Stock se déduit après achat
□ Mobile responsive OK
```

---

## 🚨 ROLLBACK PROCEDURE

### Si problème critique en production :

```bash
# 1. Revert immediat
vercel rollback

# 2. Ou via Git
git revert HEAD
git push origin main

# 3. Notification utilisateurs
# Bannière maintenance sur site

# 4. Debug
# Logs Vercel Functions
# Supabase logs
# Sentry errors

# 5. Fix & Redeploy
git checkout -b hotfix/critical-issue
# Fix issue
git push origin hotfix/critical-issue
# Merge après tests
```

---

## 📞 CONTACTS D'URGENCE

```
Vercel Support: support@vercel.com
Supabase Support: support@supabase.com
Stripe Support: support@stripe.com
Resend Support: support@resend.com
```

---

## 📅 POST-LAUNCH (Jour 1)

### Monitoring Checklist

```
□ Check uptime (100%?)
□ Review error logs
□ Analyze first users behavior
□ Check conversion rate
□ Monitor server response times
□ Review security alerts
□ Backup database
□ Team retrospective meeting
```

---

## 🎉 LAUNCH CHECKLIST FINALE

```
□ Domaine configuré
□ SSL actif
□ Variables env production
□ Build sans erreurs
□ Tests passent
□ Webhooks fonctionnent
□ Emails partent
□ Stock se met à jour
□ Paiements processés
□ Monitoring actif
□ Backup créé
□ Documentation à jour
□ Équipe notifiée
```

**🚀 READY FOR LAUNCH? → DEPLOY!**

---

*Document créé le 2025-10-01*
*Version 1.0.0*
*Par Claude - Expert DevOps*