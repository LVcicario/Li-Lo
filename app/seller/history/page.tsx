'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  History,
  Package,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ShoppingCart,
  RotateCcw,
  Settings,
  FileText,
  Clock,
  User
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useMockData } from '@/lib/hooks/useMockData';
import { DataToggle } from '@/components/dashboard/DataToggle';
import { format, subDays, isWithinInterval } from 'date-fns';
import { RevenueChart } from '@/components/charts/RevenueChart';

interface StockHistoryItem {
  id: string;
  timestamp: string;
  product_id: string;
  product_name: string;
  sku: string;
  change_type: 'sale' | 'restock' | 'adjustment' | 'return' | 'reservation' | 'release';
  quantity_change: number;
  old_quantity: number;
  new_quantity: number;
  user: string;
  user_role?: string;
  order_id?: string;
  notes?: string;
}

interface StockAnalytics {
  totalMovements: number;
  totalSales: number;
  totalRestocks: number;
  totalAdjustments: number;
  totalReturns: number;
  netChange: number;
  averageDailySales: number;
  stockTurnoverRate: number;
  topProducts: Array<{
    name: string;
    movements: number;
    volume: number;
  }>;
}

export default function StockHistoryPage() {
  const [historyItems, setHistoryItems] = useState<StockHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<number>(30);
  const [searchQuery, setSearchQuery] = useState('');
  const [analytics, setAnalytics] = useState<StockAnalytics | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const { isUsingMockData, getStockHistory } = useMockData();

  useEffect(() => {
    loadStockHistory();
  }, [isUsingMockData, dateRange]);

  const loadStockHistory = async () => {
    try {
      setLoading(true);

      if (isUsingMockData) {
        // Generate mock history for multiple products
        const products = [
          { id: 'prod-1', name: 'Nike Air Max 90', sku: 'NAM-001' },
          { id: 'prod-2', name: 'Jordan 1 Retro High', sku: 'JRD-001' },
          { id: 'prod-3', name: 'Yeezy Boost 350', sku: 'YZY-001' },
          { id: 'prod-4', name: 'Off-White Dunk Low', sku: 'OFW-001' },
          { id: 'prod-5', name: 'Balenciaga Triple S', sku: 'BAL-001' }
        ];

        const allHistory: StockHistoryItem[] = [];

        for (const product of products) {
          const history = await getStockHistory(product.id, dateRange);
          const mappedHistory = history.map(item => ({
            ...item,
            product_name: product.name,
            sku: product.sku,
            user_role: ['Manager', 'Staff', 'System'][Math.floor(Math.random() * 3)]
          }));
          allHistory.push(...mappedHistory);
        }

        // Sort by timestamp descending
        allHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setHistoryItems(allHistory);

        // Calculate analytics
        const analytics = calculateAnalytics(allHistory);
        setAnalytics(analytics);

        // Generate chart data
        const chartData = generateChartData(allHistory);
        setChartData(chartData);
      } else {
        // Load from real database
        setHistoryItems([]);
      }
    } catch (error) {
      console.error('Error loading stock history:', error);
      toast.error('Failed to load stock history');
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (history: StockHistoryItem[]): StockAnalytics => {
    const sales = history.filter(h => h.change_type === 'sale');
    const restocks = history.filter(h => h.change_type === 'restock');
    const adjustments = history.filter(h => h.change_type === 'adjustment');
    const returns = history.filter(h => h.change_type === 'return');

    const productMovements: Record<string, { movements: number; volume: number }> = {};
    history.forEach(item => {
      if (!productMovements[item.product_name]) {
        productMovements[item.product_name] = { movements: 0, volume: 0 };
      }
      productMovements[item.product_name].movements++;
      productMovements[item.product_name].volume += Math.abs(item.quantity_change);
    });

    const topProducts = Object.entries(productMovements)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);

    const totalSalesVolume = sales.reduce((sum, s) => sum + Math.abs(s.quantity_change), 0);
    const daysInRange = dateRange;
    const averageDailySales = totalSalesVolume / daysInRange;

    return {
      totalMovements: history.length,
      totalSales: sales.length,
      totalRestocks: restocks.length,
      totalAdjustments: adjustments.length,
      totalReturns: returns.length,
      netChange: history.reduce((sum, h) => sum + h.quantity_change, 0),
      averageDailySales: Math.round(averageDailySales * 10) / 10,
      stockTurnoverRate: 4.2, // Mock value
      topProducts
    };
  };

  const generateChartData = (history: StockHistoryItem[]) => {
    const dailyData: Record<string, number> = {};

    // Initialize all days in range
    for (let i = 0; i < dateRange; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      dailyData[date] = 0;
    }

    // Sum up stock movements by day
    history.forEach(item => {
      const date = format(new Date(item.timestamp), 'yyyy-MM-dd');
      if (dailyData.hasOwnProperty(date)) {
        dailyData[date] += Math.abs(item.quantity_change);
      }
    });

    // Convert to chart format
    return Object.entries(dailyData)
      .map(([date, value]) => ({
        date,
        value,
        label: format(new Date(date), 'MMM dd')
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'sale': return ShoppingCart;
      case 'restock': return Package;
      case 'adjustment': return Settings;
      case 'return': return RotateCcw;
      default: return Package;
    }
  };

  const getChangeBadge = (type: string) => {
    const configs = {
      sale: 'bg-blue-100 text-blue-800',
      restock: 'bg-green-100 text-green-800',
      adjustment: 'bg-yellow-100 text-yellow-800',
      return: 'bg-purple-100 text-purple-800',
      reservation: 'bg-orange-100 text-orange-800',
      release: 'bg-gray-100 text-gray-800'
    };

    return <Badge className={configs[type as keyof typeof configs] || 'bg-gray-100 text-gray-800'}>{type}</Badge>;
  };

  const exportHistory = () => {
    // Convert to CSV
    const headers = ['Timestamp', 'Product', 'SKU', 'Type', 'Change', 'Old Stock', 'New Stock', 'User', 'Notes'];
    const rows = filteredHistory.map(item => [
      format(new Date(item.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      item.product_name,
      item.sku,
      item.change_type,
      item.quantity_change > 0 ? `+${item.quantity_change}` : item.quantity_change.toString(),
      item.old_quantity,
      item.new_quantity,
      item.user,
      item.notes || ''
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();

    toast.success('Stock history exported successfully');
  };

  const filteredHistory = historyItems.filter(item => {
    if (selectedProduct !== 'all' && item.product_id !== selectedProduct) return false;
    if (selectedType !== 'all' && item.change_type !== selectedType) return false;
    if (searchQuery && !item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.sku.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock History</h1>
          <p className="text-gray-500 mt-1">Track all inventory movements and changes</p>
        </div>
        <div className="flex items-center space-x-3">
          <DataToggle />
          <Button variant="outline" onClick={loadStockHistory}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={exportHistory}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{analytics.totalMovements}</span>
                <History className="w-5 h-5 text-gray-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Net Change</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {analytics.netChange > 0 ? '+' : ''}{analytics.netChange}
                </span>
                {analytics.netChange > 0 ? (
                  <ArrowUpRight className="w-5 h-5 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{analytics.averageDailySales}</span>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{analytics.stockTurnoverRate}x</span>
                <RefreshCw className="w-5 h-5 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="products">By Product</TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Movement History</CardTitle>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="sale">Sales</SelectItem>
                      <SelectItem value="restock">Restocks</SelectItem>
                      <SelectItem value="adjustment">Adjustments</SelectItem>
                      <SelectItem value="return">Returns</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateRange.toString()} onValueChange={(v) => setDateRange(parseInt(v))}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.slice(0, 50).map((item) => {
                    const ChangeIcon = getChangeIcon(item.change_type);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {format(new Date(item.timestamp), 'MMM dd, HH:mm')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-xs text-gray-500">{item.sku}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ChangeIcon className="w-4 h-4" />
                            {getChangeBadge(item.change_type)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            item.quantity_change > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.quantity_change > 0 ? '+' : ''}{item.quantity_change}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">{item.old_quantity}</span>
                            <ArrowDownRight className="w-3 h-3" />
                            <span className="font-medium">{item.new_quantity}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 text-gray-400" />
                            <div>
                              <p className="text-sm">{item.user}</p>
                              {item.user_role && (
                                <p className="text-xs text-gray-500">{item.user_role}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.notes && (
                            <span className="text-sm text-gray-600">{item.notes}</span>
                          )}
                          {item.order_id && (
                            <Badge variant="outline" className="text-xs">
                              {item.order_id}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Movement Trend</CardTitle>
                <CardDescription>Daily stock movements over time</CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 && (
                  <RevenueChart data={chartData} type="bar" height={250} showTrend={false} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Movement Breakdown</CardTitle>
                <CardDescription>Distribution by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-blue-500" />
                          <span>Sales</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{analytics.totalSales}</span>
                          <span className="text-sm text-gray-500">
                            ({Math.round(analytics.totalSales / analytics.totalMovements * 100)}%)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-green-500" />
                          <span>Restocks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{analytics.totalRestocks}</span>
                          <span className="text-sm text-gray-500">
                            ({Math.round(analytics.totalRestocks / analytics.totalMovements * 100)}%)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-yellow-500" />
                          <span>Adjustments</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{analytics.totalAdjustments}</span>
                          <span className="text-sm text-gray-500">
                            ({Math.round(analytics.totalAdjustments / analytics.totalMovements * 100)}%)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RotateCcw className="w-4 h-4 text-purple-500" />
                          <span>Returns</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{analytics.totalReturns}</span>
                          <span className="text-sm text-gray-500">
                            ({Math.round(analytics.totalReturns / analytics.totalMovements * 100)}%)
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          {analytics && analytics.topProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Moving Products</CardTitle>
                <CardDescription>Products with the most stock movements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.movements} movements</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{product.volume} units</p>
                        <p className="text-xs text-gray-500">Total volume</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Stock Summary</CardTitle>
              <CardDescription>Current stock levels and recent changes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Product-specific analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}