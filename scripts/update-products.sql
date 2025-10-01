-- Script SQL pour mettre à jour les produits avec les bonnes images et prix
-- Exécuter ce script dans Supabase pour corriger les données

-- 1. Travis Scott x Nike SB Dunk Low
UPDATE products
SET
  base_price = 1850,
  name = 'Travis Scott x Nike SB Dunk Low',
  sku = 'TS-DUNK-001'
WHERE name LIKE '%Travis Scott%Dunk%' OR sku LIKE '%TS-DUNK%';

-- 2. Air Jordan 1 Chicago
UPDATE products
SET
  base_price = 450,
  name = 'Air Jordan 1 Retro High OG Chicago 2015',
  sku = 'J1-CHICAGO-2015'
WHERE name LIKE '%Jordan 1%Chicago%' AND name NOT LIKE '%Off-White%' AND name NOT LIKE '%Dior%';

-- 3. Off-White x Air Jordan 1 Chicago
UPDATE products
SET
  base_price = 5500,
  name = 'Off-White x Air Jordan 1 Retro High OG Chicago',
  sku = 'OW-J1-CHICAGO'
WHERE name LIKE '%Off-White%Jordan 1%Chicago%';

-- 4. Yeezy 350 V2 Black Red (Bred)
UPDATE products
SET
  base_price = 380,
  name = 'Adidas Yeezy Boost 350 V2 Core Black Red',
  sku = 'YEEZY-350-BRED'
WHERE name LIKE '%Yeezy%350%' AND (name LIKE '%Black Red%' OR name LIKE '%Bred%');

-- 5. Nike Dunk Low Panda
UPDATE products
SET
  base_price = 180,
  name = 'Nike Dunk Low Retro White Black Panda',
  sku = 'DUNK-PANDA-2021'
WHERE name LIKE '%Dunk Low%' AND (name LIKE '%Panda%' OR name LIKE '%White Black%');

-- 6. Air Jordan 4 Black Cat
UPDATE products
SET
  base_price = 650,
  name = 'Air Jordan 4 Retro Black Cat 2020',
  sku = 'J4-BLACKCAT-2020'
WHERE name LIKE '%Jordan 4%Black Cat%';

-- 7. Travis Scott x Fragment Jordan 1 Low
UPDATE products
SET
  base_price = 3800,
  name = 'Travis Scott x Fragment x Air Jordan 1 Low',
  sku = 'TS-J1-FRAGMENT'
WHERE name LIKE '%Travis Scott%Fragment%' OR name LIKE '%Fragment%Travis%';

-- 8. Dior x Air Jordan 1
UPDATE products
SET
  base_price = 8500,
  name = 'Dior x Air Jordan 1 High',
  sku = 'DIOR-J1-HIGH'
WHERE name LIKE '%Dior%Jordan%';

-- 9. Yeezy 700 Wave Runner
UPDATE products
SET
  base_price = 450,
  name = 'Adidas Yeezy Boost 700 Wave Runner',
  sku = 'YEEZY-700-WAVE'
WHERE name LIKE '%Yeezy%700%Wave%';

-- 10. Off-White x Nike Air Presto
UPDATE products
SET
  base_price = 2200,
  name = 'Off-White x Nike Air Presto Black',
  sku = 'OW-PRESTO-BLACK'
WHERE name LIKE '%Off-White%Presto%';

-- 11. Air Jordan 11 Bred
UPDATE products
SET
  base_price = 320,
  name = 'Air Jordan 11 Retro Bred 2019',
  sku = 'J11-BRED-2019'
WHERE name LIKE '%Jordan 11%' AND (name LIKE '%Bred%' OR name LIKE '%Black Red%');

-- 12. Sean Wotherspoon Air Max
UPDATE products
SET
  base_price = 1400,
  name = 'Nike Air Max 1/97 Sean Wotherspoon',
  sku = 'SW-AIRMAX-197'
WHERE name LIKE '%Sean Wotherspoon%' OR name LIKE '%Wotherspoon%';

