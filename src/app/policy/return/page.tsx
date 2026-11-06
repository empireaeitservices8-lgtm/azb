import React from 'react';
import Link from 'next/link';
import { fetchLiveSiteSettings } from '@/lib/siteSettings';

export const metadata = {
  title: 'Return & Refund Policy - AZB Store',
  description: 'Read the official return, cancellation and refund policy of AZB Store.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ReturnPolicyPage() {
  const settings = await fetchLiveSiteSettings();
  const title = settings.policy_return_title || 'Return, Cancellation & Refund Policy';
  const content = settings.policy_return_content || '<p>Defective or damaged items will be replaced upon verification. An unedited continuous unboxing video is mandatory for all damage claims and must be submitted within 24 hours of delivery.</p>';

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-yellow-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-yellow-600 font-medium">Return Policy</span>
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
