"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Heart,
  MessageSquare,
  Settings,
  ShoppingBag,
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
  Calendar,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  X,
  Eye,
  EyeOff,
  Upload,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_USER = {
  name: "Robin",
  email: "robin@gmail.com",
  avatar:
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
  tier: "free", // "free" | "pro" | "premium"
  joinedAt: "2024-09-15",
  totalSpent: 1840,
  purchaseCount: 3,
};

const TIERS = {
  free: {
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
  pro: {
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
  premium: {
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

const PURCHASE_HISTORY = [
  {
    id: "p1",
    title: "Golden Hour Reverie",
    artist: "Jane Vincent",
    price: 1200,
    date: "2024-11-12",
    status: "completed",
    image:
      "https://images.pexels.com/photos/1578632/pexels-photo-1578632.jpeg?auto=compress&cs=tinysrgb&w=120",
  },
  {
    id: "p2",
    title: "Solitude at 3AM",
    artist: "Lucas Ferreira",
    price: 520,
    date: "2024-11-22",
    status: "completed",
    image:
      "https://images.pexels.com/photos/1125850/pexels-photo-1125850.jpeg?auto=compress&cs=tinysrgb&w=120",
  },
  {
    id: "p3",
    title: "Watercolor Monsoon",
    artist: "Arjun Bose",
    price: 640,
    date: "2024-12-04",
    status: "completed",
    image:
      "https://images.pexels.com/photos/1000366/pexels-photo-1000366.jpeg?auto=compress&cs=tinysrgb&w=120",
  },
];

const BOUGHT_ARTWORKS = [
  {
    id: "b1",
    title: "Golden Hour Reverie",
    artist: "Jane Vincent",
    image:
      "https://images.pexels.com/photos/1578632/pexels-photo-1578632.jpeg?auto=compress&cs=tinysrgb&w=400",
    artworkId: "6a34d229d7e1b6bf20426c74",
  },
  {
    id: "b2",
    title: "Solitude at 3AM",
    artist: "Lucas Ferreira",
    image:
      "https://images.pexels.com/photos/1125850/pexels-photo-1125850.jpeg?auto=compress&cs=tinysrgb&w=400",
    artworkId: "6a34d229d7e1b6bf20426c78",
  },
  {
    id: "b3",
    title: "Watercolor Monsoon",
    artist: "Arjun Bose",
    image:
      "https://images.pexels.com/photos/1000366/pexels-photo-1000366.jpeg?auto=compress&cs=tinysrgb&w=400",
    artworkId: "6a34d229d7e1b6bf20426c7a",
  },
];

const MY_REVIEWS = [
  {
    id: "r1",
    artworkTitle: "Golden Hour Reverie",
    rating: 5,
    comment:
      "The textures look extraordinary — absolute masterpiece for any collector.",
    date: "2024-11-14",
    artworkId: "6a34d229d7e1b6bf20426c74",
  },
  {
    id: "r2",
    artworkTitle: "Solitude at 3AM",
    rating: 4,
    comment:
      "Beautiful long-exposure work. The cobblestone reflections are hauntingly vivid.",
    date: "2024-11-24",
    artworkId: "6a34d229d7e1b6bf20426c78",
  },
];

// ─── Nav items ────────────────────────────────────────────────────────────────
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

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
};

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

function TierBadge({ tier }) {
  const t = TIERS[tier];
  const Icon = t.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${t.bg} ${t.color} ${t.border}`}
    >
      <Icon size={9} />
      {t.label}
    </span>
  );
}

// ─── Section: Purchase History ────────────────────────────────────────────────
function PurchaseHistory({ purchase }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="w-full mx-auto space-y-6"
    >
      <motion.div
        variants={fadeUp}
        className="flex items-center justify-between"
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
          {purchase.length} purchases
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-gray-800/50 overflow-hidden bg-[#0E1420]/50"
      >
        {purchase.length === 0 ? (
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
              {purchase.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                  className="border-b border-gray-800/30 last:border-0 hover:bg-gray-800/20 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-200 group-hover:text-[#C5A880] transition-colors truncate max-w-[140px]">
                        {p.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-400 hidden sm:table-cell">
                    {p.artist}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-[#C5A880]">
                    ${p.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500 hidden md:table-cell">
                    {formatDate(p.date)}
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide font-semibold">
                      <Check size={8} />
                      {p.status}
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

// ─── Section: Bought Artworks (Collection) ────────────────────────────────────
function BoughtArtworks() {
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
            {BOUGHT_ARTWORKS.length} pieces in your gallery
          </p>
        </div>
      </motion.div>

      {BOUGHT_ARTWORKS.length === 0 ? (
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
          {BOUGHT_ARTWORKS.map((art, i) => (
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
                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  <div />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="bg-[#C5A880] text-[#0B0F19] rounded-full p-2 shadow-lg"
                  >
                    <ExternalLink size={13} />
                  </motion.div>
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

// ─── Section: My Reviews ──────────────────────────────────────────────────────
function MyReviews() {
  const [editingId, setEditingId] = useState(null);
  const [reviews, setReviews] = useState(MY_REVIEWS);
  const [editText, setEditText] = useState("");

  function startEdit(rev) {
    setEditingId(rev.id);
    setEditText(rev.comment);
  }

  function saveEdit(id) {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, comment: editText } : r)),
    );
    setEditingId(null);
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
          {reviews.map((rev, i) => (
            <motion.div
              key={rev.id}
              variants={fadeUp}
              className="rounded-2xl border border-gray-800/50 bg-[#0E1420]/50 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm font-semibold text-gray-200">
                      {rev.artworkTitle}
                    </p>
                    <div className="flex items-center gap-0.5">
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
                    {editingId === rev.id ? (
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
                            onClick={() => saveEdit(rev.id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-[#C5A880] text-[#0B0F19] font-semibold hover:bg-[#d4b99a] transition-colors"
                          >
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
                    {formatDate(rev.date)}
                  </p>
                </div>

                {editingId !== rev.id && (
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

// ─── Section: Subscription Tier ───────────────────────────────────────────────
function SubscriptionTier({ currentTier }) {
  const [selectedTier, setSelectedTier] = useState(null);

  const tierList = [
    {
      key: "free",
      features: [
        "3 artwork purchases",
        "Browse full gallery",
        "Leave reviews",
        "Basic profile",
      ],
    },
    {
      key: "pro",
      features: [
        "9 artwork purchases",
        "Everything in Free",
        "Early access to new drops",
        "Priority support",
      ],
    },
    {
      key: "premium",
      features: [
        "Unlimited purchases",
        "Everything in Pro",
        "Private artist collections",
        "Exclusive events access",
        "Custom curator notes",
      ],
    },
  ];

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

      {/* Current tier */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-[#C5A880]/20 bg-[#C5A880]/5 p-5 flex items-center gap-4"
      >
        <div className="w-11 h-11 rounded-2xl bg-[#C5A880]/15 border border-[#C5A880]/25 flex items-center justify-center">
          {(() => {
            const T = TIERS[currentTier];
            const Icon = T.icon;
            return <Icon size={18} className={T.color} />;
          })()}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">
            Current plan
          </p>
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold text-gray-100">
              {TIERS[currentTier].label}
            </p>
            <TierBadge tier={currentTier} />
          </div>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-gray-500">Purchases used</p>
          <p className="text-sm font-semibold text-[#C5A880] mt-0.5">
            {MOCK_USER.purchaseCount} /{" "}
            {TIERS[currentTier].max === Infinity ? "∞" : TIERS[currentTier].max}
          </p>
        </div>
      </motion.div>

      {/* Progress bar for free/pro */}
      {currentTier !== "premium" && (
        <motion.div variants={fadeUp} className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-gray-500">
            <span>Purchase allowance</span>
            <span>
              {MOCK_USER.purchaseCount} / {TIERS[currentTier].max}
            </span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(MOCK_USER.purchaseCount / TIERS[currentTier].max) * 100}%`,
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
        {tierList.map(({ key, features }) => {
          const t = TIERS[key];
          const Icon = t.icon;
          const isCurrent = key === currentTier;
          const isSelected = selectedTier === key;
          return (
            <motion.div
              key={key}
              variants={fadeUp}
              whileHover={isCurrent ? {} : { y: -4 }}
              onClick={() => !isCurrent && setSelectedTier(key)}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className={`relative rounded-2xl border p-5 cursor-pointer transition-all duration-200 ${
                isCurrent
                  ? `${t.border} ${t.bg} shadow-lg ${t.glow}`
                  : isSelected
                    ? `${t.border} ${t.bg}`
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

              {!isCurrent && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className={`w-full mt-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${
                    key === "premium"
                      ? "bg-[#C5A880] text-[#0B0F19] hover:bg-[#d4b99a]"
                      : "border border-violet-500/40 text-violet-400 hover:bg-violet-950/30"
                  }`}
                >
                  Upgrade to {t.label}
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

// ─── Section: Profile Settings ────────────────────────────────────────────────
function ProfileSettings({ user}) {

  const initialName = user?.name;
  const initialEmail = user?.email;
  const [name, setName] = useState(initialName || "");
  const [email, setEmail] = useState(initialEmail || "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  async function handleSave(e) {
  e.preventDefault();
  setSaved(false);
  setLoading(true);

  try {
   //name changes
    if (initialName !== name && name.trim() !== "") {
      const { error: nameError } = await authClient.updateUser({
        name: name,
      });
      if (nameError) {
        toast.error(`Name update failed: ${nameError.message}`);
        setLoading(false);
        return;
      }
      toast.success("Name updated successfully!");
    }

    //email changes
    if (initialEmail !== email && email.trim() !== "") {
      const { error: emailError } = await authClient.changeEmail({
        newEmail: email,
      });
      if (emailError) {
        toast.error(`Email update failed: ${emailError.message}`);
        setLoading(false);
        return;
      }
      toast.success("Verification email sent to new address!");
    }

   //password changes
    if (currentPw || newPw || confirmPw) {
      if (newPw !== confirmPw) {
        toast.error("New passwords do not match!");
        setLoading(false);
        return;
      }

      if (!currentPw || !newPw) {
        toast.error("Please provide both current and new passwords.");
        setLoading(false);
        return;
      }

      const { error: pwError } = await authClient.changePassword({
        newPassword: newPw,
        currentPassword: currentPw,
        revokeOtherSessions: true,
      });

      if (pwError) {
        toast.error(`Password Error: ${pwError.message}`);
        setLoading(false);
        return;
      }

      toast.success("Password updated successfully!");
      
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);

  } catch (err) {
    console.error("Profile update failed:", err);
    toast.error("Something went wrong!");
  } finally {
    setLoading(false);
  }
}

 const handleDelete = async () => {
  try {
  await authClient.deleteUser();
    
  toast.success("Successfully deleted!");
    
    setTimeout(() => {
      window.location.href = '/'; 
    }, 500);

  } catch (error) {
    console.error("Failed to delete account:", error);
    toast.error("Something went wrong!");
  }
};
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

      {/* Avatar */}
      <motion.div variants={fadeUp} className="flex items-center gap-5">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#C5A880]/30">
            <img
              src={user?.image}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <motion.button
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
          <TierBadge tier={MOCK_USER.tier} />
        </div>
      </motion.div>

      {/* Profile form */}
      <motion.form
        variants={fadeUp}
        onSubmit={handleSave}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-gray-500">
              Display name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0E1420]/80 border border-gray-800 focus:border-[#C5A880]/50 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors"
            />
          </div>
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-gray-500">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0E1420]/80 border border-gray-800 focus:border-[#C5A880]/50 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex-1 h-px bg-gray-800/60" />
          <span className="text-[10px] uppercase tracking-widest text-gray-600">
            Change password
          </span>
          <div className="flex-1 h-px bg-gray-800/60" />
        </div>

        <div className="space-y-3">
          {[
            { label: "Current password", val: currentPw, set: setCurrentPw },
            { label: "New password", val: newPw, set: setNewPw },
            { label: "Confirm password", val: confirmPw, set: setConfirmPw },
          ].map(({ label, val, set }) => (
            <div key={label} className="relative">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">
                {label}
              </label>
              <input
                type={showPw ? "text" : "password"}
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0E1420]/80 border border-gray-800 focus:border-[#C5A880]/50 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-700 focus:outline-none transition-colors"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors mt-1"
          >
            {showPw ? <EyeOff size={12} /> : <Eye size={12} />}
            {showPw ? "Hide" : "Show"} passwords
          </button>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 pt-2">
          <motion.button
            type="submit"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-xl bg-[#C5A880] text-[#0B0F19] text-sm font-bold hover:bg-[#d4b99a] transition-colors shadow-md shadow-[#C5A880]/10"
          >
            Save changes
          </motion.button>
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-xs text-emerald-400"
              >
                <Check size={13} />
                Saved successfully
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
        <button onClick={handleDelete} className="text-xs text-rose-500 border border-rose-800/50 px-4 py-2 rounded-lg hover:bg-rose-900/20 transition-colors font-medium">
          Delete account
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function UserDashboard() {
  
  const [activeTab, setActiveTab] = useState("history");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [purchase, setPurchase] = useState([]);

  const { data: session, isPending } = useSession();

  const user = session?.user;
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      try {
        const res = await fetch(`${BASE_URL}/purchase?userId=${userId}`);
        const resData = await res.json();
        setPurchase(resData.data || []);
        console.log(resData, "from user dashboard!");
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };

    load();
  }, [userId]);

  if (isPending) {
    return <div>User data isLoading.....</div>;
  }

  if (!user) {
    return <div>Please sign in to view dashboard</div>;
  }

  const { name, email, image } = user;
  // console.log("name:", name, "email: ", email, "image: ", image);
  const sections = {
    history: <PurchaseHistory purchase={purchase} />,
    artworks: <BoughtArtworks />,
    reviews: <MyReviews />,
    tier: <SubscriptionTier currentTier={MOCK_USER.tier} />,
    settings: <ProfileSettings user={user}/>,
  };

  const currentTierData = TIERS[MOCK_USER.tier];
  const TierIcon = currentTierData.icon;

  return (
    <div className="min-h-screen bg-[#090D16] text-gray-100 antialiased">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-60 -left-40 w-[500px] h-[500px] rounded-full bg-[#C5A880]/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-violet-900/8 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 flex gap-6 items-start">
        {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex w-64 shrink-0 flex-col gap-4 sticky top-24"
        >
          {/* Profile card */}
          <div className="rounded-2xl border border-gray-800/60 bg-[#0E1420]/70 backdrop-blur-sm p-5 text-center">
            <div className="relative inline-block mb-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#C5A880]/30 mx-auto">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#090D16] flex items-center justify-center ${currentTierData.bg} ${currentTierData.border} border`}
              >
                <TierIcon size={9} className={currentTierData.color} />
              </div>
            </div>
            <h3 className="text-base font-semibold text-gray-100">{name}</h3>
            <p className="text-xs text-gray-500 mb-3">{email}</p>
            <TierBadge tier={MOCK_USER.tier} />

            {/* mini stats */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-800/60">
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide">
                  Purchases
                </p>
                <p className="text-sm font-bold text-[#C5A880] mt-0.5">
                  {MOCK_USER.purchaseCount}/
                  {TIERS[MOCK_USER.tier].max === Infinity
                    ? "∞"
                    : TIERS[MOCK_USER.tier].max}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wide">
                  Spent
                </p>
                <p className="text-sm font-bold text-[#C5A880] mt-0.5">
                  ${MOCK_USER.totalSpent.toLocaleString()}
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 text-left ${
                    active
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

          {/* Logout */}
          <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-900/30 text-rose-500 text-sm hover:bg-rose-950/20 transition-colors">
            <LogOut size={14} />
            Sign out
          </button>
        </motion.aside>

        {/* ── Mobile top nav ────────────────────────────────────────── */}
        <div className="lg:hidden w-full mb-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === key
                    ? "bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/20"
                    : "text-gray-500 bg-gray-800/40 border border-gray-800"
                }`}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
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
        </main>
      </div>
    </div>
  );
}
