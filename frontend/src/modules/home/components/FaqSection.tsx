"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "How do I know my correct helmet or jacket size before ordering?",
    a: "Measure around your forehead (just above eyebrows) for helmets, or your chest circumference for jackets. Each product page features an exact brand size chart. If you're between sizes, our rider support team can guide you to the perfect fit.",
  },
  {
    q: "Are all helmets and armor certified for track and highway use?",
    a: "Yes, 100% of our riding gear is sourced directly from authorized brand importers and meets ECE 22.06, FIM, or CE Level 2 safety homologations. We do not sell counterfeit or uncertified gear.",
  },
  {
    q: "How does the 7-Day Size Exchange policy work?",
    a: "If your helmet or riding jacket doesn't fit comfortably, initiate a size exchange within 7 days of delivery through your account or WhatsApp support. As long as tags remain intact and gear is unused, we'll arrange a free reverse pickup and deliver your new size.",
  },
  {
    q: "How long does express shipping take across India?",
    a: "All orders are dispatched within 24 hours. Deliveries to metro cities take 2–3 business days, while all other locations across India take 4–5 business days. You will receive live WhatsApp & SMS tracking upon dispatch.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-[#f8fafc] text-slate-950 border-t border-slate-200">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Section Header */}
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        {/* 2-2 Horizontal Pair Grid of Rectangular Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div 
                key={i} 
                className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-2xs ${
                  isOpen ? "border-slate-300 shadow-sm" : "border-slate-200/90 hover:border-slate-300"
                }`}
              >
                {/* Question Row */}
                <button
                  onClick={() => toggle(i)}
                  className="w-full text-left flex items-center justify-between gap-4 group cursor-pointer"
                >
                  <span className={`font-extrabold text-sm sm:text-base leading-snug transition-colors ${
                    isOpen ? "text-brand" : "text-slate-900 group-hover:text-brand"
                  }`}>
                    {faq.q}
                  </span>

                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? "bg-brand text-white shadow-xs" : "bg-slate-100 text-slate-600 group-hover:bg-slate-900 group-hover:text-white"
                  }`}>
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </button>

                {/* Answer in a distinct light rectangular box below */}
                {isOpen && (
                  <div className="mt-3.5 bg-slate-100/90 border border-slate-200/80 rounded-xl p-4 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
