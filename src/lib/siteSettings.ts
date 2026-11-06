export interface HeroSlide {
  image: string;
  title: string;
  link: string;
}

export interface StoreFeature {
  title: string;
  description: string;
}

export interface InstagramReel {
  id: number;
  productId?: number;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: string;
  videoSrc: string;
  poster?: string;
  instagramUrl: string;
}

export interface SiteSettings {
  // Brand & Header
  site_logo: string;
  site_phone: string;
  site_phone_label: string;
  site_email: string;
  site_email_label: string;
  site_whatsapp: string;
  site_hours: string;
  site_location_default: string;

  // Promo Ribbon
  ribbon_enabled: boolean;
  ribbon_messages: string[];

  // Hero Slider
  hero_slides: HeroSlide[];

  // Offer Zone
  offer_zone_heading_prefix: string;
  offer_zone_heading_highlight: string;
  offer_zone_image: string;
  offer_zone_link: string;
  offer_zone_alt: string;

  // Store Features
  features: StoreFeature[];

  // Headings
  heading_bestsellers_title: string;
  heading_allproducts_title: string;
  heading_categories_title: string;
  heading_categories_subtitle: string;
  heading_toppicks_title: string;
  heading_outfits_kids_title: string;
  heading_outfits_you_title: string;

  // Instagram Reels
  reels_title: string;
  reels_subtitle: string;
  reels: InstagramReel[];

  // Footer
  footer_logo: string;
  footer_facebook_url: string;
  footer_whatsapp_url: string;
  footer_instagram_url: string;
  footer_copyright: string;

  // Contact Page
  contact_title: string;
  contact_subtitle: string;
  contact_address_text: string;
  contact_hours_text: string;

  // Policies
  policy_return_title: string;
  policy_return_content: string;
  policy_privacy_title: string;
  policy_privacy_content: string;
  policy_terms_title: string;
  policy_terms_content: string;
  policy_shipping_title: string;
  policy_shipping_content: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  // Brand & Header
  site_logo: '/images/logo.png',
  site_phone: '+91 9072525292',
  site_phone_label: 'Have Questions? Call Us 24/7',
  site_email: 'azbstoreofficial@gmail.com',
  site_email_label: 'Email Support',
  site_whatsapp: '919072525292',
  site_hours: 'Monday - Friday: 9:00 AM - 6:00 PM',
  site_location_default: 'Select location',

  // Promo Ribbon
  ribbon_enabled: true,
  ribbon_messages: [
    '📦 Unedited Unboxing Video Must for Damage Claims',
    '🚫 Products are non-returnable',
    '🚚 All India Free Shipping',
    '📅 Shipping Days : Wednesday & Saturday'
  ],

  // Hero Slider
  hero_slides: [
    {
      image: '/images/banner1.jpg',
      title: 'Happy Family Clothing & Toys',
      link: '/shop'
    },
    {
      image: '/images/banner2.jpg',
      title: 'Kids Funland Toys & Clothes',
      link: '/shop?category=Kids'
    },
    {
      image: '/images/banner3.jpg',
      title: 'Exclusive Offers & Gifts',
      link: '/shop'
    }
  ],

  // Offer Zone
  offer_zone_heading_prefix: 'OFFER',
  offer_zone_heading_highlight: 'ZONE',
  offer_zone_image: '/images/offer_banner.jpg',
  offer_zone_link: '/shop',
  offer_zone_alt: 'Offer Zone Banner',

  // Store Features
  features: [
    {
      title: 'Wide Assortment',
      description: 'Find the perfect fit with our wide range of sizes, colors, and styles.'
    },
    {
      title: 'Return Policy For Damaged',
      description: 'Defective or damaged items will be replaced. Unedited unboxing video is must for damage claims.'
    },
    {
      title: 'Best Prices & Offers',
      description: 'Save big with exclusive deals and discounts on your favourite products every day.'
    },
    {
      title: 'Support 24/7',
      description: 'Get help anytime via chat, call, or email from our friendly support team.'
    }
  ],

