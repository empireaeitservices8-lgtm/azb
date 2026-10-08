'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BestSellingItem {
  id: number | string;
  title: string;
  image: string;
  link: string;
}

// 10 completely unique items
const bestSellingItems: BestSellingItem[] = [
  {
    id: 1,
    title: "Shoe Shine Wipes - ₹180",
    image: "/images/shoe_shine_wipes_banner.jpg",
    link: "/shop?q=shoe+shine+wipes"
  },
  {
    id: 2,
    title: "7 in 1 Laundry Pod - ₹200",
    image: "/images/laundry_pod_banner.jpg",
    link: "/shop?q=laundry+pod"
  },
  {
    id: 3,
    title: "Shoe Shine Wipes (80 Series Pack)",
    image: "/images/shoe_shine_wipes.jpg",
    link: "/shop?q=shoe+shine+wipes"
  },
  {
    id: 4,
    title: "7 in 1 Laundry Pod (20 Pods Pack)",
    image: "/images/laundry_pod.jpg",
    link: "/shop?q=laundry+pod"
  },
  {
    id: 5,
    title: "Dual Tip Marker Sketch 48 Pcs",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=400&h=500",
    link: "/shop?q=marker"
  },
  {
    id: 6,
    title: "Twistup Rolling Crayon",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400&h=500",
    link: "/shop?q=crayon"
  },
  {
    id: 7,
    title: "Elephant Stack Attack",
    image: "https://images.unsplash.com/photo-1599623560574-39d485900c95?auto=format&fit=crop&q=80&w=400&h=500",
    link: "/shop?q=elephant"
  },
  {
    id: 8,
    title: "Pressing Giraffe Toy",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400&h=500",
    link: "/shop?q=giraffe"
  },
  {
    id: 9,
    title: "Premium Silicone Pencil Pouch",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400&h=500",
    link: "/shop?q=pouch"
  },
  {
    id: 10,
    title: "Basketball Hoop Set for Kids",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400&h=500",
    link: "/shop?q=basketball"
  }
];

// Group items into pairs of exactly 2 items
const pairs: BestSellingItem[][] = [];
for (let i = 0; i < bestSellingItems.length; i += 2) {
  pairs.push([bestSellingItems[i], bestSellingItems[i + 1]]);
}

// Append clone of pair 0 at the end for seamless infinite loop
const displayPairs = [...pairs, pairs[0]];

export default function BestSellingProducts() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef<number | null>(null);

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
    // If we reached the cloned slide at the end, jump back to 0 without animation
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
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Top-rated favorites from AZB Store</p>
        </div>
        {/* Buttons hidden on mobile, shown on desktop */}
        <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
          <button 
            onClick={prevSlide}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer shadow-xs"
            aria-label="Previous 2 images"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={nextSlide}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer shadow-xs"
            aria-label="Next 2 images"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Strictly 2 Images At A Time - Zero Peeking of Third Image */}
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
              {pair.map((item, itemIdx) => (
                <div key={`${item.id}-${slideIdx}-${itemIdx}`} className="group relative">
                  <Link 
                    href={item.link}
                    className="block relative aspect-square sm:aspect-[4/5] bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-gray-200/80 transition-all duration-300 group-hover:border-yellow-400"
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </Link>
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
          View All Products
        </Link>
      </div>
    </section>
  );
}
