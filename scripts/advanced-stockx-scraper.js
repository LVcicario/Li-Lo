const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://mrrlohamkffxfiwspkki.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycmxvaGFta2ZmeGZpd3Nwa2tpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzUwMzkwMiwiZXhwIjoyMDUzMDc5OTAyfQ.wIhL9FgKw0dCwYNXJVJVxBSJn5zGJh5YL8PROFNEzKg';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configuration du scraper avancé
const STEALTH_CONFIG = {
  headless: "new", // Mode stealth
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-blink-features=AutomationControlled',
    '--disable-dev-shm-usage',
    '--disable-web-security',
    '--disable-features=VizDisplayCompositor',
    '--window-size=1920,1080',
    '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ],
  defaultViewport: null,
  ignoreDefaultArgs: ['--enable-automation'],
};

const HEADERS = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"macOS"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

// URLs StockX par catégorie
const STOCKX_CATEGORIES = {
  jordan: 'https://stockx.com/sneakers/jordan',
  nike: 'https://stockx.com/sneakers/nike',
  adidas: 'https://stockx.com/sneakers/adidas',
  yeezy: 'https://stockx.com/sneakers/adidas/yeezy',
  'off-white': 'https://stockx.com/sneakers/nike/off-white',
  'travis-scott': 'https://stockx.com/sneakers/travis-scott',
  fragment: 'https://stockx.com/sneakers/fragment',
  'new-balance': 'https://stockx.com/sneakers/new-balance',
  dunk: 'https://stockx.com/sneakers/nike/dunk'
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fonction pour bypasser la détection anti-bot
async function setupStealthMode(page) {
  // Supprimer les traces d'automation
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });

    // Simuler des propriétés de navigateur réel
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });

    Object.defineProperty(navigator, 'languages', {
      get: () => ['fr-FR', 'fr', 'en'],
    });

    // Masquer l'automation
    window.chrome = {
      runtime: {},
    };

    // Simuler les permissions
    Object.defineProperty(navigator, 'permissions', {
      get: () => ({
        query: () => Promise.resolve({ state: 'granted' }),
      }),
    });
  });

  // Définir des headers réalistes
  await page.setExtraHTTPHeaders(HEADERS);

  // Simuler un viewport réaliste
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: true,
    isMobile: false,
  });
}

// Fonction pour télécharger les images 360°
async function download360Images(imageUrls, productId) {
  const images = [];

  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const imageUrl = imageUrls[i];
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(imageUrl);

      if (response.ok) {
        const buffer = await response.buffer();
        const imageDir = path.join(__dirname, '../public/images/products/360');

        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }

        const fileName = `${productId}_360_${i}.jpg`;
        const filePath = path.join(imageDir, fileName);

        fs.writeFileSync(filePath, buffer);
        images.push(`/images/products/360/${fileName}`);

        console.log(`📸 Downloaded 360° image ${i + 1}/${imageUrls.length} for ${productId}`);
      }
    } catch (error) {
      console.error(`❌ Error downloading image ${i}:`, error);
    }

    await delay(500); // Rate limiting
  }

  return images;
}

