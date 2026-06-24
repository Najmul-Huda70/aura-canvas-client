"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="text-center max-w-md w-full">
        
        <motion.div 
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <ShieldAlert size={36} />
          </motion.div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500 tracking-tight"
        >
          403
        </motion.h1>

        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-2xl font-bold mt-4 text-gray-100"
        >
          Access Forbidden
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-gray-400 mt-2 text-sm leading-relaxed"
        >
          Your account is authenticated, but it does not have the required permissions or roles to access this resource.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.back()}
            className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:opacity-90 font-medium rounded-lg text-sm transition-all duration-200 text-white shadow-lg shadow-blue-900/20"
          >
            <ArrowLeft size={16} />
            Go Back
          </motion.button>
          
          <Link href="/" className="w-full sm:w-auto" passHref>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-[#161F30] hover:bg-[#1E293B] font-medium rounded-lg text-sm transition-all duration-200 text-gray-300 border border-gray-700/40"
            >
              <Home size={16} />
              Back to Home
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}