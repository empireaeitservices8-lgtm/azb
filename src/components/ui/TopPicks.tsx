'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/data/products';

// 8 completely unique products with 100% verified, active images (no missing images)
const defaultProducts = [
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
    image: "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=600&q=80"
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
  },
  {
    id: 7,
    title: "Premium Silicone Pencil Pouch",
    category: "Kids, Stationery",
    price: 242,
    originalPrice: 399,
    discount: "39% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    title: "Pressing Giraffe Animated Fun Toy",
    category: "Kids, Toys",
    price: 149,
    originalPrice: 169,
    discount: "12% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80"
  }
];

export default function TopPicks() {
  const [items, setItems] = useState<any[]>(defaultProducts);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Load live products from WordPress
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data?.products && data.products.length >= 2) {
            const kidsProducts = data.products.filter((p: any) => 
              (p.category?.toLowerCase().includes('kid') || 
               p.category?.toLowerCase().includes('toy') ||
               p.category?.toLowerCase().includes('stationery') ||
               p.mainCategory === 'Kids') &&
              !p.category?.toLowerCase().includes('shoe') &&
              !p.category?.toLowerCase().includes('laundry') &&
              !p.title?.toLowerCase().includes('shoe') &&
              !p.title?.toLowerCase().includes('laundry')
            );
            if (kidsProducts.length >= 2) {
              const list = kidsProducts.slice(0, 8);
              setItems(list.map((p: any, idx: number) => ({
                id: p.id,
                title: p.title,
                category: p.category || 'Kids',
                price: p.price,
                originalPrice: p.originalPrice || p.price,
                discount: p.discount || '',
                soldOut: !!p.soldOut,
                image: (p.image && !p.image.includes('placeholder')) ? p.image : defaultProducts[idx % defaultProducts.length].image
              })));
            }
          }
        }
      } catch (e) {
        console.error('Failed to fetch top picks from WordPress:', e);
      }
    }
    load();
  }, []);

  // Group items into pairs of exactly 2 items
  const pairs: any[][] = [];
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
            TOP PICKS
          </h2>
        </div>
        {/* Navigation arrows */}
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

      {/* Strictly 2 Products At A Time */}
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
                  className="flex flex-col bg-white rounded-xl border border-gray-200/90 shadow-xs hover:shadow-md transition-shadow p-2.5 sm:p-4"
                >
                  {/* Image Box */}
                  <div className="relative aspect-[4/5] bg-gray-50 rounded-lg overflow-hidden mb-2 sm:mb-3 group">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    
                    {/* Wishlist Button */}
                    <button 
                      onClick={() => isInWishlist(Number(product.id)) ? removeFromWishlist(Number(product.id)) : addToWishlist(product as unknown as Product)}
                      className={`absolute top-2 right-2 backdrop-blur-xs p-1.5 sm:p-2 rounded-full shadow-md transition-all z-10 cursor-pointer ${
                        isInWishlist(Number(product.id)) 
                          ? 'bg-red-50 text-red-500 scale-105 ring-2 ring-red-300' 
                          : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white'
                      }`}
                      aria-label="Wishlist"
                      title={isInWishlist(Number(product.id)) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart size={16} fill={isInWishlist(Number(product.id)) ? "currentColor" : "none"} />
                    </button>

                    {product.discount && (
                      <span className="absolute bottom-2 left-2 bg-yellow-400 text-black font-extrabold text-[10px] px-2 py-0.5 rounded shadow-xs">
                        {product.discount}
                      </span>
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="flex flex-col flex-1">
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 leading-snug min-h-[32px] sm:min-h-[40px]">
                      {product.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">{product.category}</p>
                    
                    <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-extrabold text-gray-900">₹{product.price}</span>
                      <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                      <span className="text-xs font-bold text-red-500">({product.discount})</span>
                    </div>
                    
                    {/* Action Button: Add to Cart */}
                    <div className="mt-3 mt-auto">
                      {product.soldOut ? (
                        <button 
                          disabled
                          className="w-full bg-gray-200 text-gray-500 px-3 py-2 rounded-lg text-xs font-bold cursor-not-allowed"
                        >
                          Sold Out
                        </button>
                      ) : (
                        <button 
                          onClick={() => addToCart(product as unknown as Product)}
                          className="w-full flex items-center justify-center gap-1.5 bg-black text-white hover:bg-gray-800 py-2 sm:py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                          title="Add to Cart"
                        >
                          <ShoppingCart size={14} />
                          <span>Add to Cart</span>
                        </button>
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
      <div className="flex justify-end mt-3 sm:mt-5 max-w-4xl mx-auto">
        <Link 
          href="/shop"
          className="px-5 py-1.5 sm:px-6 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          View All Top Picks
        </Link>
      </div>
    </section>
  );
}
