"use client";

import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070",
    title: "Premium Helmets",
    subtitle: "Safety meets style on the open road.",
    link: "/products?category=helmets"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070",
    title: "Riding Jackets",
    subtitle: "All-weather protection and comfort.",
    link: "/products?category=jackets"
  }
];

const HeroSlider = () => {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px]">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <Image 
                src={slide.image} 
                alt={slide.title} 
                fill 
                className="object-cover brightness-50"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-black mb-4 tracking-tight"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-2xl mb-8 font-medium text-zinc-200"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link href={slide.link}>
                      <Button size="lg" className="rounded-full text-lg px-8 py-6 shadow-2xl shadow-brand/50">
                        Shop Collection
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default memo(HeroSlider);
