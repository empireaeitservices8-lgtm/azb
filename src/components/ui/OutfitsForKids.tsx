'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/data/products';

// 8 completely unique kids products
const products = [
  {
    id: 1,
    title: "Rompers for Babies Upto 12 months",
    category: "Kids, Outfits",
    price: 199,
    originalPrice: 299,
    discount: "33% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 2,
    title: "Kitty Premium Girl Long Polo Frock (5-10 Years)",
    category: "Kids, Outfits",
    price: 399,
    originalPrice: 499,
    discount: "20% Off",
    soldOut: true,
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 3,
    title: "Rompers for Babies Upto 23 months",
    category: "Kids, Outfits",
    price: 199,
    originalPrice: 299,
    discount: "33% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 4,
    title: "Girls Casual Short Co-Ord Sets (6-36 Months)",
    category: "Kids, Outfits",
    price: 349,
    originalPrice: 399,
    discount: "13% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 5,
    title: "Girls Pant Top Co-Ord Sets (Upto 3 Years)",
    category: "Kids, Outfits",
    price: 349,
    originalPrice: 399,
    discount: "13% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 6,
    title: "Flamingo Premium Girl Long Polo Frock",
    category: "Kids, Outfits",
    price: 399,
    originalPrice: 499,
    discount: "20% Off",
    soldOut: true,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 7,
    title: "Baby Floral Summer Party Dress",
    category: "Kids, Outfits",
    price: 299,
    originalPrice: 499,
    discount: "40% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 8,
    title: "Cute Printed Cotton Jumpsuit Set",
    category: "Kids, Outfits",
    price: 359,
    originalPrice: 499,
    discount: "28% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=400&h=500"
  }
];

// Group items into pairs of exactly 2 items
const pairs: typeof products[] = [];
for (let i = 0; i < products.length; i += 2) {
  pairs.push([products[i], products[i + 1]]);
}

// Append clone of pair 0 at the end for seamless infinite loop
const displayPairs = [...pairs, pairs[0]];

export default function OutfitsForKids() {
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
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black uppercase tracking-wide">
            FOR KIDS
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Adorable outfits & clothes for children</p>
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
