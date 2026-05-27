import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-gold tracking-widest mb-4">Contact Us</h1>
          <p className="text-stone-400">We'd love to hear from you. Reach out for custom bridal inquiries or order support.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Details & Socials */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-serif text-stone-200 mb-6">Get in Touch</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="p-3 bg-stone-900 border border-stone-800 rounded-full shrink-0">
                    <MapPin size={24} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-stone-200 font-medium mb-1">Our Atelier</h3>
                    <p className="text-stone-400 leading-relaxed">10-01-14/2, Pushkar Ghat Cir<br/>Mangalavaripeta, Rajamahendravaram<br/>Andhra Pradesh 533101</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="p-3 bg-stone-900 border border-stone-800 rounded-full shrink-0">
                    <Phone size={24} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-stone-200 font-medium mb-1">Phone & WhatsApp</h3>
                    <p className="text-stone-400">+91 98765 43210</p>
                    <p className="text-stone-500 text-sm mt-1">Mon - Sat, 10:00 AM - 7:00 PM (IST)</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-3 bg-stone-900 border border-stone-800 rounded-full shrink-0">
                    <Mail size={24} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-stone-200 font-medium mb-1">Email</h3>
                    <p className="text-stone-400">concierge@satyabhama.com</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-stone-200 mb-6">Connect With Us</h2>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/satyabhama_designers?utm_source=qr&igsh=dnJvamZ1djc5MXZl" target="_blank" rel="noreferrer" className="flex items-center justify-center w-12 h-12 rounded-full border border-stone-700 text-stone-300 hover:text-gold hover:border-gold transition-all">
                  <Instagram size={20} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center justify-center w-12 h-12 rounded-full border border-stone-700 text-stone-300 hover:text-gold hover:border-gold transition-all">
                  <Facebook size={20} />
                </a>
                <a href="https://youtube.com/@satyabhamadesigners?si=oNlgBrYUwfwMTSms" target="_blank" rel="noreferrer" className="flex items-center justify-center w-12 h-12 rounded-full border border-stone-700 text-stone-300 hover:text-gold hover:border-gold transition-all">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Form and Map */}
          <div className="space-y-8">
            <div className="bg-stone-950 border border-stone-800 p-8 rounded-lg shadow-heavy">
              <h2 className="text-xl font-serif text-gold mb-6">Send a Message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">First Name</label>
                    <input type="text" className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Last Name</label>
                    <input type="text" className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-gold outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Email Address</label>
                  <input type="email" className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Message</label>
                  <textarea rows={4} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-gold outline-none resize-none"></textarea>
                </div>
                <button type="button" className="w-full bg-gold text-black font-bold uppercase tracking-widest text-sm py-4 rounded hover:bg-white transition-colors">
                  Submit Inquiry
                </button>
              </form>
            </div>

            {/* Google Maps Embed */}
            <div className="w-full h-64 rounded-lg overflow-hidden border border-stone-800">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3815.110756774205!2d81.76495!3d17.00063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37a44f54e15ba3%3A0x6b9d6a2f3a69a2!2sRajamahendravaram%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
