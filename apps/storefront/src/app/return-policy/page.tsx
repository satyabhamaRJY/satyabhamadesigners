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
            <h2 className="text-xl font-serif text-stone-200 mb-4 uppercase tracking-widest">Returns & Exchanges</h2>
            <ul className="list-disc pl-5 space-y-3 text-stone-400">
              <li>We accept returns or exchanges within <strong className="text-stone-200">7 days</strong> of delivery, provided the item is unworn, unwashed, and retains all original tags and packaging.</li>
              <li>To initiate a return, please contact our concierge team at <strong className="text-stone-200">concierge@satyabhama.com</strong> with your order number.</li>
              <li>Customized, made-to-measure, and altered garments are strictly <strong className="text-stone-200">non-returnable</strong> and <strong className="text-stone-200">non-refundable</strong>.</li>
              <li>Items purchased during promotional sales or using discount codes are eligible for exchange only, not refunds.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-stone-200 mb-4 uppercase tracking-widest">Refund Process</h2>
            <p>
              Once your returned item is received and inspected by our quality team, we will notify you of the approval or rejection of your refund. Approved refunds will be processed within 5-7 business days to the original method of payment. Shipping costs are non-refundable and will be deducted from your total refund amount.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
