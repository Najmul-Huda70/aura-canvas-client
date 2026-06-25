'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Paintbrush, ShieldCheck, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const Banner = () => {
  const slides = [
    {
      tag: "For Art Collectors",
      icon: <ShoppingBag className="w-4 h-4 text-[#C5A880]" />,
      title: "Discover & Collect Original Masterpieces",
      subtitle: "Browse premium digital artworks, unlock seamless Stripe checkouts, and curate your personalized digital gallery collection.",
      btnText: "Explore Marketplace",
      btnLink: "/artworks",
      glowColor: "rgba(197, 168, 128, 0.08)"
    },
    {
      tag: "For Global Creators",
      icon: <Paintbrush className="w-4 h-4 text-[#C5A880]" />,
      title: "Empowering Artists on a Global Scale",
      subtitle: "Skip traditional gallery boundaries. Upload, manage, and track your artwork sales with deep analytical insights.",
      btnText: "Start Selling",
      btnLink: "/dashboard/artist",
      glowColor: "rgba(99, 102, 241, 0.06)"
    },
    {
      tag: "Secure Ecosystem",
      icon: <ShieldCheck className="w-4 h-4 text-[#C5A880]" />,
      title: "Democratizing the World of Fine Art",
      subtitle: "Powered by advanced JWT authentication, strict role-based control, and transparent secure transactions.",
      btnText: "Join AuraCanvas",
      btnLink: "/login",
      glowColor: "rgba(20, 184, 166, 0.06)"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const slideVariants = {
    enter: (direction) => ({
      y: direction > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (direction) => ({
      y: direction < 0 ? 40 : -40,
      opacity: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <div className="relative h-[550px] md:h-[650px] w-full overflow-hidden mt-20 bg-[#0B0F19] group select-none flex items-center border-b border-gray-900/50">
      
      {/* 🔮 Dynamic Aura Glow Background */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, ${slides[currentIndex].glowColor} 0%, transparent 60%),
            radial-gradient(circle at 15% 85%, rgba(197,168,128,0.02) 0%, transparent 40%)
          `
        }}
      />

      {/* 📐 Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161f30_1px,transparent_1px),linear-gradient(to_bottom,#161f30_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-12 w-full z-10">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
           className="flex flex-col items-center text-center max-w-3xl mx-auto"
          >
            {/* Role/Feature Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#C5A880]/5 border border-[#C5A880]/15 rounded-full mb-6 backdrop-blur-sm">
              {slides[currentIndex].icon}
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-medium text-[#C5A880]">
                {slides[currentIndex].tag}
              </span>
            </div>

            {/* Cinematic Title */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light mb-6 tracking-tight text-[#FDFBF7] leading-[1.15]">
              {slides[currentIndex].title}
            </h1>

            {/* Subtitle */}
            <p className="font-sans font-light text-sm md:text-base text-gray-400 mb-8 max-w-2xl leading-relaxed tracking-wide">
              {slides[currentIndex].subtitle}
            </p>

            {/* Action Button */}
            <Link href={slides[currentIndex].btnLink}>
              <button className="cursor-pointer font-sans text-xs uppercase tracking-[0.2em] bg-gradient-to-r from-[#C5A880] to-[#b3956d] hover:brightness-110 text-[#0B0F19] font-semibold px-8 py-4 rounded-xl shadow-[0_4px_25px_rgba(197,168,128,0.12)] transition-all duration-300">
                {slides[currentIndex].btnText}
              </button>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual Controls */}
      <button 
        onClick={handlePrev} 
        className="opacity-0 group-hover:opacity-100 absolute top-1/2 -translate-y-1/2 left-6 border border-gray-800/80 bg-[#0B0F19]/60 text-gray-400 p-3 rounded-full hover:bg-[#C5A880] hover:text-[#0B0F19] hover:border-[#C5A880] backdrop-blur-md transition-all duration-300 z-20"
      >
        <ChevronLeft size={16} />
      </button>
      <button 
        onClick={handleNext} 
        className="opacity-0 group-hover:opacity-100 absolute top-1/2 -translate-y-1/2 right-6 border border-gray-800/80 bg-[#0B0F19]/60 text-gray-400 p-3 rounded-full hover:bg-[#C5A880] hover:text-[#0B0F19] hover:border-[#C5A880] backdrop-blur-md transition-all duration-300 z-20"
      >
        <ChevronRight size={16} />
      </button>

      {/* Premium Minimal Bottom Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentIndex ? 'w-10 bg-[#C5A880]' : 'w-2 bg-gray-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;