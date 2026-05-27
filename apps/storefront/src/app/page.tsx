'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight, Star, Truck, Shield, Clock, X, CheckCircle, Volume2, VolumeX } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Scene from '@/components/3d/Scene';
import { useRouter } from 'next/navigation';
import { catalog } from '@/lib/mockCatalog';
import { useCart } from '@/context/CartContext';

export default function Home() {
  const router = useRouter();
  const { addToCart } = useCart();
  const heroRef = useRef<HTMLElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Guarantee sound stops when navigating away
  useEffect(() => {
    return () => {
      setIsMuted(true);
    };
  }, []);

  // VTO Video Consultation State
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+91',
    whatsapp: '',
    platform: 'whatsapp',
    timeSlot: ''
  });

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.platform === 'whatsapp') {
      const message = `Hello Satyabhama Designers,\n\nI would like to request a Virtual Try-On Video Consultation.\n\n*Name:* ${formData.name}\n*Platform:* WhatsApp Video\n*Appointment Request:* ${formData.timeSlot}\n\nPlease confirm my appointment.`;
      const waUrl = `https://wa.me/916309055764?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    } else {
      console.log('Homepage VTO Consultation Request:', { ...formData });
    }

    setFormSubmitted(true);
    setTimeout(() => {
      setShowConsultModal(false);
      setFormSubmitted(false);
      setFormData({ name: '', countryCode: '+91', whatsapp: '', platform: 'whatsapp', timeSlot: '' });
    }, 3000);
  };

  return (
    <div className="relative min-h-screen bg-bg pb-20 md:pb-0">
      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Hero Section */}
      <section ref={heroRef} className="relative min-h-screen bg-black overflow-hidden border-b border-border flex items-center">
        
        {/* Cinematic Video Background */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted={isMuted} 
            playsInline 
            className="w-full h-full object-cover object-[center_25%] md:object-[center_20%] opacity-70"
          >
            {/* Replace this URL with your actual saree video file in the /public folder (e.g. /hero-video.mp4) */}
            <source src="/hero-video.mp4.mp4" type="video/mp4" />
          </video>
          {/* Gradient Overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />
          
          {/* Sound Toggle Button */}
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-8 right-8 z-30 p-3 rounded-full bg-black/50 border border-stone-700 text-stone-300 hover:text-gold hover:border-gold transition-colors backdrop-blur-md"
            title={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>

        {/* Foreground Text */}
        <div className="relative z-20 flex flex-col justify-end pb-24 md:pb-32 px-8 md:px-20 h-full max-w-2xl mt-auto">
          <div className="mb-4 inline-block">
            <span className="text-gold tracking-widest uppercase text-xs border border-gold/30 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              The Royal Collection
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-6 drop-shadow-2xl">
            Woven in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-gold to-yellow-600">Gold.</span><br />
            Draped in Heritage.
          </h1>
          
          <p className="text-stone-300 text-sm md:text-base mb-8 font-light max-w-xl leading-relaxed drop-shadow-md">
            Experience the divine craftsmanship of authentic Indian handlooms. Each saree is a masterpiece of tradition, meticulously handwoven for the modern royalty.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-gold text-black px-6 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors text-xs shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] w-fit">
              Explore Collection
            </button>
            <button 
              onClick={() => setShowConsultModal(true)}
              className="border border-stone-500 text-stone-200 px-6 py-3 font-bold uppercase tracking-widest hover:border-gold hover:text-gold transition-colors text-xs bg-black/40 backdrop-blur-md w-fit"
            >
              Virtual Try-On (Video)
            </button>
          </div>
        </div>
      </section>

      {/* 3. Trust Indicators */}
      <section className="bg-stone-950 border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-stone-800">
            <div className="flex flex-col items-center justify-center p-4">
              <Shield className="text-gold mb-3" size={24} />
              <h3 className="text-stone-200 font-serif mb-1">Authenticity Guaranteed</h3>
              <p className="text-stone-500 text-sm">Silk Mark Certified handlooms</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <Truck className="text-gold mb-3" size={24} />
              <h3 className="text-stone-200 font-serif mb-1">Secure Global Shipping</h3>
              <p className="text-stone-500 text-sm">Insured luxury delivery</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <Clock className="text-gold mb-3" size={24} />
              <h3 className="text-stone-200 font-serif mb-1">White-Glove Support</h3>
              <p className="text-stone-500 text-sm">24/7 personal styling</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Collections (Product Grid) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-100 mb-2">Curated Masterpieces</h2>
            <p className="text-stone-400 font-light">The finest selections from our weavers</p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-gold hover:text-white transition-colors text-sm uppercase tracking-widest font-medium">
            View All <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {catalog.map((p) => (
            <div 
              key={p.id} 
              className="group cursor-pointer"
              onClick={() => router.push(`/product/${p.id}`)}
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-stone-900 rounded border border-stone-800">
                <img 
                  src={p.images[0]} 
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Quick Add Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      id: p.id,
                      name: p.name,
                      price: p.price,
                      quantity: 1,
                      image: p.images[0]
                    });
                  }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 backdrop-blur-md text-gold border border-gold/30 hover:bg-gold hover:text-black px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 w-[80%] justify-center"
                >
                  <ShoppingBag size={14} /> Quick Add
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-stone-500 text-xs uppercase tracking-widest mb-2 font-mono">{p.category}</p>
                <h3 className="text-xl font-serif text-stone-200 mb-2 group-hover:text-gold transition-colors">{p.name}</h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star size={12} className="text-gold fill-gold" />
                  <span className="text-stone-400 text-xs">{p.rating} ({p.reviews})</span>
                </div>
                <p className="text-gold font-medium">₹{p.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        
        <button className="mt-12 md:hidden w-full border border-stone-800 text-stone-300 py-4 uppercase tracking-widest text-sm hover:bg-stone-900 transition-colors">
          View All Masterpieces
        </button>
      </section>

      {/* 5. The Heritage (Brand Story) */}
      <section className="border-t border-border bg-stone-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden bg-stone-900 border border-stone-800 rounded">
              <img 
                src="https://images.unsplash.com/photo-1596455607563-ad6193f76b17?auto=format&fit=crop&w=1200&q=80" 
                alt="Weaving loom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            
            <div className="flex flex-col justify-center">
              <span className="text-gold uppercase tracking-widest text-sm mb-4">Our Heritage</span>
              <h2 className="text-4xl md:text-5xl font-serif text-stone-100 mb-8 leading-tight">
                Generations of <br/><span className="text-stone-400 italic">Master Weavers</span>
              </h2>
              <p className="text-stone-400 leading-relaxed mb-6 font-light text-lg">
                Satyabhama Designers partners directly with authentic weaver clusters in Kanchipuram, Varanasi, and Chanderi. By eliminating middlemen, we ensure our artisans receive fair compensation while bringing you unadulterated luxury.
              </p>
              <p className="text-stone-400 leading-relaxed mb-10 font-light text-lg">
                Every thread tells a story of mythological grandeur, painstakingly crafted using techniques passed down through centuries.
              </p>
              <button className="self-start text-stone-100 border-b border-gold pb-1 hover:text-gold transition-colors flex items-center gap-2 uppercase tracking-widest text-sm">
                Discover Our Story <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Try-On Video Consultation Modal */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-stone-950 border border-stone-800 rounded-lg w-full max-w-md overflow-hidden shadow-2xl relative">
            {/* Close Button */}
            <button 
              onClick={() => setShowConsultModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {formSubmitted ? (
              <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle size={64} className="text-gold" />
                <h3 className="text-2xl font-serif text-white">Request Sent</h3>
                <p className="text-stone-400">
                  Thank you, {formData.name}. We have forwarded your request for {new Date(formData.timeSlot).toLocaleString()}.
                </p>
                <a 
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Satyabhama+Video+Consultation&details=Virtual+Try-On+Appointment&dates=${new Date(formData.timeSlot).toISOString().replace(/-|:|\.\d\d\d/g,"")}/${new Date(new Date(formData.timeSlot).getTime() + 30*60000).toISOString().replace(/-|:|\.\d\d\d/g,"")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-6 py-3 border border-stone-600 text-stone-300 rounded hover:bg-stone-800 transition-colors text-sm uppercase tracking-widest flex items-center gap-2"
                >
                  Add to Google Calendar
                </a>
              </div>
            ) : (
              <div className="p-8">
                <h3 className="text-2xl font-serif text-gold mb-2">Book Virtual Try-On</h3>
                <p className="text-stone-400 text-sm mb-6">
                  Schedule a live video consultation with our stylists.
                </p>

                <form onSubmit={handleConsultSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-serif uppercase tracking-widest text-stone-400 mb-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-stone-900 border border-stone-800 text-white px-4 py-3 rounded focus:outline-none focus:border-gold transition-colors"
                      placeholder="e.g. Aishwarya"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif uppercase tracking-widest text-stone-400 mb-1">WhatsApp Number</label>
                    <div className="flex gap-2">
                      <select 
                        value={formData.countryCode}
                        onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                        className="bg-stone-900 border border-stone-800 text-white px-3 py-3 rounded focus:outline-none focus:border-gold w-24"
                      >
                        <option value="+91">+91 (IN)</option>
                        <option value="+1">+1 (US)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+971">+971 (UAE)</option>
                      </select>
                      <input 
                        required
                        type="tel" 
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                        className="flex-1 bg-stone-900 border border-stone-800 text-white px-4 py-3 rounded focus:outline-none focus:border-gold transition-colors"
                        placeholder="63090 55764"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-serif uppercase tracking-widest text-stone-400 mb-2">Preferred Platform</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.platform === 'whatsapp' ? 'border-gold bg-gold/20' : 'border-stone-600 group-hover:border-stone-400'}`}>
                          {formData.platform === 'whatsapp' && <div className="w-2 h-2 rounded-full bg-gold" />}
                        </div>
                        <span className="text-stone-300 text-sm">WhatsApp Video</span>
                        <input type="radio" name="platform" value="whatsapp" className="hidden" checked={formData.platform === 'whatsapp'} onChange={(e) => setFormData({...formData, platform: e.target.value})} />
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.platform === 'zoom' ? 'border-gold bg-gold/20' : 'border-stone-600 group-hover:border-stone-400'}`}>
                          {formData.platform === 'zoom' && <div className="w-2 h-2 rounded-full bg-gold" />}
                        </div>
                        <span className="text-stone-300 text-sm">Zoom</span>
                        <input type="radio" name="platform" value="zoom" className="hidden" checked={formData.platform === 'zoom'} onChange={(e) => setFormData({...formData, platform: e.target.value})} />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-serif uppercase tracking-widest text-stone-400 mb-1">Select Date & Time</label>
                    <input 
                      required
                      type="datetime-local" 
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                      className="w-full bg-stone-900 border border-stone-800 text-white px-4 py-3 rounded focus:outline-none focus:border-gold transition-colors [color-scheme:dark]"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gold text-black font-bold uppercase tracking-widest py-4 rounded hover:bg-white transition-colors mt-6"
                  >
                    Request Consultation
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* UPI Direct Payment Checkout Modal */}
      {/* Replaced by global checkout route */}

      <Footer />
    </div>
  );
}
