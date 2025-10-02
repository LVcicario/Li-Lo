#!/usr/bin/env node
import chalk from 'chalk';

const BASE_URL = 'http://localhost:3000';
let passed = 0;
let failed = 0;

async function testEndpoint(name, url, checkContent = null) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      if (checkContent) {
        const text = await response.text();
        if (text.includes(checkContent)) {
          console.log(chalk.green(`✓ ${name}`));
          passed++;
          return true;
        } else {
          console.log(chalk.yellow(`⚠ ${name} - missing content`));
          failed++;
          return false;
        }
      } else {
        console.log(chalk.green(`✓ ${name}`));
        passed++;
        return true;
      }
    } else {
      console.log(chalk.red(`✗ ${name} - ${response.status}`));
      failed++;
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`✗ ${name} - ${error.message}`));
    failed++;
    return false;
  }
}

async function main() {
  console.log(chalk.cyan.bold('\n🚀 QUICK VALIDATION TEST\n'));

  // Test critical pages
  console.log(chalk.cyan('📄 PAGES:'));
  await testEndpoint('Homepage', BASE_URL, 'LI-LO');
  await testEndpoint('Sneakers', `${BASE_URL}/sneakers`);
  await testEndpoint('Cart', `${BASE_URL}/cart`);
  await testEndpoint('Checkout', `${BASE_URL}/checkout`);
  await testEndpoint('Login', `${BASE_URL}/auth/login`);
  await testEndpoint('Worker Dashboard', `${BASE_URL}/worker`);
  await testEndpoint('CEO Dashboard', `${BASE_URL}/ceo`);
  await testEndpoint('Order Success', `${BASE_URL}/order-success`);

  // Test APIs
  console.log(chalk.cyan('\n🔌 APIs:'));
  await testEndpoint('Products API', `${BASE_URL}/api/products`);
  await testEndpoint('Categories API', `${BASE_URL}/api/products/categories`);
  await testEndpoint('Brands API', `${BASE_URL}/api/products/brands`);

  // Test checkout flow
  console.log(chalk.cyan('\n🛒 CHECKOUT FLOW:'));
  const checkoutTest = await fetch(`${BASE_URL}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{
        id: 'test',
        name: 'Test Product',
        price: 100,
        quantity: 1,
        size: '42'
      }],
      shippingInfo: {
        fullName: 'Test User',
        email: 'test@example.com',
        address: '123 Test St',
        city: 'Test City',
        postalCode: '12345',
        country: 'Test Country'
      },
      subtotal: 100,
      shipping: 10,
      tax: 10,
      total: 120
    })
  });

  if (checkoutTest.ok) {
    const data = await checkoutTest.json();
    if (data.url) {
      console.log(chalk.green('✓ Checkout API - Stripe session created'));
      passed++;
    } else {
      console.log(chalk.yellow('⚠ Checkout API - No Stripe URL'));
      failed++;
    }
  } else {
    console.log(chalk.red('✗ Checkout API failed'));
    failed++;
  }

  // Email system check
  console.log(chalk.cyan('\n📧 EMAIL SYSTEM:'));
  const emailConfigured = process.env.SMTP_HOST || process.env.SMTP_USER;
  if (emailConfigured) {
    console.log(chalk.green('✓ Email configuration found'));
    passed++;
  } else {
    console.log(chalk.yellow('⚠ Email not configured'));
    failed++;
  }

  // Final report
  const total = passed + failed;
  const score = Math.round((passed / total) * 100);

  console.log(chalk.cyan('\n' + '='.repeat(50)));
  console.log(chalk.cyan.bold('📊 RESULTS'));
  console.log(chalk.cyan('='.repeat(50)));
  console.log(`Score: ${score >= 90 ? chalk.green.bold : score >= 70 ? chalk.yellow.bold : chalk.red.bold}(${score}/100)`);
  console.log(`Passed: ${chalk.green(passed)}/${total}`);
  if (failed > 0) console.log(`Failed: ${chalk.red(failed)}`);

  if (score === 100) {
    console.log(chalk.green.bold('\n🎉 PERFECT! Everything works at 100%!'));
  } else if (score >= 90) {
    console.log(chalk.green.bold('\n✅ EXCELLENT! Platform is production-ready.'));
  } else if (score >= 80) {
    console.log(chalk.yellow.bold('\n⚠️ GOOD! Minor issues to fix.'));
  } else {
    console.log(chalk.red.bold('\n❌ NEEDS WORK! Critical issues found.'));
  }
}

main().catch(console.error);