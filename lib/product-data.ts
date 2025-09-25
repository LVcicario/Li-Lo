import { createClient } from '@/lib/supabase/client'

export interface ProductData {
  id: string
  sku: string
  name: string
  slug: string
  brand: {
    id: string
    name: string
    slug: string
  }
  category: {
    id: string
    name: string
    slug: string
  }
  model: string
  description: string
  story: string
  short_description: string
  base_price: number
  sale_price?: number
  color: string
  colorway: string
  material: string
  release_date: string
  release_year: number
  category_type: 'grail' | 'exclusive' | 'limited' | 'rare'
  is_featured: boolean
  is_exclusive: boolean
  is_limited_edition: boolean
  edition_name?: string
  total_produced?: number
  rarity_score: number
  has_authenticity_certificate: boolean
  verified_by?: string
  resale_value?: number
  value_trend_percentage?: number
  value_trend_direction?: 'up' | 'down' | 'stable'
  meta_title?: string
  meta_description?: string
  tags: string[]
  status: string
  featured_rank: number
  images: {
    id: string
    url: string
    alt_text?: string
    is_primary: boolean
    sort_order: number
  }[]
  variants: {
    id: string
    sku: string
    size: string
    size_type: string
    stock_quantity: number
    reserved_quantity: number
    price_adjustment: number
    is_active: boolean
  }[]
  total_stock: number
  in_stock: boolean
  available_sizes: string[]
  created_at: string
  updated_at: string
}

export interface ProductFilters {
  search?: string
  brands?: string[]
  categories?: string[]
  category_types?: string[]
  price_range?: [number, number]
  sizes?: string[]
  in_stock_only?: boolean
  featured_only?: boolean
}

export interface ProductSort {
  field: 'name' | 'base_price' | 'release_date' | 'rarity_score' | 'featured_rank' | 'total_stock'
  direction: 'asc' | 'desc'
}

// Fetch all products with filters and sorting
export async function getProducts(
  filters: ProductFilters = {},
  sort: ProductSort = { field: 'featured_rank', direction: 'asc' },
  limit?: number,
  offset?: number
): Promise<ProductData[]> {
  // Use the API endpoint if we're on the client side
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        console.error('Failed to fetch products from API');
        return [];
      }

      const data = await response.json();
      return data.products || [];
    } catch (apiError) {
      console.error('Error fetching products from API:', apiError);
    }
  }
    // Fallback to database if API fails
    const supabase = createClient()

    let query = supabase
      .from('products')
      .select(`
        *,
        product_images(id, url, alt_text, is_primary, sort_order)
      `)
      .eq('status', 'active')

  // Apply filters
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  // Skip brand and category filters for now since we don't have those tables
  // if (filters.brands && filters.brands.length > 0) {
  //   const brandIds = await getBrandIdsBySlug(filters.brands)
  //   query = query.in('brand_id', brandIds)
  // }

  // if (filters.categories && filters.categories.length > 0) {
  //   const categoryIds = await getCategoryIdsBySlug(filters.categories)
  //   query = query.in('category_id', categoryIds)
  // }

  if (filters.category_types && filters.category_types.length > 0) {
    query = query.in('category_type', filters.category_types)
  }

  if (filters.price_range) {
    query = query.gte('base_price', filters.price_range[0]).lte('base_price', filters.price_range[1])
  }

  if (filters.featured_only) {
    query = query.eq('is_featured', true)
  }

  // Apply sorting
  query = query.order(sort.field, { ascending: sort.direction === 'asc' })

  // Apply limit and offset
  if (limit) query = query.limit(limit)
  if (offset) query = query.range(offset, offset + (limit || 10) - 1)

  const { data: products, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  if (!products) return []

  // Transform and enhance data
  const transformedProducts: ProductData[] = products.map(product => {
    // Use stock field directly from product
    const totalStock = product.stock || 5

    // Create dummy variants with sizes
    const variants = [
      { id: `${product.id}-7`, sku: `${product.sku}-7`, size: '7', size_type: 'US', stock_quantity: totalStock > 0 ? 1 : 0, reserved_quantity: 0, price_adjustment: 0, is_active: true },
      { id: `${product.id}-8`, sku: `${product.sku}-8`, size: '8', size_type: 'US', stock_quantity: totalStock > 0 ? 1 : 0, reserved_quantity: 0, price_adjustment: 0, is_active: true },
      { id: `${product.id}-9`, sku: `${product.sku}-9`, size: '9', size_type: 'US', stock_quantity: totalStock > 0 ? 1 : 0, reserved_quantity: 0, price_adjustment: 0, is_active: true },
      { id: `${product.id}-10`, sku: `${product.sku}-10`, size: '10', size_type: 'US', stock_quantity: totalStock > 0 ? 1 : 0, reserved_quantity: 0, price_adjustment: 0, is_active: true },
      { id: `${product.id}-11`, sku: `${product.sku}-11`, size: '11', size_type: 'US', stock_quantity: totalStock > 0 ? 1 : 0, reserved_quantity: 0, price_adjustment: 0, is_active: true }
    ]

    const availableSizes = totalStock > 0 ? ['7', '8', '9', '10', '11'] : []

    let sortedImages = product.product_images
      ?.sort((a: any, b: any) => {
        if (a.is_primary && !b.is_primary) return -1
        if (!a.is_primary && b.is_primary) return 1
        return a.sort_order - b.sort_order
      }) || []

    // Use original_image_url if no images
    if (sortedImages.length === 0 && product.original_image_url) {
      sortedImages = [{
        id: 'primary',
        url: product.original_image_url,
        alt_text: product.name,
        is_primary: true,
        sort_order: 0
      }]
    }

    // Create brand and category objects
    const brand = {
      id: product.brand_id || 'nike',
      name: getBrandName(product.name),
      slug: getBrandSlug(product.name)
    }

    const category = {
      id: product.category_id || 'sneakers',
      name: 'Sneakers',
      slug: 'sneakers'
    }

    return {
      ...product,
      brand,
      category,
      variants,
      total_stock: totalStock,
      in_stock: totalStock > 0,
      available_sizes: availableSizes,
      images: sortedImages
    }
  })

  // Apply size filter if needed (after processing)
  if (filters.sizes && filters.sizes.length > 0) {
    return transformedProducts.filter(product =>
      product.variants.some((variant: any) =>
        filters.sizes!.includes(variant.size) && variant.stock_quantity > 0
      )
    )
  }

  // Apply in_stock filter if needed
  if (filters.in_stock_only) {
    return transformedProducts.filter(product => product.in_stock)
  }

  return transformedProducts
}

