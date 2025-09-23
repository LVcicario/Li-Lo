const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase client
const supabaseUrl = 'https://mrrlohamkffxfiwspkki.supabase.co';
const supabaseKey = 'sbp_ac5f0c5cf128eb0063e6f01be7f5a963f8a05f3d';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration
const BATCH_SIZE = 10;
const DELAY_BETWEEN_REQUESTS = 2000;
const MAX_PRODUCTS = 100;

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadImage(imageUrl, productId, imageIndex = 0) {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.buffer();
    const imageDir = path.join(__dirname, '../public/images/products');

    // Create directory if it doesn't exist
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }

    const fileName = `${productId}_${imageIndex}.jpg`;
    const filePath = path.join(imageDir, fileName);

    fs.writeFileSync(filePath, buffer);

    return `/images/products/${fileName}`;
  } catch (error) {
    console.error(`Error downloading image ${imageUrl}:`, error);
    return null;
  }
}

async function scrapeStockX() {
  const browser = await puppeteer.launch({
    headless: false, // Set to true in production
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ],
  });

  const page = await browser.newPage();

  // Set viewport and user agent
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Set extra headers
  await page.setExtraHTTPHeaders({
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  });

  let allProducts = [];

  try {
    console.log('🚀 Starting StockX scraping...');

    // Navigate to StockX sneakers page
    const sneakersUrl = 'https://stockx.com/sneakers';
    console.log(`📍 Navigating to ${sneakersUrl}`);

    await page.goto(sneakersUrl, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await delay(5000); // Wait for dynamic content to load

    // Handle cookie consent if present
    try {
      await page.click('[data-testid="gdpr-consent-accept"]', { timeout: 5000 });
      await delay(2000);
    } catch (e) {
      console.log('No cookie consent banner found');
    }

    // Scroll to load more products
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await delay(3000);
    }

    console.log('🔍 Extracting product data...');

    // Extract product data
    const products = await page.evaluate(() => {
      const productCards = document.querySelectorAll('[data-testid="ProductTileContainer"]');
      const results = [];

      productCards.forEach((card, index) => {
        try {
          // Extract product information
          const titleElement = card.querySelector('[data-testid="ProductTileTitle"]');
          const priceElement = card.querySelector('[data-testid="ProductTilePrice"]');
          const imageElement = card.querySelector('img');
          const linkElement = card.querySelector('a');

          if (titleElement && imageElement) {
            const fullTitle = titleElement.textContent.trim();
            const [brand, ...nameParts] = fullTitle.split(' ');
            const name = nameParts.join(' ');

            const product = {
              brand: brand || 'Unknown',
              name: name || fullTitle,
              fullTitle,
              price: priceElement ? parseFloat(priceElement.textContent.replace(/[^\d.,]/g, '').replace(',', '.')) || 0 : 0,
              image: imageElement.src || imageElement.dataset.src,
              url: linkElement ? linkElement.href : null,
              scraped_at: new Date().toISOString()
            };

            if (product.image && product.image.includes('http')) {
              results.push(product);
            }
          }
        } catch (error) {
          console.error('Error extracting product data:', error);
        }
      });

      return results;
    });

    console.log(`📦 Found ${products.length} products`);

    // Process products in batches
    for (let i = 0; i < Math.min(products.length, MAX_PRODUCTS); i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      console.log(`🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}...`);

      for (const product of batch) {
        try {
          // Download image
          const localImagePath = await downloadImage(product.image, `stockx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

          if (localImagePath) {
            product.local_image = localImagePath;
          }

          // Find or create brand
          const { data: brandData, error: brandError } = await supabase
            .rpc('find_or_create_brand', { brand_name: product.brand });

          if (brandError) {
            console.error('Brand creation error:', brandError);
            continue;
          }

          // Find or create category (default to 'sneakers')
          const { data: categoryData, error: categoryError } = await supabase
            .rpc('find_or_create_category', { category_name: 'Sneakers' });

          if (categoryError) {
            console.error('Category creation error:', categoryError);
            continue;
          }

          // Generate unique SKU
          const sku = `STOCKX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const slug = `${product.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${sku.split('-').pop()}`;

          // Insert product into database
          const { data: productData, error } = await supabase
            .from('products')
            .insert({
              sku: sku,
              name: product.name,
              slug: slug,
              brand_id: brandData,
              category_id: categoryData,
              description: `${product.brand} ${product.name} - Scraped from StockX`,
              base_price: product.price,
              original_image_url: product.image,
              source: 'stockx',
              source_url: product.url,
              scraped_category: 'sneakers',
              metadata: {
                full_title: product.fullTitle,
                scraped_at: product.scraped_at,
                original_price: product.price
              },
              scraped_at: new Date().toISOString(),
              featured_rank: 999, // Lower priority than existing products
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (error) {
            console.error('Database insert error:', error);
          } else {
            // Insert product image
            if (product.local_image || product.image) {
              const { error: imageError } = await supabase
                .from('product_images')
                .insert({
                  product_id: productData.id,
                  url: product.local_image || product.image,
                  original_url: product.image,
                  source: 'stockx',
                  is_primary: true,
                  alt_text: `${product.brand} ${product.name}`,
                  created_at: new Date().toISOString()
                });

              if (imageError) {
                console.error('Image insert error:', imageError);
              }
            }

            console.log(`✅ Saved: ${product.brand} ${product.name}`);
            allProducts.push(product);
          }

          await delay(1000); // Rate limiting

        } catch (error) {
          console.error(`Error processing product ${product.name}:`, error);
        }
      }

      await delay(DELAY_BETWEEN_REQUESTS);
    }

  } catch (error) {
    console.error('Scraping error:', error);
  } finally {
    await browser.close();
  }

  console.log(`🎉 Scraping completed! Total products saved: ${allProducts.length}`);

  // Save results to JSON file for backup
  const resultsFile = path.join(__dirname, `../data/stockx_scrape_${Date.now()}.json`);
  fs.writeFileSync(resultsFile, JSON.stringify(allProducts, null, 2));
  console.log(`💾 Results saved to ${resultsFile}`);

  return allProducts;
}

// Enhanced scraping with multiple pages
async function scrapeMultiplePages() {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const categories = [
    'jordan',
    'nike',
    'adidas',
    'yeezy',
    'off-white',
    'travis-scott'
  ];

  let allProducts = [];

  for (const category of categories) {
    try {
      console.log(`🏷️ Scraping category: ${category}`);

      const categoryUrl = `https://stockx.com/sneakers/${category}`;
      await page.goto(categoryUrl, { waitUntil: 'networkidle2', timeout: 60000 });

      await delay(5000);

      // Handle cookie consent
      try {
        await page.click('[data-testid="gdpr-consent-accept"]', { timeout: 5000 });
        await delay(2000);
      } catch (e) {
        // Cookie consent already handled or not present
      }

      // Scroll and load more products
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await delay(3000);
      }

      const categoryProducts = await page.evaluate(() => {
        const productCards = document.querySelectorAll('[data-testid="ProductTileContainer"]');
        const results = [];

        productCards.forEach((card) => {
          try {
            const titleElement = card.querySelector('[data-testid="ProductTileTitle"]');
            const priceElement = card.querySelector('[data-testid="ProductTilePrice"]');
            const imageElement = card.querySelector('img');
            const linkElement = card.querySelector('a');

            if (titleElement && imageElement) {
              const fullTitle = titleElement.textContent.trim();
              const [brand, ...nameParts] = fullTitle.split(' ');

              const product = {
                brand: brand || 'Unknown',
                name: nameParts.join(' ') || fullTitle,
                fullTitle,
                price: priceElement ? parseFloat(priceElement.textContent.replace(/[^\d.,]/g, '').replace(',', '.')) || 0 : 0,
                image: imageElement.src || imageElement.dataset.src,
                url: linkElement ? linkElement.href : null,
                category: window.location.pathname.split('/').pop(),
                scraped_at: new Date().toISOString()
              };

              if (product.image && product.image.includes('http')) {
                results.push(product);
              }
            }
          } catch (error) {
            console.error('Error extracting product:', error);
          }
        });

        return results;
      });

      console.log(`📦 Found ${categoryProducts.length} products in ${category}`);
      allProducts = allProducts.concat(categoryProducts);

      await delay(DELAY_BETWEEN_REQUESTS);

    } catch (error) {
      console.error(`Error scraping category ${category}:`, error);
    }
  }

  await browser.close();

  // Remove duplicates
  const uniqueProducts = allProducts.filter((product, index, self) =>
    index === self.findIndex(p => p.fullTitle === product.fullTitle)
  );

  console.log(`🎯 Found ${uniqueProducts.length} unique products total`);

  // Save to database in batches
  for (let i = 0; i < Math.min(uniqueProducts.length, MAX_PRODUCTS); i += BATCH_SIZE) {
    const batch = uniqueProducts.slice(i, i + BATCH_SIZE);

    for (const product of batch) {
      try {
        const localImagePath = await downloadImage(
          product.image,
          `stockx_${product.category}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        );

        // Find or create brand
        const { data: brandData, error: brandError } = await supabase
          .rpc('find_or_create_brand', { brand_name: product.brand });

        if (brandError) {
          console.error('Brand creation error:', brandError);
          continue;
        }

        // Find or create category
        const { data: categoryData, error: categoryError } = await supabase
          .rpc('find_or_create_category', { category_name: product.category || 'Sneakers' });

        if (categoryError) {
          console.error('Category creation error:', categoryError);
          continue;
        }

        // Generate unique SKU and slug
        const sku = `STOCKX-${product.category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const slug = `${product.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${sku.split('-').pop()}`;

        const { data: productData, error } = await supabase
          .from('products')
          .insert({
            sku: sku,
            name: product.name,
            slug: slug,
            brand_id: brandData,
            category_id: categoryData,
            description: `${product.brand} ${product.name} - Scraped from StockX`,
            base_price: product.price,
            original_image_url: product.image,
            source: 'stockx',
            source_url: product.url,
            scraped_category: product.category,
            metadata: {
              full_title: product.fullTitle,
              scraped_at: product.scraped_at,
              category: product.category,
              original_price: product.price
            },
            scraped_at: new Date().toISOString(),
            featured_rank: 999,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error('Database error:', error);
        } else {
          // Insert product image
          if (localImagePath || product.image) {
            const { error: imageError } = await supabase
              .from('product_images')
              .insert({
                product_id: productData.id,
                url: localImagePath || product.image,
                original_url: product.image,
                source: 'stockx',
                is_primary: true,
                alt_text: `${product.brand} ${product.name}`,
                created_at: new Date().toISOString()
              });

            if (imageError) {
              console.error('Image insert error:', imageError);
            }
          }

          console.log(`✅ ${product.brand} ${product.name}`);
        }

        await delay(500);

      } catch (error) {
        console.error(`Error processing ${product.name}:`, error);
      }
    }
  }

  return uniqueProducts;
}

// Run the scraper
if (require.main === module) {
  scrapeMultiplePages()
    .then(products => {
      console.log(`🏁 Scraping completed! ${products.length} products processed.`);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Scraping failed:', error);
      process.exit(1);
    });
}

module.exports = { scrapeStockX, scrapeMultiplePages, downloadImage };