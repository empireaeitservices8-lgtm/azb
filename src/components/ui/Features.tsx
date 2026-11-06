'use client';
import React from 'react';
import { ShoppingBag, PackageOpen, BadgePercent, Headset } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const icons = [
  <ShoppingBag key="1" className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} />,
  <PackageOpen key="2" className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} />,
  <BadgePercent key="3" className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} />,
  <Headset key="4" className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} />
];

export default function Features() {
  const { settings } = useSiteSettings();
  const featuresList = settings.features && settings.features.length > 0
    ? settings.features
    : [
        {
          title: "Wide Assortment",
          description: "Find the perfect fit with our wide range of sizes, colors, and styles."
        },
        {
          title: "Return Policy For Damaged",
          description: "Defective or damaged items will be replaced. Unedited unboxing video is must for damage claims."
        },
        {
          title: "Best Prices & Offers",
          description: "Save big with exclusive deals and discounts on your favourite products every day."
        },
        {
          title: "Support 24/7",
          description: "Get help anytime via chat, call, or email from our friendly support team."
        }
      ];

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 mb-4 sm:mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {featuresList.map((feature, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl p-4 sm:p-5 md:p-6 flex items-start gap-3.5 sm:gap-4 hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="text-yellow-500 flex-shrink-0 mt-0.5 sm:mt-1">
              {icons[index % icons.length]}
            </div>
            <div>
              <h3 className="font-bold text-yellow-600 text-sm sm:text-base mb-1 sm:mb-1.5 leading-tight">
                {feature.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
