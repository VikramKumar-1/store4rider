"use client";

import { memo } from "react";
import { ShieldCheck, Truck, RotateCcw, Zap, Award, Headphones, Star } from "lucide-react";

const ANNOUNCEMENTS = [
  { icon: Truck, text: "FREE ALL-INDIA EXPRESS SHIPPING ON ORDERS ABOVE ₹1,999" },
  { icon: ShieldCheck, text: "ECE 22.06 & D3O LEVEL 2 CERTIFIED PROTECTIVE RIDING GEAR" },
  { icon: Award, text: "100% AUTHENTIC GLOBAL BRANDS WITH WARRANTY" },
  { icon: RotateCcw, text: "7-DAY EASY REPLACEMENT & SIZE EXCHANGE" },
  { icon: Headphones, text: "EXPERT RIDER SUPPORT: +91 07795688316" },
  { icon: Zap, text: "EXCLUSIVE DISCOUNTS ON FULL-GAUNTLET GLOVES & CARBON HELMETS" },
];

const BRANDS = [
  "AGV",
  "ALPINESTARS",
  "SHOEI",
  "DAINESE",
  "REV'IT!",
  "D3O®",
  "KNOX",
  "GORE-TEX",
  "AKRAPOVIČ",
  "MOTUL",
  "ARAI",
  "TCX",
];

export function BrandMarquee() {
  return (
    <div className="w-full bg-lime-400 text-slate-950 overflow-hidden py-3 border-y border-slate-950 shadow-md">
      
      {/* Marquee Row 1: Announcements Ticker in Electric Lime Bar */}
      <div className="relative flex overflow-x-hidden select-none">
        
        {/* Infinite Scrolling Track */}
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2.5 text-xs font-black tracking-wider uppercase text-slate-950">
                <span className="w-6 h-6 rounded-full bg-slate-950 text-lime-400 flex items-center justify-center shrink-0 shadow-2xs">
                  <IconComponent size={13} />
                </span>
                <span>{item.text}</span>
                <span className="ml-6 text-slate-950 font-black">•</span>
              </div>
            );
          })}
        </div>

        {/* Gradient Fades on Edges */}
        <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-lime-400 to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-lime-400 to-transparent pointer-events-none z-10" />
      </div>

    </div>
  );
}

export function BrandLogoMarquee() {
  return (
    <section className="py-6 sm:py-7 bg-brand text-white border-y border-brand-dark/40 shadow-lg overflow-hidden">
      
      {/* Crisp Black Header Pill */}
      <div className="container mx-auto px-6 mb-2.5 text-center">
        <span className="inline-block px-5 py-1.5 rounded-full bg-white text-slate-950 text-xs font-black tracking-[0.2em] uppercase shadow-sm">
          WORLD'S TOP RIDING BRANDS
        </span>
      </div>

      {/* Clean White Company Names with Gold Star Separator */}
      <div className="relative flex overflow-x-hidden select-none">
        <div className="animate-marquee-reverse flex items-center gap-8 whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((brandName, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-8 shrink-0"
            >
              <span className="font-black tracking-widest text-sm sm:text-base text-white hover:text-slate-200 transition-colors">
                {brandName}
              </span>
              <Star size={10} className="text-amber-300 fill-amber-300 opacity-60 shrink-0" />
            </div>
          ))}
        </div>

        {/* Gradient Fades on Edges */}
        <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-brand to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-brand to-transparent pointer-events-none z-10" />
      </div>

    </section>
  );
}

export default memo(BrandMarquee);
