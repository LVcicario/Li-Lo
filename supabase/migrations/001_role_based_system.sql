-- Role-Based System Migration for Li-Lo E-commerce Platform
-- This migration sets up the complete role-based access control system

-- 1. Update profiles table with proper role system
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'seller', 'ceo')),
ADD COLUMN IF NOT EXISTS business_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS seller_status VARCHAR(20) DEFAULT 'pending' CHECK (seller_status IN ('pending', 'approved', 'suspended')),
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS dashboard_preferences JSONB DEFAULT '{}';

-- 2. Create role assignments table for email-based role mapping
CREATE TABLE IF NOT EXISTS role_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  assigned_role VARCHAR(20) NOT NULL CHECK (assigned_role IN ('client', 'seller', 'ceo')),
  assigned_by UUID REFERENCES profiles(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create seller permissions table
CREATE TABLE IF NOT EXISTS seller_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  can_add_products BOOLEAN DEFAULT TRUE,
  can_modify_prices BOOLEAN DEFAULT TRUE,
  can_manage_stock BOOLEAN DEFAULT TRUE,
  can_view_orders BOOLEAN DEFAULT TRUE,
  can_process_refunds BOOLEAN DEFAULT FALSE,
  can_manage_promotions BOOLEAN DEFAULT FALSE,
  max_discount_percentage INTEGER DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(seller_id)
);

-- 4. Create CEO access control table
CREATE TABLE IF NOT EXISTS ceo_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  access_level VARCHAR(50) DEFAULT 'full' CHECK (access_level IN ('full', 'read_only', 'financial_only')),
  departments TEXT[] DEFAULT ARRAY[]::TEXT[],
  regions TEXT[] DEFAULT ARRAY[]::TEXT[],
  can_modify_sellers BOOLEAN DEFAULT TRUE,
  can_access_financial BOOLEAN DEFAULT TRUE,
  can_export_data BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 5. Create activity logs table for audit trail
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  user_role VARCHAR(20),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(255),
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_activity_logs_user_id (user_id),
  INDEX idx_activity_logs_timestamp (timestamp)
);

-- 6. Create stock changes audit table
CREATE TABLE IF NOT EXISTS stock_changes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id),
  product_id UUID,
  variant_id UUID,
  old_quantity INTEGER,
  new_quantity INTEGER,
  change_type VARCHAR(50) CHECK (change_type IN ('manual', 'sale', 'return', 'adjustment', 'restock')),
  reason TEXT,
  approved_by UUID REFERENCES profiles(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_stock_changes_seller (seller_id),
  INDEX idx_stock_changes_product (product_id)
);

-- 7. Create price history table
CREATE TABLE IF NOT EXISTS price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id),
  product_id UUID,
  old_price DECIMAL(10, 2),
  new_price DECIMAL(10, 2),
  discount_percentage DECIMAL(5, 2),
  reason TEXT,
  promotion_id UUID,
  effective_from TIMESTAMP WITH TIME ZONE,
  effective_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_price_history_seller (seller_id),
  INDEX idx_price_history_product (product_id)
);

-- 8. Create seller products association table
CREATE TABLE IF NOT EXISTS seller_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID,
  is_owner BOOLEAN DEFAULT FALSE,
  can_edit BOOLEAN DEFAULT TRUE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(seller_id, product_id)
);

-- 9. Insert default role assignments for testing
INSERT INTO role_assignments (email, assigned_role, notes) VALUES
  ('ceo@li-lo.com', 'ceo', 'Default CEO account'),
  ('seller@li-lo.com', 'seller', 'Default seller account for testing'),
  ('admin@li-lo.com', 'seller', 'Admin seller account')
ON CONFLICT (email) DO UPDATE SET
  assigned_role = EXCLUDED.assigned_role,
  updated_at = NOW();

