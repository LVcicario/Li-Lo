'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Minus,
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { sneakerApi } from '@/lib/sneaker-api';
import { useStockManager } from '@/lib/stock/stock-manager';

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  sku: string;
  size: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  price: number;
  lastRestocked: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Record<string, number>>({});

  const { updateStock, checkStock, subscribeToStock } = useStockManager();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const sneakers = await sneakerApi.getAllSneakers();

      // Convert sneakers to inventory items
      const items: InventoryItem[] = [];
      sneakers.forEach(sneaker => {
        sneaker.sizes.forEach(size => {
          const available = size.stock;
          items.push({
            id: `${sneaker.id}-${size.us}`,
            productId: sneaker.id,
            productName: sneaker.name,
            brand: sneaker.brand,
            sku: sneaker.sku,
            size: size.us.toString(),
            currentStock: size.stock,
            reservedStock: 0,
            availableStock: available,
            lowStockThreshold: 5,
            price: sneaker.marketData.lastSale + (size.priceAdjustment || 0),
            lastRestocked: new Date().toISOString(),
            status: available === 0 ? 'out_of_stock' : available <= 5 ? 'low_stock' : 'in_stock'
          });
        });
      });

      setInventory(items);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStockUpdate = async (item: InventoryItem, change: number) => {
    try {
      const newStock = Math.max(0, item.currentStock + change);

      // Update in state immediately for optimistic update
      setInventory(prev => prev.map(i =>
        i.id === item.id
          ? { ...i, currentStock: newStock, availableStock: newStock - i.reservedStock }
          : i
      ));

      // Update in backend
      await updateStock(item.id, change, change > 0 ? 'restock' : 'adjustment');

      toast.success(`Stock updated for ${item.productName} Size ${item.size}`);
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
      // Revert optimistic update
      loadInventory();
    }
  };

  const handleBulkStockUpdate = async () => {
    if (!selectedProduct || adjustmentAmount === 0) return;

    try {
      const newStock = Math.max(0, selectedProduct.currentStock + adjustmentAmount);

      await updateStock(
        selectedProduct.id,
        adjustmentAmount,
        adjustmentAmount > 0 ? 'restock' : 'adjustment'
      );

      toast.success('Stock updated successfully');
      setSelectedProduct(null);
      setAdjustmentAmount(0);
      setAdjustmentReason('');
      loadInventory();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    }
  };

  const handleInlineEdit = (itemId: string, newValue: number) => {
    setEditedValues(prev => ({ ...prev, [itemId]: newValue }));
  };

  const saveInlineEdit = async (item: InventoryItem) => {
    const newValue = editedValues[item.id];
    if (newValue === undefined || newValue === item.currentStock) {
      setEditingItem(null);
      return;
    }

    try {
      const change = newValue - item.currentStock;
      await updateStock(item.id, change, 'adjustment');

      toast.success('Stock updated');
      setEditingItem(null);
      setEditedValues(prev => {
        const updated = { ...prev };
        delete updated[item.id];
        return updated;
      });
      loadInventory();
    } catch (error) {
      console.error('Error saving stock:', error);
      toast.error('Failed to save changes');
    }
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
      case 'low_stock':
        return <Badge className="bg-orange-100 text-orange-800">Low Stock</Badge>;
      case 'out_of_stock':
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
      default:
        return null;
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalItems: inventory.length,
    totalStock: inventory.reduce((sum, item) => sum + item.currentStock, 0),
    lowStockItems: inventory.filter(i => i.status === 'low_stock').length,
    outOfStockItems: inventory.filter(i => i.status === 'out_of_stock').length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.price), 0)
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-500 mt-1">Monitor and manage your stock levels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.lowStockItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.outOfStockItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search products, SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button>
                <Package className="mr-2 h-4 w-4" />
                Bulk Update
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Reserved</TableHead>
                <TableHead className="text-center">Available</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-gray-500">{item.brand}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell className="text-center">
                    {editingItem === item.id ? (
                      <Input
                        type="number"
                        value={editedValues[item.id] ?? item.currentStock}
                        onChange={(e) => handleInlineEdit(item.id, parseInt(e.target.value) || 0)}
                        className="w-20 h-8"
                        min="0"
                      />
                    ) : (
                      <span className="font-medium">{item.currentStock}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-gray-500">
                    {item.reservedStock}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.availableStock}
                  </TableCell>
                  <TableCell>{getStockBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    ${(item.currentStock * item.price).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {editingItem === item.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => saveInlineEdit(item)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingItem(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleQuickStockUpdate(item, -1)}
                            disabled={item.currentStock === 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleQuickStockUpdate(item, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingItem(item.id);
                              setEditedValues(prev => ({ ...prev, [item.id]: item.currentStock }));
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedProduct(item)}
                              >
                                Adjust
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Adjust Stock</DialogTitle>
                                <DialogDescription>
                                  Update stock for {item.productName} - Size {item.size}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Current Stock</Label>
                                  <p className="text-2xl font-bold">{item.currentStock}</p>
                                </div>
                                <div>
                                  <Label htmlFor="adjustment">Adjustment Amount</Label>
                                  <div className="flex space-x-2 mt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setAdjustmentAmount(prev => prev - 1)}
                                    >
                                      -
                                    </Button>
                                    <Input
                                      id="adjustment"
                                      type="number"
                                      value={adjustmentAmount}
                                      onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                                      className="text-center"
                                    />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setAdjustmentAmount(prev => prev + 1)}
                                    >
                                      +
                                    </Button>
                                  </div>
                                  <p className="text-sm text-gray-500 mt-2">
                                    New stock will be: {Math.max(0, item.currentStock + adjustmentAmount)}
                                  </p>
                                </div>
                                <div>
                                  <Label htmlFor="reason">Reason (Optional)</Label>
                                  <Input
                                    id="reason"
                                    value={adjustmentReason}
                                    onChange={(e) => setAdjustmentReason(e.target.value)}
                                    placeholder="e.g., Restock, Damage, Return..."
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => {
                                  setSelectedProduct(null);
                                  setAdjustmentAmount(0);
                                  setAdjustmentReason('');
                                }}>
                                  Cancel
                                </Button>
                                <Button onClick={handleBulkStockUpdate}>
                                  Update Stock
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}