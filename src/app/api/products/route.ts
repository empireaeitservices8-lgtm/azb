import { NextResponse } from 'next/server';
import { fetchWCProducts, fetchWCMedia, WCProduct, WCMediaItem } from '@/lib/woocommerce';
import { allProducts, Product } from '@/data/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function mapWCToProduct(wc: WCProduct, mediaList: WCMediaItem[] = []): Product {
  const nameLower = (wc.name || '').toLowerCase();
  let regularPrice = parseFloat(wc.regular_price || wc.price || '0');
  let price = parseFloat(wc.price || wc.regular_price || '0');
  
  // Intelligent price fallback if not set in WooCommerce
  if (price === 0 && nameLower.includes('shoe') && nameLower.includes('wipe')) {
    price = 180;
    regularPrice = 249;
  }

  let discount = '';
  if (regularPrice > price && regularPrice > 0) {
    const pct = Math.round(((regularPrice - price) / regularPrice) * 100);
    discount = `${pct}% Off`;
  }

  const categoryNames = wc.categories?.map(c => c.name).filter(n => n.toLowerCase() !== 'uncategorized') || [];
  let categoryString = categoryNames.join(', ');

  // Determine mainCategory and sensible category label
  let mainCategory: Product['mainCategory'] = 'Daily Essentials';
  const catLower = (categoryString || '').toLowerCase();

  if (catLower.includes('kid') || catLower.includes('toy') || catLower.includes('stationery') ||
      nameLower.includes('kid') || nameLower.includes('toy') || nameLower.includes('game') || nameLower.includes('pen')) {
    mainCategory = 'Kids';
    if (!categoryString) categoryString = 'Kids';
  } else if (catLower.includes('outfit') || catLower.includes('kurti') || catLower.includes('saree') || catLower.includes('ethnic') || catLower.includes('women') ||
             nameLower.includes('outfit') || nameLower.includes('kurti') || nameLower.includes('saree') || nameLower.includes('dress') || nameLower.includes('romper')) {
    mainCategory = 'Outfits';
    if (!categoryString) categoryString = 'Outfits';
  } else if (catLower.includes('gift') || catLower.includes('mug') || nameLower.includes('gift') || nameLower.includes('mug')) {
    mainCategory = 'Personalized Gifts';
    if (!categoryString) categoryString = 'Personalized Gifts';
  } else if (catLower.includes('book') || catLower.includes('psc') || nameLower.includes('book')) {
    mainCategory = 'Books';
    if (!categoryString) categoryString = 'Books';
  } else if (catLower.includes('electronic') || catLower.includes('earbud') ||
             nameLower.includes('drone') || nameLower.includes('charger') || nameLower.includes('electronic') || nameLower.includes('camera')) {
    mainCategory = 'Electronics';
    if (!categoryString) categoryString = 'Electronics';
  } else if (nameLower.includes('shoe') && nameLower.includes('wipe')) {
    mainCategory = 'Daily Essentials';
    if (!categoryString) categoryString = 'Shoe Care';
  } else if (nameLower.includes('laundry') || nameLower.includes('pod')) {
    mainCategory = 'Daily Essentials';
    if (!categoryString) categoryString = 'Laundry, Home Essentials';
  } else if (!categoryString) {
    categoryString = 'General';
  }

  // Use WordPress uploaded image if available; otherwise check WordPress Media library
  let image = (wc.images && wc.images.length > 0 && wc.images[0]?.src)
    ? wc.images[0].src
    : '';

  if (!image || image.includes('placeholder')) {
    // Search WordPress Media library for an uploaded image matching product name
    const matchedMedia = mediaList.find(m => {
      const mediaTitle = (m.title?.rendered || '').toLowerCase();
      const mediaAlt = (m.alt_text || '').toLowerCase();
      const keywords = nameLower.split(/[\s\-–—]+/).filter(w => w.length > 3);
      return keywords.some(k => mediaTitle.includes(k) || mediaAlt.includes(k));
    });

    if (matchedMedia && matchedMedia.source_url) {
      image = matchedMedia.source_url;
    }
  }

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
    const [wcProducts, wcMedia] = await Promise.all([
      fetchWCProducts({ per_page: 100 }),
      fetchWCMedia()
    ]);
    
    if (wcProducts && wcProducts.length > 0) {
      const mapped = wcProducts.map(wc => mapWCToProduct(wc, wcMedia));
      
      // Combine live WooCommerce products first, then fill with unique catalog products
      const seenTitles = new Set(mapped.map(p => p.title.toLowerCase().trim()));
      const seenIds = new Set(mapped.map(p => p.id));
      const remainingLocal = allProducts
        .filter(p => !seenTitles.has(p.title.toLowerCase().trim()))
        .map(p => (seenIds.has(p.id) ? { ...p, id: p.id + 10000 } : p));

      return NextResponse.json({
        source: 'woocommerce',
        wcCount: mapped.length,
        products: [...mapped, ...remainingLocal]
      });
    }

    // Fallback if WooCommerce store has no products yet
    return NextResponse.json({
      source: 'local',
      wcCount: 0,
      products: allProducts
    });
  } catch (err) {
    console.error('Error in /api/products route:', err);
    return NextResponse.json({
      source: 'local',
      wcCount: 0,
      products: allProducts
    });
  }
}
