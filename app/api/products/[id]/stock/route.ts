import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/products/[id]/stock - Get stock info for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    const { data: variants, error } = await supabase
      .from('product_variants')
      .select(`
        id,
        size,
        stock_quantity,
        reserved_quantity,
        price_adjustment,
        is_active
      `)
      .eq('product_id', (await params).id)
      .eq('is_active', true);

    if (error) {
      throw error;
    }

    const totalStock = variants?.reduce((sum, variant) => sum + variant.stock_quantity, 0) || 0;
    const availableSizes = variants?.filter(v => v.stock_quantity > 0).map(v => v.size) || [];

    return NextResponse.json({
      variants,
      totalStock,
      availableSizes,
      inStock: totalStock > 0
    });
  } catch (error: any) {
    console.error('Stock API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stock' },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/stock - Update stock (Admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user role from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { variantId, action, quantity } = await request.json();

    if (!variantId || !action || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields: variantId, action, quantity' },
        { status: 400 }
      );
    }

    // Get current variant
    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .select('stock_quantity')
      .eq('id', variantId)
      .single();

    if (variantError || !variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }

    let newStock: number;
    let movementType: string;

    switch (action) {
      case 'add':
        newStock = variant.stock_quantity + quantity;
        movementType = 'inbound';
        break;
      case 'remove':
        newStock = Math.max(0, variant.stock_quantity - quantity);
        movementType = 'outbound';
        break;
      case 'set':
        newStock = quantity;
        movementType = newStock > variant.stock_quantity ? 'inbound' : 'outbound';
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update stock in transaction
    const { error: updateError } = await supabase
      .from('product_variants')
      .update({
        stock_quantity: newStock,
        updated_at: new Date().toISOString()
      })
      .eq('id', variantId);

    if (updateError) {
      throw updateError;
    }

    // Record stock movement
    const { error: movementError } = await supabase
      .from('stock_movements')
      .insert({
        variant_id: variantId,
        movement_type: movementType,
        quantity: Math.abs(newStock - variant.stock_quantity),
        reference_type: 'admin_adjustment',
        notes: `Stock ${action} by admin`,
        performed_by: user.id
      });

    if (movementError) {
      console.error('Failed to record stock movement:', movementError);
      // Don't fail the request if movement logging fails
    }

    return NextResponse.json({
      success: true,
      oldStock: variant.stock_quantity,
      newStock,
      change: newStock - variant.stock_quantity
    });

  } catch (error: any) {
    console.error('Stock update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update stock' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id]/stock/reserve - Reserve stock for checkout
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { variantId, quantity, action } = await request.json();

    if (!variantId || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current variant
    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .select('stock_quantity, reserved_quantity')
      .eq('id', variantId)
      .single();

    if (variantError || !variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }

    let newReserved: number;
    let movementType: string;

    if (action === 'reserve') {
      // Check if enough stock available
      const availableStock = variant.stock_quantity - variant.reserved_quantity;
      if (availableStock < quantity) {
        return NextResponse.json(
          { error: 'Insufficient stock available' },
          { status: 400 }
        );
      }

      newReserved = variant.reserved_quantity + quantity;
      movementType = 'reserved';
    } else if (action === 'release') {
      newReserved = Math.max(0, variant.reserved_quantity - quantity);
      movementType = 'released';
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update reserved quantity
    const { error: updateError } = await supabase
      .from('product_variants')
      .update({
        reserved_quantity: newReserved,
        updated_at: new Date().toISOString()
      })
      .eq('id', variantId);

    if (updateError) {
      throw updateError;
    }

    // Record stock movement
    const { error: movementError } = await supabase
      .from('stock_movements')
      .insert({
        variant_id: variantId,
        movement_type: movementType,
        quantity,
        reference_type: 'reservation',
        notes: `Stock ${action}d for checkout`
      });

    if (movementError) {
      console.error('Failed to record stock movement:', movementError);
    }

    return NextResponse.json({
      success: true,
      availableStock: variant.stock_quantity - newReserved,
      reservedStock: newReserved
    });

  } catch (error: any) {
    console.error('Stock reservation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reserve stock' },
      { status: 500 }
    );
  }
}