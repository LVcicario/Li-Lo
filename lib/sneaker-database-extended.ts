import { RealSneaker } from './sneaker-database';

export const EXTENDED_SNEAKERS_DATABASE: RealSneaker[] = [
  // Jordan Collection
  {
    id: 'air-jordan-3-white-cement',
    sku: '854262-106',
    name: 'Air Jordan 3 Retro "White Cement"',
    brand: 'Jordan',
    model: 'Air Jordan 3',
    colorway: 'White/Fire Red-Cement Grey',
    retailPrice: 200,
    releaseDate: '2023-03-11',
    description: 'The Air Jordan 3 "White Cement" brings back the iconic elephant print design that made this model famous.',
    story: 'Designed by Tinker Hatfield, the AJ3 was the first Jordan to feature visible Air, the Jumpman logo, and elephant print. This colorway is one of the most iconic in the Jordan lineup.',
    materials: ['Tumbled leather', 'Elephant print overlays', 'Visible Air unit'],
    images: {
      main: 'https://images.stockx.com/images/Air-Jordan-3-Retro-White-Cement-Reimagined-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Air-Jordan-3-Retro-White-Cement-Reimagined-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Air-Jordan-3-Retro-White-Cement-Reimagined-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Air-Jordan-3-Retro-White-Cement-Reimagined-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Air-Jordan-3-Retro-White-Cement-Reimagined-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 8, eu: 41, stock: 4, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 5, priceAdjustment: 0 },
      { us: 10, eu: 44, stock: 6, priceAdjustment: 20 },
      { us: 11, eu: 45, stock: 4, priceAdjustment: 30 },
      { us: 12, eu: 46, stock: 3, priceAdjustment: 40 },
    ],
    marketData: {
      averagePrice: 285,
      volatility: 5.2,
      lastSale: 295,
      changePercent: 2.1,
      salesLast72Hours: 89,
      priceHistory: [
        { date: '2024-01-01', price: 270 },
        { date: '2024-02-01', price: 275 },
        { date: '2024-03-01', price: 285 },
        { date: '2024-04-01', price: 295 },
      ]
    },
    details: {
      style: '854262-106',
      colorCode: 'White/Fire Red-Cement Grey',
      technology: ['Air-Sole heel', 'Elephant print', 'Jumpman logo'],
      designer: 'Tinker Hatfield'
    }
  },
  {
    id: 'air-jordan-11-bred',
    sku: '378037-061',
    name: 'Air Jordan 11 Retro "Bred"',
    brand: 'Jordan',
    model: 'Air Jordan 11',
    colorway: 'Black/Varsity Red-White',
    retailPrice: 225,
    releaseDate: '2019-12-14',
    description: 'The Air Jordan 11 "Bred" features the iconic patent leather design in a black and red colorway.',
    story: 'Michael Jordan wore the "Bred" 11s during the 1996 NBA Finals, leading the Bulls to their fourth championship. The combination of patent leather and mesh was revolutionary.',
    materials: ['Patent leather', 'Mesh upper', 'Carbon fiber plate', 'Translucent outsole'],
    images: {
      main: 'https://images.stockx.com/images/Air-Jordan-11-Retro-Bred-2019-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Air-Jordan-11-Retro-Bred-2019-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Air-Jordan-11-Retro-Bred-2019-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Air-Jordan-11-Retro-Bred-2019-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Air-Jordan-11-Retro-Bred-2019-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 8, eu: 41, stock: 3, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 4, priceAdjustment: 0 },
      { us: 10, eu: 44, stock: 5, priceAdjustment: 30 },
      { us: 11, eu: 45, stock: 3, priceAdjustment: 40 },
      { us: 12, eu: 46, stock: 2, priceAdjustment: 50 },
    ],
    marketData: {
      averagePrice: 385,
      volatility: 6.8,
      lastSale: 395,
      changePercent: 2.5,
      salesLast72Hours: 124,
      priceHistory: [
        { date: '2024-01-01', price: 360 },
        { date: '2024-02-01', price: 370 },
        { date: '2024-03-01', price: 380 },
        { date: '2024-04-01', price: 395 },
      ]
    },
    details: {
      style: '378037-061',
      colorCode: 'Black/Varsity Red-White',
      technology: ['Air-Sole', 'Carbon fiber', 'Patent leather'],
      designer: 'Tinker Hatfield'
    }
  },
  {
    id: 'jordan-5-off-white-sail',
    sku: 'DH8565-100',
    name: 'Air Jordan 5 Retro Off-White Sail',
    brand: 'Jordan',
    model: 'Air Jordan 5',
    colorway: 'Sail/Fire Red-Muslin-Black',
    retailPrice: 225,
    releaseDate: '2020-10-29',
    description: 'Virgil Abloh\'s take on the Air Jordan 5 features a deconstructed design with signature Off-White elements.',
    story: 'Part of Virgil\'s continued collaboration with Jordan Brand, this AJ5 features aged panels, exposed foam, and signature text.',
    materials: ['Deconstructed textile', 'Exposed foam', 'Translucent materials', 'Zip-tie'],
    images: {
      main: 'https://images.stockx.com/images/Air-Jordan-5-Retro-Off-White-Sail-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Air-Jordan-5-Retro-Off-White-Sail-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Air-Jordan-5-Retro-Off-White-Sail-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Air-Jordan-5-Retro-Off-White-Sail-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Air-Jordan-5-Retro-Off-White-Sail-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 8, eu: 41, stock: 1, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 2, priceAdjustment: 100 },
      { us: 10, eu: 44, stock: 2, priceAdjustment: 200 },
      { us: 11, eu: 45, stock: 1, priceAdjustment: 300 },
    ],
    marketData: {
      averagePrice: 1250,
      volatility: 10.5,
      lastSale: 1320,
      changePercent: 3.8,
      salesLast72Hours: 18,
      priceHistory: [
        { date: '2024-01-01', price: 1150 },
        { date: '2024-02-01', price: 1200 },
        { date: '2024-03-01', price: 1280 },
        { date: '2024-04-01', price: 1320 },
      ]
    },
    details: {
      style: 'DH8565-100',
      colorCode: 'Sail/Fire Red-Muslin-Black',
      technology: ['Air-Sole', 'Deconstructed design', 'Off-White branding'],
      collaboration: 'Off-White / Virgil Abloh',
      designer: 'Virgil Abloh'
    }
  },

  // Nike Dunk Collection
  {
    id: 'nike-dunk-low-unc',
    sku: 'DD1391-102',
    name: 'Nike Dunk Low "UNC"',
    brand: 'Nike',
    model: 'Dunk Low',
    colorway: 'White/University Blue',
    retailPrice: 100,
    releaseDate: '2021-06-24',
    description: 'The Nike Dunk Low "UNC" features University of North Carolina colors, paying homage to Michael Jordan\'s alma mater.',
    story: 'Originally created for college basketball, the Dunk has become a streetwear icon. This UNC colorway connects to Jordan\'s college legacy.',
    materials: ['Leather upper', 'Padded collar', 'Foam midsole', 'Rubber outsole'],
    images: {
      main: 'https://images.stockx.com/images/Nike-Dunk-Low-UNC-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Nike-Dunk-Low-UNC-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Nike-Dunk-Low-UNC-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Nike-Dunk-Low-UNC-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Nike-Dunk-Low-UNC-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 7, eu: 40, stock: 5, priceAdjustment: 0 },
      { us: 8, eu: 41, stock: 7, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 8, priceAdjustment: 0 },
      { us: 10, eu: 44, stock: 6, priceAdjustment: 0 },
      { us: 11, eu: 45, stock: 4, priceAdjustment: 10 },
      { us: 12, eu: 46, stock: 3, priceAdjustment: 15 },
    ],
    marketData: {
      averagePrice: 245,
      volatility: 4.5,
      lastSale: 252,
      changePercent: 1.8,
      salesLast72Hours: 156,
      priceHistory: [
        { date: '2024-01-01', price: 230 },
        { date: '2024-02-01', price: 235 },
        { date: '2024-03-01', price: 245 },
        { date: '2024-04-01', price: 252 },
      ]
    },
    details: {
      style: 'DD1391-102',
      colorCode: 'White/University Blue',
      technology: ['Padded collar', 'Perforated toe', 'Classic Dunk tooling'],
      designer: 'Peter Moore'
    }
  },
  {
    id: 'nike-sb-dunk-low-ben-jerrys',
    sku: 'CU3244-100',
    name: 'Nike SB Dunk Low Ben & Jerry\'s Chunky Dunky',
    brand: 'Nike',
    model: 'SB Dunk Low',
    colorway: 'White/Lagoon Pulse-Black-University Gold',
    retailPrice: 100,
    releaseDate: '2020-05-26',
    description: 'A collaboration with Ben & Jerry\'s ice cream, featuring cow print and melting Nike Swooshes.',
    story: 'This playful collaboration combines skateboarding culture with ice cream, featuring cow-inspired patterns and special packaging that resembles an ice cream pint.',
    materials: ['Hairy suede cow print', 'Canvas', 'Leather overlays', 'Special packaging'],
    images: {
      main: 'https://images.stockx.com/images/Nike-SB-Dunk-Low-Ben-Jerrys-Chunky-Dunky-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Nike-SB-Dunk-Low-Ben-Jerrys-Chunky-Dunky-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Nike-SB-Dunk-Low-Ben-Jerrys-Chunky-Dunky-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Nike-SB-Dunk-Low-Ben-Jerrys-Chunky-Dunky-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Nike-SB-Dunk-Low-Ben-Jerrys-Chunky-Dunky-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 8, eu: 41, stock: 1, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 2, priceAdjustment: 50 },
      { us: 10, eu: 44, stock: 2, priceAdjustment: 100 },
      { us: 11, eu: 45, stock: 1, priceAdjustment: 150 },
    ],
    marketData: {
      averagePrice: 1650,
      volatility: 11.2,
      lastSale: 1720,
      changePercent: 4.2,
      salesLast72Hours: 22,
      priceHistory: [
        { date: '2024-01-01', price: 1500 },
        { date: '2024-02-01', price: 1580 },
        { date: '2024-03-01', price: 1650 },
        { date: '2024-04-01', price: 1720 },
      ]
    },
    details: {
      style: 'CU3244-100',
      colorCode: 'White/Lagoon Pulse-Black-University Gold',
      technology: ['Zoom Air', 'Padded tongue', 'Special packaging'],
      collaboration: 'Ben & Jerry\'s',
      designer: 'Nike SB Team'
    }
  },

  // Yeezy Collection
  {
    id: 'yeezy-500-utility-black',
    sku: 'F36640',
    name: 'Adidas Yeezy 500 "Utility Black"',
    brand: 'Adidas',
    model: 'Yeezy 500',
    colorway: 'Utility Black/Utility Black',
    retailPrice: 200,
    releaseDate: '2018-07-07',
    description: 'The Yeezy 500 in an all-black colorway combines retro aesthetics with modern comfort technology.',
    story: 'The Yeezy 500 silhouette draws inspiration from vintage running shoes, featuring adiPRENE+ cushioning for superior comfort.',
    materials: ['Mesh base', 'Suede overlays', 'Leather panels', 'adiPRENE+ cushioning'],
    images: {
      main: 'https://images.stockx.com/images/Adidas-Yeezy-500-Utility-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Adidas-Yeezy-500-Utility-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Adidas-Yeezy-500-Utility-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Adidas-Yeezy-500-Utility-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Adidas-Yeezy-500-Utility-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 7, eu: 40, stock: 3, priceAdjustment: 0 },
      { us: 8, eu: 41, stock: 4, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 5, priceAdjustment: 0 },
      { us: 10, eu: 44, stock: 4, priceAdjustment: 10 },
      { us: 11, eu: 45, stock: 3, priceAdjustment: 20 },
      { us: 12, eu: 46, stock: 2, priceAdjustment: 30 },
    ],
    marketData: {
      averagePrice: 285,
      volatility: 5.8,
      lastSale: 295,
      changePercent: 1.5,
      salesLast72Hours: 87,
      priceHistory: [
        { date: '2024-01-01', price: 270 },
        { date: '2024-02-01', price: 275 },
        { date: '2024-03-01', price: 285 },
        { date: '2024-04-01', price: 295 },
      ]
    },
    details: {
      style: 'F36640',
      colorCode: 'Utility Black/Utility Black',
      technology: ['adiPRENE+', 'Ortholite sockliner', 'Adiprene cushioning'],
      collaboration: 'Kanye West / Yeezy',
      designer: 'Kanye West'
    }
  },
  {
    id: 'yeezy-foam-runner-sand',
    sku: 'FY4567',
    name: 'Adidas Yeezy Foam Runner "Sand"',
    brand: 'Adidas',
    model: 'Yeezy Foam Runner',
    colorway: 'Sand/Sand',
    retailPrice: 80,
    releaseDate: '2021-03-26',
    description: 'The futuristic Yeezy Foam Runner features a one-piece EVA foam construction with unique ventilation holes.',
    story: 'Made from algae-based EVA foam, the Foam Runner represents Yeezy\'s push toward sustainable footwear with avant-garde design.',
    materials: ['EVA foam', 'Algae-based materials', 'One-piece construction'],
    images: {
      main: 'https://images.stockx.com/images/adidas-Yeezy-Foam-Runner-Sand-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/adidas-Yeezy-Foam-Runner-Sand-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/adidas-Yeezy-Foam-Runner-Sand-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/adidas-Yeezy-Foam-Runner-Sand-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/adidas-Yeezy-Foam-Runner-Sand-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 7, eu: 40, stock: 4, priceAdjustment: 0 },
      { us: 8, eu: 41, stock: 5, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 6, priceAdjustment: 0 },
      { us: 10, eu: 44, stock: 5, priceAdjustment: 5 },
      { us: 11, eu: 45, stock: 4, priceAdjustment: 10 },
      { us: 12, eu: 46, stock: 3, priceAdjustment: 15 },
    ],
    marketData: {
      averagePrice: 145,
      volatility: 7.2,
      lastSale: 152,
      changePercent: 2.8,
      salesLast72Hours: 234,
      priceHistory: [
        { date: '2024-01-01', price: 135 },
        { date: '2024-02-01', price: 140 },
        { date: '2024-03-01', price: 145 },
        { date: '2024-04-01', price: 152 },
      ]
    },
    details: {
      style: 'FY4567',
      colorCode: 'Sand/Sand',
      technology: ['EVA foam', 'Sustainable materials', 'Unique ventilation'],
      collaboration: 'Kanye West / Yeezy',
      designer: 'Kanye West & Steven Smith'
    }
  },

  // New Balance Collection
  {
    id: 'new-balance-2002r-protection-pack',
    sku: 'M2002RDA',
    name: 'New Balance 2002R Protection Pack "Phantom"',
    brand: 'New Balance',
    model: '2002R',
    colorway: 'Phantom/Magnet',
    retailPrice: 140,
    releaseDate: '2021-12-01',
    description: 'The 2002R combines early 2000s running tech with modern comfort and premium materials.',
    story: 'Originally a high-performance runner from 2010, the 2002R has been reimagined with upgraded materials while maintaining its technical DNA.',
    materials: ['Mesh upper', 'Suede overlays', 'ABZORB midsole', 'N-ergy cushioning'],
    images: {
      main: 'https://images.stockx.com/images/New-Balance-2002R-Protection-Pack-Phantom-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/New-Balance-2002R-Protection-Pack-Phantom-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/New-Balance-2002R-Protection-Pack-Phantom-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/New-Balance-2002R-Protection-Pack-Phantom-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/New-Balance-2002R-Protection-Pack-Phantom-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 7, eu: 40, stock: 4, priceAdjustment: 0 },
      { us: 8, eu: 41, stock: 5, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 6, priceAdjustment: 0 },
      { us: 10, eu: 44, stock: 5, priceAdjustment: 0 },
      { us: 11, eu: 45, stock: 4, priceAdjustment: 5 },
      { us: 12, eu: 46, stock: 3, priceAdjustment: 10 },
    ],
    marketData: {
      averagePrice: 185,
      volatility: 4.8,
      lastSale: 192,
      changePercent: 1.9,
      salesLast72Hours: 98,
      priceHistory: [
        { date: '2024-01-01', price: 175 },
        { date: '2024-02-01', price: 180 },
        { date: '2024-03-01', price: 185 },
        { date: '2024-04-01', price: 192 },
      ]
    },
    details: {
      style: 'M2002RDA',
      colorCode: 'Phantom/Magnet',
      technology: ['ABZORB', 'N-ergy', 'Stability Web'],
      designer: 'New Balance Design Team'
    }
  },
  {
    id: 'new-balance-990v3-joe-freshgoods',
    sku: 'M990JG3',
    name: 'New Balance 990v3 Joe Freshgoods "Outside Clothes"',
    brand: 'New Balance',
    model: '990v3',
    colorway: 'Tan/Pink/Purple',
    retailPrice: 200,
    releaseDate: '2022-06-17',
    description: 'Joe Freshgoods brings his storytelling to the 990v3 with vibrant colors and personal narratives.',
    story: 'Inspired by Joe\'s memories of getting dressed up for family gatherings, the "Outside Clothes" pack celebrates Black culture and family traditions.',
    materials: ['Pigskin suede', 'Mesh panels', 'ENCAP midsole', 'Vibram outsole'],
    images: {
      main: 'https://images.stockx.com/images/New-Balance-990v3-Joe-Freshgoods-Outside-Clothes-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/New-Balance-990v3-Joe-Freshgoods-Outside-Clothes-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/New-Balance-990v3-Joe-Freshgoods-Outside-Clothes-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/New-Balance-990v3-Joe-Freshgoods-Outside-Clothes-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/New-Balance-990v3-Joe-Freshgoods-Outside-Clothes-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 8, eu: 41, stock: 2, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 3, priceAdjustment: 20 },
      { us: 10, eu: 44, stock: 3, priceAdjustment: 40 },
      { us: 11, eu: 45, stock: 2, priceAdjustment: 60 },
    ],
    marketData: {
      averagePrice: 485,
      volatility: 8.5,
      lastSale: 512,
      changePercent: 3.2,
      salesLast72Hours: 34,
      priceHistory: [
        { date: '2024-01-01', price: 450 },
        { date: '2024-02-01', price: 470 },
        { date: '2024-03-01', price: 490 },
        { date: '2024-04-01', price: 512 },
      ]
    },
    details: {
      style: 'M990JG3',
      colorCode: 'Tan/Pink/Purple',
      technology: ['ENCAP', 'Vibram outsole', 'Made in USA'],
      collaboration: 'Joe Freshgoods',
      designer: 'Joe Freshgoods'
    }
  },

  // Nike Air Max Collection
  {
    id: 'nike-air-max-1-patta-waves',
    sku: 'DH1348-001',
    name: 'Nike Air Max 1 Patta Waves "Monarch"',
    brand: 'Nike',
    model: 'Air Max 1',
    colorway: 'Monarch/Black',
    retailPrice: 150,
    releaseDate: '2021-10-29',
    description: 'Amsterdam boutique Patta reimagines the Air Max 1 with wavy mudguards and vibrant colorblocking.',
    story: 'Celebrating Patta\'s heritage and connection to hip-hop culture, this collaboration features unique wave patterns inspired by music and movement.',
    materials: ['Mesh base', 'Leather overlays', 'Wavy mudguard', 'Air Max cushioning'],
    images: {
      main: 'https://images.stockx.com/images/Nike-Air-Max-1-Patta-Waves-Monarch-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Nike-Air-Max-1-Patta-Waves-Monarch-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Nike-Air-Max-1-Patta-Waves-Monarch-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Nike-Air-Max-1-Patta-Waves-Monarch-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Nike-Air-Max-1-Patta-Waves-Monarch-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 8, eu: 41, stock: 3, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 4, priceAdjustment: 10 },
      { us: 10, eu: 44, stock: 4, priceAdjustment: 20 },
      { us: 11, eu: 45, stock: 3, priceAdjustment: 30 },
    ],
    marketData: {
      averagePrice: 385,
      volatility: 7.2,
      lastSale: 402,
      changePercent: 2.8,
      salesLast72Hours: 45,
      priceHistory: [
        { date: '2024-01-01', price: 360 },
        { date: '2024-02-01', price: 375 },
        { date: '2024-03-01', price: 390 },
        { date: '2024-04-01', price: 402 },
      ]
    },
    details: {
      style: 'DH1348-001',
      colorCode: 'Monarch/Black',
      technology: ['Air Max', 'Wavy design', 'Premium materials'],
      collaboration: 'Patta',
      designer: 'Patta x Nike Design Team'
    }
  },
  {
    id: 'nike-air-max-90-off-white-desert-ore',
    sku: 'AA7293-200',
    name: 'Nike Air Max 90 Off-White Desert Ore',
    brand: 'Nike',
    model: 'Air Max 90',
    colorway: 'Desert Ore/Hyper Jade-Bright Mango',
    retailPrice: 160,
    releaseDate: '2019-02-07',
    description: 'Virgil Abloh deconstructs the Air Max 90 with exposed elements and signature Off-White details.',
    story: 'Part of "The Ten" collection, this AM90 features Virgil\'s signature deconstructed aesthetic with exposed foam and text elements.',
    materials: ['Deconstructed leather', 'Exposed foam', 'Visible Air unit', 'Zip-tie'],
    images: {
      main: 'https://images.stockx.com/images/Nike-Air-Max-90-Off-White-Desert-Ore-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Nike-Air-Max-90-Off-White-Desert-Ore-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Nike-Air-Max-90-Off-White-Desert-Ore-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Nike-Air-Max-90-Off-White-Desert-Ore-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Nike-Air-Max-90-Off-White-Desert-Ore-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 8, eu: 41, stock: 1, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 2, priceAdjustment: 50 },
      { us: 10, eu: 44, stock: 2, priceAdjustment: 100 },
      { us: 11, eu: 45, stock: 1, priceAdjustment: 150 },
    ],
    marketData: {
      averagePrice: 685,
      volatility: 9.5,
      lastSale: 715,
      changePercent: 3.5,
      salesLast72Hours: 28,
      priceHistory: [
        { date: '2024-01-01', price: 650 },
        { date: '2024-02-01', price: 670 },
        { date: '2024-03-01', price: 690 },
        { date: '2024-04-01', price: 715 },
      ]
    },
    details: {
      style: 'AA7293-200',
      colorCode: 'Desert Ore/Hyper Jade-Bright Mango',
      technology: ['Air Max', 'Deconstructed design', 'Off-White branding'],
      collaboration: 'Off-White / Virgil Abloh',
      designer: 'Virgil Abloh'
    }
  },

  // ASICS Collection
  {
    id: 'asics-gel-kayano-14-cream-black',
    sku: '1201A019-103',
    name: 'ASICS Gel-Kayano 14 "Cream/Black"',
    brand: 'ASICS',
    model: 'Gel-Kayano 14',
    colorway: 'Cream/Black',
    retailPrice: 140,
    releaseDate: '2023-02-10',
    description: 'The Gel-Kayano 14 returns with its early 2000s running design and advanced GEL cushioning technology.',
    story: 'Originally designed for long-distance running, the Kayano 14 has found new life in streetwear with its retro-tech aesthetic.',
    materials: ['Mesh upper', 'Synthetic overlays', 'GEL cushioning', 'TRUSSTIC support'],
    images: {
      main: 'https://images.stockx.com/images/ASICS-Gel-Kayano-14-Cream-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/ASICS-Gel-Kayano-14-Cream-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/ASICS-Gel-Kayano-14-Cream-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/ASICS-Gel-Kayano-14-Cream-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/ASICS-Gel-Kayano-14-Cream-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 7, eu: 40, stock: 5, priceAdjustment: 0 },
      { us: 8, eu: 41, stock: 6, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 7, priceAdjustment: 0 },
      { us: 10, eu: 44, stock: 5, priceAdjustment: 0 },
      { us: 11, eu: 45, stock: 4, priceAdjustment: 5 },
      { us: 12, eu: 46, stock: 3, priceAdjustment: 10 },
    ],
    marketData: {
      averagePrice: 165,
      volatility: 3.8,
      lastSale: 172,
      changePercent: 1.5,
      salesLast72Hours: 67,
      priceHistory: [
        { date: '2024-01-01', price: 155 },
        { date: '2024-02-01', price: 160 },
        { date: '2024-03-01', price: 165 },
        { date: '2024-04-01', price: 172 },
      ]
    },
    details: {
      style: '1201A019-103',
      colorCode: 'Cream/Black',
      technology: ['GEL cushioning', 'TRUSSTIC system', 'Impact Guidance System'],
      designer: 'ASICS SportStyle Team'
    }
  },

  // Salomon Collection
  {
    id: 'salomon-xt6-black-ebony',
    sku: 'L41252900',
    name: 'Salomon XT-6 "Black/Ebony"',
    brand: 'Salomon',
    model: 'XT-6',
    colorway: 'Black/Ebony/Silver',
    retailPrice: 200,
    releaseDate: '2023-03-15',
    description: 'Technical trail running shoe adopted by fashion with advanced chassis system and Quicklace technology.',
    story: 'Originally designed for ultra-distance trail running, the XT-6 has become a fashion statement while maintaining its technical prowess.',
    materials: ['Mesh upper', 'TPU overlays', 'EVA midsole', 'Contagrip outsole', 'Quicklace system'],
    images: {
      main: 'https://images.stockx.com/images/Salomon-XT-6-Black-Ebony.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Salomon-XT-6-Black-Ebony.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Salomon-XT-6-Black-Ebony.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Salomon-XT-6-Black-Ebony.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Salomon-XT-6-Black-Ebony.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 7, eu: 40, stock: 4, priceAdjustment: 0 },
      { us: 8, eu: 41, stock: 5, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 6, priceAdjustment: 0 },
      { us: 10, eu: 44, stock: 5, priceAdjustment: 0 },
      { us: 11, eu: 45, stock: 4, priceAdjustment: 10 },
      { us: 12, eu: 46, stock: 3, priceAdjustment: 15 },
    ],
    marketData: {
      averagePrice: 245,
      volatility: 4.5,
      lastSale: 258,
      changePercent: 2.2,
      salesLast72Hours: 78,
      priceHistory: [
        { date: '2024-01-01', price: 230 },
        { date: '2024-02-01', price: 240 },
        { date: '2024-03-01', price: 250 },
        { date: '2024-04-01', price: 258 },
      ]
    },
    details: {
      style: 'L41252900',
      colorCode: 'Black/Ebony/Silver',
      technology: ['ACS chassis', 'Quicklace', 'Contagrip', 'OrthoLite'],
      designer: 'Salomon Design Team'
    }
  }
];

// Export function to get all sneakers
export function getAllSneakers(): RealSneaker[] {
  const { REAL_SNEAKERS_DATABASE } = require('./sneaker-database');
  return [...REAL_SNEAKERS_DATABASE, ...EXTENDED_SNEAKERS_DATABASE];
}

// Export function to get random sneakers
export function getRandomSneakers(count: number): RealSneaker[] {
  const allSneakers = getAllSneakers();
  const shuffled = [...allSneakers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Export function to search sneakers
export function searchExtendedSneakers(query: string): RealSneaker[] {
  const allSneakers = getAllSneakers();
  const lowerQuery = query.toLowerCase();

  return allSneakers.filter(sneaker =>
    sneaker.name.toLowerCase().includes(lowerQuery) ||
    sneaker.brand.toLowerCase().includes(lowerQuery) ||
    sneaker.model.toLowerCase().includes(lowerQuery) ||
    sneaker.colorway.toLowerCase().includes(lowerQuery) ||
    sneaker.sku.toLowerCase().includes(lowerQuery)
  );
}