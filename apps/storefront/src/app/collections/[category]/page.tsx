'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { catalog, getFilters } from '@/lib/mockCatalog';
import ProductCard from '@/components/ProductCard';
import ProductFilterSidebar from '@/components/ProductFilterSidebar';
import { SlidersHorizontal } from 'lucide-react';
import Footer from '@/components/Footer';

export default function CollectionPage() {
  const params = useParams();
  const categoryStr = typeof params.category === 'string' ? params.category : 'all';
  
  // Format category for display
  const title = categoryStr.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // All products for this category
  const allProducts = useMemo(() => {
    return catalog.filter(p => p.category === categoryStr || categoryStr === 'all');
  }, [categoryStr]);

  const filterData = useMemo(() => getFilters(categoryStr === 'all' ? 'readymade-salwar-suits' : categoryStr), [categoryStr]);

  // State for active filters
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    Fabrics: [],
    Colors: [],
    Work: [],
    Occasions: []
  });

  const [sortBy, setSortBy] = useState('featured');

  const handleFilterChange = (section: string, option: string, isChecked: boolean) => {
    setActiveFilters(prev => {
      const sectionKeys: Record<string, string> = {
        'Fabric': 'Fabrics',
        'Color': 'Colors',
        'Work': 'Work',
        'Occasion': 'Occasions'
      };
      
      const key = sectionKeys[section] || section;
      const current = prev[key] || [];
      
      if (isChecked) {
        return { ...prev, [key]: [...current, option] };
      } else {
        return { ...prev, [key]: current.filter(o => o !== option) };
      }
    });
  };

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      if (activeFilters.Fabrics.length > 0 && !activeFilters.Fabrics.includes(product.fabric)) return false;
      if (activeFilters.Colors.length > 0 && !activeFilters.Colors.includes(product.color)) return false;
      if (activeFilters.Work.length > 0 && !activeFilters.Work.includes(product.work)) return false;
      if (activeFilters.Occasions.length > 0 && !activeFilters.Occasions.includes(product.occasion)) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [allProducts, activeFilters, sortBy]);

  const sidebarFilters = [
    { title: 'Fabric', options: filterData.fabrics },
    { title: 'Color', options: filterData.colors },
    { title: 'Work', options: filterData.works },
    { title: 'Occasion', options: filterData.occasions },
  ].filter(f => f.options.length > 0);

  return (
    <div className="min-h-screen bg-bg pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left border-b border-stone-800 pb-8">
          <h1 className="text-3xl md:text-5xl font-serif text-gold tracking-wider mb-4">{title}</h1>
          <p className="text-stone-400 max-w-2xl font-light">
            Discover our meticulously crafted collection of {title.toLowerCase()}. Each piece is designed to reflect timeless elegance and modern sophistication.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <ProductFilterSidebar filters={sidebarFilters} onFilterChange={handleFilterChange} />

          {/* Product Grid Area */}
          <div className="flex-1">
            
            {/* Quick Filter Pills */}
            <div className="mb-6 flex flex-wrap gap-2 items-center">
              <span className="text-stone-500 text-xs uppercase tracking-widest mr-2">Quick Filters:</span>
              {['Bridal', 'Haldi', 'Corporate', 'Organza', 'Pure Silk', 'Georgette'].map(pill => (
                <button
                  key={pill}
                  onClick={() => {
                    const isOccasion = ['Bridal', 'Haldi', 'Corporate', 'Reception', 'Party Wear'].includes(pill);
                    const section = isOccasion ? 'Occasion' : 'Fabric';
                    // Toggle the filter
                    const key = section === 'Occasion' ? 'Occasions' : 'Fabrics';
                    const isActive = activeFilters[key].includes(pill);
                    handleFilterChange(section, pill, !isActive);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    (activeFilters.Occasions.includes(pill) || activeFilters.Fabrics.includes(pill))
                      ? 'bg-gold text-black border-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                      : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-gold hover:text-gold'
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 bg-stone-900/40 p-4 rounded-lg border border-stone-800/50">
              <div className="text-stone-400 text-sm">
                Showing <span className="text-gold font-medium">{filteredProducts.length}</span> products
              </div>
              
              <div className="flex items-center gap-4">
                <button className="md:hidden flex items-center gap-2 text-stone-300 text-sm border border-stone-700 px-3 py-1.5 rounded">
                  <SlidersHorizontal size={14} /> Filters
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-stone-500 text-sm hidden sm:inline">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border border-stone-700 text-stone-300 text-sm rounded px-3 py-1.5 focus:border-gold outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price, low to high</option>
                    <option value="price-high">Price, high to low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-stone-400 text-lg mb-2">No products found matching your filters.</p>
                <button 
                  onClick={() => setActiveFilters({ Fabrics: [], Colors: [], Work: [], Occasions: [] })}
                  className="text-gold underline hover:text-white transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
