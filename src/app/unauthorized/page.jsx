"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, LogIn } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="text-center max-w-md w-full">
        
        {/* Border styling matches your card wrappers */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          className="w-20 h-20 bg-[#C5A880]/10 border border-[#C5A880]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#C5A880]"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Lock size={36} />
          </motion.div>
        </motion.div>

        {/* Text color customized using your main project highlight token [#C5A880] */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#C5A880] to-amber-600 tracking-tight"
        >
          401
        </motion.h1>

        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-2xl font-bold mt-4 text-gray-100"
        >
          Unauthorized Access
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-gray-400 mt-2 text-sm leading-relaxed"
        >
          You do not have permission to view this page. Please log in with valid credentials to gain access.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/login" className="w-full sm:w-auto" passHref>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#C5A880] to-amber-700 text-black font-semibold rounded-lg text-sm transition-all duration-200 shadow-lg shadow-[#C5A880]/10"
            >
              <LogIn size={16} />
              Go to Login
            </motion.button>
          </Link>
          
          <Link href="/" className="w-full sm:w-auto" passHref>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-[#161F30] hover:bg-[#1E293B] font-medium rounded-lg text-sm transition-all duration-200 text-gray-300 border border-gray-700/40"
            >
              <ArrowLeft size={16} />
              Back to Home
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}