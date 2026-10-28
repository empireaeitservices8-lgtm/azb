'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, User, Heart, ShoppingCart, MapPin, Menu, X, Navigation, Phone, Mail, ChevronRight, ArrowRight } from 'lucide-react';
import { searchProducts, Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { totalItems } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState('Select location');
  const [pinCode, setPinCode] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [liveCatalog, setLiveCatalog] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function loadLiveCatalog() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.products)) {
            setLiveCatalog(data.products);
          }
        }
      } catch (err) {
        console.error('Error fetching live catalog for search:', err);
      }
    }
    loadLiveCatalog();
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
    } else {
      setSearchQuery('');
    }
  }, [searchParams]);

  // Update live search suggestions as user types
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = searchProducts(searchQuery, liveCatalog);
      setSearchResults(results.slice(0, 5));
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery, liveCatalog]);

  // Click outside to dismiss search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopSearchRef.current && 
        !desktopSearchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const executeSearch = (queryToSearch: string) => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    const trimmed = queryToSearch.trim();
    if (trimmed) {
      router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/shop');
    }
  };

  const navigateToProduct = (productId: number) => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    router.push(`/product/${productId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.trim()) {
      setLocation(`Delivering to ${pinCode}`);
      setIsLocationModalOpen(false);
    }
  };

  const handleAutoDetect = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            const postalCode = data.address?.postcode;
            const city = data.address?.city || data.address?.town || data.address?.state;
            
            if (postalCode) {
              setLocation(`Delivering to ${postalCode}`);
            } else if (city) {
              setLocation(`Delivering to ${city}`);
            } else {
              setLocation('Location Detected');
            }
            setIsLocationModalOpen(false);
          } catch (error) {
            console.error('Error detecting location:', error);
            setLocation('Delivering to 110001');
            setIsLocationModalOpen(false);
          } finally {
            setIsDetecting(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Could not detect location. Please check your browser permissions or enter your pincode manually.');
          setIsDetecting(false);
        },
        { timeout: 10000 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setIsDetecting(false);
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-md">
      {/* Top Row: Logo, Search, User actions */}
      <div className="bg-black">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Mobile Menu Button & Logo */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-white p-1.5 -ml-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu size={24} />
            </button>

            <Link href="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/images/logo.png" 
                alt="AZB Store Logo" 
                className="h-10 sm:h-12 md:h-16 w-auto drop-shadow-md object-contain"
              />
            </Link>
          </div>

          {/* Desktop Search */}
          <div ref={desktopSearchRef} className="hidden md:flex flex-1 max-w-2xl mx-auto relative z-50">
            <form 
              onSubmit={handleSearchSubmit} 
              className="w-full bg-white rounded-full flex items-center p-1 shadow-sm"
            >
              <input 
                type="text" 
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.trim()) setIsSearchOpen(true); }}
                placeholder="Search for toys, wipes, markers, books..." 
                className="w-full bg-transparent border-none py-2 px-5 text-gray-800 focus:outline-none text-sm placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                  className="p-1 mr-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
              <button 
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2 rounded-full transition-colors flex items-center gap-1.5 text-sm flex-shrink-0 cursor-pointer"
              >
                <span>Search</span>
                <Search size={16} strokeWidth={2.5} />
              </button>
            </form>

            {/* Desktop Live Suggestions Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in-50 duration-150">
                {searchResults.length > 0 ? (
                  <div>
                    <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Suggested Products
                      </span>
                      <span className="text-xs text-yellow-600 font-medium">
                        Press Enter to view all
                      </span>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                      {searchResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => navigateToProduct(item.id)}
                          className="p-3 hover:bg-yellow-50/50 flex items-center gap-3 cursor-pointer transition-colors"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-yellow-600 font-semibold truncate">{item.category}</p>
                            <h4 className="text-sm font-bold text-gray-900 truncate">{item.title}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm font-extrabold text-gray-900">₹{item.price}</span>
                              <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                              <span className="text-[11px] font-bold text-red-500">{item.discount}</span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => executeSearch(searchQuery)}
                      className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors border-t border-yellow-500/20 cursor-pointer"
                    >
                      <span>View all matching results for "{searchQuery}"</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-600">No products found matching "{searchQuery}"</p>
                    <button
                      type="button"
                      onClick={() => executeSearch(searchQuery)}
                      className="mt-2 text-xs font-semibold text-yellow-600 hover:underline cursor-pointer"
                    >
                      Search store anyway →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-5 flex-shrink-0">
            {/* Login Link */}
            <Link 
              href="/login" 
              className="hidden sm:flex items-center gap-1.5 text-white hover:text-yellow-400 transition-colors font-medium text-xs md:text-sm"
            >
              <User size={18} fill="currentColor" />
              <span>Login</span>
            </Link>
            
            <div className="hidden sm:block h-5 w-px bg-white/40"></div>
            
            {/* Wishlist Link */}
            <Link 
              href="/wishlist" 
              className="flex items-center gap-1.5 text-white hover:text-yellow-400 transition-colors font-medium text-xs md:text-sm p-1.5 sm:p-0"
              aria-label="Wishlist"
            >
              <Heart size={20} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" />
              <span className="hidden md:inline">Wishlist</span>
            </Link>

            <div className="hidden md:block h-5 w-px bg-white/40"></div>

            {/* Cart Link */}
            <Link 
              href="/cart" 
              className="flex items-center gap-1.5 text-white hover:text-yellow-400 transition-colors font-medium text-xs md:text-sm relative p-1.5 sm:p-0 pr-2"
              aria-label="Cart"
            >
              <ShoppingCart size={20} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" />
              <span className="hidden md:inline">Cart</span>
              <span 
                suppressHydrationWarning
                className="absolute -top-1 sm:-top-2 -right-0.5 sm:-right-1 bg-yellow-500 text-black font-bold text-[10px] rounded-full w-4 h-4 flex items-center justify-center shadow-sm"
              >
                {isMounted ? totalItems : 0}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar & Dropdown */}
        <div ref={mobileSearchRef} className="md:hidden px-4 pb-3 pt-0.5 relative z-50">
          <form 
            onSubmit={handleSearchSubmit} 
            className="w-full bg-white rounded-full flex items-center p-1 shadow-sm"
          >
            <input 
              type="text" 
              name="q"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchQuery.trim()) setIsSearchOpen(true); }}
              placeholder="Search toys, wipes, markers, books..." 
              className="w-full bg-transparent border-none py-1.5 px-4 text-gray-800 focus:outline-none text-xs sm:text-sm placeholder-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                className="p-1 mr-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
            <button 
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-1.5 rounded-full transition-colors flex items-center gap-1 text-xs flex-shrink-0 cursor-pointer"
            >
              <span>Search</span>
              <Search size={14} strokeWidth={2.5} />
            </button>
          </form>

          {/* Mobile Live Suggestions Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in-50 duration-150">
              {searchResults.length > 0 ? (
                <div>
                  <div className="p-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      Suggestions
                    </span>
                    <span className="text-[11px] text-yellow-600 font-medium">
                      Tap to open
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigateToProduct(item.id)}
                        className="p-2.5 hover:bg-yellow-50/50 flex items-center gap-3 cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{item.title}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs font-extrabold text-gray-900">₹{item.price}</span>
                            <span className="text-[10px] text-gray-400 line-through">₹{item.originalPrice}</span>
                            <span className="text-[10px] font-bold text-red-500">{item.discount}</span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => executeSearch(searchQuery)}
                    className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold flex items-center justify-center gap-1.5 border-t border-yellow-500/20 cursor-pointer"
                  >
                    <span>View all results for "{searchQuery}"</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-600">No products matching "{searchQuery}"</p>
                  <button
                    type="button"
                    onClick={() => executeSearch(searchQuery)}
                    className="mt-1 text-xs font-bold text-yellow-600 cursor-pointer hover:underline"
                  >
                    Search store anyway →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Navigation and Location */}
      <div className="bg-[#f3f4f6] border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-2 md:py-2.5 flex items-center justify-between">
          
          {/* Main Navigation (Desktop) */}
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-8">
              <li>
                <Link href="/" className="text-gray-700 hover:text-yellow-600 transition-colors font-semibold text-sm">Home</Link>
              </li>
              <li>
                <Link href="/kids" className="text-gray-700 hover:text-yellow-600 transition-colors font-semibold text-sm">Kids</Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-700 hover:text-yellow-600 transition-colors font-semibold text-sm">All Products</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 hover:text-yellow-600 transition-colors font-semibold text-sm">Contact</Link>
              </li>
            </ul>
          </nav>

          {/* Location Selector (Desktop & Mobile) */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end">
            <button 
              onClick={() => setIsLocationModalOpen(true)}
              className="w-full md:w-auto bg-white rounded-full px-3.5 sm:px-4 py-1.5 flex items-center justify-between md:justify-start gap-2 text-xs sm:text-sm text-gray-600 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={15} className="text-yellow-600 flex-shrink-0" fill="currentColor" />
                <span className="truncate max-w-[200px] sm:max-w-[250px] font-medium text-gray-800">
                  {location}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-yellow-600 uppercase tracking-wider pl-2 border-l border-gray-200 flex-shrink-0">
                Change
              </span>
            </button>
          </div>
          
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-[85%] max-w-[320px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between border-b border-gray-800">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img 
                  src="/images/logo.png" 
                  alt="AZB Store Logo" 
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-md cursor-pointer"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* User Quick Bar */}
            <div className="bg-yellow-400/15 p-4 border-b border-yellow-400/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black text-yellow-400 flex items-center justify-center font-bold">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Welcome to AZB</p>
                  <Link 
                    href="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-bold text-gray-900 hover:text-yellow-600 transition-colors"
                  >
                    Login / Register
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 overflow-y-auto py-3 px-4">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Navigation</p>
              <nav className="space-y-1 mb-6">
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-100"
                >
                  <span>Home</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
                <Link 
                  href="/shop" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-100"
                >
                  <span>All Products</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
                <Link 
                  href="/kids" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-100"
                >
                  <span>Kids Zone & Toys</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
                <Link 
                  href="/shop?category=Personalized+Gifts" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-100"
                >
                  <span>Personalized Gifts</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
                <Link 
                  href="/shop?category=Books" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-100"
                >
                  <span>PSC Books</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
                <Link 
                  href="/shop?category=Electronics" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-100"
                >
                  <span>Electronics</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
                <Link 
                  href="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-100"
                >
                  <span>Contact Us</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
              </nav>

              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">My AZB</p>
              <div className="space-y-1">
                <Link 
                  href="/wishlist" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart size={18} className="text-gray-500" />
                    <span>My Wishlist</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
                <Link 
                  href="/cart" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingCart size={18} className="text-gray-500" />
                    <span>My Cart</span>
                  </div>
                  <span 
                    suppressHydrationWarning
                    className="bg-yellow-500 text-black font-bold text-xs rounded-full px-2 py-0.5"
                  >
                    {isMounted ? totalItems : 0}
                  </span>
                </Link>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLocationModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin size={18} className="text-yellow-600" />
                    <span className="truncate">{location}</span>
                  </div>
                  <span className="text-xs font-semibold text-yellow-600">Change</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer Contact */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500">Need help? Call 24/7</p>
                  <a href="tel:+919072525292" className="text-xs font-bold text-gray-900">
                    +91 9072525292
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center shrink-0">
                  <Mail size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-500">Email us</p>
                  <a href="mailto:azbstoreofficial@gmail.com" className="text-xs font-bold text-gray-900 truncate block">
                    azbstoreofficial@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-black text-white px-5 sm:px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                <MapPin size={18} className="text-yellow-500" />
                Choose your location
              </h3>
              <button 
                onClick={() => setIsLocationModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
                aria-label="Close location modal"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-gray-600 text-xs sm:text-sm mb-5 leading-relaxed">
                Select a delivery location to see product availability and accurate delivery options.
              </p>
              
              <button 
                onClick={handleAutoDetect}
                disabled={isDetecting}
                className="w-full flex items-center justify-center gap-2 bg-yellow-50 text-yellow-800 hover:bg-yellow-100 font-semibold py-2.5 sm:py-3 rounded-xl mb-5 transition-colors border border-yellow-200 disabled:opacity-70 disabled:cursor-not-allowed text-xs sm:text-sm cursor-pointer"
              >
                <Navigation size={16} className={isDetecting ? "animate-pulse" : ""} />
                {isDetecting ? "Detecting location..." : "Auto-detect my location"}
              </button>
              
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">or enter pincode</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              
              <form onSubmit={handleLocationSubmit} className="flex gap-2 sm:gap-3">
                <input 
                  type="text" 
                  placeholder="Enter 6-digit Pincode" 
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  className="flex-1 border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-xs sm:text-sm"
                  required
                />
                <button 
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800 font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-colors text-xs sm:text-sm flex-shrink-0 cursor-pointer"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
