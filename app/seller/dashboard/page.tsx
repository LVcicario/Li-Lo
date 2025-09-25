'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Edit2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { sneakerApi } from '@/lib/sneaker-api';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  lowStockItems: number;
  todayRevenue: number;
  monthRevenue: number;
  revenueChange: number;
  ordersChange: number;
  stockAlerts: Array<{
    id: string;
    product: string;
    size: string;
    current: number;
    threshold: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customer: string;
    product: string;
    total: number;
    status: string;
    date: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sold: number;
    revenue: number;
    stock: number;
  }>;
}

export default function SellerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    lowStockItems: 0,
    todayRevenue: 0,
    monthRevenue: 0,
    revenueChange: 0,
    ordersChange: 0,
    stockAlerts: [],
    recentOrders: [],
    topProducts: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load real sneaker data as placeholder
      const sneakers = await sneakerApi.getAllSneakers();
      const trending = await sneakerApi.getTrendingSneakers(5);

      // Simulate dashboard stats with real data
      setStats({
        totalProducts: sneakers.length,
        totalOrders: Math.floor(Math.random() * 50) + 100,
        lowStockItems: sneakers.filter(s =>
          s.sizes.some(size => size.stock > 0 && size.stock < 5)
        ).length,
        todayRevenue: Math.floor(Math.random() * 5000) + 2000,
        monthRevenue: Math.floor(Math.random() * 50000) + 20000,
        revenueChange: Math.random() * 20 - 5,
        ordersChange: Math.random() * 30 - 10,
        stockAlerts: sneakers.slice(0, 3).map(s => ({
          id: s.id,
          product: s.name,
          size: '10',
          current: 2,
          threshold: 5
        })),
        recentOrders: trending.slice(0, 5).map((s, idx) => ({
          id: `order-${idx}`,
          orderNumber: `#${12345 + idx}`,
          customer: `customer${idx}@example.com`,
          product: s.name,
          total: s.marketData.lastSale,
          status: ['pending', 'processing', 'shipped'][idx % 3],
          date: new Date(Date.now() - idx * 3600000).toLocaleString()
        })),
        topProducts: trending.slice(0, 5).map(s => ({
          id: s.id,
          name: s.name,
          sold: s.marketData.salesLast72Hours,
          revenue: s.marketData.salesLast72Hours * s.marketData.lastSale,
          stock: s.sizes.reduce((sum, size) => sum + size.stock, 0)
        }))
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your products, inventory, and orders</p>
        </div>
        <Button onClick={() => router.push('/seller/products/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-gray-500">Active listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <div className="flex items-center text-xs">
              {stats.ordersChange > 0 ? (
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={stats.ordersChange > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(stats.ordersChange).toFixed(1)}%
              </span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Month Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs">
              {stats.revenueChange > 0 ? (
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={stats.revenueChange > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(stats.revenueChange).toFixed(1)}%
              </span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockItems}</div>
            <p className="text-xs text-orange-500">Items need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.push('/seller/products/new')}
            >
              <Plus className="h-5 w-5 mb-2" />
              <span className="text-xs">Add Product</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.push('/seller/inventory')}
            >
              <Package className="h-5 w-5 mb-2" />
              <span className="text-xs">Update Stock</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.push('/seller/pricing')}
            >
              <DollarSign className="h-5 w-5 mb-2" />
              <span className="text-xs">Adjust Prices</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.push('/seller/orders')}
            >
              <ShoppingBag className="h-5 w-5 mb-2" />
              <span className="text-xs">View Orders</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="stock">Stock Alerts</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{order.product}</TableCell>
                      <TableCell>${order.total}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === 'shipped' ? 'default' :
                            order.status === 'processing' ? 'secondary' : 'outline'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Alerts</CardTitle>
              <CardDescription>Products running low on inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.stockAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{alert.product}</p>
                      <p className="text-sm text-gray-500">Size: {alert.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-500">{alert.current}</p>
                      <p className="text-xs text-gray-500">Threshold: {alert.threshold}</p>
                    </div>
                    <Button size="sm" onClick={() => router.push(`/seller/inventory?product=${alert.id}`)}>
                      Restock
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best sellers in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Units Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.topProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">{product.sold}</TableCell>
                      <TableCell className="text-right">${product.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={product.stock < 10 ? 'destructive' : 'default'}>
                          {product.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/seller/products/${product.id}`)}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}