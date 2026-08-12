"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const HERO_POSTERS = [
  {
    id: 1,
    tag: "NEW DROP 2026",
    title: "Clan Stealth Waterproof Boots",
    price: "₹44,999",
    cta: "View Product Description",
    slug: "alpinestars-supertech-r-boots",
    link: "/products/alpinestars-supertech-r-boots",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 2,
    tag: "FLAGSHIP RELEASE",
    title: "Apex Carbon Fiber GP Helmet",
    price: "₹1,29,999",
    cta: "View Product Description",
    slug: "agv-pista-gp-rr",
    link: "/products/agv-pista-gp-rr",
    image: "/images/agv-helmet.png",
  },
  {
    id: 3,
    tag: "LIMITED EDITION",
    title: "Adventure Pro D3O Armor Jacket",
    price: "₹54,999",
    cta: "View Product Description",
    slug: "dainese-racing-4",
    link: "/products/dainese-racing-4",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=2000&auto=format&fit=crop",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_POSTERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const poster = HERO_POSTERS[currentSlide];

  return (
    <section className="relative md:pt-24 md:pb-16 bg-slate-100/70 border-b border-slate-200/80">
      
      <div className="md:container md:mx-auto md:px-6">
        
        {/* Full-bleed on mobile, rounded card on desktop */}
        <div className="relative md:rounded-3xl overflow-hidden h-[65dvh] min-h-[420px] md:h-auto md:min-h-[500px] lg:min-h-[600px] bg-slate-900 md:border md:border-slate-200/80 md:shadow-xl flex items-end p-6 pb-12 md:p-12">
          
          {/* Background Images - Direct Click to Product Description */}
          {HERO_POSTERS.map((p, idx) => (
            <Link
              key={p.id}
              href={p.link}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer ${
                currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={p.image}
                alt={p.title}
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
                priority={idx === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            </Link>
          ))}

          {/* Minimal Overlay Content */}
          <div className="relative z-20 w-full flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 pointer-events-none">
            
            <div className="space-y-1.5 md:space-y-2 max-w-lg pointer-events-auto">
              <Link href={poster.link}>
                <span className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 bg-white/20 backdrop-blur-md border border-white/25 rounded-full text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-colors">
                  {poster.tag}
                </span>
                <h1 className="text-2xl sm:text-5xl font-black tracking-tight text-white leading-tight mt-1.5 md:mt-2 transition-colors">
                  {poster.title}
                </h1>
              </Link>
              <div className="text-lg sm:text-2xl font-black text-white md:pt-1">
                {poster.price}
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4 pointer-events-auto">
              <Link href={poster.link}>
                <button className="inline-flex items-center gap-1.5 md:gap-2 bg-brand hover:bg-brand-dark text-white px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-brand/30 hover:scale-105 active:scale-95">
                  <span>{poster.cta}</span>
                  <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                </button>
              </Link>

              {/* Prev / Next Slider Controls */}
              <div className="flex items-center gap-1.5 md:gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev === 0 ? HERO_POSTERS.length - 1 : prev - 1));
                  }}
                  aria-label="Previous poster"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev + 1) % HERO_POSTERS.length);
                  }}
                  aria-label="Next poster"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
