import { createClient } from '@/lib/supabase/client';
import type { ProductData } from '@/lib/product-data';

export interface SearchFilters {
  query?: string;
  brands?: string[];
  categories?: string[];
  sizes?: string[];
  colors?: string[];
  materials?: string[];
  priceRange?: [number, number];
  yearRange?: [number, number];
  conditions?: ('new' | 'excellent' | 'very_good' | 'good')[];
  features?: ('authenticated' | 'limited_edition' | 'exclusive' | 'grail')[];
  inStock?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rarity' | 'trending';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: ProductData[];
  facets: {
    brands: { name: string; count: number }[];
    categories: { name: string; count: number }[];
    sizes: { size: string; count: number }[];
    colors: { color: string; count: number }[];
    priceRanges: { range: string; min: number; max: number; count: number }[];
  };
  suggestions: string[];
  relatedSearches: string[];
  totalResults: number;
  page: number;
  totalPages: number;
}

export class AdvancedSearchEngine {
  private supabase = createClient();
  private searchHistory: Map<string, any> = new Map();

  async search(filters: SearchFilters): Promise<SearchResult> {
    const cacheKey = JSON.stringify(filters);

    // Check cache
    if (this.searchHistory.has(cacheKey)) {
      const cached = this.searchHistory.get(cacheKey);
      if (Date.now() - cached.timestamp < 60000) { // 1 minute cache
        return cached.data;
      }
    }

    try {
      // Build the query
      let query = this.supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          category:categories(*),
          images:product_images(*),
          variants:product_variants(*),
          reviews:product_reviews(rating)
        `, { count: 'exact' });

      // Apply filters
      if (filters.query) {
        // Full-text search
        query = query.textSearch('search_vector', filters.query, {
          config: 'english',
          type: 'websearch'
        });
      }

      if (filters.brands?.length) {
        query = query.in('brand.slug', filters.brands);
      }

      if (filters.categories?.length) {
        query = query.in('category.slug', filters.categories);
      }

      if (filters.colors?.length) {
        query = query.in('color', filters.colors);
      }

      if (filters.materials?.length) {
        query = query.overlaps('materials', filters.materials);
      }

      if (filters.priceRange) {
        query = query
          .gte('base_price', filters.priceRange[0])
          .lte('base_price', filters.priceRange[1]);
      }

      if (filters.yearRange) {
        query = query
          .gte('release_year', filters.yearRange[0])
          .lte('release_year', filters.yearRange[1]);
      }

      if (filters.inStock !== undefined) {
        query = query.gt('total_stock', 0);
      }

      if (filters.features?.includes('authenticated')) {
        query = query.eq('has_authenticity_certificate', true);
      }

      if (filters.features?.includes('limited_edition')) {
        query = query.eq('is_limited_edition', true);
      }

      if (filters.features?.includes('exclusive')) {
        query = query.eq('is_exclusive', true);
      }

      if (filters.features?.includes('grail')) {
        query = query.eq('category_type', 'grail');
      }

      // Apply sorting
      query = this.applySorting(query, filters.sortBy || 'relevance', filters.query);

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 24;
      const offset = (page - 1) * limit;

      query = query.range(offset, offset + limit - 1);

      // Execute query
      const { data: products, error, count } = await query;

      if (error) throw error;

      // Get facets
      const facets = await this.getFacets(filters);

      // Get suggestions and related searches
      const suggestions = await this.getSuggestions(filters.query);
      const relatedSearches = await this.getRelatedSearches(filters.query);

      const result: SearchResult = {
        products: products || [],
        facets,
        suggestions,
        relatedSearches,
        totalResults: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
      };

      // Cache the result
      this.searchHistory.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      // Clean old cache entries
      if (this.searchHistory.size > 100) {
        const oldestKey = this.searchHistory.keys().next().value;
        if (oldestKey) {
          this.searchHistory.delete(oldestKey);
        }
      }

      return result;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  private applySorting(query: any, sortBy: string, searchQuery?: string) {
    switch (sortBy) {
      case 'price_asc':
        return query.order('base_price', { ascending: true });
      case 'price_desc':
        return query.order('base_price', { ascending: false });
      case 'newest':
        return query.order('created_at', { ascending: false });
      case 'rarity':
        return query.order('rarity_score', { ascending: false });
      case 'trending':
        return query.order('view_count', { ascending: false });
      case 'relevance':
      default:
        if (searchQuery) {
          // Sort by text search rank
          return query.order('rank', { ascending: false });
        }
        return query.order('featured_rank', { ascending: true });
    }
  }

  private async getFacets(filters: SearchFilters) {
    const facetQueries = [];

    // Brand facets
    facetQueries.push(
      this.supabase
        .from('products')
        .select('brand:brands(name)', { count: 'exact', head: false })
        .limit(0)
    );

    // Execute all facet queries in parallel
    const results = await Promise.all(facetQueries);

    return {
      brands: [],
      categories: [],
      sizes: [],
      colors: [],
      priceRanges: [
        { range: 'Under €100', min: 0, max: 100, count: 0 },
        { range: '€100 - €250', min: 100, max: 250, count: 0 },
        { range: '€250 - €500', min: 250, max: 500, count: 0 },
        { range: '€500 - €1000', min: 500, max: 1000, count: 0 },
        { range: 'Over €1000', min: 1000, max: 999999, count: 0 },
      ]
    };
  }

  private async getSuggestions(query?: string): Promise<string[]> {
    if (!query) return [];

    // Get popular searches similar to the query
    const { data } = await this.supabase
      .from('search_history')
      .select('query')
      .ilike('query', `%${query}%`)
      .order('count', { ascending: false })
      .limit(5);

    return data?.map(d => d.query) || [];
  }

  private async getRelatedSearches(query?: string): Promise<string[]> {
    if (!query) return [];

    // Get related searches based on user behavior
    const { data } = await this.supabase
      .from('related_searches')
      .select('related_query')
      .eq('query', query)
      .order('score', { ascending: false })
      .limit(5);

    return data?.map(d => d.related_query) || [];
  }

  async getPersonalizedRecommendations(userId: string, limit = 12): Promise<ProductData[]> {
    try {
      // Get user preferences and history
      const [preferences, viewHistory, purchases] = await Promise.all([
        this.supabase
          .from('user_preferences')
          .select('favorite_brands, favorite_categories, preferred_sizes')
          .eq('user_id', userId)
          .single(),
        this.supabase
          .from('view_history')
          .select('product_id')
          .eq('user_id', userId)
          .order('viewed_at', { ascending: false })
          .limit(20),
        this.supabase
          .from('order_items')
          .select('product_id, orders!inner(user_id)')
          .eq('orders.user_id', userId)
          .limit(10)
      ]);

      // Build recommendation query
      let query = this.supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          category:categories(*),
          images:product_images(*),
          variants:product_variants(*)
        `);

      // Filter based on preferences
      if (preferences.data?.favorite_brands?.length) {
        query = query.in('brand.slug', preferences.data.favorite_brands);
      }

      // Exclude already viewed/purchased products
      const excludeIds = [
        ...(viewHistory.data?.map(v => v.product_id) || []),
        ...(purchases.data?.map(p => p.product_id) || [])
      ];

      if (excludeIds.length) {
        query = query.not('id', 'in', `(${excludeIds.join(',')})`);
      }

      // Order by recommendation score (would be ML model in production)
      query = query
        .order('view_count', { ascending: false })
        .order('rarity_score', { ascending: false })
        .limit(limit);

      const { data: products } = await query;

      return products || [];
    } catch (error) {
      console.error('Recommendation error:', error);
      return [];
    }
  }

  async getTrendingSearches(limit = 10): Promise<string[]> {
    const { data } = await this.supabase
      .from('search_trends')
      .select('query')
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('count', { ascending: false })
      .limit(limit);

    return data?.map(d => d.query) || [];
  }

  async recordSearch(query: string, userId?: string) {
    // Record search for analytics and suggestions
    await this.supabase
      .from('search_history')
      .insert({
        query,
        user_id: userId,
        timestamp: new Date().toISOString()
      });

    // Update search trends
    await this.supabase.rpc('increment_search_count', { search_query: query });
  }

  async getVisualSimilarProducts(imageUrl: string, limit = 12): Promise<ProductData[]> {
    // This would integrate with a computer vision API
    // For now, return random products as placeholder
    const { data } = await this.supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .order('random()')
      .limit(limit);

    return data || [];
  }
}

// Singleton instance
export const searchEngine = new AdvancedSearchEngine();