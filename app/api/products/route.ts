import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Get query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const sort = searchParams.get('sort') || 'featured';
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const size = searchParams.get('size');
  const search = searchParams.get('search');
  const isExclusive = searchParams.get('exclusive') === 'true';
  const isLimited = searchParams.get('limited') === 'true';

  try {
    const supabase = await createClient();

    // Start building the query
    let query = supabase
      .from('products')
      .select(`
        *,
        brand:brands(name, slug),
        category:categories(name, slug),
        images:product_images(url, alt_text),
        variants:product_variants(size, stock_quantity)
      `)
      .eq('status', 'active');

    // Apply filters
    if (category) {
      query = query.eq('category.slug', category);
    }

    if (brand) {
      query = query.eq('brand.slug', brand);
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    if (isExclusive) {
      query = query.eq('is_exclusive', true);
    }

    if (isLimited) {
      query = query.eq('is_limited_edition', true);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting
    switch (sort) {
      case 'price-asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'featured':
      default:
        query = query.order('featured', { ascending: false })
                     .order('created_at', { ascending: false });
        break;
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: products, error, count } = await query;

    if (error) {
      throw error;
    }

    // Filter by size if specified (post-query filtering)
    let filteredProducts = products;
    if (size) {
      filteredProducts = products?.filter(product =>
        product.variants?.some((v: any) => v.size === size && v.stock_quantity > 0)
      );
    }

    // Get aggregations for filters
    const { data: brands } = await supabase
      .from('brands')
      .select('id, name, slug')
      .order('name');

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name');

    const { data: sizes } = await supabase
      .from('product_variants')
      .select('size')
      .gt('stock_quantity', 0);

    const uniqueSizes = [...new Set(sizes?.map(s => s.size))].sort();

    return NextResponse.json({
      products: filteredProducts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
      filters: {
        brands: brands || [],
        categories: categories || [],
        sizes: uniqueSizes,
        priceRange: {
          min: 0,
          max: 5000,
        },
      },
    });
  } catch (error: any) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productData = await request.json();

    // Insert product
    const { data: product, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}