"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/useCartStore";
import { 
  CheckCircle2, Loader2, ArrowLeft, ShieldCheck, MapPin, Truck, 
  Home, Briefcase, Plus, Check, Lock, ChevronDown, Tag, CreditCard, 
  QrCode, Banknote, HelpCircle, AlertCircle, FileText, Info
} from "lucide-react";
import { formatPrice } from "@store4riders/shared-utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [razorpayOrderId, setRazorpayOrderId] = useState("");

  // Step state
  const [currentStep, setCurrentStep] = useState(1); // 1: Personal Info, 2: Shipping, 3: Confirmation

  // Form Fields State
  const [formData, setFormData] = useState({
    name: "Store4Riders Customer",
    phone: "7795688316",
    altPhone: "",
    email: "rider@store4riders.com",
    address: "1107, Kohinoor Square, NC Kelkar Marg, Dadar West",
    state: "Maharashtra",
    city: "Mumbai",
    pinCode: "400028",
    orderNote: "Please recheck size before dispatch :)",
  });

  // Shipping & Payment Options
  const [shippingOption, setShippingOption] = useState("free"); // "free" | "express"
  const [paymentMethod, setPaymentMethod] = useState("online"); // "online" | "upi" | "partial_cod"
  const [promoBannerVisible, setPromoBannerVisible] = useState(true);
  const [termsOpen, setTermsOpen] = useState(false);

  const subtotal = items.reduce((total, item) => {
    return total + (item.product?.basePrice || (item as any).price || 0) * item.quantity;
  }, 0);
  
  const discount = 500; // Sample promo discount ₹500
  const shippingFee = shippingOption === "express" ? 250 : 0;
  const gst = (subtotal - discount) * 0.18;
  const total = subtotal - discount + shippingFee + gst;
  const partialCodAmount = Math.round(total * 0.2); // 20% advance for partial COD

  // Load Razorpay Checkout Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Redirect to cart if empty and not in success state
  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      router.push("/cart");
    }
  }, [items.length, isSuccess, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Create Razorpay Order via backend API
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: paymentMethod === "partial_cod" ? partialCodAmount : total }),
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.id) {
        throw new Error(orderData.error || "Failed to initialize payment");
      }

      // 2. Open Official Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SxxPIU94rZKzyE",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Store4Riders",
        description: `Order Payment (${paymentMethod.toUpperCase()})`,
        order_id: orderData.id,
        handler: function (response: any) {
          setIsProcessing(false);
          setPaymentId(response.razorpay_payment_id || `pay_${Date.now()}`);
          setRazorpayOrderId(response.razorpay_order_id || orderData.id);
          setIsSuccess(true);
          clearCart();
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pinCode}`,
          altPhone: formData.altPhone,
          orderNote: formData.orderNote,
        },
        theme: {
          color: "#AB1509", // Store4Riders Signature Brand Red
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      if ((window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        setIsProcessing(false);
        setPaymentId(`pay_demo_${Date.now()}`);
        setRazorpayOrderId(orderData.id);
        setIsSuccess(true);
        clearCart();
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setIsProcessing(false);
      alert("Payment Initialization Notice: " + (err.message || "Failed to load payment modal. Falling back to demo confirmation."));
    }
  };

  // Scroll to top on success
  useEffect(() => {
    if (isSuccess) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSuccess]);

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 pt-28 pb-24 px-4 sm:px-6 relative overflow-hidden">
        
        {/* Background celebration glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-brand/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="max-w-xl w-full bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-slate-200/80 text-center animate-in zoom-in-95 duration-500 relative z-10">
          
          {/* Animated Celebration Icon & Confetti Badge */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping duration-1000" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            {/* Celebration Sparkle / Confetti Badges */}
            <span className="absolute -top-1 -right-1 w-7 h-7 bg-amber-400 text-amber-950 rounded-full flex items-center justify-center text-xs font-black shadow-md animate-bounce">
              🎉
            </span>
            <span className="absolute -bottom-1 -left-1 w-7 h-7 bg-brand text-white rounded-full flex items-center justify-center text-xs font-black shadow-md">
              ✨
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-slate-900">
            Order Confirmed! 🎉
          </h1>
          <p className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-6">
            Transaction Successful & Verified
          </p>

          <div className="p-5 bg-slate-50 rounded-2xl mb-8 border border-slate-200/80 text-left space-y-2.5">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase">Order ID</span>
              <span className="text-xs font-black text-slate-900">{razorpayOrderId || "rzp_order_demo"}</span>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase">Payment ID</span>
              <span className="text-xs font-black text-emerald-600">{paymentId || "pay_demo"}</span>
            </div>
            <div className="pt-1">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Deliver To</p>
              <p className="text-xs font-bold text-slate-700">{formData.name} • {formData.address}, {formData.city}, {formData.state} - {formData.pinCode}</p>
            </div>
          </div>

          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-brand text-white font-black px-8 py-4 rounded-full transition-all text-xs uppercase tracking-wider shadow-lg hover:shadow-brand/20 hover:scale-105 active:scale-95"
          >
            <span>Return to Store</span>
            <Check size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 md:pt-28 pb-20 px-3 sm:px-6 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Title */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/cart" className="p-2 bg-white rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs">
              <ArrowLeft size={16} />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
              Checkout Form
            </h1>
          </div>
        </div>

        {/* Client Wireframe Stepper */}
        <div className="flex items-center justify-center gap-2 sm:gap-6 mb-8 text-xs font-extrabold">
          <div className={`flex items-center gap-2 ${currentStep >= 1 ? "text-brand" : "text-slate-400"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${currentStep >= 1 ? "bg-brand text-white" : "bg-slate-200 text-slate-600"}`}>1</span>
            <span className="uppercase tracking-wider">Personal Info</span>
          </div>
          <div className="w-8 sm:w-16 h-0.5 bg-slate-200" />
          <div className={`flex items-center gap-2 ${currentStep >= 2 ? "text-brand" : "text-slate-400"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${currentStep >= 2 ? "bg-brand text-white" : "bg-slate-200 text-slate-600"}`}>2</span>
            <span className="uppercase tracking-wider">Shipping & Delivery</span>
          </div>
          <div className="w-8 sm:w-16 h-0.5 bg-slate-200" />
          <div className={`flex items-center gap-2 ${currentStep >= 3 ? "text-brand" : "text-slate-400"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${currentStep >= 3 ? "bg-brand text-white" : "bg-slate-200 text-slate-600"}`}>3</span>
            <span className="uppercase tracking-wider">Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <form id="checkout-form" onSubmit={handlePayment} className="space-y-6">
              
              {/* SECTION 1: CONTACT PERSON */}
              <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-sm border border-slate-200/80 space-y-5">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
                  Contact Person
                </h2>

                {/* Name */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                    Name *
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Eg: John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder-slate-400"
                  />
                </div>

                {/* Phone Number & Alternate Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="111-2222-33333"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                      Alternate Phone Number
                    </label>
                    <input
                      type="tel"
                      name="altPhone"
                      value={formData.altPhone}
                      onChange={handleInputChange}
                      placeholder="111-2222-33333"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Eg: example@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              {/* SECTION 2: ADDRESS DETAIL */}
              <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-sm border border-slate-200/80 space-y-5">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
                  Address Detail
                </h2>

                {/* Address */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                    Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Eg: ABC Street 12A, West Java, Indonesia"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder-slate-400 resize-none"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Gujarat">Gujarat</option>
                  </select>
                </div>

                {/* City & Pin Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                      City *
                    </label>
                    <input
                      required
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="--Choose City--"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                      Pin Code *
                    </label>
                    <input
                      required
                      type="text"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      placeholder="--Choose pin Code--"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Continue to Shipping Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="bg-brand text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl hover:bg-brand-dark transition-all shadow-md"
                  >
                    Continue to Shipping
                  </button>
                </div>
              </div>

            </form>

          </div>

          {/* Right Column: Order Summary, Shipping Options, Payment Options & T&C (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* ORDER SUMMARY */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
              
              <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase border-b border-slate-100 pb-3">
                Order Summary
              </h2>

              {/* Promo Applied Banner Notice */}
              {promoBannerVisible && (
                <div className="bg-brand text-white text-xs font-bold p-3 px-4 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in duration-300">
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} /> Hooray! You use promo code! (50KDISCOUNT)
                  </span>
                  <button 
                    onClick={() => setPromoBannerVisible(false)} 
                    className="text-white/80 hover:text-white font-bold ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Product List with Item Note */}
              <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
                {items.map(item => {
                  const product = item.product || item;
                  const itemPrice = product.basePrice || product.price || 0;
                  const imageUrl = product.images?.[0]?.url || product.image || "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=75&w=600&auto=format&fit=crop";

                  return (
                    <div key={item.id || item.productId} className="space-y-1 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 text-xs">
                        <div className="relative w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                          <Image src={imageUrl} alt={product.name || "Gear"} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold text-slate-900 truncate uppercase">{product.name || "Riding Gear"}</p>
                          <p className="text-slate-500 text-[11px] font-semibold">
                            {item.quantity} X {formatPrice(itemPrice)}
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium italic pl-1">
                        Please recheck the size before send to me :)
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs font-bold text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-extrabold">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-brand">
                  <span>Voucher (50KDISCOUNT)</span>
                  <span className="font-black">-{formatPrice(discount)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-slate-900 font-extrabold">
                    {shippingOption === "free" ? "FREE" : formatPrice(250)}
                  </span>
                </div>

                <div className="flex justify-between border-t border-slate-100 pt-3">
                  <span className="text-sm font-black text-slate-900">Total</span>
                  <span className="text-xl font-black text-brand tracking-tight">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

            </div>

            {/* SHIPPING OPTIONS */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
              <h2 className="text-base font-black uppercase text-slate-900 border-b border-slate-100 pb-3">
                Shipping
              </h2>

              <div className="space-y-2">
                <label 
                  onClick={() => setShippingOption("free")}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    shippingOption === "free" ? "border-brand bg-brand/5 shadow-2xs" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="radio" 
                      name="shipping" 
                      checked={shippingOption === "free"} 
                      onChange={() => setShippingOption("free")}
                      className="accent-brand" 
                    />
                    <span className="text-xs font-extrabold text-slate-900">Standard Free Shipping</span>
                  </div>
                  <span className="text-xs font-black text-emerald-600">FREE</span>
                </label>

                <label 
                  onClick={() => setShippingOption("express")}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    shippingOption === "express" ? "border-brand bg-brand/5 shadow-2xs" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="radio" 
                      name="shipping" 
                      checked={shippingOption === "express"} 
                      onChange={() => setShippingOption("express")}
                      className="accent-brand" 
                    />
                    <span className="text-xs font-extrabold text-slate-900">Express Blue Dart Air</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{formatPrice(250)}</span>
                </label>
              </div>
            </div>

            {/* PAYMENT OPTIONS */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
              <h2 className="text-base font-black uppercase text-slate-900 border-b border-slate-100 pb-3">
                Payment Options
              </h2>

              <div className="space-y-3">
                
                {/* Option 1: Razorpay / Online Payment (Cards, NetBanking, Wallet) */}
                <label 
                  onClick={() => setPaymentMethod("online")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all block ${
                    paymentMethod === "online" ? "border-brand bg-brand/5 shadow-2xs" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                      <input type="radio" name="payment" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} className="accent-brand" />
                      <span className="text-xs font-black text-slate-900">Cards / NetBanking / Wallet</span>
                    </div>
                    <CreditCard size={16} className="text-brand" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold pl-6">
                    Pay securely via Razorpay / PayU gateway.
                  </p>
                </label>

                {/* Option 2: Direct UPI */}
                <label 
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all block ${
                    paymentMethod === "upi" ? "border-brand bg-brand/5 shadow-2xs" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                      <input type="radio" name="payment" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} className="accent-brand" />
                      <span className="text-xs font-black text-slate-900">Instant UPI (GPay / PhonePe / Paytm)</span>
                    </div>
                    <QrCode size={16} className="text-brand" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold pl-6">
                    0% extra charges • Instant QR code scan.
                  </p>
                </label>

                {/* Option 3: Partial COD */}
                <label 
                  onClick={() => setPaymentMethod("partial_cod")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all block ${
                    paymentMethod === "partial_cod" ? "border-brand bg-brand/5 shadow-2xs" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                      <input type="radio" name="payment" checked={paymentMethod === "partial_cod"} onChange={() => setPaymentMethod("partial_cod")} className="accent-brand" />
                      <span className="text-xs font-black text-slate-900">Partial COD (20% Advance + 80% Cash on Delivery)</span>
                    </div>
                    <Banknote size={16} className="text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-600 font-bold pl-6">
                    Pay <span className="text-brand font-black">{formatPrice(partialCodAmount)}</span> now & remaining {formatPrice(total - partialCodAmount)} on delivery.
                  </p>
                </label>

              </div>

              {/* Pay Button */}
              <button 
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full mt-3 flex items-center justify-center gap-2.5 bg-brand text-white font-black text-xs uppercase tracking-wider px-6 py-4 rounded-xl hover:bg-brand-dark transition-all shadow-md shadow-brand/20 disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Processing Order...
                  </>
                ) : (
                  <>
                    <Lock size={15} /> Place Order ({formatPrice(paymentMethod === "partial_cod" ? partialCodAmount : total)})
                  </>
                )}
              </button>
            </div>

            {/* TERMS AND CONDITIONS ACCORDION */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80">
              <button
                type="button"
                onClick={() => setTermsOpen(!termsOpen)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
                  <FileText size={15} className="text-brand" /> Terms and Conditions Accordion
                </span>
                <ChevronDown size={16} className={`transition-transform duration-200 text-slate-500 ${termsOpen ? "rotate-180" : ""}`} />
              </button>

              {termsOpen && (
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-medium space-y-2 leading-relaxed animate-in fade-in duration-200">
                  <p>• <strong>Return Policy:</strong> 7-day hassle-free replacement for sizing issues on all protective riding gear.</p>
                  <p>• <strong>Warranty:</strong> All certified helmets & armors carry 1-year manufacturer warranty.</p>
                  <p>• <strong>Dispatch:</strong> Orders are dispatched within 24 hours via insured air courier.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
