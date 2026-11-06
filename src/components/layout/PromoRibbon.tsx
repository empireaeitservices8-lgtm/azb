'use client';
import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function PromoRibbon() {
  const { settings } = useSiteSettings();
  const [currentIdx, setCurrentIdx] = useState(0);

  const messages = settings.ribbon_messages && settings.ribbon_messages.length > 0 
    ? settings.ribbon_messages 
    : [
        "📦 Unedited Unboxing Video Must for Damage Claims",
        "🚫 Products are non-returnable",
        "🚚 All India Free Shipping",
        "📅 Shipping Days : Wednesday & Saturday"
      ];

  useEffect(() => {
    if (messages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % messages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [messages.length]);

  if (!settings.ribbon_enabled) {
    return null;
  }

  return (
    <div className="bg-gray-100 border-b border-gray-200 overflow-hidden text-xs sm:text-sm">
      {/* Desktop View: Full horizontal inline strip */}
      <div className="hidden md:block py-2 px-4 text-center">
        <p className="text-gray-700 text-xs tracking-wide flex items-center justify-center flex-wrap gap-y-1">
          {messages.map((msg, index) => (
            <React.Fragment key={index}>
              <span>{msg}</span>
              {index < messages.length - 1 && (
                <span className="text-red-500 mx-3">|</span>
              )}
            </React.Fragment>
          ))}
        </p>
      </div>

      {/* Mobile View: Smooth Rotating Notice */}
      <div className="md:hidden py-1.5 px-4 text-center flex items-center justify-center min-h-[30px]">
        <div 
          key={currentIdx}
          className="text-gray-800 text-[11px] font-medium animate-in fade-in slide-in-from-bottom-1 duration-300 truncate"
        >
          {messages[currentIdx]}
        </div>
      </div>
    </div>
  );
}
