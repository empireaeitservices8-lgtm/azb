'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const slides = [
  {
    image: "/images/banner1.jpg",
    title: "Happy Family Clothing & Toys",
    link: "/shop"
  },
  {
    image: "/images/banner2.jpg",
    title: "Kids Funland Toys & Clothes",
    link: "/shop?category=Kids"
  },
  {
    image: "/images/banner3.jpg",
    title: "Exclusive Offers & Gifts",
    link: "/shop"
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section 
      className="relative w-full h-[180px] sm:h-[300px] md:h-[450px] lg:h-[520px] overflow-hidden bg-gray-950"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            current === index ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Link href={slide.link} className="block w-full h-full relative cursor-pointer">
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </Link>
        </div>
      ))}

      {/* Pagination Dots */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2.5 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 shadow-sm cursor-pointer ${
              current === index ? 'w-5 sm:w-6 bg-yellow-400' : 'w-1.5 sm:w-2 bg-white/70 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
