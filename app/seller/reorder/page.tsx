'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  ShoppingCart,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Filter,
  Download,
  Calculator,
  Truck,
  AlertCircle,
  ChevronDown
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useMockData } from '@/lib/hooks/useMockData';
import { DataToggle } from '@/components/dashboard/DataToggle';
import { format, addDays } from 'date-fns';

interface ReorderItem {
  id: string;
  product: {
    id: string;
    name: string;
    brand: string;
    sku: string;
    image_url?: string;
  };
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  averageDailySales: number;
  daysUntilStockout: number;
  suggestedQuantity: number;
  estimatedDemand: number;
  supplier: {
    id: string;
    name: string;
    leadTimeDays: number;
    minimumOrder: number;
    lastOrderDate?: string;
    reliability: number; // 0-100
  };
  urgency: 'critical' | 'high' | 'medium' | 'low';
  costPerUnit: number;
  totalCost: number;
  selected: boolean;
  orderQuantity: number;
}

interface PurchaseOrder {
  id: string;
  supplier: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
  totalCost: number;
  estimatedDelivery: string;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'shipped' | 'delivered';
  createdAt: string;
}

export default function ReorderPage() {
  const [reorderItems, setReorderItems] = useState<ReorderItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const { isUsingMockData, getReorderSuggestions } = useMockData();

  useEffect(() => {
    loadReorderSuggestions();
  }, [isUsingMockData]);

  const loadReorderSuggestions = async () => {
    try {
      setLoading(true);

      if (isUsingMockData) {
        const suggestions = await getReorderSuggestions(15);
        const items: ReorderItem[] = suggestions.map((suggestion, index) => ({
          id: `reorder-${index}`,
          product: {
            id: suggestion.product.id,
            name: suggestion.product.name,
            brand: suggestion.product.brand,
            sku: suggestion.product.sku,
            image_url: suggestion.product.image_url
          },
          currentStock: suggestion.currentStock,
          reservedStock: 0,
          availableStock: suggestion.currentStock,
          lowStockThreshold: suggestion.product.low_stock_threshold,
          averageDailySales: Math.floor(suggestion.estimatedDemand / 30),
          daysUntilStockout: suggestion.currentStock > 0
            ? Math.floor(suggestion.currentStock / (suggestion.estimatedDemand / 30))
            : 0,
          suggestedQuantity: suggestion.suggestedQuantity,
          estimatedDemand: suggestion.estimatedDemand,
          supplier: {
            id: suggestion.product.supplier.id,
            name: suggestion.product.supplier.name,
            leadTimeDays: suggestion.product.supplier.lead_time_days,
            minimumOrder: suggestion.product.supplier.minimum_order,
            lastOrderDate: index % 3 === 0 ? format(addDays(new Date(), -30), 'yyyy-MM-dd') : undefined,
            reliability: 85 + Math.random() * 15
          },
          urgency: suggestion.urgency,
          costPerUnit: suggestion.product.cost,
          totalCost: suggestion.suggestedQuantity * suggestion.product.cost,
          selected: false,
          orderQuantity: suggestion.suggestedQuantity
        }));
        setReorderItems(items);
      } else {
        // Load from real data
        // This would connect to your actual inventory system
        setReorderItems([]);
      }
    } catch (error) {
      console.error('Error loading reorder suggestions:', error);
      toast.error('Failed to load reorder suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setReorderItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, orderQuantity: quantity, totalCost: quantity * item.costPerUnit }
        : item
    ));
  };

  const createPurchaseOrder = async () => {
    setCreatingOrder(true);

    try {
      const selectedReorderItems = reorderItems.filter(item => selectedItems.has(item.id));

      // Group by supplier
      const ordersBySupplier = selectedReorderItems.reduce((acc, item) => {
        const supplierId = item.supplier.id;
        if (!acc[supplierId]) {
          acc[supplierId] = {
            supplier: item.supplier,
            items: []
          };
        }
        acc[supplierId].items.push(item);
        return acc;
      }, {} as Record<string, { supplier: any; items: ReorderItem[] }>);

      // Create purchase orders
      const newOrders: PurchaseOrder[] = Object.entries(ordersBySupplier).map(([supplierId, data]) => {
        const items = data.items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.orderQuantity,
          unitCost: item.costPerUnit,
          totalCost: item.orderQuantity * item.costPerUnit
        }));

        return {
          id: `PO-${Date.now()}-${supplierId.slice(0, 4)}`,
          supplier: data.supplier.name,
          items,
          totalCost: items.reduce((sum, item) => sum + item.totalCost, 0),
          estimatedDelivery: format(addDays(new Date(), data.supplier.leadTimeDays), 'yyyy-MM-dd'),
          status: 'draft' as const,
          createdAt: new Date().toISOString()
        };
      });

      setPurchaseOrders(prev => [...newOrders, ...prev]);
      setSelectedItems(new Set());
      setShowOrderDialog(false);
      toast.success(`Created ${newOrders.length} purchase order(s)`);
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast.error('Failed to create purchase order');
    } finally {
      setCreatingOrder(false);
    }
  };

  const getUrgencyBadge = (urgency: ReorderItem['urgency']) => {
    const configs = {
      critical: { color: 'bg-red-100 text-red-800', icon: XCircle },
      high: { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
      medium: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      low: { color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };

    const config = configs[urgency];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {urgency.toUpperCase()}
      </Badge>
    );
  };

  const filteredItems = reorderItems.filter(item => {
    if (selectedSupplier !== 'all' && item.supplier.id !== selectedSupplier) return false;
    if (urgencyFilter !== 'all' && item.urgency !== urgencyFilter) return false;
    return true;
  });

  const stats = {
    criticalItems: reorderItems.filter(i => i.urgency === 'critical').length,
    totalValue: selectedItems.size > 0
      ? reorderItems
          .filter(i => selectedItems.has(i.id))
          .reduce((sum, i) => sum + i.totalCost, 0)
      : 0,
    selectedCount: selectedItems.size,
    estimatedLeadTime: selectedItems.size > 0
      ? Math.max(...reorderItems
          .filter(i => selectedItems.has(i.id))
          .map(i => i.supplier.leadTimeDays))
      : 0
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reorder Management</h1>
          <p className="text-gray-500 mt-1">Automated restocking recommendations</p>
        </div>
        <div className="flex items-center space-x-3">
          <DataToggle />
          <Button variant="outline" onClick={loadReorderSuggestions}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-2xl font-bold">{stats.criticalItems}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Selected Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{stats.selectedCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calculator className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Est. Lead Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Truck className="w-5 h-5 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">{stats.estimatedLeadTime} days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reorder Suggestions</CardTitle>
            <div className="flex items-center space-x-3">
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgencies</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => setShowOrderDialog(true)}
                disabled={selectedItems.size === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Create Order ({selectedItems.size})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Days Until Stockout</TableHead>
                <TableHead>Suggested Qty</TableHead>
                <TableHead>Order Qty</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Lead Time</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className={selectedItems.has(item.id) ? 'bg-gray-50' : ''}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.product.sku}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {item.currentStock}
                      {item.currentStock <= item.lowStockThreshold && (
                        <AlertTriangle className="w-3 h-3 ml-1 text-orange-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={item.daysUntilStockout <= 7 ? 'text-red-600 font-medium' : ''}>
                      {item.daysUntilStockout > 0 ? `${item.daysUntilStockout} days` : 'Out of Stock'}
                    </span>
                  </TableCell>
                  <TableCell>{item.suggestedQuantity}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.orderQuantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                      className="w-20"
                      min={item.supplier.minimumOrder}
                      disabled={!selectedItems.has(item.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{item.supplier.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.supplier.reliability.toFixed(0)}% reliable
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{item.supplier.leadTimeDays} days</TableCell>
                  <TableCell>{getUrgencyBadge(item.urgency)}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${(item.orderQuantity * item.costPerUnit).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Purchase Orders */}
      {purchaseOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
            <CardDescription>Track your active and recent orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {purchaseOrders.slice(0, 5).map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {order.supplier} • {order.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${order.totalCost.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">
                      Est. delivery: {format(new Date(order.estimatedDelivery), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <Badge>{order.status}</Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Order Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>
              Review and confirm your purchase order details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto">
              {reorderItems
                .filter(item => selectedItems.has(item.id))
                .map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 border-b">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">{item.supplier.name}</p>
                    </div>
                    <div className="text-right">
                      <p>{item.orderQuantity} units</p>
                      <p className="text-sm font-medium">${(item.orderQuantity * item.costPerUnit).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Order Value</span>
                <span>${stats.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Estimated Lead Time</span>
                <span>{stats.estimatedLeadTime} days</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createPurchaseOrder} disabled={creatingOrder}>
              {creatingOrder ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Order
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}