// Fonction principale de scraping avec contournement anti-bot
async function scrapeStockXAdvanced() {
  console.log('🚀 Starting advanced StockX scraping with stealth mode...');

  const browser = await puppeteer.launch(STEALTH_CONFIG);
  const page = await browser.newPage();

  await setupStealthMode(page);

  let allProducts = [];

  try {
    for (const [categoryName, categoryUrl] of Object.entries(STOCKX_CATEGORIES)) {
      console.log(`\n🏷️  Scraping category: ${categoryName}`);
      console.log(`📍 URL: ${categoryUrl}`);

      try {
        // Navigation avec retry logic
        let retries = 3;
        let navigationSuccessful = false;

        while (retries > 0 && !navigationSuccessful) {
          try {
            await page.goto(categoryUrl, {
              waitUntil: 'networkidle0',
              timeout: 60000
            });
            navigationSuccessful = true;
          } catch (navError) {
            console.log(`⚠️  Navigation failed, retrying... (${retries} attempts left)`);
            retries--;
            await delay(5000);
          }
        }

        if (!navigationSuccessful) {
          console.log(`❌ Failed to navigate to ${categoryName} after multiple attempts`);
          continue;
        }

        // Attendre le chargement complet
        await delay(3000);

        // Gérer les popups/cookies
        try {
          await page.click('[data-testid="gdpr-consent-accept"]', { timeout: 5000 });
          await delay(2000);
        } catch (e) {
          console.log('No GDPR popup found');
        }

        try {
          await page.click('[data-testid="modal-close"]', { timeout: 3000 });
          await delay(1000);
        } catch (e) {
          console.log('No modal to close');
        }

        // Simuler un comportement humain - scroll progressif
        console.log('🔄 Simulating human scrolling behavior...');

        for (let i = 0; i < 10; i++) {
          await page.evaluate(() => {
            window.scrollBy(0, Math.random() * 500 + 300);
          });
          await delay(1000 + Math.random() * 1000);
        }

        // Attendre que les produits se chargent
        await page.waitForSelector('[data-testid*="search-result"], [class*="product"], [class*="tile"]',
          { timeout: 30000 });

        // Extraire les données des produits avec plus de détails
        console.log('🔍 Extracting detailed product data...');

        const products = await page.evaluate((category) => {
          const productSelectors = [
            '[data-testid*="search-result"]',
            '[class*="product-tile"]',
            '[class*="ProductTile"]',
            '[data-testid*="product"]',
            '.css-1p8uela', // Sélecteur CSS spécifique StockX
            '[data-component="ProductTile"]'
          ];

          let productElements = [];

          // Essayer différents sélecteurs
          for (const selector of productSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
              productElements = Array.from(elements);
              break;
            }
          }

          console.log(`Found ${productElements.length} product elements`);

          const results = [];

          productElements.forEach((element, index) => {
            try {
              // Extraire le nom du produit
              const nameSelectors = [
                '[data-testid*="title"]',
                '[class*="title"]',
                'h3',
                'h4',
                '.name',
                '[data-testid*="name"]'
              ];

              let name = '';
              for (const selector of nameSelectors) {
                const nameEl = element.querySelector(selector);
                if (nameEl && nameEl.textContent.trim()) {
                  name = nameEl.textContent.trim();
                  break;
                }
              }

              // Extraire le prix
              const priceSelectors = [
                '[data-testid*="price"]',
                '[class*="price"]',
                '[class*="Price"]',
                '.amount'
              ];

              let price = 0;
              for (const selector of priceSelectors) {
                const priceEl = element.querySelector(selector);
                if (priceEl) {
                  const priceText = priceEl.textContent.replace(/[^\d.,]/g, '');
                  const parsedPrice = parseFloat(priceText.replace(',', '.'));
                  if (!isNaN(parsedPrice)) {
                    price = Math.round(parsedPrice);
                    break;
                  }
                }
              }

              // Extraire l'image principale
              const imageSelectors = [
                'img[src*="images.stockx.com"]',
                'img[data-src*="images.stockx.com"]',
                'img[src*="stockx"]',
                'img'
              ];

              let mainImage = '';
              let image360Array = [];

              for (const selector of imageSelectors) {
                const imgEl = element.querySelector(selector);
                if (imgEl) {
                  const imgSrc = imgEl.src || imgEl.dataset.src || imgEl.getAttribute('data-original');
                  if (imgSrc && imgSrc.includes('http')) {
                    mainImage = imgSrc;

                    // Essayer de trouver des images 360° (StockX a souvent des patterns spécifiques)
                    if (imgSrc.includes('stockx.com')) {
                      // Générer des URLs potentielles pour la vue 360°
                      const baseUrl = imgSrc.replace(/\/\d+\.jpg.*/, '');
                      for (let i = 1; i <= 8; i++) {
                        image360Array.push(`${baseUrl}/${i}.jpg`);
                      }
                    }
                    break;
                  }
                }
              }

              // Extraire le lien vers la page produit
              const linkEl = element.querySelector('a[href*="/"]');
              let productUrl = '';
              if (linkEl) {
                const href = linkEl.getAttribute('href');
                productUrl = href.startsWith('http') ? href : `https://stockx.com${href}`;
              }

              // Extraire des métadonnées supplémentaires
              const brandMatch = name.match(/^(\w+)/);
              const brand = brandMatch ? brandMatch[1] : 'Unknown';

              // Séparer le nom de la marque
              const productName = name.replace(new RegExp(`^${brand}\\s*`, 'i'), '').trim();

              if (name && mainImage && price > 0) {
                const product = {
                  brand: brand,
                  name: productName || name,
                  fullName: name,
                  price: price,
                  mainImage: mainImage,
                  images360: image360Array,
                  productUrl: productUrl,
                  category: category,
                  scrapedAt: new Date().toISOString(),

                  // Métadonnées supplémentaires
                  metadata: {
                    elementIndex: index,
                    hasMultipleImages: image360Array.length > 1,
                    categorySource: category,
                    extractionMethod: 'advanced_scraper'
                  }
                };

                results.push(product);
              }

            } catch (error) {
              console.error(`Error processing product ${index}:`, error);
            }
          });

          return results;
        }, categoryName);

        console.log(`📦 Found ${products.length} products in ${categoryName}`);

        if (products.length > 0) {
          allProducts = allProducts.concat(products);

          // Sauvegarder les données de cette catégorie
          const categoryFile = path.join(__dirname, `../data/stockx_${categoryName}_${Date.now()}.json`);
          fs.writeFileSync(categoryFile, JSON.stringify(products, null, 2));
          console.log(`💾 Saved ${categoryName} data to ${categoryFile}`);
        }

        // Délai entre les catégories pour éviter la détection
        console.log('⏳ Waiting before next category...');
        await delay(3000 + Math.random() * 2000);

      } catch (error) {
        console.error(`❌ Error scraping category ${categoryName}:`, error);
        continue;
      }
    }

  } catch (error) {
    console.error('❌ Fatal scraping error:', error);
  } finally {
    await browser.close();
  }

  // Traitement et sauvegarde des données
  console.log(`\n🎯 Total products found: ${allProducts.length}`);

  // Supprimer les doublons
  const uniqueProducts = allProducts.filter((product, index, self) =>
    index === self.findIndex(p => p.fullName === product.fullName && p.brand === product.brand)
  );

  console.log(`✨ Unique products after deduplication: ${uniqueProducts.length}`);

  // Sauvegarder toutes les données
  const allDataFile = path.join(__dirname, `../data/stockx_complete_${Date.now()}.json`);
  fs.writeFileSync(allDataFile, JSON.stringify(uniqueProducts, null, 2));
  console.log(`💾 All data saved to ${allDataFile}`);

  return uniqueProducts;
}

