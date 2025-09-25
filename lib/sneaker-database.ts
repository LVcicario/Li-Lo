// Real sneaker product database with actual StockX-style data
export interface RealSneaker {
  id: string;
  sku: string;
  name: string;
  brand: string;
  model: string;
  colorway: string;
  retailPrice: number;
  releaseDate: string;
  description: string;
  story: string;
  materials: string[];
  images: {
    main: string;
    side: string;
    back: string;
    sole: string;
    detail: string;
    box?: string;
  };
  sizes: {
    us: number;
    eu: number;
    stock: number;
    priceAdjustment: number;
  }[];
  marketData: {
    averagePrice: number;
    volatility: number;
    lastSale: number;
    changePercent: number;
    salesLast72Hours: number;
    priceHistory: { date: string; price: number }[];
  };
  details: {
    style: string;
    colorCode: string;
    technology: string[];
    collaboration?: string;
    designer?: string;
  };
}

// High-quality CDN URLs for real sneaker images
const IMAGE_CDN = {
  jordan1: {
    chicago: {
      main: 'https://images.stockx.com/images/Air-Jordan-1-Retro-Chicago-2015-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Air-Jordan-1-Retro-Chicago-2015-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Air-Jordan-1-Retro-Chicago-2015-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Air-Jordan-1-Retro-Chicago-2015-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Air-Jordan-1-Retro-Chicago-2015-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    bred: {
      main: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-Bred-Banned-2016-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-Bred-Banned-2016-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-Bred-Banned-2016-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-Bred-Banned-2016-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-Bred-Banned-2016-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    travisScott: {
      main: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-Travis-Scott-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-Travis-Scott-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-Travis-Scott-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-Travis-Scott-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-Travis-Scott-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    }
  },
  dunk: {
    panda: {
      main: 'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    }
  },
  yeezy: {
    waverunner: {
      main: 'https://images.stockx.com/images/Adidas-Yeezy-Boost-700-Wave-Runner-Solid-Grey-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Adidas-Yeezy-Boost-700-Wave-Runner-Solid-Grey-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Adidas-Yeezy-Boost-700-Wave-Runner-Solid-Grey-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Adidas-Yeezy-Boost-700-Wave-Runner-Solid-Grey-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Adidas-Yeezy-Boost-700-Wave-Runner-Solid-Grey-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    }
  }
};

// Comprehensive real sneaker database
export const REAL_SNEAKERS_DATABASE: RealSneaker[] = [
  {
    id: 'air-jordan-1-chicago-2015',
    sku: '555088-101',
    name: 'Air Jordan 1 Retro High OG "Chicago"',
    brand: 'Jordan',
    model: 'Air Jordan 1 High',
    colorway: 'White/Black-Varsity Red',
    retailPrice: 160,
    releaseDate: '2015-05-30',
    description: 'The Air Jordan 1 Retro High OG "Chicago" is a legendary colorway that pays homage to Michael Jordan\'s NBA team. This iconic sneaker features the classic "Bred" color blocking in white, black, and varsity red.',
    story: 'Originally banned by the NBA for violating uniform rules, the Air Jordan 1 "Chicago" became a symbol of rebellion and excellence. Michael Jordan wore these during his 1985 Rookie of the Year season, making them one of the most coveted sneakers in history. The 2015 retro brought back the original high-top silhouette with Nike Air branding on the tongue.',
    materials: ['Full-grain leather upper', 'Nylon tongue', 'Rubber outsole', 'Air-Sole unit', 'Perforated toe box'],
    images: IMAGE_CDN.jordan1.chicago,
    sizes: [
      { us: 7, eu: 40, stock: 2, priceAdjustment: 0 },
      { us: 8, eu: 41, stock: 3, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 5, priceAdjustment: 0 },
      { us: 10, eu: 44, stock: 4, priceAdjustment: 20 },
      { us: 11, eu: 45, stock: 3, priceAdjustment: 30 },
      { us: 12, eu: 46, stock: 2, priceAdjustment: 40 },
    ],
    marketData: {
      averagePrice: 450,
      volatility: 8.5,
      lastSale: 465,
      changePercent: 3.2,
      salesLast72Hours: 127,
      priceHistory: [
        { date: '2024-01-01', price: 420 },
        { date: '2024-02-01', price: 435 },
        { date: '2024-03-01', price: 450 },
        { date: '2024-04-01', price: 465 },
      ]
    },
    details: {
      style: '555088-101',
      colorCode: 'White/Black-Varsity Red',
      technology: ['Air-Sole cushioning', 'High-top support', 'Circular traction pattern'],
      designer: 'Peter Moore'
    }
  },
  {
    id: 'air-jordan-1-bred-banned-2016',
    sku: '555088-001',
    name: 'Air Jordan 1 Retro High OG "Bred Banned"',
    brand: 'Jordan',
    model: 'Air Jordan 1 High',
    colorway: 'Black/Varsity Red-White',
    retailPrice: 160,
    releaseDate: '2016-09-03',
    description: 'The Air Jordan 1 "Bred" is the shoe that started it all. Known as "Banned" for being prohibited by the NBA, this colorway became a symbol of defiance and excellence.',
    story: 'In 1985, the NBA banned the Air Jordan 1 for not meeting the league\'s uniform policy. Nike turned this into a marketing goldmine with the "Banned" campaign, paying Jordan\'s fines and creating one of the most iconic sneaker stories ever. The 2016 release featured remastered quality with the original "Nike Air" branding.',
    materials: ['Premium leather construction', 'Nylon tongue with Nike Air label', 'Rubber cupsole', 'Encapsulated Air-Sole unit'],
    images: IMAGE_CDN.jordan1.bred,
    sizes: [
      { us: 7, eu: 40, stock: 1, priceAdjustment: 0 },
      { us: 8, eu: 41, stock: 2, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 3, priceAdjustment: 10 },
      { us: 10, eu: 44, stock: 4, priceAdjustment: 20 },
      { us: 11, eu: 45, stock: 2, priceAdjustment: 30 },
      { us: 12, eu: 46, stock: 1, priceAdjustment: 40 },
    ],
    marketData: {
      averagePrice: 380,
      volatility: 6.2,
      lastSale: 395,
      changePercent: 2.1,
      salesLast72Hours: 98,
      priceHistory: [
        { date: '2024-01-01', price: 360 },
        { date: '2024-02-01', price: 370 },
        { date: '2024-03-01', price: 385 },
        { date: '2024-04-01', price: 395 },
      ]
    },
    details: {
      style: '555088-001',
      colorCode: 'Black/Varsity Red-White',
      technology: ['Air-Sole cushioning', 'High-top ankle support', 'Circular outsole traction'],
      designer: 'Peter Moore'
    }
  },
  {
    id: 'air-jordan-1-travis-scott',
    sku: 'CD4487-100',
    name: 'Air Jordan 1 Retro High Travis Scott',
    brand: 'Jordan',
    model: 'Air Jordan 1 High',
    colorway: 'Mocha/Dark Mocha-University Red-Black',
    retailPrice: 175,
    releaseDate: '2019-05-11',
    description: 'Travis Scott\'s take on the Air Jordan 1 features a reversed Swoosh, hidden stash pocket, and premium suede construction that made it an instant grail.',
    story: 'Houston rapper Travis Scott brought his Cactus Jack aesthetic to the Air Jordan 1, creating one of the most hyped releases of 2019. The reversed Swoosh became an instant icon, while the hidden stash pocket behind the Swoosh added functionality. The earthy tones and premium materials elevated this collaboration to grail status.',
    materials: ['Premium nubuck and suede', 'Canvas collar', 'Leather Swoosh', 'Hidden stash pocket', 'Cactus Jack branding'],
    images: IMAGE_CDN.jordan1.travisScott,
    sizes: [
      { us: 7, eu: 40, stock: 0, priceAdjustment: 0 },
      { us: 8, eu: 41, stock: 1, priceAdjustment: 100 },
      { us: 9, eu: 42.5, stock: 1, priceAdjustment: 150 },
      { us: 10, eu: 44, stock: 2, priceAdjustment: 200 },
      { us: 11, eu: 45, stock: 1, priceAdjustment: 250 },
      { us: 12, eu: 46, stock: 0, priceAdjustment: 300 },
    ],
    marketData: {
      averagePrice: 1850,
      volatility: 12.5,
      lastSale: 1920,
      changePercent: 5.8,
      salesLast72Hours: 42,
      priceHistory: [
        { date: '2024-01-01', price: 1650 },
        { date: '2024-02-01', price: 1750 },
        { date: '2024-03-01', price: 1820 },
        { date: '2024-04-01', price: 1920 },
      ]
    },
    details: {
      style: 'CD4487-100',
      colorCode: 'Mocha/Dark Mocha-University Red',
      technology: ['Air-Sole unit', 'Reversed Swoosh design', 'Hidden pocket'],
      collaboration: 'Travis Scott / Cactus Jack',
      designer: 'Travis Scott'
    }
  },
  {
    id: 'nike-dunk-low-panda',
    sku: 'DD1391-100',
    name: 'Nike Dunk Low Retro "Panda"',
    brand: 'Nike',
    model: 'Dunk Low',
    colorway: 'White/Black',
    retailPrice: 100,
    releaseDate: '2021-01-14',
    description: 'The Nike Dunk Low "Panda" features a clean black and white colorway that became one of the most popular sneakers of the 2020s.',
    story: 'Originally a basketball shoe from 1985, the Dunk found new life in skateboarding and streetwear. The "Panda" colorway\'s simple black and white design made it incredibly versatile, leading to massive demand and countless restocks. It became the go-to sneaker for both newcomers and seasoned collectors.',
    materials: ['Leather upper', 'Padded tongue', 'Foam midsole', 'Rubber outsole with pivot circle'],
    images: IMAGE_CDN.dunk.panda,
    sizes: [
      { us: 7, eu: 40, stock: 8, priceAdjustment: 0 },
      { us: 8, eu: 41, stock: 10, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 12, priceAdjustment: 0 },
      { us: 10, eu: 44, stock: 15, priceAdjustment: 0 },
      { us: 11, eu: 45, stock: 10, priceAdjustment: 0 },
      { us: 12, eu: 46, stock: 8, priceAdjustment: 0 },
    ],
    marketData: {
      averagePrice: 125,
      volatility: 3.2,
      lastSale: 128,
      changePercent: -1.5,
      salesLast72Hours: 342,
      priceHistory: [
        { date: '2024-01-01', price: 135 },
        { date: '2024-02-01', price: 130 },
        { date: '2024-03-01', price: 125 },
        { date: '2024-04-01', price: 128 },
      ]
    },
    details: {
      style: 'DD1391-100',
      colorCode: 'White/Black-White',
      technology: ['Padded collar', 'Perforated toe box', 'Circular traction pattern'],
      designer: 'Peter Moore'
    }
  },
  {
    id: 'adidas-yeezy-700-waverunner',
    sku: 'B75571',
    name: 'Adidas Yeezy Boost 700 "Wave Runner"',
    brand: 'Adidas',
    model: 'Yeezy Boost 700',
    colorway: 'Solid Grey/Chalk White/Core Black',
    retailPrice: 300,
    releaseDate: '2017-11-01',
    description: 'The Yeezy 700 "Wave Runner" brought the dad shoe trend to the forefront with its retro-inspired design and premium construction.',
    story: 'Kanye West\'s Yeezy 700 "Wave Runner" marked a departure from the minimalist 350 silhouette. The chunky, layered design drew inspiration from 90s running shoes, initially dividing opinion before becoming a cultural phenomenon. The mix of premium materials and Boost cushioning created the perfect blend of luxury and comfort.',
    materials: ['Mesh base with suede overlays', 'Premium leather panels', 'Reflective 3M details', 'Full-length Boost midsole', 'Rubber outsole'],
    images: IMAGE_CDN.yeezy.waverunner,
    sizes: [
      { us: 7, eu: 40, stock: 2, priceAdjustment: 0 },
      { us: 8, eu: 41, stock: 3, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 4, priceAdjustment: 0 },
      { us: 10, eu: 44, stock: 5, priceAdjustment: 20 },
      { us: 11, eu: 45, stock: 3, priceAdjustment: 30 },
      { us: 12, eu: 46, stock: 2, priceAdjustment: 40 },
    ],
    marketData: {
      averagePrice: 420,
      volatility: 5.8,
      lastSale: 435,
      changePercent: 2.3,
      salesLast72Hours: 67,
      priceHistory: [
        { date: '2024-01-01', price: 400 },
        { date: '2024-02-01', price: 410 },
        { date: '2024-03-01', price: 425 },
        { date: '2024-04-01', price: 435 },
      ]
    },
    details: {
      style: 'B75571',
      colorCode: 'Solid Grey/Chalk White/Core Black',
      technology: ['Boost cushioning', '3M reflective elements', 'OrthoLite sockliner'],
      collaboration: 'Kanye West / Yeezy',
      designer: 'Kanye West & Steven Smith'
    }
  },
  {
    id: 'new-balance-550-white-green',
    sku: 'BB550WT1',
    name: 'New Balance 550 "White Green"',
    brand: 'New Balance',
    model: '550',
    colorway: 'White/Green',
    retailPrice: 110,
    releaseDate: '2021-09-24',
    description: 'The New Balance 550 brings back the late 80s basketball heritage with a clean white leather upper and green accents.',
    story: 'Originally released in 1989, the 550 was forgotten until Aimé Leon Dore brought it back in 2020. This white and green colorway became an instant classic, combining vintage basketball aesthetics with modern street style appeal.',
    materials: ['Full-grain leather upper', 'Mesh tongue', 'EVA midsole', 'Rubber outsole'],
    images: {
      main: 'https://images.stockx.com/images/New-Balance-550-White-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/New-Balance-550-White-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/New-Balance-550-White-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/New-Balance-550-White-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/New-Balance-550-White-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 7, eu: 40, stock: 6, priceAdjustment: 0 },
      { us: 8, eu: 41, stock: 8, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 10, priceAdjustment: 0 },
      { us: 10, eu: 44, stock: 7, priceAdjustment: 0 },
      { us: 11, eu: 45, stock: 5, priceAdjustment: 10 },
      { us: 12, eu: 46, stock: 3, priceAdjustment: 15 },
    ],
    marketData: {
      averagePrice: 155,
      volatility: 4.2,
      lastSale: 162,
      changePercent: 1.8,
      salesLast72Hours: 89,
      priceHistory: [
        { date: '2024-01-01', price: 145 },
        { date: '2024-02-01', price: 150 },
        { date: '2024-03-01', price: 158 },
        { date: '2024-04-01', price: 162 },
      ]
    },
    details: {
      style: 'BB550WT1',
      colorCode: 'White/Team Forest Green',
      technology: ['ABZORB cushioning', 'Pigskin leather', 'Stability web'],
      designer: 'Steven Smith'
    }
  },
  {
    id: 'off-white-chicago-1',
    sku: 'AA3834-101',
    name: 'Air Jordan 1 Retro High Off-White Chicago',
    brand: 'Jordan',
    model: 'Air Jordan 1',
    colorway: 'White/Black-Varsity Red',
    retailPrice: 190,
    releaseDate: '2017-09-09',
    description: 'Virgil Abloh\'s deconstructed take on the iconic Air Jordan 1 Chicago, part of "The Ten" collection.',
    story: 'Part of Virgil Abloh\'s groundbreaking "The Ten" collaboration with Nike, this deconstructed Air Jordan 1 features exposed foam, off-center tongue, and signature Off-White text. It represents the intersection of high fashion and streetwear.',
    materials: ['Deconstructed leather', 'Exposed foam padding', 'Zip-tie tag', 'Helvetica text', 'Orange tab'],
    images: {
      main: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-Off-White-Chicago-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-Off-White-Chicago-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-Off-White-Chicago-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-Off-White-Chicago-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-Off-White-Chicago-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 8, eu: 41, stock: 1, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 1, priceAdjustment: 100 },
      { us: 10, eu: 44, stock: 2, priceAdjustment: 200 },
      { us: 11, eu: 45, stock: 1, priceAdjustment: 300 },
    ],
    marketData: {
      averagePrice: 5200,
      volatility: 12.5,
      lastSale: 5500,
      changePercent: 4.2,
      salesLast72Hours: 8,
      priceHistory: [
        { date: '2024-01-01', price: 4800 },
        { date: '2024-02-01', price: 5000 },
        { date: '2024-03-01', price: 5300 },
        { date: '2024-04-01', price: 5500 },
      ]
    },
    details: {
      style: 'AA3834-101',
      colorCode: 'White/Black-Varsity Red',
      technology: ['Air-Sole unit', 'Deconstructed design', 'Off-White branding'],
      collaboration: 'Off-White / Virgil Abloh',
      designer: 'Virgil Abloh'
    }
  },
  {
    id: 'nike-sb-dunk-low-travis-scott',
    sku: 'CT5053-001',
    name: 'Nike SB Dunk Low Travis Scott',
    brand: 'Nike',
    model: 'SB Dunk Low',
    colorway: 'Black/Black-Dark Chocolate',
    retailPrice: 150,
    releaseDate: '2020-02-29',
    description: 'Travis Scott\'s take on the SB Dunk Low features a unique patchwork design with playful details.',
    story: 'Travis Scott brought his signature aesthetic to the SB Dunk with a design featuring bandana and plaid patterns, rope laces, and hidden stash pockets. The special box included matches and a grinder-inspired accessory.',
    materials: ['Canvas and suede upper', 'Paisley and plaid patterns', 'Rope laces', 'Hidden pocket behind tongue'],
    images: {
      main: 'https://images.stockx.com/images/Nike-SB-Dunk-Low-Travis-Scott-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Nike-SB-Dunk-Low-Travis-Scott-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Nike-SB-Dunk-Low-Travis-Scott-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Nike-SB-Dunk-Low-Travis-Scott-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Nike-SB-Dunk-Low-Travis-Scott-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 7, eu: 40, stock: 2, priceAdjustment: 0 },
      { us: 8, eu: 41, stock: 3, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 4, priceAdjustment: 50 },
      { us: 10, eu: 44, stock: 3, priceAdjustment: 100 },
      { us: 11, eu: 45, stock: 2, priceAdjustment: 150 },
      { us: 12, eu: 46, stock: 1, priceAdjustment: 200 },
    ],
    marketData: {
      averagePrice: 1850,
      volatility: 9.2,
      lastSale: 1920,
      changePercent: 3.5,
      salesLast72Hours: 24,
      priceHistory: [
        { date: '2024-01-01', price: 1700 },
        { date: '2024-02-01', price: 1780 },
        { date: '2024-03-01', price: 1850 },
        { date: '2024-04-01', price: 1920 },
      ]
    },
    details: {
      style: 'CT5053-001',
      colorCode: 'Black/Black-Dark Chocolate',
      technology: ['Zoom Air cushioning', 'Padded tongue', 'Special packaging'],
      collaboration: 'Travis Scott / Cactus Jack',
      designer: 'Travis Scott'
    }
  },
  {
    id: 'air-jordan-4-black-cat',
    sku: 'CU1110-010',
    name: 'Air Jordan 4 Retro "Black Cat"',
    brand: 'Jordan',
    model: 'Air Jordan 4',
    colorway: 'Black/Black-Light Graphite',
    retailPrice: 190,
    releaseDate: '2020-01-22',
    description: 'The Air Jordan 4 "Black Cat" features an all-black colorway inspired by Michael Jordan\'s nickname.',
    story: 'Named after Michael Jordan\'s "Black Cat" nickname, this monochromatic Air Jordan 4 features premium black nubuck throughout. The stealthy colorway has made it a favorite for both on and off-court wear.',
    materials: ['Black nubuck upper', 'Visible Air cushioning', 'Graphite accents', 'Rubber outsole'],
    images: {
      main: 'https://images.stockx.com/images/Air-Jordan-4-Retro-Black-Cat-2020-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Air-Jordan-4-Retro-Black-Cat-2020-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Air-Jordan-4-Retro-Black-Cat-2020-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Air-Jordan-4-Retro-Black-Cat-2020-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Air-Jordan-4-Retro-Black-Cat-2020-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
    },
    sizes: [
      { us: 7, eu: 40, stock: 4, priceAdjustment: 0 },
      { us: 8, eu: 41, stock: 5, priceAdjustment: 0 },
      { us: 9, eu: 42.5, stock: 6, priceAdjustment: 0 },
      { us: 10, eu: 44, stock: 5, priceAdjustment: 20 },
      { us: 11, eu: 45, stock: 4, priceAdjustment: 30 },
      { us: 12, eu: 46, stock: 3, priceAdjustment: 40 },
    ],
    marketData: {
      averagePrice: 520,
      volatility: 6.5,
      lastSale: 535,
      changePercent: 2.8,
      salesLast72Hours: 56,
      priceHistory: [
        { date: '2024-01-01', price: 490 },
        { date: '2024-02-01', price: 505 },
        { date: '2024-03-01', price: 520 },
        { date: '2024-04-01', price: 535 },
      ]
    },
    details: {
      style: 'CU1110-010',
      colorCode: 'Black/Black-Light Graphite',
      technology: ['Air-Sole heel unit', 'Visible Air window', 'Herringbone traction'],
      designer: 'Tinker Hatfield'
    }
  },
  {
    id: 'adidas-yeezy-350-v2-zebra',
    sku: 'CP9654',
    name: 'Adidas Yeezy Boost 350 V2 "Zebra"',
    brand: 'Adidas',
    model: 'Yeezy Boost 350 V2',
    colorway: 'White/Core Black/Red',
    retailPrice: 220,
    releaseDate: '2017-02-25',
    description: 'The Yeezy 350 V2 "Zebra" features a striking black and white striped Primeknit upper with red "SPLY-350" branding.',
    story: 'One of the most recognizable Yeezy colorways, the "Zebra" initially released in limited quantities, causing massive demand. Multiple restocks have made it more accessible, but it remains a staple in the Yeezy lineup.',
    materials: ['Primeknit upper', 'Boost midsole', 'Rubber outsole', 'Rope laces'],
    images: {
      main: 'https://images.stockx.com/images/Adidas-Yeezy-Boost-350-V2-Zebra-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      side: 'https://images.stockx.com/images/Adidas-Yeezy-Boost-350-V2-Zebra-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      back: 'https://images.stockx.com/images/Adidas-Yeezy-Boost-350-V2-Zebra-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      sole: 'https://images.stockx.com/images/Adidas-Yeezy-Boost-350-V2-Zebra-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      detail: 'https://images.stockx.com/images/Adidas-Yeezy-Boost-350-V2-Zebra-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90'
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
      volatility: 4.8,
      lastSale: 295,
      changePercent: 1.5,
      salesLast72Hours: 112,
      priceHistory: [
        { date: '2024-01-01', price: 270 },
        { date: '2024-02-01', price: 275 },
        { date: '2024-03-01', price: 285 },
        { date: '2024-04-01', price: 295 },
      ]
    },
    details: {
      style: 'CP9654',
      colorCode: 'White/Core Black/Red',
      technology: ['Boost cushioning', 'Primeknit construction', 'TPU sidewalls'],
      collaboration: 'Kanye West / Yeezy',
      designer: 'Kanye West'
    }
  }
];

// Function to get random market data for demo purposes
export function generateMarketData(basePrice: number) {
  const volatility = Math.random() * 15 + 5; // 5-20% volatility
  const changePercent = (Math.random() - 0.5) * 10; // -5% to +5%
  const averagePrice = basePrice * (1 + Math.random() * 0.5); // Up to 50% above retail

  return {
    averagePrice: Math.round(averagePrice),
    volatility,
    lastSale: Math.round(averagePrice * (1 + changePercent / 100)),
    changePercent,
    salesLast72Hours: Math.floor(Math.random() * 200 + 50),
    priceHistory: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: Math.round(averagePrice * (0.9 + Math.random() * 0.2))
    }))
  };
}

