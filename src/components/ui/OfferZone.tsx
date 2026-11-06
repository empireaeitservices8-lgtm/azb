'use client';
import React from 'react';
import Link from 'next/link';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function OfferZone() {
  const { settings } = useSiteSettings();

  const prefix = settings.offer_zone_heading_prefix || 'OFFER';
  const highlight = settings.offer_zone_heading_highlight || 'ZONE';
  const bannerImage = settings.offer_zone_image || '/images/offer_banner.jpg';
  const targetLink = settings.offer_zone_link || '/shop';
  const altText = settings.offer_zone_alt || 'Offer Zone Banner';

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-center uppercase tracking-wide mb-5 sm:mb-8">
        <span className="text-gray-600">{prefix}</span>{' '}
        <span className="text-yellow-500">{highlight}</span>
      </h2>

      {/* Offer Zone Banner */}
      <Link 
        href={targetLink} 
        className="block relative w-full h-[150px] sm:h-[220px] md:h-[280px] lg:h-[350px] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm group"
      >
        <img 
          src={bannerImage} 
          alt={altText} 
          className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
      </Link>
    </section>
  );
}
