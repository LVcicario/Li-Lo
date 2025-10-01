# 🎯 ROADMAP ULTRA-DÉTAILLÉE - OBJECTIF 100% FONCTIONNEL

**Date**: 2025-10-01
**Objectif**: Atteindre 100% de fonctionnalité E-Commerce
**État actuel**: Vérifications nécessaires

---

## 🚨 PROBLÈMES IDENTIFIÉS

### ❌ Manquements Critiques
1. **Pages Produits**: Vérifier que les 36 produits ont chacun leur page
2. **Conversion Devise**: EUR/USD non implémentée
3. **Prix StockX**: Synchronisation non active
4. **Traduction**: FR/EN non configurée
5. **Stock Réel**: Actuellement aléatoire, doit être 1-5 par chaussure
6. **Sélection Pointure**: Vérifier fonctionnalité
7. **Déduction Stock**: Vérifier après paiement

---

## 📋 PLAN D'ACTION DÉTAILLÉ

### PHASE 1: AUDIT COMPLET (30 min)
```
□ 1.1 Vérifier les 36 produits en base
□ 1.2 Tester chaque page produit (/sneakers/[id])
□ 1.3 Lister les pages manquantes
□ 1.4 Vérifier les stocks actuels
□ 1.5 Tester le sélecteur de pointure
□ 1.6 Vérifier la déduction de stock
```

### PHASE 2: PAGES PRODUITS (1h)
```
□ 2.1 Créer route dynamique /sneakers/[id]
□ 2.2 Implémenter getServerSideProps pour data
□ 2.3 Afficher toutes les infos produit
□ 2.4 Galerie d'images fonctionnelle
□ 2.5 Sélecteur de tailles EU 37-47
□ 2.6 Bouton "Add to Cart" fonctionnel
```

### PHASE 3: CONVERSION DEVISE (45 min)
```
□ 3.1 Créer hook useCurrency()
□ 3.2 Taux de change EUR/USD (1 EUR = 1.10 USD)
□ 3.3 Toggle EUR/USD dans header
□ 3.4 Formatter les prix dynamiquement
□ 3.5 Sauvegarder préférence utilisateur
□ 3.6 Appliquer dans Cart et Checkout
```

### PHASE 4: SYNCHRONISATION STOCKX (1h)
```
□ 4.1 Créer lib/stockx-sync.ts
□ 4.2 API endpoint /api/stockx/sync
□ 4.3 Mapper produits Li-Lo ↔ StockX
□ 4.4 Update prix temps réel
□ 4.5 Cron job quotidien
□ 4.6 Fallback si API down
```

### PHASE 5: TRADUCTION FR/EN (1h)
```
□ 5.1 Installer next-i18next
□ 5.2 Créer locales/fr.json et en.json
□ 5.3 Hook useTranslation()
□ 5.4 Toggle langue dans header
□ 5.5 Traduire toutes les pages
□ 5.6 Traduire descriptions produits
```

### PHASE 6: STOCK RÉEL (45 min)
```
□ 6.1 Script SQL update stock 1-5 aléatoire
□ 6.2 Vérifier tous les variants (474)
□ 6.3 Certains tailles = 0 (sold out)
□ 6.4 Update dashboards avec vrais stocks
□ 6.5 Alertes low stock (< 2)
□ 6.6 Badge "Last pairs" si stock = 1
```

### PHASE 7: SÉLECTEUR POINTURE (30 min)
```
□ 7.1 Component SizeSelector.tsx
□ 7.2 Conversion EU → US Men/Women
□ 7.3 Afficher stock par taille
□ 7.4 Désactiver si stock = 0
□ 7.5 Animation sélection
□ 7.6 Guide des tailles modal
```

### PHASE 8: DÉDUCTION STOCK (45 min)
```
□ 8.1 Webhook Stripe checkout.completed
□ 8.2 Transaction SQL atomique
□ 8.3 Décrémenter variant exact
□ 8.4 Log stock_movements
□ 8.5 Email confirmation stock
□ 8.6 Rollback si erreur
```

### PHASE 9: TESTS COMPLETS (1h)
```
□ 9.1 Parcours complet achat
□ 9.2 Vérifier stock avant/après
□ 9.3 Tester sold out
□ 9.4 Multi-devise checkout
□ 9.5 Multi-langue navigation
□ 9.6 Performance < 3s
```

---

## 🔍 VÉRIFICATIONS DÉTAILLÉES

### 1. CHAQUE PRODUIT DOIT AVOIR:
```typescript
interface ProductComplete {
  id: string
  name: string                    // ✓ Nom exact
  brand: string                   // ✓ Nike, Adidas, etc.
  model: string                   // ✓ Air Max 1, Yeezy 350
  colorway: string               // ✓ "Black/White"
  retail_price: number           // ✓ Prix original
  current_price: number          // ✓ Prix StockX sync
  images: string[]               // ✓ Min 4 images
  sizes: {
    eu: number                   // ✓ 37-47
    us_men: string              // ✓ "7.5"
    us_women: string            // ✓ "9"
    stock: number               // ✓ 0-5 réel
  }[]
  description_fr: string         // ✓ Français
  description_en: string         // ✓ English
  release_date: Date            // ✓ Date sortie
  sku: string                   // ✓ Code produit
}
```

