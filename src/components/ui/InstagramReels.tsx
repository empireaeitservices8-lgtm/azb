'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, ExternalLink } from 'lucide-react';

interface ReelItem {
  id: number;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: string;
  videoSrc: string;
  instagramUrl: string;
  poster?: string;
  productId?: number;
}

const reelVideos: ReelItem[] = [
  {
    id: 101,
    productId: 23,
    title: "Neon 4-in-1 Car Charger Advertisement",
    category: "Electronics",
    price: 999,
    originalPrice: 1050,
    discount: "5% Off",
    videoSrc: "/videos/reel1.mp4",
    poster: "https://lightcyan-gorilla-655722.hostingersite.com/wp-content/uploads/2026/10/Neon-4-in-1-Car-Charger-Advertisement.png",
    instagramUrl: "https://www.instagram.com/"
  },
  {
    id: 102,
    productId: 14,
    title: "Stacked Black Shoe Shine Wipes",
    category: "Shoe Care",
    price: 180,
    originalPrice: 249,
    discount: "28% Off",
    videoSrc: "/videos/reel2.mp4",
    poster: "/images/shoe_shine_wipes_banner.jpg",
    instagramUrl: "https://www.instagram.com/"
  },
  {
    id: 103,
    productId: 12,
    title: "7 in 1 Laundry Pod (20 Pods Cleaning Power)",
    category: "Home Essentials, Laundry",
    price: 200,
    originalPrice: 399,
    discount: "50% Off",
    videoSrc: "/videos/reel3.mp4",
    poster: "/images/laundry_pod_banner.jpg",
    instagramUrl: "https://www.instagram.com/"
  },
  {
    id: 104,
    productId: 21,
    title: "Drone E88 Dual-Camera Store Showcase",
    category: "Electronics",
    price: 1399,
    originalPrice: 1500,
    discount: "7% Off",
    videoSrc: "/videos/reel4.mp4",
    poster: "https://lightcyan-gorilla-655722.hostingersite.com/wp-content/uploads/2026/10/Drone-E88-Dual-Camera-Store-Showcase.png",
    instagramUrl: "https://www.instagram.com/"
  }
];

export default function InstagramReels() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [mutedStates, setMutedStates] = useState<{ [key: number]: boolean }>({
    101: true,
    102: true,
    103: true,
    104: true
  });
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const toggleMute = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    e.preventDefault();
    const video = videoRefs.current[id];
    if (!video) return;

    video.muted = !video.muted;
    setMutedStates(prev => ({ ...prev, [id]: video.muted }));
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const step = window.innerWidth < 640 ? 240 : 320;
      scrollContainerRef.current.scrollBy({ left: -step, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const step = window.innerWidth < 640 ? 240 : 320;
      scrollContainerRef.current.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 p-[2px] flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <span className="text-xs sm:text-sm font-bold bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                AZB
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-wide">
              INSTAGRAM REELS
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500">Watch our latest videos & tap to view on Instagram</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button 
            onClick={scrollLeft}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Previous reel"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={scrollRight}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Next reel"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 4 Video Reel Carousel */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-3 sm:pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reelVideos.map((reel) => (
          <div 
            key={reel.id} 
            className="w-[260px] sm:w-[280px] md:w-[calc(25%-18px)] flex-none snap-start group flex flex-col bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden"
          >
            {/* Reel Video Container (Clicking opens Instagram in a new tab) */}
            <a
              href={reel.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-[9/16] bg-black rounded-t-xl overflow-hidden cursor-pointer block"
              aria-label={`View ${reel.title} on Instagram`}
            >
              <video
                ref={(el) => { videoRefs.current[reel.id] = el; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                poster={reel.poster}
                loop
                muted={mutedStates[reel.id] ?? true}
                autoPlay
                playsInline
                preload="metadata"
              >
                <source src={reel.videoSrc} type="video/mp4" />
                <source src={reel.videoSrc.replace('.mp4.mp4', '.mp4')} type="video/mp4" />
              </video>

              {/* Sound / Mute Toggle Button */}
              <button
                type="button"
                onClick={(e) => toggleMute(e, reel.id)}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-xs transition-colors z-20"
                aria-label={mutedStates[reel.id] ? "Unmute video" : "Mute video"}
              >
                {mutedStates[reel.id] ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>

              {/* Instagram Badge Overlay */}
              <div className="absolute bottom-2 left-2 z-10">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
                  <span>Watch on Instagram</span>
                  <ExternalLink size={11} />
                </span>
              </div>
            </a>
            
            {/* Product Information Directly Under Each Video */}
            <div className="p-3 sm:p-4 flex flex-col flex-1 bg-white">
              {/* Product Title */}
              <Link href={`/product/${reel.productId || reel.id}`} className="hover:text-yellow-600 transition-colors">
                <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 leading-snug min-h-[32px] sm:min-h-[40px]">
                  {reel.title}
                </h3>
              </Link>
              
              {/* Category */}
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">{reel.category}</p>
              
              {/* Rate (Price, Original Price, Discount) */}
              <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-base sm:text-lg font-extrabold text-gray-900">₹{reel.price}</span>
                <span className="text-xs text-gray-400 line-through">₹{reel.originalPrice}</span>
                <span className="text-xs font-bold text-red-500">({reel.discount})</span>
              </div>

              {/* Buy Now CTA */}
              <div className="mt-3 pt-2.5 border-t border-gray-100">
                <Link
                  href={`/product/${reel.productId || reel.id}`}
                  className="w-full block bg-yellow-400 hover:bg-yellow-500 text-black text-center py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
