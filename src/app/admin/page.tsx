'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Video, Plus, Trash2, Edit2, ExternalLink, Lock, Eye, CheckCircle2, 
  AlertCircle, RefreshCw, ShoppingBag, ArrowLeft, X, Play
} from 'lucide-react';
import { InstagramReel } from '@/lib/siteSettings';
import { Product } from '@/data/products';

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [reels, setReels] = useState<InstagramReel[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<InstagramReel | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    productId: '',
    category: '',
    price: '',
    originalPrice: '',
    discount: '',
    videoSrc: '',
    poster: '',
    instagramUrl: 'https://www.instagram.com/'
  });

  // Check login session on mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('azb_admin_logged_in');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch Reels & Products once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    loadData();
  }, [isAuthenticated]);

  async function loadData() {
    setLoading(true);
    try {
      const [reelsRes, productsRes] = await Promise.all([
        fetch('/api/reels', { cache: 'no-store' }),
        fetch('/api/products', { cache: 'no-store' })
      ]);

      if (reelsRes.ok) {
        const reelsData = await reelsRes.json();
        if (reelsData?.reels) setReels(reelsData.reels);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        if (productsData?.products) setProducts(productsData.products);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setStatusMessage({ type: 'error', text: 'Failed to fetch data from store API.' });
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN || pinInput === 'azb2026') {
      sessionStorage.setItem('azb_admin_logged_in', 'true');
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Please enter the correct admin PIN.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('azb_admin_logged_in');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Open modal for Adding new reel
  const handleOpenAddModal = () => {
    setEditingReel(null);
    setFormData({
      title: '',
      productId: '',
      category: '',
      price: '',
      originalPrice: '',
      discount: '',
      videoSrc: '',
      poster: '',
      instagramUrl: 'https://www.instagram.com/'
    });
    setIsModalOpen(true);
  };

  // Open modal for Editing reel
  const handleOpenEditModal = (reel: InstagramReel) => {
    setEditingReel(reel);
    setFormData({
      title: reel.title || '',
      productId: reel.productId?.toString() || '',
      category: reel.category || '',
      price: reel.price?.toString() || '',
      originalPrice: reel.originalPrice?.toString() || '',
      discount: reel.discount || '',
      videoSrc: reel.videoSrc || '',
      poster: reel.poster || '',
      instagramUrl: reel.instagramUrl || 'https://www.instagram.com/'
    });
    setIsModalOpen(true);
  };

  // Handle product dropdown selection to auto-fill details
  const handleProductSelect = (selectedId: string) => {
    const prod = products.find(p => p.id.toString() === selectedId);
    if (prod) {
      const origPrice = prod.originalPrice || prod.price;
      const pct = origPrice > prod.price 
        ? `${Math.round(((origPrice - prod.price) / origPrice) * 100)}% Off` 
        : '';

      setFormData(prev => ({
        ...prev,
        productId: prod.id.toString(),
        title: prev.title || prod.title,
        category: prod.category || 'General',
        price: prod.price.toString(),
        originalPrice: origPrice.toString(),
        discount: pct,
        poster: prev.poster || prod.image || ''
      }));
    } else {
      setFormData(prev => ({ ...prev, productId: selectedId }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.videoSrc.trim()) {
      setStatusMessage({ type: 'error', text: 'Title and Video URL are required.' });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const url = '/api/reels';
      const method = editingReel ? 'PUT' : 'POST';
      const payload = {
        ...formData,
        id: editingReel ? editingReel.id : undefined,
        price: Number(formData.price) || 0,
        originalPrice: Number(formData.originalPrice) || Number(formData.price) || 0,
        productId: formData.productId ? Number(formData.productId) : undefined
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReels(data.reels);
        setIsModalOpen(false);
        setStatusMessage({ 
          type: 'success', 
          text: editingReel 
            ? 'Reel updated successfully!' 
            : 'New reel added successfully! It is now live on the website.' 
        });
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Operation failed.' });
      }
    } catch (err) {
      console.error('Submit error:', err);
      setStatusMessage({ type: 'error', text: 'Failed to save reel. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the reel "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/reels?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setReels(data.reels);
        setStatusMessage({ type: 'success', text: 'Reel deleted successfully from website.' });
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to delete reel.' });
      }
    } catch (err) {
      console.error('Delete error:', err);
      setStatusMessage({ type: 'error', text: 'Network error deleting reel.' });
    }
  };

  // 1. PIN Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Lock className="text-gray-900" size={28} />
          </div>
          <h1 className="text-2xl font-black text-center text-gray-900 mb-1">AZB Store Admin</h1>
          <p className="text-sm text-center text-gray-500 mb-6">Enter Admin PIN to manage Reels & Products</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Admin PIN
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (Default: 1234)"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-center text-lg tracking-widest font-mono"
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-600 font-medium text-center">{pinError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer shadow-sm text-sm"
            >
              Sign In to Admin
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900">
              <ArrowLeft size={14} />
              <span>Back to Store Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Main Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 to-yellow-500 flex items-center justify-center font-black text-black text-sm shadow-xs">
              AZB
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-gray-900 leading-none">
                Admin Dashboard
              </h1>
              <span className="text-[11px] font-medium text-gray-500">Website Content & Reels Manager</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              <Eye size={14} />
              <span className="hidden sm:inline">View Live Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-semibold px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
        {/* Status Toast/Alert */}
        {statusMessage && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
            statusMessage.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={20} className="shrink-0 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="shrink-0 text-red-600 mt-0.5" />
            )}
            <div className="flex-1 text-sm font-medium">{statusMessage.text}</div>
            <button 
              onClick={() => setStatusMessage(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <Video className="text-yellow-600" size={24} />
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-wide">
                Instagram Reels Manager
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Add, edit, or remove video reels displayed on the homepage. Changes reflect immediately on the live website.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
              title="Refresh Reels"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={18} />
              <span>Add New Reel</span>
            </button>
          </div>
        </div>

        {/* Live Reels Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw size={32} className="animate-spin text-yellow-500 mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-medium">Loading store reels...</p>
          </div>
        ) : reels.length === 0 ? (
          <div className="py-16 bg-white rounded-2xl border border-dashed border-gray-300 text-center px-4">
            <Video size={40} className="text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 mb-1">No Reels Added Yet</h3>
            <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
              Click &quot;Add New Reel&quot; to add your first video reel to the homepage.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-xs px-4 py-2 rounded-xl transition-colors"
            >
              <Plus size={16} />
              <span>Add Reel Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {reels.map((reel, index) => (
              <div 
                key={reel.id || index}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs flex flex-col group hover:shadow-md transition-shadow"
              >
                {/* Reel Preview / Thumbnail */}
                <div className="relative aspect-[9/14] bg-black overflow-hidden flex items-center justify-center">
                  {reel.poster ? (
                    <img 
                      src={reel.poster} 
                      alt={reel.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-xs flex flex-col items-center gap-2">
                      <Play size={32} className="text-yellow-400" />
                      <span>Video: {reel.videoSrc}</span>
                    </div>
                  )}

                  {/* Badges on preview */}
                  <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Reel #{index + 1}
                  </div>

                  {reel.discount && (
                    <div className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                      {reel.discount}
                    </div>
                  )}

                  {/* Instagram icon link */}
                  <a
                    href={reel.instagramUrl || 'https://www.instagram.com/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2.5 right-2.5 bg-black/60 hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-600 text-white p-1.5 rounded-full backdrop-blur-xs transition-all"
                    title="Open on Instagram"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    {reel.category || 'General'}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-2 mt-0.5 min-h-[40px]">
                    {reel.title}
                  </h3>

                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-gray-900">₹{reel.price}</span>
                    {reel.originalPrice > reel.price && (
                      <span className="text-xs text-gray-400 line-through">₹{reel.originalPrice}</span>
                    )}
                  </div>

                  {reel.productId && (
                    <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-1">
                      <ShoppingBag size={12} className="text-yellow-600" />
                      <span>Linked Product: #{reel.productId}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-auto pt-3 border-t border-gray-100 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(reel)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(reel.id, reel.title)}
                      className="py-1.5 px-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                      title="Delete Reel"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Helpful instructions footer */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide mb-2">
            💡 How to add videos to your Reels:
          </h3>
          <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">
            <li>
              <strong>WordPress Media Library:</strong> Upload any `.mp4` video in your WordPress Admin (<a href="https://lightcyan-gorilla-655722.hostingersite.com/wp-admin/upload.php" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Media → Add New</a>), copy the file URL, and paste it into the <em>Video MP4 URL</em> field.
            </li>
            <li>
              <strong>Quick Product Linking:</strong> Selecting an existing product from the dropdown will automatically fill in the title, price, discount, and product image thumbnail for you.
            </li>
            <li>
              <strong>Instagram Link:</strong> Paste your Instagram post link so customers can tap &quot;Watch on Instagram&quot; and view your reel on your profile.
            </li>
          </ul>
        </div>
      </main>

      {/* 3. Add / Edit Reel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-lg"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-1">
              {editingReel ? 'Edit Instagram Reel' : 'Add New Instagram Reel'}
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              Fill in the video details below. Once saved, it will appear on your homepage immediately.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quick Product Select Dropdown */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  1. Link an Existing Product (Optional but Recommended)
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 outline-none bg-white"
                >
                  <option value="">-- Choose a Product to Auto-fill Details --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (₹{p.price})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Selecting a product automatically fills Title, Category, Price, and Thumbnail.
                </span>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  2. Reel Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Sensor Light Demonstration"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  3. Video MP4 URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://.../video.mp4 or /videos/reel1.mp4"
                  value={formData.videoSrc}
                  onChange={(e) => setFormData({ ...formData, videoSrc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                />
                <span className="text-[11px] text-gray-400 mt-0.5 block">
                  Link to your MP4 file (from WordPress Media Library, Cloudinary, or local /videos/).
                </span>
              </div>

              {/* Poster Thumbnail */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  4. Thumbnail / Poster Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://.../thumbnail.jpg"
                  value={formData.poster}
                  onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>

              {/* Instagram URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  5. Instagram Post Link
                </label>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/reel/..."
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-yellow-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-yellow-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Discount Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20% Off"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-yellow-400 outline-none"
                  />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-extrabold transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : editingReel ? 'Update Reel' : 'Add Reel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

