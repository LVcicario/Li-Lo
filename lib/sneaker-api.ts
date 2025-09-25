import { REAL_SNEAKERS_DATABASE, type RealSneaker } from './sneaker-database';

// StockX-style product images using actual product image URLs
const PRODUCT_IMAGES = {
  'air-jordan-1': [
    'https://cdn.flightclub.com/750/TEMPLATE/012345/1.jpg',
    'https://cdn.flightclub.com/750/TEMPLATE/012345/2.jpg',
    'https://cdn.flightclub.com/750/TEMPLATE/012345/3.jpg',
    'https://cdn.flightclub.com/750/TEMPLATE/012345/4.jpg'
  ],
  'nike-dunk': [
    'https://cdn.flightclub.com/750/TEMPLATE/248952/1.jpg',
    'https://cdn.flightclub.com/750/TEMPLATE/248952/2.jpg',
    'https://cdn.flightclub.com/750/TEMPLATE/248952/3.jpg',
    'https://cdn.flightclub.com/750/TEMPLATE/248952/4.jpg'
  ],
  'yeezy': [
    'https://cdn.flightclub.com/750/TEMPLATE/201775/1.jpg',
    'https://cdn.flightclub.com/750/TEMPLATE/201775/2.jpg',
    'https://cdn.flightclub.com/750/TEMPLATE/201775/3.jpg',
    'https://cdn.flightclub.com/750/TEMPLATE/201775/4.jpg'
  ]
};

