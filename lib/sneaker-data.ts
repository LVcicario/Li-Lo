export interface SneakerData {
  id: string
  name: string
  brand: string
  model: string
  price: number
  resaleValue: number
  description: string
  story: string
  images: string[]
  sizes: number[]
  color: string
  releaseDate: string
  releaseYear: number
  category: 'grail' | 'exclusive' | 'limited' | 'rare'
  stock: number
  featured: boolean
  materials: string[]
  edition: string
  authenticity: {
    certificate: boolean
    verifiedBy: string
    serialNumber?: string
  }
  valueTrend: {
    percentage: number
    direction: 'up' | 'down' | 'stable'
  }
  rarity: {
    produced: number
    available: number
    rating: number // 1-10
  }
}

export const iconicSneakers: SneakerData[] = [
  // THE GRAILS - Most Expensive Ever
  {
    id: 'jordan-dynasty-collection',
    name: 'Air Jordan Dynasty Collection',
    brand: 'JORDAN',
    model: 'Championship Pack',
    price: 8000000, // $8M actual sale price
    resaleValue: 8000000,
    description: 'The complete set of six Air Jordans worn by MJ during NBA championship-clinching games (1991-1998)',
    story: 'Each shoe was worn during the final game of each championship series. The most expensive sneaker sale in history.',
    images: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop'
    ],
    sizes: [13], // MJ's size
    color: 'Various',
    releaseDate: '1991-1998',
    releaseYear: 1998,
    category: 'grail',
    stock: 0,
    featured: true,
    materials: ['Full-grain leather', 'Air cushioning', 'Rubber outsole'],
    edition: '1 of 1 - Game Worn',
    authenticity: {
      certificate: true,
      verifiedBy: "Sotheby's & NBA",
      serialNumber: 'DYNASTY-001'
    },
    valueTrend: {
      percentage: 300,
      direction: 'up'
    },
    rarity: {
      produced: 1,
      available: 0,
      rating: 10
    }
  },
  {
    id: 'jordan-13-last-dance',
    name: 'Air Jordan 13 "Last Dance"',
    brand: 'JORDAN',
    model: 'Air Jordan 13',
    price: 2200000, // $2.2M actual sale
    resaleValue: 2200000,
    description: 'The actual shoes worn by Michael Jordan during Game 2 of the 1998 NBA Finals',
    story: "Jordan's final championship game with the Bulls. He scored 37 points wearing these exact shoes in his 'Last Dance'.",
    images: [
      'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&h=800&fit=crop'
    ],
    sizes: [13],
    color: 'Black/True Red',
    releaseDate: '1998-06-07',
    releaseYear: 1998,
    category: 'grail',
    stock: 0,
    featured: true,
    materials: ['Leather', 'Carbon fiber', 'Zoom Air'],
    edition: '1 of 1 - Game Worn',
    authenticity: {
      certificate: true,
      verifiedBy: "Sotheby's",
      serialNumber: 'LD-1998-MJ23'
    },
    valueTrend: {
      percentage: 450,
      direction: 'up'
    },
    rarity: {
      produced: 1,
      available: 0,
      rating: 10
    }
  },
  {
    id: 'nike-air-yeezy-prototype',
    name: 'Nike Air Yeezy 1 Prototype',
    brand: 'NIKE',
    model: 'Air Yeezy 1',
    price: 1800000, // $1.8M actual sale
    resaleValue: 1800000,
    description: 'Kanye West\'s personal prototype worn at the 2008 Grammy Awards',
    story: 'The shoe that started the Yeezy empire. Kanye wore these during his Grammy performance, making sneaker history.',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=800&fit=crop'
    ],
    sizes: [12],
    color: 'Black/Pink',
    releaseDate: '2008-02-10',
    releaseYear: 2008,
    category: 'grail',
    stock: 0,
    featured: true,
    materials: ['Premium leather', 'Python texture', 'Glow-in-dark sole'],
    edition: '1 of 1 - Artist Sample',
    authenticity: {
      certificate: true,
      verifiedBy: 'Ryan Chang Collection',
      serialNumber: 'YEEZY-PROTO-001'
    },
    valueTrend: {
      percentage: 500,
      direction: 'up'
    },
    rarity: {
      produced: 1,
      available: 0,
      rating: 10
    }
  },

  // ULTRA EXCLUSIVE COLLABORATIONS
  {
    id: 'dior-jordan-1-high',
    name: 'Air Dior Jordan 1 High',
    brand: 'JORDAN',
    model: 'Air Jordan 1',
    price: 8500,
    resaleValue: 15000,
    description: 'The pinnacle of luxury meets street. Hand-crafted in Italy with Dior\'s signature materials.',
    story: 'Limited to 8,500 pairs worldwide, each pair is individually numbered and comes with exclusive Dior accessories.',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop'
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    color: 'Wolf Grey/Sail/Photon Dust',
    releaseDate: '2020-06-25',
    releaseYear: 2020,
    category: 'exclusive',
    stock: 2,
    featured: true,
    materials: ['Italian leather', 'Dior Oblique Jacquard', 'Air cushioning'],
    edition: 'Limited to 8,500',
    authenticity: {
      certificate: true,
      verifiedBy: 'Dior & Jordan Brand',
      serialNumber: 'DIOR-AJ1-XXXX'
    },
    valueTrend: {
      percentage: 76,
      direction: 'up'
    },
    rarity: {
      produced: 8500,
      available: 150,
      rating: 9
    }
  },
  {
    id: 'travis-fragment-jordan-1-high',
    name: 'Fragment x Travis Scott Jordan 1 High',
    brand: 'JORDAN',
    model: 'Air Jordan 1',
    price: 2800,
    resaleValue: 4200,
    description: 'Triple collaboration between Jordan, Travis Scott, and Hiroshi Fujiwara\'s Fragment Design',
    story: 'The meeting of streetwear titans. Combines Travis\'s reverse swoosh with Fragment\'s minimalist aesthetic.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop'
    ],
    sizes: [8, 9, 10, 11, 12],
    color: 'Military Blue/Sail/Black',
    releaseDate: '2021-07-29',
    releaseYear: 2021,
    category: 'exclusive',
    stock: 3,
    featured: true,
    materials: ['Premium leather', 'Nubuck', 'Reversed leather'],
    edition: 'Limited Release',
    authenticity: {
      certificate: true,
      verifiedBy: 'StockX Verified',
      serialNumber: 'FRAG-TS-001'
    },
    valueTrend: {
      percentage: 50,
      direction: 'up'
    },
    rarity: {
      produced: 50000,
      available: 500,
      rating: 8
    }
  },
  {
    id: 'off-white-chicago-1',
    name: 'Off-White x Air Jordan 1 "Chicago"',
    brand: 'JORDAN',
    model: 'Air Jordan 1',
    price: 5500,
    resaleValue: 7800,
    description: 'Virgil Abloh\'s deconstructed take on the most iconic Jordan silhouette',
    story: 'Part of "The Ten" collection, this shoe redefined sneaker collaborations with its deconstructed aesthetic.',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=800&fit=crop'
    ],
    sizes: [8, 9, 10, 11],
    color: 'White/Black-Varsity Red',
    releaseDate: '2017-09-09',
    releaseYear: 2017,
    category: 'exclusive',
    stock: 1,
    featured: true,
    materials: ['Deconstructed leather', 'Exposed foam', 'Signature zip-tie'],
    edition: 'The Ten Collection',
    authenticity: {
      certificate: true,
      verifiedBy: 'GOAT Authenticated',
      serialNumber: 'OW-CHI-001'
    },
    valueTrend: {
      percentage: 42,
      direction: 'up'
    },
    rarity: {
      produced: 30000,
      available: 200,
      rating: 9
    }
  },

  // LIMITED EDITIONS
  {
    id: 'travis-scott-jordan-1-low',
    name: 'Travis Scott x Air Jordan 1 Low "Mocha"',
    brand: 'JORDAN',
    model: 'Air Jordan 1 Low',
    price: 1250,
    resaleValue: 1850,
    description: 'The low-top version of Travis\'s revolutionary reverse swoosh design',
    story: 'Travis brought his Houston roots and Cactus Jack aesthetic to this earth-toned masterpiece.',
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600185365778-7875a359b924?w=800&h=800&fit=crop'
    ],
    sizes: [7, 8, 9, 10, 11, 12, 13],
    color: 'Dark Mocha/Black/Sail',
    releaseDate: '2019-07-13',
    releaseYear: 2019,
    category: 'limited',
    stock: 5,
    featured: true,
    materials: ['Suede', 'Nubuck', 'Canvas', 'Reversed swoosh'],
    edition: 'Cactus Jack Edition',
    authenticity: {
      certificate: true,
      verifiedBy: 'Nike SNKRS',
      serialNumber: 'CJ-LOW-001'
    },
    valueTrend: {
      percentage: 48,
      direction: 'up'
    },
    rarity: {
      produced: 100000,
      available: 2000,
      rating: 7
    }
  },
  {
    id: 'union-jordan-4-guava',
    name: 'Union LA x Air Jordan 4 "Guava Ice"',
    brand: 'JORDAN',
    model: 'Air Jordan 4',
    price: 1450,
    resaleValue: 1950,
    description: 'Union LA\'s fresh take on the classic Jordan 4 silhouette',
    story: 'Chris Gibbs brought LA street culture to this collaboration with unique colorways and details.',
    images: [
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&h=800&fit=crop'
    ],
    sizes: [8, 9, 10, 11, 12],
    color: 'Guava Ice/Light Fusion Red',
    releaseDate: '2020-08-29',
    releaseYear: 2020,
    category: 'limited',
    stock: 4,
    featured: true,
    materials: ['Suede', 'Mesh', 'Translucent outsole'],
    edition: 'Union Exclusive',
    authenticity: {
      certificate: true,
      verifiedBy: 'Union LA',
      serialNumber: 'UNION-4-001'
    },
    valueTrend: {
      percentage: 35,
      direction: 'up'
    },
    rarity: {
      produced: 75000,
      available: 1500,
      rating: 7
    }
  },
  {
    id: 'sean-wotherspoon-97',
    name: 'Sean Wotherspoon x Air Max 97/1',
    brand: 'NIKE',
    model: 'Air Max 97/1',
    price: 980,
    resaleValue: 1650,
    description: 'Vote Forward winning design combining Air Max 97 and Air Max 1',
    story: 'Sean\'s vintage-inspired corduroy design won Nike\'s Vote Forward competition and became an instant classic.',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=800&fit=crop'
    ],
    sizes: [8, 9, 10, 11],
    color: 'Multi-Color/Corduroy',
    releaseDate: '2018-03-26',
    releaseYear: 2018,
    category: 'limited',
    stock: 3,
    featured: true,
    materials: ['Corduroy', 'Velvet', 'Air Max cushioning'],
    edition: 'Vote Forward Winner',
    authenticity: {
      certificate: true,
      verifiedBy: 'Nike',
      serialNumber: 'SW-97-001'
    },
    valueTrend: {
      percentage: 68,
      direction: 'up'
    },
    rarity: {
      produced: 50000,
      available: 800,
      rating: 8
    }
  },

  // RARE RETROS
  {
    id: 'jordan-4-eminem-encore',
    name: 'Air Jordan 4 "Eminem Encore"',
    brand: 'JORDAN',
    model: 'Air Jordan 4',
    price: 25000,
    resaleValue: 37850,
    description: 'Given exclusively to friends and family of Eminem. Only 50 pairs exist.',
    story: 'Created to celebrate Eminem\'s Encore album. One of the rarest Jordan 4s ever made.',
    images: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop'
    ],
    sizes: [10, 11, 12],
    color: 'Blue/Black/Grey',
    releaseDate: '2015-11-01',
    releaseYear: 2015,
    category: 'rare',
    stock: 0,
    featured: true,
    materials: ['Premium leather', 'Nubuck', 'Air cushioning'],
    edition: 'Friends & Family - 50 pairs',
    authenticity: {
      certificate: true,
      verifiedBy: 'Jordan Brand',
      serialNumber: 'EM-ENCORE-XX'
    },
    valueTrend: {
      percentage: 51,
      direction: 'up'
    },
    rarity: {
      produced: 50,
      available: 0,
      rating: 10
    }
  },
  {
    id: 'jordan-1-shattered-backboard',
    name: 'Air Jordan 1 "Shattered Backboard 1.0"',
    brand: 'JORDAN',
    model: 'Air Jordan 1',
    price: 1800,
    resaleValue: 2450,
    description: 'Inspired by the jersey MJ wore when he shattered a backboard in Italy',
    story: 'During a 1985 exhibition game in Italy, MJ shattered the backboard with a dunk while wearing orange and black.',
    images: [
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop'
    ],
    sizes: [8, 9, 10, 11, 12],
    color: 'Orange/Black/White',
    releaseDate: '2015-06-27',
    releaseYear: 2015,
    category: 'rare',
    stock: 6,
    featured: true,
    materials: ['Premium leather', 'Nike Air cushioning'],
    edition: 'OG High',
    authenticity: {
      certificate: true,
      verifiedBy: 'StockX',
      serialNumber: 'SBB-1-001'
    },
    valueTrend: {
      percentage: 36,
      direction: 'up'
    },
    rarity: {
      produced: 100000,
      available: 3000,
      rating: 6
    }
  },
  {
    id: 'jordan-11-cool-grey',
    name: 'Air Jordan 11 "Cool Grey"',
    brand: 'JORDAN',
    model: 'Air Jordan 11',
    price: 485,
    resaleValue: 650,
    description: 'The non-OG colorway that became a legend',
    story: 'Originally released in 2001, this colorway has become one of the most sought-after Jordan 11s.',
    images: [
      'https://images.unsplash.com/photo-1581068506652-61cd93f30c3f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop'
    ],
    sizes: [7, 8, 9, 10, 11, 12, 13],
    color: 'Medium Grey/White/Cool Grey',
    releaseDate: '2021-12-11',
    releaseYear: 2021,
    category: 'limited',
    stock: 12,
    featured: false,
    materials: ['Patent leather', 'Nubuck', 'Carbon fiber'],
    edition: '2021 Retro',
    authenticity: {
      certificate: true,
      verifiedBy: 'Nike',
      serialNumber: 'CG-11-2021'
    },
    valueTrend: {
      percentage: 34,
      direction: 'up'
    },
    rarity: {
      produced: 500000,
      available: 15000,
      rating: 5
    }
  },
  {
    id: 'yeezy-750-og',
    name: 'Adidas Yeezy Boost 750 "OG Light Brown"',
    brand: 'ADIDAS',
    model: 'Yeezy Boost 750',
    price: 2200,
    resaleValue: 3450,
    description: 'The first Adidas Yeezy that started a new era',
    story: 'Kanye\'s first Adidas collaboration after leaving Nike. The shoe that launched the Yeezy empire.',
    images: [
      'https://images.unsplash.com/photo-1554735490-5974588cbc4f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1520256862855-398228c41684?w=800&h=800&fit=crop'
    ],
    sizes: [8, 9, 10, 11, 12],
    color: 'Light Brown/Carbon White',
    releaseDate: '2015-02-14',
    releaseYear: 2015,
    category: 'rare',
    stock: 2,
    featured: true,
    materials: ['Premium suede', 'Boost cushioning', 'Zipper', 'Velcro strap'],
    edition: 'First Release',
    authenticity: {
      certificate: true,
      verifiedBy: 'Adidas',
      serialNumber: 'YZY-750-001'
    },
    valueTrend: {
      percentage: 57,
      direction: 'up'
    },
    rarity: {
      produced: 9000,
      available: 200,
      rating: 8
    }
  },
  {
    id: 'supreme-dunk-low-2021',
    name: 'Supreme x Nike SB Dunk Low "Mean Green"',
    brand: 'NIKE',
    model: 'SB Dunk Low',
    price: 885,
    resaleValue: 1250,
    description: 'Supreme\'s croc-skin leather Dunk with gold stars',
    story: 'Part of Supreme\'s 2021 collaboration featuring premium materials and the iconic gold stars.',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop'
    ],
    sizes: [8, 9, 10, 11],
    color: 'Mean Green/Black/White',
    releaseDate: '2021-03-04',
    releaseYear: 2021,
    category: 'limited',
    stock: 7,
    featured: false,
    materials: ['Croc-embossed leather', 'Gold stars', 'Zoom Air'],
    edition: 'Supreme Exclusive',
    authenticity: {
      certificate: true,
      verifiedBy: 'Supreme',
      serialNumber: 'SUP-DUNK-2021'
    },
    valueTrend: {
      percentage: 41,
      direction: 'up'
    },
    rarity: {
      produced: 80000,
      available: 2500,
      rating: 6
    }
  },
  {
    id: 'ben-jerry-chunky-dunky',
    name: 'Ben & Jerry\'s x Nike SB Dunk "Chunky Dunky"',
    brand: 'NIKE',
    model: 'SB Dunk Low',
    price: 1100,
    resaleValue: 1650,
    description: 'Ice cream-inspired Dunk with cow print and melting swoosh',
    story: 'A sweet collaboration between Nike SB and Ben & Jerry\'s featuring playful ice cream-themed details.',
    images: [
      'https://images.unsplash.com/photo-1603787081207-362bcef7c144?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1612724189298-89d36b10b26d?w=800&h=800&fit=crop'
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    color: 'Lagoon Pulse/Black/White',
    releaseDate: '2020-05-26',
    releaseYear: 2020,
    category: 'limited',
    stock: 8,
    featured: true,
    materials: ['Cow-print fur', 'Leather', 'Special packaging'],
    edition: 'Special Box Edition',
    authenticity: {
      certificate: true,
      verifiedBy: 'Nike SB',
      serialNumber: 'BJ-CHUNKY-001'
    },
    valueTrend: {
      percentage: 50,
      direction: 'up'
    },
    rarity: {
      produced: 69000,
      available: 3000,
      rating: 7
    }
  },
  {
    id: 'freddy-krueger-dunk',
    name: 'Nike SB Dunk Low "Freddy Krueger"',
    brand: 'NIKE',
    model: 'SB Dunk Low',
    price: 28000,
    resaleValue: 35000,
    description: 'The recalled Nightmare on Elm Street Dunk',
    story: 'Recalled due to copyright issues, most pairs were destroyed. Only a few survived, making it ultra-rare.',
    images: [
      'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&h=800&fit=crop'
    ],
    sizes: [9, 10, 11],
    color: 'Red/Green Stripes',
    releaseDate: '2007-10-31',
    releaseYear: 2007,
    category: 'grail',
    stock: 0,
    featured: true,
    materials: ['Suede', 'Blood splatter print', 'Metal lace tips'],
    edition: 'Recalled - Ultra Rare',
    authenticity: {
      certificate: true,
      verifiedBy: 'Private Collector',
      serialNumber: 'FK-SB-XXX'
    },
    valueTrend: {
      percentage: 125,
      direction: 'up'
    },
    rarity: {
      produced: 5000,
      available: 30,
      rating: 10
    }
  }
]

