import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, Trash2, CheckCircle } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { InvoicePrint } from '../components/InvoicePrint';

const API_BASE = 'http://localhost:5000/api';

export default function POS() {
  const [cart, setCart] = useState<any[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  
  // Hidden input ref to capture scanner
  const inputRef = useRef<HTMLInputElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onAfterPrint: () => setCompletedOrder(null), // Reset after print
  });

  // Keep focus on input for scanner
  useEffect(() => {
    const focusInput = () => {
      if (!completedOrder && inputRef.current) {
        inputRef.current.focus();
      }
    };
    document.addEventListener('click', focusInput);
    focusInput();
    return () => document.removeEventListener('click', focusInput);
  }, [completedOrder]);

  const fetchProductByBarcode = async (barcode: string) => {
    if (!barcode) return;
    try {
      const res = await fetch(`${API_BASE}/catalog/products/barcode/${barcode}`);
      const data = await res.json();
      if (data.success && data.data) {
        addToCart(data.data);
      } else {
        alert(`Product not found for barcode: ${barcode}`);
      }
    } catch (e) {
      console.error(e);
      alert('Error fetching product. Make sure backend is running.');
    }
  };

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProductByBarcode(barcodeInput.trim());
    setBarcodeInput('');
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert('Not enough stock');
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const checkout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    const items = cart.map(item => ({ productId: item.id, quantity: item.quantity }));
    
    try {
      const res = await fetch(`${API_BASE}/orders/pos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-bypass': 'true' // Bypass auth for demo
        },
        body: JSON.stringify({ items })
      });
      
      const data = await res.json();
      if (data.success) {
        setCompletedOrder(data.data);
        setCart([]);
        // Short delay to ensure React renders the hidden InvoicePrint before triggering print
        setTimeout(() => {
          handlePrint();
        }, 500);
      } else {
        alert(data.error || 'Checkout failed');
      }
    } catch (e) {
      console.error(e);
      alert('Error processing order');
    } finally {
      setIsProcessing(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.discountPrice ? Number(item.discountPrice) : Number(item.price)) * item.quantity, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-140px)]">
      {/* Hidden Invoice Component for Printing */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        {completedOrder && <InvoicePrint ref={printRef} order={completedOrder} />}
      </div>

      {/* Main POS Interface */}
      <div className="flex-1 min-h-[400px] lg:min-h-0 bg-stone-900 rounded-lg border border-stone-800 flex flex-col overflow-hidden relative">
        <div className="p-4 border-b border-stone-800 bg-stone-950 flex justify-between items-center">
          <h2 className="text-xl font-serif text-amber-500">Scan Items</h2>
          
          <form onSubmit={handleScanSubmit} className="relative w-64">
            <input
              ref={inputRef}
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Scan Barcode or Type SKU"
              className="w-full bg-stone-900 border border-stone-700 rounded-md py-2 px-3 text-sm text-stone-200 focus:outline-none focus:border-amber-500 transition"
              autoFocus
            />
            <Search className="absolute right-3 top-2.5 text-stone-500" size={16} />
          </form>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-500">
              <ShoppingCart size={48} className="mb-4 opacity-20" />
              <p>Scan a barcode to add items</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex items-center p-3 bg-stone-950 rounded border border-stone-800">
                  <img src={item.images[0] || 'https://via.placeholder.com/50'} alt={item.name} className="w-12 h-16 object-cover rounded mr-4" />
                  <div className="flex-1">
                    <h3 className="text-stone-200 font-semibold">{item.name}</h3>
                    <p className="text-stone-500 text-xs font-mono">{item.sku}</p>
                  </div>
                  <div className="text-right mr-6">
                    <div className="text-amber-400 font-bold">₹{((item.discountPrice ? Number(item.discountPrice) : Number(item.price)) * item.quantity).toLocaleString('en-IN')}</div>
                    <div className="text-stone-500 text-xs">{item.quantity} x ₹{(item.discountPrice ? Number(item.discountPrice) : Number(item.price)).toLocaleString('en-IN')}</div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-stone-500 hover:text-red-400 p-2 rounded hover:bg-stone-900 transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Checkout Sidebar */}
      <div className="w-full lg:w-80 bg-stone-900 rounded-lg border border-stone-800 flex flex-col flex-none">
        <div className="p-4 border-b border-stone-800 bg-stone-950">
          <h2 className="text-xl font-serif text-amber-500">Current Bill</h2>
        </div>
        
        <div className="flex-1 p-4 flex flex-col">
          <div className="space-y-3 flex-1">
            <div className="flex justify-between text-stone-400">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Tax (Included)</span>
              <span>₹{(total * 0.05).toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <div className="border-t border-stone-800 pt-4 mb-6">
            <div className="flex justify-between text-xl font-bold text-amber-400">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={checkout}
            disabled={cart.length === 0 || isProcessing}
            className={`w-full py-4 rounded-md font-bold text-lg flex items-center justify-center gap-2 transition ${
              cart.length === 0 ? 'bg-stone-800 text-stone-600 cursor-not-allowed' : 'bg-amber-500 text-stone-950 hover:bg-amber-400'
            }`}
          >
            {isProcessing ? 'Processing...' : (
              <>
                <CheckCircle size={20} /> Complete Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
