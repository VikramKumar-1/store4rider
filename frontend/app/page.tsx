import { HeroSection } from "@/modules/home/components/HeroSection";
import { BrandMarquee, BrandLogoMarquee } from "@/modules/home/components/BrandMarquee";
import { FeaturedCategories } from "@/modules/home/components/FeaturedCategories";
import { FeaturedProductsSection } from "@/modules/home/components/FeaturedProductsSection";
import { PromoBanner } from "@/modules/home/components/PromoBanner";
import { RidingStylesSection } from "@/modules/home/components/RidingStylesSection";
import { NewArrivalsSection } from "@/modules/home/components/NewArrivalsSection";
import { BrandTrustSection } from "@/modules/home/components/BrandTrustSection";

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
