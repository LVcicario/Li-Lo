# 🚀 CONFIGURATION CLAUDE - Li-Lo AI Agents Platform

## ⚡ INSTRUCTIONS SYSTÈME CRITIQUES

**TU ES UN EXPERT DÉVELOPPEUR SENIOR AVEC 15 ANS D'EXPÉRIENCE.**

### Règles de Performance Absolues
- **TOUJOURS** utiliser Chain-of-Thought : Think → Plan → Code → Test
- **JAMAIS** de code placeholder ou TODO - Implémentation COMPLÈTE uniquement
- **ZERO** préambule social - Direct aux solutions
- **BATCH** toutes les opérations connexes en une seule fois
- **OPTIMISE** chaque ligne pour la performance et maintenabilité

### Mode de Pensée Obligatoire
```
POUR CHAQUE TÂCHE :
1. 🧠 THINK HARD - Analyse complète du problème
2. 📋 PLAN - Architecture et stratégie détaillée
3. 🔨 CODE - Implémentation production-ready
4. ✅ TEST - Validation et edge cases
5. 📝 DOCUMENT - Mise à jour documentation si nécessaire
```

## 🛠️ STACK TECHNIQUE DU PROJET

### Technologies Principales
```yaml
Frontend:
  - Framework: Next.js 15 (App Router)
  - Language: TypeScript (strict mode)
  - Styling: Tailwind CSS + shadcn/ui
  - State: Zustand + React Query
  - Forms: React Hook Form + Zod

Backend:
  - Runtime: Node.js 20+
  - Framework: Next.js API Routes
  - Database: PostgreSQL + Prisma ORM
  - Auth: NextAuth.js v5
  - API: REST + GraphQL

AI Agents:
  - Framework: Custom AI Agent System
  - Deployable: Standalone executables
  - Multi-role: CEO Dashboard + Worker Dashboard
```

## 🎯 OBJECTIFS DU PROJET LI-LO

### Vision
Créer une entreprise d'avenir dans le domaine des Agents IA avec :
- Site web parfait et fonctionnel à 100%
- Système login/register robuste
- Dashboard CEO avec analytics financières complètes
- Dashboard Workers pour gestion des tâches
- Agents IA déployables facilement par les clients
- Technologie de pointe (pas de générique)

### Critères de Succès
- ✅ Adhésion clients forte
- ✅ Retours positifs constants
- ✅ Démystification des agents IA
- ✅ Effet bouche à oreille
- ✅ Tout fonctionne parfaitement

## 📁 ARCHITECTURE DU PROJET

```
Li-Lo/
├── app/                       # Next.js App Router
│   ├── (auth)/               # Auth routes (login/register)
│   ├── (dashboard)/          # Dashboard routes
│   │   ├── ceo/             # CEO Dashboard
│   │   └── worker/          # Worker Dashboard
│   ├── api/                 # API routes
│   └── globals.css
├── components/              # Composants réutilisables
│   ├── ui/                 # shadcn/ui components
│   ├── dashboard/          # Dashboard components
│   ├── agents/             # AI Agent components
│   └── layout/
├── lib/                    # Utilitaires et configs
│   ├── db.ts              # Prisma client
│   ├── auth.ts            # Auth configuration
│   ├── agents/            # AI Agent core logic
│   └── utils.ts
├── prisma/                # Database schema
├── stores/                # Zustand stores
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript definitions
```

## 🎯 STANDARDS DE CODE STRICTS

### TypeScript Strict Mode
```typescript
// TOUJOURS typer explicitement
const fetchUser = async (id: string): Promise<User> => {
  const { data } = await api.get<User>(`/users/${id}`)
  return data
}

// Custom hooks pour logique réutilisable
const useApiData = <T>(url: string) => {
  return useQuery<T>({
    queryKey: [url],
    queryFn: () => api.get<T>(url).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  })
}
```

### Anti-Patterns INTERDITS
```typescript
// ❌ JAMAIS de any
const bad = (data: any) => { }

// ❌ JAMAIS de logique métier dans les composants
// Utiliser des custom hooks ou services à la place

// ❌ JAMAIS de fonctions > 20 lignes sans décomposition
```

## 🚀 TEMPLATES DE PROMPTS OPTIMISÉS

### Création de Feature Complète
```
Think hard about creating this feature:

FEATURE: [nom de la feature]
OBJECTIF: [but précis]
UTILISATEURS: [CEO/Worker/Client]

PLAN:
1. Analyser les besoins et contraintes
2. Définir les types TypeScript
3. Créer les composants UI
4. Implémenter les API routes
5. Ajouter la validation Zod
6. Créer les tests
7. Intégrer au dashboard approprié

REQUIREMENTS:
- TypeScript strict
- Responsive design (mobile-first)
- Accessibility (ARIA)
- Performance optimisée
- Tests complets
```

