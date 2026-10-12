const STORE_URL = process.env.NEXT_PUBLIC_WC_STORE_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://lightcyan-gorilla-655722.hostingersite.com';
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  status: string;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  description: string;
  short_description: string;
  categories: Array<{ id: number; name: string; slug: string }>;
  images: Array<{ id: number; src: string; alt: string; name: string }>;
  tags: Array<{ id: number; name: string; slug: string }>;
}

export async function fetchWCProducts(params: Record<string, string | number> = {}): Promise<WCProduct[]> {
  try {
    const searchParams = new URLSearchParams({
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
      per_page: '100',
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    });

    const res = await fetch(`${STORE_URL}/wp-json/wc/v3/products?${searchParams.toString()}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error(`WooCommerce API Error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Failed to fetch products from WooCommerce:', err);
    return [];
  }
}

export async function fetchWCCategories() {
  try {
    const searchParams = new URLSearchParams({
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
      per_page: '100'
    });

    const res = await fetch(`${STORE_URL}/wp-json/wc/v3/products/categories?${searchParams.toString()}`, {
      cache: 'no-store'
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch categories from WooCommerce:', err);
    return [];
  }
}

export interface WCMediaItem {
  id: number;
  source_url: string;
  title: { rendered: string };
  alt_text?: string;
  media_type?: string;
  mime_type?: string;
}

export async function fetchWCMedia(): Promise<WCMediaItem[]> {
  try {
    const res = await fetch(`${STORE_URL}/wp-json/wp/v2/media?per_page=100`, {
      cache: 'no-store'
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Failed to fetch media from WordPress:', err);
    return [];
  }
}