  // Headings
  heading_bestsellers_title: 'BEST SELLING PRODUCTS',
  heading_allproducts_title: 'ALL PRODUCTS',
  heading_categories_title: 'SHOP BY CATEGORY',
  heading_categories_subtitle: 'Explore all official categories curated for you',
  heading_toppicks_title: 'TOP PICKS',
  heading_outfits_kids_title: 'OUTFITS FOR KIDS',
  heading_outfits_you_title: 'OUTFITS FOR YOU',

  // Instagram Reels
  reels_title: 'INSTAGRAM REELS',
  reels_subtitle: 'Watch our latest videos & tap to view on Instagram',
  reels: [
    {
      id: 101,
      productId: 23,
      title: 'Neon 4-in-1 Car Charger Advertisement',
      category: 'Electronics',
      price: 999,
      originalPrice: 1050,
      discount: '5% Off',
      videoSrc: '/videos/reel1.mp4',
      poster: 'https://lightcyan-gorilla-655722.hostingersite.com/wp-content/uploads/2026/10/Neon-4-in-1-Car-Charger-Advertisement.png',
      instagramUrl: 'https://www.instagram.com/'
    },
    {
      id: 102,
      productId: 14,
      title: 'Stacked Black Shoe Shine Wipes',
      category: 'Shoe Care',
      price: 180,
      originalPrice: 249,
      discount: '28% Off',
      videoSrc: '/videos/reel2.mp4',
      poster: '/images/shoe_shine_wipes_banner.jpg',
      instagramUrl: 'https://www.instagram.com/'
    },
    {
      id: 103,
      productId: 12,
      title: '7 in 1 Laundry Pod (20 Pods Cleaning Power)',
      category: 'Home Essentials, Laundry',
      price: 200,
      originalPrice: 399,
      discount: '50% Off',
      videoSrc: '/videos/reel3.mp4',
      poster: '/images/laundry_pod_banner.jpg',
      instagramUrl: 'https://www.instagram.com/'
    },
    {
      id: 104,
      productId: 21,
      title: 'Drone E88 Dual-Camera Store Showcase',
      category: 'Electronics',
      price: 1399,
      originalPrice: 1500,
      discount: '7% Off',
      videoSrc: '/videos/reel4.mp4',
      poster: 'https://lightcyan-gorilla-655722.hostingersite.com/wp-content/uploads/2026/10/Drone-E88-Dual-Camera-Store-Showcase.png',
      instagramUrl: 'https://www.instagram.com/'
    }
  ],

  // Footer
  footer_logo: '/images/logo.png',
  footer_facebook_url: 'https://facebook.com',
  footer_whatsapp_url: 'https://wa.me/919072525292',
  footer_instagram_url: 'https://instagram.com',
  footer_copyright: 'Copyright 2026 © AZB Store. v1.1.5 | All rights Reserved',

  // Contact Page
  contact_title: 'Get In Touch',
  contact_subtitle: 'Have a question about our products, your order, or just want to say hi? We\'re always here to help. Drop us a message below!',
  contact_address_text: 'AZB Store\nKarunagappally\nKollam',
  contact_hours_text: 'Mon-Fri: 9:00 AM - 6:00 PM',

  // Policies
  policy_return_title: 'Return, Cancellation & Refund policy',
  policy_return_content: '<h2>Defective or Damaged Items</h2><p>Defective or damaged items will be replaced upon verification. <strong>An unedited continuous unboxing video is mandatory for all damage claims</strong> and must be submitted within 24 hours of delivery.</p><h2>Non-Returnable Policy</h2><p>Due to hygiene, electronic and packaging considerations, items once delivered and opened are non-returnable unless defective.</p>',
  policy_privacy_title: 'Privacy Policy',
  policy_privacy_content: '<p>At AZB Store, we respect your privacy and are committed to protecting any personal information you share with us. We collect necessary customer details such as delivery address, contact numbers, and payment verification solely to process your orders securely.</p><p>We never sell, rent, or trade your personal information to third parties.</p>',
  policy_terms_title: 'Terms of Service',
  policy_terms_content: '<p>By browsing or placing an order through AZB Store, you agree to comply with our store policies, dispatch schedules, and terms of use. Product availability and pricing are subject to real-time inventory updates.</p>',
  policy_shipping_title: 'Shipping Policy',
  policy_shipping_content: '<p><strong>Free Shipping:</strong> We provide Free All-India Shipping on eligible purchases across all pincodes.</p><p><strong>Dispatch Days:</strong> All orders are securely dispatched on our designated shipping days: <strong>Wednesday and Saturday</strong>. Once shipped, consignment tracking links are sent directly via SMS/WhatsApp.</p>'
};

