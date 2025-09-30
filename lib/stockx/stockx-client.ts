// =============================================
// STOCKX API CLIENT - Li-Lo E-Commerce Platform
// Integration with StockX for sneaker data
// =============================================

import StockX, { StockXProduct as StockXAPIProduct } from 'stockx-api';

// Initialize StockX client
const stockx = new StockX();

// Extended interface with our custom fields
export interface StockXProduct extends Partial<StockXAPIProduct> {
  id?: string;
  uuid: string;
  name?: string;
  brand?: string;
  colorway?: string;
  description?: string;
  gender?: string;
  releaseDate?: string;
  retailPrice?: number;
  styleID: string;
  title: string;
  year?: number;
  media?: {
    imageUrl?: string;
    smallImageUrl?: string;
    thumbUrl?: string;
  };
  market?: {
    lowestAsk?: number;
    highestBid?: number;
    numberOfAsks?: number;
    numberOfBids?: number;
    salesLast72Hours?: number;
    deadstockSold?: number;
  };
}

export interface StockXSearchResult {
  products: StockXProduct[];
  pagination: {
    limit: number;
    page: number;
    total: number;
  };
}

// Search for products on StockX
export async function searchStockX(
  query: string,
  limit: number = 20
): Promise<StockXSearchResult> {
  try {
    const results = await stockx.searchProducts(query, { limit });
    return {
      products: (results.Products || []) as StockXProduct[],
      pagination: {
        limit: results.pagination?.limit || limit,
        page: results.pagination?.page || 1,
        total: results.pagination?.total || 0,
      },
    };
  } catch (error) {
    console.error('StockX search error:', error);
    throw new Error('Failed to search StockX');
  }
}

// Get product details by StockX ID
export async function getStockXProduct(
  productId: string
): Promise<StockXProduct | null> {
  try {
    const product = await stockx.getProduct(productId);
    return (product as StockXProduct) || null;
  } catch (error) {
    console.error('StockX product fetch error:', error);
    return null;
  }
}

// Get product details by SKU
export async function getStockXProductBySKU(
  sku: string
): Promise<StockXProduct | null> {
  try {
    // Search by SKU
    const results = await searchStockX(sku, 1);
    if (results.products.length > 0) {
      return results.products[0];
    }
    return null;
  } catch (error) {
    console.error('StockX SKU lookup error:', error);
    return null;
  }
}

// Fetch trending sneakers
export async function getTrendingSneakers(
  limit: number = 50
): Promise<StockXProduct[]> {
  try {
    // Use search with trending brands as fallback since stockx-api may not support getProductsByCategory
    const results = await searchStockX('nike jordan adidas yeezy', limit);
    return results.products;
  } catch (error) {
    console.error('StockX trending fetch error:', error);
    return [];
  }
}

// Fetch new releases
export async function getNewReleases(
  limit: number = 50
): Promise<StockXProduct[]> {
  try {
    // Use search with "new release" keywords as fallback
    const results = await searchStockX('new release sneakers 2025', limit);
    return results.products;
  } catch (error) {
    console.error('StockX new releases fetch error:', error);
    return [];
  }
}

// Fetch by brand
export async function getSneakersByBrand(
  brand: string,
  limit: number = 50
): Promise<StockXProduct[]> {
  try {
    const query = `${brand} sneakers`;
    const results = await searchStockX(query, limit);
    return results.products.filter(p =>
      p.brand?.toLowerCase() === brand.toLowerCase()
    );
  } catch (error) {
    console.error('StockX brand fetch error:', error);
    return [];
  }
}

// Convert StockX product to our database format
export function mapStockXToProduct(stockxProduct: StockXProduct) {
  return {
    name: stockxProduct.title || stockxProduct.name,
    sku: stockxProduct.styleID,
    brand: stockxProduct.brand,
    model: stockxProduct.title,
    description: stockxProduct.description,
    colorway: stockxProduct.colorway,
    release_date: stockxProduct.releaseDate,
    release_year: stockxProduct.year,
    base_price: stockxProduct.retailPrice || stockxProduct.market?.lowestAsk || 0,
    resale_value: stockxProduct.market?.lowestAsk || 0,
    image_url: stockxProduct.media?.imageUrl,
    stockx_id: stockxProduct.uuid || stockxProduct.id,
  };
}

// Bulk sync products from StockX
export async function syncStockXProducts(
  queries: string[],
  limit: number = 20
): Promise<{
  success: number;
  failed: number;
  products: any[];
  errors: string[];
}> {
  const results = {
    success: 0,
    failed: 0,
    products: [] as any[],
    errors: [] as string[],
  };

  for (const query of queries) {
    try {
      const searchResults = await searchStockX(query, limit);
      const mapped = searchResults.products.map(mapStockXToProduct);
      results.products.push(...mapped);
      results.success += mapped.length;
    } catch (error) {
      results.failed++;
      results.errors.push(`Failed to sync "${query}": ${error}`);
    }
  }

  return results;
}

// Update pricing from StockX
export async function updatePricingFromStockX(
  stockxId: string
): Promise<{
  lowestAsk: number;
  highestBid: number;
  salesLast72Hours: number;
} | null> {
  try {
    const product = await getStockXProduct(stockxId);
    if (!product || !product.market) {
      return null;
    }

    return {
      lowestAsk: product.market.lowestAsk || 0,
      highestBid: product.market.highestBid || 0,
      salesLast72Hours: product.market.salesLast72Hours || 0,
    };
  } catch (error) {
    console.error('StockX pricing update error:', error);
    return null;
  }
}

export default {
  searchStockX,
  getStockXProduct,
  getStockXProductBySKU,
  getTrendingSneakers,
  getNewReleases,
  getSneakersByBrand,
  mapStockXToProduct,
  syncStockXProducts,
  updatePricingFromStockX,
};