### 2. FLUX D'ACHAT COMPLET:
```
1. Homepage → Voir collections
2. /sneakers → 36 produits affichés
3. Filtres: Marque, Prix, Pointure, Disponibilité
4. Click produit → /sneakers/[id]
5. Sélection pointure (EU avec conversion US)
6. Vérification stock temps réel
7. Add to cart → Animation
8. /cart → Quantité, total, devise
9. Apply code promo
10. /checkout → Stripe form
11. Paiement → Déduction stock
12. /success → Confirmation
13. Email reçu
14. Stock -1 en DB
```

### 3. PRIX STOCKX MAPPING:
```javascript
const stockxMapping = {
  "nike-sb-dunk-travis": "Travis-Scott-x-Nike-SB-Dunk-Low",
  "jordan-1-retro-high": "Air-Jordan-1-Retro-High-OG",
  "yeezy-350-v2": "Adidas-Yeezy-Boost-350-V2",
  // ... 36 mappings
}

// Update quotidien des prix
async function syncPrices() {
  for (const [ourId, stockxId] of Object.entries(stockxMapping)) {
    const price = await fetchStockXPrice(stockxId)
    await updateProductPrice(ourId, price)
  }
}
```

### 4. CONVERSION DEVISE:
```typescript
// lib/currency.ts
const rates = {
  EUR: 1.00,
  USD: 1.10,
  GBP: 0.86
}

export function convertPrice(price: number, from: 'EUR', to: 'USD' | 'GBP') {
  return (price / rates[from]) * rates[to]
}

// Component
const FormattedPrice = ({ price, currency }) => {
  const converted = convertPrice(price, 'EUR', currency)
  return <span>{currency === 'EUR' ? '€' : '$'}{converted.toFixed(2)}</span>
}
```

### 5. TRADUCTION:
```json
// locales/fr.json
{
  "products": {
    "add_to_cart": "Ajouter au panier",
    "select_size": "Sélectionner la pointure",
    "in_stock": "En stock",
    "sold_out": "Épuisé",
    "last_pairs": "Dernières paires"
  }
}

// locales/en.json
{
  "products": {
    "add_to_cart": "Add to cart",
    "select_size": "Select size",
    "in_stock": "In stock",
    "sold_out": "Sold out",
    "last_pairs": "Last pairs"
  }
}
```

---

## ✅ CRITÈRES DE SUCCÈS

### Obligatoire pour 100%:
- [ ] 36 pages produits accessibles
- [ ] Chaque produit a min 4 images
- [ ] Sélecteur pointure fonctionne
- [ ] Stock réel 1-5 par chaussure
- [ ] Stock = 0 → "Sold Out"
- [ ] Paiement déduit le stock
- [ ] Conversion EUR/USD
- [ ] Traduction FR/EN
- [ ] Prix synchronisés StockX
- [ ] Temps chargement < 3s

### Tests de validation:
```bash
# 1. Vérifier tous les produits
curl http://localhost:3001/api/products | grep -c "id"
# Doit retourner: 36

# 2. Tester une page produit
curl http://localhost:3001/sneakers/1

# 3. Vérifier le stock
SELECT COUNT(*) FROM product_variants WHERE stock > 0;
# Doit avoir des stocks entre 1-5

# 4. Test achat complet
- Choisir produit
- Sélectionner taille
- Payer avec 4242...
- Vérifier stock -1
```

---

## 🚀 COMMANDES D'EXÉCUTION

### Étape 1: Update stocks réels
```sql
-- Mettre stocks aléatoires 1-5
UPDATE product_variants
SET stock = FLOOR(RANDOM() * 5) + 1
WHERE stock > 0;

-- Quelques tailles sold out
UPDATE product_variants
SET stock = 0
WHERE id IN (
  SELECT id FROM product_variants
  ORDER BY RANDOM()
  LIMIT 50
);
```

### Étape 2: Créer pages dynamiques
```typescript
// app/sneakers/[id]/page.tsx
export default async function ProductPage({ params }) {
  const product = await getProduct(params.id)
  return <ProductDetail product={product} />
}
```

### Étape 3: Tester le flow complet
```bash
npm run dev
# 1. Aller sur http://localhost:3001/sneakers
# 2. Cliquer sur un produit
# 3. Sélectionner taille
# 4. Add to cart
# 5. Checkout
# 6. Payer
# 7. Vérifier stock
```

---

## ⏱️ TIMELINE

**Temps total estimé**: 6-7 heures

1. **Phase 1-2**: 1h30 - Pages produits
2. **Phase 3**: 45min - Conversion devise
3. **Phase 4**: 1h - Sync StockX
4. **Phase 5**: 1h - Traduction
5. **Phase 6-8**: 2h - Stock et déduction
6. **Phase 9**: 1h - Tests

---

## 🎯 RÉSULTAT ATTENDU

### Dashboard Final:
- ✅ 36 produits avec pages individuelles
- ✅ Stock réel 1-5 par chaussure/taille
- ✅ Conversion EUR/USD fonctionnelle
- ✅ Traduction FR/EN complète
- ✅ Prix synchronisés avec StockX
- ✅ Déduction stock après paiement
- ✅ Sélecteur pointure avec disponibilité
- ✅ 100% E-commerce fonctionnel

---

**DÉBUT IMMÉDIAT DE L'IMPLÉMENTATION**