# 🚀 CLAUDE.md - Configuration ULTIME pour Performance Maximale

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
5. 📝 DOCUMENT - Mise à jour documentation
```

## 🛠️ STACK TECHNIQUE & ARCHITECTURE

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
  - Framework: Next.js API Routes / Express
  - Database: PostgreSQL + Prisma ORM
  - Auth: NextAuth.js v5
  - API: REST + GraphQL (Apollo)

DevOps:
  - Deployment: Vercel / Docker
  - CI/CD: GitHub Actions
  - Monitoring: Sentry + Vercel Analytics
  - Database: Supabase / PlanetScale
```

### Architecture Obligatoire
```
src/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Route groups
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Composants réutilisables
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utilitaires et configs
│   ├── db.ts            # Database client
│   ├── auth.ts          # Auth configuration
│   ├── utils.ts         # Utilitaires
│   └── validations.ts   # Schémas Zod
├── stores/              # Zustand stores
├── hooks/               # Custom React hooks
├── types/               # Type definitions
└── __tests__/           # Tests (Jest + Testing Library)
```

## 🎯 STANDARDS DE CODE STRICTS

### TypeScript Configuration
```typescript
// tsconfig.json stricte requise
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Patterns de Code Obligatoires
```typescript
// ✅ CORRECT - Arrow functions avec types
const fetchUser = async (id: string): Promise<User> => {
  const { data } = await api.get<User>(`/users/${id}`)
  return data
}

// ✅ CORRECT - Error boundaries systematiques  
const withErrorBoundary = <T extends object>(Component: React.ComponentType<T>) =>
  (props: T) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  )

