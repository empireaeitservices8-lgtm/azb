'use client';
import React from 'react';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { SiteSettingsProvider } from './SiteSettingsContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SiteSettingsProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
          <Toaster position="bottom-right" />
        </WishlistProvider>
      </CartProvider>
    </SiteSettingsProvider>
  );
}
