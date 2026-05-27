'use client';

import React, { useState } from 'react';
import { Share2, Heart, MessageSquare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for our Trousseau
type TrousseauItem = {
  id: string;
  product: {
    name: string;
    images: string[];
    price: string;
  };
  upvotes: number;
  comments: { author: string; text: string }[];
};

export function TrousseauBuilder({ initialItems = [] }: { initialItems?: TrousseauItem[] }) {
  const [items, setItems] = useState<TrousseauItem[]>(initialItems);
  const [copied, setCopied] = useState(false);

  // Simulated Share Action
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulated Upvote Action (Public Family Feature)
  const handleUpvote = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item
    ));
    // In production: fetch('/api/trousseau/[slug]/upvote', { method: 'POST', body: { itemId: id } })
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-stone-800 pb-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold block mb-3">Bridal Registry</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-100">My Trousseau Board</h1>
          <p className="text-stone-400 text-sm mt-4 max-w-lg leading-relaxed">
            Curate your absolute masterworks. Share this private gallery with family so they can comment and vote on your wedding selections.
          </p>
        </div>
        <button 
          onClick={handleShare}
          className="mt-6 md:mt-0 flex items-center gap-3 bg-stone-900 hover:bg-gold hover:text-bg text-stone-200 border border-stone-700 hover:border-gold px-6 py-3 rounded text-xs uppercase tracking-widest transition-all duration-300"
        >
          <Share2 size={16} className={copied ? "text-emerald-500" : ""} />
          {copied ? "Link Copied" : "Share with Family"}
        </button>
      </div>

      {/* Grid of Items */}
      {items.length === 0 ? (
        <div className="text-center py-24 bg-stone-900/30 rounded border border-stone-800 border-dashed">
          <Heart size={48} className="text-stone-700 mx-auto mb-6" />
          <h3 className="text-xl font-serif text-stone-300 mb-2">Your Trousseau is empty</h3>
          <p className="text-stone-500 text-sm mb-6">Explore our collections and add masterpieces to your board.</p>
          <a href="/#atelier-curations" className="text-gold uppercase tracking-widest text-[10px] font-bold underline underline-offset-4 hover:text-stone-300 transition-colors">
            Explore Atelier Collections
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <motion.div 
              key={item.id} 
              layoutId={item.id}
              className="bg-stone-900/50 border border-stone-800 rounded overflow-hidden group"
            >
              <div className="relative aspect-[3/4]">
                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-bg/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-stone-700">
                  <Heart size={14} className="text-gold" />
                  <span className="text-stone-200 text-xs font-mono">{item.upvotes}</span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-serif text-lg text-stone-200 mb-4">{item.product.name}</h3>
                
                {/* Voting & Comments Action Row */}
                <div className="flex items-center gap-4 pt-4 border-t border-stone-800">
                  <button 
                    onClick={() => handleUpvote(item.id)}
                    className="flex items-center gap-2 text-stone-400 hover:text-gold transition-colors"
                  >
                    <Heart size={16} />
                    <span className="text-xs uppercase tracking-wider">Vote</span>
                  </button>
                  <button className="flex items-center gap-2 text-stone-400 hover:text-gold transition-colors">
                    <MessageSquare size={16} />
                    <span className="text-xs uppercase tracking-wider">{item.comments.length} Comments</span>
                  </button>
                </div>

                {/* Latest Comment Snippet */}
                {item.comments.length > 0 && (
                  <div className="mt-4 bg-black/40 p-3 rounded border border-stone-800/50">
                    <span className="text-[10px] text-gold font-bold uppercase tracking-wider">{item.comments[0].author}</span>
                    <p className="text-stone-400 text-xs mt-1 italic">"{item.comments[0].text}"</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
