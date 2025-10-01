// Script pour corriger les images et prix des produits
// Images réelles des sneakers et prix réalistes basés sur StockX

export const sneakersData = [
  {
    name: "Travis Scott x Nike SB Dunk Low",
    sku: "TS-DUNK-001",
    base_price: 1850,
    images: [
      "https://images.stockx.com/images/Nike-SB-Dunk-Low-Travis-Scott-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606318966",
      "https://images.stockx.com/360/Nike-SB-Dunk-Low-Travis-Scott/Images/Nike-SB-Dunk-Low-Travis-Scott/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2&updated_at=1606318966",
      "https://images.stockx.com/360/Nike-SB-Dunk-Low-Travis-Scott/Images/Nike-SB-Dunk-Low-Travis-Scott/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2&updated_at=1606318966",
      "https://images.stockx.com/360/Nike-SB-Dunk-Low-Travis-Scott/Images/Nike-SB-Dunk-Low-Travis-Scott/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2&updated_at=1606318966"
    ]
  },
  {
    name: "Air Jordan 1 Retro High OG Chicago",
    sku: "J1-CHICAGO-001",
    base_price: 450,
    images: [
      "https://images.stockx.com/images/Air-Jordan-1-Retro-Chicago-2015-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606316843",
      "https://images.stockx.com/360/Air-Jordan-1-Retro-Chicago-2015/Images/Air-Jordan-1-Retro-Chicago-2015/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-1-Retro-Chicago-2015/Images/Air-Jordan-1-Retro-Chicago-2015/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-1-Retro-Chicago-2015/Images/Air-Jordan-1-Retro-Chicago-2015/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Off-White x Air Jordan 1 Retro High OG Chicago",
    sku: "OW-J1-CHICAGO",
    base_price: 5500,
    images: [
      "https://images.stockx.com/images/Air-Jordan-1-Retro-High-Off-White-Chicago-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606320415",
      "https://images.stockx.com/360/Air-Jordan-1-Retro-High-Off-White-Chicago/Images/Air-Jordan-1-Retro-High-Off-White-Chicago/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-1-Retro-High-Off-White-Chicago/Images/Air-Jordan-1-Retro-High-Off-White-Chicago/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-1-Retro-High-Off-White-Chicago/Images/Air-Jordan-1-Retro-High-Off-White-Chicago/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Adidas Yeezy Boost 350 V2 Core Black Red",
    sku: "YEEZY-350-BRED",
    base_price: 380,
    images: [
      "https://images.stockx.com/images/Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606320618",
      "https://images.stockx.com/360/Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017/Images/Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017/Images/Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017/Images/Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Nike Dunk Low Retro White Black Panda",
    sku: "DUNK-PANDA-001",
    base_price: 180,
    images: [
      "https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1633027409",
      "https://images.stockx.com/360/Nike-Dunk-Low-Retro-White-Black-2021/Images/Nike-Dunk-Low-Retro-White-Black-2021/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Nike-Dunk-Low-Retro-White-Black-2021/Images/Nike-Dunk-Low-Retro-White-Black-2021/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Nike-Dunk-Low-Retro-White-Black-2021/Images/Nike-Dunk-Low-Retro-White-Black-2021/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Air Jordan 4 Retro Black Cat",
    sku: "J4-BLACKCAT-2020",
    base_price: 650,
    images: [
      "https://images.stockx.com/images/Air-Jordan-4-Retro-Black-Cat-2020-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606317553",
      "https://images.stockx.com/360/Air-Jordan-4-Retro-Black-Cat-2020/Images/Air-Jordan-4-Retro-Black-Cat-2020/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-4-Retro-Black-Cat-2020/Images/Air-Jordan-4-Retro-Black-Cat-2020/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-4-Retro-Black-Cat-2020/Images/Air-Jordan-4-Retro-Black-Cat-2020/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Travis Scott x Air Jordan 1 Low Fragment",
    sku: "TS-J1-FRAGMENT",
    base_price: 3800,
    images: [
      "https://images.stockx.com/images/Air-Jordan-1-Low-Fragment-Design-x-Travis-Scott-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1629307046",
      "https://images.stockx.com/360/Air-Jordan-1-Low-Fragment-Design-x-Travis-Scott/Images/Air-Jordan-1-Low-Fragment-Design-x-Travis-Scott/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-1-Low-Fragment-Design-x-Travis-Scott/Images/Air-Jordan-1-Low-Fragment-Design-x-Travis-Scott/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-1-Low-Fragment-Design-x-Travis-Scott/Images/Air-Jordan-1-Low-Fragment-Design-x-Travis-Scott/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Dior x Air Jordan 1 High",
    sku: "DIOR-J1-HIGH",
    base_price: 8500,
    images: [
      "https://images.stockx.com/images/Air-Jordan-1-Retro-High-Dior-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1607043976",
      "https://images.stockx.com/360/Air-Jordan-1-Retro-High-Dior/Images/Air-Jordan-1-Retro-High-Dior/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-1-Retro-High-Dior/Images/Air-Jordan-1-Retro-High-Dior/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-1-Retro-High-Dior/Images/Air-Jordan-1-Retro-High-Dior/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Adidas Yeezy Boost 700 Wave Runner",
    sku: "YEEZY-700-WAVE",
    base_price: 450,
    images: [
      "https://images.stockx.com/images/Adidas-Yeezy-Wave-Runner-700-Solid-Grey-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1628533088",
      "https://images.stockx.com/360/Adidas-Yeezy-Wave-Runner-700-Solid-Grey/Images/Adidas-Yeezy-Wave-Runner-700-Solid-Grey/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Adidas-Yeezy-Wave-Runner-700-Solid-Grey/Images/Adidas-Yeezy-Wave-Runner-700-Solid-Grey/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Adidas-Yeezy-Wave-Runner-700-Solid-Grey/Images/Adidas-Yeezy-Wave-Runner-700-Solid-Grey/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Off-White x Nike Air Presto Black",
    sku: "OW-PRESTO-BLACK",
    base_price: 2200,
    images: [
      "https://images.stockx.com/images/Nike-Air-Presto-Off-White-Black-2018-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606324389",
      "https://images.stockx.com/360/Nike-Air-Presto-Off-White-Black-2018/Images/Nike-Air-Presto-Off-White-Black-2018/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Nike-Air-Presto-Off-White-Black-2018/Images/Nike-Air-Presto-Off-White-Black-2018/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Nike-Air-Presto-Off-White-Black-2018/Images/Nike-Air-Presto-Off-White-Black-2018/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Air Jordan 11 Retro Bred",
    sku: "J11-BRED-2019",
    base_price: 320,
    images: [
      "https://images.stockx.com/images/Air-Jordan-11-Retro-Bred-2019-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606318588",
      "https://images.stockx.com/360/Air-Jordan-11-Retro-Bred-2019/Images/Air-Jordan-11-Retro-Bred-2019/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-11-Retro-Bred-2019/Images/Air-Jordan-11-Retro-Bred-2019/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-11-Retro-Bred-2019/Images/Air-Jordan-11-Retro-Bred-2019/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Nike Air Max 1/97 Sean Wotherspoon",
    sku: "SW-AIRMAX-197",
    base_price: 1400,
    images: [
      "https://images.stockx.com/images/Nike-Air-Max-1-97-Sean-Wotherspoon-NA-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606325761",
      "https://images.stockx.com/360/Nike-Air-Max-1-97-Sean-Wotherspoon-NA/Images/Nike-Air-Max-1-97-Sean-Wotherspoon-NA/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Nike-Air-Max-1-97-Sean-Wotherspoon-NA/Images/Nike-Air-Max-1-97-Sean-Wotherspoon-NA/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Nike-Air-Max-1-97-Sean-Wotherspoon-NA/Images/Nike-Air-Max-1-97-Sean-Wotherspoon-NA/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Travis Scott x Air Jordan 6 Retro Olive",
    sku: "TS-J6-OLIVE",
    base_price: 680,
    images: [
      "https://images.stockx.com/images/Air-Jordan-6-Retro-Travis-Scott-Cactus-Jack-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606322392",
      "https://images.stockx.com/360/Air-Jordan-6-Retro-Travis-Scott-Cactus-Jack/Images/Air-Jordan-6-Retro-Travis-Scott-Cactus-Jack/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-6-Retro-Travis-Scott-Cactus-Jack/Images/Air-Jordan-6-Retro-Travis-Scott-Cactus-Jack/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-6-Retro-Travis-Scott-Cactus-Jack/Images/Air-Jordan-6-Retro-Travis-Scott-Cactus-Jack/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "New Balance 2002R Protection Pack Phantom",
    sku: "NB-2002R-PHANTOM",
    base_price: 220,
    images: [
      "https://images.stockx.com/images/New-Balance-2002R-Protection-Pack-Phantom-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1654006378",
      "https://images.stockx.com/360/New-Balance-2002R-Protection-Pack-Phantom/Images/New-Balance-2002R-Protection-Pack-Phantom/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/New-Balance-2002R-Protection-Pack-Phantom/Images/New-Balance-2002R-Protection-Pack-Phantom/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/New-Balance-2002R-Protection-Pack-Phantom/Images/New-Balance-2002R-Protection-Pack-Phantom/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Nike SB Dunk Low Ben & Jerry's Chunky Dunky",
    sku: "DUNK-CHUNKY-2020",
    base_price: 1850,
    images: [
      "https://images.stockx.com/images/Nike-SB-Dunk-Low-Ben-Jerrys-Chunky-Dunky-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606322330",
      "https://images.stockx.com/360/Nike-SB-Dunk-Low-Ben-Jerrys-Chunky-Dunky/Images/Nike-SB-Dunk-Low-Ben-Jerrys-Chunky-Dunky/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Nike-SB-Dunk-Low-Ben-Jerrys-Chunky-Dunky/Images/Nike-SB-Dunk-Low-Ben-Jerrys-Chunky-Dunky/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Nike-SB-Dunk-Low-Ben-Jerrys-Chunky-Dunky/Images/Nike-SB-Dunk-Low-Ben-Jerrys-Chunky-Dunky/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Adidas Yeezy Slide Bone",
    sku: "YEEZY-SLIDE-BONE",
    base_price: 150,
    images: [
      "https://images.stockx.com/images/adidas-Yeezy-Slide-Bone-2022-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1661263139",
      "https://images.stockx.com/360/adidas-Yeezy-Slide-Bone-2022/Images/adidas-Yeezy-Slide-Bone-2022/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/adidas-Yeezy-Slide-Bone-2022/Images/adidas-Yeezy-Slide-Bone-2022/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/adidas-Yeezy-Slide-Bone-2022/Images/adidas-Yeezy-Slide-Bone-2022/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Air Jordan 3 Retro A Ma Maniére",
    sku: "J3-MAMANIERE",
    base_price: 420,
    images: [
      "https://images.stockx.com/images/Air-Jordan-3-Retro-A-Ma-Maniere-W-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1647001364",
      "https://images.stockx.com/360/Air-Jordan-3-Retro-A-Ma-Maniere-W/Images/Air-Jordan-3-Retro-A-Ma-Maniere-W/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-3-Retro-A-Ma-Maniere-W/Images/Air-Jordan-3-Retro-A-Ma-Maniere-W/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Air-Jordan-3-Retro-A-Ma-Maniere-W/Images/Air-Jordan-3-Retro-A-Ma-Maniere-W/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Nike Air Force 1 Low Off-White Brooklyn",
    sku: "OW-AF1-BROOKLYN",
    base_price: 2800,
    images: [
      "https://images.stockx.com/images/Nike-Air-Force-1-Low-Off-White-Brooklyn-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606318818",
      "https://images.stockx.com/360/Nike-Air-Force-1-Low-Off-White-Brooklyn/Images/Nike-Air-Force-1-Low-Off-White-Brooklyn/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Nike-Air-Force-1-Low-Off-White-Brooklyn/Images/Nike-Air-Force-1-Low-Off-White-Brooklyn/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Nike-Air-Force-1-Low-Off-White-Brooklyn/Images/Nike-Air-Force-1-Low-Off-White-Brooklyn/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  },
  {
    name: "Patta x Nike Air Max 1 Monarch",
    sku: "PATTA-AM1-MONARCH",
    base_price: 350,
    images: [
      "https://images.stockx.com/images/Nike-Air-Max-1-Patta-Waves-Monarch-DZ5222-001-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1635270715",
      "https://images.stockx.com/360/Nike-Air-Max-1-Patta-Waves-Monarch-DZ5222-001/Images/Nike-Air-Max-1-Patta-Waves-Monarch-DZ5222-001/Lv2/img01.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Nike-Air-Max-1-Patta-Waves-Monarch-DZ5222-001/Images/Nike-Air-Max-1-Patta-Waves-Monarch-DZ5222-001/Lv2/img19.jpg?fm=webp&auto=compress&w=576&dpr=2",
      "https://images.stockx.com/360/Nike-Air-Max-1-Patta-Waves-Monarch-DZ5222-001/Images/Nike-Air-Max-1-Patta-Waves-Monarch-DZ5222-001/Lv2/img36.jpg?fm=webp&auto=compress&w=576&dpr=2"
    ]
  }
];

// Images de haute qualité alternatives (CDN Li-Lo ou Cloudinary)
export const alternativeImages = {
  fallback: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=90",
  placeholder: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=90"
};