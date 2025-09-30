-- =============================================
-- LI-LO MEMBERSHIP & DROPS SYSTEM
-- Migration 002: Premium E-Commerce Features
-- =============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- MEMBERSHIP TIERS (Bronze, Silver, Gold)
-- =============================================

-- Membership tiers configuration
CREATE TABLE IF NOT EXISTS public.membership_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tier VARCHAR(20) NOT NULL UNIQUE CHECK (tier IN ('bronze', 'silver', 'gold')),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2) NOT NULL,

    -- Perks and features
    features JSONB DEFAULT '[]'::jsonb, -- Array of features
    early_access_hours INTEGER DEFAULT 0, -- Hours before public drop
    exclusive_drops BOOLEAN DEFAULT FALSE,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    free_shipping BOOLEAN DEFAULT FALSE,
    priority_support BOOLEAN DEFAULT FALSE,

    -- Display settings
    badge_color VARCHAR(20),
    badge_icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User memberships
CREATE TABLE IF NOT EXISTS public.user_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tier_id UUID NOT NULL REFERENCES membership_tiers(id) ON DELETE RESTRICT,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold')),

    -- Subscription details
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
    billing_period VARCHAR(20) DEFAULT 'monthly' CHECK (billing_period IN ('monthly', 'yearly')),

    -- Stripe integration
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),

    -- Dates
    started_at TIMESTAMPTZ DEFAULT NOW(),
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,

    -- Trial
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    is_trial BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- One active membership per user
    UNIQUE(user_id, status) WHERE status = 'active'
);

-- Membership benefits log (what users get)
CREATE TABLE IF NOT EXISTS public.membership_benefits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_membership_id UUID NOT NULL REFERENCES user_memberships(id) ON DELETE CASCADE,
    benefit_type VARCHAR(50) NOT NULL, -- 'early_access', 'discount', 'free_shipping', etc.
    benefit_value TEXT,
    used_at TIMESTAMPTZ,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DROPS SYSTEM (Timed Exclusive Releases)
-- =============================================

-- Drops (sneaker releases)
CREATE TABLE IF NOT EXISTS public.drops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,

    -- Drop details
    drop_type VARCHAR(20) DEFAULT 'standard' CHECK (drop_type IN ('standard', 'exclusive', 'ultra_rare', 'collab')),
    tier_requirement VARCHAR(20) CHECK (tier_requirement IN ('bronze', 'silver', 'gold')),

    -- Timing
    announcement_date TIMESTAMPTZ,
    drop_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,

    -- Early access for premium members (hours before public)
    early_access_bronze INTEGER DEFAULT 0,
    early_access_silver INTEGER DEFAULT 0,
    early_access_gold INTEGER DEFAULT 24,

    -- Limited quantity
    total_quantity INTEGER,
    remaining_quantity INTEGER,

    -- Status
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'announced', 'live', 'sold_out', 'ended', 'cancelled'
    )),

    -- Marketing
    banner_image_url TEXT,
    teaser_video_url TEXT,
    featured_image_url TEXT,

    -- Metadata
    tags TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop products (products available in a drop)
CREATE TABLE IF NOT EXISTS public.drop_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drop_id UUID NOT NULL REFERENCES drops(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

    -- Drop-specific pricing
    drop_price DECIMAL(10,2),
    bronze_price DECIMAL(10,2),
    silver_price DECIMAL(10,2),
    gold_price DECIMAL(10,2),

    -- Drop-specific stock
    drop_quantity INTEGER,
    sold_quantity INTEGER DEFAULT 0,

    -- Priority and display
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(drop_id, product_id)
);

-- Drop notifications (users who want to be notified)
CREATE TABLE IF NOT EXISTS public.drop_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    drop_id UUID NOT NULL REFERENCES drops(id) ON DELETE CASCADE,

    notification_type VARCHAR(20) DEFAULT 'all' CHECK (notification_type IN (
        'all', 'announcement', 'early_access', 'live', 'restock'
    )),

    -- Notification channels
    notify_email BOOLEAN DEFAULT TRUE,
    notify_push BOOLEAN DEFAULT TRUE,
    notify_sms BOOLEAN DEFAULT FALSE,

    -- Tracking
    is_notified BOOLEAN DEFAULT FALSE,
    notified_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, drop_id, notification_type)
);

-- Drop access log (who accessed drops when)
CREATE TABLE IF NOT EXISTS public.drop_access_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drop_id UUID NOT NULL REFERENCES drops(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    tier VARCHAR(20),
    access_type VARCHAR(20) CHECK (access_type IN ('early_access', 'public', 'vip')),
    accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SIZE CONVERSION (EU/US for Sneakers)
-- =============================================

CREATE TABLE IF NOT EXISTS public.size_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    eu_size DECIMAL(4,1) NOT NULL UNIQUE,
    us_men_size VARCHAR(10) NOT NULL,
    us_women_size VARCHAR(10) NOT NULL,
    uk_size VARCHAR(10),
    cm_size DECIMAL(4,1)
);

