"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function SuccessCard({ customerEmail, sessionId }) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-[#1a1a24] p-8 rounded-2xl border border-white/5 max-w-md w-full text-center shadow-2xl shadow-emerald-500/5"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </motion.div>

      <motion.h1 variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="text-2xl font-semibold text-white mb-2 tracking-wide">
        Payment Successful!
      </motion.h1>

      <motion.p variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="text-gray-400 text-sm mb-6 leading-relaxed">
        We appreciate your business! A confirmation email will be sent to{" "}
        <span className="text-[#E6C594] font-medium">{customerEmail}</span>.
      </motion.p>


     <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
        <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
          <Link href="/dashboard/user" className="inline-block w-full py-3 bg-[#E6C594] hover:bg-[#d8b481] text-[#111117] font-semibold rounded-xl transition-colors duration-300 text-sm shadow-lg shadow-[#E6C594]/5">
            Go to Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}