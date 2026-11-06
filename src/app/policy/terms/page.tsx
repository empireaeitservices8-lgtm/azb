import React from 'react';
import Link from 'next/link';
import { fetchLiveSiteSettings } from '@/lib/siteSettings';

export const metadata = {
  title: 'Terms of Service - AZB Store',
  description: 'Read the terms and conditions for ordering and using AZB Store.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TermsPolicyPage() {
  const settings = await fetchLiveSiteSettings();
  const title = settings.policy_terms_title || 'Terms of Service';
  const content = settings.policy_terms_content || '<p>By browsing or placing an order through AZB Store, you agree to comply with our store policies, dispatch schedules, and terms of use. Product availability and pricing are subject to real-time inventory updates.</p>';

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-yellow-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-yellow-600 font-medium">Terms of Service</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pt-10 max-w-4xl">
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-100">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4">
            {title}
          </h1>
          <div 
            className="prose prose-yellow max-w-none text-gray-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </main>
  );
}
