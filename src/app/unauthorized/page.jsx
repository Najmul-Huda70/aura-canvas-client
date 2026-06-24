"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, LogIn, Home } from "lucide-react"; // Home icon import করা হয়েছে
import Link from "next/link";

export default function UnauthorizedPage() {
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.02)_0%,transparent_65%)] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-md w-full relative z-10"
      >
        {/* Floating Lock Icon Wrapper */}
        <motion.div 
          variants={itemVariants}
          className="w-20 h-20 bg-[#C5A880]/5 border border-[#C5A880]/15 rounded-2xl flex items-center justify-center mx-auto mb-8 text-[#C5A880] shadow-[0_0_30px_rgba(197,168,128,0.02)]"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              y: [0, -4, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3, 
              ease: "easeInOut" 
            }}
          >
            <Lock size={36} strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Cinematic 401 Headline */}
        <motion.h1 
          variants={itemVariants}
          className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#C5A880] via-[#C5A880]/80 to-transparent tracking-tighter leading-none"
        >
          401
        </motion.h1>

        {/* Subtle Typography Section */}
        <motion.h2 
          variants={itemVariants}
          className="text-xl font-semibold mt-6 text-gray-200 tracking-wide"
        >
          Authentication Required
        </motion.h2>

        <motion.p 
          variants={itemVariants}
          className="text-gray-400 mt-2 text-sm leading-relaxed max-w-sm mx-auto font-light"
        >
          You do not have permission to view this gallery page. Please log in with valid credentials to gain full access.
        </motion.p>

        {/* Animated Action Buttons */}
        <motion.div 
          variants={itemVariants} 
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          {/* Primary Action - Golden Button */}
          <Link href="/login" passHref className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(197,168,128,0.1)"
              }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer w-full flex items-center justify-center gap-2.5 px-6 py-3 bg-gradient-to-r from-[#C5A880] to-[#b3956d] font-semibold rounded-xl text-xs uppercase tracking-widest text-[#0B0F19] transition-all duration-300"
            >
              <LogIn size={14} strokeWidth={2.5} />
              Go to Login
            </motion.button>
          </Link>
          
          {/* Secondary Action - Dark Styled Home Button */}
          <Link href="/" passHref className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer w-full flex items-center justify-center gap-2.5 px-6 py-3 bg-[#161F30] hover:bg-[#1E293B] font-medium rounded-xl text-xs uppercase tracking-widest text-gray-300 border border-gray-700/40 transition-all duration-300"
            >
              <Home size={14} strokeWidth={2} />
              Return to Home
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}