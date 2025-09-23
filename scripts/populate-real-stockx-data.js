const { createClient } = require('@supabase/supabase-js')

// Real StockX products with current market data (manually curated from public sources)
const REAL_STOCKX_PRODUCTS = [
  {
    name: 'Nike Dior Air Jordan 1 High',
    sku: 'CN8607-002',
    brand: 'Nike',
    description: 'The most expensive Air Jordan ever released. Limited to 13,000 pairs worldwide. Features premium Italian leather with Dior monogram pattern.',
    base_price: 8500.00, // Current StockX price
    retail_price: 2000.00,
    colorway: 'Wolf Grey/Air Dior Grey/White',
    material: 'Premium Italian leather, Dior monogram canvas',
    release_date: '2020-07-01',
    rarity_score: 10,
    category: 'Sneakers',
    image_base: 'https://images.stockx.com/360/Air-Jordan-1-Retro-High-Dior/Images/Air-Jordan-1-Retro-High-Dior/Lv2/',
    total_produced: 13000,
    collaborator: 'Dior'
  },
  {
    name: 'Travis Scott x Air Jordan 1 Low Fragment',
    sku: 'DM7866-140',
    brand: 'Nike',
    description: 'Triple collaboration between Travis Scott, Fragment Design, and Jordan Brand. Features reverse swoosh and Fragment lightning bolt.',
    base_price: 1850.00,
    retail_price: 150.00,
    colorway: 'Military Blue/Black/White',
    material: 'Premium leather with suede overlays',
    release_date: '2021-07-29',
    rarity_score: 9,
    category: 'Sneakers',
    image_base: 'https://images.stockx.com/360/Air-Jordan-1-Low-Travis-Scott-Fragment/Images/Air-Jordan-1-Low-Travis-Scott-Fragment/Lv2/',
    total_produced: 50000,
    collaborator: 'Travis Scott x Fragment Design'
  },
  {
    name: 'Off-White x Nike Air Jordan 4 Sail',
    sku: 'CV9388-100',
    brand: 'Nike',
    description: 'Virgil Abloh\'s deconstructed take on the classic Air Jordan 4. Part of "The Ten" collection with signature Off-White design elements.',
    base_price: 2200.00,
    retail_price: 200.00,
    colorway: 'Sail/Muslin/White/Black',
    material: 'Leather and mesh with Off-White branding',
    release_date: '2020-07-25',
    rarity_score: 9,
    category: 'Sneakers',
    image_base: 'https://images.stockx.com/360/Off-White-Air-Jordan-4-Sail/Images/Off-White-Air-Jordan-4-Sail/Lv2/',
    total_produced: 75000,
    collaborator: 'Off-White'
  },
  {
    name: 'Nike Air Yeezy 2 Red October',
    sku: '508214-660',
    brand: 'Nike',
    description: 'The final Nike Yeezy collaboration before Kanye moved to Adidas. Released as a surprise drop with no prior announcement.',
    base_price: 5500.00,
    retail_price: 245.00,
    colorway: 'Red October',
    material: 'Premium suede with glow-in-the-dark sole',
    release_date: '2014-02-09',
    rarity_score: 10,
    category: 'Sneakers',
    image_base: 'https://images.stockx.com/360/Nike-Air-Yeezy-2-Red-October/Images/Nike-Air-Yeezy-2-Red-October/Lv2/',
    total_produced: 15000,
    collaborator: 'Kanye West'
  },
  {
    name: 'Air Jordan 1 Retro High OG Chicago (2015)',
    sku: '555088-101',
    brand: 'Nike',
    description: 'The legendary Chicago colorway that started it all. OG high with Nike Air branding on the tongue.',
    base_price: 1800.00,
    retail_price: 160.00,
    colorway: 'White/Varsity Red-Black',
    material: 'Premium leather upper',
    release_date: '2015-05-30',
    rarity_score: 8,
    category: 'Sneakers',
    image_base: 'https://images.stockx.com/360/Air-Jordan-1-Retro-High-OG-Chicago-2015/Images/Air-Jordan-1-Retro-High-OG-Chicago-2015/Lv2/',
    total_produced: 100000,
    collaborator: null
  },
  {
    name: 'Nike SB Dunk Low Travis Scott',
    sku: 'CT5053-001',
    brand: 'Nike',
    description: 'Travis Scott\'s take on the classic SB Dunk Low featuring premium materials and unique design details.',
    base_price: 1200.00,
    retail_price: 150.00,
    colorway: 'Medium Grey/Black/Gum Light Brown',
    material: 'Premium leather and suede',
    release_date: '2020-08-26',
    rarity_score: 8,
    category: 'Sneakers',
    image_base: 'https://images.stockx.com/360/Nike-SB-Dunk-Low-Travis-Scott/Images/Nike-SB-Dunk-Low-Travis-Scott/Lv2/',
    total_produced: 80000,
    collaborator: 'Travis Scott'
  },
  {
    name: 'Adidas Yeezy Boost 350 V2 Zebra',
    sku: 'CP9654',
    brand: 'Adidas',
    description: 'One of the most iconic Yeezy colorways featuring the distinctive black and white striped pattern.',
    base_price: 320.00,
    retail_price: 220.00,
    colorway: 'White/Core Black/Red',
    material: 'Primeknit upper with Boost midsole',
    release_date: '2017-02-25',
    rarity_score: 7,
    category: 'Sneakers',
    image_base: 'https://images.stockx.com/360/Adidas-Yeezy-Boost-350-V2-Zebra/Images/Adidas-Yeezy-Boost-350-V2-Zebra/Lv2/',
    total_produced: 200000,
    collaborator: 'Kanye West'
  },
  {
    name: 'Air Jordan 11 Retro Bred (2019)',
    sku: '378037-061',
    brand: 'Nike',
    description: 'The classic "Bred" colorway of the Air Jordan 11, featuring patent leather and carbon fiber details.',
    base_price: 450.00,
    retail_price: 220.00,
    colorway: 'Black/True Red-White',
    material: 'Patent leather with mesh upper',
    release_date: '2019-12-14',
    rarity_score: 7,
    category: 'Sneakers',
    image_base: 'https://images.stockx.com/360/Air-Jordan-11-Retro-Bred-2019/Images/Air-Jordan-11-Retro-Bred-2019/Lv2/',
    total_produced: 500000,
    collaborator: null
  },
  {
    name: 'Air Jordan 4 Retro White Cement (2016)',
    sku: '840606-192',
    brand: 'Nike',
    description: 'The OG White Cement colorway with Nike Air branding, featuring the classic speckled midsole.',
    base_price: 380.00,
    retail_price: 220.00,
    colorway: 'White/Fire Red-Black-Tech Grey',
    material: 'Leather upper with mesh panels',
    release_date: '2016-02-13',
    rarity_score: 7,
    category: 'Sneakers',
    image_base: 'https://images.stockx.com/360/Air-Jordan-4-Retro-White-Cement-2016/Images/Air-Jordan-4-Retro-White-Cement-2016/Lv2/',
    total_produced: 400000,
    collaborator: null
  },
  {
    name: 'Fragment x Air Jordan 3 Retro',
    sku: 'DA3595-100',
    brand: 'Nike',
    description: 'Hiroshi Fujiwara\'s Fragment Design collaboration featuring the lightning bolt logo and premium materials.',
    base_price: 900.00,
    retail_price: 200.00,
    colorway: 'White/Black-Zen Grey',
    material: 'Premium leather with elephant print',
    release_date: '2020-09-07',
    rarity_score: 8,
    category: 'Sneakers',
    image_base: 'https://images.stockx.com/360/Fragment-Air-Jordan-3-Retro/Images/Fragment-Air-Jordan-3-Retro/Lv2/',
    total_produced: 60000,
    collaborator: 'Fragment Design'
  }
]

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mrrlohamkffxfiwspkki.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sbp_ac5f0c5cf128eb0063e6f01be7f5a963f8a05f3d'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function getBrandId(brandName) {
  const { data, error } = await supabase
    .from('brands')
    .select('id')
    .eq('name', brandName)
    .single()

  if (error || !data) {
    console.log(`Creating brand: ${brandName}`)
    const { data: newBrand, error: createError } = await supabase
      .from('brands')
      .insert({ name: brandName, slug: createSlug(brandName) })
      .select('id')
      .single()

    if (createError) throw createError
    return newBrand.id
  }

  return data.id
}

