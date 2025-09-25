import { NextRequest, NextResponse } from 'next/server';
import { sneakerApi } from '@/lib/sneaker-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const sort = searchParams.get('sort') || 'featured';

  try {
    // Use public anon key for client-side requests
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/products?select=*,brand:brands(name,slug),category:categories(name,slug),images:product_images(url,alt_text,is_primary,sort_order),variants:product_variants(id,size,stock_quantity,price_adjustment,is_active)&status=eq.active&limit=${limit}&offset=${(page - 1) * limit}`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }

    const products = await response.json();

    // Get total count
    const countResponse = await fetch(
      `${supabaseUrl}/rest/v1/products?select=count&status=eq.active`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact'
        }
      }
    );

    const count = parseInt(countResponse.headers.get('content-range')?.split('/')[1] || '0');

    // Format products
    const formattedProducts = products.map((p: any) => ({
      ...p,
      brand_name: p.brand?.name || 'Unknown',
      image_url: p.images?.[0]?.url || p.original_image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      total_variants: p.variants?.length || 0,
      total_stock: p.variants?.reduce((sum: number, v: any) => sum + v.stock_quantity, 0) || 0
    }));

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
      filters: {
        brands: [],
        categories: [],
        sizes: ['7', '8', '9', '10', '11', '12'],
        priceRange: {
          min: 50,
          max: 500,
        },
      },
    });
  } catch (error: any) {
    // Fallback to real sneaker data from our database
    const realSneakers = await sneakerApi.getAllSneakers();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSneakers = realSneakers.slice(startIndex, endIndex);

    const products = paginatedSneakers.map(sneaker => ({
      id: sneaker.id,
      name: sneaker.name,
      slug: sneaker.id,
      base_price: sneaker.retailPrice,
      sale_price: sneaker.marketData.lastSale,
      is_featured: sneaker.marketData.salesLast72Hours > 100,
      brand_name: sneaker.brand,
      image_url: sneaker.images.main,
      brand: { name: sneaker.brand, slug: sneaker.brand.toLowerCase() },
      category: { name: "Sneakers", slug: "sneakers" },
      description: sneaker.description,
      story: sneaker.story,
      colorway: sneaker.colorway,
      sku: sneaker.sku,
      release_date: sneaker.releaseDate,
      materials: sneaker.materials,
      images: [
        { url: sneaker.images.main, alt_text: sneaker.name, is_primary: true, sort_order: 0 },
        { url: sneaker.images.side, alt_text: `${sneaker.name} - Side`, is_primary: false, sort_order: 1 },
        { url: sneaker.images.back, alt_text: `${sneaker.name} - Back`, is_primary: false, sort_order: 2 },
        { url: sneaker.images.sole, alt_text: `${sneaker.name} - Sole`, is_primary: false, sort_order: 3 },
        { url: sneaker.images.detail, alt_text: `${sneaker.name} - Detail`, is_primary: false, sort_order: 4 }
      ],
      variants: sneaker.sizes.map((size, index) => ({
        id: `var-${sneaker.id}-${index}`,
        size: size.us.toString(),
        stock_quantity: size.stock,
        price_adjustment: size.priceAdjustment,
        is_active: true
      })),
      total_variants: sneaker.sizes.length,
      total_stock: sneaker.sizes.reduce((sum, size) => sum + size.stock, 0),
      market_data: sneaker.marketData,
      details: sneaker.details
    }));

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: realSneakers.length,
        totalPages: Math.ceil(realSneakers.length / limit),
      },
      filters: {
        brands: ['Jordan', 'Nike', 'Adidas', 'New Balance'],
        categories: ['High Tops', 'Low Tops', 'Basketball', 'Lifestyle'],
        sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'],
        priceRange: {
          min: 100,
          max: 2000,
        },
      },
    });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}