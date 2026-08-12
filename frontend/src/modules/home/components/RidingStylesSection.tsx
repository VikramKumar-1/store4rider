"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Shield, Gauge } from "lucide-react";

const RIDING_DISCIPLINES = [
  {
    id: "track",
    title: "Track & Circuit Racing",
    icon: Gauge,
    tag: "TRACK READY",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop",
    link: "/products?category=track-racing",
  },
  {
    id: "touring",
    title: "Himalayan & Adventure Touring",
    icon: Compass,
    tag: "ALL-TERRAIN",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop",
    link: "/products?category=touring",
  },
  {
    id: "urban",
    title: "Urban & Daily Commute",
    icon: Shield,
    tag: "STREET PROTECTION",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
    link: "/products?category=urban",
  },
];

export function RidingStylesSection() {
  return (
    <section className="py-16 bg-[#f8fafc] text-slate-950 border-b border-slate-200">
      
      <div className="container mx-auto px-6">
        
        {/* Minimal Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
            Riding Terrain Showcase
          </h2>
        </div>

        {/* 3 Light Discipline Cards (Slider on Mobile, Grid on Desktop) */}
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-pl-6 scrollbar-none pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 after:content-[''] after:w-1 after:flex-none md:after:hidden">
          {RIDING_DISCIPLINES.map((style) => {
            const Icon = style.icon;
            return (
              <div 
                key={style.id}
                className="w-[80vw] md:w-auto flex-none snap-start group relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/80 bg-white min-h-[260px] md:min-h-[340px] flex flex-col justify-between p-5 md:p-6 shadow-xs hover:shadow-lg transition-all duration-300"
              >
                {/* Background Image */}
                <Image
                  src={style.image}
                  alt={style.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Dark Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                {/* Top Icon */}
                <div className="relative z-10 flex items-center justify-end">
                  <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white">
                    <Icon size={18} />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 space-y-1.5 md:space-y-2 text-white">
                  <h3 className="text-lg md:text-xl font-black leading-snug">
                    {style.title}
                  </h3>
                  
                  <div>
                    <Link href={style.link}>
                      <button className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-brand transition-colors pt-1">
                        <span>Explore Discipline</span>
                        <ArrowRight size={14} />
                      </button>
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
