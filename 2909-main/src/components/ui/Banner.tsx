"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

const slides: BannerSlide[] = [
  {
    id: "1",
    title: "Portal de Atendimento 2909",
    subtitle: "Central de Serviços ao Cidadão",
    description: "Solicite serviços, faça denúncias e acompanhe suas solicitações de forma rápida e fácil.",
    ctaText: "Fazer uma solicitação",
    ctaLink: "/solicitacao",
  },
  {
    id: "2",
    title: "Prefeitura na Sua Casa",
    subtitle: "Serviços Online 24h",
    description: "Agora você pode resolver diversas demandas sem sair de casa, pelo computador ou celular.",
    ctaText: "Ver serviços",
    ctaLink: "/",
  },
  {
    id: "3",
    title: "IPTU 2026",
    subtitle: "Pague em cota única e tenha desconto",
    description: "Aproveite os descontos para pagamento antecipado do IPTU de Belford Roxo.",
    ctaText: "Acessar IPTU",
    ctaLink: "https://e-gov.prefeituradebelfordroxo.rj.gov.br/",
  },
];

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg">
      {/* Slide com gradiente azul de Belford Roxo */}
      <div
        className="relative text-white h-[320px] md:h-[340px] flex items-center transition-all duration-500"
        style={{
          background: 'linear-gradient(135deg, #1748ae 0%, #0094de 50%, #1748ae 100%)'
        }}
      >
        {/* Conteúdo do slide */}
        <div className="relative z-10 px-8 md:px-12 py-8 max-w-2xl">
          {slide.subtitle && (
            <p className="text-sm md:text-base font-medium text-white/80 mb-2">
              {slide.subtitle}
            </p>
          )}
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight"
            style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
          >
            {slide.title}
          </h2>
          {slide.description && (
            <p className="text-sm md:text-base text-white/90 mb-6 leading-relaxed max-w-lg">
              {slide.description}
            </p>
          )}
          {slide.ctaText && slide.ctaLink && (
            <Link
              href={slide.ctaLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-md"
              style={{ color: '#1748ae' }}
            >
              {slide.ctaText}
            </Link>
          )}
        </div>

        {/* Decoração geométrica */}
        <div className="absolute right-0 top-0 h-full w-1/2 pointer-events-none">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute right-20 bottom-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/3" />
          <div className="absolute right-40 top-1/2 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2" />
        </div>

        {/* Silhueta da cidade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-15">
          <svg viewBox="0 0 1200 60" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
            <path
              d="M0,60 L0,45 L30,45 L30,30 L50,30 L50,40 L80,40 L80,20 L100,20 L100,45 L130,45 L130,35 L160,35 L160,45 L190,45 L190,25 L220,25 L220,45 L250,45 L250,15 L280,15 L280,45 L310,45 L310,38 L340,38 L340,45 L370,45 L370,12 L400,12 L400,45 L430,45 L430,30 L460,30 L460,45 L490,45 L490,10 L520,10 L520,45 L550,45 L550,35 L580,35 L580,45 L610,45 L610,25 L640,25 L640,45 L670,45 L670,38 L700,38 L700,45 L730,45 L730,28 L760,28 L760,45 L790,45 L790,18 L820,18 L820,45 L850,45 L850,35 L880,35 L880,45 L910,45 L910,40 L940,40 L940,45 L970,45 L970,30 L1000,30 L1000,45 L1030,45 L1030,38 L1060,38 L1060,45 L1090,45 L1090,35 L1120,35 L1120,45 L1150,45 L1150,42 L1200,42 L1200,60 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Controles de navegação */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm cursor-pointer"
        aria-label="Slide anterior"
        type="button"
      >
        <ChevronLeft size={26} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm cursor-pointer"
        aria-label="Próximo slide"
        type="button"
      >
        <ChevronRight size={26} />
      </button>

      {/* Indicadores de slide */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            type="button"
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
              index === currentSlide
                ? "bg-white w-7"
                : "bg-white/50 w-2.5 hover:bg-white/70"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
