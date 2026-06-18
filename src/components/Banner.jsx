'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Banner = () => {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1945&auto=format&fit=crop",
      title: "Discover Extraordinary Digital Art",
      subtitle: "Connect with elite creators worldwide and collect unique original masterworks."
    },
    {
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop",
      title: "Democratizing the World of Fine Art",
      subtitle: "No boundaries, no gallery limits. Bring bespoke abstract art right to your screen."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[650px] w-full overflow-hidden mt-20 bg-[#0B0F19] group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full bg-cover bg-center flex items-center"
          style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
        >
          {/* Luxury Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/70"></div>

          {/* Animated Content */}
          <div className="relative max-w-5xl mx-auto px-6 text-center text-white z-10 w-full">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-serif text-5xl md:text-7xl font-light mb-6 tracking-wide text-[#FDFBF7] leading-tight"
            >
              {slides[currentIndex].title}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-sans font-light text-xs md:text-sm text-gray-300 mb-10 max-w-xl mx-auto tracking-[0.25em] uppercase"
            >
              {slides[currentIndex].subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <button className="font-sans text-xs uppercase tracking-widest border border-[#C5A880] hover:bg-[#C5A880] hover:text-black text-[#FDFBF7] font-medium px-8 py-4 rounded-none transition-all duration-300">
                Explore Collection
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Controls */}
      <button 
        onClick={() => setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1)} 
        className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-6 border border-white/20 bg-black/20 text-white p-3 hover:bg-black/60 transition z-20"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={() => setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1)} 
        className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-6 border border-white/20 bg-black/20 text-white p-3 hover:bg-black/60 transition z-20"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Banner;