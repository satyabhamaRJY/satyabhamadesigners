import React, { useEffect, useState } from 'react';
import { PlayCircle, ShieldCheck, Sparkles, Droplets } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function DigitalSareeCard({ sku }: { sku: string }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/catalog/products/barcode/${sku}`);
        const data = await res.json();
        if (data.success) setProduct(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [sku]);

  if (loading) return <div className="min-h-screen bg-stone-950 flex items-center justify-center text-amber-500 font-serif">Loading Heritage...</div>;
  if (!product) return <div className="min-h-screen bg-stone-950 flex items-center justify-center text-red-400 font-serif">Saree not found</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e7e5e4] font-sans pb-16">
      <header className="py-6 text-center border-b border-stone-800">
        <h1 className="text-2xl font-serif text-amber-500 tracking-[0.2em] uppercase">Satyabhama</h1>
        <p className="text-stone-500 text-xs tracking-[0.3em] uppercase mt-1">Digital Authenticity Card</p>
      </header>

      <div className="max-w-md mx-auto p-4">
        {/* Hero Image */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl mb-8 border border-stone-800">
          <img src={product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'} alt={product.name} className="w-full h-[500px] object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 pt-24">
            <h2 className="text-3xl font-serif text-amber-100 mb-1">{product.name}</h2>
            <p className="text-stone-300 font-mono text-sm tracking-wider">{product.sku}</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-stone-900 rounded-lg p-6 mb-6 border border-stone-800">
          <h3 className="text-amber-500 font-serif text-lg mb-3 flex items-center gap-2"><Sparkles size={18} /> Masterpiece Details</h3>
          <p className="text-stone-300 text-sm leading-relaxed">{product.description}</p>
        </div>

        {/* Authenticity */}
        <div className="bg-stone-900 rounded-lg p-6 mb-6 border border-stone-800">
          <h3 className="text-amber-500 font-serif text-lg mb-3 flex items-center gap-2"><ShieldCheck size={18} /> Authenticity & Materials</h3>
          <ul className="text-sm text-stone-300 space-y-2">
            <li><strong className="text-stone-400">Category:</strong> {product.category?.name || 'Silk'}</li>
            <li><strong className="text-stone-400">Weight:</strong> {product.weight}g</li>
            <li><strong className="text-stone-400">Zari:</strong> Authentic Tested Zari</li>
            <li><strong className="text-stone-400">Origin:</strong> Handwoven in India</li>
          </ul>
        </div>

        {/* Care Instructions */}
        <div className="bg-stone-900 rounded-lg p-6 mb-6 border border-stone-800">
          <h3 className="text-amber-500 font-serif text-lg mb-3 flex items-center gap-2"><Droplets size={18} /> Care Instructions</h3>
          <ul className="text-sm text-stone-300 space-y-2 list-disc list-inside">
            <li>Dry clean only.</li>
            <li>Do not spray perfume directly on the zari.</li>
            <li>Store in a breathable cotton or muslin bag.</li>
            <li>Air out occasionally to preserve the silk fibers.</li>
          </ul>
        </div>

        {/* Video Placeholder */}
        <div className="bg-stone-900 rounded-lg p-6 border border-stone-800 text-center flex flex-col items-center justify-center">
          <PlayCircle size={48} className="text-stone-600 mb-3" />
          <h3 className="text-stone-400 font-serif text-lg mb-1">Drape & Styling Video</h3>
          <p className="text-stone-500 text-xs">Video demonstration coming soon</p>
        </div>
      </div>
    </div>
  );
}
