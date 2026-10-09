import fs from 'fs';
import path from 'path';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    env[match[1]] = (match[2] || '').trim();
  }
});

const STORE_URL = env.NEXT_PUBLIC_WC_STORE_URL || 'https://lightcyan-gorilla-655722.hostingersite.com';
const CONSUMER_KEY = env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = env.WC_CONSUMER_SECRET;

if (!CONSUMER_KEY || !CONSUMER_SECRET) {
  console.error('Missing WooCommerce Consumer Key or Secret in .env.local');
  process.exit(1);
}

const authQuery = `consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

async function wcRequest(endpoint, method = 'GET', body = null) {
  const url = `${STORE_URL}/wp-json/wc/v3/${endpoint}${endpoint.includes('?') ? '&' : '?'}${authQuery}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`WooCommerce API Error (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

async function getOrCreateCategory(categoryMap, name) {
  if (categoryMap.has(name.toLowerCase())) {
    return categoryMap.get(name.toLowerCase());
  }

  console.log(`Creating category: "${name}"...`);
  try {
    const created = await wcRequest('products/categories', 'POST', { name });
    categoryMap.set(name.toLowerCase(), created.id);
    return created.id;
  } catch (err) {
    console.error(`Failed to create category "${name}":`, err.message);
    return null;
  }
}

async function main() {
  console.log('Connecting to WooCommerce store at:', STORE_URL);

  // 1. Fetch existing categories
  console.log('Fetching existing categories...');
  const existingCategories = await wcRequest('products/categories?per_page=100');
  const categoryMap = new Map();
  for (const cat of existingCategories) {
    categoryMap.set(cat.name.toLowerCase(), cat.id);
  }

  // 2. Read products from src/data/products.ts
  const productsTsPath = path.resolve(process.cwd(), 'src/data/products.ts');
  const content = fs.readFileSync(productsTsPath, 'utf8');

  // Simple parser to extract product objects
  const match = content.match(/export const allProducts: Product\[\] = (\[[\s\S]*?\]);\s*$/m);
  if (!match) {
    console.error('Could not locate allProducts array in src/data/products.ts');
    process.exit(1);
  }

  // Parse products
  const products = eval(match[1]);
  console.log(`Found ${products.length} products to sync.`);

  // 3. Fetch existing products to avoid duplicates
  const existingProducts = await wcRequest('products?per_page=100');
  const existingTitles = new Set(existingProducts.map(p => p.name.toLowerCase().trim()));

  for (const prod of products) {
    if (existingTitles.has(prod.title.toLowerCase().trim())) {
      console.log(`Skipping existing product: "${prod.title}"`);
      continue;
    }

    // Prepare categories
    const catNames = (prod.category || prod.mainCategory || 'General')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const categories = [];
    for (const cName of catNames) {
      const catId = await getOrCreateCategory(categoryMap, cName);
      if (catId) categories.push({ id: catId });
    }

    // Images left empty so user can upload directly via WordPress admin
    const images = [];

    // Tags
    const tags = (prod.tags || []).map(t => ({ name: t }));

    // Price configuration
    const regularPrice = String(prod.originalPrice || prod.price);
    const salePrice = prod.price < prod.originalPrice ? String(prod.price) : undefined;

    const payload = {
      name: prod.title,
      type: 'simple',
      regular_price: regularPrice,
      ...(salePrice ? { sale_price: salePrice } : {}),
      description: `<p>${prod.title}</p>`,
      short_description: `<p>${prod.category || prod.mainCategory}</p>`,
      categories,
      images,
      tags,
      manage_stock: false,
      stock_status: prod.soldOut ? 'outofstock' : 'instock'
    };

    console.log(`Uploading product: "${prod.title}" (₹${prod.price})...`);
    try {
      const created = await wcRequest('products', 'POST', payload);
      console.log(` -> Created product ID ${created.id}: ${created.name}`);
    } catch (err) {
      console.error(` -> Error creating product "${prod.title}":`, err.message);
    }
  }

  console.log('\nSync completed successfully!');
}

main().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