// ✅ CORRECT - Custom hooks pour logique réutilisable
const useApiData = <T>(url: string) => {
  return useQuery<T>({
    queryKey: [url],
    queryFn: () => api.get<T>(url).then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### Anti-Patterns INTERDITS
```typescript
// ❌ INTERDIT - any type
const badFunction = (data: any) => { /* ... */ }

// ❌ INTERDIT - Logique métier dans composants
const BadComponent = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users').then(/* complex logic */)
  }, [])
  // ... business logic mixed with UI
}

// ❌ INTERDIT - Fonctions > 20 lignes sans décomposition
const hugeFunctionBad = () => {
  // 50+ lines of code
}
```

## 🚀 TEMPLATES DE PROMPTS ULTRA-OPTIMISÉS

### Template Création Composant
```
Think hard about creating this React component:

COMPOSANT: [nom du composant]
FONCTION: [description précise]
PROPS: [types des props attendues]

PLAN D'IMPLÉMENTATION:
1. Analyser les besoins et contraintes
2. Définir l'interface TypeScript
3. Implémenter avec les bonnes pratiques
4. Ajouter la gestion d'erreur et loading states
5. Créer les tests unitaires
6. Documenter avec Storybook si applicable

REQUIREMENTS:
- TypeScript strict
- Responsive design (mobile-first)
- Accessibility (ARIA labels)
- Performance optimisé (React.memo si nécessaire)
- Tests avec Testing Library
- Documentation JSDoc

Implémente le composant complet avec tous les fichiers nécessaires.
```

### Template API Route
```
Think hard about creating this API endpoint:

ENDPOINT: [route]  
MÉTHODE: [GET/POST/PUT/DELETE]
FONCTION: [but de l'endpoint]

PLAN D'IMPLÉMENTATION:
1. Définir les types de request/response
2. Implémenter la validation Zod
3. Ajouter l'authentification/autorisation
4. Implémenter la logique métier
5. Gestion d'erreurs complète
6. Tests d'intégration
7. Documentation OpenAPI

REQUIREMENTS:
- Validation Zod stricte
- Error handling avec codes appropriés
- Rate limiting si nécessaire
- Logging structuré
- Tests avec Supertest
- Types partagés avec frontend

Crée l'endpoint complet avec validation, tests et types.
```

### Template Debugging
```
Analyse ce bug step-by-step:

BUG: [description du problème]
ERREUR: [message d'erreur exact]
CONTEXTE: [navigateur, environnement, étapes pour reproduire]

DIAGNOSTIC APPROFONDI:
1. Analyse de l'erreur et stack trace
2. Identification de la cause racine
3. Évaluation de l'impact
4. Solutions possibles avec pros/cons
5. Implémentation de la meilleure solution
6. Tests préventifs pour éviter régression

LIVRABLES:
- Explication claire du problème
- Fix complet avec tests
- Documentation du fix
- Prévention de bugs similaires

Résous le problème complètement avec une solution robuste.
```

### Template Optimisation Performance
```
Think harder about optimizing performance:

PROBLÈME: [description du problème de performance]
MÉTRIQUES: [temps de chargement, bundle size, etc.]
OBJECTIF: [cibles de performance]

ANALYSE PERFORMANCE:
1. Profiling détaillé (Network, Lighthouse, Bundle Analyzer)
2. Identification des goulots d'étranglement
3. Priorisation par impact vs effort
4. Implémentation des optimisations
5. Mesure des améliorations
6. Monitoring continu

OPTIMISATIONS À CONSIDÉRER:
- Code splitting et lazy loading
- Image optimization (Next/Image)
- Bundle optimization (tree-shaking)
- Caching strategies
- Database query optimization
- CDN configuration
- Compression (gzip/brotli)

Implémente les optimisations avec mesures before/after.
```

## 🔧 COMMANDES PERSONNALISÉES

### /create-feature [nom] [type]
```markdown
Crée une feature complète avec cette structure:

ÉTAPES AUTOMATIQUES:
1. Créer la structure de fichiers
2. Générer les types TypeScript
3. Implémenter les composants UI
4. Créer les API routes nécessaires
5. Ajouter la validation Zod
6. Implémenter les tests
7. Mettre à jour la navigation/routing
8. Documenter la feature

ARGUMENTS:
- nom: nom de la feature (kebab-case)
- type: crud|auth|dashboard|form|api

EXEMPLE: /create-feature user-management crud
```

### /optimize-bundle
```markdown
Optimise le bundle de l'application:

ACTIONS:
1. Analyse du bundle actuel (webpack-bundle-analyzer)
2. Identification des imports lourds
3. Implémentation du code splitting
4. Optimisation des imports
5. Configuration du tree-shaking
6. Mesure des améliorations

RÉSULTAT: Rapport d'optimisation avec métriques before/after
```

### /security-audit
```markdown
Audit de sécurité complet:

VÉRIFICATIONS:
1. Vulnérabilités npm (npm audit)
2. Configuration sécurisée
3. Validation des inputs
4. Protection CSRF/XSS
5. Headers de sécurité
6. Secrets et variables d'environnement

RÉSULTAT: Liste des vulnérabilités et fixes
```

## 📊 WORKFLOW DE DÉVELOPPEMENT

### Processus Obligatoire
```
1. ANALYSE (2 min) → Think hard about requirements
2. ARCHITECTURE (3 min) → Plan the implementation  
3. IMPLÉMENTATION (15-30 min) → Code with best practices
4. TESTS (5-10 min) → Comprehensive testing
5. DOCUMENTATION (2 min) → Update relevant docs
6. COMMIT (1 min) → Atomic commits with clear messages
```

### Commits Convention
```
feat: add user authentication system
fix: resolve login redirect issue  
perf: optimize image loading performance
refactor: extract user hooks logic
test: add integration tests for auth
docs: update API documentation
style: format code according to prettier
```

## ⚡ OPTIMISATIONS DE PERFORMANCE

### Bundle Optimization
```typescript
// next.config.js optimisé
const nextConfig = {
  experimental: {
    optimizeCss: true,
    swcTraceProfiling: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false }
    }
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    }
    return config
  },
}
```

### Performance Monitoring
```typescript
// lib/performance.ts
export const measurePerformance = (name: string) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const start = performance.now()
      const result = await method.apply(this, args)
      const end = performance.now()
      console.log(`${name}: ${end - start}ms`)
      return result
    }
  }
}
```

## 🔒 SÉCURITÉ & BEST PRACTICES

### Validation Zod Systématique
```typescript
// lib/validations.ts
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
// lib/error-handler.ts
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

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) return error
  if (error instanceof z.ZodError) {
    return new AppError('Données invalides', 400, 'VALIDATION_ERROR')
  }
  return new AppError('Erreur serveur', 500, 'INTERNAL_ERROR')
}
```

## 📈 MÉTRIQUES & AMÉLIORATION CONTINUE

### KPIs Obligatoires
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

DÉVELOPPEMENT:
- Build time < 30s
- Hot reload < 2s
- Deployment time < 5min
```

### Monitoring Automatique
```typescript
// lib/analytics.ts
export const trackPerformance = () => {
  if (typeof window !== 'undefined') {
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Send metrics to analytics
        analytics.track('performance', {
          name: entry.name,
          duration: entry.duration,
        })
      })
    }).observe({ entryTypes: ['measure', 'navigation'] })
  }
}
```

## 🎯 CONTEXTE PROJET SPÉCIFIQUE

### Variables d'Environnement
```bash
# .env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="..."
RESEND_API_KEY="..."
```

### Scripts NPM Essentiels
```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint --fix",
    "test": "jest --watch",
    "test:ci": "jest --coverage",
    "type-check": "tsc --noEmit",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

## 🚨 RÈGLES D'URGENCE

### En Cas de Bug Critique
1. **STOP** - Ne touche plus rien
2. **ROLLBACK** - Revenir à la version stable
3. **ANALYZE** - Identifier la cause racine  
4. **FIX** - Corriger avec tests
5. **DEPLOY** - Déploiement sécurisé
6. **MONITOR** - Surveillance post-déploiement

### Checklist Pre-Commit
- [ ] Tests passent (npm run test:ci)
- [ ] Type check OK (npm run type-check)
- [ ] Lint clean (npm run lint)
- [ ] Build successful (npm run build)
- [ ] Performance check OK
- [ ] Security audit OK

## 🎖️ OBJECTIFS DE SESSION

**À CHAQUE INTERACTION, VISE L'EXCELLENCE :**
- Code production-ready dès la première itération
- Tests couvrant tous les edge cases
- Performance optimisée par défaut
- Sécurité intégrée à tous les niveaux
- Documentation à jour automatiquement

**SOUVIENS-TOI** : Tu es là pour m'aider à devenir le meilleur développeur possible. Sois exigeant sur la qualité, précis dans tes explications, et pousse-moi vers l'excellence technique.

---

*Cette configuration CLAUDE.md est optimisée pour la performance maximale et la qualité de code. Mets-la à jour régulièrement selon l'évolution du projet.*