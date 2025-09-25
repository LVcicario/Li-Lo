#!/usr/bin/env node
import puppeteer, { Browser, Page } from 'puppeteer';

interface TestResult {
  name: string;
  status: 'pass' | 'fail';
  details?: string;
  time: number;
}

class RoleBasedAuthTester {
  private browser: Browser | null = null;
  private baseUrl = 'http://localhost:3000';
  private results: TestResult[] = [];

  private testAccounts = {
    ceo: {
      email: 'ceo@li-lo.com',
      password: 'CEO2024#Secure',
      expectedDashboard: '/ceo',
      role: 'ceo'
    },
    seller: {
      email: 'seller@li-lo.com',
      password: 'Seller2024#Safe',
      expectedDashboard: '/seller/dashboard',
      role: 'seller'
    },
    client: {
      email: 'test.client@example.com',
      password: 'Client2024#Test',
      expectedDashboard: '/account/dashboard',
      role: 'client'
    }
  };

  async init() {
    console.log('🚀 Initializing Role-Based Authentication Test Suite...\n');
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runTest(name: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    try {
      await testFn();
      this.results.push({
        name,
        status: 'pass',
        time: Date.now() - startTime
      });
      console.log(`✅ ${name}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.results.push({
        name,
        status: 'fail',
        details: errorMessage,
        time: Date.now() - startTime
      });
      console.log(`❌ ${name}: ${errorMessage}`);
    }
  }

  async testRegistration(): Promise<void> {
    const page = await this.browser!.newPage();
    try {
      await page.goto(`${this.baseUrl}/auth/register`, { waitUntil: 'networkidle0' });

      const testEmail = `test${Date.now()}@example.com`;
      const testPassword = 'TestPassword123!';

      // Fill registration form
      await page.type('input[name="email"]', testEmail);
      await page.type('input[name="password"]', testPassword);
      await page.type('input[name="confirmPassword"]', testPassword);
      await page.type('input[name="firstName"]', 'Test');
      await page.type('input[name="lastName"]', 'User');

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for redirect
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });

      // Should redirect to client dashboard (all registrations are clients)
      const url = page.url();
      if (!url.includes('/account/dashboard')) {
        throw new Error(`Expected redirect to /account/dashboard, got ${url}`);
      }
    } finally {
      await page.close();
    }
  }

  async testCEOLogin(): Promise<void> {
    const page = await this.browser!.newPage();
    try {
      await page.goto(`${this.baseUrl}/auth/login`, { waitUntil: 'networkidle0' });

      // Login with CEO email
      await page.type('input[name="email"]', this.testAccounts.ceo.email);
      await page.type('input[name="password"]', this.testAccounts.ceo.password);
      await page.click('button[type="submit"]');

      // Wait for redirect
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });

      // Should redirect to CEO dashboard
      const url = page.url();
      if (!url.includes(this.testAccounts.ceo.expectedDashboard)) {
        throw new Error(`Expected redirect to ${this.testAccounts.ceo.expectedDashboard}, got ${url}`);
      }

      // Verify CEO dashboard elements
      await page.waitForSelector('h1', { timeout: 5000 });
      const title = await page.$eval('h1', el => el.textContent);
      if (!title?.includes('CEO Dashboard')) {
        throw new Error('CEO Dashboard title not found');
      }
    } finally {
      await page.close();
    }
  }

  async testSellerLogin(): Promise<void> {
    const page = await this.browser!.newPage();
    try {
      await page.goto(`${this.baseUrl}/auth/login`, { waitUntil: 'networkidle0' });

      // Login with seller email
      await page.type('input[name="email"]', this.testAccounts.seller.email);
      await page.type('input[name="password"]', this.testAccounts.seller.password);
      await page.click('button[type="submit"]');

      // Wait for redirect
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });

      // Should redirect to seller dashboard
      const url = page.url();
      if (!url.includes(this.testAccounts.seller.expectedDashboard)) {
        throw new Error(`Expected redirect to ${this.testAccounts.seller.expectedDashboard}, got ${url}`);
      }

      // Verify seller dashboard elements
      await page.waitForSelector('h1', { timeout: 5000 });
      const title = await page.$eval('h1', el => el.textContent);
      if (!title?.includes('Seller Dashboard')) {
        throw new Error('Seller Dashboard title not found');
      }
    } finally {
      await page.close();
    }
  }

  async testClientLogin(): Promise<void> {
    const page = await this.browser!.newPage();
    try {
      await page.goto(`${this.baseUrl}/auth/login`, { waitUntil: 'networkidle0' });

      // Login with client email
      await page.type('input[name="email"]', this.testAccounts.client.email);
      await page.type('input[name="password"]', this.testAccounts.client.password);
      await page.click('button[type="submit"]');

      // Wait for redirect
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });

      // Should redirect to client dashboard
      const url = page.url();
      if (!url.includes(this.testAccounts.client.expectedDashboard)) {
        throw new Error(`Expected redirect to ${this.testAccounts.client.expectedDashboard}, got ${url}`);
      }
    } finally {
      await page.close();
    }
  }

  async testUnauthorizedAccess(): Promise<void> {
    const page = await this.browser!.newPage();
    try {
      // Try to access CEO dashboard without login
      await page.goto(`${this.baseUrl}/ceo`, { waitUntil: 'networkidle0' });

      // Should redirect to login
      const url = page.url();
      if (!url.includes('/auth/login')) {
        throw new Error('Unauthorized access to CEO dashboard not blocked');
      }
    } finally {
      await page.close();
    }
  }

  async testSellerInventoryAccess(): Promise<void> {
    const page = await this.browser!.newPage();
    try {
      await page.goto(`${this.baseUrl}/auth/login`, { waitUntil: 'networkidle0' });

      // Login as seller
      await page.type('input[name="email"]', this.testAccounts.seller.email);
      await page.type('input[name="password"]', this.testAccounts.seller.password);
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      // Navigate to inventory
      await page.goto(`${this.baseUrl}/seller/inventory`, { waitUntil: 'networkidle0' });

      // Verify inventory page loads
      await page.waitForSelector('h1', { timeout: 5000 });
      const title = await page.$eval('h1', el => el.textContent);
      if (!title?.includes('Inventory Management')) {
        throw new Error('Inventory Management page not accessible');
      }

      // Check for stock management elements
      const stockTable = await page.$('table');
      if (!stockTable) {
        throw new Error('Stock table not found on inventory page');
      }
    } finally {
      await page.close();
    }
  }

  async testCEOAnalyticsAccess(): Promise<void> {
    const page = await this.browser!.newPage();
    try {
      await page.goto(`${this.baseUrl}/auth/login`, { waitUntil: 'networkidle0' });

      // Login as CEO
      await page.type('input[name="email"]', this.testAccounts.ceo.email);
      await page.type('input[name="password"]', this.testAccounts.ceo.password);
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      // Check for CEO-specific elements
      await page.waitForSelector('.grid', { timeout: 5000 });

      // Verify KPI cards exist
      const kpiCards = await page.$$('[class*="card"]');
      if (kpiCards.length < 4) {
        throw new Error('Expected at least 4 KPI cards on CEO dashboard');
      }

      // Check for tabs
      const tabs = await page.$('[role="tablist"]');
      if (!tabs) {
        throw new Error('Analytics tabs not found on CEO dashboard');
      }
    } finally {
      await page.close();
    }
  }

  async testCrossRoleAccessDenial(): Promise<void> {
    const page = await this.browser!.newPage();
    try {
      await page.goto(`${this.baseUrl}/auth/login`, { waitUntil: 'networkidle0' });

      // Login as seller
      await page.type('input[name="email"]', this.testAccounts.seller.email);
      await page.type('input[name="password"]', this.testAccounts.seller.password);
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      // Try to access CEO dashboard
      await page.goto(`${this.baseUrl}/ceo`, { waitUntil: 'networkidle0' });

      // Should be redirected or show access denied
      const url = page.url();
      if (url.includes('/ceo')) {
        const pageContent = await page.content();
        if (!pageContent.includes('Access Denied') && !pageContent.includes('Unauthorized')) {
          throw new Error('Seller was able to access CEO dashboard');
        }
      }
    } finally {
      await page.close();
    }
  }

  async testLogout(): Promise<void> {
    const page = await this.browser!.newPage();
    try {
      await page.goto(`${this.baseUrl}/auth/login`, { waitUntil: 'networkidle0' });

      // Login first
      await page.type('input[name="email"]', this.testAccounts.client.email);
      await page.type('input[name="password"]', this.testAccounts.client.password);
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      // Find and click logout button
      const logoutButton = await page.$('button:has-text("Logout"), a:has-text("Logout")');
      if (logoutButton) {
        await logoutButton.click();
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
      }

      // Try to access protected route
      await page.goto(`${this.baseUrl}/account/dashboard`, { waitUntil: 'networkidle0' });

      // Should redirect to login
      const url = page.url();
      if (!url.includes('/auth/login')) {
        throw new Error('Logout did not properly clear session');
      }
    } finally {
      await page.close();
    }
  }

  async run() {
    await this.init();

    console.log('🔐 Testing Role-Based Authentication System\n');
    console.log('═══════════════════════════════════════════════\n');

    // Run all tests
    await this.runTest('User Registration (Always Client)', () => this.testRegistration());
    await this.runTest('CEO Login with Special Email', () => this.testCEOLogin());
    await this.runTest('Seller Login with Special Email', () => this.testSellerLogin());
    await this.runTest('Client Login with Regular Email', () => this.testClientLogin());
    await this.runTest('Unauthorized Access Prevention', () => this.testUnauthorizedAccess());
    await this.runTest('Seller Inventory Access', () => this.testSellerInventoryAccess());
    await this.runTest('CEO Analytics Access', () => this.testCEOAnalyticsAccess());
    await this.runTest('Cross-Role Access Denial', () => this.testCrossRoleAccessDenial());
    await this.runTest('Logout Functionality', () => this.testLogout());

    // Print summary
    console.log('\n═══════════════════════════════════════════════\n');
    console.log('📊 Test Results Summary\n');

    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const total = this.results.length;

    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => r.status === 'fail').forEach(r => {
        console.log(`  - ${r.name}: ${r.details}`);
      });
    }

    await this.cleanup();

    // Exit with appropriate code
    process.exit(failed > 0 ? 1 : 0);
  }
}

// Run the tests
const tester = new RoleBasedAuthTester();
tester.run().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});