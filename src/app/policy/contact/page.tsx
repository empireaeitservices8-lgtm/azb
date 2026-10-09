import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Contact Information - AZB Store',
  description: 'Get in touch with AZB Store for support, orders, and inquiries.',
};

export default function ContactPolicyPage() {
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
            <a href='tel:+919072525292' className='text-lg font-bold text-gray-900 hover:text-yellow-600 transition-colors'>
              +91 9072525292
            </a>
            <p className='text-xs text-gray-500 mt-1'>Available 24/7 for customer queries</p>
          </div>
        </div>

        <hr className='border-gray-100' />

        <div className='flex items-start gap-4'>
          <div className='w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center shrink-0'>
            <Mail size={22} />
          </div>
          <div>
            <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>Email Support</h2>
            <a href='mailto:azbstoreofficial@gmail.com' className='text-lg font-bold text-gray-900 hover:text-yellow-600 transition-colors'>
              azbstoreofficial@gmail.com
            </a>
            <p className='text-xs text-gray-500 mt-1'>We aim to reply within 24 hours</p>
          </div>
        </div>

        <hr className='border-gray-100' />

        <div className='flex items-start gap-4'>
          <div className='w-12 h-12 bg-black text-yellow-500 rounded-full flex items-center justify-center shrink-0'>
            <MapPin size={22} />
          </div>
          <div>
            <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>Office Address</h2>
            <p className='text-sm font-medium text-gray-800 mt-0.5 leading-relaxed'>
              AZB Store HQ<br />
              123 Commerce Avenue, Tech Park<br />
              New Delhi, India 110001
            </p>
          </div>
        </div>
      </div>

      <div className='text-center mt-8'>
        <Link 
          href='/contact' 
          className='inline-block px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl text-sm transition-colors shadow-sm'
        >
          Send Us a Direct Message
        </Link>
      </div>
    </div>
  );
}
