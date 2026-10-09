'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/data/products';

// 8 completely unique girls and women dress products with authentic images
const defaultWomenOutfits = [
  {
    id: 1,
    title: "MINUKKI Designer Kurti Set",
    category: "Outfits",
    price: 549,
    originalPrice: 999,
    discount: "45% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "NEELAMBARI Elegant Saree & Suit",
    category: "Outfits",
    price: 849,
    originalPrice: 1699,
    discount: "50% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Pink Rosa Floral Summer Dress",
    category: "Outfits",
    price: 799,
    originalPrice: 1399,
    discount: "43% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "BLACK PAKISTANI COLLECTION (2 PIECE)",
    category: "Outfits",
    price: 599,
    originalPrice: 999,
    discount: "40% Off",
    soldOut: true,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    title: "Mehak Embroidered (3 Piece Set)",
    category: "Outfits",
    price: 799,
    originalPrice: 1499,
    discount: "47% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    title: "Pink Blossom Festive (3 Piece Set)",
    category: "Outfits",
    price: 899,
    originalPrice: 1599,
    discount: "44% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    title: "Royal Crimson Anarkali Gown",
    category: "Outfits",
    price: 999,
    originalPrice: 1899,
    discount: "47% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    title: "Emerald Silk Embroidered Kurta Set",
    category: "Outfits",
    price: 899,
    originalPrice: 1699,
    discount: "47% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80"
  }
];

export default function OutfitsForYou() {
  const [items, setItems] = useState<any[]>(defaultWomenOutfits);
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
            const womenOutfits = data.products.filter((p: any) => 
              (p.category?.toLowerCase().includes('outfit') || 
               p.category?.toLowerCase().includes('kurti') || 
               p.category?.toLowerCase().includes('saree') || 
               p.category?.toLowerCase().includes('women') || 
               p.category?.toLowerCase().includes('ethnic')) &&
              !p.category?.toLowerCase().includes('kid') &&
              !p.category?.toLowerCase().includes('shoe') &&
              !p.category?.toLowerCase().includes('laundry')
            );
            if (womenOutfits.length >= 2) {
              const list = womenOutfits.slice(0, 8);
              setItems(list.map((p: any, idx: number) => ({
                id: p.id,
                title: p.title,
                category: p.category || 'Outfits',
                price: p.price,
                originalPrice: p.originalPrice || p.price,
                discount: p.discount || '',
                soldOut: !!p.soldOut,
                image: (p.image && !p.image.includes('placeholder')) ? p.image : defaultWomenOutfits[idx % defaultWomenOutfits.length].image
              })));
            }
          }
        }
      } catch (e) {
        console.error('Failed to fetch outfits from WordPress:', e);
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
            FOR YOU
          </h2>
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
