'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/data/products';

// Default products matching the reference items exactly
const defaultProducts = [
  {
    id: 1,
    title: "Twistup Rolling Crayon",
    category: "Kids",
    price: 299,
    originalPrice: 399,
    discount: "25% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Premium Colouring Painting Kit",
    category: "Kids",
    price: 1299,
    originalPrice: 1500,
    discount: "13% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Math Computing Colour Sorter",
    category: "Kids",
    price: 499,
    originalPrice: 699,
    discount: "29% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Alphabet and Number Foam with Magnets",
    category: "Kids",
    price: 242,
    originalPrice: 299,
    discount: "19% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    title: "Magic Box ( 110 Tricks, 52 Tricks, 25 Tricks )",
    category: "Kids",
    price: 629,
    originalPrice: 699,
    discount: "10% Off",
    soldOut: true,
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    title: "Elephant Stack Attack Game",
    category: "Kids",
    price: 361,
    originalPrice: 399,
    discount: "10% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    title: "Basketball Hoop Set for Kids",
    category: "Kids",
    price: 849,
    originalPrice: 1999,
    discount: "58% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    title: "Premium Silicone Pencil Pouch",
    category: "Kids",
    price: 242,
    originalPrice: 399,
    discount: "39% Off",
    soldOut: false,
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80"
  }
];

export default function TopPicks() {
  const [items, setItems] = useState<any[]>(defaultProducts);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Load live products from WordPress if available
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data?.products && data.products.length >= 5) {
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
            if (kidsProducts.length >= 5) {
              const list = kidsProducts.slice(0, 10);
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
            TOP PICKS
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
              key={`desktop-tp-${product.id}-${idx}`}
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
                      target.src = 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80';
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
                          target.src = 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80';
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
