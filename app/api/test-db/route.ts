import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Simple direct query
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, stock, base_price, original_image_url')
      .eq('status', 'active')
      .limit(5);

    if (error) {
      return NextResponse.json({
        error: 'Database error',
        details: error.message,
        code: error.code
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: products?.length || 0,
      products: products || [],
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({
      error: 'Server error',
      details: err.message
    }, { status: 500 });
  }
}