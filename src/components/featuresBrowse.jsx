"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ArrowUpDown,
  ImageOff,
  ExternalLink,
  User,
  Tag,
  LayoutGrid,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price-asc", label: "Price: low → high" },
  { value: "price-desc", label: "Price: high → low" },
];

const sidebarVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, delay: i * 0.055, ease: "easeOut" },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.18 } },
};

const skeletonPulse = {
  animate: { opacity: [0.3, 0.7, 0.3] },
  transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
};

// ─── Skeleton card ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <motion.div
      className="rounded-xl overflow-hidden border border-gray-800/40 bg-[#111827]"
      {...skeletonPulse}
    >
      <div className="aspect-3/4 bg-[#0B0F19]/60" />
      <div className="p-4 space-y-2">
        <div className="h-3.5 w-4/5 rounded-full bg-[#0B0F19]/60" />
        <div className="h-3 w-3/5 rounded-full bg-[#0B0F19]/60" />
        <div className="flex justify-between mt-3">
          <div className="h-3 w-1/4 rounded-full bg-[#0B0F19]/60" />
          <div className="h-5 w-1/5 rounded-full bg-[#0B0F19]/60" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Artwork card ────────────────────────────────────────────────────────────
function ArtworkCard({ artwork, index, onArtistClick, onCardClick }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.article
      key={artwork._id}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="group relative rounded-xl overflow-hidden border border-gray-800/40 bg-[#111827] cursor-pointer transition-all duration-500 hover:border-[#C5A880]/30 hover:shadow-[0_10px_30px_rgba(197,168,128,0.04)]"
      onClick={() => onCardClick(artwork)}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 overflow-hidden bg-[#0B0F19]">
        {!imgLoaded && (
          <motion.div
            className="absolute inset-0 bg-[#0B0F19]"
            {...skeletonPulse}
          />
        )}
        <motion.img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
          onLoad={() => setImgLoaded(true)}
          style={{ opacity: imgLoaded ? 0.8 : 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.5, ease: "easeOut" },
          }}
        />

        {/* Luxury Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 text-[10px] font-sans uppercase tracking-wider font-medium px-2.5 py-1 rounded-sm bg-[#0B0F19]/80 text-[#C5A880] backdrop-blur-md border border-[#C5A880]/20">
            <Tag size={9} />
            {artwork.category}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#0B0F19]/0 group-hover:bg-[#0B0F19]/40 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300">
            <div className="bg-[#C5A880] rounded-full p-2.5 shadow-lg text-[#0B0F19]">
              <ExternalLink size={15} />
            </div>
          </div>
        </div>
      </div>

      {/* Card Metadata Body */}
      <div className="p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-serif font-medium text-gray-100 group-hover:text-[#C5A880] transition-colors duration-300 truncate leading-snug">
            {artwork.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArtistClick(artwork.artistId, artwork.artistName);
            }}
            className="mt-1 flex items-center gap-1 text-xs text-gray-400 hover:text-[#C5A880] transition-colors font-sans font-light"
          >
            <User size={10} className="text-[#C5A880]/70" />
            {artwork.artistName}
          </button>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800/40">
          <span className="text-sm font-sans font-semibold text-[#C5A880]">
            ${artwork.price.toLocaleString()}
          </span>
          <span className="text-[10px] font-sans text-gray-500 uppercase tracking-wider">
            {new Date(artwork.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function BrowseArtworks() {
  const router=useRouter();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Sync data dynamically with your running node server port
  useEffect(() => {
    async function fetchArtworks() {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/features`);
        if (!res.ok) throw new Error("Server error handling request");
        const data = await res.json();
        setArtworks(Array.isArray(data) ? data : MOCK_ARTWORKS);
      } catch (error) {
        console.error("Using local fallback datasets:", error);
        setArtworks(MOCK_ARTWORKS);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    }
    fetchArtworks();
  }, []);

  useEffect(() => {
    if (artworks.length) {
      const max = Math.max(...artworks.map((a) => a.price));
      const f = () => {
        setMaxPrice(max);
        setPriceRange([0, max]);
      };
      f();
    }
  }, [artworks]);

  const categories = [...new Set(artworks.map((a) => a.category))].sort();

  const filtered = artworks
    .filter((a) => {
      const q = search.toLowerCase();
      const matchQ =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.artistName.toLowerCase().includes(q);
      const matchCat = !selectedCategory || a.category === selectedCategory;
      const matchPrice = a.price >= priceRange[0] && a.price <= priceRange[1];
      return matchQ && matchCat && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory("");
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  const hasActiveFilters =
    search || selectedCategory || priceRange[1] < maxPrice;

  const handleCardClick = (artwork) => {
    console.log("Navigate to artwork:", artwork._id);
    router.push(`/artwork/${artwork._id}`);
   
  };

  const handleArtistClick = (artistId, name) => {
    console.log("Navigate to artist:", artistId, name);
  };

  // ── Sidebar template configurations ─────────────────────────────────────────
  const SidebarContent = () => (
    <div className="flex flex-col gap-6 h-full text-gray-300">
      {/* Title block info */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800/40">
        <div className="flex items-center gap-2 text-white font-serif">
          <Filter size={15} className="text-[#C5A880]" />
          <span className="text-sm tracking-wide">Filters</span>
        </div>
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearFilters}
            className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-red-400 hover:text-red-500 transition-colors font-sans"
          >
            <X size={11} />
            Reset
          </motion.button>
        )}
      </div>

      {/* Input query field tracker */}
      <div className="space-y-2">
        <label className="text-[10px] font-sans uppercase tracking-[0.15em] font-light text-gray-400">
          Search Artwork
        </label>
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Title or artist name…"
            className="w-full pl-9 pr-9 py-2 text-xs rounded-md border border-gray-800/60 bg-[#0B0F19] text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-[#C5A880]/40 transition-all font-sans font-light"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X size={12} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collections filter category tracks */}
      <div className="space-y-2">
        <label className="text-[10px] font-sans uppercase tracking-[0.15em] font-light text-gray-400">
          Collections
        </label>
        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory("")}
            className={`flex items-center justify-between w-full px-3 py-1.5 rounded-sm text-xs transition-all font-sans ${
              !selectedCategory
                ? "bg-[#C5A880]/10 border border-[#C5A880]/20 text-[#C5A880] font-medium"
                : "text-gray-400 hover:bg-[#0B0F19] hover:text-gray-200"
            }`}
          >
            <span>All Works</span>
            <span className="text-[10px] text-gray-500">{artworks.length}</span>
          </button>
          {categories.map((cat) => {
            const count = artworks.filter((a) => a.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCategory(cat === selectedCategory ? "" : cat)
                }
                className={`flex items-center justify-between w-full px-3 py-1.5 rounded-sm text-xs transition-all font-sans ${
                  selectedCategory === cat
                    ? "bg-[#C5A880]/10 border border-[#C5A880]/20 text-[#C5A880] font-medium"
                    : "text-gray-400 hover:bg-[#0B0F19] hover:text-gray-200"
                }`}
              >
                <span>{cat}</span>
                <span className="text-[10px] text-gray-500">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Value scale indicators */}
      <div className="space-y-3">
        <label className="text-[10px] font-sans uppercase tracking-[0.15em] font-light text-gray-400">
          Max Ceiling Price
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={50}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="w-full h-1 rounded-full appearance-none bg-gray-800 accent-[#C5A880] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-sans text-gray-500">
            <span>$0</span>
            <span className="font-medium text-[#C5A880]">
              ${priceRange[1].toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 selection:bg-[#C5A880]/20">
      {/* Top dashboard header bar contextual parameters */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-30 bg-[#111827]/80 backdrop-blur-md border-b border-gray-800/40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md border border-gray-800 text-gray-400 hover:text-white hover:bg-[#0B0F19] transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <SlidersHorizontal size={14} />
            </button>
            <div className="flex items-center gap-2">
              <LayoutGrid size={16} className="text-[#C5A880]" />
              <h1 className="text-base font-serif font-medium tracking-wide text-white">
                Canvas Master{" "}
                <span className="text-[#C5A880] font-bold">Catalog</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block font-sans font-light uppercase tracking-wider">
              {loading ? "Loading..." : `${filtered.length} products found`}
            </span>

            {/* Dropdown triggers configurations */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-300 font-sans border border-gray-800 rounded-md px-3 py-2 bg-[#111827] hover:border-[#C5A880]/30 transition-colors"
              >
                <ArrowUpDown size={12} className="text-[#C5A880]" />
                <span>
                  {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                </span>
                <ChevronDown
                  size={12}
                  className={`transition-transform text-gray-500 ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-md bg-[#111827] border border-gray-800 shadow-xl z-50 overflow-hidden"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs uppercase tracking-wider font-sans transition-colors ${
                          sortBy === opt.value
                            ? "bg-[#C5A880]/10 text-[#C5A880] font-medium"
                            : "text-gray-400 hover:bg-[#0B0F19] hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-6 pt-6 pb-16">
        {/* Desktop filter deck panels layout */}
        <motion.aside
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          className="hidden lg:block w-64 shrink-0"
        >
          <div className="sticky top-24 bg-[#111827] rounded-xl border border-gray-800/50 p-5">
            <SidebarContent />
          </div>
        </motion.aside>

        {/* Mobile side-bar configurations drawer views */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-14 left-0 w-full h-[calc(100vh-56px)] bg-[#0B0F19]/80 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />

              {/* Mobile Drawer (Sidebar Component) */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
               className="fixed left-0 top-14 bottom-0 w-72 h-[calc(100vh-56px)] bg-[#111827] border-r border-gray-800/60 z-50 p-5 shadow-2xl overflow-y-auto lg:hidden"
              >
                <div className="flex items-center justify-between mt-6 mb-6 pb-2 border-b border-gray-800/40">
                  <span className="font-serif font-medium text-white">
                    Filters
                  </span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-800 text-gray-500 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Dynamic products loop interface grid viewports */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-[#111827] border border-gray-800/40 flex items-center justify-center text-[#C5A880]">
                <ImageOff size={22} />
              </div>
              <div>
                <p className="font-serif font-medium text-gray-200 mb-1">
                  No artworks found
                </p>
                <p className="text-xs text-gray-500 font-sans">
                  Try adjusting your query or resetting filters.
                </p>
              </div>
              <button
                onClick={clearFilters}
                className="mt-2 text-xs uppercase tracking-wider font-sans text-[#C5A880] hover:underline transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((artwork, i) => (
                  <ArtworkCard
                    key={artwork._id}
                    artwork={artwork}
                    index={i}
                    onCardClick={handleCardClick}
                    onArtistClick={handleArtistClick}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>

      {sortOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setSortOpen(false)}
        />
      )}
    </div>
  );
}
