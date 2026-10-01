'use client';
import React, { useRef, useEffect } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/data/products';

const products = [
  {
    id: 1,
    title: "MINUKKI",
    category: "Outfits",
    price: 549,
    originalPrice: 999,
    discount: "45% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 2,
    title: "NEELAMBARI",
    category: "Outfits",
    price: 849,
    originalPrice: 1699,
    discount: "50% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 3,
    title: "Pink Rosa",
    category: "Outfits",
    price: 799,
    originalPrice: 1399,
    discount: "43% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 4,
    title: "BLACK PAKISTANI COLLECTION (2 PIECE)",
    category: "Outfits",
    price: 599,
    originalPrice: 999,
    discount: "40% Off",
    soldOut: true,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 5,
    title: "Mehak (3 Piece Set)",
    category: "Outfits",
    price: 799,
    originalPrice: 1499,
    discount: "47% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 6,
    title: "Pink Blossom (3 Piece Set)",
    category: "Outfits",
    price: 899,
    originalPrice: 1599,
    discount: "44% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 7,
    title: "MINUKKI",
    category: "Outfits",
    price: 549,
    originalPrice: 999,
    discount: "45% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: 8,
    title: "NEELAMBARI",
    category: "Outfits",
    price: 849,
    originalPrice: 1699,
    discount: "50% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400&h=500"
  }
];

export default function OutfitsForYou() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Duplicate products to create 4 identical sets for the infinite loop illusion
  const displayProducts = [...products, ...products, ...products, ...products].map((p, i) => ({ ...p, uniqueId: i }));

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Wait a brief moment for layout to complete
    setTimeout(() => {
      const setWidth = container.scrollWidth / 4;
      container.scrollLeft = setWidth;
    }, 100);

    const handleScroll = () => {
      const setWidth = container.scrollWidth / 4;
      if (container.scrollLeft < setWidth / 2) {
        container.scrollLeft += setWidth * 2;
      } else if (container.scrollLeft > setWidth * 2.5) {
        container.scrollLeft -= setWidth * 2;
      }
    };

    container.addEventListener('scroll', handleScroll);
    
    const timer = setInterval(() => {
      if (scrollContainerRef.current) {
        const step = window.innerWidth < 640 ? 200 : 300;
        scrollContainerRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 15000);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const step = window.innerWidth < 640 ? 200 : 300;
      scrollContainerRef.current.scrollBy({ left: -step, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const step = window.innerWidth < 640 ? 200 : 300;
      scrollContainerRef.current.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-wide">
          OUTFITS FOR YOU
        </h2>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button 
            onClick={scrollLeft}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Previous products"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={scrollRight}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Next products"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Product Carousel */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-3 sm:pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayProducts.map((product) => (
          <div 
            key={product.uniqueId} 
            className="w-[calc(50%-6px)] sm:w-[calc(33.333%-10.66px)] md:w-[calc(25%-18px)] lg:w-[calc(16.666%-20px)] flex-none snap-start group flex flex-col bg-white rounded-lg"
          >
            {/* Image Box */}
            <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden mb-2 sm:mb-3">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
              />
              <button 
                onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product as unknown as Product)}
                className={`absolute top-2 right-2 backdrop-blur-xs p-1.5 rounded shadow-sm transition-colors z-10 ${
                  isInWishlist(product.id) ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-500'
                }`}
                aria-label="Add to wishlist"
              >
                <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
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

      {/* View All Button */}
      <div className="flex justify-end mt-2 sm:mt-4">
        <button className="px-5 py-1.5 sm:px-6 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          View All
        </button>
      </div>
    </section>
  );
}
