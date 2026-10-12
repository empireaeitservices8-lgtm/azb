'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/data/products';

// 8 unique women dress products with authentic images
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
  const desktopScrollRef = useRef<HTMLDivElement>(null);

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

  // Group items into pairs of exactly 2 items for Mobile view
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

  // 7-second automatic swipe for both Mobile & Desktop Views
  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        nextSlide();
      } else {
        scrollDesktop('next');
      }
    }, 7000);

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

  // Desktop Carousel Scroll Navigation
  const scrollDesktop = (direction: 'prev' | 'next') => {
    if (desktopScrollRef.current) {
      const container = desktopScrollRef.current;
      const firstCard = container.firstElementChild as HTMLElement | null;
      const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 240;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (direction === 'next') {
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      } else {
        if (container.scrollLeft <= 10) {
          container.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        }
      }
    }
  };

  const handlePrev = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      prevSlide();
    } else {
      scrollDesktop('prev');
    }
  };

  const handleNext = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      nextSlide();
    } else {
      scrollDesktop('next');
    }
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-wide">
            FOR YOU
          </h2>
        </div>
        {/* Navigation circular arrows */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:border-gray-500 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer shadow-xs"
            aria-label="Previous products"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={handleNext}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:border-gray-500 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer shadow-xs"
            aria-label="Next products"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 1. Laptop / Desktop View (Row of 5 Products Matching Reference Image) */}
      <div className="hidden md:block">
        <div 
          ref={desktopScrollRef}
          className="flex items-start gap-4 lg:gap-5 overflow-x-auto scroll-smooth scrollbar-hide py-1"
        >
          {items.map((product, idx) => (
            <div 
              key={`desktop-ofy-${product.id}-${idx}`}
              className="w-[calc((100%-48px)/4)] lg:w-[calc((100%-80px)/5)] shrink-0 flex flex-col group"
            >
              {/* Image Box */}
              <div className="relative aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden shadow-2xs">
                <Link href="/shop" className="block w-full h-full">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </Link>

                {/* Wishlist Button */}
                <button 
                  onClick={() => isInWishlist(Number(product.id)) ? removeFromWishlist(Number(product.id)) : addToWishlist(product as unknown as Product)}
                  className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-xs shadow-xs transition-all z-10 cursor-pointer ${
                    isInWishlist(Number(product.id))
                      ? 'bg-red-50 text-red-500 ring-1 ring-red-300'
                      : 'bg-white/95 text-gray-400 hover:text-red-500 hover:bg-white'
                  }`}
                  aria-label="Wishlist"
                  title={isInWishlist(Number(product.id)) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={16} fill={isInWishlist(Number(product.id)) ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Details */}
              <div className="flex flex-col mt-3">
                <Link href="/shop" className="hover:text-yellow-600 transition-colors">
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-1 leading-snug">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{product.category}</p>
                
                <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-base lg:text-lg font-bold text-gray-900">₹{product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through font-normal">₹{product.originalPrice}</span>
                  )}
                  {product.discount && (
                    <span className="text-xs font-bold text-red-500">({product.discount})</span>
                  )}
                </div>

                {/* Action Button: Add to Cart / Sold Out */}
                <div className="mt-2.5">
                  {product.soldOut ? (
                    <button 
                      disabled
                      className="bg-[#1e2d3d] text-white text-xs font-semibold px-4 py-1.5 rounded-lg opacity-85 cursor-not-allowed"
                    >
                      Sold Out
                    </button>
                  ) : (
                    <button 
                      onClick={() => addToCart(product as unknown as Product)}
                      className="bg-[#1e2d3d] hover:bg-[#15202b] text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Add to Cart"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Mobile View (2 Products at a time with 5s swipe & touch gestures) */}
      <div 
        className="block md:hidden w-full overflow-hidden rounded-xl"
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
              className="w-full min-w-full flex-none grid grid-cols-2 gap-3 p-1"
            >
              {pair.map((product, pIdx) => (
                <div 
                  key={`${product.id}-${slideIdx}-${pIdx}`} 
                  className="flex flex-col bg-white rounded-xl border border-gray-100 p-2.5 shadow-2xs group"
                >
                  {/* Image Box */}
                  <div className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden mb-2">
                    <Link href="/shop" className="block w-full h-full">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </Link>
                    
                    {/* Wishlist Button */}
                    <button 
                      onClick={() => isInWishlist(Number(product.id)) ? removeFromWishlist(Number(product.id)) : addToWishlist(product as unknown as Product)}
                      className={`absolute top-1.5 right-1.5 p-1.5 rounded-lg backdrop-blur-xs shadow-xs transition-all z-10 cursor-pointer ${
                        isInWishlist(Number(product.id)) 
                          ? 'bg-red-50 text-red-500 ring-1 ring-red-300' 
                          : 'bg-white/95 text-gray-400 hover:text-red-500'
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart size={14} fill={isInWishlist(Number(product.id)) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  
                  {/* Details */}
                  <div className="flex flex-col flex-1">
                    <Link href="/shop">
                      <h3 className="font-bold text-xs text-gray-900 line-clamp-1 leading-snug">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-gray-400 mt-0.5">{product.category}</p>
                    
                    <div className="mt-1 flex items-baseline gap-1 flex-wrap">
                      <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[11px] text-gray-400 line-through">₹{product.originalPrice}</span>
                      )}
                      {product.discount && (
                        <span className="text-[10px] font-bold text-red-500">({product.discount})</span>
                      )}
                    </div>
                    
                    {/* Action Button: Add to Cart / Sold Out */}
                    <div className="mt-2.5 mt-auto">
                      {product.soldOut ? (
                        <button 
                          disabled
                          className="w-full bg-[#1e2d3d] text-white py-1.5 px-2 rounded-lg text-xs font-semibold opacity-85 cursor-not-allowed"
                        >
                          Sold Out
                        </button>
                      ) : (
                        <button 
                          onClick={() => addToCart(product as unknown as Product)}
                          className="w-full bg-[#1e2d3d] hover:bg-[#15202b] text-white py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
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
    </section>
  );
}