-- Insert standard size conversions (EU 37-47)
INSERT INTO size_conversions (eu_size, us_men_size, us_women_size, uk_size, cm_size) VALUES
(37, '5.5-6', '6.5-7', '4.5-5', 23.5),
(38, '6-6.5', '7.5-8', '5-5.5', 24.0),
(39, '7-7.5', '8.5-9', '6-6.5', 24.5),
(40, '7.5-8', '9-9.5', '6.5-7', 25.0),
(41, '8-8.5', '9.5-10', '7-7.5', 25.5),
(42, '9-9.5', '10.5-11', '8-8.5', 26.0),
(43, '10-10.5', '11-11.5', '9-9.5', 27.0),
(44, '11-11.5', '12-12.5', '10-10.5', 27.5),
(45, '12-12.5', '13', '11-11.5', 28.0),
(46, '13', '13.5', '12', 28.5),
(47, '14', '14', '13', 29.0)
ON CONFLICT (eu_size) DO NOTHING;

-- =============================================
-- STOCKX INTEGRATION TRACKING
-- =============================================

-- StockX sync log (track API syncs)
CREATE TABLE IF NOT EXISTS public.stockx_sync_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sync_type VARCHAR(20) CHECK (sync_type IN ('products', 'prices', 'images', 'full')),
    products_synced INTEGER DEFAULT 0,
    products_updated INTEGER DEFAULT 0,
    products_created INTEGER DEFAULT 0,
    errors INTEGER DEFAULT 0,
    error_details JSONB,
    sync_duration_ms INTEGER,
    status VARCHAR(20) CHECK (status IN ('success', 'partial', 'failed')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- StockX product mapping
CREATE TABLE IF NOT EXISTS public.stockx_product_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE UNIQUE,
    stockx_id VARCHAR(255) NOT NULL,
    stockx_sku VARCHAR(255),
    last_price_sync TIMESTAMPTZ,
    last_data_sync TIMESTAMPTZ,
    sync_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Membership indexes
CREATE INDEX IF NOT EXISTS idx_user_memberships_user_id ON user_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memberships_status ON user_memberships(status);
CREATE INDEX IF NOT EXISTS idx_user_memberships_tier ON user_memberships(tier);
CREATE INDEX IF NOT EXISTS idx_user_memberships_expires_at ON user_memberships(expires_at);

-- Drops indexes
CREATE INDEX IF NOT EXISTS idx_drops_status ON drops(status);
CREATE INDEX IF NOT EXISTS idx_drops_drop_date ON drops(drop_date);
CREATE INDEX IF NOT EXISTS idx_drops_tier_requirement ON drops(tier_requirement);
CREATE INDEX IF NOT EXISTS idx_drops_featured ON drops(is_featured);
CREATE INDEX IF NOT EXISTS idx_drop_products_drop_id ON drop_products(drop_id);
CREATE INDEX IF NOT EXISTS idx_drop_products_product_id ON drop_products(product_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_drop_notifications_user_id ON drop_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_drop_notifications_drop_id ON drop_notifications(drop_id);
CREATE INDEX IF NOT EXISTS idx_drop_notifications_notified ON drop_notifications(is_notified);

-- =============================================
-- TRIGGERS & FUNCTIONS
-- =============================================

-- Update updated_at for new tables
CREATE TRIGGER update_membership_tiers_updated_at BEFORE UPDATE ON membership_tiers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_memberships_updated_at BEFORE UPDATE ON user_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drops_updated_at BEFORE UPDATE ON drops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drop_products_updated_at BEFORE UPDATE ON drop_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update drop status based on dates
CREATE OR REPLACE FUNCTION update_drop_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-update status based on dates
    IF NEW.drop_date > NOW() THEN
        NEW.status = 'scheduled';
    ELSIF NEW.drop_date <= NOW() AND (NEW.end_date IS NULL OR NEW.end_date > NOW()) THEN
        IF NEW.remaining_quantity = 0 THEN
            NEW.status = 'sold_out';
        ELSE
            NEW.status = 'live';
        END IF;
    ELSIF NEW.end_date IS NOT NULL AND NEW.end_date <= NOW() THEN
        NEW.status = 'ended';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_drop_status_trigger
BEFORE INSERT OR UPDATE ON drops
FOR EACH ROW
EXECUTE FUNCTION update_drop_status();

-- Function to decrement drop quantity on purchase
CREATE OR REPLACE FUNCTION decrement_drop_quantity()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
        -- Update drop products remaining quantity
        UPDATE drop_products dp
        SET sold_quantity = sold_quantity + oi.quantity
        FROM order_items oi
        WHERE oi.order_id = NEW.id
        AND dp.product_id = oi.product_id
        AND EXISTS (
            SELECT 1 FROM drop_products dp2
            WHERE dp2.id = dp.id
        );

        -- Update main drops remaining quantity
        UPDATE drops d
        SET remaining_quantity = remaining_quantity - COALESCE(
            (SELECT SUM(oi.quantity)
             FROM order_items oi
             JOIN drop_products dp ON dp.product_id = oi.product_id
             WHERE oi.order_id = NEW.id AND dp.drop_id = d.id),
            0
        )
        WHERE d.id IN (
            SELECT DISTINCT dp.drop_id
            FROM order_items oi
            JOIN drop_products dp ON dp.product_id = oi.product_id
            WHERE oi.order_id = NEW.id
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_drop_quantity_trigger
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION decrement_drop_quantity();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on new tables
ALTER TABLE membership_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE drop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE drop_notifications ENABLE ROW LEVEL SECURITY;

-- Membership tiers are public
CREATE POLICY "Membership tiers are viewable by everyone"
ON membership_tiers FOR SELECT
USING (is_active = TRUE);

-- Users can view their own membership
CREATE POLICY "Users can view own membership"
ON user_memberships FOR SELECT
USING (auth.uid() = user_id);

-- Users can view their membership benefits
CREATE POLICY "Users can view own benefits"
ON membership_benefits FOR SELECT
USING (user_membership_id IN (SELECT id FROM user_memberships WHERE user_id = auth.uid()));

-- Drops are viewable by everyone
CREATE POLICY "Drops are viewable by everyone"
ON drops FOR SELECT
USING (status IN ('announced', 'live', 'sold_out', 'ended'));

-- Drop products are viewable by everyone
CREATE POLICY "Drop products are viewable by everyone"
ON drop_products FOR SELECT
USING (TRUE);

-- Users can manage their own drop notifications
CREATE POLICY "Users can manage own drop notifications"
ON drop_notifications FOR ALL
USING (auth.uid() = user_id);

-- =============================================
-- INITIAL MEMBERSHIP TIERS DATA
-- =============================================

INSERT INTO membership_tiers (
    tier, name, description,
    price_monthly, price_yearly,
    features, early_access_hours,
    exclusive_drops, discount_percentage,
    free_shipping, priority_support,
    badge_color, badge_icon, sort_order
) VALUES
(
    'bronze',
    'Bronze Member',
    'Access to standard drops and basic perks',
    0.00,
    0.00,
    '["Access to standard drops", "Email notifications", "Community access"]'::jsonb,
    0,
    FALSE,
    0.00,
    FALSE,
    FALSE,
    '#CD7F32',
    'medal',
    1
),
(
    'silver',
    'Silver Member',
    'Early access to drops, exclusive deals, and premium support',
    29.99,
    299.99,
    '["Early access (12h)", "10% discount on all drops", "Priority support", "Exclusive Silver drops", "Free shipping on orders over $200"]'::jsonb,
    12,
    TRUE,
    10.00,
    FALSE,
    TRUE,
    '#C0C0C0',
    'star',
    2
),
(
    'gold',
    'Gold Member',
    'VIP access to ultra-exclusive drops, maximum perks and concierge service',
    99.99,
    999.99,
    '["Ultra early access (24h)", "20% discount on all drops", "VIP concierge support", "All exclusive Gold/Platinum drops", "Free shipping always", "Invitations to exclusive events", "First access to collaborations"]'::jsonb,
    24,
    TRUE,
    20.00,
    TRUE,
    TRUE,
    '#FFD700',
    'crown',
    3
)
ON CONFLICT (tier) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price_monthly = EXCLUDED.price_monthly,
    price_yearly = EXCLUDED.price_yearly,
    features = EXCLUDED.features,
    early_access_hours = EXCLUDED.early_access_hours,
    exclusive_drops = EXCLUDED.exclusive_drops,
    discount_percentage = EXCLUDED.discount_percentage,
    free_shipping = EXCLUDED.free_shipping,
    priority_support = EXCLUDED.priority_support,
    badge_color = EXCLUDED.badge_color,
    badge_icon = EXCLUDED.badge_icon,
    sort_order = EXCLUDED.sort_order;

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- View for active drops with tier access
CREATE OR REPLACE VIEW active_drops_with_access AS
SELECT
    d.*,
    CASE
        WHEN d.tier_requirement = 'gold' THEN 'Gold members only'
        WHEN d.tier_requirement = 'silver' THEN 'Silver+ members'
        WHEN d.tier_requirement = 'bronze' THEN 'All members'
        ELSE 'Public access'
    END as access_description,
    COUNT(DISTINCT dp.product_id) as product_count,
    d.drop_date - (d.early_access_gold || ' hours')::INTERVAL as gold_access_time,
    d.drop_date - (d.early_access_silver || ' hours')::INTERVAL as silver_access_time,
    d.drop_date as bronze_access_time
FROM drops d
LEFT JOIN drop_products dp ON d.id = dp.drop_id
WHERE d.status IN ('scheduled', 'announced', 'live')
GROUP BY d.id;

-- View for user membership status with benefits
CREATE OR REPLACE VIEW user_membership_status AS
SELECT
    um.user_id,
    um.tier,
    um.status,
    mt.name as tier_name,
    mt.features,
    mt.early_access_hours,
    mt.discount_percentage,
    mt.free_shipping,
    mt.priority_support,
    mt.badge_color,
    um.current_period_end,
    um.expires_at,
    CASE
        WHEN um.expires_at < NOW() THEN TRUE
        ELSE FALSE
    END as is_expired
FROM user_memberships um
JOIN membership_tiers mt ON um.tier = mt.tier
WHERE um.status = 'active';

COMMIT;