// Fonction pour traiter et insérer les données dans Supabase
async function processAndInsertData(products) {
  console.log(`\n🔄 Processing ${products.length} products for database insertion...`);

  let successCount = 0;
  let errorCount = 0;

  for (const product of products.slice(0, 50)) { // Limiter à 50 produits pour le test
    try {
      console.log(`\n📦 Processing: ${product.brand} ${product.name}`);

      // Télécharger les images 360°
      const images360 = [];
      if (product.images360 && product.images360.length > 0) {
        console.log(`🔄 Downloading ${product.images360.length} 360° images...`);
        const downloaded360 = await download360Images(
          product.images360.slice(0, 6), // Limiter à 6 images
          `${product.brand.toLowerCase()}-${Date.now()}`
        );
        images360.push(...downloaded360);
      }

      // Trouver ou créer la marque
      const { data: brandId, error: brandError } = await supabase
        .rpc('find_or_create_brand', { brand_name: product.brand });

      if (brandError) {
        console.error('Brand error:', brandError);
        continue;
      }

      // Trouver ou créer la catégorie
      const categoryName = product.category.charAt(0).toUpperCase() + product.category.slice(1);
      const { data: categoryId, error: categoryError } = await supabase
        .rpc('find_or_create_category', { category_name: categoryName });

      if (categoryError) {
        console.error('Category error:', categoryError);
        continue;
      }

      // Générer SKU et slug uniques
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 8);
      const sku = `STOCKX-${product.brand.toUpperCase()}-${timestamp}-${randomId}`;
      const slug = `${product.brand.toLowerCase()}-${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${randomId}`;

      // Insérer le produit
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          sku: sku,
          name: product.name,
          slug: slug,
          brand_id: brandId,
          category_id: categoryId,
          description: `${product.brand} ${product.name} - Authentic sneaker sourced from StockX marketplace`,
          base_price: product.price,
          original_image_url: product.mainImage,
          source: 'stockx_advanced',
          source_url: product.productUrl,
          scraped_category: product.category,
          metadata: {
            ...product.metadata,
            has_360_images: images360.length > 0,
            total_360_images: images360.length,
            scraped_from: 'stockx_advanced_scraper',
            full_name: product.fullName
          },
          scraped_at: product.scrapedAt,
          status: 'active',
          is_featured: Math.random() > 0.7,
          is_exclusive: product.price > 5000,
          is_limited_edition: true,
          featured_rank: Math.floor(Math.random() * 100),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published_at: new Date().toISOString()
        })
        .select()
        .single();

      if (productError) {
        console.error('Product insert error:', productError);
        errorCount++;
        continue;
      }

      // Insérer l'image principale
      if (product.mainImage) {
        await supabase
          .from('product_images')
          .insert({
            product_id: productData.id,
            url: product.mainImage,
            original_url: product.mainImage,
            source: 'stockx',
            is_primary: true,
            alt_text: `${product.brand} ${product.name}`,
            sort_order: 0,
            created_at: new Date().toISOString()
          });
      }

      // Insérer les images 360°
      for (let i = 0; i < images360.length; i++) {
        await supabase
          .from('product_images')
          .insert({
            product_id: productData.id,
            url: images360[i],
            original_url: product.images360[i] || '',
            source: 'stockx_360',
            is_primary: false,
            alt_text: `${product.brand} ${product.name} - 360° View ${i + 1}`,
            sort_order: i + 1,
            created_at: new Date().toISOString()
          });
      }

      console.log(`✅ Successfully processed: ${product.brand} ${product.name}`);
      console.log(`📸 Added ${images360.length} 360° images`);
      successCount++;

      await delay(1000); // Rate limiting

    } catch (error) {
      console.error(`❌ Error processing ${product.brand} ${product.name}:`, error);
      errorCount++;
    }
  }

  console.log(`\n🏁 Processing completed!`);
  console.log(`✅ Successfully processed: ${successCount} products`);
  console.log(`❌ Failed to process: ${errorCount} products`);

  return { successCount, errorCount };
}

// Fonction principale
async function main() {
  try {
    console.log('🚀 Starting advanced StockX scraping with 360° image support...');

    // Créer les dossiers nécessaires
    const dirs = [
      path.join(__dirname, '../data'),
      path.join(__dirname, '../public/images/products'),
      path.join(__dirname, '../public/images/products/360')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Scraper les données
    const products = await scrapeStockXAdvanced();

    if (products.length > 0) {
      // Traiter et insérer dans la base de données
      await processAndInsertData(products);
    } else {
      console.log('❌ No products found during scraping');
    }

    console.log('🎉 Advanced scraping process completed!');

  } catch (error) {
    console.error('❌ Fatal error in main process:', error);
  }
}

// Exécuter le script
if (require.main === module) {
  main()
    .then(() => {
      console.log('✅ Script execution completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Script execution failed:', error);
      process.exit(1);
    });
}

module.exports = { scrapeStockXAdvanced, processAndInsertData };