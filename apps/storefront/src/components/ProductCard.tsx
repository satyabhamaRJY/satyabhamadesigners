'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Sparkles, Star } from 'lucide-react';
import { Product } from '@/lib/mockCatalog';

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group flex flex-col bg-stone-950 border border-stone-800 rounded-lg overflow-hidden transition-all duration-300 hover:border-gold/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-900">
        <Image
          src={isHovered && product.images.length > 1 ? product.images[1] : product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isBestseller && (
            <span className="bg-gold text-black text-[10px] font-bold tracking-widest px-2 py-1 uppercase rounded-sm">
              Bestseller
            </span>
          )}
          {product.compareAtPrice && (
            <span className="bg-red-900/90 text-white text-[10px] font-bold tracking-widest px-2 py-1 uppercase rounded-sm">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-stone-300 hover:text-red-500 hover:bg-black/80 transition-colors backdrop-blur-sm">
          <Heart size={16} />
        </button>

        {/* Try On Button Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 transform transition-transform duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          <button className="w-full flex items-center justify-center gap-2 bg-black/80 backdrop-blur-md text-gold border border-gold/30 hover:bg-gold hover:text-black py-3 rounded-md text-xs font-serif tracking-widest uppercase transition-colors">
            <Sparkles size={14} /> AI Try-On
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={star <= Math.floor(product.rating) ? "text-gold fill-gold" : "text-stone-700"} size={12} />
          ))}
          <span className="text-stone-400 text-xs">({product.reviews})</span>
        </div>
        
        <Link href={`/product/${product.id}`} className="text-stone-200 font-serif text-sm tracking-wide hover:text-gold transition-colors line-clamp-2 mb-2">
          {product.name}
        </Link>
        
        <div className="mt-auto flex items-end gap-2">
          <span className="text-gold font-medium">₹{product.price.toLocaleString()}</span>
          {product.compareAtPrice && (
            <span className="text-stone-500 text-xs line-through mb-[2px]">₹{product.compareAtPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
