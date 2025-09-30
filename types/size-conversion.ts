// =============================================
// SIZE CONVERSION TYPES - Li-Lo E-Commerce Platform
// EU/US/UK/CM Sneaker Size Conversions
// =============================================

export type SizeType = 'EU' | 'US' | 'UK' | 'CM';
export type Gender = 'men' | 'women' | 'unisex';

export interface SizeConversion {
  id: string;
  eu_size: number;
  us_men_size: string;
  us_women_size: string;
  uk_size?: string;
  cm_size?: number;
}

export interface Size {
  eu: number;
  us_men: string;
  us_women: string;
  uk: string;
  cm: number;
}

// Standard EU to US/UK/CM conversion table
export const SIZE_CHART: Size[] = [
  { eu: 37, us_men: '5.5-6', us_women: '6.5-7', uk: '4.5-5', cm: 23.5 },
  { eu: 38, us_men: '6-6.5', us_women: '7.5-8', uk: '5-5.5', cm: 24.0 },
  { eu: 39, us_men: '7-7.5', us_women: '8.5-9', uk: '6-6.5', cm: 24.5 },
  { eu: 40, us_men: '7.5-8', us_women: '9-9.5', uk: '6.5-7', cm: 25.0 },
  { eu: 41, us_men: '8-8.5', us_women: '9.5-10', uk: '7-7.5', cm: 25.5 },
  { eu: 42, us_men: '9-9.5', us_women: '10.5-11', uk: '8-8.5', cm: 26.0 },
  { eu: 43, us_men: '10-10.5', us_women: '11-11.5', uk: '9-9.5', cm: 27.0 },
  { eu: 44, us_men: '11-11.5', us_women: '12-12.5', uk: '10-10.5', cm: 27.5 },
  { eu: 45, us_men: '12-12.5', us_women: '13', uk: '11-11.5', cm: 28.0 },
  { eu: 46, us_men: '13', us_women: '13.5', uk: '12', cm: 28.5 },
  { eu: 47, us_men: '14', us_women: '14', uk: '13', cm: 29.0 },
];

// Helper functions for size conversion
export function convertEUtoUS(euSize: number, gender: Gender = 'men'): string {
  const size = SIZE_CHART.find(s => s.eu === euSize);
  if (!size) return euSize.toString();

  return gender === 'women' ? size.us_women : size.us_men;
}

export function convertEUtoUK(euSize: number): string {
  const size = SIZE_CHART.find(s => s.eu === euSize);
  return size?.uk || euSize.toString();
}

export function convertEUtoCM(euSize: number): number | null {
  const size = SIZE_CHART.find(s => s.eu === euSize);
  return size?.cm || null;
}

export function getAllSizes(): number[] {
  return SIZE_CHART.map(s => s.eu);
}

export function getSizeDetails(euSize: number): Size | null {
  return SIZE_CHART.find(s => s.eu === euSize) || null;
}

export function formatSizeDisplay(
  euSize: number,
  displayType: SizeType = 'EU',
  gender: Gender = 'men'
): string {
  const size = getSizeDetails(euSize);
  if (!size) return euSize.toString();

  switch (displayType) {
    case 'EU':
      return `EU ${size.eu}`;
    case 'US':
      const usSize = gender === 'women' ? size.us_women : size.us_men;
      return `US ${usSize}`;
    case 'UK':
      return `UK ${size.uk}`;
    case 'CM':
      return `${size.cm} cm`;
    default:
      return `EU ${size.eu}`;
  }
}

export function getSizeConversionTable(): {
  eu: number;
  us_men: string;
  us_women: string;
  uk: string;
  cm: number;
}[] {
  return SIZE_CHART;
}

// Validate if a size is available in our range
export function isValidSize(euSize: number): boolean {
  return SIZE_CHART.some(s => s.eu === euSize);
}

// Get nearest available size if exact match not found
export function getNearestSize(euSize: number): number {
  const sizes = getAllSizes();

  if (isValidSize(euSize)) return euSize;

  // Find nearest
  const nearest = sizes.reduce((prev, curr) => {
    return Math.abs(curr - euSize) < Math.abs(prev - euSize) ? curr : prev;
  });

  return nearest;
}

// Parse US size back to EU (approximate)
export function parseUStoEU(usSize: string, gender: Gender = 'men'): number | null {
  const size = SIZE_CHART.find(s => {
    const targetSize = gender === 'women' ? s.us_women : s.us_men;
    return targetSize.includes(usSize.replace(/[^0-9.]/g, ''));
  });

  return size?.eu || null;
}