"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useProductStore } from "@/stores/useProductStore";

export function NewArrivalsSection() {
  const { products, isFetched } = useProductStore();
  
  // Use a different slice of the catalog to show better products in New Arrivals
  const displayArrivals = products.slice(18, 22);

  return (
    <section className="py-20 bg-[#f1f5f9] text-slate-950 border-b border-slate-200">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900">
              New Arrivals
            </h2>
          </div>
        </div>

        {/* 2x2 Grid on Mobile, 4-col on Desktop */}
        {!isFetched ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 font-bold gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
            <p>Loading latest gear...</p>
          </div>
        ) : displayArrivals.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayArrivals.map((product) => (
              <ProductCard key={product.id || product._id || product.slug} product={product} />
            ))}
          </div>
        ) : null}

        {/* View All Button */}
        <div className="text-center pt-8 md:pt-10">
          <Link href="/products?sort=new">
            <button className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-950 px-8 py-3.5 rounded-full font-bold text-xs transition-colors shadow-sm hover:shadow-md">
              <span>View All New Arrivals</span>
              <ArrowRight size={15} />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
