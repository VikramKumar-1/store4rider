"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck, RefreshCw, Plus, Minus, Tag, Check } from "lucide-react";
import { formatPrice } from "@store4riders/shared-utils";

export default function CartPage() {
  const { items, removeItem, addItem } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  
  const subtotal = items.reduce((total, item) => {
    return total + (item.product?.basePrice || (item as any).price || 0) * item.quantity;
  }, 0);

  const discount = promoApplied ? subtotal * 0.1 : 0;
  const gst = (subtotal - discount) * 0.18;
  const total = subtotal - discount + gst;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim()) {
      setPromoApplied(true);
    }
  };

  const handleUpdateQuantity = (item: any, delta: number) => {
    if (item.quantity + delta <= 0) {
      removeItem(item.productId || item.id, item.variantId);
    } else {
      addItem({
        ...item,
        quantity: delta,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 md:pt-28 pb-32 lg:pb-20 px-3 sm:px-6 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Step Progress Stepper Bar */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-4 mb-8 sm:mb-10 text-[11px] sm:text-xs font-extrabold">
          <div className="flex items-center gap-1.5 text-brand">
            <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-black shrink-0">1</span>
            <span className="font-extrabold">Shopping Bag</span>
          </div>
          <div className="w-6 sm:w-12 h-0.5 bg-slate-200 shrink-0" />
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-black shrink-0">2</span>
            <span className="hidden sm:inline">Shipping</span>
          </div>
          <div className="w-6 sm:w-12 h-0.5 bg-slate-200 shrink-0" />
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-black shrink-0">3</span>
            <span className="hidden sm:inline">Payment</span>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-14 shadow-sm border border-slate-200/80 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 text-slate-900">Your Cart is Empty</h2>
            <p className="text-slate-500 font-medium mb-6 text-xs sm:text-sm max-w-md mx-auto">
              Explore our certified racing helmets, leather jackets, and rider accessories to gear up for your next ride.
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-brand text-white font-extrabold px-6 py-3.5 rounded-full hover:bg-brand-dark hover:scale-105 transition-all shadow-md text-xs sm:text-sm"
            >
              Explore Riding Gear <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* Active Cart State */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            
            {/* Left Column: Cart Items (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Free Express Shipping Notification */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold shadow-2xs">
                <Truck size={18} className="text-emerald-600 shrink-0" />
                <span>You've unlocked <strong className="font-black text-emerald-950">FREE Express Insured Shipping</strong> on this order!</span>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => {
                  const product: any = item.product || item;
                  const itemPrice = product.basePrice || product.price || 0;
                  const imageUrl = product.images?.[0]?.url || product.image || "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=75&w=600&auto=format&fit=crop";

                  return (
                    <div 
                      key={item.id || item.productId} 
                      className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-all hover:border-slate-300"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                          <Image 
                            src={imageUrl} 
                            alt={product.name || "Gear Item"}
                            fill
                            className="object-cover"
                          />
                          {product.brand && (
                            <span className="absolute top-1 left-1 bg-slate-900/90 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded">
                              {product.brand}
                            </span>
                          )}
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <Link href={`/products/${product.slug || product.id || "#"}`}>
                            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 line-clamp-2 hover:text-brand transition-colors leading-snug">
                              {product.name || "Premium Riding Product"}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1 mb-1.5 text-[11px] font-semibold text-slate-500">
                            <span className="text-emerald-600 font-bold">In Stock</span>
                            <span>•</span>
                            <span>Size: M</span>
                          </div>
                          <div className="font-black text-brand text-base sm:text-lg">
                            {formatPrice(itemPrice)}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        
                        {/* Quantity Pill */}
                        <div className="flex items-center gap-2.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
                          <button 
                            onClick={() => handleUpdateQuantity(item, -1)}
                            className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors shadow-2xs font-bold"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="text-xs font-black text-slate-900 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleUpdateQuantity(item, 1)}
                            className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors shadow-2xs font-bold"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Total & Remove Button */}
                        <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <span className="block text-[9px] uppercase font-bold text-slate-400">Total</span>
                            <span className="font-black text-slate-900 text-sm">{formatPrice(itemPrice * item.quantity)}</span>
                          </div>

                          <button 
                            onClick={() => removeItem(item.productId || item.id, item.variantId)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-1">
                <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-600 hover:text-brand transition-colors">
                  <ArrowRight size={13} className="rotate-180" /> Continue Shopping for More Gear
                </Link>
              </div>

            </div>

            {/* Right Column: Order Summary Bento Card (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 sticky top-28 space-y-5">
              
              <h2 className="text-lg font-black tracking-tight text-slate-900 border-b border-slate-100 pb-3">
                Order Summary
              </h2>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Promo Code (TRY 'RIDER10')"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-900 text-white hover:bg-brand text-xs font-extrabold px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
                >
                  Apply
                </button>
              </form>

              {promoApplied && (
                <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Check size={14} /> 10% Rider Discount Applied!</span>
                  <span>-{formatPrice(subtotal * 0.1)}</span>
                </div>
              )}

              {/* Detailed Breakdown */}
              <div className="space-y-2.5 text-xs font-bold text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="text-slate-900 font-extrabold">{formatPrice(subtotal)}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Promo Discount</span>
                    <span className="font-extrabold">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Tax (GST 18%)</span>
                  <span className="text-slate-900 font-extrabold">{formatPrice(gst)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="text-emerald-600 font-extrabold">FREE</span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="border-t border-slate-100 pt-3.5">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-sm font-extrabold text-slate-900">Total Amount</span>
                  <span className="text-xl sm:text-2xl font-black text-brand tracking-tight">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-slate-400 text-right">Includes all taxes & duty charges</p>
              </div>

              {/* Desktop Checkout CTA Button */}
              <Link 
                href="/checkout"
                className="hidden lg:flex w-full items-center justify-center gap-2 bg-brand text-white font-black text-sm px-6 py-3.5 rounded-2xl hover:bg-brand-dark hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-brand/20"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              {/* Trust & Assurance Badges */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-emerald-500 shrink-0" />
                  <span>256-Bit Encrypted Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-brand shrink-0" />
                  <span>Dispatched in 24 Hours via Blue Dart</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw size={15} className="text-slate-400 shrink-0" />
                  <span>7-Day Free Size Exchange Guarantee</span>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* Sticky Bottom Bar for Mobile View */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 p-3.5 px-4 flex items-center justify-between gap-3 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]">
          <div>
            <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Amount</span>
            <span className="text-lg font-black text-brand tracking-tight leading-none">
              {formatPrice(total)}
            </span>
          </div>

          <Link 
            href="/checkout"
            className="flex-1 max-w-[220px] flex items-center justify-center gap-1.5 bg-brand text-white font-black text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md hover:bg-brand-dark active:scale-95 transition-all"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
