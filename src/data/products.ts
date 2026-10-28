export interface Product {
  id: number;
  title: string;
  category: string;
  mainCategory: 'Kids' | 'Outfits' | 'Personalized Gifts' | 'Books' | 'Electronics' | 'Daily Essentials' | string;
  price: number;
  originalPrice: number;
  discount: string;
  soldOut: boolean;
  image: string;
  bannerImage?: string;
  tags?: string[];
}

// Live catalog is fetched dynamically from WordPress WooCommerce
export const allProducts: Product[] = [];

export function searchProducts(query: string, products: Product[] = []): Product[] {
  if (!query || !query.trim()) return products;
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);

  return products.filter((product) => {
    const titleMatch = product.title.toLowerCase();
    const categoryMatch = product.category.toLowerCase();
    const tagsMatch = product.tags?.join(' ').toLowerCase() || '';

    return terms.every(term => 
      titleMatch.includes(term) || 
      categoryMatch.includes(term) || 
      tagsMatch.includes(term)
    );
  });
}
