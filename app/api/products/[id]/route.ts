import { NextRequest, NextResponse } from 'next/server';
import { sneakerApi } from '@/lib/sneaker-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get sneaker from our real database
    const sneaker = await sneakerApi.getSneakerById(id);

    if (!sneaker) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get similar products
    const similar = await sneakerApi.getSimilarSneakers(id, 4);

    // Get market analytics
    const analytics = await sneakerApi.getMarketAnalytics(id);

    // Format for frontend
    const product = {
      id: sneaker.id,
      name: sneaker.name,
      slug: sneaker.id,
      sku: sneaker.sku,
      base_price: sneaker.retailPrice,
      sale_price: sneaker.marketData.lastSale,
      is_featured: sneaker.marketData.salesLast72Hours > 100,
      brand_name: sneaker.brand,
      brand: { name: sneaker.brand, slug: sneaker.brand.toLowerCase() },
      category: { name: "Sneakers", slug: "sneakers" },
      description: sneaker.description,
      story: sneaker.story,
      colorway: sneaker.colorway,
      release_date: sneaker.releaseDate,
      materials: sneaker.materials,
      images: [
        {
          url: sneaker.images.main,
          alt_text: sneaker.name,
          is_primary: true,
          sort_order: 0
        },
        {
          url: sneaker.images.side,
          alt_text: `${sneaker.name} - Side View`,
          is_primary: false,
          sort_order: 1
        },
        {
          url: sneaker.images.back,
          alt_text: `${sneaker.name} - Back View`,
          is_primary: false,
          sort_order: 2
        },
        {
          url: sneaker.images.sole,
          alt_text: `${sneaker.name} - Sole`,
          is_primary: false,
          sort_order: 3
        },
        {
          url: sneaker.images.detail,
          alt_text: `${sneaker.name} - Detail`,
          is_primary: false,
          sort_order: 4
        }
      ],
      variants: sneaker.sizes.map((size, index) => ({
        id: `var-${sneaker.id}-${index}`,
        size: size.us.toString(),
        stock_quantity: size.stock,
        price_adjustment: size.priceAdjustment,
        is_active: size.stock > 0
      })),
      total_variants: sneaker.sizes.length,
      total_stock: sneaker.sizes.reduce((sum, size) => sum + size.stock, 0),
      market_data: sneaker.marketData,
      details: sneaker.details,
      analytics,
      similar_products: similar.map(s => ({
        id: s.id,
        name: s.name,
        brand_name: s.brand,
        sale_price: s.marketData.lastSale,
        image_url: s.images.main,
        slug: s.id
      }))
    };

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Product API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}