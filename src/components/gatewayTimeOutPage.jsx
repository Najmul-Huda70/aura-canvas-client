"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GatewayTimeoutPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center px-4 overflow-hidden relative select-none">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.02)_0%,transparent_65%)] pointer-events-none" />

      <div className="text-center max-w-md w-full relative z-10">
        
        {/* Animated Clock Icon */}
        <div className="w-20 h-20 bg-[#C5A880]/5 border border-[#C5A880]/15 rounded-2xl flex items-center justify-center mx-auto mb-8 text-[#C5A880] shadow-[0_0_30px_rgba(197,168,128,0.02)]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          >
            <Clock size={36} strokeWidth={1.5} />
          </motion.div>
        </div>

        {/* Cinematic 504 Headline */}
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#C5A880] via-[#C5A880]/80 to-transparent tracking-tighter leading-none">
          504
        </h1>

        <h2 className="text-xl font-semibold mt-6 text-gray-200 tracking-wide">
          Server Timeout
        </h2>

        <p className="text-gray-400 mt-2 text-sm leading-relaxed max-w-sm mx-auto font-light">
          The gallery server took too long to respond. This usually happens when the database is under heavy load.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          
          {/* Retry Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 bg-gradient-to-r from-[#C5A880] to-[#b3956d] font-semibold rounded-xl text-xs uppercase tracking-widest text-[#0B0F19] transition-all duration-300"
          >
            <RefreshCw size={14} strokeWidth={2.5} />
            Try Again
          </motion.button>
          
          {/* Home Button */}
          <Link href="/" passHref className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer w-full flex items-center justify-center gap-2.5 px-6 py-3 bg-[#161F30] hover:bg-[#1E293B] font-medium rounded-xl text-xs uppercase tracking-widest text-gray-300 border border-gray-700/40 transition-all duration-300"
            >
              <Home size={14} />
              Main Gallery
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}