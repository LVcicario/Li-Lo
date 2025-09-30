// =============================================
// CEO METRICS API ROUTE
// Real-time metrics from Supabase
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check CEO access
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden: CEO access required' }, { status: 403 });
    }

    // =============================================
    // ORDERS ANALYTICS
    // =============================================
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, total_amount, created_at, status');

    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, o) => sum + parseFloat(String(o.total_amount)), 0) || 0;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const monthlyOrders = orders?.filter(o => new Date(o.created_at) >= thirtyDaysAgo) || [];
    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + parseFloat(String(o.total_amount)), 0);

    // =============================================
    // CUSTOMERS ANALYTICS
    // =============================================
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, created_at, last_login');

    const totalCustomers = profiles?.length || 0;
    const newCustomers = profiles?.filter(p => new Date(p.created_at) >= thirtyDaysAgo).length || 0;
    const activeCustomers = profiles?.filter(p => p.last_login && new Date(p.last_login) >= thirtyDaysAgo).length || 0;

    // =============================================
    // PRODUCTS ANALYTICS
    // =============================================
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, stock, stock_status');

    const totalProducts = products?.length || 0;
    const lowStockProducts = products?.filter(p => (p.stock || 0) < 5).length || 0;

    // =============================================
    // MEMBERSHIP ANALYTICS
    // =============================================
    const { data: memberships, error: membershipsError } = await supabase
      .from('user_memberships')
      .select('tier, status, billing_period, created_at')
      .eq('status', 'active');

    const membershipBreakdown = {
      bronze: memberships?.filter(m => m.tier === 'bronze').length || 0,
      silver: memberships?.filter(m => m.tier === 'silver').length || 0,
      gold: memberships?.filter(m => m.tier === 'gold').length || 0,
    };

    // Calculate membership revenue (monthly recurring)
    const { data: tiers } = await supabase
      .from('membership_tiers')
      .select('tier, price_monthly, price_yearly');

    const tierPrices = {
      bronze: { monthly: 0, yearly: 0 },
      silver: { monthly: 29.99, yearly: 299.90 },
      gold: { monthly: 99.99, yearly: 999.90 },
    };

    tiers?.forEach(t => {
      if (t.tier === 'silver') {
        tierPrices.silver.monthly = parseFloat(String(t.price_monthly));
        tierPrices.silver.yearly = parseFloat(String(t.price_yearly));
      } else if (t.tier === 'gold') {
        tierPrices.gold.monthly = parseFloat(String(t.price_monthly));
        tierPrices.gold.yearly = parseFloat(String(t.price_yearly));
      }
    });

    const membershipRevenue = memberships?.reduce((sum, m) => {
      const tier = m.tier as 'bronze' | 'silver' | 'gold';
      const price = m.billing_period === 'yearly'
        ? tierPrices[tier].yearly / 12
        : tierPrices[tier].monthly;
      return sum + price;
    }, 0) || 0;

    // =============================================
    // DROPS ANALYTICS
    // =============================================
    const { data: drops, error: dropsError } = await supabase
      .from('drops')
      .select(`
        id,
        name,
        status,
        drop_date,
        drop_products (
          sold_quantity,
          drop_price
        )
      `);

    const dropsPerformance = {
      scheduled: drops?.filter(d => d.status === 'scheduled').length || 0,
      live: drops?.filter(d => d.status === 'live').length || 0,
      completed: drops?.filter(d => d.status === 'sold_out' || d.status === 'ended').length || 0,
      totalRevenue: 0,
      averageDropRevenue: 0,
    };

    // Calculate drops revenue
    drops?.forEach(drop => {
      if (drop.drop_products) {
        drop.drop_products.forEach((dp: any) => {
          dropsPerformance.totalRevenue += (dp.sold_quantity || 0) * parseFloat(String(dp.drop_price || 0));
        });
      }
    });

    const completedDrops = dropsPerformance.completed || 1;
    dropsPerformance.averageDropRevenue = dropsPerformance.totalRevenue / completedDrops;

    // Top drops
    const topDrops = drops
      ?.map(drop => {
        const dropRevenue = drop.drop_products?.reduce((sum: number, dp: any) => {
          return sum + ((dp.sold_quantity || 0) * parseFloat(String(dp.drop_price || 0)));
        }, 0) || 0;

        const totalSold = drop.drop_products?.reduce((sum: number, dp: any) => {
          return sum + (dp.sold_quantity || 0);
        }, 0) || 0;

        return {
          id: drop.id,
          name: drop.name,
          drop_date: drop.drop_date,
          status: drop.status,
          totalRevenue: dropRevenue,
          totalSold: totalSold,
          productsCount: drop.drop_products?.length || 0,
        };
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5) || [];

    // =============================================
    // RECENT ORDERS
    // =============================================
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('id, order_number, customer_email, total_amount, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // =============================================
    // CALCULATE METRICS
    // =============================================
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate = totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0;

    return NextResponse.json({
      success: true,
      metrics: {
        totalRevenue,
        monthlyRevenue,
        totalOrders,
        monthlyOrders: monthlyOrders.length,
        totalCustomers,
        newCustomers,
        activeCustomers,
        totalProducts,
        lowStockProducts,
        averageOrderValue,
        conversionRate,
        membershipRevenue,
        membershipBreakdown,
        dropsPerformance,
        topDrops,
        recentOrders: recentOrders?.map(order => ({
          id: order.id,
          order_number: order.order_number,
          customer_email: order.customer_email,
          total_amount: order.total_amount,
          status: order.status,
          created_at: order.created_at,
          items_count: 0, // TODO: add order items count
        })) || [],
      },
    });
  } catch (error) {
    console.error('CEO metrics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}