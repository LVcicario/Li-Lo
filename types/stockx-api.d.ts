// =============================================
// TYPE DECLARATIONS FOR STOCKX-API MODULE
// Third-party package lacks official TypeScript support
// =============================================

declare module 'stockx-api' {
  export interface StockXProduct {
    uuid: string;
    title: string;
    styleID: string;
    retailPrice?: number;
    brand?: string;
    category?: string;
    releaseDate?: string;
    colorway?: string;
    description?: string;
    media?: {
      imageUrl?: string;
      thumbUrl?: string;
      smallImageUrl?: string;
    };
    market?: {
      lowestAsk?: number;
      highestBid?: number;
      lastSale?: number;
      salesLast72Hours?: number;
    };
    traits?: Array<{
      name: string;
      value: string;
    }>;
  }

  export interface SearchOptions {
    limit?: number;
    page?: number;
  }

  export interface SearchResult {
    Products?: StockXProduct[];
    pagination?: {
      limit: number;
      page: number;
      total: number;
    };
  }

  export default class StockX {
    constructor();
    searchProducts(query: string, options?: SearchOptions): Promise<SearchResult>;
    getProduct(productId: string): Promise<StockXProduct>;
    getTrending(options?: SearchOptions): Promise<SearchResult>;
  }
}