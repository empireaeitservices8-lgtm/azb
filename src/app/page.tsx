import React from 'react';
import HeroSlider from '@/components/ui/HeroSlider';
import BestSellingProducts from '@/components/ui/BestSellingProducts';
import ShopByCategory from '@/components/ui/ShopByCategory';
import TopPicks from '@/components/ui/TopPicks';
import OutfitsForKids from '@/components/ui/OutfitsForKids';
import OfferZone from '@/components/ui/OfferZone';
import OutfitsForYou from '@/components/ui/OutfitsForYou';
import InstagramReels from '@/components/ui/InstagramReels';
import Features from '@/components/ui/Features';

import { ensureImages } from '@/lib/syncImages';

export default function Home() {
  ensureImages();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Slider */}
      <HeroSlider />
      
      {/* Best Selling Products */}
      <BestSellingProducts />

      {/* Shop By Category */}
      <ShopByCategory />

      {/* Top Picks */}
      <TopPicks />
      
      {/* Outfits For Kids */}
      <OutfitsForKids />

      {/* Offer Zone */}
      <OfferZone />

      {/* Outfits For You */}
      <OutfitsForYou />

      {/* Instagram Reel Carousel */}
      <InstagramReels />

      {/* Features / Benefits */}
      <Features />
    </div>
  );
}
