import { NextResponse } from 'next/server';
import { fetchWCProducts, WCProduct } from '@/lib/woocommerce';
import { allProducts, Product } from '@/data/products';

function mapWCToProduct(wc: WCProduct): Product {
  const regularPrice = parseFloat(wc.regular_price || wc.price || '0');
  const price = parseFloat(wc.price || wc.regular_price || '0');
  
  let discount = '';
  if (regularPrice > price && regularPrice > 0) {
    const pct = Math.round(((regularPrice - price) / regularPrice) * 100);
    discount = `${pct}% Off`;
  }

  const categoryNames = wc.categories?.map(c => c.name) || [];
  const categoryString = categoryNames.join(', ') || 'General';

  // Determine mainCategory
  let mainCategory: Product['mainCategory'] = 'Daily Essentials';
  const catLower = categoryString.toLowerCase();
  if (catLower.includes('kid') || catLower.includes('toy') || catLower.includes('stationery')) {
    mainCategory = 'Kids';
  } else if (catLower.includes('outfit') || catLower.includes('kurti') || catLower.includes('saree') || catLower.includes('ethnic') || catLower.includes('women')) {
    mainCategory = 'Outfits';
  } else if (catLower.includes('gift') || catLower.includes('mug')) {
    mainCategory = 'Personalized Gifts';
  } else if (catLower.includes('book') || catLower.includes('psc')) {
    mainCategory = 'Books';
  } else if (catLower.includes('electronic') || catLower.includes('earbud')) {
    mainCategory = 'Electronics';
  }

  // Use WordPress uploaded image if available; otherwise fallback intelligently
  let image = (wc.images && wc.images.length > 0 && wc.images[0]?.src)
    ? wc.images[0].src
    : '';

  const nameLower = wc.name.toLowerCase();
  if (!image || image.includes('placeholder')) {
    if (nameLower.includes('shoe') && nameLower.includes('wipe')) {
      image = '/images/shoe_shine_wipes.jpg';
    } else if (nameLower.includes('laundry') || nameLower.includes('pod')) {
      image = '/images/laundry_pod.jpg';
    } else if (nameLower.includes('romper') || nameLower.includes('frock') || catLower.includes('kid')) {
      image = 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80';
    } else if (nameLower.includes('kurti') || nameLower.includes('saree') || nameLower.includes('dress') || catLower.includes('women')) {
      image = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
    } else {
      image = '/images/product-placeholder.svg';
    }
  }

  return {
    id: wc.id,
    title: wc.name,
    category: categoryString,
    mainCategory,
    price,
    originalPrice: regularPrice || price,
    discount,
    soldOut: wc.stock_status === 'outofstock',
    image,
    tags: wc.tags?.map(t => t.name) || []
  };
}

export async function GET() {
  try {
    const wcProducts = await fetchWCProducts({ per_page: 100 });
    
    if (wcProducts && wcProducts.length > 0) {
      const mapped = wcProducts.map(mapWCToProduct);
      return NextResponse.json({
        source: 'woocommerce',
        products: mapped
      });
    }

    // Fallback if WooCommerce store has no products yet
    return NextResponse.json({
      source: 'local',
      products: allProducts
    });
  } catch (err) {
    console.error('Error in /api/products route:', err);
    return NextResponse.json({
      source: 'local',
      products: allProducts
    });
  }
}
