"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Tag, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function SkeletonCard() {
  return (
    <div className="bg-[#111827] border border-gray-800/40 rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full h-52 bg-gray-800/60" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-700/60 rounded w-1/3" />
        <div className="h-4 bg-gray-700/60 rounded w-2/3" />
        <div className="h-3 bg-gray-700/60 rounded w-full" />
        <div className="h-3 bg-gray-700/60 rounded w-5/6" />
        <div className="flex justify-between mt-4">
          <div className="h-5 bg-gray-700/60 rounded w-1/4" />
          <div className="h-5 bg-gray-700/60 rounded w-1/5" />
        </div>
      </div>
    </div>
  );
}

function ArtworkCard({ artwork }) {
  const [imgError, setImgError] = useState(false);

  const formattedDate = artwork.createdAt
    ? new Date(artwork.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.28, ease: "easeOut" } }}
      className="relative bg-[#111827] border border-gray-800/40 rounded-2xl overflow-hidden flex flex-col cursor-pointer group shadow-lg"
    >
      {/* Gold border glow */}
      <div className="absolute inset-0 rounded-2xl border border-[#C5A880]/0 group-hover:border-[#C5A880]/30 transition-all duration-500 pointer-events-none z-10" />

      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A880] to-transparent pointer-events-none z-10"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.7 }}
        transition={{ duration: 0.35 }}
      />

      {/* Image */}
      <div className="relative w-full h-52 overflow-hidden bg-gray-900">
        {!imgError ? (
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800/60">
            <span className="text-gray-600 text-xs font-sans">Image unavailable</span>
          </div>
        )}

        {/* Category pill */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 bg-[#0B0F19]/80 border border-[#C5A880]/20 text-[#C5A880] text-[9px] font-sans uppercase tracking-[0.14em] font-medium px-3 py-1 rounded-full backdrop-blur-sm">
            <Tag size={9} />
            {artwork.category ?? "Uncategorized"}
          </span>
        </div>

        {/* Price badge */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="bg-[#C5A880] text-[#0B0F19] text-[11px] font-sans font-bold px-3 py-1 rounded-full shadow-md">
            ${Number(artwork.price ?? 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-2">

        {/* Artist name */}
        <Link
          href={`/artists/${artwork.artistId}`}
          className="inline-flex items-center gap-1 text-[10px] text-[#C5A880] font-sans uppercase tracking-[0.12em] font-medium hover:underline w-fit"
          onClick={(e) => e.stopPropagation()}
        >
          <User size={10} />
          {artwork.artistName ?? "Unknown Artist"}
        </Link>

        {/* Title */}
        <h3 className="text-[15px] font-serif font-medium text-gray-100 group-hover:text-[#C5A880] transition-colors duration-300 leading-snug line-clamp-1">
          {artwork.title}
        </h3>

        {/* Description */}
        <p className="text-[11px] text-gray-500 font-sans font-light leading-relaxed line-clamp-2">
          {artwork.description ?? "No description provided."}
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-800/60 mt-auto mb-1" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[10px] text-gray-600 font-sans">
            <Calendar size={10} />
            {formattedDate}
          </span>
          <motion.span
            className="inline-flex items-center gap-1 text-[10px] text-[#C5A880] font-sans font-medium uppercase tracking-wider"
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            View <ArrowRight size={10} />
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

// ── helpers ──────────────────────────────────────────────────────
// Randomly pick `n` items from array (client-side shuffle)
function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// Normalize whatever shape the server returns into a flat array
function normalizeResponse(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data.artworks)) return data.artworks;
  if (Array.isArray(data.features)) return data.features;
  if (Array.isArray(data.data)) return data.data;
  // last resort: grab the first array-valued key
  const firstArr = Object.values(data).find((v) => Array.isArray(v));
  return firstArr ?? [];
}

// ── Main component ────────────────────────────────────────────────
export default function FeaturedArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArtworks() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:3001/features", {
          cache: "no-store", // always fresh on reload
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();
        const all = normalizeResponse(data);

        // Pick 6 random items from whatever the server returns
        const six = pickRandom(all, 6);
        setArtworks(six);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArtworks();
  }, []);

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
          <div className="inline-flex items-center gap-2 text-xl md:text-2xl font-serif tracking-wide mb-2 text-white">
            <Sparkles className="text-[#C5A880]" size={20} />
            <h2>
              Featured <span className="text-[#C5A880] font-bold">Artworks</span>
            </h2>
          </div>
          <p className="text-gray-400 text-[11px] uppercase tracking-[0.15em] font-sans font-light">
            Curated picks refreshed on every visit — discover something new.
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm font-sans mb-2">Could not load artworks.</p>
            <p className="text-gray-700 text-[11px] font-sans font-mono">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && artworks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm font-sans">No featured artworks yet.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && artworks.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork._id ?? artwork.id ?? artwork.title} artwork={artwork} />
            ))}
          </motion.div>
        )}

        {/* Footer line */}
        <motion.div
          className="mt-12 flex items-center gap-3 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#C5A880]/20" />
          <span className="text-[9px] text-gray-700 uppercase tracking-[0.18em] font-sans font-light">
            Updated on reload
          </span>
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#C5A880]/20" />
        </motion.div>

      </div>
    </section>
  );
}