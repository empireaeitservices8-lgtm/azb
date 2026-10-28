import React from 'react';
import { Metadata } from 'next';
import ProductDetailsClient from './ProductDetailsClient';
import { fetchWCProductById } from '@/lib/woocommerce';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchWCProductById(id);

  if (!product) {
    return {
      title: 'Product Details | AZB Store',
      description: 'Explore verified products at AZB Store.',
    };
  }

  return {
    title: `${product.name} | AZB Store`,
    description: `Buy ${product.name} online at AZB Store for ₹${product.price || product.regular_price}. Secure Razorpay online payment and free shipping available.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductDetailsClient id={id} />;
}
