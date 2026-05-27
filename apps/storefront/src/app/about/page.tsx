import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl md:text-5xl font-serif text-gold tracking-widest text-center mb-8">Our Story</h1>
        
        <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-12">
          <img 
            src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1200&auto=format&fit=crop" 
            alt="Weavers working"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <div className="space-y-8 text-stone-300 leading-relaxed font-light text-lg">
          <p>
            <strong className="text-gold font-serif text-xl font-normal">Born in August 2023</strong>, Satyabhama Designers emerged from a deep-rooted passion to preserve the intricate and timeless art of Indian handloom weaving. What began as a humble initiative to connect master weavers directly with connoisseurs of luxury ethnic wear has rapidly blossomed into a premier destination for authentic, heritage-rich attire.
          </p>
          
          <p>
            Our journey started with a simple belief: that every thread tells a story. From the opulent Kanjeevarams of the south to the regal Banarasis of the north, we travel to the heart of India's textile clusters. We spend hours, sometimes days, sitting with generational artisans, understanding the soul they pour into the loom.
          </p>

          <p>
            Today, Satyabhama Designers stands not just as a boutique, but as a sanctuary for slow fashion. We celebrate the imperfections of hand-spun yarn, the authentic glimmer of real zari, and the breathtaking beauty of designs that have been passed down through centuries.
          </p>

          <div className="border-l-2 border-gold pl-6 py-2 my-10 italic text-stone-400 font-serif text-xl">
            "To wear a Satyabhama creation is to drape yourself in a piece of history, crafted meticulously by hands that have inherited the rhythm of the loom."
          </div>

          <p>
            We are committed to ethical sourcing, ensuring our weavers receive the respect and compensation they truly deserve. When you choose Satyabhama, you are not just acquiring a garment; you are sustaining a legacy.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