// Sneaker data provider service
export class SneakerApiService {
  private static instance: SneakerApiService;
  private cache: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): SneakerApiService {
    if (!SneakerApiService.instance) {
      SneakerApiService.instance = new SneakerApiService();
    }
    return SneakerApiService.instance;
  }

  // Get all sneakers from our database
  async getAllSneakers(): Promise<RealSneaker[]> {
    // In production, this would fetch from an actual API
    // For now, return our curated database
    return REAL_SNEAKERS_DATABASE;
  }

  // Search sneakers by query
  async searchSneakers(query: string): Promise<RealSneaker[]> {
    const allSneakers = await this.getAllSneakers();
    const lowerQuery = query.toLowerCase();

    return allSneakers.filter(sneaker =>
      sneaker.name.toLowerCase().includes(lowerQuery) ||
      sneaker.brand.toLowerCase().includes(lowerQuery) ||
      sneaker.model.toLowerCase().includes(lowerQuery) ||
      sneaker.colorway.toLowerCase().includes(lowerQuery) ||
      sneaker.sku.toLowerCase().includes(lowerQuery)
    );
  }

  // Get sneaker by ID
  async getSneakerById(id: string): Promise<RealSneaker | null> {
    const allSneakers = await this.getAllSneakers();
    return allSneakers.find(s => s.id === id) || null;
  }

  // Get sneaker by SKU
  async getSneakerBySku(sku: string): Promise<RealSneaker | null> {
    const allSneakers = await this.getAllSneakers();
    return allSneakers.find(s => s.sku === sku) || null;
  }

  // Get trending sneakers (most sales in last 72 hours)
  async getTrendingSneakers(limit = 10): Promise<RealSneaker[]> {
    const allSneakers = await this.getAllSneakers();
    return allSneakers
      .sort((a, b) => b.marketData.salesLast72Hours - a.marketData.salesLast72Hours)
      .slice(0, limit);
  }

  // Get new releases
  async getNewReleases(limit = 10): Promise<RealSneaker[]> {
    const allSneakers = await this.getAllSneakers();
    return allSneakers
      .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
      .slice(0, limit);
  }

  // Get price movers (biggest price changes)
  async getPriceMovers(limit = 10): Promise<RealSneaker[]> {
    const allSneakers = await this.getAllSneakers();
    return allSneakers
      .sort((a, b) => Math.abs(b.marketData.changePercent) - Math.abs(a.marketData.changePercent))
      .slice(0, limit);
  }

  // Get sneakers by brand
  async getSneakersByBrand(brand: string): Promise<RealSneaker[]> {
    const allSneakers = await this.getAllSneakers();
    return allSneakers.filter(s => s.brand.toLowerCase() === brand.toLowerCase());
  }

  // Get market analytics for a sneaker
  async getMarketAnalytics(sneakerId: string) {
    const sneaker = await this.getSneakerById(sneakerId);
    if (!sneaker) return null;

    return {
      currentPrice: sneaker.marketData.lastSale,
      retailPrice: sneaker.retailPrice,
      profitMargin: sneaker.marketData.lastSale - sneaker.retailPrice,
      profitPercentage: ((sneaker.marketData.lastSale - sneaker.retailPrice) / sneaker.retailPrice) * 100,
      volatility: sneaker.marketData.volatility,
      trend: sneaker.marketData.changePercent > 0 ? 'up' : sneaker.marketData.changePercent < 0 ? 'down' : 'stable',
      volume: sneaker.marketData.salesLast72Hours,
      priceHistory: sneaker.marketData.priceHistory,
      recommendation: this.getPriceRecommendation(sneaker)
    };
  }

  // Get price recommendation
  private getPriceRecommendation(sneaker: RealSneaker): string {
    const profitMargin = ((sneaker.marketData.lastSale - sneaker.retailPrice) / sneaker.retailPrice) * 100;

    if (sneaker.marketData.changePercent > 5) {
      return 'STRONG BUY - Price trending up significantly';
    } else if (sneaker.marketData.changePercent > 2) {
      return 'BUY - Positive price momentum';
    } else if (sneaker.marketData.changePercent < -5) {
      return 'WAIT - Price dropping, better deals coming';
    } else if (profitMargin > 100) {
      return 'HOLD - High resale value, good investment';
    } else {
      return 'FAIR PRICE - Market is stable';
    }
  }

  // Get similar sneakers
  async getSimilarSneakers(sneakerId: string, limit = 6): Promise<RealSneaker[]> {
    const sneaker = await this.getSneakerById(sneakerId);
    if (!sneaker) return [];

    const allSneakers = await this.getAllSneakers();

    // Find similar based on brand, model, or price range
    return allSneakers
      .filter(s => s.id !== sneakerId)
      .filter(s =>
        s.brand === sneaker.brand ||
        s.model === sneaker.model ||
        Math.abs(s.retailPrice - sneaker.retailPrice) < 50
      )
      .slice(0, limit);
  }

  // Format product for Supabase
  formatForSupabase(sneaker: RealSneaker) {
    return {
      sku: sneaker.sku,
      name: sneaker.name,
      slug: sneaker.id,
      brand_id: null, // Will be linked in Supabase
      category_id: null, // Will be linked in Supabase
      model: sneaker.model,
      description: sneaker.description,
      story: sneaker.story,
      short_description: sneaker.description.substring(0, 150) + '...',
      base_price: sneaker.retailPrice,
      sale_price: sneaker.marketData.lastSale,
      color: sneaker.colorway.split('/')[0],
      colorway: sneaker.colorway,
      material: sneaker.materials.join(', '),
      release_date: sneaker.releaseDate,
      release_year: new Date(sneaker.releaseDate).getFullYear(),
      category_type: this.getCategoryType(sneaker),
      is_featured: sneaker.marketData.salesLast72Hours > 100,
      is_exclusive: sneaker.details.collaboration !== undefined,
      is_limited_edition: sneaker.name.includes('Limited') || sneaker.name.includes('OG'),
      edition_name: sneaker.details.collaboration,
      rarity_score: Math.min(10, Math.round(sneaker.marketData.volatility)),
      has_authenticity_certificate: true,
      resale_value: sneaker.marketData.averagePrice,
      value_trend_percentage: sneaker.marketData.changePercent,
      value_trend_direction: sneaker.marketData.changePercent > 0 ? 'up' : sneaker.marketData.changePercent < 0 ? 'down' : 'stable',
      meta_title: `${sneaker.name} - ${sneaker.sku}`,
      meta_description: sneaker.description,
      tags: this.generateTags(sneaker),
      status: 'active',
      featured_rank: sneaker.marketData.salesLast72Hours
    };
  }

  private getCategoryType(sneaker: RealSneaker): 'grail' | 'exclusive' | 'limited' | 'rare' {
    if (sneaker.details.collaboration || sneaker.marketData.lastSale > 1000) return 'grail';
    if (sneaker.name.includes('Retro') || sneaker.name.includes('OG')) return 'exclusive';
    if (sneaker.marketData.volatility > 10) return 'limited';
    return 'rare';
  }

  private generateTags(sneaker: RealSneaker): string[] {
    const tags = [sneaker.brand, sneaker.model];

    if (sneaker.details.collaboration) {
      tags.push(sneaker.details.collaboration);
    }

    if (sneaker.details.designer) {
      tags.push(sneaker.details.designer);
    }

    sneaker.details.technology.forEach(tech => tags.push(tech));

    // Add color tags
    sneaker.colorway.split('/').forEach(color => {
      tags.push(color.trim());
    });

    return tags;
  }
}

// Export singleton instance
export const sneakerApi = SneakerApiService.getInstance();