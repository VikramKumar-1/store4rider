import { Sparkles } from "lucide-react";

export default function TopMarquee() {
  // Items to display in the marquee
  const items = [
    "🔥 FLASH SALE: UP TO 40% OFF PREMIUM HELMETS",
    "🚚 FREE NATIONWIDE SHIPPING ON ORDERS OVER ₹5000",
    "✨ NEW ALPINESTARS & DAINESE DROPS JUST LANDED",
    "🛡️ 1 YEAR OFFICIAL WARRANTY ON ALL RIDING GEAR",
  ];
  
  // Duplicating items so the marquee loops seamlessly (CSS transforms by -50%)
  const duplicatedItems = [...items, ...items];

  return (
    <div className="w-full bg-slate-950 text-white overflow-hidden py-2.5 border-b border-white/10 flex items-center select-none relative z-50">
      <div className="animate-marquee flex items-center hover:animation-paused cursor-default">
        {duplicatedItems.map((text, idx) => (
          <div key={idx} className="flex items-center whitespace-nowrap">
            <span className="text-[10px] sm:text-[11px] font-black tracking-[0.25em] uppercase text-slate-300">
              {text.includes("FLASH SALE") ? (
                <span className="text-brand inline-flex items-center gap-1.5">
                  <Sparkles size={12} className="animate-pulse" /> 
                  {text}
                </span>
              ) : (
                text
              )}
            </span>
            <span className="text-white/15 mx-8 text-xs">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
