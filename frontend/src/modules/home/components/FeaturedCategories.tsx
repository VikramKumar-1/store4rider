"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { STORE_CATEGORIES } from "../data/categories";

export function FeaturedCategories() {
  return (
    <section className="py-14 bg-[#f8fafc] text-slate-950 border-b border-slate-200">
      
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Minimal Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-950">
              Explore Gear By Category
            </h2>
          </div>
          <Link href="/products" className="text-xs font-bold text-slate-600 hover:text-brand flex items-center transition-colors">
            <span>View All</span>
          </Link>
        </div>

        {/* Mobile Optimized Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-6">
          
          {/* Hero Card 1 (Helmets) */}
          <div className="col-span-2 md:col-span-8 group relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/80 bg-white min-h-[280px] md:min-h-[300px] flex flex-col justify-end p-5 md:p-8 shadow-xs hover:shadow-lg transition-all">
            <Image
              src={STORE_CATEGORIES[0]?.image || "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop"}
              alt="Helmets"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PC9zdmc+"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

            <div className="relative z-10 space-y-3 text-white">
              <Link href={`/products?category=${STORE_CATEGORIES[0]?.slug}`} className="inline-block">
                <h3 className="text-2xl sm:text-3xl font-black group-hover:text-brand transition-colors">
                  {STORE_CATEGORIES[0]?.name}
                </h3>
              </Link>

              {/* Subcategories Chips */}
              <div className="flex flex-wrap gap-2">
                {STORE_CATEGORIES[0]?.subcategories?.slice(0, 4).map((sub) => (
                  <Link 
                    key={sub.slug}
                    href={`/products?category=${STORE_CATEGORIES[0]?.slug}&subcategory=${sub.slug}`}
                    className="px-2.5 py-1 md:px-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/25 text-[10px] md:text-xs font-semibold text-white hover:bg-white hover:text-slate-950 transition-colors"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bento Card 2 (Jackets) */}
          <div className="col-span-2 md:col-span-4 group relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/80 bg-white min-h-[220px] md:min-h-[300px] flex flex-col justify-end p-5 md:p-6 shadow-xs hover:shadow-lg transition-all">
            <Image
              src={STORE_CATEGORIES[1]?.image || "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop"}
              alt="Riding Jackets"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PC9zdmc+"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

            <div className="relative z-10 text-white">
              <Link href={`/products?category=${STORE_CATEGORIES[1]?.slug}`} className="inline-block">
                <h3 className="text-xl font-black group-hover:text-brand transition-colors">{STORE_CATEGORIES[1]?.name}</h3>
              </Link>
            </div>
          </div>

          {/* Bento Card 3 (Boots) - Square on Mobile */}
          <div className="col-span-1 md:col-span-4 group relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/80 bg-white min-h-[160px] md:min-h-[200px] flex flex-col justify-end p-4 md:p-6 shadow-xs hover:shadow-lg transition-all">
            <Image
              src={STORE_CATEGORIES[2]?.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"}
              alt="Riding Boots"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PC9zdmc+"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

            <div className="relative z-10 text-white">
              <Link href={`/products?category=${STORE_CATEGORIES[2]?.slug}`} className="inline-block">
                <h3 className="text-sm md:text-lg font-black leading-tight group-hover:text-brand transition-colors">{STORE_CATEGORIES[2]?.name}</h3>
              </Link>
            </div>
          </div>

          {/* Bento Card 4 (Gloves) - Square on Mobile */}
          <div className="col-span-1 md:col-span-4 group relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/80 bg-white min-h-[160px] md:min-h-[200px] flex flex-col justify-end p-4 md:p-6 shadow-xs hover:shadow-lg transition-all">
            <Image
              src={STORE_CATEGORIES[3]?.image || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop"}
              alt="Riding Gloves"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PC9zdmc+"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

            <div className="relative z-10 text-white">
              <Link href={`/products?category=${STORE_CATEGORIES[3]?.slug}`} className="inline-block">
                <h3 className="text-sm md:text-lg font-black leading-tight group-hover:text-brand transition-colors">{STORE_CATEGORIES[3]?.name}</h3>
              </Link>
            </div>
          </div>

          {/* Bento Card 5 (Accessories) - Wide on Mobile */}
          <div className="col-span-2 md:col-span-4 group relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/80 bg-white min-h-[140px] md:min-h-[200px] flex flex-col justify-end p-4 md:p-6 shadow-xs hover:shadow-lg transition-all">
            <Image
              src={STORE_CATEGORIES[4]?.image || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1000&auto=format&fit=crop"}
              alt="Luggage & Accessories"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PC9zdmc+"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

            <div className="relative z-10 text-white">
              <Link href={`/products?category=${STORE_CATEGORIES[4]?.slug}`} className="inline-block">
                <h3 className="text-base md:text-lg font-black leading-tight group-hover:text-brand transition-colors">{STORE_CATEGORIES[4]?.name}</h3>
              </Link>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
