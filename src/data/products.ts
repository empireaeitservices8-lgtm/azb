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
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80",
    tags: ["basketball", "sports", "hoop", "outdoor", "games"]
  },

  // Outfits & Kids Clothing (Real Kids Images Only)
  {
    id: 12,
    title: "Rompers for Babies Upto 12 months",
    category: "Kids, Outfits",
    mainCategory: "Outfits",
    price: 199,
    originalPrice: 299,
    discount: "33% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=600&q=80",
    tags: ["frock", "flamingo", "dress", "fashion", "girls"]
  },

  // Outfits For You (Women & Girls Dress Images)
  {
    id: 18,
    title: "MINUKKI Designer Kurti Set",
    category: "Outfits, Women",
    mainCategory: "Outfits",
    price: 549,
    originalPrice: 999,
    discount: "45% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    tags: ["electronics", "earbuds", "wireless", "bluetooth", "audio"]
  },
  {
    id: 27,
    title: "Shoe Shine Wipes (80 Series Powerful Formula)",
    category: "Daily Essentials, Shoe Care",
    mainCategory: "Daily Essentials",
    price: 180,
    originalPrice: 249,
    discount: "28% Off",
    soldOut: false,
    image: "/images/shoe_shine_wipes.jpg",
    bannerImage: "/images/shoe_shine_wipes_banner.jpg",
    tags: ["shoe", "shine", "wipes", "cleaning", "sneakers", "boots", "80series", "leather", "care", "instant clean"]
  },
  {
    id: 28,
    title: "7 in 1 Laundry Pod (20 Pods Cleaning Power)",
    category: "Home Essentials, Laundry",
    mainCategory: "Daily Essentials",
    price: 200,
    originalPrice: 399,
    discount: "50% Off",
    soldOut: false,
    image: "/images/laundry_pod.jpg",
    bannerImage: "/images/laundry_pod_banner.jpg",
    tags: ["laundry", "pod", "detergent", "cleaning", "wash", "clothes", "fragrance", "7 in 1"]
  }
];

export function searchProducts(query: string, products: Product[] = allProducts): Product[] {
  if (!query || !query.trim()) return products;
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);

  return products.filter((product) => {
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
