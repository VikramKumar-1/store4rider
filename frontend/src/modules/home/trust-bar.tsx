"use client";

import { memo } from "react";
import { Truck, ShieldCheck, CreditCard, Clock } from "lucide-react";

const trustItems = [
  { icon: Truck, title: "Free Shipping", subtitle: "On orders over ₹999" },
  { icon: ShieldCheck, title: "Genuine Gear", subtitle: "100% Authentic Products" },
  { icon: CreditCard, title: "Secure Payment", subtitle: "Razorpay Encrypted" },
  { icon: Clock, title: "24/7 Support", subtitle: "We're here to help" },
];

const TrustBar = () => {
  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-8">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {trustItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center gap-3">
            <div className="p-3 bg-brand/10 text-brand rounded-full">
              <item.icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base">{item.title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(TrustBar);
