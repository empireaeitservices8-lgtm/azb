import { NextResponse } from 'next/server';
import { fetchWCCategories } from '@/lib/woocommerce';
import { hostingerCategories, CategoryItem } from '@/data/categories';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const wcCategories = await fetchWCCategories();

    if (Array.isArray(wcCategories) && wcCategories.length > 0) {
      // Map existing local categories with live image overrides if uploaded in Hostinger
      const categoryMap = new Map<string, any>();
      for (const cat of wcCategories) {
        if (cat.name) {
          categoryMap.set(cat.name.toLowerCase().trim(), cat);
        }
      }

      const mergedCategories: CategoryItem[] = hostingerCategories.map(localCat => {
        const live = categoryMap.get(localCat.name.toLowerCase().trim());
        if (live && live.image && live.image.src) {
          return {
            ...localCat,
            image: live.image.src
          };
        }
        return localCat;
      });

      return NextResponse.json({
        success: true,
        categories: mergedCategories
      });
    }

    return NextResponse.json({
      success: true,
      categories: hostingerCategories
    });
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return NextResponse.json({
      success: false,
      categories: hostingerCategories
    });
  }
}
