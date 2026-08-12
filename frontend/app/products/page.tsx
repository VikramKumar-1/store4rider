"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SidebarFilters } from "@/modules/catalog/components/SidebarFilters";
import { ProductGrid } from "@/modules/catalog/components/ProductGrid";
import { Loader2 } from "lucide-react";
import { useProductStore } from "@/stores/useProductStore";

import { Suspense } from "react";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category") || "all";

  const { products, fetchProducts, isFetched } = useProductStore();

  // Fetch real products globally on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [sortOption, setSortOption] = useState("featured");

  // Filtering Logic
  const filteredProducts = products.filter((p) => {
    // Basic mapping for catalog categories based on real CSV text
    const lowerCat = p.category?.toLowerCase() || "";
    let normalizedCategory = "accessories";
    if (lowerCat.includes("helmet")) normalizedCategory = "helmets";
    else if (lowerCat.includes("jacket") || lowerCat.includes("suit")) normalizedCategory = "riding-jackets";
    else if (lowerCat.includes("boot") || lowerCat.includes("shoe")) normalizedCategory = "riding-boots";
    else if (lowerCat.includes("glove")) normalizedCategory = "riding-gloves";
    else if (lowerCat.includes("luggage") || lowerCat.includes("bag")) normalizedCategory = "luggage";

    const matchesCategory = activeCategory === "all" || normalizedCategory === activeCategory;
    const matchesPrice = p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1];
    
    return matchesCategory && matchesPrice;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-low") return a.basePrice - b.basePrice;
    if (sortOption === "price-high") return b.basePrice - a.basePrice;
    return 0; // "featured" keeps original CSV order
  });

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      
      {/* Page Header */}
      <div className="bg-slate-900 text-white py-12 mb-8 border-b-4 border-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 uppercase">
            Riding Gear Collection
          </h1>
          <p className="text-slate-400 font-medium max-w-2xl">
            Explore our massive catalog of premium protective riding gear, straight from your backup data.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar (Filters) */}
          <div className="w-full lg:w-72 shrink-0 lg:sticky lg:top-28">
            <SidebarFilters 
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          {/* Right Content (Product Grid & Toolbar) */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm font-bold text-slate-600">
                Showing <span className="text-brand font-black">{sortedProducts.length}</span> authentic products
              </p>
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort By</span>
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {!isFetched ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 font-bold gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-brand" />
                <p>Loading real products from backup CSV...</p>
              </div>
            ) : sortedProducts.length > 0 ? (
              <ProductGrid products={sortedProducts} />
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-200/80">
                <h3 className="text-xl font-black text-slate-900 mb-2">No Products Found</h3>
                <p className="text-slate-500 font-semibold">Try adjusting your filters or search criteria.</p>
                <button 
                  onClick={() => {
                    setActiveCategory("all");
                    setPriceRange([0, 150000]);
                  }}
                  className="mt-6 px-6 py-3 bg-brand text-white font-black rounded-xl hover:bg-brand-dark transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
