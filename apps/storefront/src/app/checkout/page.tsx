'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { loadRazorpay } from '@/lib/razorpay';
import { Shield, Truck, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [shipping, setShipping] = useState({
    name: '', phone: '', email: '',
    address: '', city: '', state: '', pincode: ''
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [orderNumber, setOrderNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');

  // Protect route if cart is empty
  useEffect(() => {
    if (cart.length === 0 && step !== 'success') {
      router.push('/');
    }
  }, [cart, success, router]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleFinalPayment = async () => {
    setLoading(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment automatically
      const mockOrderNumber = 'LUX-' + Math.floor(10000 + Math.random() * 90000);
      setOrderNumber(mockOrderNumber);
      setStep('success');
      clearCart();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
        <CheckCircle size={80} className="text-gold mb-6" />
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 text-center">Order Confirmed</h1>
        <p className="text-stone-400 text-lg mb-2">Thank you for your purchase, {shipping.name}.</p>
        <p className="text-stone-500 mb-8 font-mono">Order Number: {orderNumber}</p>
        
        <button 
          onClick={() => router.push('/')}
          className="border border-gold text-gold px-8 py-3 hover:bg-gold hover:text-black transition-colors uppercase tracking-widest text-sm"
        >
          Return to Collection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <h1 className="text-3xl md:text-4xl font-serif text-white mb-12 border-b border-stone-800 pb-4">
          Secure Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left: Dynamic Form based on Step */}
          <div className="flex-1 order-2 lg:order-1">
            {step === 'shipping' ? (
              <>
                <h2 className="text-xl font-serif text-gold mb-6 flex items-center gap-2">
                  <Truck size={20} /> Shipping Details
                </h2>
                
                <form id="checkout-form" onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Full Name</label>
                      <input required value={shipping.name} onChange={e => setShipping({...shipping, name: e.target.value})} type="text" className="w-full bg-stone-900 border border-stone-800 text-white p-3 rounded focus:border-gold outline-none transition-colors" placeholder="e.g. Aishwarya" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Phone Number</label>
                      <input required value={shipping.phone} onChange={e => setShipping({...shipping, phone: e.target.value})} type="tel" className="w-full bg-stone-900 border border-stone-800 text-white p-3 rounded focus:border-gold outline-none transition-colors" placeholder="+91 63090 55764" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Email Address</label>
                    <input required value={shipping.email} onChange={e => setShipping({...shipping, email: e.target.value})} type="email" className="w-full bg-stone-900 border border-stone-800 text-white p-3 rounded focus:border-gold outline-none transition-colors" placeholder="email@example.com" />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Street Address</label>
                    <textarea required value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} className="w-full bg-stone-900 border border-stone-800 text-white p-3 rounded focus:border-gold outline-none transition-colors min-h-[100px]" placeholder="House/Flat No., Street Name" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">City</label>
                      <input required value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} type="text" className="w-full bg-stone-900 border border-stone-800 text-white p-3 rounded focus:border-gold outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">State</label>
                      <input required value={shipping.state} onChange={e => setShipping({...shipping, state: e.target.value})} type="text" className="w-full bg-stone-900 border border-stone-800 text-white p-3 rounded focus:border-gold outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">PIN Code</label>
                      <input required value={shipping.pincode} onChange={e => setShipping({...shipping, pincode: e.target.value})} type="text" className="w-full bg-stone-900 border border-stone-800 text-white p-3 rounded focus:border-gold outline-none transition-colors" />
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-xl font-serif text-gold mb-6 flex items-center gap-2">
                  <Shield size={20} /> Payment Details
                </h2>
                
                <div className="bg-stone-900 border border-stone-800 rounded p-6 mb-6">
                  <div className="flex gap-4 border-b border-stone-800 pb-4 mb-6">
                    <button 
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex-1 py-3 border-b-2 uppercase tracking-widest text-sm transition-colors ${paymentMethod === 'upi' ? 'border-gold text-gold' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
                    >
                      UPI / QR Code
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 py-3 border-b-2 uppercase tracking-widest text-sm transition-colors ${paymentMethod === 'card' ? 'border-gold text-gold' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
                    >
                      Credit / Debit Card
                    </button>
                  </div>

                  {paymentMethod === 'upi' ? (
                    <div className="flex flex-col items-center">
                      <p className="text-stone-400 mb-4 text-sm">Scan the QR Code with any UPI App (GPay, PhonePe, Paytm)</p>
                      <div className="bg-white p-2 rounded mb-6">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=6309055764@ybl&pn=Satyabhama&cu=INR&am=${cartTotal}&color=000000&bgcolor=ffffff`} alt="UPI QR" className="w-48 h-48" />
                      </div>
                      <div className="w-full text-center text-xs text-stone-500 mb-2">After successful payment on your phone, click complete below.</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Card Number</label>
                        <input type="text" className="w-full bg-stone-950 border border-stone-800 text-white p-3 rounded focus:border-gold outline-none transition-colors" placeholder="**** **** **** ****" />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Expiry (MM/YY)</label>
                          <input type="text" className="w-full bg-stone-950 border border-stone-800 text-white p-3 rounded focus:border-gold outline-none transition-colors" placeholder="MM/YY" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">CVV</label>
                          <input type="password" maxLength={4} className="w-full bg-stone-950 border border-stone-800 text-white p-3 rounded focus:border-gold outline-none transition-colors" placeholder="***" />
                        </div>
                      </div>
                      <div className="text-xs text-stone-500 mt-4 text-center">Your card details are 256-bit securely encrypted.</div>
                    </div>
                  )}
                </div>
                
                <button onClick={() => setStep('shipping')} className="text-stone-400 text-sm hover:text-white uppercase tracking-widest underline decoration-stone-700 underline-offset-4">
                  &larr; Back to Shipping
                </button>
              </>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:w-[400px] order-1 lg:order-2">
            <div className="bg-stone-950 border border-stone-800 p-6 sticky top-28 rounded shadow-xl">
              <h2 className="text-xl font-serif text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover border border-stone-800 rounded" />
                    <div>
                      <h4 className="text-sm text-stone-200">{item.name}</h4>
                      <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-serif text-gold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-800 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm text-stone-400">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-400">
                  <span>Shipping</span>
                  <span className="text-gold italic">Calculated at Payment</span>
                </div>
              </div>

              <div className="border-t border-stone-800 pt-4 flex justify-between items-center mb-6">
                <span className="text-white font-medium uppercase tracking-widest text-sm">Total</span>
                <span className="text-2xl font-serif text-gold">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>

              {step === 'shipping' ? (
                <button 
                  type="submit" 
                  form="checkout-form"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-white text-black font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 transition-colors duration-300 disabled:opacity-70 disabled:cursor-wait"
                >
                  Proceed to Payment <ArrowRight size={18} />
                </button>
              ) : (
                <button 
                  onClick={handleFinalPayment}
                  disabled={loading}
                  className="w-full bg-gold hover:bg-white text-black font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 transition-colors duration-300 disabled:opacity-70 disabled:cursor-wait"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={18} /> Processing...</>
                  ) : (
                    <>Complete Order <CheckCircle size={18} /></>
                  )}
                </button>
              )}
              
              <div className="mt-6 flex items-center justify-center gap-2 text-stone-500 text-xs uppercase tracking-widest">
                <Shield size={14} /> 256-bit Encrypted Checkout
              </div>
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
