"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  ShoppingBag,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  ImageOff,
  Loader2,
  Star,
  MessageSquare,
  Send
} from "lucide-react";

const MOCK_USER = {
  id: "artist_001",
  role: "artist",
  artistId: "artist_001",
  name: "Najmul Huda"
};

function StatusBadge({ status }) {
  const isAvailable = status === "available";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-sans uppercase tracking-wider font-semibold border ${
      isAvailable
        ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20 backdrop-blur-md"
        : "bg-rose-950/40 text-rose-400 border-rose-500/20 backdrop-blur-md"
    }`}>
      {isAvailable ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
      {isAvailable ? "Available" : "Sold Out"}
    </span>
  );
}

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function ArtworkDetails() {
  const resolvedParams = useParams();
  const id = resolvedParams?.id;
  const router = useRouter();
  
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Review States
  const [reviews, setReviews] = useState([
    { id: 1, name: "Alex Rivera", rating: 5, comment: "The textures look amazing in person. Absolute masterpiece!", date: "2 days ago" },
    { id: 2, name: "Sophia Zhang", rating: 4, comment: "Beautiful blending of colors. Perfect for my living room.", date: "1 week ago" }
  ]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  // ─── ১. ডেটা ফেচিং লজিক ফিক্স (সাকসেস ও অ্যারে ইনডেক্স চেক) ───────────────────
  useEffect(() => {
    if (!id) return;

    const fetchArtworkData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/artworks?id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        
        const resData = await res.json();
        
        // ব্যাকএন্ডের { success: true, data: [...] } ফরম্যাট ফিল্টার করা হচ্ছে
        if (resData && resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          setArtwork(resData.data[0]); // অ্যারের প্রথম অবজেক্টটি নেওয়া হলো
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Failed to fetch artwork:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkData();
  }, [id]);

  const user = MOCK_USER;
  const isLoggedIn = user.role !== "guest";
  const isOwner = user.role === "artist" && user.artistId === artwork?.artistId;
  const canPurchase = isLoggedIn && !isOwner && artwork?.status === "available" && !purchaseSuccess;

  async function handlePurchase() {
    if (!canPurchase) return;
    setPurchasing(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setPurchaseSuccess(true);
    } finally {
      setPurchasing(false);
    }
  }

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const reviewObj = {
      id: Date.now(),
      name: user.name || "Anonymous",
      rating: newRating,
      comment: newComment,
      date: "Just now"
    };

    setReviews([reviewObj, ...reviews]);
    setNewComment("");
    setNewRating(5);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-[#C5A880] mx-auto" />
          <p className="text-xs tracking-widest text-gray-400 uppercase">Loading Masterpiece...</p>
        </div>
      </div>
    );
  }

  if (notFound || !artwork) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <ImageOff size={40} className="text-[#C5A880] mx-auto mb-4" />
          <h2 className="text-xl font-serif text-gray-100 mb-2">Artwork not found</h2>
          <button onClick={() => router.push("/artworks")} className="mt-4 px-5 py-2 rounded-sm bg-[#C5A880] text-[#0B0F19] text-xs font-semibold tracking-wider uppercase">
            Back to gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 font-sans antialiased selection:bg-[#C5A880]/30">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-[#C5A880] transition-colors group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-5 items-start">
        
        {/* LEFT: IMAGE PANEL */}
        <div className="lg:col-span-7 space-y-4 lg:h-[calc(100vh-180px)] lg:sticky lg:top-24"> 
          <div className="relative rounded-xl overflow-hidden h-full aspect-7/8 max-h-[600px] lg:max-h-full bg-[#111827] border border-gray-800/60 shadow-2xl mx-auto">
            <motion.img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover" 
              onLoad={() => setImgLoaded(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: imgLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />
            {/* ─── ২. প্রোপার্টির নাম ফিক্স: artwork.featured থেকে artwork.features করা হলো ─── */}
            {artwork.features && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#C5A880] text-[#0B0F19] text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm tracking-wider shadow-lg">
                <Star size={10} fill="currentColor" />
                Featured Piece
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: METADATA PANEL */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={artwork.status} />
              <span className="text-[10px] font-medium uppercase tracking-widest bg-gray-800/40 border border-gray-700/30 px-2.5 py-1 rounded-sm text-gray-300">
                {artwork.category}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-gray-100 tracking-tight leading-tight">
              {artwork.title}
            </h1>

            <button
              onClick={() => router.push(`/artists/${artwork.artistId}`)}
              className="mt-2 flex items-center gap-1.5 text-sm text-[#C5A880] hover:underline font-light"
            >
              <User size={14} />
              By {artwork.artistName}
            </button>
          </div>

          <div className="border-t border-b border-gray-800/60 py-4">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">Est. Value</p>
            <p className="text-4xl font-serif font-medium text-[#C5A880]">
              ${artwork.price?.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-2">The Story</p>
            <p className="text-sm font-light leading-relaxed text-gray-300">
              {artwork.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-[#111827]/40 border border-gray-800/40 p-4 rounded-xl">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 block">Catalog Style</span>
              <span className="text-sm text-gray-200 font-medium">{artwork.category}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 block">Released</span>
              <span className="text-sm text-gray-200 font-medium">
                {artwork.createdAt ? new Date(artwork.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"}
              </span>
            </div>
          </div>

          <div className="mt-2">
            {isOwner && (
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/artworks/${artwork._id}/edit`)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-800 bg-[#111827] text-xs font-semibold uppercase tracking-wider text-gray-200 hover:bg-gray-800 transition-colors"
                >
                  <Pencil size={13} /> Edit Masterpiece
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-3 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-400 text-xs font-semibold uppercase tracking-wider hover:bg-rose-900/30 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}

            {!isOwner && isLoggedIn && (
              <button
                onClick={handlePurchase}
                disabled={!canPurchase || purchasing}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${
                  canPurchase
                    ? "bg-[#C5A880] text-[#0B0F19] hover:bg-[#b3956d] shadow-lg shadow-[#C5A880]/10"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
              >
                {purchasing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : purchaseSuccess ? (
                  "Acquired Successfully"
                ) : (
                  <>
                    <ShoppingBag size={14} /> Acquire Artwork · ${artwork.price?.toLocaleString()}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 mt-12 border-t border-gray-800/60">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-8">
            <MessageSquare size={18} className="text-[#C5A880]" />
            <h2 className="text-xl font-serif font-medium text-gray-100">Collector Reviews & Thoughts</h2>
            <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full text-gray-400">{reviews.length}</span>
          </div>

          {isLoggedIn ? (
            <form onSubmit={handleAddReview} className="bg-[#111827]/40 border border-gray-800/60 p-5 rounded-xl mb-10">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">Share your perspective</p>
              
              <div className="flex items-center gap-1.5 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="text-gray-600 hover:text-[#C5A880] transition-colors"
                  >
                    <Star size={16} fill={star <= newRating ? "#C5A880" : "transparent"} className={star <= newRating ? "text-[#C5A880]" : "text-gray-600"} />
                  </button>
                ))}
                <span className="text-xs text-gray-400 ml-2">({newRating} out of 5)</span>
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What emotions does this piece evoke? Leave a review..."
                  className="w-full bg-[#0B0F19] border border-gray-800 focus:border-[#C5A880]/50 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none transition-colors resize-none pr-12"
                />
                <button
                  type="submit"
                  className="absolute bottom-4 right-3 bg-[#C5A880] hover:bg-[#b3956d] text-[#0B0F19] p-2 rounded-md transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-[#111827]/20 border border-gray-800/40 p-4 rounded-xl text-center text-xs text-gray-400 mb-10">
              Please login to drop a review for this piece.
            </div>
          )}

          <div className="space-y-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="border-b border-gray-800/40 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-200">{rev.name}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={10}
                          fill={idx < rev.rating ? "#C5A880" : "transparent"}
                          className={idx < rev.rating ? "text-[#C5A880]" : "text-gray-700"}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-500">{rev.date}</span>
                </div>
                <p className="text-xs text-gray-400 font-light leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}