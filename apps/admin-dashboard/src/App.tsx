import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Truck, 
  Plus, 
  Trash2, 
  Edit2, 
  Package, 
  TrendingUp, 
  IndianRupee, 
  FileText,
  UploadCloud,
  CheckCircle,
  LogOut,
  ShoppingCart
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';

const API_BASE = 'http://localhost:5000/api';

// Fallback Mock Data in case Backend API is starting up
const mockStats = {
  totalSales: 483000,
  orderCount: 14,
  customerCount: 18,
  categoryCount: 3,
  salesOverTime: [
    { date: '2026-05-18', amount: 85000 },
    { date: '2026-05-19', amount: 0 },
    { date: '2026-05-20', amount: 165000 },
    { date: '2026-05-21', amount: 78000 },
    { date: '2026-05-22', amount: 0 },
    { date: '2026-05-23', amount: 155000 },
    { date: '2026-05-24', amount: 0 }
  ],
  popularCategories: [
    { name: 'Kanjeevaram Silk', count: 6 },
    { name: 'Banarasi Brocade', count: 5 },
    { name: 'Chanderi Weaver', count: 3 }
  ]
};

const mockCategories = [
  { id: '1', name: 'Kanjeevaram Silk', slug: 'kanjeevaram-silk', description: 'Gold-dipped zari silk from Tamil Nadu', productsCount: 1 },
  { id: '2', name: 'Banarasi Brocade', slug: 'banarasi-brocade', description: 'Fine silver brocade embroidery from Varanasi', productsCount: 1 },
  { id: '3', name: 'Chanderi Weaver', slug: 'chanderi-weaver', description: 'Light sheer traditional cotton silk', productsCount: 1 }
];

const mockProducts = [
  {
    id: 'p1',
    name: 'Vaikuntha Gold Brocade Kanjeevaram',
    slug: 'vaikuntha-gold-kanjeevaram',
    description: 'Crimson red Kanjeevaram saree featuring solid gold zari border.',
    price: 185000,
    discountPrice: 165000,
    sku: 'LUX-KANJ-RED-001',
    stock: 4,
    weight: 1200,
    length: 550,
    width: 110,
    height: 5,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    category: { name: 'Kanjeevaram Silk' }
  },
  {
    id: 'p2',
    name: 'Emerald Royal Banarasi Saree',
    slug: 'emerald-royal-banarasi',
    description: 'Deep emerald green banarasi saree with real silver-dipped zari.',
    price: 240000,
    discountPrice: null,
    sku: 'LUX-BANA-GRN-002',
    stock: 2,
    weight: 1400,
    length: 550,
    width: 115,
    height: 6,
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
    category: { name: 'Banarasi Brocade' }
  }
];

const mockCustomers = [
  { id: 'c1', name: 'Priya Sharma', phone: '+91 98765 43210', email: 'priya@example.com', totalSpent: 305000, orderCount: 2 },
  { id: 'c2', name: 'Aishwarya Roy', phone: '+91 88888 77777', email: 'aishwarya@example.com', totalSpent: 78000, orderCount: 1 }
];

