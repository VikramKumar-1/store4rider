"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useProductStore } from "@/stores/useProductStore";

export function FeaturedProductsSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { products, fetchProducts, isFetched } = useProductStore();

  // Fetch real products globally on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Map category filter to CSV categories
  const filteredProducts = products.filter((p) => {
    if (activeFilter === "all") return true;
    
    const lowerCat = p.category?.toLowerCase() || "";
    if (activeFilter === "helmets" && lowerCat.includes("helmet")) return true;
    if (activeFilter === "jackets" && (lowerCat.includes("jacket") || lowerCat.includes("suit") || lowerCat.includes("riding gear"))) return true;
    if (activeFilter === "boots" && (lowerCat.includes("boot") || lowerCat.includes("shoe"))) return true;
    if (activeFilter === "gloves" && lowerCat.includes("glove")) return true;
    
    return false;
  });

  // Exactly 4 items for a clean 4-column desktop grid
  const displayProducts = filteredProducts.slice(0, 4);

  return (
    <section className="py-16 bg-[#f1f5f9] text-slate-950 border-b border-slate-200">
      
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Trending Riding Gear
            </h2>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All Gear" },
              { id: "helmets", label: "Helmets" },
              { id: "jackets", label: "Jackets" },
              { id: "boots", label: "Boots" },
              { id: "gloves", label: "Gloves" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === tab.id
                    ? "bg-slate-950 text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Slider (Mobile) / Grid (Desktop) */}
        {!isFetched ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 font-bold gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
            <p>Loading real gear from backup CSV...</p>
          </div>
        ) : displayProducts.length > 0 ? (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-pl-6 scrollbar-none pb-4 sm:pb-0 -mx-6 px-6 sm:mx-0 sm:px-0 after:content-[''] after:w-1 after:flex-none sm:after:hidden">
            {displayProducts.map((product) => (
              <div key={product.id} className="w-[75vw] sm:w-auto flex-none snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-2">No items found for {activeFilter}</h3>
            <p className="text-slate-500 text-sm">We are expanding our catalog soon!</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center pt-8">
          <Link href="/products">
            <button className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-950 px-8 py-3.5 rounded-full font-bold text-xs transition-colors shadow-2xs">
              <span>View All 36+ Riding Products</span>
              <ArrowRight size={15} />
            </button>
          </Link>
        </div>

      </div>

    </section>
  );
}
