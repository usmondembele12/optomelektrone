"use client";

import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  Percent, 
  Headphones, 
  ArrowRight,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function HeroSlider({ onSelectBrand, onScrollToProducts }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: "RASMIY DISTRIBYUTOR",
      badgeColor: "bg-blue-600 text-white",
      title: "LUX VOLT ELEKTR MAHSULOTLARI",
      highlight: "Birinchi Qo'ldan Optom Narxda",
      description: "Avtomat uzgichlar, metall va germetik boks shchitlar, sanoat kontaktorlari hamda yuqori yorug'likka ega LED projektorlar.",
      image: "/images/banner.png",
      cta: "LUX VOLT Katalogi",
      action: () => onSelectBrand('LUX VOLT')
    },
    {
      id: 2,
      badge: "QURILISH VA USTALAR UCHUN",
      badgeColor: "bg-amber-500 text-slate-900",
      title: "KATTA OBYEKTLAR UCHUN UL GURJI TA'MINOT",
      highlight: "-15% gacha Maxsus Chegirma",
      description: "Andijon Kabel, Schneider Electric, CHINT, ZUBR va IEK mahsulotlari. QQS bilan to'lov va O'zbekiston bo'ylab yetkazib berish.",
      image: "/images/banner_optom.png",
      cta: "Optom Takliflarni Ko'rish",
      action: onScrollToProducts
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="space-y-6">
      {/* 1. HERO SLIDER BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-lg min-h-[360px] sm:min-h-[420px] flex items-center">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${idx === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
              />
              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-transparent"></div>
            </div>

            {/* Slide Content */}
            <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-8 text-white space-y-4">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${slide.badgeColor}`}>
                <Zap className="w-3.5 h-3.5" />
                {slide.badge}
              </span>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {slide.title} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-300">
                  {slide.highlight}
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-200 line-clamp-2 max-w-lg leading-relaxed">
                {slide.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={slide.action}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-95 flex items-center gap-2 group"
                >
                  <span>{slide.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="tel:+998712000000"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/20 transition-all"
                >
                  Optom Narx Olish
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all border border-white/10"
          aria-label="Oldingi slayd"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all border border-white/10"
          aria-label="Keyingi slayd"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-white/40'}`}
              aria-label={`Slayd ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. SODDA.UZ STYLE 4 VALUE PROPOSITIONS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:border-blue-400 hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">100% Rasmiy Kafolat</h4>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">1 yildan 3 yilgacha sertifikat</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:border-blue-400 hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Tezkor Yetkazib Berish</h4>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Toshkentda 3 soatda</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:border-blue-400 hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Optom Arzon Narxlar</h4>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">To'g'ridan-to'g'ri zavoddan</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:border-blue-400 hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Muhandis Maslahati</h4>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Usta va prorablarga bepul</p>
          </div>
        </div>
      </div>
    </div>
  );
}