// Get a single product by ID or slug
export async function getProduct(idOrSlug: string): Promise<ProductData | null> {
  const supabase = createClient()

  // First try by slug (most common case)
  const { data: productBySlug, error: slugError } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(id, name, slug),
      category:categories(id, name, slug),
      images:product_images(id, url, alt_text, is_primary, sort_order),
      variants:product_variants(
        id, sku, size, size_type, stock_quantity,
        reserved_quantity, price_adjustment, is_active
      )
    `)
    .eq('status', 'active')
    .eq('slug', idOrSlug)
    .single()

  if (productBySlug && !slugError) {
    // Add fallback image if no images exist
    if (!productBySlug.images || productBySlug.images.length === 0) {
      productBySlug.images = [{
        id: 'fallback',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        alt_text: productBySlug.name || 'Product Image',
        is_primary: true,
        sort_order: 0
      }]
    }
    return transformSingleProduct(productBySlug)
  }

  // Then try by ID
  const { data: productById, error: idError } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(id, name, slug),
      category:categories(id, name, slug),
      images:product_images(id, url, alt_text, is_primary, sort_order),
      variants:product_variants(
        id, sku, size, size_type, stock_quantity,
        reserved_quantity, price_adjustment, is_active
      )
    `)
    .eq('status', 'active')
    .eq('id', idOrSlug)
    .single()

  if (productById && !idError) {
    // Add fallback image if no images exist
    if (!productById.images || productById.images.length === 0) {
      productById.images = [{
        id: 'fallback',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        alt_text: productById.name || 'Product Image',
        is_primary: true,
        sort_order: 0
      }]
    }
    return transformSingleProduct(productById)
  }

  return null
}

// Get featured products
export async function getFeaturedProducts(limit = 8): Promise<ProductData[]> {
  return getProducts(
    { featured_only: true },
    { field: 'featured_rank', direction: 'asc' },
    limit
  )
}

// Get products by category
export async function getProductsByCategory(
  categorySlug: string,
  limit?: number
): Promise<ProductData[]> {
  return getProducts(
    { categories: [categorySlug] },
    { field: 'featured_rank', direction: 'asc' },
    limit
  )
}

// Search products
export async function searchProducts(
  searchQuery: string,
  filters: Omit<ProductFilters, 'search'> = {},
  sort: ProductSort = { field: 'featured_rank', direction: 'asc' },
  limit?: number
): Promise<ProductData[]> {
  return getProducts(
    { ...filters, search: searchQuery },
    sort,
    limit
  )
}

// Get all brands
export async function getBrands() {
  // Return hardcoded brands since brands table doesn't exist yet
  return [
    { id: 'nike', name: 'Nike', slug: 'nike', is_active: true },
    { id: 'jordan', name: 'Jordan', slug: 'jordan', is_active: true },
    { id: 'adidas', name: 'Adidas', slug: 'adidas', is_active: true },
    { id: 'yeezy', name: 'Yeezy', slug: 'yeezy', is_active: true },
    { id: 'new-balance', name: 'New Balance', slug: 'new-balance', is_active: true },
    { id: 'off-white', name: 'Off-White', slug: 'off-white', is_active: true },
    { id: 'travis-scott', name: 'Travis Scott', slug: 'travis-scott', is_active: true },
    { id: 'fragment', name: 'Fragment', slug: 'fragment', is_active: true }
  ]
}

