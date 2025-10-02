// Service centralisé pour récupérer les vraies données produits de Supabase
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Product {
  id: string
  name: string
  brand: string
  category: 'grail' | 'exclusive' | 'limited' | 'rare'
  price: number
  resaleValue: number
  description: string
  story: string
  images: string[]
  featured: boolean
  stock: number
  rarity: {
    rating: number
  }
  valueTrend: {
    percentage: number
  }
}

// Récupérer les produits featured pour la landing page
export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        base_price,
        resale_value,
        description,
        story,
        in_stock,
        is_featured,
        rarity_score,
        value_trend_percentage,
        brand_id,
        category_id,
        primary_image_url
      `)
      .eq('status', 'active')
      .order('base_price', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching featured products:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      return []
    }

    // Transformer les données pour correspondre à l'interface Product
    return products?.map(p => ({
      id: p.id,
      name: p.name,
      brand: 'Nike', // Simplification temporaire
      category: (p.category_type || 'exclusive') as 'grail' | 'exclusive' | 'limited' | 'rare',
      price: p.base_price,
      resaleValue: p.resale_value || p.base_price * 1.2,
      description: p.description || '',
      story: p.story || '',
      images: p.primary_image_url ? [p.primary_image_url] : [],
      featured: p.is_featured || false,
      stock: p.in_stock ? 10 : 0,
      rarity: {
        rating: p.rarity_score || 8
      },
      valueTrend: {
        percentage: p.value_trend_percentage || 15
      }
    })) || []
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error)
    return []
  }
}

// Récupérer tous les produits
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        base_price,
        resale_value,
        description,
        story,
        in_stock,
        is_featured,
        rarity_score,
        value_trend_percentage,
        brand_id,
        category_id,
        category_type,
        primary_image_url
      `)
      .eq('status', 'active')
      .order('base_price', { ascending: false })

    if (error) {
      console.error('Error fetching all products:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      return []
    }

    return products?.map(p => ({
      id: p.id,
      name: p.name,
      brand: 'Nike', // Simplification temporaire
      category: (p.category_type || 'exclusive') as 'grail' | 'exclusive' | 'limited' | 'rare',
      price: p.base_price,
      resaleValue: p.resale_value || p.base_price * 1.2,
      description: p.description || '',
      story: p.story || '',
      images: p.primary_image_url ? [p.primary_image_url] : [],
      featured: p.is_featured || false,
      stock: p.in_stock ? 10 : 0,
      rarity: {
        rating: p.rarity_score || 8
      },
      valueTrend: {
        percentage: p.value_trend_percentage || 15
      }
    })) || []
  } catch (error) {
    console.error('Error in getAllProducts:', error)
    return []
  }
}

// Récupérer un produit par ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        base_price,
        resale_value,
        description,
        story,
        in_stock,
        is_featured,
        rarity_score,
        value_trend_percentage,
        brands!inner(name),
        categories!inner(name, slug),
        product_images!inner(url, is_primary)
      `)
      .eq('id', id)
      .single()

    if (error || !product) {
      console.error('Error fetching product by id:', error)
      return null
    }

    return {
      id: product.id,
      name: product.name,
      brand: product.brands?.name || 'UNKNOWN',
      category: mapCategory(product.categories?.slug),
      price: product.base_price,
      resaleValue: product.resale_value || product.base_price * 1.2,
      description: product.description || '',
      story: product.story || '',
      images: product.product_images
        ?.filter((img: any) => img.is_primary)
        ?.map((img: any) => img.url) || [],
      featured: product.is_featured || false,
      stock: product.in_stock ? 10 : 0,
      rarity: {
        rating: product.rarity_score || 8
      },
      valueTrend: {
        percentage: product.value_trend_percentage || 15
      }
    }
  } catch (error) {
    console.error('Error in getProductById:', error)
    return null
  }
}

// Récupérer les produits pour le showcase 3D
export async function getFeaturedForShowcase(limit: number = 3): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        base_price,
        resale_value,
        description,
        story,
        in_stock,
        is_featured,
        rarity_score,
        value_trend_percentage,
        brand_id,
        category_id,
        primary_image_url,
        category_type
      `)
      .eq('status', 'active')
      .eq('is_featured', true)
      .in('category_type', ['grail', 'exclusive'])
      .order('base_price', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching showcase products:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      return []
    }

    return products?.map(p => ({
      id: p.id,
      name: p.name,
      brand: 'Nike', // Simplification temporaire
      category: (p.category_type || 'exclusive') as 'grail' | 'exclusive' | 'limited' | 'rare',
      price: p.base_price,
      resaleValue: p.resale_value || p.base_price * 1.2,
      description: p.description || '',
      story: p.story || '',
      images: p.primary_image_url ? [p.primary_image_url] : [],
      featured: p.is_featured || false,
      stock: p.in_stock ? 10 : 0,
      rarity: {
        rating: p.rarity_score || 8
      },
      valueTrend: {
        percentage: p.value_trend_percentage || 15
      }
    })) || []
  } catch (error) {
    console.error('Error in getFeaturedForShowcase:', error)
    return []
  }
}

// Helper pour mapper les catégories
function mapCategory(slug: string): 'grail' | 'exclusive' | 'limited' | 'rare' {
  const categoryMap: { [key: string]: 'grail' | 'exclusive' | 'limited' | 'rare' } = {
    'grail': 'grail',
    'exclusive': 'exclusive',
    'limited-edition': 'limited',
    'rare': 'rare'
  }
  return categoryMap[slug] || 'limited'
}