### Debugging
```
Analyse ce bug step-by-step:

BUG: [description]
ERREUR: [message exact]
CONTEXTE: [environnement, étapes pour reproduire]

DIAGNOSTIC:
1. Analyse de l'erreur
2. Cause racine
3. Impact
4. Solutions possibles
5. Implémentation du fix
6. Tests préventifs
```

## 🔒 SÉCURITÉ & VALIDATION

### Validation Zod Systématique
```typescript
export const userSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe trop court'),
  name: z.string().min(2, 'Nom requis'),
})

export const apiResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    data: dataSchema,
    success: z.boolean(),
    message: z.string().optional(),
  })
```

### Error Handling Global
```typescript
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}
```

## 📊 MÉTRIQUES & KPIs

### Performance Obligatoire
```
PERFORMANCE:
- First Contentful Paint < 1.2s
- Largest Contentful Paint < 2.5s
- Time to Interactive < 3.8s
- Bundle size < 200KB (gzipped)

QUALITÉ CODE:
- Test coverage > 80%
- TypeScript strict errors = 0
- ESLint errors = 0
- Lighthouse score > 90
```

## 🎖️ PRINCIPES ESSENTIELS

### À CHAQUE INTERACTION
1. **Think Hard** - Comprendre le problème en profondeur
2. **Plan First** - Architecture avant implémentation
3. **Code Right** - Production-ready dès le premier coup
4. **Test Always** - Coverage complète
5. **Document Smart** - Documentation nécessaire uniquement

### Philosophie Li-Lo
- **Excellence technique** : Pointe de la technologie
- **Simplicité d'utilisation** : Accessible à tous
- **Fiabilité absolue** : Tout doit fonctionner à 100%
- **Innovation continue** : Pas de solutions génériques
- **Client-centric** : Adhésion et satisfaction maximales

## 🚨 COMMANDES ESSENTIELLES

```bash
# Développement
npm run dev              # Lance le serveur de dev
npm run build            # Build de production
npm run lint             # Lint et fix automatique
npm run type-check       # Vérification TypeScript

# Database
npm run db:push          # Push schema to DB
npm run db:studio        # Ouvre Prisma Studio
npm run db:migrate       # Crée une migration

# Tests
npm test                 # Tests en mode watch
npm run test:ci          # Tests avec coverage

# Production
npm start                # Lance en production
```

---

## 🛒 SPÉCIFICATIONS E-COMMERCE SNEAKER "DROP" (Extension du Projet)

### Business Model E-Commerce
- **Plateforme** : E-commerce sneakers ultra exclusifs via système de **drops périodiques**
- **Sourcing** : Intégration API StockX (librairie stockx-api JS) pour images, prix, modèles, tailles
- **Monétisation** : Vente de sneakers rares + système de membership multi-niveaux

### Système de Membership Ultra-Exclusif
```yaml
Niveaux:
  Bronze:
    - Accès: Drops standards
    - Prix: Standard pricing

  Silver:
    - Accès: Drops Silver + Bronze
    - Perks: Early access, codes promo, offres spéciales

  Gold:
    - Accès: Drops Gold/Platinum ultra exclusifs
    - Perks: Invitations VIP, events privés, pre-releases

Gestion:
  - Auth: JWT avec roles (level, expiration, perks)
  - Paiement: Stripe (one-time + recurring subscriptions)
  - Accès gated: Restriction par niveau de membership
```

### Architecture E-Commerce Frontend

#### Pages Principales
```typescript
// Pages obligatoires pour l'e-commerce
/                          // Hero, derniers drops, timer suspense
/produits                  // Gallery haute déf, pricing par pointure
/produits/[id]            // Détail produit, sélecteur tailles
/drops                    // Calendrier drops, filtres exclusivité
/membership               // Upgrade/downgrade membership
/checkout                 // Stripe checkout
/(auth)/login             // Authentification
/(auth)/register          // Inscription
/(dashboard)/client       // Commandes, historique, notifications
/(dashboard)/worker       // Gestion stock LIVE
/(dashboard)/ceo          // Analytics Shopify-style
```

#### Fonctionnalités Produit
```typescript
// Sélecteur de pointures avec conversion EU/US
const sizeConverter = {
  EU: { 37: 'US 5.5-6 (M) / 6.5-7 (F)', 38: 'US 6-6.5 (M) / 7.5-8 (F)', /* ... */ 47: 'US 14 (M/F)' }
}

// Auto sold-out si stock = 0
const checkStock = (productId: string, size: string) => {
  const stock = getStock(productId, size)
  return { available: stock > 0, stock, soldOut: stock === 0 }
}
```

### Backend E-Commerce Stack

#### Intégration StockX API
```typescript
// lib/stockx-api.ts
import StockX from 'stockx-api'

export const syncStockXProducts = async () => {
  // Import batch: images, noms, modèles, prix
  // Update automatique stock et pricing
}

export const updateProductPricing = async (productId: string) => {
  // Real-time price sync depuis StockX
}
```

