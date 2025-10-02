-- Create product_variants table for stock management
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  size TEXT NOT NULL,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  reserved_quantity INTEGER DEFAULT 0 CHECK (reserved_quantity >= 0),
  price DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, size)
);

-- Create stock_movements table for tracking changes
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  quantity_change INTEGER NOT NULL, -- Positive for additions, negative for sales
  new_quantity INTEGER NOT NULL,
  reason TEXT,
  order_id UUID REFERENCES orders(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update cart_items table to reference variants
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id);
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS price_at_time DECIMAL(10, 2);

-- Update orders table to track fulfillment
ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfilled_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_size ON product_variants(size);
CREATE INDEX IF NOT EXISTS idx_product_variants_stock ON product_variants(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_stock_movements_variant_id ON stock_movements(variant_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_user_id ON stock_movements(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created ON stock_movements(created_at DESC);

-- Enable Row Level Security
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_variants
-- Everyone can view stock levels
CREATE POLICY "Public can view product variants" ON product_variants
  FOR SELECT USING (true);

-- Only sellers and CEOs can update stock
CREATE POLICY "Sellers can update stock" ON product_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('seller', 'ceo')
    )
  );

-- RLS Policies for stock_movements
-- Sellers and CEOs can view all movements
CREATE POLICY "Sellers can view stock movements" ON stock_movements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('seller', 'ceo')
    )
  );

-- Only sellers and CEOs can create movements
CREATE POLICY "Sellers can create stock movements" ON stock_movements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('seller', 'ceo')
    )
  );

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on product_variants
DROP TRIGGER IF EXISTS update_product_variants_updated_at ON product_variants;
CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to check stock availability before order
CREATE OR REPLACE FUNCTION check_stock_availability(
  p_variant_id UUID,
  p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_available INTEGER;
BEGIN
  SELECT stock_quantity - COALESCE(reserved_quantity, 0)
  INTO v_available
  FROM product_variants
  WHERE id = p_variant_id;

  RETURN v_available >= p_quantity;
END;
$$ language 'plpgsql';

-- Function to auto-flag products as sold out
CREATE OR REPLACE FUNCTION update_product_sold_out_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update product sold out status based on all variants
  UPDATE products
  SET is_sold_out = NOT EXISTS (
    SELECT 1 FROM product_variants
    WHERE product_id = NEW.product_id
    AND stock_quantity > COALESCE(reserved_quantity, 0)
  )
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update sold out status
DROP TRIGGER IF EXISTS update_sold_out_status ON product_variants;
CREATE TRIGGER update_sold_out_status
  AFTER UPDATE OF stock_quantity, reserved_quantity ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_product_sold_out_status();

-- Insert sample variants for existing products
INSERT INTO product_variants (product_id, sku, size, stock_quantity, price)
SELECT
  p.id,
  CONCAT(p.sku, '-', s.size),
  s.size,
  CASE
    WHEN p.base_price >= 8000 THEN FLOOR(RANDOM() * 3 + 1)  -- Grail: 1-3 pairs per size
    WHEN p.base_price >= 3000 THEN FLOOR(RANDOM() * 5 + 2)  -- Exclusive: 2-6 pairs
    WHEN p.base_price >= 1000 THEN FLOOR(RANDOM() * 10 + 5) -- Limited: 5-14 pairs
    ELSE FLOOR(RANDOM() * 20 + 10)                           -- Rare: 10-29 pairs
  END,
  p.base_price
FROM products p
CROSS JOIN (
  VALUES
    ('38'), ('39'), ('40'), ('41'), ('42'),
    ('43'), ('44'), ('45'), ('46'), ('47')
) s(size)
WHERE NOT EXISTS (
  SELECT 1 FROM product_variants
  WHERE product_id = p.id AND size = s.size
);

-- Add sold_out column to products if not exists
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_sold_out BOOLEAN DEFAULT false;

-- Update sold out status for all products
UPDATE products p
SET is_sold_out = NOT EXISTS (
  SELECT 1 FROM product_variants v
  WHERE v.product_id = p.id
  AND v.stock_quantity > COALESCE(v.reserved_quantity, 0)
);