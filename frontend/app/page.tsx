import { HeroSection } from "@/modules/home/components/HeroSection";
import { BrandMarquee, BrandLogoMarquee } from "@/modules/home/components/BrandMarquee";
import { FeaturedCategories } from "@/modules/home/components/FeaturedCategories";
import dynamic from 'next/dynamic';

const FeaturedProductsSection = dynamic(() => import('@/modules/home/components/FeaturedProductsSection').then(mod => ({ default: mod.FeaturedProductsSection })));
const PromoBanner = dynamic(() => import('@/modules/home/components/PromoBanner').then(mod => ({ default: mod.PromoBanner })));
const RidingStylesSection = dynamic(() => import('@/modules/home/components/RidingStylesSection').then(mod => ({ default: mod.RidingStylesSection })));
const NewArrivalsSection = dynamic(() => import('@/modules/home/components/NewArrivalsSection').then(mod => ({ default: mod.NewArrivalsSection })));
const BrandTrustSection = dynamic(() => import('@/modules/home/components/BrandTrustSection').then(mod => ({ default: mod.BrandTrustSection })));

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <BrandMarquee />
      <FeaturedCategories />
      
      <FeaturedProductsSection />
      <PromoBanner />
      <RidingStylesSection />
      
      <BrandLogoMarquee />
      
      <NewArrivalsSection />
      <BrandTrustSection />
    </div>
  );
}
