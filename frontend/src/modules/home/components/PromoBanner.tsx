"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function PromoBanner() {
  return (
    <section className="relative w-full h-[360px] md:h-[420px] overflow-hidden bg-slate-950 flex items-center justify-center border-y border-slate-900">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2500&auto=format&fit=crop"
          alt="Mid Season Rider Sale"
          className="w-full h-full object-cover object-center opacity-40"
        />
      </div>

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/60 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/80 pointer-events-none" />
      
      {/* Content Container - Centered Minimalist */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-none mb-4 tracking-tighter">
            TRACK DAY <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-orange-400">SALE</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-medium mb-8 max-w-lg leading-relaxed">
            Equip yourself with elite protection. Up to <strong className="text-white">40% OFF</strong> on certified helmets, racing suits, and performance gear.
          </p>

          <div>
            <Link href="/sale">
              <button className="group relative flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-3.5 rounded-full font-black text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,51,0,0.2)] hover:shadow-[0_0_30px_rgba(255,51,0,0.4)] hover:bg-brand hover:text-white hover:scale-105 active:scale-95">
                <span>Shop The Sale</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
