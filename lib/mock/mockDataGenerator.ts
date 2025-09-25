import { faker } from '@faker-js/faker';
import { format, subDays, addDays } from 'date-fns';

export interface MockOrder {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled' | 'returned';
  items: Array<{
    id: string;
    product_id: string;
    product_name: string;
    brand: string;
    size: string;
    quantity: number;
    price: number;
    image_url?: string;
  }>;
  shipping: {
    address: string;
    city: string;
    postal_code: string;
    country: string;
    tracking_number?: string;
    carrier?: string;
    estimated_delivery?: string;
    actual_delivery?: string;
  };
  payment: {
    method: 'card' | 'paypal' | 'crypto';
    last_four?: string;
    transaction_id: string;
  };
  created_at: string;
  updated_at: string;
  items_count: number;
}

export interface MockProduct {
  id: string;
  name: string;
  brand: string;
  sku: string;
  price: number;
  cost: number;
  category: string;
  stock_quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  image_url: string;
  sizes: Array<{
    size: string;
    stock: number;
    reserved: number;
  }>;
  sales_last_30_days: number;
  revenue_last_30_days: number;
  trend: 'up' | 'down' | 'stable';
  supplier: {
    id: string;
    name: string;
    lead_time_days: number;
    minimum_order: number;
  };
}

export interface MockCustomer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  last_order_date?: string;
  loyalty_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  loyalty_points: number;
  preferred_brands: string[];
  shoe_size: string;
}

export interface MockMetrics {
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
    growth_percentage: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    average_value: number;
  };
  customers: {
    total: number;
    new_this_month: number;
    active: number;
    retention_rate: number;
    churn_rate: number;
  };
  inventory: {
    total_products: number;
    total_value: number;
    low_stock_items: number;
    out_of_stock_items: number;
    turnover_rate: number;
  };
  performance: {
    conversion_rate: number;
    cart_abandonment_rate: number;
    average_session_duration: number;
    bounce_rate: number;
  };
}

class MockDataGenerator {
  private brands = ['Nike', 'Adidas', 'Jordan', 'Yeezy', 'Off-White', 'Balenciaga', 'Dior', 'Louis Vuitton'];
  private models = ['Air Max', 'Dunk Low', 'Jordan 1', 'Boost 350', 'Track', 'B23', 'Triple S'];
  private countries = ['United States', 'France', 'Germany', 'United Kingdom', 'Italy', 'Spain', 'Japan'];
  private carriers = ['DHL', 'UPS', 'FedEx', 'USPS', 'Chronopost'];
  private statuses: MockOrder['status'][] = ['pending', 'processing', 'shipped', 'in_transit', 'delivered', 'cancelled', 'returned'];

