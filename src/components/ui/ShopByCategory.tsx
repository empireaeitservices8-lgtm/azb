'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CategoryItem {
  id: number;
  name: string;
  image: string;
  link: string;
}

export const hostingerCategories: CategoryItem[] = [
  {
    id: 1,
    name: "Kids",
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80",
    link: "/shop?category=Kids"
  },
  {
    id: 2,
    name: "Women",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80",
    link: "/shop?category=Women"
  },
  {
    id: 3,
    name: "Outfits",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80",
    link: "/shop?category=Outfits"
  },
  {
    id: 4,
    name: "Ethnic",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
    link: "/shop?category=Ethnic"
  },
  {
    id: 5,
    name: "Shoe Care",
    image: "/images/shoe_shine_wipes.jpg",
    link: "/shop?category=Shoe+Care"
  },
  {
    id: 6,
    name: "Laundry",
    image: "/images/laundry_pod.jpg",
    link: "/shop?category=Laundry"
  },
  {
    id: 7,
    name: "Daily Essentials",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80",
    link: "/shop?category=Daily+Essentials"
  },
  {
    id: 8,
    name: "Home Essentials",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
    link: "/shop?category=Home+Essentials"
  },
  {
    id: 9,
    name: "Personalized Gifts",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80",
    link: "/shop?category=Personalized+Gifts"
  },
  {
    id: 10,
    name: "Toys",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=400&q=80",
    link: "/shop?category=Toys"
  },
  {
    id: 11,
    name: "Educational Toys",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80",
    link: "/shop?category=Educational+Toys"
  },
  {
    id: 12,
    name: "Games",
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=400&q=80",
    link: "/shop?category=Games"
  },
  {
    id: 13,
    name: "Stationery",
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=400&q=80",
    link: "/shop?category=Stationery"
  },
  {
    id: 14,
    name: "Books & Kits",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    link: "/shop?category=Books+%26+Kits"
  },
  {
    id: 15,
    name: "PSC Books",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80",
    link: "/shop?category=PSC+Books"
  },
  {
    id: 16,
    name: "Sports",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=80",
    link: "/shop?category=Sports"
  },
  {
    id: 17,
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    link: "/shop?category=Electronics"
  }
];

export default function ShopByCategory() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
      {/* Title with Scroll Controls */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">
            <span className="text-gray-800">SHOP BY</span>{' '}
            <span className="text-black">CATEGORY</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">Explore all official categories curated for you</p>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-700 cursor-pointer shadow-xs"
            aria-label="Scroll categories left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-700 cursor-pointer shadow-xs"
            aria-label="Scroll categories right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Banner Container */}
      <div className="relative w-full rounded-xl md:rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 py-6 sm:py-8 md:py-10 min-h-[190px] sm:min-h-[220px] md:min-h-[250px] flex items-center shadow-md overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-2 left-4 md:top-4 md:left-10 text-white opacity-40 text-3xl md:text-6xl pointer-events-none select-none">🌙</div>
        <div className="absolute top-1/4 left-1/3 text-white opacity-40 text-2xl md:text-4xl pointer-events-none select-none">✨</div>
        <div className="absolute top-4 right-1/3 text-white opacity-40 text-3xl md:text-6xl pointer-events-none select-none">🌟</div>
        <div className="absolute bottom-3 right-6 md:bottom-6 md:right-20 text-white opacity-40 text-3xl md:text-5xl pointer-events-none select-none">🪐</div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

        {/* Categories Flex */}
        <div 
          ref={scrollContainerRef}
          className="relative z-10 w-full overflow-x-auto no-scrollbar px-4 sm:px-6 md:px-10 scroll-smooth"
        >
          <div className="flex items-center justify-start gap-4 sm:gap-6 md:gap-8 pb-2 md:pb-3 w-max min-w-full">
            {hostingerCategories.map((cat) => (
              <Link 
                href={cat.link} 
                key={cat.id} 
                className="flex flex-col items-center group w-20 sm:w-24 md:w-28 flex-shrink-0 transition-transform hover:-translate-y-1 duration-200"
              >
                <div className="w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full overflow-hidden border-[3px] border-white shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 bg-white">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <span className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs font-bold text-gray-900 tracking-wide uppercase group-hover:text-black text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