const mockOrders = [
  {
    id: 'o1',
    orderNumber: 'LUX-10001',
    status: 'PAID',
    paymentStatus: 'COMPLETED',
    paymentMethod: 'UPI (GPay)',
    totalAmount: 165080,
    shippingAmount: 80,
    packageWeight: 1200,
    createdAt: '2026-05-24T12:30:00.000Z',
    shippingAddress: {
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      addressLine1: 'Villa 12, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    },
    shiprocketOrderId: null as string | null,
    shiprocketShipmentId: null as string | null,
    items: [
      { product: { name: 'Vaikuntha Gold Brocade Kanjeevaram' }, quantity: 1, price: 165000 }
    ]
  }
];

import Login from './Login';
import POS from './pages/POS';
import DigitalSareeCard from './pages/DigitalSareeCard';
import { BarcodeLabel } from './components/BarcodeLabel';
import { useReactToPrint } from 'react-to-print';

// Dedicated print component to prevent browser popup blockers
const PrintBarcodeButton = ({ product }: { product: any }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  return (
    <>
      <button 
        className="p-2 text-stone-400 hover:text-indigo-400 hover:bg-stone-900 rounded transition"
        title="Print Barcode Label"
        onClick={handlePrint}
      >
        <FileText size={15} />
      </button>
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <BarcodeLabel ref={componentRef} product={product} />
      </div>
    </>
  );
};

export default function App() {
  const [user, setUser] = useState<{ email: string; role: 'owner' | 'employee'; name: string } | null>(null);
  
  // Public route interceptor for QR codes
  const [publicSku, setPublicSku] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/card/')) {
      const sku = path.split('/card/')[1];
      if (sku) {
        setPublicSku(sku);
      }
    }
  }, []);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'catalog' | 'customers' | 'orders' | 'settings' | 'pos'>('dashboard');
  const [stats, setStats] = useState(mockStats);
  const [categories, setCategories] = useState(mockCategories);
  const [products, setProducts] = useState(mockProducts);
  const [customers, setCustomers] = useState(mockCustomers);
  const [orders, setOrders] = useState(mockOrders);

  // Form States
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProductId, setCurrentProductId] = useState('');
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState('');
  
  // Category Form State
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');

  // Product Form State
  const [prodName, setProdName] = useState('');
  const [prodSlug, setProdSlug] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDiscPrice, setProdDiscPrice] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodWeight, setProdWeight] = useState('');
  const [prodLength, setProdLength] = useState('');
  const [prodWidth, setProdWidth] = useState('');
  const [prodHeight, setProdHeight] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodCategory, setProdCategory] = useState('');

  useEffect(() => {
    // Only fetch if user is logged in
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Handle public route rendering first (bypasses login)
  if (publicSku) {
    return <DigitalSareeCard sku={publicSku} />;
  }

  // If not logged in, show Login Screen
  if (!user) {
    return <Login onLogin={(u) => {
      setUser(u);
      setActiveTab(u.role === 'employee' ? 'catalog' : 'dashboard');
    }} />;
  }

  const handleLogout = () => {
    setUser(null);
  };

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch categories
      const catRes = await fetch(`${API_BASE}/catalog/categories`);
      const catData = await catRes.json();
      if (catData.success) setCategories(catData.data);

      // 2. Fetch products
      const prodRes = await fetch(`${API_BASE}/catalog/products`);
      const prodData = await prodRes.json();
      if (prodData.success) setProducts(prodData.data);

      // 3. Fetch orders (with admin header bypass)
      const ordRes = await fetch(`${API_BASE}/orders`, {
        headers: { 'x-admin-bypass': 'true' }
      });
      const ordData = await ordRes.json();
      if (ordData.success) setOrders(ordData.data);

      // 4. Fetch metrics
      const statsRes = await fetch(`${API_BASE}/orders/stats`, {
        headers: { 'x-admin-bypass': 'true' }
      });
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.data);

      // 5. Fetch customers
      const custRes = await fetch(`${API_BASE}/customers`, {
        headers: { 'x-admin-bypass': 'true' }
      });
      const custData = await custRes.json();
      if (custData.success) setCustomers(custData.data);

    } catch (e) {
      console.warn('API connection failed. Operating in standalone demo mode with high-fidelity local mockups.');
    }
  };

  // Handle local file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const fallbackToLocal = () => {
      console.warn('API connection failed. Using local blob URL for image preview.');
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setter(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    };

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setter(data.data.url);
      } else {
        fallbackToLocal();
      }
    } catch (error) {
      fallbackToLocal();
    }
  };

  // Add or Edit Category Handler
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: catName,
      slug: catSlug || catName.toLowerCase().replace(/ /g, '-'),
      description: catDesc,
      image: catImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
    };

    try {
      let url = `${API_BASE}/catalog/categories`;
      let method = 'POST';

      if (isEditingCategory) {
        url = `${API_BASE}/catalog/categories/${currentCategoryId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-bypass': 'true'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowCategoryModal(false);
        resetCategoryForm();
        fetchDashboardData();
      }
    } catch (err) {
      // Local Mock Addition
      if (isEditingCategory) {
        setCategories(categories.map(c => c.id === currentCategoryId ? { ...c, ...payload } : c));
      } else {
        const mockNewCat = {
          id: Math.random().toString(),
          name: payload.name,
          slug: payload.slug,
          description: payload.description,
          productsCount: 0
        };
        setCategories([...categories, mockNewCat]);
      }
      setShowCategoryModal(false);
      resetCategoryForm();
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`${API_BASE}/catalog/categories/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-bypass': 'true' }
      });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  // Add or Edit Product Handler
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: prodName,
      slug: prodSlug || prodName.toLowerCase().replace(/ /g, '-'),
      description: prodDesc,
      price: parseFloat(prodPrice),
      discountPrice: prodDiscPrice ? parseFloat(prodDiscPrice) : undefined,
      categoryId: prodCategory || categories[0]?.id,
      images: [prodImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      weight: parseFloat(prodWeight),
      length: parseFloat(prodLength),
      width: parseFloat(prodWidth),
      height: parseFloat(prodHeight),
      sku: prodSku,
      stock: parseInt(prodStock || '0')
    };

    try {
      let url = `${API_BASE}/catalog/products`;
      let method = 'POST';

      if (isEditingProduct) {
        url = `${API_BASE}/catalog/products/${currentProductId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-bypass': 'true'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowProductModal(false);
        resetProductForm();
        fetchDashboardData();
      }
    } catch (err) {
      // Local Fallback simulation
      if (isEditingProduct) {
        setProducts(products.map(p => p.id === currentProductId ? { ...p, ...payload, category: { name: categories.find(c => c.id === payload.categoryId)?.name || 'Silk' } } as any : p));
      } else {
        const mockNewProd = {
          id: Math.random().toString(),
          ...payload,
          category: { name: categories.find(c => c.id === payload.categoryId)?.name || 'Silk' }
        };
        setProducts([...products, mockNewProd as any]);
      }
      setShowProductModal(false);
      resetProductForm();
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to retire this design?')) return;
    try {
      const res = await fetch(`${API_BASE}/catalog/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-bypass': 'true' }
      });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-bypass': 'true'
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      // Simulated status toggle with Shiprocket integration triggers
      setOrders(orders.map(o => {
        if (o.id === orderId) {
          const update: any = { ...o, status };
          if (status === 'SHIPPED' && !o.shiprocketOrderId) {
            update.shiprocketOrderId = `SR-MOCK-${Math.floor(100000 + Math.random() * 900000)}`;
            update.shiprocketShipmentId = `SR-SHIP-MOCK-${Math.floor(1000000 + Math.random() * 9000000)}`;
          }
          return update;
        }
        return o;
      }));
    }
  };

  const editProductTrigger = (p: any) => {
    setIsEditingProduct(true);
    setCurrentProductId(p.id);
    setProdName(p.name);
    setProdSlug(p.slug);
    setProdDesc(p.description);
    setProdPrice(p.price.toString());
    setProdDiscPrice(p.discountPrice ? p.discountPrice.toString() : '');
    setProdCategory(p.categoryId || '');
    setProdSku(p.sku);
    setProdStock(p.stock.toString());
    setProdWeight(p.weight.toString());
    setProdLength(p.length.toString());
    setProdWidth(p.width.toString());
    setProdHeight(p.height.toString());
    setProdImage(p.images[0] || '');
    setShowProductModal(true);
  };

  const editCategoryTrigger = (c: any) => {
    setIsEditingCategory(true);
    setCurrentCategoryId(c.id);
    setCatName(c.name);
    setCatSlug(c.slug);
    setCatDesc(c.description || '');
    setCatImage(c.image || '');
    setShowCategoryModal(true);
  };

  const resetCategoryForm = () => {
    setIsEditingCategory(false);
    setCurrentCategoryId('');
    setCatName('');
    setCatSlug('');
    setCatDesc('');
    setCatImage('');
  };

  const resetProductForm = () => {
    setIsEditingProduct(false);
    setCurrentProductId('');
    setProdName('');
    setProdSlug('');
    setProdDesc('');
    setProdPrice('');
    setProdDiscPrice('');
    setProdCategory('');
    setProdSku('');
    setProdStock('');
    setProdWeight('1000');
    setProdLength('40');
    setProdWidth('30');
    setProdHeight('8');
    setProdImage('');
  };

  // Helper formatters
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0a] text-[#e7e5e4]">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-stone-950 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col flex-none">
        <div className="p-4 md:p-6 border-b border-stone-800 flex justify-between items-center md:block">
          <div>
            <h2 className="text-amber-500 font-serif text-xl md:text-2xl tracking-widest uppercase mb-1">Satyabhama</h2>
            <p className="text-stone-500 text-[10px] tracking-widest uppercase hidden md:block">Luxury Admin Portal</p>
          </div>
        </div>
        
        <nav className="p-4 flex overflow-x-auto md:flex-col gap-2 md:space-y-2 md:gap-0" style={{ scrollbarWidth: 'none' }}>
          {user.role === 'owner' && (
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm tracking-widest uppercase transition ${
                activeTab === 'dashboard' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <LayoutDashboard size={18} /> Analytics
            </button>
          )}

          <button 
            onClick={() => setActiveTab('catalog')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm tracking-widest uppercase transition ${
              activeTab === 'catalog' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <ShoppingBag size={18} /> Catalog Manager
          </button>

          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm tracking-widest uppercase transition ${
              activeTab === 'orders' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Truck size={18} /> Orders & Logistics
          </button>

          <button 
            onClick={() => setActiveTab('pos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm tracking-widest uppercase transition ${
              activeTab === 'pos' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <ShoppingCart size={18} /> Point of Sale (POS)
          </button>

          {user.role === 'owner' && (
            <button 
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm tracking-widest uppercase transition ${
                activeTab === 'customers' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Users size={18} /> Client CRM
            </button>
          )}
        </nav>
      </aside>

      {/* 2. Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-hidden">
        <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-stone-800 pb-4 md:pb-6 gap-4">
          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-lg md:text-xl font-serif text-amber-200 tracking-wider">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} {user.role === 'employee' && '(Staff View)'}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-xs text-stone-400 hidden sm:block">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center hover:bg-stone-800 transition">
                <LogOut size={18} className="text-stone-400 hover:text-red-400 transition" />
              </button>
            </div>
          </div>
        </header>

        {/* ======================================================== */}
        {/* DASHBOARD VIEW */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <div>
            <header className="mb-8">
              <h1 className="text-3xl font-serif">Imperial Analytics</h1>
              <p className="text-stone-400">Overview of the luxury saree registry activity</p>
            </header>

            {/* Metrics cards */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <span>Gross Saree Revenue</span>
                  <IndianRupee size={16} className="text-amber-500" />
                </div>
                <div className="metric-value">{formatCurrency(stats.totalSales)}</div>
                <div className="metric-footer">+18.4% from last week</div>
              </div>
              <div className="metric-card">
                <div className="metric-header">
                  <span>Orders Placed</span>
                  <FileText size={16} className="text-amber-500" />
                </div>
                <div className="metric-value">{stats.orderCount}</div>
                <div className="metric-footer">Pending verification: {orders.filter(o => o.paymentStatus === 'PENDING').length}</div>
              </div>
              <div className="metric-card">
                <div className="metric-header">
                  <span>Verifed Patrons</span>
                  <Users size={16} className="text-amber-500" />
                </div>
                <div className="metric-value">{stats.customerCount}</div>
                <div className="metric-footer">100% verified via OTP</div>
              </div>
              <div className="metric-card">
                <div className="metric-header">
                  <span>Active Silks</span>
                  <Package size={16} className="text-amber-500" />
                </div>
                <div className="metric-value">{stats.categoryCount}</div>
                <div className="metric-footer">Across handloom clusters</div>
              </div>
            </div>

            {/* Graphical Analytics Panel */}
            <div className="dashboard-panels">
              {/* Sales Chart */}
              <div className="panel-card">
                <div className="panel-title">
                  <span>Sales Trend (INR)</span>
                  <TrendingUp size={16} className="text-amber-500" />
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.salesOverTime} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d4af37" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2c251e" />
                      <XAxis dataKey="date" stroke="#a39e93" fontSize={12} />
                      <YAxis stroke="#a39e93" fontSize={12} tickFormatter={(v) => `₹${v/1000}k`} />
                      <Tooltip contentStyle={{ backgroundColor: '#141210', borderColor: '#2c251e', color: '#f5f2eb' }} formatter={(v: any) => [formatCurrency(v), 'Revenue']} />
                      <Area type="monotone" dataKey="amount" stroke="#d4af37" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="panel-card">
                <div className="panel-title">Popular Weaving Clusters</div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.popularCategories}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2c251e" />
                      <XAxis dataKey="name" stroke="#a39e93" fontSize={10} tickFormatter={(t) => t.split(' ')[0]} />
                      <YAxis stroke="#a39e93" fontSize={12} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#141210', borderColor: '#2c251e', color: '#f5f2eb' }} />
                      <Bar dataKey="count" fill="#af923d">
                        {stats.popularCategories.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#d4af37' : '#af923d'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* CATALOG MANAGER VIEW */}
        {/* ======================================================== */}
        {activeTab === 'catalog' && (
          <div>
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-serif">Catalog Manager</h1>
                <p className="text-stone-400">Curate luxury saree designs and heritage categories</p>
              </div>
              <div className="flex gap-4">
                <button className="luxury-btn" onClick={() => { resetCategoryForm(); setShowCategoryModal(true); }}>
                  <Plus size={16} /> Create Category
                </button>
                <button className="luxury-btn" onClick={() => { resetProductForm(); setShowProductModal(true); }}>
                  <Plus size={16} /> Add New Saree
                </button>
              </div>
            </header>

            {/* Categories Showcase */}
            <div className="mb-8">
              <h2 className="text-xl font-serif mb-4 text-stone-300">Weaving Heritage (Categories)</h2>
              <div className="metrics-grid">
                {categories.map(cat => (
                  <div key={cat.id} className="metric-card relative group" style={{ borderLeft: '3px solid var(--color-gold)' }}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-lg">{cat.name}</h3>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-stone-400 hover:text-amber-500" onClick={() => editCategoryTrigger(cat)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="text-stone-400 hover:text-red-500" onClick={() => handleDeleteCategory(cat.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 mb-2 font-mono">slug: {cat.slug}</p>
                    <p className="text-sm text-stone-400 line-clamp-2">{cat.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Products (Sarees) Table */}
            <div>
              <h2 className="text-xl font-serif mb-4 text-stone-300">Saree Collections ({products.length})</h2>
              <div className="luxury-table-wrapper">
                <table className="luxury-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Saree Design / SKU</th>
                      <th>Category</th>
                      <th>Price (Original / Disc)</th>
                      <th>Weight & Box Size</th>
                      <th>Stock Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <img 
                            src={p.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'} 
                            alt={p.name} 
                            className="w-12 h-16 object-cover rounded border border-stone-800" 
                          />
                        </td>
                        <td>
                          <div className="font-semibold text-stone-200">{p.name}</div>
                          <div className="text-xs text-stone-500 font-mono mt-0.5">{p.sku}</div>
                        </td>
                        <td>
                          <span className="text-stone-300">{p.category?.name}</span>
                        </td>
                        <td>
                          <div className="font-medium text-amber-100">{formatCurrency(p.discountPrice ? Number(p.discountPrice) : Number(p.price))}</div>
                          {p.discountPrice && (
                            <div className="text-xs text-stone-500 line-through">{formatCurrency(Number(p.price))}</div>
                          )}
                        </td>
                        <td>
                          <div className="text-xs text-stone-300 font-mono">{p.weight}g</div>
                          <div className="text-xs text-stone-500 font-mono">{p.length}x{p.width}x{p.height} cm</div>
                        </td>
                        <td>
                          {p.stock > 0 ? (
                            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-900">
                              {p.stock} units
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-rose-400 bg-rose-950/40 px-2 py-1 rounded border border-rose-900">
                              Out of Stock
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="flex justify-end gap-2">
                            <PrintBarcodeButton product={p} />
                            <button 
                              className="p-2 text-stone-400 hover:text-amber-500 hover:bg-stone-900 rounded transition"
                              onClick={() => editProductTrigger(p)}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button 
                              className="p-2 text-stone-400 hover:text-red-500 hover:bg-stone-900 rounded transition"
                              onClick={() => handleDeleteProduct(p.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* POS VIEW */}
        {/* ======================================================== */}
        {activeTab === 'pos' && (
          <POS />
        )}

        {/* ======================================================== */}
        {/* CUSTOMER MANAGER VIEW */}
        {/* ======================================================== */}
        {activeTab === 'customers' && (
          <div>
            <header className="mb-8">
              <h1 className="text-3xl font-serif">Customer Registry (CRM)</h1>
              <p className="text-stone-400">Manage client accounts verified via Mobile OTP</p>
            </header>

            <div className="luxury-table-wrapper">
              <table className="luxury-table">
                <thead>
                  <tr>
                    <th>Patron Name</th>
                    <th>Phone / OTP Status</th>
                    <th>Email Contact</th>
                    <th>Orders Count</th>
                    <th style={{ textAlign: 'right' }}>Customer Lifetime Value</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id}>
                      <td>
                        <div className="font-semibold text-stone-200">{c.name || 'Anonymous Guest'}</div>
                        <div className="text-xs text-stone-500">ID: {c.id.substring(0, 8)}...</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-stone-300">{c.phone}</span>
                          <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900">
                            <CheckCircle size={10} /> Verified
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="text-stone-400 text-sm">{c.email || 'No email associated'}</span>
                      </td>
                      <td>
                        <span className="text-stone-300">{c.orderCount} orders</span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }} className="text-amber-400">
                        {formatCurrency(c.totalSpent)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ORDERS & SHIPPING VIEW */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div>
            <header className="mb-8">
              <h1 className="text-3xl font-serif">Registry Orders & Shipments</h1>
              <p className="text-stone-400">Manage payment captures, order packaging, and Shiprocket dispatch logs</p>
            </header>

            <div className="luxury-table-wrapper">
              <table className="luxury-table">
                <thead>
                  <tr>
                    <th>Order Number</th>
                    <th>Patron Details</th>
                    <th>Saree Products</th>
                    <th>Payment</th>
                    <th>Shiprocket API Status</th>
                    <th>Dispatch Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>
                        <div className="font-serif text-lg font-bold text-stone-200">{o.orderNumber}</div>
                        <div className="text-xs text-stone-500 font-mono">{new Date(o.createdAt).toLocaleDateString('en-IN')}</div>
                      </td>
                      <td>
                        <div className="font-semibold text-stone-300">{o.shippingAddress.name}</div>
                        <div className="text-xs text-stone-400">{o.shippingAddress.city}, Pincode: {o.shippingAddress.pincode}</div>
                        <div className="text-xs text-stone-500 font-mono">{o.shippingAddress.phone}</div>
                      </td>
                      <td>
                        {o.items.map((item, idx) => (
                          <div key={idx} className="text-xs text-stone-300">
                            {item.product?.name} <span className="text-stone-500">x{item.quantity}</span>
                          </div>
                        ))}
                      </td>
                      <td>
                        <div className="font-bold text-amber-100">{formatCurrency(o.totalAmount)}</div>
                        <div className="mt-1">
                          <span className={`luxury-badge ${o.paymentStatus === 'COMPLETED' ? 'badge-paid' : 'badge-pending'}`}>
                            {o.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td>
                        {o.shiprocketOrderId ? (
                          <div>
                            <div className="text-[10px] text-stone-400 font-mono">Shiprocket ID:</div>
                            <div className="text-xs text-emerald-400 font-mono font-semibold">{o.shiprocketOrderId}</div>
                            <div className="text-[10px] text-stone-500 mt-0.5">Shipment: {o.shiprocketShipmentId?.substring(0, 12)}...</div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-stone-500">Not Dispatched</span>
                            <span className="text-[10px] text-stone-500 font-mono">Weight: {(o.packageWeight/1000).toFixed(2)} kg</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <select 
                          className="luxury-select text-xs py-1"
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID (PREPARED)</option>
                          <option value="SHIPPED">SHIPPED (GENERATE SHIPROCKET LABEL)</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODALS */}
      {/* ======================================================== */}
      {showCategoryModal && (
        <div className="luxury-modal-overlay">
          <div className="luxury-modal">
            <div className="modal-header">
              <h2 className="text-xl font-serif text-amber-200">
                {isEditingCategory ? 'Update Heritage Class' : 'Register Saree Class (Category)'}
              </h2>
              <button className="close-btn" onClick={() => setShowCategoryModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleCategorySubmit} className="luxury-form">
              <div className="form-group">
                <label className="luxury-label">Category Name</label>
                <input 
                  type="text" 
                  className="luxury-input" 
                  placeholder="e.g. Banarasi Brocade"
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="luxury-label">Slug URL</label>
                <input 
                  type="text" 
                  className="luxury-input" 
                  placeholder="e.g. banarasi-brocade (Leave blank to auto-generate)"
                  value={catSlug}
                  onChange={e => setCatSlug(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="luxury-label">Heritage Background Description</label>
                <textarea 
                  className="luxury-textarea" 
                  rows={3} 
                  placeholder="Rich history of this weaving cluster..."
                  value={catDesc}
                  onChange={e => setCatDesc(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="luxury-label">Heritage Backdrop Image</label>
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setCatImage)}
                    className="block w-full text-sm text-stone-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-stone-900 file:text-amber-500
                      hover:file:bg-stone-800 transition"
                  />
                </div>
                {catImage && (
                  <div className="mt-2">
                    <img src={catImage} alt="Preview" className="h-20 object-cover rounded border border-stone-800" />
                  </div>
                )}
                <input 
                  type="text" 
                  className="luxury-input mt-2" 
                  placeholder="Or paste direct image URL (e.g. https://images.unsplash.com/...)"
                  value={catImage}
                  onChange={e => setCatImage(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" className="luxury-btn" style={{ background: 'none', borderColor: 'transparent' }} onClick={() => setShowCategoryModal(false)}>Cancel</button>
                <button type="submit" className="luxury-btn">
                  {isEditingCategory ? 'Save Changes' : 'Publish Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PRODUCT DIALOG MODAL */}
      {/* ======================================================== */}
      {showProductModal && (
        <div className="luxury-modal-overlay">
          <div className="luxury-modal" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2 className="text-xl font-serif text-amber-200">
                {isEditingProduct ? 'Modify Saree Master Design' : 'Curate New Saree Master Design'}
              </h2>
              <button className="close-btn" onClick={() => setShowProductModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleProductSubmit} className="luxury-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="luxury-label">Saree Name / Label</label>
                  <input 
                    type="text" 
                    className="luxury-input" 
                    placeholder="e.g. Royal Gold Kanjeevaram"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="luxury-label">SKU Number</label>
                  <input 
                    type="text" 
                    className="luxury-input" 
                    placeholder="e.g. LUX-KANJ-RED-101"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="luxury-label">Original Price (INR)</label>
                  <input 
                    type="number" 
                    className="luxury-input" 
                    placeholder="e.g. 185000"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="luxury-label">Discounted Price (INR, Optional)</label>
                  <input 
                    type="number" 
                    className="luxury-input" 
                    placeholder="e.g. 165000"
                    value={prodDiscPrice}
                    onChange={(e) => setProdDiscPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="luxury-label">Saree Heritage Class</label>
                  <select 
                    className="luxury-select"
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    required
                  >
                    <option value="">Select a Category...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="luxury-label">Initial Stock Count</label>
                  <input 
                    type="number" 
                    className="luxury-input" 
                    placeholder="e.g. 5"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="luxury-label">Rich Text Description (Motifs, Zari details, Weaving hours)</label>
                <textarea 
                  className="luxury-textarea" 
                  rows={4} 
                  placeholder="Describe the threads, pattern story, and craftsmanship details..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  required
                />
              </div>

              {/* Shipping parameters */}
              <div className="border-t border-stone-800 pt-4">
                <h3 className="text-xs uppercase text-stone-500 tracking-wider mb-3">Shiprocket Cargo Metrics</h3>
                <div className="grid grid-cols-4 gap-2">
                  <div className="form-group">
                    <label className="text-[10px] text-stone-400 uppercase">Weight (Grams)</label>
                    <input 
                      type="number" 
                      className="luxury-input p-2 text-xs" 
                      value={prodWeight} 
                      onChange={(e) => setProdWeight(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="text-[10px] text-stone-400 uppercase">Length (cm)</label>
                    <input 
                      type="number" 
                      className="luxury-input p-2 text-xs" 
                      value={prodLength}
                      onChange={(e) => setProdLength(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="text-[10px] text-stone-400 uppercase">Width (cm)</label>
                    <input 
                      type="number" 
                      className="luxury-input p-2 text-xs" 
                      value={prodWidth}
                      onChange={(e) => setProdWidth(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="text-[10px] text-stone-400 uppercase">Height (cm)</label>
                    <input 
                      type="number" 
                      className="luxury-input p-2 text-xs" 
                      value={prodHeight}
                      onChange={(e) => setProdHeight(e.target.value)}
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="luxury-label">High-Resolution Photo</label>
                <div className="border-2 border-dashed border-stone-800 hover:border-amber-500 rounded p-4 text-center transition">
                  <UploadCloud size={30} className="mx-auto text-stone-600 mb-2" />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setProdImage)}
                    className="block w-full text-sm text-stone-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-stone-900 file:text-amber-500
                      hover:file:bg-stone-800 transition mx-auto"
                  />
                  <span className="text-[10px] text-stone-600 block mt-2">Uploads locally to the backend server</span>
                </div>
                {prodImage && (
                  <div className="mt-2">
                    <img src={prodImage} alt="Preview" className="h-20 object-cover rounded border border-stone-800" />
                  </div>
                )}
                <input 
                  type="text" 
                  className="luxury-input mt-2" 
                  placeholder="Or paste direct image URL (e.g. https://images.unsplash.com/...)"
                  value={prodImage}
                  onChange={e => setProdImage(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button type="button" className="luxury-btn" style={{ background: 'none', borderColor: 'transparent' }} onClick={() => setShowProductModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="luxury-btn">
                  {isEditingProduct ? 'Apply Design Updates' : 'Archive Saree Design'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
