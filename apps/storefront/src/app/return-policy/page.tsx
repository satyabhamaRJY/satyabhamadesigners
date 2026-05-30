import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl md:text-5xl font-serif text-gold tracking-widest text-center mb-16">Return & Exchange Policy</h1>
        
        <div className="space-y-12 text-stone-300 font-light leading-relaxed">
          <section>
            <h2 className="text-xl font-serif text-stone-200 mb-4 uppercase tracking-widest">Our Commitment to Quality</h2>
            <p>
              At Satyabhama Designers, every garment undergoes rigorous quality checks before it is dispatched from our atelier. Due to the handcrafted nature of our products, slight variations in color, texture, or weave are considered hallmarks of authentic handloom artistry, not defects.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-stone-200 mb-4 uppercase tracking-widest">Strict No Return & Exchange Policy</h2>
            <p className="mb-4">
              To maintain the highest standards of hygiene and preserve the pristine sanctity of our handcrafted heritage weaves, 
              <strong className="text-stone-200"> all sarees, garments, and items sold by Satyabhama Designers are strictly non-returnable and non-exchangeable once they have been delivered.</strong>
            </p>
            <ul className="list-disc pl-5 space-y-3 text-stone-400">
              <li>Every piece you receive is untouched and exclusively yours. We do not restock or resell returned garments under any circumstances.</li>
              <li>We highly encourage our patrons to thoroughly review product descriptions, detailed photographs, and measurements before placing an order.</li>
              <li>Customized, made-to-measure, and altered garments are also entirely final sale.</li>
              <li>In the rare event that a product is delivered with a verified manufacturing defect or damage in transit, please contact our concierge team at <strong className="text-stone-200">concierge@satyabhama.com</strong> within 24 hours of delivery with unboxing videos and photographic evidence for a resolution.</li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
