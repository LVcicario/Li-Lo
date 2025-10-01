// StockX Price Synchronization System
// Synchronise les prix des sneakers avec les données StockX

export interface StockXProduct {
  id: string;
  name: string;
  brand: string;
  retailPrice: number;
  marketPrice: number;
  lastSale: number;
  changeValue: number;
  changePercentage: number;
}

// Mapping entre nos produits et les IDs StockX
export const stockxMapping: Record<string, string> = {
  // Nike
  'nike-sb-dunk-travis': 'travis-scott-x-nike-sb-dunk-low',
  'jordan-1-retro-high': 'air-jordan-1-retro-high-og-chicago-2015',
  'jordan-1-low-travis': 'travis-scott-x-air-jordan-1-low-og-sp-black-phantom',
  'jordan-4-black-cat': 'air-jordan-4-retro-black-cat-2020',
  'air-max-1-patta': 'patta-x-nike-air-max-1-waves-monarch',
  'nike-sb-dunk-low-panda': 'nike-dunk-low-retro-white-black-2021',

  // Adidas/Yeezy
  'yeezy-350-v2': 'adidas-yeezy-boost-350-v2-core-black-red-2022',
  'yeezy-700-waverunner': 'adidas-yeezy-boost-700-wave-runner',
  'yeezy-slide-bone': 'adidas-yeezy-slide-bone-2022',

  // New Balance
  'new-balance-2002r': 'new-balance-2002r-protection-pack-grey',
  'new-balance-990v5': 'new-balance-990v5-grey',

  // Off-White
  'off-white-chicago': 'off-white-x-air-jordan-1-retro-high-og-chicago',
  'off-white-presto': 'off-white-x-nike-air-presto-black-2018',

  // Autres collaborations
  'travis-scott-fragment': 'fragment-design-x-travis-scott-x-air-jordan-1-low',
  'dior-jordan-1': 'dior-x-air-jordan-1-high',

  // Ajoutez plus de mappings selon vos besoins
};

// Prix simulés StockX (en production, ces données viendraient de l'API StockX)
const mockStockXPrices: Record<string, number> = {
  'travis-scott-x-nike-sb-dunk-low': 1850,
  'air-jordan-1-retro-high-og-chicago-2015': 450,
  'travis-scott-x-air-jordan-1-low-og-sp-black-phantom': 1200,
  'air-jordan-4-retro-black-cat-2020': 650,
  'patta-x-nike-air-max-1-waves-monarch': 350,
  'nike-dunk-low-retro-white-black-2021': 180,
  'adidas-yeezy-boost-350-v2-core-black-red-2022': 380,
  'adidas-yeezy-boost-700-wave-runner': 450,
  'adidas-yeezy-slide-bone-2022': 150,
  'new-balance-2002r-protection-pack-grey': 220,
  'new-balance-990v5-grey': 280,
  'off-white-x-air-jordan-1-retro-high-og-chicago': 5500,
  'off-white-x-nike-air-presto-black-2018': 2200,
  'fragment-design-x-travis-scott-x-air-jordan-1-low': 3800,
  'dior-x-air-jordan-1-high': 8500,
};

// Fonction pour récupérer le prix StockX d'un produit
export async function getStockXPrice(productId: string): Promise<number | null> {
  const stockxId = stockxMapping[productId];

  if (!stockxId) {
    console.warn(`No StockX mapping found for product: ${productId}`);
    return null;
  }

  try {
    // En production, faire un appel API réel à StockX
    // const response = await fetch(`https://api.stockx.com/products/${stockxId}/market`);
    // const data = await response.json();
    // return data.market.lowestAsk;

    // Pour l'instant, retourner les prix simulés
    const price = mockStockXPrices[stockxId];

    if (!price) {
      console.warn(`No mock price found for StockX product: ${stockxId}`);
      return null;
    }

    // Ajouter une variation aléatoire de ±5% pour simuler les fluctuations du marché
    const variation = 0.95 + Math.random() * 0.1;
    return Math.round(price * variation);
  } catch (error) {
    console.error('Error fetching StockX price:', error);
    return null;
  }
}

// Fonction pour synchroniser tous les prix
export async function syncAllStockXPrices(): Promise<Map<string, number>> {
  const priceUpdates = new Map<string, number>();

  for (const [productId, stockxId] of Object.entries(stockxMapping)) {
    const price = await getStockXPrice(productId);
    if (price) {
      priceUpdates.set(productId, price);
    }
  }

  return priceUpdates;
}

// Fonction pour obtenir les tendances de prix
export function getPriceTrend(currentPrice: number, previousPrice: number): {
  trend: 'up' | 'down' | 'stable';
  percentage: number;
} {
  const difference = currentPrice - previousPrice;
  const percentage = (difference / previousPrice) * 100;

  let trend: 'up' | 'down' | 'stable';
  if (percentage > 1) {
    trend = 'up';
  } else if (percentage < -1) {
    trend = 'down';
  } else {
    trend = 'stable';
  }

  return { trend, percentage: Math.round(percentage * 10) / 10 };
}

// Fonction pour formater le prix selon la devise
export function formatStockXPrice(price: number, currency: 'EUR' | 'USD' = 'EUR'): string {
  const exchangeRate = 1.10; // 1 EUR = 1.10 USD

  if (currency === 'USD') {
    const usdPrice = price * exchangeRate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(usdPrice);
  } else {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }
}

// Fonction pour obtenir les données de marché complètes
export async function getMarketData(productId: string): Promise<{
  currentPrice: number | null;
  retailPrice: number;
  profitMargin: number;
  priceHistory: Array<{ date: string; price: number }>;
} | null> {
  const currentPrice = await getStockXPrice(productId);

  if (!currentPrice) {
    return null;
  }

  // Prix de vente conseillé (simulé)
  const retailPrice = Math.round(currentPrice * 0.7); // 70% du prix StockX
  const profitMargin = ((currentPrice - retailPrice) / retailPrice) * 100;

  // Historique des prix (simulé sur 7 jours)
  const priceHistory: Array<{ date: string; price: number }> = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Variation aléatoire de ±3% par jour
    const variation = 0.97 + Math.random() * 0.06;
    const historicalPrice = Math.round(currentPrice * variation);

    priceHistory.push({
      date: date.toISOString().split('T')[0],
      price: historicalPrice,
    });
  }

  return {
    currentPrice,
    retailPrice,
    profitMargin: Math.round(profitMargin),
    priceHistory,
  };
}