// Function to generate size availability
export function generateSizeAvailability() {
  const sizes = [
    { us: 7, eu: 40 },
    { us: 7.5, eu: 40.5 },
    { us: 8, eu: 41 },
    { us: 8.5, eu: 42 },
    { us: 9, eu: 42.5 },
    { us: 9.5, eu: 43 },
    { us: 10, eu: 44 },
    { us: 10.5, eu: 44.5 },
    { us: 11, eu: 45 },
    { us: 11.5, eu: 45.5 },
    { us: 12, eu: 46 },
    { us: 13, eu: 47.5 }
  ];

  return sizes.map(size => ({
    ...size,
    stock: Math.floor(Math.random() * 10),
    priceAdjustment: size.us >= 10 ? (size.us - 9) * 20 : 0
  }));
}

// Extended product catalog with more real sneakers
export const EXTENDED_CATALOG = [
  // More Jordan 1s
  {
    name: 'Air Jordan 1 Retro High OG "Royal Blue"',
    sku: '555088-007',
    colorway: 'Black/Royal Blue-White',
    retailPrice: 170,
    releaseDate: '2017-04-01'
  },
  {
    name: 'Air Jordan 1 Retro High OG "Shadow"',
    sku: '555088-013',
    colorway: 'Black/Medium Grey-White',
    retailPrice: 160,
    releaseDate: '2018-04-14'
  },
  {
    name: 'Air Jordan 1 Retro High OG "Court Purple"',
    sku: '555088-500',
    colorway: 'Court Purple/White-Black',
    retailPrice: 170,
    releaseDate: '2020-04-11'
  },

  // Jordan 4s
  {
    name: 'Air Jordan 4 Retro "Black Cat"',
    sku: 'CU1110-010',
    colorway: 'Black/Black-Light Graphite',
    retailPrice: 190,
    releaseDate: '2020-01-22'
  },
  {
    name: 'Air Jordan 4 Retro "White Cement"',
    sku: '840606-192',
    colorway: 'White/Fire Red-Black-Tech Grey',
    retailPrice: 220,
    releaseDate: '2016-02-13'
  },

  // More Dunks
  {
    name: 'Nike Dunk Low "University Blue"',
    sku: 'DD1391-102',
    colorway: 'White/University Blue',
    retailPrice: 100,
    releaseDate: '2021-06-24'
  },
  {
    name: 'Nike SB Dunk Low "Travis Scott"',
    sku: 'CT5053-001',
    colorway: 'Black/Black-Parachute Beige-Petra Brown',
    retailPrice: 150,
    releaseDate: '2020-02-29'
  },

  // Yeezy 350s
  {
    name: 'Adidas Yeezy Boost 350 V2 "Zebra"',
    sku: 'CP9654',
    colorway: 'White/Core Black/Red',
    retailPrice: 220,
    releaseDate: '2017-02-25'
  },
  {
    name: 'Adidas Yeezy Boost 350 V2 "Bred"',
    sku: 'CP9652',
    colorway: 'Core Black/Core Black/Red',
    retailPrice: 220,
    releaseDate: '2017-02-11'
  },

  // Off-White Collaborations
  {
    name: 'Nike Air Force 1 Low Off-White "MoMA"',
    sku: 'AV5210-001',
    colorway: 'Black/Metallic Silver',
    retailPrice: 170,
    releaseDate: '2018-07-18'
  },
  {
    name: 'Nike Air Presto Off-White "The Ten"',
    sku: 'AA3830-001',
    colorway: 'Black/Black-Muslin',
    retailPrice: 160,
    releaseDate: '2017-09-09'
  },

  // New Balance
  {
    name: 'New Balance 550 "White Grey"',
    sku: 'BB550WT1',
    colorway: 'White/Grey',
    retailPrice: 110,
    releaseDate: '2021-09-24'
  },
  {
    name: 'New Balance 2002R Protection Pack "Phantom"',
    sku: 'M2002RDA',
    colorway: 'Phantom',
    retailPrice: 140,
    releaseDate: '2021-12-10'
  }
];