  generateOrder(daysAgo: number = 0): MockOrder {
    const orderDate = subDays(new Date(), daysAgo);
    const status = faker.helpers.arrayElement(this.statuses);
    const itemCount = faker.number.int({ min: 1, max: 3 });
    const items = Array.from({ length: itemCount }, () => ({
      id: faker.string.uuid(),
      product_id: faker.string.uuid(),
      product_name: `${faker.helpers.arrayElement(this.brands)} ${faker.helpers.arrayElement(this.models)}`,
      brand: faker.helpers.arrayElement(this.brands),
      size: faker.helpers.arrayElement(['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12']),
      quantity: faker.number.int({ min: 1, max: 2 }),
      price: faker.number.int({ min: 200, max: 2500 }),
      image_url: `/api/placeholder/100/100`
    }));

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      id: faker.string.uuid(),
      order_number: `ORD-${orderDate.getFullYear()}-${faker.string.numeric(6)}`,
      customer_email: faker.internet.email(),
      customer_name: faker.person.fullName(),
      customer_id: faker.string.uuid(),
      total_amount: totalAmount,
      status,
      items,
      shipping: {
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        postal_code: faker.location.zipCode(),
        country: faker.helpers.arrayElement(this.countries),
        tracking_number: ['shipped', 'in_transit', 'delivered'].includes(status)
          ? faker.string.alphanumeric(10).toUpperCase()
          : undefined,
        carrier: ['shipped', 'in_transit', 'delivered'].includes(status)
          ? faker.helpers.arrayElement(this.carriers)
          : undefined,
        estimated_delivery: ['shipped', 'in_transit'].includes(status)
          ? format(addDays(orderDate, faker.number.int({ min: 3, max: 7 })), 'yyyy-MM-dd')
          : undefined,
        actual_delivery: status === 'delivered'
          ? format(addDays(orderDate, faker.number.int({ min: 3, max: 7 })), 'yyyy-MM-dd')
          : undefined
      },
      payment: {
        method: faker.helpers.arrayElement(['card', 'paypal', 'crypto']),
        last_four: faker.string.numeric(4),
        transaction_id: faker.string.uuid()
      },
      created_at: orderDate.toISOString(),
      updated_at: orderDate.toISOString(),
      items_count: itemCount
    };
  }

  generateProduct(): MockProduct {
    const brand = faker.helpers.arrayElement(this.brands);
    const model = faker.helpers.arrayElement(this.models);
    const basePrice = faker.number.int({ min: 200, max: 2500 });
    const sizes = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];

    return {
      id: faker.string.uuid(),
      name: `${brand} ${model} ${faker.commerce.productAdjective()}`,
      brand,
      sku: `${brand.toUpperCase().slice(0, 3)}-${faker.string.alphanumeric(8).toUpperCase()}`,
      price: basePrice,
      cost: Math.floor(basePrice * 0.6),
      category: faker.helpers.arrayElement(['limited', 'exclusive', 'grail', 'vintage']),
      stock_quantity: faker.number.int({ min: 0, max: 50 }),
      reserved_quantity: faker.number.int({ min: 0, max: 5 }),
      low_stock_threshold: faker.number.int({ min: 5, max: 15 }),
      image_url: `/api/placeholder/400/400`,
      sizes: sizes.map(size => ({
        size,
        stock: faker.number.int({ min: 0, max: 10 }),
        reserved: faker.number.int({ min: 0, max: 2 })
      })),
      sales_last_30_days: faker.number.int({ min: 0, max: 100 }),
      revenue_last_30_days: faker.number.int({ min: 0, max: 100000 }),
      trend: faker.helpers.arrayElement(['up', 'down', 'stable']),
      supplier: {
        id: faker.string.uuid(),
        name: faker.company.name(),
        lead_time_days: faker.number.int({ min: 7, max: 30 }),
        minimum_order: faker.number.int({ min: 10, max: 100 })
      }
    };
  }

  generateCustomer(): MockCustomer {
    const totalOrders = faker.number.int({ min: 0, max: 50 });
    const totalSpent = totalOrders * faker.number.int({ min: 200, max: 1500 });

    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      created_at: faker.date.past({ years: 2 }).toISOString(),
      total_orders: totalOrders,
      total_spent: totalSpent,
      average_order_value: totalOrders > 0 ? Math.floor(totalSpent / totalOrders) : 0,
      last_order_date: totalOrders > 0 ? faker.date.recent({ days: 90 }).toISOString() : undefined,
      loyalty_tier: faker.helpers.arrayElement(['bronze', 'silver', 'gold', 'platinum']),
      loyalty_points: faker.number.int({ min: 0, max: 10000 }),
      preferred_brands: faker.helpers.arrayElements(this.brands, { min: 1, max: 3 }),
      shoe_size: faker.helpers.arrayElement(['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'])
    };
  }

  generateMetrics(): MockMetrics {
    const baseRevenue = faker.number.int({ min: 10000, max: 100000 });
    const totalOrders = faker.number.int({ min: 100, max: 1000 });

    return {
      revenue: {
        daily: Math.floor(baseRevenue / 30),
        weekly: Math.floor(baseRevenue / 4),
        monthly: baseRevenue,
        yearly: baseRevenue * 12,
        growth_percentage: faker.number.float({ min: -20, max: 50, fractionDigits: 1 })
      },
      orders: {
        total: totalOrders,
        pending: Math.floor(totalOrders * 0.05),
        processing: Math.floor(totalOrders * 0.1),
        shipped: Math.floor(totalOrders * 0.15),
        delivered: Math.floor(totalOrders * 0.65),
        cancelled: Math.floor(totalOrders * 0.05),
        average_value: faker.number.int({ min: 300, max: 800 })
      },
      customers: {
        total: faker.number.int({ min: 5000, max: 20000 }),
        new_this_month: faker.number.int({ min: 100, max: 500 }),
        active: faker.number.int({ min: 1000, max: 5000 }),
        retention_rate: faker.number.float({ min: 30, max: 70, fractionDigits: 1 }),
        churn_rate: faker.number.float({ min: 5, max: 15, fractionDigits: 1 })
      },
      inventory: {
        total_products: faker.number.int({ min: 100, max: 500 }),
        total_value: faker.number.int({ min: 500000, max: 2000000 }),
        low_stock_items: faker.number.int({ min: 5, max: 30 }),
        out_of_stock_items: faker.number.int({ min: 0, max: 10 }),
        turnover_rate: faker.number.float({ min: 2, max: 8, fractionDigits: 1 })
      },
      performance: {
        conversion_rate: faker.number.float({ min: 1, max: 5, fractionDigits: 2 }),
        cart_abandonment_rate: faker.number.float({ min: 60, max: 75, fractionDigits: 1 }),
        average_session_duration: faker.number.int({ min: 120, max: 600 }),
        bounce_rate: faker.number.float({ min: 30, max: 50, fractionDigits: 1 })
      }
    };
  }

  generateTimeSeriesData(days: number = 30, metric: 'revenue' | 'orders' | 'customers' = 'revenue') {
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      let value = 0;

      switch (metric) {
        case 'revenue':
          value = faker.number.int({ min: 8000, max: 15000 });
          break;
        case 'orders':
          value = faker.number.int({ min: 20, max: 50 });
          break;
        case 'customers':
          value = faker.number.int({ min: 5, max: 25 });
          break;
      }

      // Add some weekly pattern (weekends are lower)
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        value = Math.floor(value * 0.7);
      }

      data.push({
        date: format(date, 'yyyy-MM-dd'),
        value,
        label: format(date, 'MMM dd')
      });
    }

    return data;
  }

  generateReorderSuggestions(count: number = 5): Array<{
    product: MockProduct;
    currentStock: number;
    suggestedQuantity: number;
    estimatedDemand: number;
    urgency: 'low' | 'medium' | 'high' | 'critical';
  }> {
    return Array.from({ length: count }, () => {
      const product = this.generateProduct();
      const currentStock = faker.number.int({ min: 0, max: 20 });
      const estimatedDemand = faker.number.int({ min: 10, max: 50 });
      const suggestedQuantity = Math.max(estimatedDemand - currentStock, product.supplier.minimum_order);

      let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (currentStock === 0) urgency = 'critical';
      else if (currentStock < 5) urgency = 'high';
      else if (currentStock < 10) urgency = 'medium';

      return {
        product,
        currentStock,
        suggestedQuantity,
        estimatedDemand,
        urgency
      };
    });
  }

  generateStockHistory(productId: string, days: number = 30) {
    const history = [];
    let currentStock = faker.number.int({ min: 20, max: 50 });

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const changeType = faker.helpers.arrayElement(['sale', 'restock', 'adjustment', 'return']);
      let change = 0;

      switch (changeType) {
        case 'sale':
          change = -faker.number.int({ min: 1, max: 3 });
          break;
        case 'restock':
          change = faker.number.int({ min: 10, max: 30 });
          break;
        case 'adjustment':
          change = faker.number.int({ min: -5, max: 5 });
          break;
        case 'return':
          change = faker.number.int({ min: 1, max: 2 });
          break;
      }

      const oldStock = currentStock;
      currentStock = Math.max(0, currentStock + change);

      history.push({
        id: faker.string.uuid(),
        product_id: productId,
        timestamp: date.toISOString(),
        change_type: changeType,
        quantity_change: change,
        old_quantity: oldStock,
        new_quantity: currentStock,
        user: faker.person.fullName(),
        notes: faker.lorem.sentence()
      });
    }

    return history;
  }
}

export const mockDataGenerator = new MockDataGenerator();