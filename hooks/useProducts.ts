import { useState, useEffect } from 'react';

export interface DatabaseProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  base_price: number;
  sale_price?: number;
  description: string;
  story?: string;
  short_description?: string;
  color: string;
  colorway?: string;
  material?: string;
  release_date?: string;
  release_year?: number;
  category_type: 'grail' | 'exclusive' | 'limited' | 'rare';
  is_featured: boolean;
  is_exclusive: boolean;
  is_limited_edition: boolean;
  edition_name?: string;
  total_produced?: number;
  available_quantity?: number;
  rarity_score?: number;
  has_authenticity_certificate: boolean;
  verified_by?: string;
  serial_number?: string;
  resale_value?: number;
  value_trend_percentage?: number;
  value_trend_direction?: 'up' | 'down' | 'stable';
  brand: {
    name: string;
    slug: string;
  };
  category: {
    name: string;
    slug: string;
  };
  images: Array<{
    url: string;
    alt_text?: string;
    is_primary: boolean;
    sort_order: number;
  }>;
  variants: Array<{
    id: string;
    size: string;
    stock_quantity: number;
    price_adjustment: number;
    is_active: boolean;
  }>;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'newest';
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  search?: string;
  exclusive?: boolean;
  limited?: boolean;
}

export interface ProductsResponse {
  products: DatabaseProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    brands: Array<{ id: string; name: string; slug: string }>;
    categories: Array<{ id: string; name: string; slug: string }>;
    sizes: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
}

export function useProducts(filters: ProductFilters = {}) {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const searchParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        // Try real products first, fallback to direct if fails
        let response = await fetch(`/api/products/real?${searchParams.toString()}`);

        if (!response.ok) {
          response = await fetch(`/api/products-direct?${searchParams.toString()}`);
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const productsData = await response.json();
        setData(productsData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters)]);

  const refetch = () => {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    return fetch(`/api/products?${searchParams.toString()}`)
      .then(res => res.json())
      .then(setData);
  };

  return {
    products: data?.products || [],
    pagination: data?.pagination,
    availableFilters: data?.filters,
    loading,
    error,
    refetch
  };
}

// Hook for single product
export function useProduct(id: string) {
  const [product, setProduct] = useState<DatabaseProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/products-direct?id=${id}&limit=1`);

        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data.products[0] || null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}

// Hook for stock management
export function useProductStock(productId: string) {
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/products/${productId}/stock`);

      if (!response.ok) {
        throw new Error(`Failed to fetch stock: ${response.status}`);
      }

      const data = await response.json();
      setStockData(data);
    } catch (err) {
      console.error('Error fetching stock:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stock');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (variantId: string, action: 'add' | 'remove' | 'set', quantity: number) => {
    try {
      const response = await fetch(`/api/products/${productId}/stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantId,
          action,
          quantity
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update stock');
      }

      const result = await response.json();

      // Refresh stock data
      await fetchStock();

      return result;
    } catch (err) {
      console.error('Error updating stock:', err);
      throw err;
    }
  };

  const reserveStock = async (variantId: string, quantity: number, action: 'reserve' | 'release' = 'reserve') => {
    try {
      const response = await fetch(`/api/products/${productId}/stock/reserve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantId,
          quantity,
          action
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reserve stock');
      }

      const result = await response.json();
      await fetchStock();

      return result;
    } catch (err) {
      console.error('Error reserving stock:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchStock();
  }, [productId]);

  return {
    stockData,
    loading,
    error,
    updateStock,
    reserveStock,
    refetch: fetchStock
  };
}

// Utility function to format database product for legacy components
export function formatDatabaseProduct(dbProduct: DatabaseProduct): any {
  const primaryImage = dbProduct.images?.find(img => img.is_primary);
  const allImages = dbProduct.images?.sort((a, b) => a.sort_order - b.sort_order).map(img => img.url) || [];

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    brand: dbProduct.brand?.name || 'Unknown',
    model: dbProduct.name,
    price: parseFloat(String(dbProduct.base_price)),
    resaleValue: dbProduct.resale_value ? parseFloat(String(dbProduct.resale_value)) : parseFloat(String(dbProduct.base_price)),
    description: dbProduct.description || '',
    story: dbProduct.story || '',
    images: allImages,
    sizes: dbProduct.variants?.filter(v => v.is_active).map(v => parseFloat(v.size)).filter(s => !isNaN(s)) || [],
    color: dbProduct.color || '',
    releaseDate: dbProduct.release_date || '',
    releaseYear: dbProduct.release_year || new Date().getFullYear(),
    category: dbProduct.category_type,
    stock: dbProduct.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0,
    featured: dbProduct.is_featured,
    materials: dbProduct.material ? dbProduct.material.split(',').map(m => m.trim()) : [],
    edition: dbProduct.edition_name || '',
    authenticity: {
      certificate: dbProduct.has_authenticity_certificate,
      verifiedBy: dbProduct.verified_by || '',
      serialNumber: dbProduct.serial_number || ''
    },
    valueTrend: {
      percentage: dbProduct.value_trend_percentage || 0,
      direction: dbProduct.value_trend_direction || 'stable'
    },
    rarity: {
      produced: dbProduct.total_produced || 0,
      available: dbProduct.available_quantity || 0,
      rating: dbProduct.rarity_score || 5
    }
  };
}