async function getCategoryId() {
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('name', 'Sneakers')
    .single()

  return data?.id
}

async function insertProduct(product) {
  console.log(`\n🏷️ Processing: ${product.name}`)

  try {
    const brandId = await getBrandId(product.brand)
    const categoryId = await getCategoryId()
    const slug = createSlug(product.name)

    // Check if product already exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('sku', product.sku)
      .single()

    if (existing) {
      console.log(`✅ Product already exists: ${product.name}`)
      return existing.id
    }

    // Insert product with all required fields
    const { data: newProduct, error: productError } = await supabase
      .from('products')
      .insert({
        name: product.name,
        slug: slug,
        sku: product.sku,
        brand_id: brandId,
        category_id: categoryId,
        description: product.description,
        base_price: product.base_price,
        colorway: product.colorway,
        material: product.material,
        release_date: product.release_date,
        rarity_score: product.rarity_score,
        is_limited_edition: true,
        is_exclusive: product.rarity_score >= 9,
        total_produced: product.total_produced,
        source: 'stockx_real',
        metadata: {
          stockx_sku: product.sku,
          retail_price_usd: product.retail_price,
          collaborator: product.collaborator,
          has_360_view: true
        },
        original_image_url: `${product.image_base}img000.jpg`,
        status: 'active'
      })
      .select('id')
      .single()

    if (productError) throw productError

    console.log(`✅ Inserted product: ${product.name}`)

    // Add 360° images (24 angles = 15° each)
    console.log(`📷 Adding 360° images...`)
    const imageInserts = []
    for (let i = 0; i < 24; i++) {
      const angle = i * 15
      const imageNumber = String(i).padStart(3, '0')
      imageInserts.push({
        product_id: newProduct.id,
        image_type: 'gallery',
        url: `${product.image_base}img${imageNumber}.jpg`,
        sort_order: i + 1,
        is_360_sequence: true,
        view_angle: angle,
        is_primary: i === 0
      })
    }

    const { error: imageError } = await supabase
      .from('product_images')
      .insert(imageInserts)

    if (imageError) throw imageError
    console.log(`✅ Added 24 × 360° images`)

    // Add size variants with realistic stock
    console.log(`👟 Adding size variants...`)
    const sizes = ['US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 11.5', 'US 12', 'US 13']
    const sizeInserts = sizes.map(size => {
      // Higher prices = lower stock
      const baseStock = product.base_price > 2000 ? 1 : product.base_price > 1000 ? 2 : 3
      const stockVariation = Math.floor(Math.random() * 2)
      const stock = Math.max(1, baseStock + stockVariation)

      return {
        product_id: newProduct.id,
        sku: `${product.sku}-${size.replace(' ', '-')}`,
        size: size,
        size_type: 'US',
        stock_quantity: stock,
        reserved_quantity: 0,
        price_adjustment: 0,
        is_active: true
      }
    })

    const { error: variantError } = await supabase
      .from('product_variants')
      .insert(sizeInserts)

    if (variantError) throw variantError
    console.log(`✅ Added ${sizes.length} size variants`)

    return newProduct.id

  } catch (error) {
    console.error(`❌ Error processing ${product.name}:`, error.message)
    return null
  }
}

async function main() {
  console.log('🚀 Starting real StockX data population...\n')

  let successCount = 0
  let failCount = 0

  for (const product of REAL_STOCKX_PRODUCTS) {
    const result = await insertProduct(product)
    if (result) {
      successCount++
    } else {
      failCount++
    }

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(`\n🎯 Population complete!`)
  console.log(`✅ Successfully processed: ${successCount} products`)
  console.log(`❌ Failed: ${failCount} products`)

  // Verify the data
  console.log(`\n🔍 Verifying data...`)
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      name,
      base_price,
      sku,
      product_images!inner(count),
      product_variants!inner(count)
    `)
    .eq('source', 'stockx_real')

  if (products) {
    console.log(`\n📊 Database verification:`)
    products.forEach(product => {
      console.log(`${product.name}: $${product.base_price} | ${product.product_images[0]?.count || 0} images | ${product.product_variants[0]?.count || 0} sizes`)
    })
  }
}

main().catch(console.error)