#### Gestion Stock en Temps Réel
```typescript
// API Routes obligatoires
POST   /api/stock/add        // Worker: Ajouter paires
PUT    /api/stock/update     // Worker: Modifier stock
DELETE /api/stock/remove     // Worker: Supprimer paires
GET    /api/stock/[id]       // Status stock + sold-out flag
POST   /api/stock/sync       // Sync StockX automatique

// Auto flag sold-out
const handlePurchase = async (productId: string, size: string) => {
  await decrementStock(productId, size)
  const remaining = await getStock(productId, size)
  if (remaining === 0) {
    await flagSoldOut(productId, size)
  }
}
```

#### Stripe Integration E-Commerce
```typescript
// lib/stripe-ecommerce.ts
export const stripeConfig = {
  // Paiement produit one-time
  productCheckout: (productId: string, price: number) => {},

  // Abonnement membership
  membershipSubscription: (tier: 'bronze' | 'silver' | 'gold') => {},

  // Webhook handlers
  onPaymentSuccess: () => {
    // Décrémentation stock
    // Update dashboard CEO
    // Email confirmation
  }
}
```

### Dashboard CEO E-Commerce (KPIs Shopify-Style)

```typescript
// Métriques obligatoires
interface CEODashboardMetrics {
  // Revenue
  revenue: {
    total: number
    byDrop: Record<string, number>
    byPeriod: Record<string, number>
    avgOrderValue: number
  }

  // Sales
  sales: {
    totalOrders: number
    conversionRate: number  // visiteurs → acheteurs
    bestProducts: Array<{ id: string; sales: number }>
    bestSizes: Array<{ size: string; sales: number }>
  }

  // Membership
  membership: {
    byTier: { bronze: number; silver: number; gold: number }
    lifetimeValue: Record<string, number>
    churnRate: number
  }

  // Stock
  stock: {
    remaining: Record<string, Record<string, number>>  // produit → taille → qty
    soldOutRate: number
    popularityScore: Record<string, number>
  }

  // Traffic
  traffic: {
    sources: Record<string, number>  // organic, ads, social
    attribution: Record<string, number>
    newVsReturning: { new: number; returning: number }
  }

  // Performance
  performance: {
    refundRate: number
    returnRate: number
    revenuePerCampaign: Record<string, number>
  }
}
```

### Tableau Conversion Pointures (EU/US)

```typescript
// lib/size-conversion.ts
export const sizeChart = {
  // EU → US Men / US Women
  37: { men: '5.5-6', women: '6.5-7' },
  38: { men: '6-6.5', women: '7.5-8' },
  39: { men: '7-7.5', women: '8.5-9' },
  40: { men: '7.5-8', women: '9-9.5' },
  41: { men: '8-8.5', women: '9.5-10' },
  42: { men: '9-9.5', women: '10.5-11' },
  43: { men: '10-10.5', women: '11-11.5' },
  44: { men: '11-11.5', women: '12-12.5' },
  45: { men: '12-12.5', women: '13' },
  46: { men: '13', women: '13.5' },
  47: { men: '14', women: '14' }
} as const
```

### Processus E-Commerce Premium

```
FLOW D'ACHAT:
1. Sélection produit → Choix pointure (EU avec conversion US dynamique)
2. Vérification membership → Accès gated selon tier
3. Checkout Stripe → Validation paiement
4. Décrémentation stock (-1) → Flag sold-out si stock = 0
5. Update dashboard CEO en temps réel
6. Email confirmation + tracking
7. Notification push si membre premium
```

### Notifications & Alerts
```typescript
// lib/notifications.ts
export const notificationSystem = {
  // Drop alerts
  dropAlert: (userId: string, dropId: string) => {
    // Email + push notification
  },

  // Sold out flash
  soldOutAlert: (productId: string) => {
    // Alerte instantanée membres concernés
  },

  // Exclusive member news
  memberNews: (tier: 'bronze' | 'silver' | 'gold', news: string) => {
    // Newsletter segmentée par tier
  }
}
```

### API Externe Requises
```yaml
APIs:
  StockX:
    - URL: Via stockx-api npm package
    - Usage: Import sneakers data (images, prix, modèles)
    - Sync: Batch automatique ou real-time

  Stripe:
    - Checkout: One-time payment + subscriptions
    - Webhooks: payment_succeeded, subscription_updated
    - Security: Signature validation obligatoire
```

### Prompts Claude pour E-Commerce
```
Template description produit:
"Génère une description unique pour [MODÈLE SNEAKER] drop [NIVEAU], 150 mots max, ton punchy et premium, optimisée SEO sneakers, sans phrases génériques. Inclus histoire du modèle, exclusivité du drop, et call-to-action urgent."

Template email drop:
"Crée un email de notification drop exclusif [NIVEAU] pour [MODÈLE], ton VIP, timer countdown, lien direct checkout, rappel des avantages membership."
```

---

**RAPPEL CONSTANT** : Ce projet doit être à la pointe de la technologie. Pas de compromis sur la qualité. Chaque feature doit être parfaite, testée, et déployable. L'objectif est de créer LA référence en matière d'agents IA ET d'e-commerce premium.