import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sneakerApi } from '@/lib/sneaker-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Get query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const sort = searchParams.get('sort') || 'featured';
  const sortBy = searchParams.get('sort_by') || '';
  const sortOrder = searchParams.get('sort_order') || 'asc';
  const category = searchParams.get('category');
  const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
  const brand = searchParams.get('brand');
  const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
  const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
  const minPrice = searchParams.get('minPrice') || searchParams.get('min_price');
  const maxPrice = searchParams.get('maxPrice') || searchParams.get('max_price');
  const size = searchParams.get('size');
  const search = searchParams.get('search') || searchParams.get('q');
  const inStockOnly = searchParams.get('in_stock') === 'true';
  const isExclusive = searchParams.get('exclusive') === 'true';
  const isLimited = searchParams.get('limited') === 'true';

  try {
    const supabase = await createClient();

    // Try database first - but skip if connection fails
    let skipDatabase = false;
    try {
      // Test connection first
      const { error: testError } = await supabase.from('products').select('id').limit(1);
      if (testError) {
        console.log('Database connection failed, using fallback data');
        skipDatabase = true;
      }
    } catch {
      skipDatabase = true;
    }

    if (!skipDatabase) {
      try {
        // Get products with images separately to avoid complex joins
        let query = supabase
          .from('products')
          .select('*, product_images(*), brands!inner(name, slug), categories!inner(name, slug)')
          .eq('status', 'active');

    // Apply filters
    if (category) {
      query = query.eq('category_id', category);
    }

    if (categories.length > 0) {
      query = query.in('categories.slug', categories);
    }

    if (brand) {
      query = query.eq('brand_id', brand);
    }

    if (brands.length > 0) {
      query = query.in('brands.slug', brands);
    }

    if (types.length > 0) {
      query = query.in('category_type', types);
    }

    if (minPrice) {
      query = query.gte('base_price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('base_price', parseFloat(maxPrice));
    }

    if (inStockOnly) {
      query = query.eq('in_stock', true);
    }

    if (isExclusive) {
      query = query.eq('is_exclusive', true);
    }

    if (isLimited) {
      query = query.eq('is_limited_edition', true);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,story.ilike.%${search}%`);
    }

    // Apply sorting
    if (sortBy && sortOrder) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    } else {
      switch (sort) {
        case 'price-asc':
          query = query.order('base_price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('base_price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'featured':
        default:
          query = query.order('is_featured', { ascending: false })
                       .order('created_at', { ascending: false });
          break;
      }
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: products, error } = await query;

    if (error) {
      console.error('Database query error:', error);
      throw error;
    }

    // Transform products to include proper structure
    const transformedProducts = products?.map((product: any) => ({
      ...product,
      brand: product.brands || { name: product.brand_id || 'Nike', slug: product.brand_id || 'nike' },
      category: product.categories || { name: 'Sneakers', slug: 'sneakers' },
      images: product.product_images || [{
        url: product.original_image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        alt_text: product.name,
        is_primary: true,
        sort_order: 0
      }],
      variants: [
        { id: `${product.id}-7`, size: '7', stock_quantity: product.stock || 5, price_adjustment: 0, is_active: true },
        { id: `${product.id}-8`, size: '8', stock_quantity: product.stock || 5, price_adjustment: 0, is_active: true },
        { id: `${product.id}-9`, size: '9', stock_quantity: product.stock || 5, price_adjustment: 0, is_active: true },
        { id: `${product.id}-10`, size: '10', stock_quantity: product.stock || 5, price_adjustment: 0, is_active: true },
        { id: `${product.id}-11`, size: '11', stock_quantity: product.stock || 5, price_adjustment: 0, is_active: true },
      ]
    }));

    // Get total count for pagination
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

      if (transformedProducts && transformedProducts.length > 0) {
        return NextResponse.json({
          products: transformedProducts,
          pagination: {
            page,
            limit,
            total: count || 36,
            totalPages: Math.ceil((count || 36) / limit),
          },
          filters: {
            brands: [
              { id: 'nike', name: 'Nike', slug: 'nike' },
              { id: 'adidas', name: 'Adidas', slug: 'adidas' },
              { id: 'jordan', name: 'Jordan', slug: 'jordan' }
            ],
            categories: [{ id: 'sneakers', name: 'Sneakers', slug: 'sneakers' }],
            sizes: ['7', '8', '9', '10', '11', '12'],
            priceRange: {
              min: 0,
              max: 5000,
            },
          },
        });
      }
      } catch (dbError) {
        console.log('Database error:', dbError);
      }
    }

    // Fallback to real sneaker data
    const allSneakers = await sneakerApi.getAllSneakers();

    // Apply search filter
    let filteredSneakers = allSneakers;
    if (search) {
      filteredSneakers = allSneakers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.brand.toLowerCase().includes(search.toLowerCase()) ||
        s.model.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply brand filter
    if (brand) {
      filteredSneakers = filteredSneakers.filter(s =>
        s.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    // Apply price filters
    if (minPrice) {
      filteredSneakers = filteredSneakers.filter(s =>
        s.marketData.lastSale >= parseFloat(minPrice)
      );
    }
    if (maxPrice) {
      filteredSneakers = filteredSneakers.filter(s =>
        s.marketData.lastSale <= parseFloat(maxPrice)
      );
    }

    // Apply exclusive/limited filters
    if (isExclusive) {
      filteredSneakers = filteredSneakers.filter(s =>
        s.details.collaboration !== undefined
      );
    }
    if (isLimited) {
      filteredSneakers = filteredSneakers.filter(s =>
        s.name.includes('Limited') || s.name.includes('OG') || s.name.includes('Retro')
      );
    }

    // Sort
    switch (sort) {
      case 'price_asc':
        filteredSneakers.sort((a, b) => a.marketData.lastSale - b.marketData.lastSale);
        break;
      case 'price_desc':
        filteredSneakers.sort((a, b) => b.marketData.lastSale - a.marketData.lastSale);
        break;
      case 'newest':
        filteredSneakers.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        break;
      case 'featured':
      default:
        filteredSneakers.sort((a, b) => b.marketData.salesLast72Hours - a.marketData.salesLast72Hours);
    }

    // Pagination
    const start = (page - 1) * limit;
    const paginatedSneakers = filteredSneakers.slice(start, start + limit);

    // Transform to API format
    const products = paginatedSneakers.map(sneaker => ({
      id: sneaker.id,
      name: sneaker.name,
      slug: sneaker.id,
      brand: { name: sneaker.brand, slug: sneaker.brand.toLowerCase() },
      category: { name: 'Sneakers', slug: 'sneakers' },
      base_price: sneaker.retailPrice,
      sale_price: sneaker.marketData.lastSale,
      description: sneaker.description,
      images: [
        {
          url: sneaker.images.main,
          alt_text: sneaker.name,
          is_primary: true,
          sort_order: 0
        }
      ],
      variants: sneaker.sizes.map((size, idx) => ({
        id: `${sneaker.id}-${idx}`,
        size: size.us.toString(),
        stock_quantity: size.stock,
        price_adjustment: size.priceAdjustment,
        is_active: size.stock > 0
      })),
      is_featured: sneaker.marketData.salesLast72Hours > 100,
      is_exclusive: sneaker.details.collaboration !== undefined,
      is_limited: sneaker.name.includes('Limited') || sneaker.name.includes('OG')
    }));

    // Get unique brands and sizes
    const uniqueBrands = [...new Set(allSneakers.map(s => s.brand))]
      .map(b => ({ id: b.toLowerCase(), name: b, slug: b.toLowerCase() }));

    const allSizes = new Set<string>();
    allSneakers.forEach(s => {
      s.sizes.forEach(size => allSizes.add(size.us.toString()));
    });
    const uniqueSizes = Array.from(allSizes).sort((a, b) => parseFloat(a) - parseFloat(b));

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: filteredSneakers.length,
        totalPages: Math.ceil(filteredSneakers.length / limit),
      },
      filters: {
        brands: uniqueBrands,
        categories: [{ id: 'sneakers', name: 'Sneakers', slug: 'sneakers' }],
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