// Function to get sneakers by category
export function getSneakersByCategory(category: string): SneakerData[] {
  return iconicSneakers.filter(sneaker => sneaker.category === category)
}

// Function to get featured sneakers
export function getFeaturedSneakers(): SneakerData[] {
  return iconicSneakers.filter(sneaker => sneaker.featured)
}

// Function to get sneaker by ID
export function getSneakerById(id: string): SneakerData | undefined {
  return iconicSneakers.find(sneaker => sneaker.id === id)
}

// Function to search sneakers
export function searchSneakers(query: string): SneakerData[] {
  const lowercaseQuery = query.toLowerCase()
  return iconicSneakers.filter(sneaker =>
    sneaker.name.toLowerCase().includes(lowercaseQuery) ||
    sneaker.brand.toLowerCase().includes(lowercaseQuery) ||
    sneaker.model.toLowerCase().includes(lowercaseQuery) ||
    sneaker.color.toLowerCase().includes(lowercaseQuery)
  )
}

// Function to get sneakers by price range
export function getSneakersByPriceRange(min: number, max: number): SneakerData[] {
  return iconicSneakers.filter(sneaker =>
    sneaker.price >= min && sneaker.price <= max
  )
}

// Function to format currency with proper conversion
export function formatCurrency(amount: number, currency: 'USD' | 'EUR' = 'USD'): string {
  const rate = currency === 'EUR' ? 0.92 : 1 // Approximate EUR conversion
  const convertedAmount = amount * rate
  const symbol = currency === 'EUR' ? '€' : '$'

  return `${symbol}${convertedAmount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`
}