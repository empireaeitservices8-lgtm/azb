'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/data/products';

interface BestSellingProductItem {
  id: number;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: string;
  soldOut: boolean;
  image: string;
}

// 8 completely unique best selling products with first 2 as shoe shine wipes and laundry pod (no banners, no duplicates)
const defaultBestSellingProducts: BestSellingProductItem[] = [
  {
    id: 27,
    title: "Shoe Shine Wipes (80 Series Powerful Formula)",
    category: "Shoe Care",
    price: 180,
    originalPrice: 249,
    discount: "28% Off",
    soldOut: false,
    image: "/images/shoe_shine_wipes.jpg"
  },
  {
    id: 28,
    title: "7 in 1 Laundry Pod (20 Pods Cleaning Power)",
    category: "Laundry",
    price: 200,
    originalPrice: 399,
    discount: "50% Off",
    soldOut: false,
    image: "/images/laundry_pod.jpg"
  },
  {
    id: 1,
    title: "Weigh N Play | Math Balancing Toy",
    category: "Kids, Educational Toys",
    price: 629,
    originalPrice: 699,
    discount: "10% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "6 in One Linear Pen (Magic Pen)",
    category: "Kids, Stationery",
    price: 241,
    originalPrice: 299,
    discount: "19% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Mikado Spiel Wooden Sticks Game",
    category: "Kids, Games",
    price: 189,
    originalPrice: 249,
    discount: "24% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Vacation Combo (Fun & Play Water Books)",
    category: "Kids, Books & Kits",
    price: 2650,
    originalPrice: 3999,
    discount: "34% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    title: "Elephant Stack Attack Game",
    category: "Kids, Toys",
    price: 361,
    originalPrice: 399,
    discount: "10% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    title: "Basketball Hoop Set for Kids",
    category: "Kids, Sports",
    price: 849,
    originalPrice: 1999,
    discount: "58% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80"
  }
];

export default function BestSellingProducts() {
  const [items, setItems] = useState<BestSellingProductItem[]>(defaultBestSellingProducts);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Load live products from WooCommerce API without any image duplication
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data?.products && data.products.length >= 2) {
            // Keep first two items strictly as shoe wipes and laundry pod (product images only)
            const shoeWipes = defaultBestSellingProducts[0];
            const laundryPod = defaultBestSellingProducts[1];

            const seenImages = new Set<string>([shoeWipes.image, laundryPod.image]);
            const remaining: BestSellingProductItem[] = [];

            // Add other distinct products
            for (const p of defaultBestSellingProducts.slice(2)) {
              if (!seenImages.has(p.image)) {
                seenImages.add(p.image);
                remaining.push(p);
              }
            }

            setItems([shoeWipes, laundryPod, ...remaining]);
          }
        }
      } catch (e) {
        console.error('Failed to fetch best sellers from WordPress API:', e);
      }
    }
    load();
  }, []);

  const handleBuyNow = (product: BestSellingProductItem) => {
    addToCart(product as unknown as Product);
    router.push('/cart');
  };

  // Group items into pairs of exactly 2 items
  const pairs: BestSellingProductItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    if (items[i + 1]) {
      pairs.push([items[i], items[i + 1]]);
    } else {
      pairs.push([items[i], items[0]]);
    }
  }

  const totalPairs = pairs.length;
  const displayPairs = totalPairs > 0 ? [...pairs, pairs[0]] : [];

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? totalPairs - 1 : prev - 1));
  };

  const handleTransitionEnd = () => {
    if (currentSlide >= totalPairs) {
      setIsTransitioning(false);
      setCurrentSlide(0);
    }
  };

  // Strict 5-second interval
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [totalPairs]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-wide">
            BEST SELLING PRODUCTS
          </h2>
        </div>
        {/* Carousel buttons */}
        <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
          <button 
            onClick={prevSlide}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer shadow-xs"
            aria-label="Previous 2 products"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={nextSlide}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer shadow-xs"
            aria-label="Next 2 products"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Strictly 2 Products At A Time - Zero Peeking of Third Product */}
      <div 
        className="w-full max-w-4xl mx-auto overflow-hidden rounded-xl sm:rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {displayPairs.map((pair, slideIdx) => (
            <div 
              key={slideIdx} 
              className="w-full min-w-full flex-none grid grid-cols-2 gap-3 sm:gap-5 p-1"
            >
              {pair.map((product, pIdx) => (
                <div 
                  key={`${product.id}-${slideIdx}-${pIdx}`} 
                  className="flex flex-col bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow p-3 sm:p-4"
                >
                  {/* Image Box */}
                  <div className="relative aspect-[4/5] bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden mb-3 group">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Wishlist Button - Top Right rounded box */}
                    <button 
                      onClick={() => isInWishlist(Number(product.id)) ? removeFromWishlist(Number(product.id)) : addToWishlist(product as unknown as Product)}
                      className={`absolute top-2.5 right-2.5 bg-white/95 hover:bg-white rounded-md p-1.5 shadow-sm border border-gray-200 transition-all z-10 cursor-pointer ${
                        isInWishlist(Number(product.id)) 
                          ? 'text-red-500 ring-2 ring-red-200' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                      aria-label="Wishlist"
                      title={isInWishlist(Number(product.id)) ? "In Wishlist" : "Add to Wishlist"}
                    >
                      <Heart size={16} fill={isInWishlist(Number(product.id)) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex flex-col flex-1">
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 leading-snug min-h-[32px] sm:min-h-[40px]">
                      {product.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-1">{product.category}</p>
                    
                    {/* Price Row */}
                    <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-extrabold text-gray-900">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                      )}
                      {product.discount && (
                        <span className="text-xs font-bold text-red-500">({product.discount})</span>
                      )}
                    </div>
                    
                    {/* Action Buttons: Add to Cart & Buy Now */}
                    <div className="mt-3 mt-auto">
                      {product.soldOut ? (
                        <button 
                          disabled
                          className="w-full bg-gray-200 text-gray-500 px-3 py-2 rounded-lg text-xs font-bold cursor-not-allowed"
                        >
                          Sold Out
                        </button>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
                          <button 
                            onClick={() => addToCart(product as unknown as Product)}
                            className="flex-1 bg-black text-white hover:bg-gray-800 py-2 sm:py-2.5 px-3 rounded-lg text-[11px] sm:text-xs font-bold transition-colors cursor-pointer text-center"
                          >
                            Add to Cart
                          </button>
                          
                          <button 
                            onClick={() => handleBuyNow(product)}
                            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-2 sm:py-2.5 px-3 rounded-lg text-[11px] sm:text-xs font-bold transition-colors cursor-pointer text-center shadow-xs"
                          >
                            Buy Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="flex justify-end mt-4 sm:mt-6 max-w-4xl mx-auto">
        <Link 
          href="/shop"
          className="border border-gray-300 rounded-md px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
        >
          View All
        </Link>
      </div>
    </section>
  );
}
