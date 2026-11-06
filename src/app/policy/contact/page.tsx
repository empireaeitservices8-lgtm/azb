import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { fetchLiveSiteSettings } from '@/lib/siteSettings';

export const metadata = {
  title: 'Contact Information - AZB Store',
  description: 'Get in touch with AZB Store for support, orders, and inquiries.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ContactPolicyPage() {
  const settings = await fetchLiveSiteSettings();
  const phone = settings.site_phone || '+91 9072525292';
  const email = settings.site_email || 'azbstoreofficial@gmail.com';
  const addressLines = (settings.contact_address_text || 'AZB Store\nKarunagappally\nKollam').split('\n');

  return (
    <div className='container mx-auto px-4 py-16 max-w-3xl'>
      <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 text-center'>Contact Information</h1>
      <p className='text-gray-600 text-center mb-10'>
        If you have any questions, inquiries, or require customer support, please contact us using the details below.
      </p>

      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6'>
        <div className='flex items-start gap-4'>
          <div className='w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center shrink-0'>
            <Phone size={22} />
          </div>
          <div>
            <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>Phone Support</h2>
            <a href={`tel:${phone}`} className='text-lg font-bold text-gray-900 hover:text-yellow-600 transition-colors'>
              {phone}
            </a>
            <p className='text-xs text-gray-500 mt-1'>{settings.site_phone_label || 'Available 24/7 for customer queries'}</p>
          </div>
        </div>

        <hr className='border-gray-100' />

        <div className='flex items-start gap-4'>
          <div className='w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center shrink-0'>
            <Mail size={22} />
          </div>
          <div>
            <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>Email Support</h2>
            <a href={`mailto:${email}`} className='text-lg font-bold text-gray-900 hover:text-yellow-600 transition-colors'>
              {email}
            </a>
            <p className='text-xs text-gray-500 mt-1'>{settings.site_email_label || 'We aim to reply within 24 hours'}</p>
          </div>
        </div>

        <hr className='border-gray-100' />

        <div className='flex items-start gap-4'>
          <div className='w-12 h-12 bg-black text-yellow-500 rounded-full flex items-center justify-center shrink-0'>
            <MapPin size={22} />
          </div>
          <div>
            <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>Office Address</h2>
            <div className='text-sm font-medium text-gray-800 mt-0.5 leading-relaxed'>
              {addressLines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='text-center mt-8'>
        <Link 
          href='/contact' 
          className='inline-block px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl text-sm transition-colors shadow-sm cursor-pointer'
        >
          Send Us a Direct Message
        </Link>
      </div>
    </div>
  );
}