-- 13. Travis Scott Jordan 6
UPDATE products
SET
  base_price = 680,
  name = 'Travis Scott x Air Jordan 6 Retro Olive',
  sku = 'TS-J6-OLIVE'
WHERE name LIKE '%Travis%Jordan 6%';

-- 14. New Balance 2002R
UPDATE products
SET
  base_price = 220,
  name = 'New Balance 2002R Protection Pack Phantom',
  sku = 'NB-2002R-PHANTOM'
WHERE name LIKE '%Balance%2002%';

-- 15. Ben & Jerry's Dunks
UPDATE products
SET
  base_price = 1850,
  name = 'Nike SB Dunk Low Ben & Jerry''s Chunky Dunky',
  sku = 'DUNK-CHUNKY-2020'
WHERE name LIKE '%Ben%Jerry%' OR name LIKE '%Chunky%';

-- 16. Yeezy Slide Bone
UPDATE products
SET
  base_price = 150,
  name = 'Adidas Yeezy Slide Bone',
  sku = 'YEEZY-SLIDE-BONE'
WHERE name LIKE '%Yeezy%Slide%';

-- 17. A Ma Maniére Jordan 3
UPDATE products
SET
  base_price = 420,
  name = 'Air Jordan 3 Retro A Ma Maniére',
  sku = 'J3-MAMANIERE'
WHERE name LIKE '%Ma Maniere%' OR name LIKE '%Ma Maniére%';

-- 18. Off-White Air Force 1
UPDATE products
SET
  base_price = 2800,
  name = 'Nike Air Force 1 Low Off-White Brooklyn',
  sku = 'OW-AF1-BROOKLYN'
WHERE name LIKE '%Off-White%' AND name LIKE '%Air Force%';

-- 19. Patta Air Max 1
UPDATE products
SET
  base_price = 350,
  name = 'Patta x Nike Air Max 1 Monarch',
  sku = 'PATTA-AM1-MONARCH'
WHERE name LIKE '%Patta%Air Max%';

-- 20. Jordan 4 White Cement
UPDATE products
SET
  base_price = 340,
  name = 'Air Jordan 4 Retro White Cement',
  sku = 'J4-CEMENT-2016'
WHERE name LIKE '%Jordan 4%White Cement%';

-- Mettre à jour d'autres produits populaires avec des prix réalistes
UPDATE products SET base_price = 280 WHERE name LIKE '%New Balance 990%';
UPDATE products SET base_price = 250 WHERE name LIKE '%Air Max 90%';
UPDATE products SET base_price = 420 WHERE name LIKE '%Jordan 3%' AND base_price < 200;
UPDATE products SET base_price = 350 WHERE name LIKE '%Jordan 5%' AND base_price < 200;
UPDATE products SET base_price = 380 WHERE name LIKE '%Jordan 6%' AND base_price < 200;
UPDATE products SET base_price = 320 WHERE name LIKE '%Jordan 12%' AND base_price < 200;
UPDATE products SET base_price = 280 WHERE name LIKE '%Jordan 13%' AND base_price < 200;

-- Mettre à jour les Yeezy avec des prix réalistes
UPDATE products SET base_price = 280 WHERE name LIKE '%Yeezy%350%' AND base_price < 200;
UPDATE products SET base_price = 320 WHERE name LIKE '%Yeezy%500%' AND base_price < 200;
UPDATE products SET base_price = 180 WHERE name LIKE '%Yeezy%Foam%' AND base_price < 100;

-- S'assurer qu'aucun produit n'a un prix inférieur à 150€
UPDATE products SET base_price = 150 WHERE base_price < 150;

-- Mettre à jour les valeurs de revente (resale_value) à 120% du prix de base pour les produits normaux
UPDATE products SET resale_value = base_price * 1.2 WHERE resale_value IS NULL OR resale_value < base_price;

-- Mettre à jour les valeurs de revente pour les grails (150% du prix de base)
UPDATE products SET resale_value = base_price * 1.5
WHERE name LIKE '%Travis Scott%'
   OR name LIKE '%Off-White%'
   OR name LIKE '%Dior%'
   OR name LIKE '%Fragment%';