-- 10. Create function to auto-assign role based on email
CREATE OR REPLACE FUNCTION assign_role_by_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if email exists in role_assignments
  IF EXISTS (SELECT 1 FROM role_assignments WHERE email = NEW.email AND is_active = TRUE) THEN
    UPDATE profiles
    SET role = (SELECT assigned_role FROM role_assignments WHERE email = NEW.email AND is_active = TRUE LIMIT 1)
    WHERE id = NEW.id;

    -- If seller, create default permissions
    IF (SELECT assigned_role FROM role_assignments WHERE email = NEW.email AND is_active = TRUE LIMIT 1) = 'seller' THEN
      INSERT INTO seller_permissions (seller_id) VALUES (NEW.id)
      ON CONFLICT (seller_id) DO NOTHING;
    END IF;

    -- If CEO, create access record
    IF (SELECT assigned_role FROM role_assignments WHERE email = NEW.email AND is_active = TRUE LIMIT 1) = 'ceo' THEN
      INSERT INTO ceo_access (user_id) VALUES (NEW.id)
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Create trigger for auto role assignment
DROP TRIGGER IF EXISTS auto_assign_role_trigger ON profiles;
CREATE TRIGGER auto_assign_role_trigger
AFTER INSERT OR UPDATE OF email ON profiles
FOR EACH ROW
EXECUTE FUNCTION assign_role_by_email();

-- 12. Create function to log all activities
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_logs (
    user_id,
    user_role,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    auth.uid(),
    (SELECT role FROM profiles WHERE id = auth.uid()),
    TG_OP,
    TG_TABLE_NAME,
    NEW.id::TEXT,
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceo_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_products ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "CEOs can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ceo')
  );

-- Seller permissions policies
CREATE POLICY "Sellers can view their own permissions" ON seller_permissions
  FOR SELECT USING (seller_id = auth.uid());

CREATE POLICY "CEOs can manage seller permissions" ON seller_permissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ceo')
  );

-- Activity logs policies
CREATE POLICY "Users can view their own activities" ON activity_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "CEOs can view all activities" ON activity_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ceo')
  );

-- Stock changes policies
CREATE POLICY "Sellers can view their own stock changes" ON stock_changes
  FOR SELECT USING (seller_id = auth.uid());

CREATE POLICY "Sellers can insert stock changes" ON stock_changes
  FOR INSERT WITH CHECK (seller_id = auth.uid());

CREATE POLICY "CEOs can view all stock changes" ON stock_changes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ceo')
  );

-- Price history policies
CREATE POLICY "Sellers can manage their price history" ON price_history
  FOR ALL USING (seller_id = auth.uid());

CREATE POLICY "CEOs can view all price history" ON price_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ceo')
  );

-- 14. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_role_assignments_email ON role_assignments(email);
CREATE INDEX IF NOT EXISTS idx_seller_permissions_seller ON seller_permissions(seller_id);
CREATE INDEX IF NOT EXISTS idx_ceo_access_user ON ceo_access(user_id);

-- 15. Create function to get user's dashboard URL
CREATE OR REPLACE FUNCTION get_dashboard_url(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  user_role VARCHAR(20);
BEGIN
  -- Get role from role_assignments or profiles
  SELECT COALESCE(
    (SELECT assigned_role FROM role_assignments WHERE email = user_email AND is_active = TRUE LIMIT 1),
    (SELECT role FROM profiles WHERE email = user_email LIMIT 1),
    'client'
  ) INTO user_role;

  RETURN CASE user_role
    WHEN 'ceo' THEN '/ceo'
    WHEN 'seller' THEN '/seller/dashboard'
    ELSE '/account/dashboard'
  END;
END;
$$ LANGUAGE plpgsql;

-- 16. Add comments for documentation
COMMENT ON TABLE role_assignments IS 'Maps email addresses to specific roles for automatic assignment';
COMMENT ON TABLE seller_permissions IS 'Defines granular permissions for seller accounts';
COMMENT ON TABLE ceo_access IS 'Controls CEO-level access and permissions';
COMMENT ON TABLE activity_logs IS 'Audit trail of all user activities in the system';
COMMENT ON TABLE stock_changes IS 'Tracks all inventory modifications by sellers';
COMMENT ON TABLE price_history IS 'Historical record of all price changes';

-- Migration complete!