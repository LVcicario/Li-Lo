import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  try {
    // Real, purchasable sneakers with realistic prices
    const mockProducts = [
      {
        id: "jordan-1-bred-toe",
        name: "Air Jordan 1 Retro High OG 'Bred Toe'",
        slug: "air-jordan-1-bred-toe",
        base_price: "170.00",
        sale_price: "160.00",
        is_featured: true,
        brand_name: "Nike",
        image_url: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800",
        total_variants: 8,
        total_stock: 24,
        brand: { name: "Nike", slug: "nike" },
        category: { name: "Sneakers", slug: "sneakers" },
        description: "The Air Jordan 1 Retro High OG 'Bred Toe' combines classic black and red colorway with premium leather construction. Perfect for everyday wear.",
        images: [
          {
            url: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800",
            alt_text: "Air Jordan 1 Retro High OG Bred Toe",
            is_primary: true,
            sort_order: 0
          }
        ],
        variants: [
          { id: "var-1", size: "8", stock_quantity: 3, price_adjustment: 0, is_active: true },
          { id: "var-2", size: "9", stock_quantity: 4, price_adjustment: 0, is_active: true },
          { id: "var-3", size: "10", stock_quantity: 5, price_adjustment: 0, is_active: true },
          { id: "var-4", size: "11", stock_quantity: 2, price_adjustment: 0, is_active: true }
        ]
      },
      {
        id: "nike-dunk-low-panda",
        name: "Nike Dunk Low 'Panda'",
        slug: "nike-dunk-low-panda",
        base_price: "110.00",
        is_featured: true,
        brand_name: "Nike",
        image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        total_variants: 10,
        total_stock: 35,
        brand: { name: "Nike", slug: "nike" },
        category: { name: "Sneakers", slug: "sneakers" },
        description: "The Nike Dunk Low in classic black and white colorway. Versatile basketball-inspired sneaker perfect for any outfit.",
        images: [
          {
            url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
            alt_text: "Nike Dunk Low Panda",
            is_primary: true,
            sort_order: 0
          }
        ],
        variants: [
          { id: "var-5", size: "8", stock_quantity: 4, price_adjustment: 0, is_active: true },
          { id: "var-6", size: "9", stock_quantity: 6, price_adjustment: 0, is_active: true },
          { id: "var-7", size: "10", stock_quantity: 5, price_adjustment: 0, is_active: true },
          { id: "var-8", size: "11", stock_quantity: 3, price_adjustment: 0, is_active: true }
        ]
      },
      {
        id: "air-force-1-white",
        name: "Nike Air Force 1 '07 'Triple White'",
        slug: "air-force-1-white",
        base_price: "110.00",
        is_featured: true,
        brand_name: "Nike",
        image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
        total_variants: 9,
        total_stock: 42,
        brand: { name: "Nike", slug: "nike" },
        category: { name: "Sneakers", slug: "sneakers" },
        description: "The classic Nike Air Force 1 in clean triple white. Timeless basketball sneaker that goes with everything.",
        images: [
          {
            url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
            alt_text: "Nike Air Force 1 Triple White",
            is_primary: true,
            sort_order: 0
          }
        ],
        variants: [
          { id: "var-9", size: "8", stock_quantity: 5, price_adjustment: 0, is_active: true },
          { id: "var-10", size: "9", stock_quantity: 7, price_adjustment: 0, is_active: true },
          { id: "var-11", size: "10", stock_quantity: 6, price_adjustment: 0, is_active: true },
          { id: "var-12", size: "11", stock_quantity: 4, price_adjustment: 0, is_active: true }
        ]
      },
      {
        id: "yeezy-350-v2-cream",
        name: "Adidas Yeezy Boost 350 V2 'Cream White'",
        slug: "yeezy-350-v2-cream",
        base_price: "220.00",
        is_featured: true,
        brand_name: "Adidas",
        image_url: "https://images.unsplash.com/photo-1505784045224-1247b2b29cf3?w=800",
        total_variants: 8,
        total_stock: 18,
        brand: { name: "Adidas", slug: "adidas" },
        category: { name: "Sneakers", slug: "sneakers" },
        description: "The Adidas Yeezy Boost 350 V2 in clean cream white. Innovative design meets comfort with Boost technology.",
        images: [
          {
            url: "https://images.unsplash.com/photo-1505784045224-1247b2b29cf3?w=800",
            alt_text: "Yeezy Boost 350 V2 Cream White",
            is_primary: true,
            sort_order: 0
          }
        ],
        variants: [
          { id: "var-13", size: "8", stock_quantity: 2, price_adjustment: 0, is_active: true },
          { id: "var-14", size: "9", stock_quantity: 3, price_adjustment: 0, is_active: true },
          { id: "var-15", size: "10", stock_quantity: 2, price_adjustment: 0, is_active: true },
          { id: "var-16", size: "11", stock_quantity: 1, price_adjustment: 0, is_active: true }
        ]
      },
      {
        id: "jordan-4-bred",
        name: "Air Jordan 4 Retro 'Bred' 2019",
        slug: "jordan-4-bred",
        base_price: "210.00",
        is_featured: false,
        brand_name: "Nike",
        image_url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
        total_variants: 8,
        total_stock: 16,
        brand: { name: "Nike", slug: "nike" },
        category: { name: "Sneakers", slug: "sneakers" },
        description: "The Air Jordan 4 Retro 'Bred' in classic black and red. Iconic basketball shoe with visible Air cushioning.",
        images: [
          {
            url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
            alt_text: "Air Jordan 4 Retro Bred 2019",
            is_primary: true,
            sort_order: 0
          }
        ],
        variants: [
          { id: "var-17", size: "8", stock_quantity: 2, price_adjustment: 0, is_active: true },
          { id: "var-18", size: "9", stock_quantity: 3, price_adjustment: 0, is_active: true },
          { id: "var-19", size: "10", stock_quantity: 2, price_adjustment: 0, is_active: true },
          { id: "var-20", size: "11", stock_quantity: 1, price_adjustment: 0, is_active: true }
        ]
      },
      {
        id: "new-balance-550-white",
        name: "New Balance 550 'White Green'",
        slug: "new-balance-550-white",
        base_price: "110.00",
        is_featured: false,
        brand_name: "New Balance",
        image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800",
        total_variants: 8,
        total_stock: 28,
        brand: { name: "New Balance", slug: "new-balance" },
        category: { name: "Sneakers", slug: "sneakers" },
        description: "The New Balance 550 in clean white and green. Vintage basketball aesthetic with modern comfort.",
        images: [
          {
            url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800",
            alt_text: "New Balance 550 White Green",
            is_primary: true,
            sort_order: 0
          }
        ],
        variants: [
          { id: "var-21", size: "8", stock_quantity: 4, price_adjustment: 0, is_active: true },
          { id: "var-22", size: "9", stock_quantity: 5, price_adjustment: 0, is_active: true },
          { id: "var-23", size: "10", stock_quantity: 3, price_adjustment: 0, is_active: true },
          { id: "var-24", size: "11", stock_quantity: 2, price_adjustment: 0, is_active: true }
        ]
      }
    ];

    // Apply limit
    const products = mockProducts.slice(0, limit);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: mockProducts.length,
        totalPages: Math.ceil(mockProducts.length / limit),
      },
      filters: {
        brands: [
          { id: "1", name: "Nike", slug: "nike" },
          { id: "2", name: "Adidas", slug: "adidas" },
          { id: "3", name: "New Balance", slug: "new-balance" }
        ],
        categories: [
          { id: "1", name: "Sneakers", slug: "sneakers" }
        ],
        sizes: ["7", "8", "9", "10", "11", "12"],
        priceRange: {
          min: 110,
          max: 220,
        },
      },
    });
  } catch (error: any) {
    console.error('Products Direct API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}