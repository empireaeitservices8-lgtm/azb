'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Heart, SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';
import { allProducts, Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [baseProducts, setBaseProducts] = useState<Product[]>(allProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [loading, setLoading] = useState(false);

  // Fetch live products from WooCommerce API
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data?.products && data.products.length > 0) {
            setBaseProducts(data.products);
          }
        }
      } catch (err) {
        console.error('Failed to load products from API:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Sync state if URL search query changes
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category') || 'All');
    }
  }, [searchParams]);

  useEffect(() => {
    let result = [...baseProducts];

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      const terms = q.split(/\s+/);
      result = result.filter((item) => {
        const titleMatch = item.title.toLowerCase();
        const catMatch = item.category.toLowerCase();
        const tagMatch = item.tags?.join(' ').toLowerCase() || '';
        return terms.every(term => titleMatch.includes(term) || catMatch.includes(term) || tagMatch.includes(term));
      });
    }

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter((item) => 
        item.mainCategory === selectedCategory || 
        item.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [baseProducts, query, selectedCategory, sortBy]);

  const categories = [
    'All',
    'Kids',
    'Women',
    'Outfits',
    'Ethnic',
    'Shoe Care',
    'Laundry',
    'Daily Essentials',
    'Home Essentials',
    'Personalized Gifts',
    'Toys',
    'Educational Toys',
    'Games',
    'Stationery',
    'Books & Kits',
    'PSC Books',
    'Sports',
    'Electronics'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-10">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Link href="/" className="hover:text-yellow-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Shop</span>
            {query && (
              <>
                <span>/</span>
                <span className="text-yellow-600 font-semibold truncate max-w-[150px]">"{query}"</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {query ? (
                  <span>
                    Search Results for <span className="text-yellow-600">"{query}"</span>
                  </span>
                ) : selectedCategory !== 'All' ? (
                  <span>{selectedCategory}</span>
                ) : (
                  <span>All Products</span>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            {/* Quick in-page Search Input */}
            <div className="w-full md:w-80">
              <div className="relative">
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter products..."
                  className="w-full bg-white border border-gray-300 rounded-full py-2 pl-10 pr-10 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                {query && (
                  <button 
                    onClick={() => setQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filter bar: Categories & Sort */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-xs mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 mr-1 flex-shrink-0">
              <SlidersHorizontal size={14} /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === cat 
                    ? 'bg-yellow-400 text-black shadow-xs font-bold' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
            <ArrowUpDown size={14} className="text-gray-500" />
            <span className="text-xs text-gray-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-50 border border-gray-300 rounded-lg py-1 px-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                  />
                  <button 
                    onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                    className={`absolute top-2 right-2 backdrop-blur-xs p-1.5 rounded-full transition-colors shadow-xs ${
                      isInWishlist(product.id) ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-500'
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart size={15} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </button>
                  {product.discount && (
                    <span className="absolute bottom-2 left-2 bg-yellow-400 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                      {product.discount}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-3 flex flex-col flex-1">
                  <p className="text-[11px] font-semibold text-yellow-700 uppercase tracking-wider mb-1 truncate">
                    {product.category}
                  </p>
                  <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 leading-snug mb-2 flex-1">
                    {product.title}
                  </h3>

                  <div className="mt-auto pt-2 border-t border-gray-100">
                    <div className="flex items-baseline gap-1.5 flex-wrap mb-2.5">
                      <span className="text-sm sm:text-base font-extrabold text-gray-900">₹{product.price}</span>
                      <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                    </div>

                    {product.soldOut ? (
                      <button 
                        disabled
                        className="w-full bg-gray-200 text-gray-500 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed"
                      >
                        Sold Out
                      </button>
                    ) : (
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-black text-white hover:bg-yellow-500 hover:text-black transition-colors py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No products found</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
              We couldn't find any products matching <span className="font-semibold text-gray-800">"{query}"</span>. Try checking for spelling errors or search for common terms.
            </p>

            <div className="text-left bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
              <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                <Tag size={14} className="text-yellow-600" /> Popular Searches:
              </p>
              <div className="flex flex-wrap gap-2">
                {['Crayon', 'Marker', 'Frock', 'Rompers', 'Kurti', 'Toys', 'PSC'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      setSelectedCategory('All');
                    }}
                    className="bg-white hover:bg-yellow-50 hover:border-yellow-300 border border-gray-200 px-2.5 py-1 rounded-full text-xs font-medium text-gray-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('All');
              }}
              className="bg-black text-white hover:bg-gray-800 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors"
            >
              Clear Filters & View All
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
