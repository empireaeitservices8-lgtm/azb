'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/data/products';

// 8 completely unique products
const products = [
  {
    id: 1,
    title: "Weigh N Play | Math Balancing Toy",
    category: "Kids",
    price: 629,
    originalPrice: 699,
    discount: "10% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 2,
    title: "6 in One Linear Pen (Magic Pen)",
    category: "Kids",
    price: 241,
    originalPrice: 299,
    discount: "19% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 3,
    title: "Mikado Spiel Wooden Sticks Game",
    category: "Kids",
    price: 189,
    originalPrice: 249,
    discount: "24% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1599623560574-39d485900c95?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 4,
    title: "Vacation Combo (Fun & Play Water Books)",
    category: "Kids",
    price: 2650,
    originalPrice: 3999,
    discount: "34% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 5,
    title: "Elephant Stack Attack Game",
    category: "Kids",
    price: 361,
    originalPrice: 399,
    discount: "10% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 6,
    title: "Basketball Hoop Set for Kids",
    category: "Kids",
    price: 849,
    originalPrice: 1999,
    discount: "58% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 7,
    title: "Premium Silicone Pencil Pouch",
    category: "Kids",
    price: 242,
    originalPrice: 399,
    discount: "39% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 8,
    title: "Pressing Giraffe Animated Fun Toy",
    category: "Kids",
    price: 149,
    originalPrice: 169,
    discount: "12% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400&h=500"
  }
];

// Group items into pairs of exactly 2 items
const pairs: typeof products[] = [];
for (let i = 0; i < products.length; i += 2) {
  pairs.push([products[i], products[i + 1]]);
}

// Append clone of pair 0 at the end for seamless infinite loop
const displayPairs = [...pairs, pairs[0]];

export default function TopPicks() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const totalPairs = pairs.length;

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
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Handpicked recommendations for you</p>
        </div>
        {/* Buttons hidden on mobile, shown on desktop */}
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
                  className="flex flex-col bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow p-2 sm:p-3"
                >
                  {/* Image Box */}
                  <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden mb-2 sm:mb-3">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <button 
                      onClick={() => isInWishlist(Number(product.id)) ? removeFromWishlist(Number(product.id)) : addToWishlist(product as unknown as Product)}
                      className={`absolute top-2 right-2 backdrop-blur-xs p-1.5 rounded shadow-sm transition-colors z-10 cursor-pointer ${
                        isInWishlist(Number(product.id)) ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-500'
                      }`}
                      aria-label="Add to wishlist"
                    >
                      <Heart size={16} fill={isInWishlist(Number(product.id)) ? "currentColor" : "none"} />
                    </button>
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
                    
                    <div className="mt-3 mt-auto">
                      {product.soldOut ? (
                        <button className="w-full bg-black text-white px-3 py-1.5 rounded text-xs font-bold cursor-not-allowed opacity-90">
                          Sold Out
                        </button>
                      ) : (
                        <button 
                          onClick={() => addToCart(product as unknown as Product)}
                          className="w-full bg-black text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          Add to Cart
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
          View All
        </Link>
      </div>
    </section>
  );
}
