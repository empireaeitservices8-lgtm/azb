'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/data/products';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface ProductItem {
  id: number;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: string;
  soldOut: boolean;
  image: string;
}

export default function AllProducts() {
  const router = useRouter();
  const { settings } = useSiteSettings();
  const [items, setItems] = useState<ProductItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleBuyNow = (product: ProductItem) => {
    addToCart(product as unknown as Product);
    router.push('/cart');
  };

  // Load live products from WooCommerce API
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data?.products && data.products.length > 0) {
            const liveItems: ProductItem[] = data.products.map((p: any) => ({
              id: p.id,
              title: p.title,
              category: p.category,
              price: p.price,
              originalPrice: p.originalPrice || p.price,
              discount: p.discount || '',
              soldOut: !!p.soldOut,
              image: p.image
            }));

            setItems(liveItems);
          }
        }
      } catch (e) {
        console.error('Failed to fetch all products from API:', e);
      }
    }
    load();
  }, []);

  // Group items into groups of 4 items for Mobile view (2x2 grid displaying 4 images on phone)
  const mobileGroups: ProductItem[][] = [];
  if (items.length > 0) {
    for (let i = 0; i < items.length; i += 4) {
      const chunk = items.slice(i, i + 4);
      if (chunk.length < 4 && items.length >= 4) {
        chunk.push(...items.slice(0, 4 - chunk.length));
      }
      mobileGroups.push(chunk);
    }
  }

  const totalSlides = mobileGroups.length;
  const displayGroups = totalSlides > 1 ? [...mobileGroups, mobileGroups[0]] : mobileGroups;

  const nextSlide = () => {
    if (totalSlides <= 1) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (totalSlides <= 1) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleTransitionEnd = () => {
    if (currentSlide >= totalSlides) {
      setIsTransitioning(false);
      setCurrentSlide(0);
    }
  };

  // 7-second automatic swipe for both Mobile & Desktop Views
  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        if (totalSlides > 1) nextSlide();
      } else {
        scrollDesktop('next');
      }
    }, 7000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  // Touch Handlers for Mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    touchStartX.current = null;
  };

  // Desktop horizontal scroll navigation
  const scrollDesktop = (direction: 'prev' | 'next') => {
    if (!desktopScrollRef.current) return;
    const scrollAmount = desktopScrollRef.current.clientWidth * 0.75;
    desktopScrollRef.current.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
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

  if (items.length === 0) return null;

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 border-t border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-wide">
            {settings.heading_allproducts_title || 'ALL PRODUCTS'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Explore our complete collection of trending products</p>
        </div>
        
        {/* Navigation circular arrows & View All */}
        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-yellow-600 transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
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
      </div>

      {/* 1. Laptop / Desktop View (Row of Products Matching Best Selling Products) */}
      <div className="hidden md:block">
        <div 
          ref={desktopScrollRef}
          className="flex items-start gap-4 lg:gap-5 overflow-x-auto scroll-smooth scrollbar-hide py-1"
        >
          {items.map((product, idx) => (
            <div 
              key={`desktop-all-${product.id}-${idx}`}
              className="w-[calc((100%-48px)/4)] lg:w-[calc((100%-80px)/5)] shrink-0 flex flex-col group"
            >
              {/* Image Box */}
              <div className="relative aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden shadow-2xs">
                <Link href={`/product/${product.id}`} className="block w-full h-full">
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

                {/* Stock Status Badge */}
                {product.soldOut ? (
                  <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs z-10">
                    Out of Stock
                  </span>
                ) : (
                  <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs z-10">
                    In Stock
                  </span>
                )}

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
                <Link href={`/product/${product.id}`} className="hover:text-yellow-600 transition-colors">
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

                {/* Action Buttons: Add to Cart & Buy Now */}
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  {product.soldOut ? (
                    <button 
                      disabled
                      className="bg-[#1e2d3d] text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-85 cursor-not-allowed"
                    >
                      Sold Out
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => addToCart(product as unknown as Product)}
                        className="bg-[#1e2d3d] hover:bg-[#15202b] text-white text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Add to Cart"
                      >
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => handleBuyNow(product)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                        title="Buy Now"
                      >
                        Buy Now
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Mobile View (4 Products at a time in 2x2 grid with swipe & touch gestures) */}
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
          {displayGroups.map((group, slideIdx) => (
            <div 
              key={slideIdx} 
              className="w-full min-w-full flex-none grid grid-cols-2 gap-2 sm:gap-2.5 p-0.5"
            >
              {group.map((product, pIdx) => (
                <div 
                  key={`${product.id}-${slideIdx}-${pIdx}`} 
                  className="flex flex-col bg-white rounded-xl border border-gray-100 p-2 shadow-2xs group"
                >
                  {/* Image Box */}
                  <div className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden mb-1.5">
                    <Link href={`/product/${product.id}`} className="block w-full h-full">
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

                    {/* Stock Status Badge */}
                    {product.soldOut ? (
                      <span className="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-xs z-10">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-xs z-10">
                        In Stock
                      </span>
                    )}
                    
                    {/* Wishlist Button */}
                    <button 
                      onClick={() => isInWishlist(Number(product.id)) ? removeFromWishlist(Number(product.id)) : addToWishlist(product as unknown as Product)}
                      className={`absolute top-1 right-1 p-1 rounded-md backdrop-blur-xs shadow-xs transition-all z-10 cursor-pointer ${
                        isInWishlist(Number(product.id)) 
                          ? 'bg-red-50 text-red-500 ring-1 ring-red-300' 
                          : 'bg-white/95 text-gray-400 hover:text-red-500'
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart size={12} fill={isInWishlist(Number(product.id)) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  
                  {/* Details */}
                  <div className="flex flex-col flex-1">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-bold text-[11px] text-gray-900 line-clamp-1 leading-snug">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-[10px] text-gray-400 mt-0.5">{product.category}</p>
                    
                    <div className="mt-1 flex items-baseline gap-1 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">₹{product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>
                      )}
                      {product.discount && (
                        <span className="text-[9px] font-bold text-red-500">({product.discount})</span>
                      )}
                    </div>
                    
                    {/* Action Buttons: Add to Cart & Buy Now */}
                    <div className="mt-2 mt-auto flex items-center gap-1">
                      {product.soldOut ? (
                        <button 
                          disabled
                          className="w-full bg-[#1e2d3d] text-white py-1 px-1.5 rounded-md text-[10px] font-semibold opacity-85 cursor-not-allowed text-center"
                        >
                          Sold Out
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={() => addToCart(product as unknown as Product)}
                            className="flex-1 bg-[#1e2d3d] hover:bg-[#15202b] text-white py-1 px-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer text-center"
                          >
                            Add
                          </button>
                          <button 
                            onClick={() => handleBuyNow(product)}
                            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer text-center shadow-2xs"
                          >
                            Buy
                          </button>
                        </>
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

