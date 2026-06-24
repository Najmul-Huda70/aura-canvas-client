"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Heart,
  MessageSquare,
  Settings,
  Crown,
  Zap,
  Star,
  ChevronRight,
  Check,
  Edit3,
  Lock,
  Camera,
  ExternalLink,
  TrendingUp,
  Package,
  Eye,
  EyeOff,
  AlertCircle,
  LogOut,
  Loader2,
} from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const iconMap = {
  Package: Package,
  Zap: Zap,
  Crown: Crown,
};
// ─── Tier config ──────────────────────────────────────────────────────────────
const TIERS = {
  user_free: {
    label: "Free",
    icon: Package,
    color: "text-gray-400",
    border: "border-gray-700/60",
    bg: "bg-gray-800/30",
    glow: "",
    max: 3,
    price: "$0",
    priceLabel: "forever",
  },
  user_pro: {
    label: "Pro",
    icon: Zap,
    color: "text-violet-400",
    border: "border-violet-500/40",
    bg: "bg-violet-950/25",
    glow: "shadow-violet-500/10",
    max: 9,
    price: "$9.99",
    priceLabel: "/ month",
  },
  user_premium: {
    label: "Premium",
    icon: Crown,
    color: "text-[#C5A880]",
    border: "border-[#C5A880]/40",
    bg: "bg-[#C5A880]/8",
    glow: "shadow-[#C5A880]/10",
    max: Infinity,
    price: "$19.99",
    priceLabel: "/ month",
  },
};

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "history", label: "Purchase History", icon: History },
  { key: "artworks", label: "My Collection", icon: Heart },
  { key: "reviews", label: "My Reviews", icon: MessageSquare },
  { key: "tier", label: "Subscription", icon: Crown },
  { key: "settings", label: "Profile Settings", icon: Settings },
];

// ─── Framer variants ──────────────────────────────────────────────────────────
const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}

// Avatar — falls back to initials if image missing or broken
function Avatar({ src, name, className = "w-16 h-16" }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div
        className={`${className} rounded-2xl bg-gray-800 flex items-center justify-center text-gray-300 font-semibold text-lg`}
      >
        {initials(name)}
      </div>
    );
  }
  return (
    <div className={`${className} rounded-2xl overflow-hidden`}>
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setErr(true)}
      />
    </div>
  );
}

