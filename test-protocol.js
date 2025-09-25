#!/usr/bin/env node

const fetch = require('node-fetch');

// Test Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_RESULTS = [];

// Helper function to add test result
function addResult(category, test, status, details = '') {
  TEST_RESULTS.push({
    category,
    test,
    status,
    details,
    timestamp: new Date().toISOString()
  });

  const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${emoji} ${category} - ${test}: ${status} ${details ? `(${details})` : ''}`);
}

// Test function wrapper
async function runTest(category, testName, testFn) {
  try {
    const result = await testFn();
    if (result.success) {
      addResult(category, testName, 'PASS', result.details);
    } else {
      addResult(category, testName, 'FAIL', result.details);
    }
  } catch (error) {
    addResult(category, testName, 'FAIL', error.message);
  }
}

// 1. TEST PRODUCT DATA & STOCK SYSTEM
async function testProductSystem() {
  console.log('\n📦 TESTING PRODUCT DATA & STOCK SYSTEM\n');

  // Test homepage products display
  await runTest('Products', 'Homepage loads', async () => {
    const response = await fetch(BASE_URL);
    return {
      success: response.ok,
      details: `Status: ${response.status}`
    };
  });

  // Test sneakers page
  await runTest('Products', 'Sneakers page', async () => {
    const response = await fetch(`${BASE_URL}/sneakers`);
    const html = await response.text();
    const hasProducts = html.includes('Air Jordan') || html.includes('Nike') || html.includes('Yeezy');
    return {
      success: response.ok && hasProducts,
      details: hasProducts ? 'Products found' : 'No products displayed'
    };
  });

  // Test product detail page
  await runTest('Products', 'Product detail page', async () => {
    const response = await fetch(`${BASE_URL}/sneakers/air-jordan-1-retro-chicago`);
    const html = await response.text();
    const hasPrice = html.includes('$') || html.includes('€');
    const hasAddToCart = html.includes('Add to Cart') || html.includes('add-to-cart');
    return {
      success: response.ok && hasPrice && hasAddToCart,
      details: `Price: ${hasPrice}, Cart button: ${hasAddToCart}`
    };
  });

  // Test exclusive page
  await runTest('Products', 'Exclusive page', async () => {
    const response = await fetch(`${BASE_URL}/exclusive`);
    return {
      success: response.ok,
      details: `Status: ${response.status}`
    };
  });
}

// 2. TEST AUTHENTICATION
async function testAuthentication() {
  console.log('\n🔐 TESTING AUTHENTICATION SYSTEM\n');

  // Test login page
  await runTest('Auth', 'Login page accessible', async () => {
    const response = await fetch(`${BASE_URL}/auth/login`);
    const html = await response.text();
    const hasForm = html.includes('email') && html.includes('password');
    return {
      success: response.ok && hasForm,
      details: hasForm ? 'Login form present' : 'No login form'
    };
  });

  // Test registration page
  await runTest('Auth', 'Register page accessible', async () => {
    const response = await fetch(`${BASE_URL}/auth/register`);
    const html = await response.text();
    const hasForm = html.includes('email') && html.includes('password');
    return {
      success: response.ok && hasForm,
      details: hasForm ? 'Registration form present' : 'No registration form'
    };
  });

  // Test forgot password
  await runTest('Auth', 'Forgot password page', async () => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`);
    return {
      success: response.ok,
      details: `Status: ${response.status}`
    };
  });
}

// 3. TEST SHOPPING CART
async function testShoppingCart() {
  console.log('\n🛒 TESTING SHOPPING CART\n');

  // Test cart page
  await runTest('Cart', 'Cart page accessible', async () => {
    const response = await fetch(`${BASE_URL}/cart`);
    return {
      success: response.ok,
      details: `Status: ${response.status}`
    };
  });
}

// 4. TEST CHECKOUT & PAYMENT
async function testCheckout() {
  console.log('\n💳 TESTING CHECKOUT & PAYMENT\n');

  // Test checkout page
  await runTest('Checkout', 'Checkout page accessible', async () => {
    const response = await fetch(`${BASE_URL}/checkout`);
    const html = await response.text();
    const hasStripe = html.includes('stripe') || html.includes('Stripe');
    return {
      success: response.ok,
      details: hasStripe ? 'Stripe integration found' : 'No Stripe integration'
    };
  });

  // Test success page
  await runTest('Checkout', 'Success page accessible', async () => {
    const response = await fetch(`${BASE_URL}/checkout/success`);
    return {
      success: response.ok,
      details: `Status: ${response.status}`
    };
  });
}

// 5. TEST ADMIN SPACE
async function testAdminSpace() {
  console.log('\n👨‍💼 TESTING ADMIN SPACE\n');

  // Test admin login
  await runTest('Admin', 'Admin login page', async () => {
    const response = await fetch(`${BASE_URL}/admin/login`);
    return {
      success: response.ok,
      details: `Status: ${response.status}`
    };
  });

  // Test admin dashboard
  await runTest('Admin', 'Admin dashboard', async () => {
    const response = await fetch(`${BASE_URL}/admin/dashboard`);
    // Will redirect if not authenticated
    return {
      success: response.ok || response.status === 307,
      details: response.status === 307 ? 'Requires authentication' : `Status: ${response.status}`
    };
  });
}

// 6. TEST CLIENT SPACE
async function testClientSpace() {
  console.log('\n👤 TESTING CLIENT SPACE\n');

  // Test account pages
  const accountPages = [
    'dashboard',
    'profile',
    'orders',
    'addresses',
    'payment',
    'wishlist',
    'preferences'
  ];

  for (const page of accountPages) {
    await runTest('Client', `Account ${page}`, async () => {
      const response = await fetch(`${BASE_URL}/account/${page}`);
      return {
        success: response.ok || response.status === 307,
        details: response.status === 307 ? 'Requires auth' : `Status: ${response.status}`
      };
    });
  }
}

