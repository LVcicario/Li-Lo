#!/usr/bin/env node
import chalk from 'chalk';

const BASE_URL = 'http://localhost:3000';

async function testPage(name, path) {
  try {
    console.log(chalk.cyan(`Testing ${name}...`));
    const response = await fetch(`${BASE_URL}${path}`);

    if (response.ok) {
      const html = await response.text();

      // Check for key content
      const hasProducts = html.includes('NIKE') || html.includes('JORDAN') || html.includes('TRAVIS') || html.includes('DIOR');
      const hasExclusiveContent = html.includes('EXCLUSIVE') || html.includes('LIMITED');
      const hasImages = html.includes('primary_image_url') || html.includes('img') || html.includes('Image');

      if (hasProducts) {
        console.log(chalk.green(`✓ ${name} - Products found`));
      } else {
        console.log(chalk.yellow(`⚠ ${name} - No products visible`));
      }

      if (hasExclusiveContent) {
        console.log(chalk.green(`✓ ${name} - Has exclusive/limited content`));
      }

      return true;
    } else {
      console.log(chalk.red(`✗ ${name} - HTTP ${response.status}`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`✗ ${name} - ${error.message}`));
    return false;
  }
}

async function testAPI() {
  try {
    console.log(chalk.cyan('\nTesting Products API...'));
    const response = await fetch(`${BASE_URL}/api/products`);

    if (response.ok) {
      const data = await response.json();
      const products = data.products || data;

      console.log(chalk.green(`✓ Found ${products.length} products total`));

      // Check first few products
      if (products.length > 0) {
        console.log(chalk.gray('\nTop 10 products by price:'));
        products.slice(0, 10).forEach((p, index) => {
          const category = getCategoryByIndex(index);
          console.log(chalk.gray(`  ${index + 1}. ${p.name} - €${p.base_price} (should be: ${category})`));
        });
      }

      return true;
    } else {
      console.log(chalk.red(`✗ API - HTTP ${response.status}`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`✗ API - ${error.message}`));
    return false;
  }
}

function getCategoryByIndex(index) {
  if (index === 0) return 'grail';
  if (index <= 3) return 'exclusive';
  if (index <= 8) return 'limited';
  return 'rare';
}

async function main() {
  console.log(chalk.cyan.bold('\n🔍 TESTING EXCLUSIVE & LIMITED PAGES\n'));

  // Test API first to see product data
  await testAPI();

  console.log(chalk.cyan('\nTesting Pages:'));

  // Test pages
  await testPage('Exclusive Page', '/exclusive');
  await testPage('Limited Page', '/limited');

  console.log(chalk.cyan('\n✅ Test Complete\n'));
}

main().catch(console.error);