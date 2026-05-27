'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout'); // We will build this page next
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-stone-950 border-l border-stone-800 shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-800 bg-stone-900/50">
              <h2 className="text-xl font-serif text-gold flex items-center gap-2">
                <ShoppingBag size={20} /> Your Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-stone-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-500 opacity-60">
                  <ShoppingBag size={48} className="mb-4" />
                  <p className="font-serif text-lg tracking-widest uppercase">Cart is Empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center bg-stone-900/40 p-3 rounded border border-stone-800/50">
                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded border border-stone-800" />
                    
                    <div className="flex-1">
                      <h3 className="text-stone-200 font-medium leading-tight mb-1">{item.name}</h3>
                      <p className="text-gold font-serif mb-3">₹{item.price.toLocaleString('en-IN')}</p>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-stone-700 rounded bg-stone-950">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 text-stone-400 hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-stone-400 hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-stone-500 hover:text-red-400 underline decoration-stone-500 hover:decoration-red-400 underline-offset-2 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-stone-800 p-6 bg-stone-950">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-stone-400 uppercase tracking-widest text-sm">Subtotal</span>
                  <span className="text-2xl font-serif text-white">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                
                <p className="text-xs text-stone-500 text-center mb-4">Taxes and shipping calculated at checkout.</p>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-gold hover:bg-white text-black font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 transition-colors duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