// Get all categories
export async function getCategories() {
  // Return hardcoded categories since categories table doesn't exist yet
  return [
    { id: 'sneakers', name: 'Sneakers', slug: 'sneakers', is_active: true, sort_order: 1 },
    { id: 'limited', name: 'Limited Edition', slug: 'limited', is_active: true, sort_order: 2 },
    { id: 'exclusive', name: 'Exclusive', slug: 'exclusive', is_active: true, sort_order: 3 },
    { id: 'grail', name: 'Grails', slug: 'grail', is_active: true, sort_order: 4 }
  ]
}

// Helper functions
async function getBrandIdsBySlug(slugs: string[]): Promise<string[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('brands')
    .select('id')
    .in('slug', slugs)

  return data?.map(brand => brand.id) || []
}

async function getCategoryIdsBySlug(slugs: string[]): Promise<string[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('categories')
    .select('id')
    .in('slug', slugs)

  return data?.map(category => category.id) || []
}

function transformSingleProduct(product: any): ProductData {
  const totalStock = product.variants?.reduce((sum: number, variant: any) =>
    sum + (variant.is_active ? variant.stock_quantity : 0), 0
  ) || 0

  const availableSizes = product.variants
    ?.filter((variant: any) => variant.is_active && variant.stock_quantity > 0)
    ?.map((variant: any) => variant.size) || []

  let sortedImages = product.images
    ?.sort((a: any, b: any) => {
      if (a.is_primary && !b.is_primary) return -1
      if (!a.is_primary && b.is_primary) return 1
      return a.sort_order - b.sort_order
    }) || []

  // Add fallback image if no images exist
  if (sortedImages.length === 0) {
    sortedImages = [{
      id: 'fallback',
      url: getProductImage(product.slug || product.name),
      alt_text: product.name || 'Product Image',
      is_primary: true,
      sort_order: 0
    }]
  }

  // Ensure all required fields have defaults
  return {
    ...product,
    brand: product.brand || { id: '', name: 'Unknown', slug: 'unknown' },
    category: product.category || { id: '', name: 'Sneakers', slug: 'sneakers' },
    description: product.description || `Premium ${product.name || 'sneaker'} in excellent condition.`,
    story: product.story || '',
    tags: product.tags || [],
    total_stock: totalStock,
    in_stock: totalStock > 0,
    available_sizes: availableSizes,
    images: sortedImages,
    rarity_score: product.rarity_score || 5,
    base_price: product.base_price || 150,
    variants: product.variants || []
  }
}

// Helper to get brand name from product name
function getBrandName(productName: string): string {
  const name = productName.toLowerCase()
  if (name.includes('jordan') || name.includes('air jordan')) return 'Jordan'
  if (name.includes('yeezy') || name.includes('adidas')) return 'Adidas'
  if (name.includes('nike') || name.includes('dunk') || name.includes('air max')) return 'Nike'
  if (name.includes('new balance') || name.includes('nb')) return 'New Balance'
  if (name.includes('off-white')) return 'Off-White'
  if (name.includes('travis')) return 'Travis Scott'
  if (name.includes('fragment')) return 'Fragment'
  return 'Nike'
}

// Helper to get brand slug from product name
function getBrandSlug(productName: string): string {
  return getBrandName(productName).toLowerCase().replace(/\s+/g, '-')
}

// Helper function to get appropriate product image based on slug/name
function getProductImage(identifier: string): string {
  const id = (identifier || '').toLowerCase()

  if (id.includes('jordan') && id.includes('1')) {
    return 'https://images.unsplash.com/photo-1603787081207-362bcef7c144?w=800'
  }
  if (id.includes('jordan') && id.includes('4')) {
    return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800'
  }
  if (id.includes('jordan') && id.includes('11')) {
    return 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800'
  }
  if (id.includes('yeezy')) {
    return 'https://images.unsplash.com/photo-1505784045224-1247b2b29cf3?w=800'
  }
  if (id.includes('dunk')) {
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'
  }
  if (id.includes('air-force') || id.includes('af1')) {
    return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800'
  }
  if (id.includes('travis')) {
    return 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800'
  }
  if (id.includes('off-white')) {
    return 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800'
  }

  // Default sneaker image
  return 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800'
}

// Format currency function
export function formatCurrency(amount: number, currency: 'USD' | 'EUR' = 'USD'): string {
  const rate = currency === 'EUR' ? 0.92 : 1
  const convertedAmount = amount * rate
  const symbol = currency === 'EUR' ? '€' : '$'

  return `${symbol}${convertedAmount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`
}