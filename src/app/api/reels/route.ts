import { NextResponse } from 'next/server';
import { InstagramReel, DEFAULT_SITE_SETTINGS } from '@/lib/siteSettings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STORE_URL = process.env.NEXT_PUBLIC_WC_STORE_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://lightcyan-gorilla-655722.hostingersite.com';
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY || 'ck_e497e69c0680d9054f73f8b36238746212d1fe2c';
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || 'cs_9bb054c8d61c59efce9e1c637c2f344d9ba6bd7e';

// In-memory cache for fast reads
let memoryCache: InstagramReel[] | null = null;
let lastProductWithMetaId: number = 159;

async function getSavedReelsFromWC(): Promise<InstagramReel[]> {
  try {
    const authQuery = `consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
    
    // 1. Try last known product ID
    if (lastProductWithMetaId) {
      const res = await fetch(`${STORE_URL}/wp-json/wc/v3/products/${lastProductWithMetaId}?${authQuery}`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const prod = await res.json();
        const meta = prod.meta_data?.find((m: any) => m.key === '_azb_custom_reels');
        if (meta && meta.value) {
          const parsed = typeof meta.value === 'string' ? JSON.parse(meta.value) : meta.value;
          if (Array.isArray(parsed) && parsed.length > 0) {
            memoryCache = parsed;
            return parsed;
          }
        }
      }
    }

    // 2. Search for any product with _azb_custom_reels
    const listRes = await fetch(`${STORE_URL}/wp-json/wc/v3/products?per_page=10&${authQuery}`, {
      cache: 'no-store'
    });
    if (listRes.ok) {
      const prods = await listRes.json();
      if (Array.isArray(prods) && prods.length > 0) {
        lastProductWithMetaId = prods[0].id;
        for (const p of prods) {
          const meta = p.meta_data?.find((m: any) => m.key === '_azb_custom_reels');
          if (meta && meta.value) {
            const parsed = typeof meta.value === 'string' ? JSON.parse(meta.value) : meta.value;
            if (Array.isArray(parsed) && parsed.length > 0) {
              lastProductWithMetaId = p.id;
              memoryCache = parsed;
              return parsed;
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error fetching reels from WooCommerce meta:', err);
  }

  // Fallback to memory cache or default reels
  return memoryCache || DEFAULT_SITE_SETTINGS.reels;
}

async function saveReelsToWC(reels: InstagramReel[]): Promise<boolean> {
  memoryCache = reels;

  try {
    const authQuery = `consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
    const targetId = lastProductWithMetaId || 159;

    const res = await fetch(`${STORE_URL}/wp-json/wc/v3/products/${targetId}?${authQuery}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meta_data: [{ key: '_azb_custom_reels', value: JSON.stringify(reels) }]
      }),
      cache: 'no-store'
    });

    if (res.ok) {
      return true;
    } else {
      const err = await res.text();
      console.error('Failed to save reels to WooCommerce:', err);
      return false;
    }
  } catch (err) {
    console.error('Network error saving reels to WooCommerce:', err);
    return false;
  }
}

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

export async function GET() {
  const reels = await getSavedReelsFromWC();
  return NextResponse.json({
    success: true,
    reels
  }, { headers: NO_CACHE_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, videoSrc, poster, price, originalPrice, discount, instagramUrl, productId, category } = body;

    if (!title || !videoSrc) {
      return NextResponse.json(
        { success: false, message: 'Title and Video URL are required.' },
        { status: 400 }
      );
    }

    const currentReels = await getSavedReelsFromWC();
    const newId = Date.now();

    const newReel: InstagramReel = {
      id: newId,
      productId: productId ? Number(productId) : undefined,
      title: title.trim(),
      description: description?.trim() || '',
      category: category?.trim() || 'General',
      price: Number(price) || 0,
      originalPrice: Number(originalPrice) || Number(price) || 0,
      discount: discount?.trim() || (originalPrice && price && Number(originalPrice) > Number(price) 
        ? `${Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)}% Off` 
        : ''),
      videoSrc: videoSrc.trim(),
      poster: poster?.trim() || '',
      instagramUrl: instagramUrl?.trim() || 'https://www.instagram.com/'
    };

    // Prepend new reel so it shows up first!
    const updated = [newReel, ...currentReels];
    await saveReelsToWC(updated);

    return NextResponse.json({
      success: true,
      message: 'Reel added successfully and is now live on the website!',
      reel: newReel,
      reels: updated
    }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error('Error adding reel:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to add reel' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, videoSrc, poster, price, originalPrice, discount, instagramUrl, productId, category } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Reel ID is required for update.' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const currentReels = await getSavedReelsFromWC();
    const updated = currentReels.map((r) => {
      if (r.id === Number(id)) {
        return {
          ...r,
          title: title !== undefined ? title.trim() : r.title,
          description: description !== undefined ? description.trim() : r.description,
          videoSrc: videoSrc !== undefined ? videoSrc.trim() : r.videoSrc,
          poster: poster !== undefined ? poster.trim() : r.poster,
          category: category !== undefined ? category.trim() : r.category,
          price: price !== undefined ? Number(price) : r.price,
          originalPrice: originalPrice !== undefined ? Number(originalPrice) : r.originalPrice,
          discount: discount !== undefined ? discount.trim() : r.discount,
          instagramUrl: instagramUrl !== undefined ? instagramUrl.trim() : r.instagramUrl,
          productId: productId !== undefined ? (productId ? Number(productId) : undefined) : r.productId
        };
      }
      return r;
    });

    await saveReelsToWC(updated);

    return NextResponse.json({
      success: true,
      message: 'Reel updated successfully!',
      reels: updated
    }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error('Error updating reel:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to update reel' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get('id');
    let id: number | null = idParam ? parseInt(idParam, 10) : null;

    if (!id) {
      try {
        const body = await req.json();
        if (body.id) id = parseInt(body.id, 10);
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Reel ID is required to delete.' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const currentReels = await getSavedReelsFromWC();
    const updated = currentReels.filter(r => r.id !== id);

    await saveReelsToWC(updated);

    return NextResponse.json({
      success: true,
      message: 'Reel removed successfully!',
      reels: updated
    }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error('Error deleting reel:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to delete reel' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

