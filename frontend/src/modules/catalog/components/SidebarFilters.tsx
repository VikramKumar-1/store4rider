"use client";

import { useState } from "react";
import { Filter, RotateCcw, ChevronDown, ChevronUp, Tag, ShieldCheck, DollarSign } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const CATEGORIES = [
  { name: "All Products", slug: "", count: 36 },
  { name: "Motorcycle Helmets", slug: "helmets", count: 6 },
  { name: "Riding Jackets", slug: "riding-jackets", count: 6 },
  { name: "Riding Boots", slug: "riding-boots", count: 6 },
  { name: "Riding Gloves", slug: "riding-gloves", count: 6 },
  { name: "Motorcycle Luggage", slug: "motorcycle-luggage", count: 6 },
  { name: "Bike Accessories", slug: "bike-accessories", count: 6 },
];

const BRANDS = ["AGV", "Shoei", "Arai", "Dainese", "Alpinestars", "Rev'it!", "Rynox", "Knox", "Kriega", "Royal Enfield"];

const PRICE_RANGES = [
  { label: "All Prices", id: "all" },
  { label: "Under ₹15,000", id: "low" },
  { label: "₹15,000 - ₹50,000", id: "mid" },
  { label: "Above ₹50,000", id: "high" },
];

interface SidebarFiltersProps {
  activeCategory?: string;
  setActiveCategory?: (cat: string) => void;
  priceRange?: number[];
  setPriceRange?: (range: number[]) => void;
}

export function SidebarFilters({
  activeCategory,
  setActiveCategory,
  priceRange,
  setPriceRange,
}: SidebarFiltersProps = {}) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  // Accordion state
  const [openCategories, setOpenCategories] = useState(true);
  const [openBrands, setOpenBrands] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);

  // Selected brand state
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState("all");

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const isCategoryActive = (slug: string) => {
    if (!currentCategory && !slug) return true;
    if (!currentCategory || !slug) return false;
    
    const curr = currentCategory.toLowerCase();
    const target = slug.toLowerCase();
    
    if (curr === target) return true;
    if (curr.includes("helmet") && target.includes("helmet")) return true;
    if (curr.includes("jacket") && target.includes("jacket")) return true;
    if (curr.includes("boot") && target.includes("boot")) return true;
    if (curr.includes("glove") && target.includes("glove")) return true;
    if (curr.includes("luggage") && target.includes("luggage")) return true;
    if (curr.includes("accessori") && target.includes("accessori")) return true;
    
    return false;
  };

  return (
    <aside className="w-full md:w-72 flex-shrink-0">
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm sticky top-28 max-h-[calc(100vh-130px)] overflow-y-auto scrollbar-thin scrollbar-slate space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900">
            <Filter size={18} className="text-brand" />
            <h2 className="font-black text-base tracking-tight">Filter Gear</h2>
          </div>
          {(currentCategory || selectedBrands.length > 0 || selectedPrice !== "all") && (
            <Link 
              href="/products" 
              onClick={() => { setSelectedBrands([]); setSelectedPrice("all"); }}
              className="text-[11px] font-bold text-slate-400 hover:text-brand transition-colors flex items-center gap-1"
            >
              <RotateCcw size={12} /> Reset All
            </Link>
          )}
        </div>
        
        {/* Accordion 1: Categories */}
        <div className="border-b border-slate-100 pb-4">
          <button 
            onClick={() => setOpenCategories(!openCategories)}
            className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5 hover:text-slate-900 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Tag size={13} className="text-brand" /> Category
            </span>
            {openCategories ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          
          {openCategories && (
            <div className="space-y-1 animate-in fade-in duration-200">
              {CATEGORIES.map((cat) => {
                const active = isCategoryActive(cat.slug);
                return (
                  <Link
                    key={cat.slug}
                    href={cat.slug ? `/products?category=${cat.slug}` : "/products"}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? "bg-brand text-white shadow-md shadow-brand/20"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="truncate mr-2">{cat.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      active ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {cat.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Accordion 2: Brands (2-Column Grid Pills) */}
        <div className="border-b border-slate-100 pb-4">
          <button 
            onClick={() => setOpenBrands(!openBrands)}
            className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5 hover:text-slate-900 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-brand" /> Top Brands
            </span>
            {openBrands ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {openBrands && (
            <div className="grid grid-cols-2 gap-1.5 animate-in fade-in duration-200">
              {BRANDS.map(brand => {
                const checked = selectedBrands.includes(brand);
                return (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-left transition-all border ${
                      checked
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    {brand}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Accordion 3: Price Range */}
        <div>
          <button 
            onClick={() => setOpenPrice(!openPrice)}
            className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5 hover:text-slate-900 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <DollarSign size={13} className="text-brand" /> Price Range
            </span>
            {openPrice ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {openPrice && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              {PRICE_RANGES.map(range => (
                <label 
                  key={range.id} 
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                    selectedPrice === range.id
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  <span>{range.label}</span>
                  <input 
                    type="radio" 
                    name="priceRange" 
                    checked={selectedPrice === range.id}
                    onChange={() => setSelectedPrice(range.id)}
                    className="hidden" 
                  />
                </label>
              ))}
            </div>
          )}
        </div>

      </div>
    </aside>
  );
}
