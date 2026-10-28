'use client';
import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Heart, ShoppingCart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className='container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center'>
        <Heart size={64} className='text-gray-300 mb-6' />
        <h1 className='text-2xl sm:text-4xl font-bold mb-4 text-gray-800'>Your Wishlist is Empty</h1>
        <p className='text-gray-500 mb-8'>You haven't saved any items to your wishlist yet.</p>
        <Link href='/shop' className='bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full transition-colors'>
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-12 md:py-16'>
      <div className='flex items-center gap-3 mb-8'>
        <Heart className='text-red-500' size={28} fill="currentColor" />
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>My Wishlist</h1>
        <span className='ml-2 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6'>
        {wishlist.map((item) => (
          <div key={item.id} className='bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group'>
            <div className='relative aspect-[4/5] bg-gray-100 overflow-hidden'>
              <Link href={`/product/${item.id}`} className="block w-full h-full">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" />
              </Link>
              <button 
                onClick={() => removeFromWishlist(item.id)}
                className='absolute top-2 right-2 bg-white/90 backdrop-blur-xs p-1.5 rounded-full text-red-500 hover:text-red-700 transition-colors shadow-sm'
                aria-label="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className='p-3 flex flex-col flex-1'>
              <p className='text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 truncate'>{item.category}</p>
              <Link href={`/product/${item.id}`} className="hover:text-yellow-600 transition-colors">
                <h3 className='font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 leading-snug mb-2 flex-1'>{item.title}</h3>
              </Link>
              
              <div className='mt-auto pt-2 border-t border-gray-100'>
                <div className='flex items-baseline gap-1.5 flex-wrap mb-3'>
                  <span className='text-sm sm:text-base font-extrabold text-gray-900'>₹{item.price}</span>
                  {item.originalPrice && <span className='text-xs text-gray-400 line-through'>₹{item.originalPrice}</span>}
                </div>
                
                {item.soldOut ? (
                  <button disabled className='w-full bg-gray-200 text-gray-500 py-2 rounded-lg text-xs font-bold cursor-not-allowed'>
                    Sold Out
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      addToCart(item);
                      removeFromWishlist(item.id);
                    }}
                    className='w-full bg-black text-white hover:bg-yellow-500 hover:text-black transition-colors py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5'
                  >
                    <ShoppingCart size={14} /> Move to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