// Tier badge pill
function TierBadge({ plan }) {
  const t = TIERS[plan] || TIERS.user_free;
  const Icon = t.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${t.bg} ${t.color} ${t.border}`}
    >
      <Icon size={9} /> {t.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — Purchase History
// data: GET ${BASE_URL}/purchase?userId=...
// shape expected: [{ _id, artwork: { title, artist, images:[url] }, price, createdAt, status }]
// ─────────────────────────────────────────────────────────────────────────────
function PurchaseHistory({ purchases }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={fadeUp}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <h2 className="text-xl font-serif text-gray-100">
            Transaction History
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            All artworks purchased on your account
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-800/40 border border-gray-700/40 px-3 py-1.5 rounded-lg">
          <TrendingUp size={12} className="text-[#C5A880]" />
          {purchases.length} purchases
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-gray-800/50 overflow-hidden bg-[#0E1420]/50"
      >
        {purchases.length === 0 ? (
          <div className="py-16 text-center text-gray-600 text-sm">
            No purchases recorded yet.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800/60">
                <th className="text-left text-[10px] uppercase tracking-widest text-gray-600 px-5 py-3.5 font-medium">
                  Artwork
                </th>
                <th className="text-left text-[10px] uppercase tracking-widest text-gray-600 px-4 py-3.5 font-medium hidden sm:table-cell">
                  Artist
                </th>
                <th className="text-left text-[10px] uppercase tracking-widest text-gray-600 px-4 py-3.5 font-medium">
                  Price
                </th>
                <th className="text-left text-[10px] uppercase tracking-widest text-gray-600 px-4 py-3.5 font-medium hidden md:table-cell">
                  Date
                </th>
                <th className="text-left text-[10px] uppercase tracking-widest text-gray-600 px-4 py-3.5 font-medium hidden sm:table-cell">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p, i) => (
                <motion.tr
                  key={p._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                  className="border-b border-gray-800/30 last:border-0 hover:bg-gray-800/20 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                        <img
                          src={p.artwork?.images?.[0] || "/placeholder.jpg"}
                          alt={p.artwork?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-200 group-hover:text-[#C5A880] transition-colors truncate max-w-[140px]">
                        {p.artwork?.title || "Untitled"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-400 hidden sm:table-cell">
                    {p.artwork?.artist || "—"}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-[#C5A880]">
                    ${(p.price ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500 hidden md:table-cell">
                    {p.createdAt ? formatDate(p.createdAt) : "—"}
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide font-semibold">
                      <Check size={8} /> {p.status || "completed"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — My Collection
// Derived from purchases — each purchased artwork IS the collection
// ─────────────────────────────────────────────────────────────────────────────
function BoughtArtworks({ purchases }) {
  // Map purchase list → collection cards
  const collection = purchases.map((p) => ({
    id: p._id,
    title: p.artwork?.title || "Untitled",
    artist: p.artwork?.artist || "Unknown",
    image: p.artwork?.images?.[0] || "/placeholder.jpg",
    artworkId: p.artwork?._id || p.artworkId,
  }));

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={fadeUp}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-serif text-gray-100">My Collection</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {collection.length} pieces in your gallery
          </p>
        </div>
      </motion.div>

      {collection.length === 0 ? (
        <motion.div
          variants={fadeUp}
          className="py-20 text-center border border-gray-800/40 rounded-2xl"
        >
          <Heart size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Your collection is empty.</p>
          <button className="mt-4 text-[#C5A880] text-xs hover:underline">
            Browse artworks →
          </button>
        </motion.div>
      ) : (
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {collection.map((art) => (
            <motion.div
              key={art.id}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="group relative rounded-2xl overflow-hidden border border-gray-800/50 bg-[#0E1420]/50 cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <motion.img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.07 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                  <div className="bg-[#C5A880] text-[#0B0F19] rounded-full p-2 shadow-lg">
                    <ExternalLink size={13} />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-gray-200 truncate">
                  {art.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">by {art.artist}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — My Reviews
// data: GET ${BASE_URL}/reviews?userId=...
// shape expected: [{ _id, artworkTitle, rating, comment, createdAt, artworkId }]
// Edit: PATCH ${BASE_URL}/reviews/:id  { comment }
// ─────────────────────────────────────────────────────────────────────────────
function MyReviews({ reviews, setReviews }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(null);

  function startEdit(rev) {
    setEditingId(rev._id);
    setEditText(rev.comment);
  }

  async function saveEdit(id) {
    setSaving(id);
    try {
      const res = await fetch(`${BASE_URL}/reviews/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: editText }),
      });
      if (!res.ok) throw new Error("Failed to update review");
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, comment: editText } : r)),
      );
      setEditingId(null);
      toast.success("Review updated!");
    } catch {
      toast.error("Could not update review");
    } finally {
      setSaving(null);
    }
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <h2 className="text-xl font-serif text-gray-100">My Reviews</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Comments you've left on artworks
        </p>
      </motion.div>

      {reviews.length === 0 ? (
        <motion.div
          variants={fadeUp}
          className="py-20 text-center border border-gray-800/40 rounded-2xl"
        >
          <MessageSquare size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            You haven't reviewed any artworks yet.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <motion.div
              key={rev._id}
              variants={fadeUp}
              className="rounded-2xl border border-gray-800/50 bg-[#0E1420]/50 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm font-semibold text-gray-200">
                      {rev.artworkTitle}
                    </p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={10}
                          fill={idx < rev.rating ? "#C5A880" : "transparent"}
                          className={
                            idx < rev.rating
                              ? "text-[#C5A880]"
                              : "text-gray-700"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {editingId === rev._id ? (
                      <motion.div
                        key="edit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <textarea
                          rows={2}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full bg-[#090D16] border border-gray-700 focus:border-[#C5A880]/50 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none resize-none"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => saveEdit(rev._id)}
                            disabled={saving === rev._id}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#C5A880] text-[#0B0F19] font-semibold hover:bg-[#d4b99a] transition-colors disabled:opacity-60"
                          >
                            {saving === rev._id && (
                              <Loader2 size={11} className="animate-spin" />
                            )}
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-gray-400 font-light leading-relaxed"
                      >
                        {rev.comment}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <p className="text-[11px] text-gray-600 mt-2">
                    {rev.createdAt ? formatDate(rev.createdAt) : ""}
                  </p>
                </div>

                {editingId !== rev._id && (
                  <button
                    onClick={() => startEdit(rev)}
                    className="text-gray-600 hover:text-[#C5A880] transition-colors mt-0.5"
                  >
                    <Edit3 size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — Subscription Tier
// currentPlan: "user_free" | "user_pro" | "user_premium" from user.plan
// Upgrade: POST /api/checkout_sessions  { plan_id }
// ─────────────────────────────────────────────────────────────────────────────
function SubscriptionTier({ currentPlan, purchaseCount }) {
  const PLAN_LIST = [
    {
      key: "user_free",
      features: [
        "3 artwork purchases",
        "Browse full gallery",
        "Leave reviews",
        "Basic profile",
      ],
    },
    {
      key: "user_pro",
      features: [
        "9 artwork purchases",
        "Everything in Free",
        "Early access to new drops",
        "Priority support",
      ],
    },
    {
      key: "user_premium",
      features: [
        "Unlimited purchases",
        "Everything in Pro",
        "Private artist collections",
        "Exclusive events access",
        "Custom curator notes",
      ],
    },
  ];

  const tierData = TIERS[currentPlan] || TIERS.user_free;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <h2 className="text-xl font-serif text-gray-100">Subscription</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your collector tier and purchase allowance
        </p>
      </motion.div>

      {/* Current plan card */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-[#C5A880]/20 bg-[#C5A880]/5 p-5 flex items-center gap-4 flex-wrap"
      >
        <div className="w-11 h-11 rounded-2xl bg-[#C5A880]/15 border border-[#C5A880]/25 flex items-center justify-center">
          {(() => {
            const Icon = tierData.icon;
            return <Icon size={18} className={tierData.color} />;
          })()}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">
            Current plan
          </p>
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold text-gray-100">
              {tierData.label}
            </p>
            <TierBadge plan={currentPlan} />
          </div>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-gray-500">Purchases used</p>
          <p className="text-sm font-semibold text-[#C5A880] mt-0.5">
            {purchaseCount} / {tierData.max === Infinity ? "∞" : tierData.max}
          </p>
        </div>
      </motion.div>

      {/* Progress bar */}
      {currentPlan !== "user_premium" && tierData.max !== Infinity && (
        <motion.div variants={fadeUp} className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-gray-500">
            <span>Purchase allowance</span>
            <span>
              {purchaseCount} / {tierData.max}
            </span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((purchaseCount / tierData.max) * 100, 100)}%`,
              }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[#C5A880] to-[#e8c99a]"
            />
          </div>
        </motion.div>
      )}

      {/* Tier cards */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {PLAN_LIST.map(({ key, features }) => {
          const t = TIERS[key];
          const Icon = t.icon;
          const isCurrent = key === currentPlan;
          return (
            <motion.div
              key={key}
              variants={fadeUp}
              whileHover={isCurrent ? {} : { y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className={`relative rounded-2xl border p-5 transition-all duration-200 ${isCurrent
                  ? `${t.border} ${t.bg} shadow-lg ${t.glow}`
                  : "border-gray-800/60 bg-[#0E1420]/50 hover:border-gray-700"
                }`}
            >
              {isCurrent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-3 right-3 text-[9px] uppercase tracking-widest bg-[#C5A880] text-[#0B0F19] font-bold px-2 py-0.5 rounded-full"
                >
                  Current
                </motion.div>
              )}
              <Icon size={20} className={`${t.color} mb-3`} />
              <p
                className={`text-base font-semibold ${isCurrent ? t.color : "text-gray-200"} mb-0.5`}
              >
                {t.label}
              </p>
              <p className="text-xl font-bold text-gray-100">
                {t.price}{" "}
                <span className="text-xs font-normal text-gray-500">
                  {t.priceLabel}
                </span>
              </p>

              <ul className="mt-4 space-y-2">
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-xs text-gray-400"
                  >
                    <Check
                      size={11}
                      className={`shrink-0 ${isCurrent ? t.color : "text-gray-600"}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Upgrade → POST to your checkout endpoint */}
              {!isCurrent && (
                <form action="/api/checkout_sessions" method="POST">
                  <input type="hidden" name="plan_id" value={key} />
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.97 }}
                    className={`w-full mt-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${key === "user_premium"
                        ? "bg-[#C5A880] text-[#0B0F19] hover:bg-[#d4b99a]"
                        : "border border-violet-500/40 text-violet-400 hover:bg-violet-950/30"
                      }`}
                  >
                    Upgrade to {t.label}
                  </motion.button>
                </form>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — Profile Settings
// Uses better-auth authClient methods directly:
//   authClient.updateUser({ name })
//   authClient.changeEmail({ newEmail })
//   authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions })
//   authClient.deleteUser()
// ─────────────────────────────────────────────────────────────────────────────
function ProfileSettings({ user }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  // Delete confirm flow
  const [deleteStep, setDeleteStep] = useState(0); // 0 = idle, 1 = confirm
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Keep fields in sync if session refreshes
  useEffect(() => {
    const f = async () => {
      setName(user?.name || "");
      setEmail(user?.email || "");
    };
    f();
  }, [user?.name, user?.email]);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // ── Name ────────────────────────────────────────────────────────────
      if (name.trim() && name !== user?.name) {
        const { error } = await authClient.updateUser({ name });
        if (error) {
          toast.error(`Name update failed: ${error.message}`);
          return;
        }
        toast.success("Name updated!");
      }

      // ── Email ───────────────────────────────────────────────────────────
      if (email.trim() && email !== user?.email) {
        const { error } = await authClient.changeEmail({ newEmail: email });
        if (error) {
          toast.error(`Email update failed: ${error.message}`);
          return;
        }
        toast.success("Verification email sent to new address!");
      }

      // ── Password ────────────────────────────────────────────────────────
      if (currentPw || newPw || confirmPw) {
        if (!currentPw) {
          toast.error("Enter your current password");
          return;
        }
        if (!newPw) {
          toast.error("Enter a new password");
          return;
        }
        if (newPw.length < 8) {
          toast.error("New password must be at least 8 characters");
          return;
        }
        if (newPw !== confirmPw) {
          toast.error("New passwords do not match");
          return;
        }

        const { error } = await authClient.changePassword({
          currentPassword: currentPw,
          newPassword: newPw,
          revokeOtherSessions: true,
        });
        if (error) {
          toast.error(`Password error: ${error.message}`);
          return;
        }
        toast.success("Password updated!");
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await authClient.deleteUser();
      toast.success("Account deleted");
      setTimeout(() => {
        window.location.href = "/";
      }, 600);
    } catch (err) {
      console.error(err);
      toast.error("Could not delete account");
      setDeleting(false);
    }
  }

  const inputCls = (hasErr) =>
    `w-full bg-[#0E1420]/80 border rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-700 focus:outline-none transition-colors ${hasErr
      ? "border-rose-800/60"
      : "border-gray-800 focus:border-[#C5A880]/50"
    }`;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-7 max-w-2xl"
    >
      <motion.div variants={fadeUp}>
        <h2 className="text-xl font-serif text-gray-100">Profile Settings</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Update your personal information
        </p>
      </motion.div>

      {/* Avatar row */}
      <motion.div variants={fadeUp} className="flex items-center gap-5">
        <div className="relative">
          <Avatar src={user?.image} name={user?.name} />
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#C5A880] text-[#0B0F19] flex items-center justify-center shadow-md"
          >
            <Camera size={11} />
          </motion.button>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-200">{name}</p>
          <p className="text-xs text-gray-500">{email}</p>
          <TierBadge plan={user?.plan} />
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        variants={fadeUp}
        onSubmit={handleSave}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-gray-500">
              Display name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls(false)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-gray-500">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls(false)}
            />
          </div>
        </div>

        {/* Password divider */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex-1 h-px bg-gray-800/60" />
          <span className="text-[10px] uppercase tracking-widest text-gray-600 flex items-center gap-1.5">
            <Lock size={10} /> Change password
          </span>
          <div className="flex-1 h-px bg-gray-800/60" />
        </div>

        <div className="space-y-3">
          {[
            { label: "Current password", val: currentPw, set: setCurrentPw },
            { label: "New password", val: newPw, set: setNewPw },
            { label: "Confirm password", val: confirmPw, set: setConfirmPw },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">
                {label}
              </label>
              <input
                type={showPw ? "text" : "password"}
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder="••••••••"
                className={inputCls(false)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showPw ? <EyeOff size={12} /> : <Eye size={12} />}
            {showPw ? "Hide" : "Show"} passwords
          </button>
        </div>

        <motion.button
          type="submit"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C5A880] text-[#0B0F19] text-sm font-bold hover:bg-[#d4b99a] transition-colors shadow-md shadow-[#C5A880]/10 disabled:opacity-70"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Save changes
        </motion.button>
      </motion.form>

      {/* Danger zone */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-rose-900/30 bg-rose-950/10 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={14} className="text-rose-400" />
          <p className="text-sm font-semibold text-rose-400">Danger zone</p>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Permanently delete your account and all purchase history. This cannot
          be undone.
        </p>

        <AnimatePresence mode="wait">
          {deleteStep === 0 ? (
            <motion.button
              key="btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteStep(1)}
              className="text-xs text-rose-500 border border-rose-800/50 px-4 py-2 rounded-lg hover:bg-rose-900/20 transition-colors font-medium"
            >
              Delete account
            </motion.button>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <p className="text-xs text-rose-300/80">
                Type{" "}
                <span className="font-mono font-bold text-rose-400">
                  DELETE
                </span>{" "}
                to confirm:
              </p>
              <input
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="DELETE"
                className="w-full max-w-xs bg-[#090D16] border border-rose-800/40 focus:border-rose-500/60 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-700 focus:outline-none transition-colors"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleteInput !== "DELETE" || deleting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {deleting && <Loader2 size={11} className="animate-spin" />}
                  Confirm delete
                </button>
                <button
                  onClick={() => {
                    setDeleteStep(0);
                    setDeleteInput("");
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-xs hover:bg-gray-800/40 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN — UserDashboard
// ─────────────────────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("history");
  const [purchases, setPurchases] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [plans, setPlans] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userId = user?.id;
  const userPlan = user?.plan;

  // ── Fetch purchases + reviews in parallel once userId is ready ─────────────
  useEffect(() => {
    const f = async () => {
      if (!userId) return;
      setDataLoading(true);

      Promise.all([
        fetch(`${BASE_URL}/purchase?userId=${userId}`).then((r) => r.json()),
        fetch(`${BASE_URL}/reviews?userId=${userId}`).then((r) => r.json()),
        fetch(`${BASE_URL}/plans?planId=${userPlan}`).then((r) => r.json()),
      ])
        .then(([purchaseRes, reviewRes, plan]) => {
          setPurchases(purchaseRes.data || []);
          setReviews(reviewRes.data || []);
          setPlans(plan.data || []);
        })
        .catch((err) => {
          console.error("Dashboard fetch error:", err);
          toast.error("Failed to load dashboard data");
        })
        .finally(() => setDataLoading(false));
    };
    f();
  }, [userId, userPlan]);
  console.log("plans now: ", plans);
  useEffect(() => {
    if (isPending) return;
    if (!user) {
      redirect("/unauthorized");
    } else if (user?.role !== "user") {
      redirect("/forbidden");
    }
  }, [user, isPending]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#070B13] flex items-center justify-center text-gray-400 text-xs">
        <Loader2 className="animate-spin text-[#C5A880] mr-2" size={16} />{" "}
        Authenticating session...
      </div>
    );
  }

  // ── Derive values ──────────────────────────────────────────────────────────
  // user.plan comes as "user_free" | "user_pro" | "user_premium"
  const currentPlan = user.plan || "user_free";
  const tierData = TIERS[currentPlan] || TIERS.user_free;
  const TierIcon = tierData.icon;
  const totalSpent = purchases.reduce((s, p) => s + (p.price ?? 0), 0);

  const sections = {
    history: <PurchaseHistory purchases={purchases} />,
    artworks: <BoughtArtworks purchases={purchases} />,
    reviews: <MyReviews reviews={reviews} setReviews={setReviews} />,
    tier: (
      <SubscriptionTier
        currentPlan={currentPlan}
        purchaseCount={purchases.length}
      />
    ),
    settings: <ProfileSettings user={user} />,
  };

  async function handleSignOut() {
    await authClient.signOut();
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-gray-100 antialiased">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-60 -left-40 w-125 h-125 rounded-full bg-[#C5A880]/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-75 h-75 rounded-full bg-violet-900/8 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-24 pb-16 flex gap-6 items-start">
        {/* ── Desktop Sidebar ───────────────────────────────────────────── */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex w-64 shrink-0 flex-col gap-4 sticky top-24"
        >
          {/* Profile card */}
          <div className="rounded-2xl border border-gray-800/60 bg-[#0E1420]/70 backdrop-blur-sm p-5 text-center">
            <div className="relative inline-block mb-3">
              <Avatar
                src={user.image}
                name={user.name}
                className="w-16 h-16 mx-auto"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#090D16] flex items-center justify-center ${tierData.bg} ${tierData.border} border`}
              >
                <TierIcon size={9} className={tierData.color} />
              </div>
            </div>
            <h3 className="text-base font-semibold text-gray-100">
              {user.name}
            </h3>
            <p className="text-xs text-gray-500 mb-3">{user.email}</p>
            <TierBadge plan={currentPlan} />

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-800/60">
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide">
                  Purchases
                </p>
                <p className="text-sm font-bold text-[#C5A880] mt-0.5">
                  {purchases.length}/
                  {tierData.max === Infinity ? "∞" : tierData.max}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide">
                  Spent
                </p>
                <p className="text-sm font-bold text-[#C5A880] mt-0.5">
                  ${totalSpent.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="rounded-2xl border border-gray-800/60 bg-[#0E1420]/70 backdrop-blur-sm p-2 flex flex-col gap-1">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
              const active = activeTab === key;
              return (
                <motion.button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 text-left ${active
                      ? "bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/20 font-medium"
                      : "text-gray-500 hover:text-gray-200 hover:bg-gray-800/40"
                    }`}
                >
                  <Icon size={15} />
                  {label}
                  {active && <ChevronRight size={13} className="ml-auto" />}
                </motion.button>
              );
            })}
          </nav>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-900/30 text-rose-500 text-sm hover:bg-rose-950/20 transition-colors"
          >
            <LogOut size={14} /> Sign out
          </button>
        </motion.aside>

        {/* ── Mobile top nav ─────────────────────────────────────────────── */}
        <div className="lg:hidden w-full mb-4">
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${activeTab === key
                    ? "bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/20"
                    : "text-gray-500 bg-gray-800/40 border border-gray-800"
                  }`}
              >
                <Icon size={12} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main content ───────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Skeleton overlay while data loads */}
          {dataLoading ? (
            <div className="flex items-center justify-center py-32">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Loader2 size={24} className="text-[#C5A880]" />
              </motion.div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {sections[activeTab]}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}
