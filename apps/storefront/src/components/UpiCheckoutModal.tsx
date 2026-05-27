'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Smartphone, Truck, CreditCard } from 'lucide-react';

interface UpiCheckoutModalProps {
  productName: string;
  price: number;
  onClose: () => void;
}

export function UpiCheckoutModal({ productName, price, onClose }: UpiCheckoutModalProps) {
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [utr, setUtr] = useState('');
  
  const [shippingData, setShippingData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: ''
  });

  // Hardcoded UPI Details
  const vpa = '6309055764@ybl';
  const merchantName = 'Satyabhama Designers';
  
  // Format the exact UPI Intent URI string
  const upiUri = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(merchantName)}&cu=INR&am=${price}`;
  
  // Generate a QR Code using an external reliable API that requires zero dependencies
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}&color=000000&bgcolor=ffffff`;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr.trim()) return;
    
    console.log('Order Placed:', { productName, price, shippingData, utr });
    setStep('success');
    
    setTimeout(() => {
      onClose();
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-stone-950 border border-gold/30 rounded-lg w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.15)] relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Progress Bar */}
        {step !== 'success' && (
          <div className="flex border-b border-stone-800">
            <div className={`flex-1 py-3 text-center text-xs uppercase tracking-widest font-serif flex items-center justify-center gap-2 ${step === 'shipping' ? 'bg-gold/10 text-gold border-b-2 border-gold' : 'text-stone-500'}`}>
              <Truck size={14} /> Shipping
            </div>
            <div className={`flex-1 py-3 text-center text-xs uppercase tracking-widest font-serif flex items-center justify-center gap-2 ${step === 'payment' ? 'bg-gold/10 text-gold border-b-2 border-gold' : 'text-stone-500'}`}>
              <CreditCard size={14} /> Payment
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle size={64} className="text-gold" />
            <h3 className="text-2xl font-serif text-white">Order Confirmed</h3>
            <p className="text-stone-400">
              Thank you, {shippingData.name}! We have received your UTR: <span className="text-gold font-mono">{utr}</span>.
            </p>
            <p className="text-stone-400 text-sm">
              Your order for <strong className="text-stone-200 font-serif">{productName}</strong> will be shipped to {shippingData.city} soon.
            </p>
          </div>
        )}

        {step === 'shipping' && (
          <div className="p-8">
            <h3 className="text-2xl font-serif text-gold mb-1">Shipping Details</h3>
            <p className="text-stone-400 text-sm mb-6">
              Where should we send your {productName}?
            </p>

            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-serif uppercase tracking-widest text-stone-400 mb-1">Full Name</label>
                <input required type="text" value={shippingData.name} onChange={(e) => setShippingData({...shippingData, name: e.target.value})} className="w-full bg-stone-900 border border-stone-800 text-white px-4 py-3 rounded focus:outline-none focus:border-gold transition-colors" placeholder="Full Name" />
              </div>
              <div>
                <label className="block text-xs font-serif uppercase tracking-widest text-stone-400 mb-1">Phone Number</label>
                <input required type="tel" value={shippingData.phone} onChange={(e) => setShippingData({...shippingData, phone: e.target.value})} className="w-full bg-stone-900 border border-stone-800 text-white px-4 py-3 rounded focus:outline-none focus:border-gold transition-colors" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block text-xs font-serif uppercase tracking-widest text-stone-400 mb-1">Street Address</label>
                <textarea required value={shippingData.address} onChange={(e) => setShippingData({...shippingData, address: e.target.value})} className="w-full bg-stone-900 border border-stone-800 text-white px-4 py-3 rounded focus:outline-none focus:border-gold transition-colors min-h-[80px]" placeholder="House/Flat No., Street Name" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-serif uppercase tracking-widest text-stone-400 mb-1">City</label>
                  <input required type="text" value={shippingData.city} onChange={(e) => setShippingData({...shippingData, city: e.target.value})} className="w-full bg-stone-900 border border-stone-800 text-white px-4 py-3 rounded focus:outline-none focus:border-gold transition-colors" placeholder="City" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-serif uppercase tracking-widest text-stone-400 mb-1">PIN Code</label>
                  <input required type="text" value={shippingData.pinCode} onChange={(e) => setShippingData({...shippingData, pinCode: e.target.value})} className="w-full bg-stone-900 border border-stone-800 text-white px-4 py-3 rounded focus:outline-none focus:border-gold transition-colors" placeholder="PIN Code" />
                </div>
              </div>

              <button type="submit" className="w-full bg-gold text-black font-bold uppercase tracking-widest py-4 rounded hover:bg-white transition-colors mt-4">
                Continue to Payment
              </button>
            </form>
          </div>
        )}

        {step === 'payment' && (
          <div className="p-8">
            <h3 className="text-2xl font-serif text-gold mb-1">Direct Checkout</h3>
            <p className="text-stone-400 text-sm mb-6">
              Complete your payment for <span className="text-stone-200 font-serif">{productName}</span>
            </p>

            <div className="bg-stone-900 border border-stone-800 rounded p-4 mb-6 flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-4 pb-4 border-b border-stone-800">
                <span className="text-stone-400 uppercase tracking-widest text-xs">Total Amount</span>
                <span className="text-2xl font-serif text-white">₹{price.toLocaleString()}</span>
              </div>

              <div className="bg-white p-2 rounded mb-4 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="UPI QR Code" className="w-48 h-48" />
              </div>

              <div className="text-center w-full">
                <p className="text-stone-400 text-xs mb-1">Scan with any UPI App</p>
                <div className="flex justify-center gap-4 text-stone-500 mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest">PhonePe</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest">GPay</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest">Paytm</span>
                </div>
                
                <a 
                  href={upiUri}
                  className="w-full flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 py-3 rounded transition-colors text-sm uppercase tracking-widest font-medium"
                >
                  <Smartphone size={16} /> Open UPI App on Mobile
                </a>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-serif uppercase tracking-widest text-stone-400 mb-2">
                  Enter UTR / Transaction ID
                </label>
                <input 
                  required
                  type="text" 
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 text-white px-4 py-3 rounded focus:outline-none focus:border-gold transition-colors font-mono"
                  placeholder="e.g. 123456789012"
                />
                <p className="text-[10px] text-stone-500 mt-1">12-digit reference number found in your payment app after successful transfer.</p>
              </div>

              <button 
                type="submit"
                disabled={!utr.trim()}
                className="w-full bg-gold text-black font-bold uppercase tracking-widest py-4 rounded hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-gold disabled:cursor-not-allowed"
              >
                Confirm Payment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