/**
 * Safely extracts an image URL from ACF which could be:
 * - A string URL ("https://...")
 * - An object ({ url: "https://..." })
 * - Fallback to default
 */
export function extractImageUrl(val: any, fallback: string = ''): string {
  if (!val) return fallback;
  if (typeof val === 'string' && val.trim().length > 0) return val.trim();
  if (typeof val === 'object' && val.url) return String(val.url);
  if (typeof val === 'object' && val.source_url) return String(val.source_url);
  return fallback;
}

/**
 * Normalizes raw ACF fields into the typed SiteSettings structure
 */
export function parseACFToSiteSettings(acf: Record<string, any>): SiteSettings {
  if (!acf || typeof acf !== 'object') {
    return DEFAULT_SITE_SETTINGS;
  }

  // Parse Hero Slides (supports repeater or 5 discrete fields)
  let heroSlides: HeroSlide[] = [];
  if (Array.isArray(acf.hero_slides) && acf.hero_slides.length > 0) {
    heroSlides = acf.hero_slides.map((s: any) => ({
      image: extractImageUrl(s.image || s.hero_slide_image),
      title: s.title || s.hero_slide_title || '',
      link: s.link || s.hero_slide_link || '/shop'
    })).filter((s: HeroSlide) => !!s.image);
  }

  if (heroSlides.length === 0) {
    for (let i = 1; i <= 5; i++) {
      const img = extractImageUrl(acf[`hero_slide_${i}_image`]);
      if (img) {
        heroSlides.push({
          image: img,
          title: acf[`hero_slide_${i}_title`] || DEFAULT_SITE_SETTINGS.hero_slides[i - 1]?.title || 'Featured Banner',
          link: acf[`hero_slide_${i}_link`] || '/shop'
        });
      }
    }
  }

  if (heroSlides.length === 0) {
    heroSlides = DEFAULT_SITE_SETTINGS.hero_slides;
  }

  // Parse Ribbon Notices (supports repeater or discrete fields)
  let ribbonMessages: string[] = [];
  if (Array.isArray(acf.ribbon_messages) && acf.ribbon_messages.length > 0) {
    ribbonMessages = acf.ribbon_messages
      .map((m: any) => (typeof m === 'string' ? m : m.message || m.text))
      .filter(Boolean);
  }

  if (ribbonMessages.length === 0) {
    for (let i = 1; i <= 4; i++) {
      const msg = acf[`ribbon_notice_${i}`];
      if (msg && typeof msg === 'string' && msg.trim()) {
        ribbonMessages.push(msg.trim());
      }
    }
  }

  if (ribbonMessages.length === 0) {
    ribbonMessages = DEFAULT_SITE_SETTINGS.ribbon_messages;
  }

  // Parse Store Features
  const features: StoreFeature[] = [];
  for (let i = 1; i <= 4; i++) {
    const title = acf[`feature_${i}_title`] || DEFAULT_SITE_SETTINGS.features[i - 1]?.title;
    const description = acf[`feature_${i}_description`] || DEFAULT_SITE_SETTINGS.features[i - 1]?.description;
    if (title && description) {
      features.push({ title, description });
    }
  }

  // Parse Reels
  const reels: InstagramReel[] = [];
  for (let i = 1; i <= 4; i++) {
    const defaultReel = DEFAULT_SITE_SETTINGS.reels[i - 1];
    const title = acf[`reel_${i}_title`] || defaultReel?.title;
    if (title) {
      const videoSrc = acf[`reel_${i}_video_url`] || defaultReel?.videoSrc || `/videos/reel${i}.mp4`;
      const poster = extractImageUrl(acf[`reel_${i}_poster`], defaultReel?.poster);
      const category = acf[`reel_${i}_category`] || defaultReel?.category || '';
      const price = Number(acf[`reel_${i}_price`]) || defaultReel?.price || 0;
      const originalPrice = Number(acf[`reel_${i}_original_price`]) || defaultReel?.originalPrice || price;
      const discount = acf[`reel_${i}_discount`] || defaultReel?.discount || '';
      const instagramUrl = acf[`reel_${i}_instagram_url`] || defaultReel?.instagramUrl || 'https://www.instagram.com/';
      const productLink = acf[`reel_${i}_product_link`] || defaultReel?.productId?.toString() || '';
      
      const productIdMatch = productLink.match(/\d+/);
      const productId = productIdMatch ? parseInt(productIdMatch[0], 10) : defaultReel?.productId;

      reels.push({
        id: defaultReel?.id || 100 + i,
        productId,
        title,
        category,
        price,
        originalPrice,
        discount,
        videoSrc,
        poster,
        instagramUrl
      });
    }
  }

  return {
    // Brand & Header
    site_logo: extractImageUrl(acf.site_logo, DEFAULT_SITE_SETTINGS.site_logo),
    site_phone: acf.site_phone || DEFAULT_SITE_SETTINGS.site_phone,
    site_phone_label: acf.site_phone_label || DEFAULT_SITE_SETTINGS.site_phone_label,
    site_email: acf.site_email || DEFAULT_SITE_SETTINGS.site_email,
    site_email_label: acf.site_email_label || DEFAULT_SITE_SETTINGS.site_email_label,
    site_whatsapp: acf.site_whatsapp || DEFAULT_SITE_SETTINGS.site_whatsapp,
    site_hours: acf.site_hours || DEFAULT_SITE_SETTINGS.site_hours,
    site_location_default: acf.site_location_default || DEFAULT_SITE_SETTINGS.site_location_default,

    // Promo Ribbon
    ribbon_enabled: acf.ribbon_enabled !== undefined ? Boolean(acf.ribbon_enabled) : DEFAULT_SITE_SETTINGS.ribbon_enabled,
    ribbon_messages: ribbonMessages,

    // Hero Slider
    hero_slides: heroSlides,

    // Offer Zone
    offer_zone_heading_prefix: acf.offer_zone_heading_prefix || DEFAULT_SITE_SETTINGS.offer_zone_heading_prefix,
    offer_zone_heading_highlight: acf.offer_zone_heading_highlight || DEFAULT_SITE_SETTINGS.offer_zone_heading_highlight,
    offer_zone_image: extractImageUrl(acf.offer_zone_image, DEFAULT_SITE_SETTINGS.offer_zone_image),
    offer_zone_link: acf.offer_zone_link || DEFAULT_SITE_SETTINGS.offer_zone_link,
    offer_zone_alt: acf.offer_zone_alt || DEFAULT_SITE_SETTINGS.offer_zone_alt,

    // Store Features
    features: features.length > 0 ? features : DEFAULT_SITE_SETTINGS.features,

    // Headings
    heading_bestsellers_title: acf.heading_bestsellers_title || DEFAULT_SITE_SETTINGS.heading_bestsellers_title,
    heading_allproducts_title: acf.heading_allproducts_title || DEFAULT_SITE_SETTINGS.heading_allproducts_title,
    heading_categories_title: acf.heading_categories_title || DEFAULT_SITE_SETTINGS.heading_categories_title,
    heading_categories_subtitle: acf.heading_categories_subtitle || DEFAULT_SITE_SETTINGS.heading_categories_subtitle,
    heading_toppicks_title: acf.heading_toppicks_title || DEFAULT_SITE_SETTINGS.heading_toppicks_title,
    heading_outfits_kids_title: acf.heading_outfits_kids_title || DEFAULT_SITE_SETTINGS.heading_outfits_kids_title,
    heading_outfits_you_title: acf.heading_outfits_you_title || DEFAULT_SITE_SETTINGS.heading_outfits_you_title,

    // Instagram Reels
    reels_title: acf.reels_title || DEFAULT_SITE_SETTINGS.reels_title,
    reels_subtitle: acf.reels_subtitle || DEFAULT_SITE_SETTINGS.reels_subtitle,
    reels: reels.length > 0 ? reels : DEFAULT_SITE_SETTINGS.reels,

    // Footer
    footer_logo: extractImageUrl(acf.footer_logo, extractImageUrl(acf.site_logo, DEFAULT_SITE_SETTINGS.footer_logo)),
    footer_facebook_url: acf.footer_facebook_url || DEFAULT_SITE_SETTINGS.footer_facebook_url,
    footer_whatsapp_url: acf.footer_whatsapp_url || DEFAULT_SITE_SETTINGS.footer_whatsapp_url,
    footer_instagram_url: acf.footer_instagram_url || DEFAULT_SITE_SETTINGS.footer_instagram_url,
    footer_copyright: acf.footer_copyright || DEFAULT_SITE_SETTINGS.footer_copyright,

    // Contact Page
    contact_title: acf.contact_title || DEFAULT_SITE_SETTINGS.contact_title,
    contact_subtitle: acf.contact_subtitle || DEFAULT_SITE_SETTINGS.contact_subtitle,
    contact_address_text: acf.contact_address_text || DEFAULT_SITE_SETTINGS.contact_address_text,
    contact_hours_text: acf.contact_hours_text || DEFAULT_SITE_SETTINGS.contact_hours_text,

    // Policies
    policy_return_title: acf.policy_return_title || DEFAULT_SITE_SETTINGS.policy_return_title,
    policy_return_content: acf.policy_return_content || DEFAULT_SITE_SETTINGS.policy_return_content,
    policy_privacy_title: acf.policy_privacy_title || DEFAULT_SITE_SETTINGS.policy_privacy_title,
    policy_privacy_content: acf.policy_privacy_content || DEFAULT_SITE_SETTINGS.policy_privacy_content,
    policy_terms_title: acf.policy_terms_title || DEFAULT_SITE_SETTINGS.policy_terms_title,
    policy_terms_content: acf.policy_terms_content || DEFAULT_SITE_SETTINGS.policy_terms_content,
    policy_shipping_title: acf.policy_shipping_title || DEFAULT_SITE_SETTINGS.policy_shipping_title,
    policy_shipping_content: acf.policy_shipping_content || DEFAULT_SITE_SETTINGS.policy_shipping_content
  };
}

