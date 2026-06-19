"use client";
import React from "react";
import { motion } from "framer-motion";
import { Palette, Monitor, Component, Orbit, Camera, Sparkles } from "lucide-react";

const categories = [
  { id: 1, title: "Painting", subtitle: "Oil & Watercolors", icon: Palette },
  { id: 2, title: "Digital", subtitle: "3D & Illustration", icon: Monitor },
  { id: 3, title: "Sculpture", subtitle: "Clay & Wireframe", icon: Component },
  { id: 4, title: "Abstract", subtitle: "Mixed Media", icon: Orbit },
  { id: 5, title: "Photography", subtitle: "Cinematic & Realism", icon: Camera },
  { id: 6, title: "AI Generated", subtitle: "Neural Art Matrix", icon: Sparkles },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function CategoryCard({ cat }) {
  const Icon = cat.icon;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
      className="relative bg-[#111827] border border-gray-800/40 rounded-xl p-6 h-40 flex flex-col justify-center items-center overflow-hidden cursor-pointer shadow-md group"
    >
      {/* Radial glow — expands from center on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(197,168,128,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Gold border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none border border-[#C5A880]/0 group-hover:border-[#C5A880]/30"
        style={{ transition: "border-color 0.4s ease" }}
      />

      {/* Top-left corner accent line */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[#C5A880] to-transparent rounded-tl-xl pointer-events-none"
        initial={{ width: 0, opacity: 0 }}
        whileHover={{ width: "50%", opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-0 left-0 w-[2px] bg-gradient-to-b from-[#C5A880] to-transparent rounded-tl-xl pointer-events-none"
        initial={{ height: 0, opacity: 0 }}
        whileHover={{ height: "50%", opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon box */}
        <motion.div
          className="mb-3 p-2 bg-[#0B0F19]/60 border border-gray-800/30 rounded-sm"
          whileHover={{ scale: 1.12, borderColor: "rgba(197,168,128,0.4)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            whileHover={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Icon
              size={22}
              strokeWidth={1.5}
              className="text-[#C5A880] transition-colors duration-300"
            />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-sm font-serif font-medium text-gray-100 group-hover:text-[#C5A880] transition-colors duration-300"
        >
          {cat.title}
        </motion.h3>

        {/* Subtitle */}
        <p className="text-[10px] text-gray-500 mt-0.5 font-sans font-light uppercase tracking-wider group-hover:text-gray-400 transition-colors duration-300">
          {cat.subtitle}
        </p>

        {/* Bottom underline reveal */}
        <motion.div
          className="mt-3 h-px bg-gradient-to-r from-transparent via-[#C5A880] to-transparent"
          initial={{ width: 0, opacity: 0 }}
          whileHover={{ width: 48, opacity: 0.7 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

export default function ArtCategories() {
  return (
    <section className="bg-[#0B0F19] text-[#F3F4F6] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-xl md:text-2xl font-serif tracking-wide mb-2 text-white">
            Art <span className="text-[#C5A880] font-bold">Categories</span>
          </h2>
          <p className="text-gray-400 text-[11px] uppercase tracking-[0.15em] font-sans font-light">
            Filter through our diverse creative collections of physical and digital products.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}