'use client';
import React from 'react';
import Link from 'next/link';
import { Phone, Mail, ChevronUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black pt-10 sm:pt-12 md:pt-16 pb-6 md:pb-8 mt-8 md:mt-12 rounded-t-2xl md:rounded-t-[2.5rem] relative">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 md:mb-12">
          {/* Column 1: Logo & Contact */}
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="inline-block w-36 sm:w-40">
              <img 
                src="/images/logo.png" 
                alt="AZB Store Logo" 
                className="w-full h-auto drop-shadow-md"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-black shadow-sm flex-shrink-0">
                  <Phone size={18} fill="currentColor" />
                </div>
                <div>
                  <p className="text-white/80 text-xs sm:text-sm mb-0.5">Have Questions? Call Us 24/7</p>
                  <a href="tel:+919072525292" className="text-lg sm:text-xl font-bold text-white hover:text-yellow-400 transition-colors">
                    +91 9072525292
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-black shadow-sm flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-white/80 text-xs sm:text-sm mb-0.5">Email Support</p>
                  <a href="mailto:azbstoreofficial@gmail.com" className="text-sm sm:text-base font-bold text-white hover:text-yellow-400 transition-colors">
                    azbstoreofficial@gmail.com
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-white/70 text-xs sm:text-sm">
                Monday - Friday: 9:00 AM - 6:00 PM
              </p>
            </div>
          </div>

          {/* Column 2: Know More */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 border-b border-white/10 pb-2 sm:border-none sm:pb-0">
              Know More
            </h3>
            <ul className="flex flex-col gap-2.5 sm:gap-4 text-white/80 text-xs sm:text-sm">
              <li><Link href="/policy/return" className="hover:text-yellow-400 transition-colors">Return, Cancellation & Refund policy</Link></li>
              <li><Link href="/policy/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/policy/terms" className="hover:text-yellow-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/policy/shipping" className="hover:text-yellow-400 transition-colors">Shipping Policy</Link></li>
              <li><Link href="/policy/contact" className="hover:text-yellow-400 transition-colors">Contact Information</Link></li>
            </ul>
          </div>

          {/* Column 3: Shop Categories */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 border-b border-white/10 pb-2 sm:border-none sm:pb-0">
              Shop Categories
            </h3>
            <ul className="flex flex-col gap-2.5 sm:gap-4 text-white/80 text-xs sm:text-sm">
              <li><Link href="/outfits" className="hover:text-yellow-400 transition-colors">Outfits</Link></li>
              <li><Link href="/kids" className="hover:text-yellow-400 transition-colors">Kids Zone</Link></li>
              <li><Link href="/category/personalized-gifts" className="hover:text-yellow-400 transition-colors">Personalized Gifts</Link></li>
              <li><Link href="/category/psc-books" className="hover:text-yellow-400 transition-colors">PSC Books</Link></li>
              <li><Link href="/category/electronics" className="hover:text-yellow-400 transition-colors">Electronics</Link></li>
            </ul>
          </div>

          {/* Column 4: Useful Links */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 border-b border-white/10 pb-2 sm:border-none sm:pb-0">
              Useful Links
            </h3>
            <ul className="flex flex-col gap-2.5 sm:gap-4 text-white/80 text-xs sm:text-sm">
              <li><Link href="/cart" className="hover:text-yellow-400 transition-colors">View Cart</Link></li>
              <li><Link href="/wishlist" className="hover:text-yellow-400 transition-colors">View Wishlist</Link></li>
              <li><Link href="/shop" className="hover:text-yellow-400 transition-colors">All Products</Link></li>
              <li><Link href="/login" className="hover:text-yellow-400 transition-colors">My Account</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 sm:pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative">
          
          <div className="flex items-center gap-3">
            <span className="text-white/80 text-xs sm:text-sm mr-1">Follow Us:</span>
            <a href="#" className="w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center hover:bg-yellow-400 transition-colors" aria-label="Facebook">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center hover:bg-yellow-400 transition-colors" aria-label="WhatsApp">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center hover:bg-yellow-400 transition-colors" aria-label="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>

          <p className="text-white/70 text-[11px] sm:text-xs text-center md:absolute md:left-1/2 md:-translate-x-1/2">
            Copyright 2026 © <span className="font-semibold text-white">AZB Store</span>. v1.1.5 | All rights Reserved
          </p>
          
          <div className="hidden md:block w-32"></div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-col gap-2.5 sm:gap-3 z-40">
        <button 
          onClick={scrollToTop}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} className="sm:w-6 sm:h-6" />
        </button>
        <a 
          href="https://wa.me/919072525292" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-full shadow-lg flex items-center justify-center text-black hover:bg-yellow-400 hover:scale-105 transition-all"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-5 h-5 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
      </div>
    </footer>
  );
}
