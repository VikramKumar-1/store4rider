"use client";

import { ArrowRight } from "lucide-react";

export function BrandTrustSection() {
  return (
    <section className="bg-slate-50 border-y border-slate-200 py-8 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Sporty Dark, Lime & Red Theme */}
        <div className="w-full bg-slate-950 rounded-[2rem] p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 relative overflow-hidden shadow-2xl shadow-slate-950/40 border border-slate-800">
          
          {/* Glowing Overlays: Lime & Red */}
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-lime-500/20 blur-xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-brand/20 blur-xl rounded-full pointer-events-none" />

          {/* Left-Aligned Text Content */}
          <div className="text-left relative z-10 max-w-xl">
            <span className="inline-block px-3 py-1 bg-lime-500/10 border border-lime-500/30 rounded-full text-[10px] font-black tracking-widest text-lime-400 uppercase mb-4 shadow-sm">
              JOIN THE RIDER CLUB
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2 leading-tight">
              Get Early Access To Sales & Drops
            </h2>
            <p className="text-sm text-slate-300 font-medium max-w-md">
              Subscribe to get notified about restocks, exclusive rider discounts, and limited gear drops.
            </p>
          </div>

        {/* Form */}
        <div className="w-full md:w-auto relative z-10 shrink-0 mt-2 md:mt-0">
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full sm:w-64 lg:w-72 bg-white/5 border border-white/10 text-white placeholder-slate-500 px-5 py-3.5 rounded-2xl text-sm font-semibold focus:outline-none hover:border-brand/50 focus:border-brand focus:ring-2 focus:ring-brand/50 transition-all shadow-inner"
            />
            <button 
              type="submit"
              className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white px-8 py-3.5 rounded-2xl font-black text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-brand/30 hover:-translate-y-0.5 active:translate-y-0 shrink-0 flex items-center justify-center gap-2"
            >
              <span>Subscribe</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </form>
        </div>
        </div>

      </div>
    </section>
  );
}
