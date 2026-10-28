'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  ShoppingCart, 
  Zap, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  Star, 
  Plus, 
  Minus, 
  Share2, 
  MessageCircle,
  ChevronRight,
  Package,
  Award
} from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import toast from 'react-hot-toast';

interface ProductDetailsClientProps {
  id: string;
}

export default function ProductDetailsClient({ id }: ProductDetailsClientProps) {
  const router = useRouter();
  const numericId = parseInt(id, 10);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'reviews'>('desc');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Category-based dynamic variants / options
  const isOutfit = product?.mainCategory === 'Outfits' || product?.category.toLowerCase().includes('outfit') || product?.category.toLowerCase().includes('dress') || product?.category.toLowerCase().includes('kurti');
  const isKidsOutfit = isOutfit && (product?.category.toLowerCase().includes('kid') || product?.category.toLowerCase().includes('baby') || product?.title.toLowerCase().includes('baby') || product?.title.toLowerCase().includes('girl'));

  const sizeOptions = isKidsOutfit 
    ? ['0-6 Months', '6-12 Months', '1-2 Years', '2-3 Years', '3-4 Years']
    : isOutfit 
      ? ['Small (S)', 'Medium (M)', 'Large (L)', 'X-Large (XL)', 'XXL']
      : ['Single Pack', 'Pack of 2 (Save 10%)', 'Family Combo (Best Value)'];

  const [selectedVariant, setSelectedVariant] = useState<string>(sizeOptions[0]);

  // Load live product data from WooCommerce API if available
  useEffect(() => {
    async function fetchLiveProduct() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data?.products && Array.isArray(data.products)) {
            const found = data.products.find((p: Product) => p.id === numericId || String(p.id) === id);
            if (found) {
              setProduct(found);
              setSelectedImage(found.image);
            }

            // Populate related products from same category or best sellers
            const cat = found?.category || '';
            const related = data.products
              .filter((p: Product) => p.id !== numericId && (p.category === cat || p.mainCategory === found?.mainCategory))
              .slice(0, 5);
            setRelatedProducts(related.length > 0 ? related : data.products.slice(0, 5));
          }
        }
      } catch (err) {
        console.error('Failed to load product details from API:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveProduct();
  }, [id, numericId]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
    }
  }, [product]);

  // Ensure default variant aligns with product category once loaded
  useEffect(() => {
    if (sizeOptions.length > 0 && !sizeOptions.includes(selectedVariant)) {
      setSelectedVariant(sizeOptions[0]);
    }
  }, [product, isKidsOutfit, isOutfit]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={30} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-500 text-sm mb-6">
            The item you are looking for is currently unavailable or may have been updated.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-xl transition-all shadow-sm text-sm"
          >
            Explore All Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    toast.success('Proceeding to checkout...');
    router.push('/cart');
  };

  const handleWhatsAppOrder = () => {
    const msg = `Hello AZB Store! I want to order:\n\n*${product.title}*\nOption / Size: ${selectedVariant}\nQuantity: ${quantity}\nPrice: ₹${product.price * quantity}\n\nPlease share payment and delivery details.`;
    const url = `https://wa.me/919072525292?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on AZB Store at ₹${product.price}!`,
        url: window.location.href
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const isSaved = isInWishlist(product.id);
  const savingsAmount = product.originalPrice && product.originalPrice > product.price 
    ? product.originalPrice - product.price 
    : 0;

  return (
    <div className="bg-gray-50/60 min-h-screen py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500 mb-4 sm:mb-6 flex-wrap">
          <Link href="/" className="hover:text-yellow-600 transition-colors">Home</Link>
          <ChevronRight size={13} className="text-gray-400" />
          <Link href="/shop" className="hover:text-yellow-600 transition-colors">Shop</Link>
          <ChevronRight size={13} className="text-gray-400" />
          <Link 
            href={`/shop?category=${encodeURIComponent(product.mainCategory || product.category.split(',')[0])}`}
            className="hover:text-yellow-600 transition-colors"
          >
            {product.mainCategory || product.category.split(',')[0]}
          </Link>
          <ChevronRight size={13} className="text-gray-400" />
          <span className="text-gray-900 font-semibold truncate max-w-[220px] sm:max-w-xs">{product.title}</span>
        </nav>

        {/* Product Details Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden p-4 sm:p-6 md:p-8 mb-8 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: Gallery & Main Image Preview */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="relative aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group">
                <img 
                  src={selectedImage || product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80';
                  }}
                />

                {/* Discount Badge */}
                {product.discount && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white font-extrabold text-xs sm:text-sm px-3 py-1 rounded-full shadow-md tracking-wide">
                    {product.discount}
                  </span>
                )}

                {/* Wishlist & Share Floating Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  <button
                    onClick={() => isSaved ? removeFromWishlist(product.id) : addToWishlist(product)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all cursor-pointer ${
                      isSaved 
                        ? 'bg-red-50 text-red-500 ring-2 ring-red-400' 
                        : 'bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white'
                    }`}
                    title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                    aria-label="Wishlist"
                  >
                    <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-yellow-600 flex items-center justify-center backdrop-blur-md shadow-md transition-all cursor-pointer"
                    title="Share product link"
                    aria-label="Share"
                  >
                    <Share2 size={18} />
                  </button>
                </div>

                {/* Stock status watermark */}
                {product.soldOut && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-red-600 text-white font-extrabold text-lg sm:text-xl px-6 py-2 rounded-xl shadow-lg uppercase tracking-wider">
                      Currently Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {[product.image, product.bannerImage].filter(Boolean).map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl!)}
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      (selectedImage || product.image) === imgUrl 
                        ? 'border-yellow-500 ring-2 ring-yellow-400/30' 
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl!} alt={`View angle ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Verified Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <Truck size={20} className="text-yellow-600 mb-1" />
                  <span className="text-[11px] font-bold text-gray-800">Free Express</span>
                  <span className="text-[10px] text-gray-500">All India Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <ShieldCheck size={20} className="text-green-600 mb-1" />
                  <span className="text-[11px] font-bold text-gray-800">100% Genuine</span>
                  <span className="text-[10px] text-gray-500">Quality Assured</span>
                </div>
                <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <RotateCcw size={20} className="text-blue-600 mb-1" />
                  <span className="text-[11px] font-bold text-gray-800">7 Days Return</span>
                  <span className="text-[10px] text-gray-500">Easy Replacement</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Information, Options & Primary Buy Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Category & Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-block bg-yellow-400/20 text-yellow-800 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-yellow-400/30">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                    <Award size={14} className="text-yellow-500" />
                    <span>AZB Official</span>
                  </div>
                </div>

                {/* Product Title */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
                  {product.title}
                </h1>

                {/* Ratings & Reviews */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <div className="flex items-center gap-1 bg-green-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs">
                    <span>4.8</span>
                    <Star size={12} fill="currentColor" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">142 Ratings & 38 Verified Reviews</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-semibold text-green-700 flex items-center gap-1">
                    <Check size={14} /> In Stock
                  </span>
                </div>

                {/* Pricing Box */}
                <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200/70 mb-6">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-base sm:text-lg text-gray-400 line-through font-medium">
                        M.R.P: ₹{product.originalPrice}
                      </span>
                    )}
                    {product.discount && (
                      <span className="text-sm font-extrabold text-red-600 bg-red-100 px-2.5 py-0.5 rounded-md">
                        {product.discount}
                      </span>
                    )}
                  </div>

                  {savingsAmount > 0 && (
                    <p className="text-xs sm:text-sm font-bold text-green-700 mt-1.5 flex items-center gap-1">
                      <span>You Save: ₹{savingsAmount} (Inclusive of all Indian taxes)</span>
                    </p>
                  )}
                  <p className="text-[11px] text-gray-500 mt-1">
                    Free shipping all over India. Secure online payment via Razorpay.
                  </p>
                </div>

                {/* Product Variant / Option Selector */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      {isOutfit ? 'Select Size:' : 'Select Option / Pack:'}
                    </label>
                    <span className="text-xs font-semibold text-yellow-600">{selectedVariant}</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {sizeOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedVariant(opt)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          selectedVariant === opt
                            ? 'bg-black text-white border-black shadow-xs ring-2 ring-yellow-400'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-8 flex items-center gap-4">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-2 sm:p-2.5 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-bold text-sm text-gray-900 select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(10, q + 1))}
                      className="p-2 sm:p-2.5 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                      disabled={quantity >= 10}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">(Subtotal: ₹{product.price * quantity})</span>
                </div>

                {/* PRIMARY ACTION BUTTONS: Buy Now & Add to Cart */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  {product.soldOut ? (
                    <button
                      disabled
                      className="w-full bg-gray-200 text-gray-500 font-bold py-3.5 rounded-xl text-sm cursor-not-allowed uppercase tracking-wider"
                    >
                      Product Currently Sold Out
                    </button>
                  ) : (
                    <>
                      {/* BUY NOW BUTTON */}
                      <button
                        onClick={handleBuyNow}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 active:scale-[0.99] text-black font-extrabold py-3.5 sm:py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm sm:text-base uppercase tracking-wider cursor-pointer border border-yellow-500"
                        id="buy-now-button"
                      >
                        <Zap size={18} fill="currentColor" />
                        <span>Buy Now • ₹{product.price * quantity}</span>
                      </button>

                      {/* ADD TO CART BUTTON */}
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-black hover:bg-gray-800 active:scale-[0.99] text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm sm:text-base uppercase tracking-wider cursor-pointer"
                        id="add-to-cart-button"
                      >
                        <ShoppingCart size={18} />
                        <span>Add to Cart</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Direct Order via WhatsApp */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm border border-[#25D366]/30 cursor-pointer"
                >
                  <MessageCircle size={17} />
                  <span>Order directly via WhatsApp (+91 9072525292)</span>
                </button>
              </div>

              {/* Delivery Guarantee note */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-green-600" />
                  <span>Secure SSL Checkout</span>
                </span>
                <span>Dispatch: Today by 5:00 PM</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed Product Details: Description, Specs, Shipping, Reviews */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 md:p-8 mb-8 sm:mb-12">
          {/* Tab Headers */}
          <div className="flex items-center gap-2 sm:gap-6 border-b border-gray-200 overflow-x-auto pb-1 mb-6">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'desc'
                  ? 'border-yellow-500 text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Description & Benefits
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'specs'
                  ? 'border-yellow-500 text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'shipping'
                  ? 'border-yellow-500 text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Delivery & Returns
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-yellow-500 text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Verified Reviews (38)
            </button>
          </div>

          {/* Tab Content */}
          <div className="text-gray-700 text-sm leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-bold text-gray-900">About this product</h3>
                <p>
                  Experience supreme quality with <span className="font-semibold text-gray-900">{product.title}</span>. Curated directly by AZB Store, this item is crafted to deliver unmatched utility, comfort, and premium performance for everyday lifestyle requirements.
                </p>
                <div className="bg-yellow-50/60 p-4 rounded-xl border border-yellow-200/60 space-y-2 mt-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-yellow-900">Key Highlights:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-yellow-950">
                    <li>Authentic AZB Store guarantee with rigorous quality-inspection before packaging.</li>
                    <li>Premium construction and skin-friendly / non-toxic materials for peace of mind.</li>
                    <li>Designed for convenience, extended longevity, and effortless day-to-day usability.</li>
                    <li>Packaged securely in tamper-evident protective wrapping for damage-free transit.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Technical Specifications</h3>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-2 p-3 bg-gray-50/60 text-xs">
                    <span className="font-semibold text-gray-500">Brand / Retailer</span>
                    <span className="font-bold text-gray-900">AZB Store</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 text-xs">
                    <span className="font-semibold text-gray-500">Primary Category</span>
                    <span className="font-bold text-gray-900">{product.category}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 bg-gray-50/60 text-xs">
                    <span className="font-semibold text-gray-500">Country of Origin</span>
                    <span className="font-bold text-gray-900">India</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 text-xs">
                    <span className="font-semibold text-gray-500">Selected Option</span>
                    <span className="font-bold text-gray-900">{selectedVariant}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 bg-gray-50/60 text-xs">
                    <span className="font-semibold text-gray-500">Package Contents</span>
                    <span className="font-bold text-gray-900">1 unit of {product.title}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 max-w-2xl">
                <h3 className="text-lg font-bold text-gray-900">Shipping & Return Information</h3>
                <p>
                  We offer expedited courier dispatch across all PIN codes in India. Orders placed before 4:00 PM are dispatched on the same business day.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <h4 className="font-bold text-xs uppercase text-gray-800 mb-1 flex items-center gap-1.5">
                      <Truck size={16} className="text-yellow-600" /> Free Shipping
                    </h4>
                    <p className="text-xs text-gray-600">
                      Standard delivery takes 3 to 5 working days depending on location. Tracking code provided via SMS / WhatsApp.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <h4 className="font-bold text-xs uppercase text-gray-800 mb-1 flex items-center gap-1.5">
                      <RotateCcw size={16} className="text-blue-600" /> 7 Days Replacement
                    </h4>
                    <p className="text-xs text-gray-600">
                      If the item is damaged, defective or different, request an instant hassle-free return or replacement within 7 days of delivery.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-3xl">
                <div className="flex items-center gap-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="text-center pr-6 border-r border-gray-200">
                    <div className="text-4xl font-extrabold text-gray-900">4.8</div>
                    <div className="flex text-yellow-400 justify-center my-1">
                      {'★'.repeat(5)}
                    </div>
                    <div className="text-xs text-gray-500">Based on 38 reviews</div>
                  </div>
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span>5 Star</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-[85%]"></div>
                      </div>
                      <span>85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>4 Star</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-[12%]"></div>
                      </div>
                      <span>12%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>3 Star</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full w-[3%]"></div>
                      </div>
                      <span>3%</span>
                    </div>
                  </div>
                </div>

                {/* Sample Review Cards */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-gray-100 bg-white shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-gray-900">Rahul M.</span>
                      <span className="text-[10px] text-gray-400">Verified Buyer • 2 days ago</span>
                    </div>
                    <div className="text-yellow-400 text-xs mb-1">★★★★★</div>
                    <p className="text-xs text-gray-600">
                      Excellent quality! Product is exactly as described and delivery was super fast. Very satisfied with AZB Store.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-gray-100 bg-white shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-gray-900">Anjali K.</span>
                      <span className="text-[10px] text-gray-400">Verified Buyer • 5 days ago</span>
                    </div>
                    <div className="text-yellow-400 text-xs mb-1">★★★★★</div>
                    <p className="text-xs text-gray-600">
                      Ordered via Cash on Delivery, received properly packed item. Worth every rupee!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-wide">
                  Related Products
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Customers who viewed this also bought</p>
              </div>
              <Link 
                href="/shop"
                className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {relatedProducts.map((rel) => (
                <div 
                  key={rel.id} 
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col group"
                >
                  <Link href={`/product/${rel.id}`} className="relative aspect-square bg-gray-50 block overflow-hidden">
                    <img 
                      src={rel.image} 
                      alt={rel.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {rel.discount && (
                      <span className="absolute bottom-2 left-2 bg-yellow-400 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                        {rel.discount}
                      </span>
                    )}
                  </Link>

                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5 truncate">
                      {rel.category}
                    </p>
                    <Link href={`/product/${rel.id}`} className="hover:text-yellow-600 transition-colors">
                      <h3 className="font-bold text-xs text-gray-900 line-clamp-1 leading-snug mb-2">
                        {rel.title}
                      </h3>
                    </Link>

                    <div className="mt-auto pt-2 border-t border-gray-100">
                      <div className="flex items-baseline gap-1.5 flex-wrap mb-2">
                        <span className="text-sm font-extrabold text-gray-900">₹{rel.price}</span>
                        {rel.originalPrice && rel.originalPrice > rel.price && (
                          <span className="text-[11px] text-gray-400 line-through">₹{rel.originalPrice}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/product/${rel.id}`}
                          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black text-center py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                        >
                          Buy Now
                        </Link>
                        <button
                          onClick={() => addToCart(rel)}
                          className="bg-black hover:bg-gray-800 text-white p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Add to Cart"
                          aria-label="Add to cart"
                        >
                          <ShoppingCart size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
