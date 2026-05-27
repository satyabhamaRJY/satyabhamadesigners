'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface FilterSection {
  title: string;
  options: string[];
}

interface ProductFilterSidebarProps {
  filters: FilterSection[];
  onFilterChange: (section: string, option: string, isChecked: boolean) => void;
}

export default function ProductFilterSidebar({ filters, onFilterChange }: ProductFilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    filters.reduce((acc, f) => ({ ...acc, [f.title]: true }), {})
  );

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="w-full md:w-64 flex-shrink-0 bg-stone-950/50 border border-stone-800 rounded-lg p-5 h-fit sticky top-24 hidden md:block">
      <div className="flex items-center gap-2 mb-6 text-gold font-serif text-lg tracking-wider">
        <Filter size={18} /> Filters
      </div>

      <div className="space-y-6">
        {filters.map((section) => (
          <div key={section.title} className="border-b border-stone-800/50 pb-4 last:border-0">
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center justify-between w-full text-left mb-3 group"
            >
              <span className="text-stone-300 font-medium text-sm tracking-widest uppercase group-hover:text-gold transition-colors">
                {section.title}
              </span>
              {openSections[section.title] ? (
                <ChevronUp size={16} className="text-stone-500 group-hover:text-gold transition-colors" />
              ) : (
                <ChevronDown size={16} className="text-stone-500 group-hover:text-gold transition-colors" />
              )}
            </button>

            {openSections[section.title] && (
              <div className="space-y-2 mt-2 animate-in slide-in-from-top-1 fade-in duration-200">
                {section.options.map((option) => (
                  <label key={option} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-4 h-4">
                      <input
                        type="checkbox"
                        className="peer appearance-none w-4 h-4 border border-stone-600 rounded-sm bg-transparent checked:bg-gold checked:border-gold transition-colors cursor-pointer"
                        onChange={(e) => onFilterChange(section.title, option, e.target.checked)}
                      />
                      <svg
                        className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-stone-400 text-sm group-hover:text-stone-200 transition-colors">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
