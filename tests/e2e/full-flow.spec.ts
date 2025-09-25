import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

// Test data
const testUsers = {
  ceo: {
    email: 'ceo@lilo-test.com',
    password: 'TestPassword123!',
    role: 'ceo'
  },
  seller: {
    email: 'seller@lilo-test.com',
    password: 'TestPassword123!',
    role: 'seller'
  },
  client: {
    email: faker.internet.email(),
    password: 'TestPassword123!',
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName()
  }
};

test.describe('Li-Lo Sneakers - Complete E2E Test Suite', () => {
  test.describe('Landing Page & Navigation', () => {
    test('should load homepage with all sections', async ({ page }) => {
      await page.goto('/');

      // Check hero section
      await expect(page.locator('h1').first()).toBeVisible();

      // Check navigation
      await expect(page.locator('nav')).toBeVisible();

      // Check featured products section
      await expect(page.getByText(/FEATURED DROPS/i)).toBeVisible();

      // Check categories
      await expect(page.getByText(/COLLECTIONS/i)).toBeVisible();
    });

    test('should navigate to product listing', async ({ page }) => {
      await page.goto('/');
      await page.click('text=Sneakers');
      await expect(page).toHaveURL('/sneakers');
      await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
    });

    test('should filter products', async ({ page }) => {
      await page.goto('/sneakers');

      // Apply brand filter
      await page.click('text=Filters');
      await page.click('text=Nike');

      // Apply price range
      await page.fill('[data-testid="price-min"]', '200');
      await page.fill('[data-testid="price-max"]', '500');

      // Check filtered results
      await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
    });
  });

  test.describe('Customer Journey', () => {
    test('should complete full purchase flow', async ({ page }) => {
      // 1. Register new account
      await page.goto('/auth/register');
      await page.fill('[name="email"]', testUsers.client.email);
      await page.fill('[name="password"]', testUsers.client.password);
      await page.fill('[name="firstName"]', testUsers.client.firstName);
      await page.fill('[name="lastName"]', testUsers.client.lastName);
      await page.click('button:has-text("Create Account")');

      // Wait for redirect to dashboard
      await expect(page).toHaveURL('/account/dashboard');

      // 2. Browse and add product to cart
      await page.goto('/sneakers');
      await page.click('[data-testid="product-card"]', { index: 0 });

      // Select size
      await page.click('button:has-text("9.5")');

      // Add to cart
      await page.click('button:has-text("Add to Cart")');
      await expect(page.locator('[data-testid="cart-notification"]')).toBeVisible();

      // 3. Go to cart
      await page.goto('/cart');
      await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();

      // Apply discount code
      await page.fill('[name="discount-code"]', 'FIRST10');
      await page.click('button:has-text("Apply")');

      // Proceed to checkout
      await page.click('button:has-text("Checkout")');

      // 4. Fill shipping information
      await expect(page).toHaveURL('/checkout');
      await page.fill('[name="address"]', '123 Test Street');
      await page.fill('[name="city"]', 'Test City');
      await page.fill('[name="postalCode"]', '12345');
      await page.selectOption('[name="country"]', 'United States');

      // 5. Complete payment (mock)
      await page.click('[data-testid="payment-method-card"]');
      await page.fill('[data-testid="card-number"]', '4242424242424242');
      await page.fill('[data-testid="card-expiry"]', '12/25');
      await page.fill('[data-testid="card-cvc"]', '123');

      await page.click('button:has-text("Complete Order")');

      // 6. Verify order success
      await expect(page).toHaveURL(/checkout\/success/);
      await expect(page.locator('text=Order Confirmed')).toBeVisible();
    });

    test('should track order with live updates', async ({ page }) => {
      // Login as existing customer
      await page.goto('/auth/login');
      await page.fill('[name="email"]', testUsers.client.email);
      await page.fill('[name="password"]', testUsers.client.password);
      await page.click('button:has-text("Sign In")');

      // Go to orders
      await page.goto('/account/orders');
      await page.click('[data-testid="order-row"]', { index: 0 });

      // Check live tracking
      await expect(page.locator('[data-testid="order-status"]')).toBeVisible();
      await expect(page.locator('[data-testid="tracking-timeline"]')).toBeVisible();

      // Enable notifications
      await page.click('button[aria-label="Enable notifications"]');

      // Check for real-time updates (mock)
      await page.waitForSelector('[data-testid="status-update"]', { timeout: 5000 });
    });

    test('should manage wishlist', async ({ page }) => {
      // Assume logged in
      await page.goto('/sneakers');

      // Add to wishlist
      await page.click('[data-testid="wishlist-button"]', { index: 0 });
      await expect(page.locator('[data-testid="wishlist-count"]')).toHaveText('1');

      // View wishlist
      await page.goto('/account/wishlist');
      await expect(page.locator('[data-testid="wishlist-item"]')).toBeVisible();

      // Move to cart
      await page.click('button:has-text("Move to Cart")');
      await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
    });
  });

  test.describe('Seller Dashboard', () => {
    test('should manage inventory and stock', async ({ page }) => {
      // Login as seller
      await page.goto('/auth/login');
      await page.fill('[name="email"]', testUsers.seller.email);
      await page.fill('[name="password"]', testUsers.seller.password);
      await page.click('button:has-text("Sign In")');

      // Navigate to inventory
      await page.goto('/seller/inventory');

      // Update stock
      await page.click('[data-testid="edit-stock"]', { index: 0 });
      await page.fill('[name="stock-quantity"]', '25');
      await page.click('button:has-text("Save")');

      // Verify update
      await expect(page.locator('[data-testid="stock-updated"]')).toBeVisible();
    });

    test('should create reorder with supplier', async ({ page }) => {
      await page.goto('/seller/reorder');

      // Toggle to mock data
      await page.click('[data-testid="data-toggle"]');

      // Select items for reorder
      await page.click('input[type="checkbox"]', { index: 0 });
      await page.click('input[type="checkbox"]', { index: 1 });

      // Adjust quantities
      await page.fill('[data-testid="order-quantity-0"]', '50');

      // Create purchase order
      await page.click('button:has-text("Create Order")');

      // Confirm order
      await page.click('button:has-text("Confirm Order")');

      // Verify order created
      await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
    });

    test('should view stock history and analytics', async ({ page }) => {
      await page.goto('/seller/history');

      // Check history table
      await expect(page.locator('[data-testid="history-table"]')).toBeVisible();

      // Switch to analytics tab
      await page.click('text=Analytics');

      // Check charts
      await expect(page.locator('canvas')).toBeVisible();

      // Export data
      await page.click('button:has-text("Export")');

      // Verify download started
      const download = await page.waitForEvent('download');
      expect(download.suggestedFilename()).toContain('stock-history');
    });
  });

  test.describe('CEO Dashboard', () => {
    test('should view comprehensive analytics', async ({ page }) => {
      // Login as CEO
      await page.goto('/auth/login');
      await page.fill('[name="email"]', testUsers.ceo.email);
      await page.fill('[name="password"]', testUsers.ceo.password);
      await page.click('button:has-text("Sign In")');

      await page.goto('/ceo');

      // Check KPI cards
      await expect(page.locator('[data-testid="revenue-card"]')).toBeVisible();
      await expect(page.locator('[data-testid="customers-card"]')).toBeVisible();

      // Check revenue chart
      await expect(page.locator('canvas')).toBeVisible();

      // Toggle mock/real data
      await page.click('[data-testid="data-toggle"]');
      await page.waitForLoadState('networkidle');

      // Verify data updated
      await expect(page.locator('[data-testid="mock-badge"]')).toBeVisible();
    });

    test('should export reports', async ({ page }) => {
      await page.goto('/ceo');

      await page.click('button:has-text("Export Report")');

      // Select export options
      await page.click('text=PDF');
      await page.click('text=Last 30 days');
      await page.click('button:has-text("Generate")');

      // Wait for download
      const download = await page.waitForEvent('download');
      expect(download.suggestedFilename()).toContain('report');
    });
  });

  test.describe('Stock Management & Live Updates', () => {
    test('should handle concurrent stock operations', async ({ browser }) => {
      // Create two browser contexts (simulating two users)
      const context1 = await browser.newContext();
      const context2 = await browser.newContext();

      const page1 = await context1.newPage();
      const page2 = await context2.newPage();

      // Both users view same product
      await page1.goto('/sneakers/test-product-1');
      await page2.goto('/sneakers/test-product-1');

      // Check initial stock
      const initialStock = await page1.locator('[data-testid="stock-count"]').textContent();

      // User 1 adds to cart
      await page1.click('button:has-text("Add to Cart")');

      // User 2 should see updated stock (real-time)
      await page2.waitForFunction(
        (stock) => document.querySelector('[data-testid="stock-count"]')?.textContent !== stock,
        initialStock,
        { timeout: 5000 }
      );

      // Clean up
      await context1.close();
      await context2.close();
    });

    test('should reserve stock during checkout', async ({ page }) => {
      await page.goto('/cart');

      // Start checkout
      await page.click('button:has-text("Checkout")');

      // Stock should be reserved
      await expect(page.locator('[data-testid="stock-reserved"]')).toBeVisible();

      // Wait for reservation timeout (mock - 15 min)
      // In real test, we'd use page.clock.fastForward()

      // Cancel checkout
      await page.click('button:has-text("Cancel")');

      // Stock should be released
      await expect(page.locator('[data-testid="stock-released"]')).toBeVisible();
    });
  });

  test.describe('Error Handling & Edge Cases', () => {
    test('should handle payment failure gracefully', async ({ page }) => {
      await page.goto('/checkout');

      // Use card that triggers failure
      await page.fill('[data-testid="card-number"]', '4000000000000002');
      await page.click('button:has-text("Complete Order")');

      // Check error message
      await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
      await expect(page.locator('text=Payment failed')).toBeVisible();
    });

    test('should handle out of stock during checkout', async ({ page }) => {
      await page.goto('/checkout');

      // Simulate stock running out
      await page.evaluate(() => {
        // Mock API response
        window.fetch = () => Promise.resolve({
          ok: false,
          status: 409,
          json: () => Promise.resolve({ error: 'Out of stock' })
        } as Response);
      });

      await page.click('button:has-text("Complete Order")');

      // Check error handling
      await expect(page.locator('text=Out of stock')).toBeVisible();
    });

    test('should handle network errors', async ({ page, context }) => {
      // Simulate offline
      await context.setOffline(true);

      await page.goto('/sneakers');

      // Check offline message
      await expect(page.locator('text=You are offline')).toBeVisible();

      // Go back online
      await context.setOffline(false);

      // Page should recover
      await page.reload();
      await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
    });
  });

  test.describe('Performance & Accessibility', () => {
    test('should load pages within performance budget', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;

      // Homepage should load in under 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should be accessible', async ({ page }) => {
      await page.goto('/');

      // Check for ARIA labels
      await expect(page.locator('[aria-label="Main navigation"]')).toBeVisible();

      // Check keyboard navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      // Should navigate via keyboard
      expect(page.url()).not.toBe('http://localhost:3000/');
    });

    test('should work on mobile devices', async ({ page, browserName }) => {
      if (browserName === 'chromium') {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        await page.goto('/');

        // Check mobile menu
        await page.click('[aria-label="Menu"]');
        await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

        // Check touch interactions
        await page.locator('[data-testid="product-card"]').first().tap();
        await expect(page).toHaveURL(/sneakers/);
      }
    });
  });
});