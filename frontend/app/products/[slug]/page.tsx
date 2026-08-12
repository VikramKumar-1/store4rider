"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Star, ShieldCheck, Truck, RotateCcw, Check, ShoppingCart, 
  ArrowLeft, ArrowRight, ZoomIn, Loader2, ChevronDown, ChevronUp, Ruler, 
  Sparkles, ThumbsUp, MessageSquare, Tag, X, Copy, Percent
} from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { formatPrice } from "@store4riders/shared-utils";
import ProductCard from "@/components/ProductCard";

const availableCoupons = [
  { code: "RIDER10", discount: "10% OFF", desc: "Get 10% Instant Discount on all riding gear", minOrder: "₹1,999" },
  { code: "STORE4RIDERS", discount: "₹500 OFF", desc: "Flat ₹500 OFF on premium jackets & boots", minOrder: "₹4,999" },
  { code: "FREESHIP", discount: "FREE SHIPPING", desc: "100% Free Express Shipping across India", minOrder: "₹999" },
  { code: "HELMET200", discount: "₹200 OFF", desc: "Flat ₹200 discount on helmets & visors", minOrder: "₹2,499" },
];

const defaultFallbackProduct = {
  id: "clan-frml-1",
  slug: "clan-frml-1",
  name: "Clan FRML 1 Riding Jacket",
  brand: "Clan",
  basePrice: 3650,
  category: "Jackets",
  images: [
    { url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop", altText: "Clan FRML 1 Riding Jacket Front" },
    { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop", altText: "Clan FRML 1 Riding Jacket Angle" },
  ],
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "agv-pista-gp-rr";
  
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Stealth Black");
  
  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // UI states for client wireframe features
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState("RIDER10");
  const [couponToast, setCouponToast] = useState("");

  // Fetch actual data from API with instant fallback guarantee
  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch("/api/catalog");
        const data = await res.json();
        if (data?.products && data.products.length > 0) {
          setAllProducts(data.products);
          const found = data.products.find((p: any) => p.slug === slug || p.id === slug);
          setProduct(found || data.products[0]);
        } else {
          setProduct(defaultFallbackProduct);
          setAllProducts([defaultFallbackProduct]);
        }
      } catch (err) {
        console.error("Failed to fetch product detail:", err);
        setProduct(defaultFallbackProduct);
        setAllProducts([defaultFallbackProduct]);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: crypto.randomUUID(),
      productId: slug,
      quantity: 1,
      product: {
        id: slug,
        name: product.name,
        brand: product.brand,
        basePrice: product.basePrice,
        images: [{ url: product.images?.[activeImageIndex]?.url || product.images?.[0]?.url }],
        slug: slug,
      },
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem({
      id: crypto.randomUUID(),
      productId: slug,
      quantity: 1,
      product: {
        id: slug,
        name: product.name,
        brand: product.brand,
        basePrice: product.basePrice,
        images: [{ url: product.images?.[activeImageIndex]?.url || product.images?.[0]?.url }],
        slug: slug,
      },
    });
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-[80vh] flex flex-col items-center justify-center pt-28 pb-20">
        <Loader2 className="w-12 h-12 animate-spin text-brand mb-4" />
        <h2 className="text-xl font-black text-slate-900">Loading Product Specs...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-slate-50 min-h-[80vh] flex flex-col items-center justify-center pt-28 pb-20 px-6 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Product Not Found</h1>
        <Link href="/products" className="px-8 py-3 bg-brand text-white font-black rounded-xl hover:bg-brand-dark transition-colors">
          Browse All Gear
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0 
    ? product.images 
    : [{ url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop", altText: product.name }];

  const kitProducts = allProducts.slice(0, 3);
  const upSellProducts = allProducts.slice(3, 5);

  return (
    <div className="bg-slate-50 min-h-screen pt-24 md:pt-28 pb-24 lg:pb-12 px-3 sm:px-6 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <Link href="/products" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand transition-colors mb-4">
          <ArrowLeft size={16} /> Back to Products
        </Link>

        {/* MAIN PRODUCT HERO CARD */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-12">
          
          {/* Left Column: Side Gallery (6 cols) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails */}
            <div className="flex flex-row sm:flex-col gap-3 overflow-x-auto shrink-0 scrollbar-none">
              {images.map((img: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-50 shrink-0 ${
                    activeImageIndex === index
                      ? "border-brand shadow-md ring-2 ring-brand/30"
                      : "border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt={`${product.name} ${index + 1}`} fill className="object-contain p-1" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative aspect-square flex-1 w-full rounded-2xl bg-white flex items-center justify-center p-4 overflow-hidden border border-slate-200 shadow-sm">
              <Image
                src={images[activeImageIndex]?.url}
                alt={product.name}
                fill
                priority
                className="object-contain p-4 hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-brand text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md z-10">
                {product.brand}
              </span>
            </div>

          </div>

          {/* Right Column: Info & Description */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="text-slate-900 font-extrabold">4.8</span>
                <span className="text-slate-400 font-normal">(795 Verified Rider Reviews)</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-3">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-black text-brand">{formatPrice(product.basePrice)}</span>
                <span className="text-xs font-bold text-slate-400">MRP Inclusive of all taxes</span>
              </div>

              {/* DESCRIPTION WITH VIEW MORE / SEE LESS BUTTON */}
              <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Description</h3>
                <div className={`text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold transition-all ${showFullDesc ? "" : "line-clamp-3"}`}>
                  {product.description || "Authentic certified motorcycle protective gear built with high-density D3O impact armor, ECE certification, and reinforced abrasion-resistant fabrics for maximum rider safety on track and highway."}
                </div>
                <button
                  type="button"
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="mt-2 text-xs font-extrabold text-brand hover:underline flex items-center gap-1 uppercase tracking-wider"
                >
                  {showFullDesc ? (
                    <><span>See Less</span> <ChevronUp size={14} /></>
                  ) : (
                    <><span>View More</span> <ChevronDown size={14} /></>
                  )}
                </button>
              </div>

              {/* Flipkart Style Color Swatch Selector */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700">Select Color</label>
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">{selectedColor}</span>
                  </div>
                  
                  {/* Flipkart Swatch Boxes */}
                  <div className="flex items-center gap-3">
                    {[
                      { name: "Stealth Black", hex: "bg-slate-950", border: "border-slate-900" },
                      { name: "Racing Red", hex: "bg-brand", border: "border-brand" },
                      { name: "Matte Gray", hex: "bg-slate-500", border: "border-slate-500" },
                      { name: "Neon Lime", hex: "bg-lime-500", border: "border-lime-500" },
                    ].map((col) => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col.name)}
                        title={col.name}
                        className={`relative w-10 h-10 rounded-xl ${col.hex} flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer ${
                          selectedColor === col.name
                            ? "ring-4 ring-slate-950/20 scale-110 shadow-md"
                            : "hover:scale-105 opacity-85 hover:opacity-100"
                        }`}
                      >
                        {selectedColor === col.name && (
                          <Check size={16} className={col.name === "Neon Lime" ? "text-slate-950 font-black" : "text-white font-black"} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700">Size</label>
                    <button 
                      onClick={() => setShowSizeChart(!showSizeChart)}
                      className="text-xs font-extrabold text-brand hover:underline flex items-center gap-1"
                    >
                      <Ruler size={13} /> Size Guide
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {["S", "M", "L", "XL", "XXL"].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-10 h-10 rounded-xl text-xs font-extrabold border transition-all ${
                          selectedSize === sz ? "bg-slate-900 text-white border-slate-900 shadow-sm" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Size Chart Modal Preview */}
              {showSizeChart && (
                <div className="mb-6 p-4 bg-brand/5 border border-brand/20 rounded-2xl text-xs space-y-2 animate-in fade-in">
                  <div className="flex justify-between font-black text-slate-900">
                    <span>Rider Size Guide (Chest / Waist)</span>
                    <button onClick={() => setShowSizeChart(false)} className="text-slate-400">✕</button>
                  </div>
                  <div className="grid grid-cols-5 text-center font-semibold text-slate-600 gap-1 pt-1">
                    <span className="bg-white p-1.5 rounded border">S: 38"</span>
                    <span className="bg-white p-1.5 rounded border">M: 40"</span>
                    <span className="bg-white p-1.5 rounded border">L: 42"</span>
                    <span className="bg-white p-1.5 rounded border">XL: 44"</span>
                    <span className="bg-white p-1.5 rounded border">2XL: 46"</span>
                  </div>
                </div>
              )}
            </div>

            {/* Main Add To Cart CTA Button */}
            <div>
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isAdded ? "bg-emerald-600 text-white" : "bg-brand hover:bg-brand-dark text-white shadow-brand/25"
                }`}
              >
                {isAdded ? (
                  <><Check size={18} /> Added to Cart!</>
                ) : (
                  <><ShoppingCart size={18} /> ADD TO CART — {formatPrice(product.basePrice)}</>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* CLIENT FEATURE: COMPLETE YOUR KIT */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
              COMPLETE YOUR KIT
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Essential gear to pair with this item for full protection
            </p>
          </div>

          {/* Horizontal Swipeable Slider on Mobile, Grid on Desktop */}
          <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
            {kitProducts.map((item: any) => (
              <div key={item.id || item._id} className="min-w-[260px] sm:min-w-0 snap-start">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </section>

        {/* CLIENT FEATURE: PRODUCT DETAIL DESCRIPTION */}
        <section className="mb-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-lg font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
            PRODUCT DETAIL DESCRIPTION
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 font-semibold leading-relaxed">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="font-black text-slate-900 uppercase mb-1">Impact Armor</h4>
              <p>CE Level 2 certified D3O armors on shoulders and elbows with back protector pocket.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="font-black text-slate-900 uppercase mb-1">Abrasion Shell</h4>
              <p>600D Heavy Duty Polyester Shell with double stitched safety seams at crash zones.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="font-black text-slate-900 uppercase mb-1">Thermal Liner</h4>
              <p>Includes detachable 100% waterproof thermal liner for all-weather riding.</p>
            </div>
          </div>
        </section>

        {/* CLIENT FEATURE: UP SELL PRODUCTS */}
        <section className="mb-8">
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-4">
            UP SELL PRODUCTS
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {upSellProducts.map((item: any) => (
              <ProductCard key={item.id || item._id} product={item} />
            ))}
          </div>
        </section>

        {/* CLIENT FEATURE: PRODUCT REVIEWS */}
        <section id="reviews-section" className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">
                PRODUCT REVIEWS
              </h2>
              <p className="text-xs text-slate-500 font-semibold">Verified Feedback from Real Riders</p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/80 self-start sm:self-auto">
              <Star size={13} fill="currentColor" className="text-amber-400" /> 4.8 / 5 Rating (795 Reviews)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">VR</div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 block">Vikram R.</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Verified Rider</span>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
              </div>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                "Top notch protection! Rode 800km in heavy rain, stayed completely dry. The fit is perfect for Indian riding conditions."
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand text-white font-black text-xs flex items-center justify-center">AR</div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 block">Amit S.</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Verified Rider</span>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
              </div>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                "Build quality feels premium. D3O armor gives immense confidence on highway corners. Worth every rupee!"
              </p>
            </div>

            {/* Extra Reviews shown when expanded */}
            {showAllReviews && (
              <>
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-black text-xs flex items-center justify-center">RK</div>
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 block">Rahul K.</span>
                        <span className="text-[10px] text-emerald-600 font-bold">Verified Rider</span>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    "Excellent airflow during summer rides. The inner liner is super soft and breathable."
                  </p>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-black text-xs flex items-center justify-center">MK</div>
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 block">Manish K.</span>
                        <span className="text-[10px] text-emerald-600 font-bold">Verified Rider</span>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    "Fast shipping by Store4Riders! Product delivered in 36 hours in Dadar."
                  </p>
                </div>
              </>
            )}
          </div>

          {/* VIEW MORE REVIEWS BUTTON */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                if (showAllReviews) {
                  setShowAllReviews(false);
                  document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  setShowAllReviews(true);
                }
              }}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl border border-slate-200 transition-all shadow-2xs"
            >
              {showAllReviews ? (
                <><span>See Less</span> <ChevronUp size={14} /></>
              ) : (
                <><span>View All 795 Reviews</span> <ChevronDown size={14} /></>
              )}
            </button>
          </div>
        </section>

      </div>

      {/* FLOATING CENTERED "SEE LESS REVIEWS" PILL BUTTON WHEN REVIEWS ARE EXPANDED */}
      {showAllReviews && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in zoom-in-95 duration-200">
          <button
            type="button"
            onClick={() => {
              setShowAllReviews(false);
              document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-slate-950/90 text-white hover:bg-brand text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>See Less Reviews</span>
            <ChevronUp size={14} />
          </button>
        </div>
      )}

      {/* STICKY FLOATING FOOTER BAR FOR MOBILE (lg:hidden to prevent desktop stretching) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center">
        
        {/* Blinkit Style Brand Red Coupon Badge - Clickable to open Promo Modal */}
        <button
          type="button"
          onClick={() => setShowPromoModal(true)}
          className="bg-brand hover:bg-brand-dark text-white text-[10px] font-black uppercase tracking-wider py-1 px-4 rounded-t-xl shadow-md border-t border-x border-white/20 flex items-center gap-1.5 animate-in slide-in-from-bottom-2 duration-300 cursor-pointer active:scale-95 transition-all"
        >
          <Tag size={11} className="text-white" />
          <span>USE <strong className="underline underline-offset-2 font-black">{appliedCoupon}</strong> FOR OFFERS • TAP TO VIEW ALL ({availableCoupons.length})</span>
        </button>

        {/* Action Bar Container */}
        <div className="w-full bg-white/95 backdrop-blur-xl border-t border-slate-200/90 p-2.5 px-4 flex items-center justify-between gap-2 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
          
          {/* Price on Left */}
          <div className="min-w-0 shrink-0">
            <span className="text-[9px] font-bold text-slate-400 block uppercase">Total Price</span>
            <span className="text-base font-black text-brand tracking-tight leading-none">
              {formatPrice(product.basePrice)}
            </span>
          </div>

          {/* Size, Add To Cart, Buy Now */}
          <div className="flex items-center gap-1.5 shrink-0">
            
            {/* Compact Size Liquid Glass Pill (Just 'M ▾') */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                className="liquid-glass-soft-dark text-white text-xs font-black px-2.5 py-2 rounded-xl flex items-center gap-1 shadow-sm hover:scale-105 transition-all border border-white/20 cursor-pointer"
              >
                <span>{selectedSize}</span>
                <ChevronUp size={11} className={`transition-transform duration-200 ${showSizeDropdown ? "" : "rotate-180"}`} />
              </button>

              {/* Liquid Glass Size Menu */}
              {showSizeDropdown && (
                <div className="absolute bottom-full mb-2 right-0 liquid-glass-soft-dark-menu rounded-2xl p-2 shadow-2xl min-w-[120px] z-50 animate-in zoom-in-95 duration-150 text-white">
                  <span className="block text-[9px] font-black uppercase text-slate-300 tracking-widest px-2 py-1 mb-1 border-b border-white/10">
                    Select Size
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    {["S", "M", "L", "XL", "XXL"].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          setSelectedSize(sz);
                          setShowSizeDropdown(false);
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center justify-between transition-all cursor-pointer ${
                          selectedSize === sz
                            ? "bg-brand text-white shadow-md"
                            : "hover:bg-white/15 text-slate-200"
                        }`}
                      >
                        <span>Size {sz}</span>
                        {selectedSize === sz && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`p-2.5 rounded-xl font-black text-xs uppercase transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${
                isAdded ? "bg-emerald-600 text-white shadow-emerald-500/25" : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
              title="Add to Cart"
            >
              {isAdded ? <Check size={15} /> : <ShoppingCart size={15} />}
              <span className="hidden sm:inline">{isAdded ? "Added!" : "Cart"}</span>
            </button>

            {/* Buy Now Button (Always stays Buy Now and navigates to /checkout) */}
            <button
              onClick={handleBuyNow}
              className="bg-brand hover:bg-brand-dark text-white font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md shadow-brand/25 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Buy Now</span>
              <ArrowRight size={13} />
            </button>

          </div>

        </div>

      </div>

      {/* PROMO OFFERS MODAL */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand/10 text-brand rounded-xl">
                  <Tag size={18} />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight text-slate-900">Available Coupons & Offers</h3>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase">Select & Apply at Checkout</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPromoModal(false)}
                className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Coupons List */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {availableCoupons.map((c) => {
                const isCurrent = appliedCoupon === c.code;
                return (
                  <div 
                    key={c.code} 
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrent 
                        ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20" 
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-brand bg-brand/10 px-2.5 py-0.5 rounded-lg border border-brand/20">
                          {c.code}
                        </span>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                          {c.discount}
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-slate-700 leading-tight">{c.desc}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Min Order: {c.minOrder}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(c.code);
                        setCouponToast(`Coupon "${c.code}" Applied!`);
                        setShowPromoModal(false);
                        setTimeout(() => setCouponToast(""), 3000);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 active:scale-95 cursor-pointer ${
                        isCurrent
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25"
                          : "bg-slate-900 hover:bg-brand text-white shadow-sm"
                      }`}
                    >
                      {isCurrent ? "Applied ✓" : "Apply"}
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* COUPON APPLIED TOAST NOTIFICATION */}
      {couponToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <Check size={16} />
          <span>{couponToast}</span>
        </div>
      )}

    </div>
  );
}
