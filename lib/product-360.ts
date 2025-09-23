import { createClient } from '@/lib/supabase/client'

export interface Product360Image {
  id: string
  url: string
  viewAngle: number
  sortOrder: number
}

export interface ProductImageData {
  mainImage: string
  galleryImages: string[]
  images360: Product360Image[]
  has360View: boolean
}

// Récupérer toutes les images d'un produit organisées par type
export async function getProductImages(productId: string): Promise<ProductImageData> {
  const supabase = createClient()

  try {
    const { data: images, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching product images:', error)
      return {
        mainImage: '',
        galleryImages: [],
        images360: [],
        has360View: false
      }
    }

    if (!images || images.length === 0) {
      return {
        mainImage: '',
        galleryImages: [],
        images360: [],
        has360View: false
      }
    }

    // Séparer les images par type
    const mainImage = images.find(img => img.is_primary)?.url || images[0]?.url || ''

    const galleryImages = images
      .filter(img => img.image_type === 'gallery' || (img.image_type === 'primary' && !img.is_360_sequence))
      .map(img => img.url)

    const images360 = images
      .filter(img => img.is_360_sequence === true)
      .map(img => ({
        id: img.id,
        url: img.url,
        viewAngle: img.view_angle || 0,
        sortOrder: img.sort_order || 0
      }))
      .sort((a, b) => a.viewAngle - b.viewAngle) // Trier par angle de vue

    return {
      mainImage,
      galleryImages,
      images360,
      has360View: images360.length > 0
    }

  } catch (error) {
    console.error('Error in getProductImages:', error)
    return {
      mainImage: '',
      galleryImages: [],
      images360: [],
      has360View: false
    }
  }
}

// Récupérer seulement les images 360° d'un produit
export async function get360Images(productId: string): Promise<Product360Image[]> {
  const supabase = createClient()

  try {
    const { data: images, error } = await supabase
      .rpc('get_product_360_images', { product_uuid: productId })

    if (error) {
      console.error('Error fetching 360 images:', error)
      return []
    }

    return images?.map((img: any) => ({
      id: img.id,
      url: img.url,
      viewAngle: img.view_angle || 0,
      sortOrder: img.sort_order || 0
    })) || []

  } catch (error) {
    console.error('Error in get360Images:', error)
    return []
  }
}

// Vérifier si un produit a des images 360°
export async function hasProduct360Images(productId: string): Promise<boolean> {
  const supabase = createClient()

  try {
    const { data: count, error } = await supabase
      .rpc('count_360_images', { product_uuid: productId })

    if (error) {
      console.error('Error checking 360 images:', error)
      return false
    }

    return (count || 0) > 0

  } catch (error) {
    console.error('Error in hasProduct360Images:', error)
    return false
  }
}

// Récupérer les produits avec support 360°
export async function getProductsWith360Support() {
  const supabase = createClient()

  try {
    const { data: products, error } = await supabase
      .from('products_with_image_stats')
      .select('*')
      .gt('images_360_count', 0)
      .order('base_price', { ascending: false })

    if (error) {
      console.error('Error fetching products with 360 support:', error)
      return []
    }

    return products || []

  } catch (error) {
    console.error('Error in getProductsWith360Support:', error)
    return []
  }
}