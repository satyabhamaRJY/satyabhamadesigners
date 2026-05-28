'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { catalog } from '@/lib/mockCatalog';
import { Star, Sparkles, ShoppingBag, Video, X, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { UpiCheckoutModal } from '@/components/UpiCheckoutModal';

export default function ProductDetailsPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const product = catalog.find(p => p.id === id) || catalog[0];
  
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  
  // Checkout State
  const [checkoutProduct, setCheckoutProduct] = useState<{name: string, price: number} | null>(null);

  // Video Consultation State
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
      const message = `Hello Satyabhama Designers,\n\nI would like to request a White-Glove Video Consultation for the *${product.name}*.\n\n*Name:* ${formData.name}\n*Platform:* WhatsApp Video\n*Appointment Request:* ${formData.timeSlot}\n\nPlease confirm my appointment.`;
      const waUrl = `https://wa.me/916309055764?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    } else {
      console.log('Consultation Request:', { ...formData, product: product.name });
    }

    setFormSubmitted(true);
    setTimeout(() => {
      setShowConsultModal(false);
      setFormSubmitted(false);
      setFormData({ name: '', countryCode: '+91', whatsapp: '', platform: 'whatsapp', timeSlot: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          
          {/* Images */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-24 rounded border overflow-hidden ${selectedImage === img ? 'border-gold' : 'border-stone-800'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
            <div className="relative flex-1 aspect-[3/4] rounded-lg overflow-hidden border border-stone-800 bg-stone-900">
              <Image src={selectedImage} alt={product.name} fill className="object-cover" />
              <button className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md text-gold border border-gold/30 hover:bg-gold hover:text-black px-4 py-3 rounded-full text-xs font-serif tracking-widest uppercase transition-colors shadow-heavy flex items-center gap-2">
                <Sparkles size={16} /> Virtual Try-On
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col pt-4">
            <h1 className="text-3xl md:text-4xl font-serif text-stone-100 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-800">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} size={16} className={star <= Math.floor(product.rating) ? "text-gold fill-gold" : "text-stone-700"} />
                ))}
              </div>
              <span className="text-stone-400 text-sm hover:text-gold cursor-pointer transition-colors" onClick={() => setActiveTab('reviews')}>
                {product.reviews} Reviews
              </span>
            </div>

            <div className="mb-8">
              <div className="text-2xl font-serif text-gold font-semibold flex items-center gap-3">
                ₹{product.price.toLocaleString()}
                {product.compareAtPrice && (
                  <span className="text-stone-500 text-base line-through font-normal">₹{product.compareAtPrice.toLocaleString()}</span>
                )}
              </div>
              <p className="text-stone-500 text-xs mt-1 uppercase tracking-widest">Inclusive of all taxes</p>
            </div>

            <div className="space-y-4 mb-10 text-sm text-stone-300">
              <div className="flex"><span className="w-24 text-stone-500">Fabric:</span> <span>{product.fabric}</span></div>
              <div className="flex"><span className="w-24 text-stone-500">Work:</span> <span>{product.work}</span></div>
              <div className="flex"><span className="w-24 text-stone-500">Occasion:</span> <span>{product.occasion}</span></div>
              <div className="flex"><span className="w-24 text-stone-500">Color:</span> <span>{product.color}</span></div>
            </div>

            <button 
              onClick={() => setCheckoutProduct({ name: product.name, price: product.price })}
              className="w-full bg-gold text-black font-bold uppercase tracking-widest py-4 rounded hover:bg-white transition-colors flex items-center justify-center gap-2 mb-4"
            >
              <ShoppingBag size={18} /> Buy Now (UPI)
            </button>
            
            <button 
              onClick={() => setShowConsultModal(true)}
              className="w-full bg-transparent border border-gold text-gold font-bold uppercase tracking-widest py-4 rounded hover:bg-gold/10 transition-colors flex items-center justify-center gap-2"
            >
              <Video size={18} /> Book a Video Consultation
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-stone-800 pt-12">
          <div className="flex gap-8 border-b border-stone-800 mb-8">
            <button 
              className={`pb-4 text-sm uppercase tracking-widest font-medium transition-colors ${activeTab === 'details' ? 'text-gold border-b-2 border-gold' : 'text-stone-500 hover:text-stone-300'}`}
              onClick={() => setActiveTab('details')}
            >
              Product Details
            </button>
            <button 
              className={`pb-4 text-sm uppercase tracking-widest font-medium transition-colors ${activeTab === 'reviews' ? 'text-gold border-b-2 border-gold' : 'text-stone-500 hover:text-stone-300'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Customer Reviews ({product.reviews})
            </button>
          </div>

          <div className="text-stone-300 leading-relaxed font-light min-h-[300px]">
            {activeTab === 'details' && (
              <div className="max-w-3xl">
                <p className="mb-4">
                  Experience the pinnacle of luxury with our {product.name}. Carefully handwoven by generational artisans, this piece features authentic {product.work.toLowerCase()} detailing on premium {product.fabric.toLowerCase()}.
                </p>
                <p>
                  Perfect for {product.occasion.toLowerCase()} celebrations, it blends traditional craftsmanship with modern elegance. The set comes complete and ready to wear, ensuring you look breathtaking at your next special event.
                </p>
                <ul className="list-disc pl-5 mt-6 space-y-2 text-stone-400">
                  <li>100% Authentic {product.fabric}</li>
                  <li>Hand-crafted {product.work}</li>
                  <li>Dry clean only</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8 max-w-3xl">
                <div className="flex items-center gap-6 bg-stone-900/50 p-6 rounded-lg border border-stone-800">
                  <div className="text-5xl font-serif text-gold">{product.rating.toFixed(1)}</div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} size={16} className={star <= Math.floor(product.rating) ? "text-gold fill-gold" : "text-stone-700"} />
                      ))}
                    </div>
                    <div className="text-stone-400 text-sm">Based on {product.reviews} reviews</div>
                  </div>
                </div>

                {/* Mock Reviews List */}
                <div className="space-y-6">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="border-b border-stone-800 pb-6 last:border-0">
                      <div className="flex items-center gap-1 mb-2">
                        {[1,2,3,4,5].map(star => <Star key={star} size={12} className="text-gold fill-gold" />)}
                      </div>
                      <h4 className="text-stone-200 font-medium mb-1">Absolutely Gorgeous!</h4>
                      <p className="text-stone-400 text-sm mb-3">The {product.fabric.toLowerCase()} is so soft and the {product.work.toLowerCase()} is just stunning in person. It fit perfectly and I received so many compliments.</p>
                      <div className="text-stone-500 text-xs">Verified Buyer • 2 weeks ago</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Video Consultation Modal */}
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
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Satyabhama+Video+Consultation&details=White-Glove+Viewing+of+${encodeURIComponent(product.name)}&dates=${new Date(formData.timeSlot).toISOString().replace(/-|:|\.\d\d\d/g,"")}/${new Date(new Date(formData.timeSlot).getTime() + 30*60000).toISOString().replace(/-|:|\.\d\d\d/g,"")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-6 py-3 border border-stone-600 text-stone-300 rounded hover:bg-stone-800 transition-colors text-sm uppercase tracking-widest flex items-center gap-2"
                >
                  Add to Google Calendar
                </a>
              </div>
            ) : (
              <div className="p-8">
                <h3 className="text-2xl font-serif text-gold mb-2">White-Glove Consultation</h3>
                <p className="text-stone-400 text-sm mb-6">
                  Book a private video viewing of the {product.name} with our expert stylists.
                </p>

                <form onSubmit={handleConsultSubmit} className="space-y-4">
                  {/* Hidden Fields for Context */}
                  <input type="hidden" name="productName" value={product.name} />
                  <input type="hidden" name="productSku" value={product.sku} />

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
                        placeholder="98765 43210"
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
      {checkoutProduct && (
        <UpiCheckoutModal 
          productName={checkoutProduct.name}
          price={checkoutProduct.price}
          onClose={() => setCheckoutProduct(null)}
        />
      )}

      <Footer />
    </div>
  );
}
