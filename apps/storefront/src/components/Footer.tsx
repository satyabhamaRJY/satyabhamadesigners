import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-900 pt-16 pb-8 text-stone-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-stone-900 pb-12">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-gold font-serif text-2xl tracking-widest uppercase mb-6 italic">Satyabhama</h2>
            <p className="mb-6 leading-relaxed">
              Curating authentic handloom luxury since August 2023. Preserving the timeless art of generational weavers across India.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/satyabhama_designers?utm_source=qr&igsh=dnJvamZ1djc5MXZl" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center hover:text-gold hover:border-gold transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center hover:text-gold hover:border-gold transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://youtube.com/@satyabhamadesigners?si=oNlgBrYUwfwMTSms" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center hover:text-gold hover:border-gold transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-stone-200 font-medium uppercase tracking-widest mb-6 text-xs">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/collections/readymade-salwar-suits" className="hover:text-gold transition">Readymade Salwar Suits</Link></li>
              <li><Link href="/collections/sarees" className="hover:text-gold transition">Luxury Sarees</Link></li>
              <li><Link href="/try-on" className="hover:text-gold transition flex items-center gap-2">AI Virtual Try-On <span className="bg-gold/20 text-gold text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">New</span></Link></li>
              <li><Link href="/about" className="hover:text-gold transition">Our Story</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-stone-200 font-medium uppercase tracking-widest mb-6 text-xs">Customer Care</h3>
            <ul className="space-y-4">
              <li><Link href="/contact" className="hover:text-gold transition">Contact Us</Link></li>
              <li><Link href="/return-policy" className="hover:text-gold transition">Return & Exchange Policy</Link></li>
              <li><Link href="/shipping" className="hover:text-gold transition">Shipping Information</Link></li>
              <li><Link href="/faqs" className="hover:text-gold transition">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-stone-200 font-medium uppercase tracking-widest mb-6 text-xs">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gold shrink-0 mt-0.5" />
                <span>10-01-14/2, Pushkar Ghat Cir, Mangalavaripeta,<br/>Rajamahendravaram, Andhra Pradesh 533101</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gold shrink-0" />
                <span>+91 6309 055 764</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gold shrink-0" />
                <span>concierge@satyabhama.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} Satyabhama Designers. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-stone-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-stone-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