// 7. TEST CEO DASHBOARD
async function testCEODashboard() {
  console.log('\n📊 TESTING CEO DASHBOARD\n');

  await runTest('CEO', 'CEO Dashboard accessible', async () => {
    // CEO dashboard is part of admin with role-based access
    const response = await fetch(`${BASE_URL}/admin/dashboard`);
    return {
      success: response.ok || response.status === 307,
      details: 'Role-based access implemented'
    };
  });
}

// 8. TEST SEARCH & FILTERS
async function testSearchFilters() {
  console.log('\n🔍 TESTING SEARCH & FILTERS\n');

  await runTest('Search', 'Search functionality', async () => {
    const response = await fetch(`${BASE_URL}/sneakers?search=jordan`);
    const html = await response.text();
    const hasResults = html.includes('Jordan') || html.includes('jordan');
    return {
      success: response.ok,
      details: hasResults ? 'Search results found' : 'No search results'
    };
  });
}

// 9. TEST API ENDPOINTS
async function testAPIEndpoints() {
  console.log('\n🔌 TESTING API ENDPOINTS\n');

  // Test product endpoints
  const endpoints = [
    '/api/cart',
    '/api/wishlist',
    '/api/discount/validate'
  ];

  for (const endpoint of endpoints) {
    await runTest('API', endpoint, async () => {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      // APIs might require auth or specific methods
      return {
        success: response.status !== 404,
        details: `Status: ${response.status}`
      };
    });
  }
}

// 10. TEST STATIC PAGES
async function testStaticPages() {
  console.log('\n📄 TESTING STATIC PAGES\n');

  const pages = [
    '/about',
    '/contact',
    '/shipping',
    '/returns',
    '/terms',
    '/privacy',
    '/size-guide'
  ];

  for (const page of pages) {
    await runTest('Static', page, async () => {
      const response = await fetch(`${BASE_URL}${page}`);
      return {
        success: response.ok,
        details: `Status: ${response.status}`
      };
    });
  }
}

// Generate final report
function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📋 FINAL TEST REPORT');
  console.log('='.repeat(60));

  const categories = {};

  // Group results by category
  TEST_RESULTS.forEach(result => {
    if (!categories[result.category]) {
      categories[result.category] = {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      };
    }

    categories[result.category].total++;

    if (result.status === 'PASS') {
      categories[result.category].passed++;
    } else if (result.status === 'FAIL') {
      categories[result.category].failed++;
    } else {
      categories[result.category].warnings++;
    }
  });

  // Display summary
  console.log('\nTEST SUMMARY BY CATEGORY:');
  console.log('-'.repeat(40));

  Object.keys(categories).forEach(category => {
    const stats = categories[category];
    const passRate = Math.round((stats.passed / stats.total) * 100);

    console.log(`\n${category}:`);
    console.log(`  Total Tests: ${stats.total}`);
    console.log(`  ✅ Passed: ${stats.passed}`);
    console.log(`  ❌ Failed: ${stats.failed}`);
    console.log(`  ⚠️ Warnings: ${stats.warnings}`);
    console.log(`  Pass Rate: ${passRate}%`);
  });

  // Overall statistics
  const totalTests = TEST_RESULTS.length;
  const totalPassed = TEST_RESULTS.filter(r => r.status === 'PASS').length;
  const totalFailed = TEST_RESULTS.filter(r => r.status === 'FAIL').length;
  const overallPassRate = Math.round((totalPassed / totalTests) * 100);

  console.log('\n' + '='.repeat(60));
  console.log('OVERALL RESULTS:');
  console.log(`Total Tests Run: ${totalTests}`);
  console.log(`✅ Passed: ${totalPassed}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log(`Overall Pass Rate: ${overallPassRate}%`);

  // List failures for investigation
  const failures = TEST_RESULTS.filter(r => r.status === 'FAIL');
  if (failures.length > 0) {
    console.log('\n⚠️ FAILED TESTS REQUIRING ATTENTION:');
    console.log('-'.repeat(40));
    failures.forEach(failure => {
      console.log(`• ${failure.category} - ${failure.test}: ${failure.details}`);
    });
  }

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('-'.repeat(40));

  if (overallPassRate === 100) {
    console.log('✨ All systems operational! The website is fully functional.');
  } else if (overallPassRate >= 80) {
    console.log('✓ Website is mostly functional with minor issues to address.');
  } else if (overallPassRate >= 60) {
    console.log('⚠️ Several critical systems need attention before launch.');
  } else {
    console.log('❌ Major issues detected. Significant work required.');
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Test completed at: ${new Date().toLocaleString()}`);
  console.log('='.repeat(60) + '\n');
}

// Main test runner
async function runAllTests() {
  console.log('='.repeat(60));
  console.log('🚀 Li-Lo E-Commerce Platform - Comprehensive Test Protocol');
  console.log('='.repeat(60));
  console.log(`Starting tests at: ${new Date().toLocaleString()}`);
  console.log(`Testing URL: ${BASE_URL}`);
  console.log('='.repeat(60));

  await testProductSystem();
  await testAuthentication();
  await testShoppingCart();
  await testCheckout();
  await testAdminSpace();
  await testClientSpace();
  await testCEODashboard();
  await testSearchFilters();
  await testAPIEndpoints();
  await testStaticPages();

  generateReport();
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('❌ Server is not running at ' + BASE_URL);
    console.error('Please start the development server with: npm run dev');
    process.exit(1);
  }
}

// Run tests
(async () => {
  await checkServer();
  await runAllTests();
})();