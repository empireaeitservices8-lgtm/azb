export interface Product {
  id: number;
  title: string;
  category: string;
  mainCategory: 'Kids' | 'Outfits' | 'Personalized Gifts' | 'Books' | 'Electronics';
  price: number;
  originalPrice: number;
  discount: string;
  soldOut: boolean;
  image: string;
  tags?: string[];
}

export const allProducts: Product[] = [
  // Kids & Toys & Stationery
  {
    id: 1,
    title: "Dual Tip Alcohol Based Marker Cum Sketch (48 Piece Box)",
    category: "Kids, Stationery",
    mainCategory: "Kids",
    price: 699,
    originalPrice: 999,
    discount: "30% Off",
    soldOut: true,
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["marker", "sketch", "pens", "drawing", "kids", "art", "craft"]
  },
  {
    id: 2,
    title: "Twistup Rolling Crayon",
    category: "Kids, Stationery",
    mainCategory: "Kids",
    price: 319,
    originalPrice: 399,
    discount: "20% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["crayon", "color", "drawing", "kids", "stationery"]
  },
  {
    id: 3,
    title: "Girls Short Sets (Upto 4 Years)",
    category: "Kids, Outfits",
    mainCategory: "Kids",
    price: 349,
    originalPrice: 449,
    discount: "22% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["girls", "shorts", "kids clothing", "outfits", "dress"]
  },
  {
    id: 4,
    title: "Elephant Stack Attack",
    category: "Kids, Toys",
    mainCategory: "Kids",
    price: 361,
    originalPrice: 399,
    discount: "10% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1599623560574-39d485900c95?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["elephant", "stack", "game", "blocks", "toy", "toddler"]
  },
  {
    id: 5,
    title: "Pressing Giraffe Toy",
    category: "Kids, Toys",
    mainCategory: "Kids",
    price: 149,
    originalPrice: 169,
    discount: "12% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["giraffe", "pressing", "animal", "fun", "toys"]
  },
  {
    id: 6,
    title: "Premium Silicone Pencil Pouch",
    category: "Kids, Stationery",
    mainCategory: "Kids",
    price: 242,
    originalPrice: 399,
    discount: "39% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["pouch", "pencil", "silicone", "stationery", "school"]
  },
  {
    id: 7,
    title: "Weigh N Play | Math Balancing Toy",
    category: "Kids, Educational Toys",
    mainCategory: "Kids",
    price: 629,
    originalPrice: 699,
    discount: "10% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["math", "weigh", "balance", "educational", "learning", "toy"]
  },
  {
    id: 8,
    title: "6 in One Linear Pen (Magic Pen)",
    category: "Kids, Stationery",
    mainCategory: "Kids",
    price: 241,
    originalPrice: 299,
    discount: "19% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["magic pen", "linear pen", "stationery", "sketch", "pens"]
  },
  {
    id: 9,
    title: "Mikado Spiel Wooden Sticks Game",
    category: "Kids, Games",
    mainCategory: "Kids",
    price: 189,
    originalPrice: 249,
    discount: "24% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1599623560574-39d485900c95?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["wooden", "sticks", "game", "mikado", "board games"]
  },
  {
    id: 10,
    title: "Vacation Combo (Fun & Play, 2 Water Book, 1 HandWriting Book)",
    category: "Kids, Books & Kits",
    mainCategory: "Kids",
    price: 2650,
    originalPrice: 3999,
    discount: "34% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["combo", "water book", "handwriting", "drawing", "vacation"]
  },
  {
    id: 11,
    title: "Basketball Hoop Set for Kids",
    category: "Kids, Sports",
    mainCategory: "Kids",
    price: 849,
    originalPrice: 1999,
    discount: "58% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["basketball", "sports", "hoop", "outdoor", "games"]
  },

  // Outfits & Kids Clothing
  {
    id: 12,
    title: "Rompers for Babies Upto 12 months",
    category: "Kids, Outfits",
    mainCategory: "Outfits",
    price: 199,
    originalPrice: 299,
    discount: "33% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["romper", "baby", "infant", "clothes", "outfits", "cotton"]
  },
  {
    id: 13,
    title: "Kitty Premium Girl Long Polo Frock (5-10 Years)",
    category: "Kids, Outfits",
    mainCategory: "Outfits",
    price: 399,
    originalPrice: 499,
    discount: "20% Off",
    soldOut: true,
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["frock", "polo", "girls", "dress", "outfit", "kitty"]
  },
  {
    id: 14,
    title: "Rompers for Babies Upto 23 months",
    category: "Kids, Outfits",
    mainCategory: "Outfits",
    price: 199,
    originalPrice: 299,
    discount: "33% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["baby", "rompers", "toddler", "outfits", "cotton"]
  },
  {
    id: 15,
    title: "Girls Casual Short Co-Ord Sets (6-36 Months)",
    category: "Kids, Outfits",
    mainCategory: "Outfits",
    price: 349,
    originalPrice: 399,
    discount: "13% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["co-ord", "sets", "girls", "summer", "outfits"]
  },
  {
    id: 16,
    title: "Girls Pant Top Co-Ord Sets (Upto 3 Years)",
    category: "Kids, Outfits",
    mainCategory: "Outfits",
    price: 349,
    originalPrice: 399,
    discount: "13% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["pant top", "co-ord", "kids", "girls", "stylish"]
  },
  {
    id: 17,
    title: "Flamingo Premium Girl Long Polo Frock",
    category: "Kids, Outfits",
    mainCategory: "Outfits",
    price: 399,
    originalPrice: 499,
    discount: "20% Off",
    soldOut: true,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["frock", "flamingo", "dress", "fashion", "girls"]
  },

  // Outfits For You (Women & Fashion)
  {
    id: 18,
    title: "MINUKKI Designer Kurti Set",
    category: "Outfits, Women",
    mainCategory: "Outfits",
    price: 549,
    originalPrice: 999,
    discount: "45% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["kurti", "traditional", "women", "minukki", "ethnic", "outfits"]
  },
  {
    id: 19,
    title: "NEELAMBARI Elegant Saree & Suit",
    category: "Outfits, Women",
    mainCategory: "Outfits",
    price: 849,
    originalPrice: 1699,
    discount: "50% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["neelambari", "blue", "saree", "ethnic", "women", "outfits"]
  },
  {
    id: 20,
    title: "Pink Rosa Floral Dress",
    category: "Outfits, Women",
    mainCategory: "Outfits",
    price: 799,
    originalPrice: 1399,
    discount: "43% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["pink", "rosa", "floral", "dress", "western", "women"]
  },
  {
    id: 21,
    title: "BLACK PAKISTANI COLLECTION (2 PIECE)",
    category: "Outfits, Ethnic",
    mainCategory: "Outfits",
    price: 599,
    originalPrice: 999,
    discount: "40% Off",
    soldOut: true,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["pakistani", "black", "suit", "salwar", "ethnic", "2 piece"]
  },
  {
    id: 22,
    title: "Mehak Embroidered (3 Piece Set)",
    category: "Outfits, Ethnic",
    mainCategory: "Outfits",
    price: 799,
    originalPrice: 1499,
    discount: "47% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["mehak", "suit", "embroidery", "dupatta", "3 piece"]
  },
  {
    id: 23,
    title: "Pink Blossom Festive (3 Piece Set)",
    category: "Outfits, Ethnic",
    mainCategory: "Outfits",
    price: 899,
    originalPrice: 1599,
    discount: "44% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=400&h=500",
    tags: ["pink blossom", "festive", "chanderi", "ethnic", "3 piece"]
  },

  // Additional Categories: Gifts, Books, Electronics
  {
    id: 24,
    title: "Personalized Magic Mug with Photo Printing",
    category: "Personalized Gifts",
    mainCategory: "Personalized Gifts",
    price: 299,
    originalPrice: 499,
    discount: "40% Off",
    soldOut: false,
    image: "https://picsum.photos/seed/gifts/400/500",
    tags: ["gift", "mug", "photo", "custom", "personalized", "magic mug"]
  },
  {
    id: 25,
    title: "Kerala PSC Complete Master Guide 2026",
    category: "PSC Books",
    mainCategory: "Books",
    price: 499,
    originalPrice: 750,
    discount: "33% Off",
    soldOut: false,
    image: "https://picsum.photos/seed/books/400/500",
    tags: ["psc", "books", "kerala psc", "exam", "education", "study"]
  },
  {
    id: 26,
    title: "Wireless Smart Touch Earbuds",
    category: "Electronics",
    mainCategory: "Electronics",
    price: 699,
    originalPrice: 1499,
    discount: "53% Off",
    soldOut: false,
    image: "https://picsum.photos/seed/electronics/400/500",
    tags: ["electronics", "earbuds", "wireless", "bluetooth", "audio"]
  }
];

export function searchProducts(query: string): Product[] {
  if (!query || !query.trim()) return allProducts;
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);

  return allProducts.filter((product) => {
    const titleMatch = product.title.toLowerCase();
    const categoryMatch = product.category.toLowerCase();
    const tagsMatch = product.tags?.join(' ').toLowerCase() || '';

    // Check if every search term appears in title, category, or tags
    return terms.every(term => 
      titleMatch.includes(term) || 
      categoryMatch.includes(term) || 
      tagsMatch.includes(term)
    );
  });
}