/**
 * Fetches settings from WordPress REST API (options or page ACF)
 */
export async function fetchLiveSiteSettings(): Promise<SiteSettings> {
  const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://lightcyan-gorilla-655722.hostingersite.com';

  try {
    // 1. Try fetching options page if ACF Pro options are used
    try {
      const optRes = await fetch(`${WP_URL}/wp-json/acf/v3/options/options`, {
        cache: 'no-store'
      });
      if (optRes.ok) {
        const optData = await optRes.json();
        if (optData && optData.acf && Object.keys(optData.acf).length > 0) {
          return parseACFToSiteSettings(optData.acf);
        }
      }
    } catch {
      // Options page not present or free ACF used
    }

    // 2. Try fetching from "site-settings" page
    const pageSlugs = ['site-settings', 'home', 'settings'];
    for (const slug of pageSlugs) {
      try {
        const res = await fetch(`${WP_URL}/wp-json/wp/v2/pages?slug=${slug}`, {
          cache: 'no-store'
        });
        if (res.ok) {
          const pages = await res.json();
          if (Array.isArray(pages) && pages.length > 0 && pages[0]?.acf && Object.keys(pages[0].acf).length > 0) {
            return parseACFToSiteSettings(pages[0].acf);
          }
        }
      } catch {
        // continue
      }
    }

    // 3. Check any WordPress page with populated ACF
    try {
      const allPagesRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages?per_page=20`, {
        cache: 'no-store'
      });
      if (allPagesRes.ok) {
        const allPages = await allPagesRes.json();
        if (Array.isArray(allPages)) {
          for (const page of allPages) {
            if (page.acf && Object.keys(page.acf).length > 0) {
              return parseACFToSiteSettings(page.acf);
            }
          }
        }
      }
    } catch {
      // fallback
    }

    return DEFAULT_SITE_SETTINGS;
  } catch (err) {
    console.error('Failed to fetch site settings from WordPress ACF:', err);
    return DEFAULT_SITE_SETTINGS;
  }
}
