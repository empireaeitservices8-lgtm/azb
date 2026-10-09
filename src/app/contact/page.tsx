import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export const metadata = {
  title: 'Contact Us - AZB Store',
  description: 'Get in touch with AZB Store for any inquiries, support, or feedback.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-yellow-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-yellow-600 font-medium">Contact</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pt-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">Get In Touch</h1>
          <p className="text-gray-600 text-lg">
            Have a question about our products, your order, or just want to say hi? We're always here to help. Drop us a message below!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Phone Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 transition-transform">
                <Phone size={28} />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Call Us</h3>
              <p className="text-gray-500 mb-4 text-sm">We are available 24/7 to answer your queries.</p>
              <a href="tel:+919072525292" className="text-lg font-bold text-yellow-600 hover:text-yellow-500 transition-colors">
                +91 9072525292
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 transition-transform">
                <Mail size={28} />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Email Us</h3>
              <p className="text-gray-500 mb-4 text-sm">Send us an email and we'll reply within 24 hours.</p>
              <a href="mailto:azbstoreofficial@gmail.com" className="text-lg font-bold text-yellow-600 hover:text-yellow-500 transition-colors">
                azbstoreofficial@gmail.com
              </a>
            </div>

            {/* Address Card */}
            <div className="bg-black p-8 rounded-2xl shadow-sm border border-gray-800 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-yellow-500 mb-6">
                <MapPin size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Our Headquarters</h3>
              <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                AZB Store HQ<br/>
                123 Commerce Avenue, Tech Park<br/>
                New Delhi, India 110001
              </p>
              <div className="flex items-center justify-center gap-2 text-yellow-500 text-sm font-medium mt-2">
                <Clock size={16} />
                <span>Mon-Fri: 9:00 AM - 6:00 PM</span>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 h-full">
              <h2 className="text-3xl font-bold text-black mb-8">Send a Message</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                  <textarea 
                    id="message" 
                    rows={6}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
                    placeholder="Write your message here..."
                    required
                  ></textarea>
                </div>

                <button 
                  type="button" 
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Send Message</span>
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
