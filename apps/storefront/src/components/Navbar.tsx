'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();

  // Don't show public navbar on admin routes
  if (pathname?.startsWith('/admin')) return null;

  const isHome = pathname === '/';

  return (
    <header className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isHome ? 'bg-gradient-to-b from-black/80 to-transparent pt-2' : 'bg-stone-950 border-b border-stone-800'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-xl md:text-2xl font-serif tracking-widest text-gold italic font-semibold group">
            <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center overflow-visible transition-transform duration-500 group-hover:scale-105">
              <div 
                className="w-full h-full bg-gradient-to-tr from-amber-200 via-gold to-yellow-600 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                style={{
                  WebkitMaskImage: 'url(/logo.png)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: 'url(/logo.png)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center'
                }}
              />
            </div>
            SATYABHAMA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-stone-300 font-medium">
            <Link href="/" className={`${isHome ? 'text-gold' : 'hover:text-gold'} transition`}>Home</Link>
            <Link href="/collections/readymade-salwar-suits" className="hover:text-gold transition">Salwar Suits</Link>
            <Link href="/collections/sarees" className="hover:text-gold transition">Luxury Sarees</Link>
            <Link href="/collections/lehengas" className="hover:text-gold transition">Lehengas</Link>
            <Link href="/about" className="hover:text-gold transition">Our Story</Link>
            <Link href="/contact" className="hover:text-gold transition">Contact</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link href="/try-on" className="hidden md:flex items-center gap-2 border border-stone-700 hover:border-gold px-4 py-2 rounded text-[10px] uppercase tracking-widest text-stone-200 hover:text-gold transition duration-300">
              <Sparkles size={14} className="text-gold" /> Try-On
            </Link>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-300 hover:text-gold transition"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-stone-300 hover:text-gold transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-stone-950 border-t border-stone-800 absolute top-full left-0 w-full shadow-2xl">
          <nav className="flex flex-col px-6 py-4 gap-4 text-sm uppercase tracking-widest text-stone-300">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-stone-800 hover:text-gold">Home</Link>
            <Link href="/collections/readymade-salwar-suits" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-stone-800 hover:text-gold">Salwar Suits</Link>
            <Link href="/collections/sarees" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-stone-800 hover:text-gold">Luxury Sarees</Link>
            <Link href="/collections/lehengas" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-stone-800 hover:text-gold">Bridal Lehengas</Link>
            <Link href="/try-on" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-stone-800 hover:text-gold flex items-center gap-2"><Sparkles size={14} className="text-gold"/> AI Try-On</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-stone-800 hover:text-gold">Our Story</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-gold">Contact Us</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
