#!/usr/bin/env node

/**
 * Script de validation automatique du site Li-Lo
 * Vérifie que toutes les pages fonctionnent et que les données sont correctes
 */

import fetch from 'node-fetch'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import chalk from 'chalk'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })

const BASE_URL = process.argv[2] || 'http://localhost:3000'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Pages à vérifier
const PAGES_TO_CHECK = [
  { path: '/', name: 'Homepage' },
  { path: '/sneakers', name: 'All Sneakers' },
  { path: '/collections', name: 'Collections' },
  { path: '/exclusive', name: 'Exclusive' },
  { path: '/limited-edition', name: 'Limited Edition' },
  { path: '/drops', name: 'Drops' },
  { path: '/membership', name: 'Membership' },
  { path: '/cart', name: 'Cart' },
  { path: '/auth/login', name: 'Login' },
  { path: '/auth/register', name: 'Register' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  { path: '/size-guide', name: 'Size Guide' },
  { path: '/authenticity', name: 'Authenticity' },
  { path: '/terms', name: 'Terms' },
  { path: '/privacy', name: 'Privacy' }
]

const log = {
  success: (msg) => console.log(chalk.green('✓'), msg),
  error: (msg) => console.log(chalk.red('✗'), msg),
  warning: (msg) => console.log(chalk.yellow('⚠'), msg),
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  title: (msg) => console.log(chalk.bold.underline(`\n${msg}\n`))
}

// Vérifier l'accessibilité des pages
async function checkPages() {
  log.title('📄 Vérification des Pages')
  let successCount = 0
  let errorCount = 0

  for (const page of PAGES_TO_CHECK) {
    try {
      const response = await fetch(`${BASE_URL}${page.path}`)
      if (response.ok) {
        log.success(`${page.name}: ${response.status} OK`)
        successCount++
      } else {
        log.error(`${page.name}: ${response.status} ${response.statusText}`)
        errorCount++
      }
    } catch (error) {
      log.error(`${page.name}: Erreur de connexion`)
      errorCount++
    }
  }

  return { successCount, errorCount, total: PAGES_TO_CHECK.length }
}

// Vérifier les prix dans la base de données
async function checkPrices() {
  log.title('💰 Vérification des Prix')

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, base_price')
      .eq('status', 'active')

    if (error) throw error

    const prices = products.map(p => p.base_price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length

    // Vérifier que les prix sont réalistes
    const unrealisticPrices = products.filter(p => p.base_price < 50 || p.base_price > 10000)

    log.info(`Nombre de produits: ${products.length}`)
    log.info(`Prix minimum: €${minPrice}`)
    log.info(`Prix maximum: €${maxPrice}`)
    log.info(`Prix moyen: €${avgPrice.toFixed(2)}`)

    if (unrealisticPrices.length > 0) {
      log.warning(`${unrealisticPrices.length} produits avec prix suspects:`)
      unrealisticPrices.forEach(p => {
        log.warning(`  - ${p.name}: €${p.base_price}`)
      })
      return { valid: false, count: products.length, unrealistic: unrealisticPrices.length }
    } else {
      log.success('Tous les prix sont réalistes (€50 - €10,000)')
      return { valid: true, count: products.length, minPrice, maxPrice, avgPrice }
    }
  } catch (error) {
    log.error(`Erreur DB: ${error.message}`)
    return { valid: false, error: error.message }
  }
}

// Vérifier les images
async function checkImages() {
  log.title('🖼️ Vérification des Images')

  try {
    const { data: images, error } = await supabase
      .from('product_images')
      .select('id, url, product_id')
      .limit(100)

    if (error) throw error

    let stockxCount = 0
    let unsplashCount = 0
    let placeholderCount = 0
    let otherCount = 0

    images.forEach(img => {
      if (img.url.includes('stockx')) stockxCount++
      else if (img.url.includes('unsplash')) unsplashCount++
      else if (img.url.includes('placeholder')) placeholderCount++
      else otherCount++
    })

    log.info(`Total images vérifiées: ${images.length}`)
    log.info(`Images StockX: ${stockxCount}`)
    if (unsplashCount > 0) log.warning(`Images Unsplash: ${unsplashCount}`)
    if (placeholderCount > 0) log.warning(`Images placeholder: ${placeholderCount}`)
    if (otherCount > 0) log.info(`Autres sources: ${otherCount}`)

    const valid = unsplashCount === 0 && placeholderCount === 0
    if (valid) {
      log.success('Toutes les images sont de sources valides')
    } else {
      log.error('Des images non valides ont été détectées')
    }

    return {
      valid,
      total: images.length,
      stockx: stockxCount,
      unsplash: unsplashCount,
      placeholder: placeholderCount
    }
  } catch (error) {
    log.error(`Erreur DB: ${error.message}`)
    return { valid: false, error: error.message }
  }
}

// Vérifier l'API
async function checkAPI() {
  log.title('🔌 Vérification de l\'API')

  try {
    const response = await fetch(`${BASE_URL}/api/products?limit=5`)
    const data = await response.json()

    if (response.ok && data.products && Array.isArray(data.products)) {
      log.success(`API fonctionnelle - ${data.products.length} produits récupérés`)

      // Vérifier la structure des données
      const product = data.products[0]
      const hasRequiredFields = product.id && product.name && product.base_price && product.images

      if (hasRequiredFields) {
        log.success('Structure des données correcte')
        return { valid: true, productCount: data.products.length }
      } else {
        log.error('Structure des données incomplète')
        return { valid: false, error: 'Missing fields' }
      }
    } else {
      log.error('API non fonctionnelle ou données invalides')
      return { valid: false, error: 'Invalid response' }
    }
  } catch (error) {
    log.error(`Erreur API: ${error.message}`)
    return { valid: false, error: error.message }
  }
}

// Vérifier les pages produits dynamiques
async function checkDynamicProductPages() {
  log.title('🛍️ Vérification des Pages Produits Dynamiques')

  try {
    // Récupérer quelques produits
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name')
      .eq('status', 'active')
      .limit(3)

    if (error) throw error

    let successCount = 0
    for (const product of products) {
      try {
        const response = await fetch(`${BASE_URL}/sneakers/${product.id}`)
        if (response.ok) {
          log.success(`Page produit: ${product.name}`)
          successCount++
        } else {
          log.error(`Page produit ${product.name}: ${response.status}`)
        }
      } catch (error) {
        log.error(`Page produit ${product.name}: Erreur`)
      }
    }

    return {
      valid: successCount === products.length,
      tested: products.length,
      successful: successCount
    }
  } catch (error) {
    log.error(`Erreur: ${error.message}`)
    return { valid: false, error: error.message }
  }
}

// Générer le rapport final
function generateReport(results) {
  log.title('📊 RAPPORT FINAL')

  const allValid = Object.values(results).every(r => r.valid !== false)

  console.log('\n' + chalk.bold('Résumé des tests:'))
  console.log('─'.repeat(50))

  // Pages
  const pagesPercent = (results.pages.successCount / results.pages.total * 100).toFixed(1)
  console.log(`Pages statiques: ${results.pages.successCount}/${results.pages.total} (${pagesPercent}%)`)

  // API
  console.log(`API: ${results.api.valid ? '✓ Fonctionnelle' : '✗ Erreur'}`)

  // Prix
  console.log(`Prix: ${results.prices.valid ? '✓ Valides' : '✗ Invalides'} (${results.prices.count} produits)`)

  // Images
  const imagesPercent = results.images.stockx ? (results.images.stockx / results.images.total * 100).toFixed(1) : 0
  console.log(`Images: ${results.images.valid ? '✓ Valides' : '✗ Problème détecté'} (${imagesPercent}% StockX)`)

  // Pages dynamiques
  console.log(`Pages produits: ${results.dynamicPages.successful}/${results.dynamicPages.tested} testées`)

  console.log('─'.repeat(50))

  if (allValid) {
    console.log('\n' + chalk.green.bold('✅ VALIDATION RÉUSSIE À 100%'))
    console.log(chalk.green('Le site est entièrement fonctionnel!'))
  } else {
    console.log('\n' + chalk.red.bold('⚠️ VALIDATION INCOMPLÈTE'))
    console.log(chalk.yellow('Des problèmes ont été détectés. Veuillez les corriger.'))
  }

  // Score global
  let score = 0
  score += results.pages.successCount / results.pages.total * 30  // 30% pour les pages
  score += results.api.valid ? 20 : 0  // 20% pour l'API
  score += results.prices.valid ? 20 : 0  // 20% pour les prix
  score += results.images.valid ? 20 : 0  // 20% pour les images
  score += results.dynamicPages.successful / results.dynamicPages.tested * 10  // 10% pour pages dynamiques

  console.log('\n' + chalk.bold(`Score de validation: ${score.toFixed(1)}%`))

  if (score === 100) {
    console.log(chalk.green('🎉 Félicitations! Le site est parfait!'))
  } else if (score >= 90) {
    console.log(chalk.green('👍 Excellent! Quelques améliorations mineures possibles.'))
  } else if (score >= 70) {
    console.log(chalk.yellow('⚠️ Bon, mais des corrections sont nécessaires.'))
  } else {
    console.log(chalk.red('❌ Des problèmes majeurs doivent être résolus.'))
  }

  return score
}

// Fonction principale
async function main() {
  console.log(chalk.bold.cyan('\n🚀 VALIDATION DU SITE LI-LO\n'))
  console.log(`URL: ${BASE_URL}`)
  console.log(`Date: ${new Date().toLocaleString()}\n`)

  const results = {
    pages: await checkPages(),
    api: await checkAPI(),
    prices: await checkPrices(),
    images: await checkImages(),
    dynamicPages: await checkDynamicProductPages()
  }

  const score = generateReport(results)

  // Sauvegarder le rapport
  const report = {
    date: new Date().toISOString(),
    url: BASE_URL,
    score,
    results
  }

  try {
    const fs = await import('fs/promises')
    await fs.writeFile(
      'validation-report.json',
      JSON.stringify(report, null, 2)
    )
    console.log('\n' + chalk.gray('Rapport sauvegardé dans validation-report.json'))
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du rapport:', error)
  }

  process.exit(score === 100 ? 0 : 1)
}

// Lancer la validation
main().catch(console.error)