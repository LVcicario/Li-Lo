// =============================================
// STOCKX SYNC API ROUTE
// POST /api/stockx/sync - Sync products from StockX
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  syncStockXProducts,
  searchStockX,
  getTrendingSneakers,
  mapStockXToProduct,
} from '@/lib/stockx/stockx-client';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check admin access
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type = 'trending', queries = [], limit = 20 } = body;

    const startTime = Date.now();
    let syncResults = {
      productsCreated: 0,
      productsUpdated: 0,
      errors: [] as string[],
    };

    // Log sync start
    const { data: syncLog } = await supabase
      .from('stockx_sync_log')
      .insert({
        sync_type: 'products',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    try {
      let stockxProducts = [];

      // Fetch products based on type
      if (type === 'trending') {
        stockxProducts = await getTrendingSneakers(limit);
      } else if (type === 'search' && queries.length > 0) {
        for (const query of queries) {
          const results = await searchStockX(query, limit);
          stockxProducts.push(...results.products);
        }
      } else {
        return NextResponse.json(
          { error: 'Invalid sync type or missing queries' },
          { status: 400 }
        );
      }

      // Process each product
      for (const stockxProduct of stockxProducts) {
        try {
          const mappedProduct = mapStockXToProduct(stockxProduct);

          // Check if product already exists by SKU
          const { data: existingProduct } = await supabase
            .from('products')
            .select('id')
            .eq('sku', mappedProduct.sku)
            .single();

          if (existingProduct) {
            // Update existing product
            await supabase
              .from('products')
              .update({
                base_price: mappedProduct.base_price,
                resale_value: mappedProduct.resale_value,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existingProduct.id);

            // Update StockX mapping
            await supabase
              .from('stockx_product_mapping')
              .upsert({
                product_id: existingProduct.id,
                stockx_id: mappedProduct.stockx_id,
                last_price_sync: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            syncResults.productsUpdated++;
          } else {
            // Get or create brand
            let brandId;
            const { data: existingBrand } = await supabase
              .from('brands')
              .select('id')
              .eq('name', mappedProduct.brand)
              .single();

            if (existingBrand) {
              brandId = existingBrand.id;
            } else if (mappedProduct.brand) {
              const { data: newBrand } = await supabase
                .from('brands')
                .insert({
                  name: mappedProduct.brand,
                  slug: mappedProduct.brand.toLowerCase().replace(/\s+/g, '-'),
                })
                .select()
                .single();
              brandId = newBrand?.id;
            }

            // Get default category
            const { data: defaultCategory } = await supabase
              .from('categories')
              .select('id')
              .eq('slug', 'limited-edition')
              .single();

            // Create new product
            const productSlug = mappedProduct.brand
              ? `${mappedProduct.brand}-${mappedProduct.sku}`.toLowerCase().replace(/\s+/g, '-')
              : mappedProduct.sku.toLowerCase().replace(/\s+/g, '-');

            const { data: newProduct, error: createError } = await supabase
              .from('products')
              .insert({
                ...mappedProduct,
                brand_id: brandId,
                category_id: defaultCategory?.id,
                slug: productSlug,
                status: 'active',
              })
              .select()
              .single();

            if (createError) {
              syncResults.errors.push(`Failed to create product ${mappedProduct.sku}: ${createError.message}`);
              continue;
            }

            // Create StockX mapping
            if (newProduct) {
              await supabase
                .from('stockx_product_mapping')
                .insert({
                  product_id: newProduct.id,
                  stockx_id: mappedProduct.stockx_id,
                  last_data_sync: new Date().toISOString(),
                });

              // Add product image if available
              if (mappedProduct.image_url) {
                await supabase
                  .from('product_images')
                  .insert({
                    product_id: newProduct.id,
                    url: mappedProduct.image_url,
                    is_primary: true,
                  });
              }

              syncResults.productsCreated++;
            }
          }
        } catch (productError) {
          console.error('Error processing product:', productError);
          syncResults.errors.push(`Error processing product: ${productError}`);
        }
      }

      // Update sync log
      const duration = Date.now() - startTime;
      await supabase
        .from('stockx_sync_log')
        .update({
          products_synced: stockxProducts.length,
          products_created: syncResults.productsCreated,
          products_updated: syncResults.productsUpdated,
          errors: syncResults.errors.length,
          error_details: syncResults.errors.length > 0 ? syncResults.errors : null,
          sync_duration_ms: duration,
          status: syncResults.errors.length > 0 ? 'partial' : 'success',
          completed_at: new Date().toISOString(),
        })
        .eq('id', syncLog?.id);

      return NextResponse.json({
        success: true,
        results: {
          totalProcessed: stockxProducts.length,
          created: syncResults.productsCreated,
          updated: syncResults.productsUpdated,
          errors: syncResults.errors.length,
          duration: `${duration}ms`,
        },
        errors: syncResults.errors,
      });
    } catch (syncError) {
      // Update sync log with failure
      const duration = Date.now() - startTime;
      await supabase
        .from('stockx_sync_log')
        .update({
          sync_duration_ms: duration,
          status: 'failed',
          error_details: [String(syncError)],
          completed_at: new Date().toISOString(),
        })
        .eq('id', syncLog?.id);

      throw syncError;
    }
  } catch (error) {
    console.error('StockX sync API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}