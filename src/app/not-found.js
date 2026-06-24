"use client";

import React from "react";
import { motion } from "framer-motion";
import { Compass, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  // Container variants for clean, staggered orchestration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 75, damping: 12 },
    },
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center px-4 overflow-hidden relative select-none">
      
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.03)_0%,transparent_65%)] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-md w-full relative z-10"
      >
        {/* Floating Radar/Compass Icon Wrapper */}
        <motion.div 
          variants={itemVariants}
          className="w-20 h-20 bg-[#C5A880]/5 border border-[#C5A880]/15 rounded-2xl flex items-center justify-center mx-auto mb-8 text-[#C5A880] shadow-[0_0_30px_rgba(197,168,128,0.02)]"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              y: [0, -6, 0]
            }}
            transition={{ 
              rotate: { repeat: Infinity, duration: 12, ease: "linear" },
              y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
            }}
          >
            <Compass size={36} strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Cinematic 404 Headline */}
        <motion.h1 
          variants={itemVariants}
          className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#C5A880] via-[#C5A880]/80 to-transparent tracking-tighter leading-none"
        >
          404
        </motion.h1>

        {/* Subtle Typography Section */}
        <motion.h2 
          variants={itemVariants}
          className="text-xl font-semibold mt-6 text-gray-200 tracking-wide"
        >
          Lost Inside The Exhibition
        </motion.h2>

        <motion.p 
          variants={itemVariants}
          className="text-gray-400 mt-2 text-sm leading-relaxed max-w-sm mx-auto font-light"
        >
          The gallery path you requested does not exist, has been archived, or the coordinates are incorrect.
        </motion.p>

        {/* Animated Client-Side CTA Button */}
        <motion.div variants={itemVariants} className="mt-8 flex justify-center">
          <Link href="/" passHref className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(197,168,128,0.1)"
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 bg-gradient-to-r from-[#C5A880] to-[#b3956d] hover:opacity-95 font-semibold rounded-xl text-xs uppercase tracking-widest text-[#0B0F19] transition-all duration-300"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              Return to Home
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}