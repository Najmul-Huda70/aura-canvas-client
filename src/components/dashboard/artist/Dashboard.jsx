"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, PlusCircle, Settings, LogOut,
  Palette, ChevronRight, Edit3, Trash2,
  Upload, X, CheckCircle, XCircle, Loader2,
  History, ImageIcon
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

const IMGBB_API_KEY = "YOUR_IMGBB_API_KEY"; 
const CATEGORIES = ["Landscape", "Abstract", "Watercolor", "Oil", "Portrait", "Digital", "Sculpture", "Photography"];

const SALES_HISTORY = [
  { id: "s1", artworkTitle: "Solitude at 3AM",    buyer: "Lucas Ferreira", date: "2024-11-22", amount: 520 },
  { id: "s2", artworkTitle: "Watercolor Monsoon", buyer: "Arjun Bose",     date: "2024-12-04", amount: 640 },
];

const NAV_ITEMS = [
  { key: "artworks", label: "My Artworks",     icon: LayoutGrid },
  { key: "add",      label: "Add Artwork",      icon: PlusCircle },
  { key: "sales",    label: "Sales History",    icon: History },
  { key: "settings", label: "Profile Settings", icon: Settings },
];

const pageVariants = {
  hidden:  { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Toast({ message, type = "success", onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm ${
        type === "success" ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300" : "bg-rose-950/90 border-rose-500/30 text-rose-300"
      } backdrop-blur-md`}
    >
      {type === "success" ? <CheckCircle size={15} /> : <XCircle size={15} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X size={13} /></button>
    </motion.div>
  );
}

function useToast() {
  const [toast, setToast] = useState(null);
  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }
  return { toast, showToast, clearToast: () => setToast(null) };
}

async function uploadToImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || "Upload failed");
  return data.data.url;
}

function ImageUploadZone({ onUpload, previewUrl, setPreviewUrl }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef();

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setUploadError("Only image files allowed."); return; }
    setUploadError("");
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => setProgress(p => Math.min(p + 15, 90)), 150);
    try {
      const url = await uploadToImgBB(file);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => { setUploading(false); setPreviewUrl(url); onUpload(url); }, 300);
    } catch (err) {
      clearInterval(interval);
      setUploading(false);
      setUploadError("Upload failed. Please try again.");
    }
  }

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative rounded-xl border border-dashed transition-all duration-200 cursor-pointer overflow-hidden bg-[#070B13] ${
          previewUrl ? "border-[#C5A880]/40" : "border-gray-800 hover:border-gray-700"
        }`}
        style={{ minHeight: 140 }}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div key="preview" className="relative">
              <img src={previewUrl} alt="preview" className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-xs">Change Image</span>
              </div>
            </motion.div>
          ) : uploading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <Loader2 size={24} className="text-[#C5A880] animate-spin" />
              <p className="text-xs text-gray-400">Uploading ({progress}%)</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <Upload size={20} className="text-gray-600" />
              <p className="text-xs text-gray-400">Click or drag image here</p>
            </div>
          )}
        </AnimatePresence>
      </div>
      {uploadError && <p className="text-xs text-rose-400 mt-1">{uploadError}</p>}
    </div>
  );
}

function ArtworkForm({ initial = null, onSubmit, onCancel, submitLabel = "Publish Artwork" }) {
  const [title, setTitle]       = useState(initial?.title || "");
  const [desc, setDesc]         = useState(initial?.description || "");
  const [price, setPrice]       = useState(initial?.price || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || ""); 
  const [previewUrl, setPreviewUrl] = useState(initial?.imageUrl || "");
  const [errors, setErrors]     = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !price || !category || !imageUrl) {
      setErrors({ general: "Please fill all required fields" });
      return;
    }
    onSubmit({ title, description: desc, price: Number(price), category, imageUrl });
  }

  const inputClass = "w-full bg-[#070B13] border border-gray-800/80 focus:border-[#C5A880]/40 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-700 focus:outline-none transition-colors";
  const labelClass = "block text-[11px] text-gray-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Artwork Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter title" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Describe your piece" className={inputClass + " resize-none"} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price ($ USD)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
            <option value="">Select Category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Upload Image</label>
        <ImageUploadZone onUpload={setImageUrl} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} />
      </div>
      {errors.general && <p className="text-xs text-rose-400">{errors.general}</p>}
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#C5A880] text-[#070B13] text-xs font-semibold hover:bg-[#bfa075] transition-colors">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-gray-800 text-gray-400 text-xs hover:bg-gray-800/30">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function DeleteModal({ title, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#090E17] border border-gray-800 rounded-xl p-5 w-full max-w-xs text-center shadow-xl">
        <p className="text-sm font-semibold text-gray-200">Delete Artwork?</p>
        <p className="text-xs text-gray-500 mt-1">Are you sure you want to delete "{title}"?</p>
        <div className="flex gap-2 mt-4">
          <button onClick={onConfirm} className="flex-1 py-2 rounded-lg bg-rose-600 text-white text-xs font-medium">Delete</button>
          <button onClick={onCancel} className="flex-1 py-2 rounded-lg border border-gray-800 text-gray-400 text-xs">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Page: My Artworks ────────────────────────────────────────────────────────
function MyArtworks({ artworks, setArtworks, setActiveTab, showToast }) {
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-gray-100">My Artworks</h2>
        <p className="text-xs text-gray-500">Manage your gallery collection</p>
      </div>

      <AnimatePresence mode="wait">
        {editTarget ? (
          <motion.div key="edit" className="border border-gray-800 bg-[#090E17]/60 p-5 rounded-xl">
            <ArtworkForm initial={editTarget} onSubmit={(upd) => {
              setArtworks(p => p.map(a => a._id === editTarget._id ? {...a, ...upd} : a));
              setEditTarget(null);
              showToast("Artwork updated");
            }} onCancel={() => setEditTarget(null)} submitLabel="Save Changes" />
          </motion.div>
        ) : artworks.length === 0 ? (
          /* ─── EMPTY STATE CREATED HERE ─── */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-gray-800/60 rounded-xl bg-[#090E17]/20 p-12 flex flex-col items-center justify-center text-center min-h-[340px]"
          >
            <div className="w-14 h-14 bg-[#131B2A] border border-gray-800 rounded-2xl flex items-center justify-center text-[#C5A880]/60 mb-4">
              <ImageIcon size={24} />
            </div>
            <h3 className="text-sm font-semibold text-gray-300">No Artworks Found</h3>
            <p className="text-xs text-gray-500 max-w-xs mt-1 mb-5">You haven't listed any art pieces in your gallery yet. Start publishing your work.</p>
            <button 
              onClick={() => setActiveTab("add")}
              className="flex items-center gap-2 px-4 py-2 bg-[#C5A880]/10 border border-[#C5A880]/20 rounded-xl text-xs font-semibold text-[#C5A880] hover:bg-[#C5A880]/20 transition-all"
            >
              <PlusCircle size={14} /> Add First Artwork
            </button>
          </motion.div>
        ) : (
          <motion.div key="table" className="border border-gray-800/60 rounded-xl bg-[#090E17]/40 overflow-hidden">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-800/60 bg-[#070B13]/40 text-[11px] text-gray-500 uppercase tracking-wider">
                  <th className="p-4 font-normal">Artwork</th>
                  <th className="p-4 font-normal">Category</th>
                  <th className="p-4 font-normal">Price</th>
                  <th className="p-4 font-normal">Status</th>
                  <th className="p-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-gray-800/30">
                {artworks.map((art) => (
                  <tr key={art._id} className="hover:bg-gray-800/10 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={art.imageUrl} className="w-9 h-9 object-cover rounded-lg bg-gray-800" />
                      <span className="font-medium text-gray-200">{art.title}</span>
                    </td>
                    <td className="p-4 text-gray-400">{art.category}</td>
                    <td className="p-4 text-[#C5A880] font-semibold">${art.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide border ${
                        art.status === 'active' ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-400' : 'bg-amber-950/30 border-amber-500/20 text-amber-400'
                      }`}>
                        {art.status === 'active' ? 'Active' : 'Sold'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditTarget(art)} className="p-1.5 border border-gray-800 rounded-lg text-gray-400 hover:text-[#C5A880]"><Edit3 size={13}/></button>
                        <button onClick={() => setDeleteTarget(art)} className="p-1.5 border border-gray-800 rounded-lg text-gray-400 hover:text-rose-400"><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
      {deleteTarget && <DeleteModal title={deleteTarget.title} onCancel={() => setDeleteTarget(null)} onConfirm={() => {
        setArtworks(p => p.filter(a => a._id !== deleteTarget._id));
        setDeleteTarget(null);
        showToast("Artwork removed");
      }} />}
    </motion.div>
  );
}

// ─── Page: Add Artwork ────────────────────────────────────────────────────────
function AddArtwork({ setArtworks, setActiveTab, showToast }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-medium text-gray-100">Add New Artwork</h2>
        <p className="text-xs text-gray-500">Publish your latest masterpiece to the marketplace</p>
      </div>
      <div className="border border-gray-800 bg-[#090E17]/50 p-5 rounded-xl">
        <ArtworkForm onSubmit={(data) => {
          setArtworks(p => [{ _id: `a_${Date.now()}`, ...data, status: "active" }, ...p]);
          showToast("Artwork successfully published!");
          setActiveTab("artworks");
        }} />
      </div>
    </motion.div>
  );
}

// ─── Page: Sales History ──────────────────────────────────────────────────────
function SalesHistory() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-gray-100">Sales History</h2>
        <p className="text-xs text-gray-500">Track and monitor earnings from your artwork sales</p>
      </div>
      <div className="border border-gray-800/60 rounded-xl bg-[#090E17]/40 overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-800/60 bg-[#070B13]/40 text-[11px] text-gray-500 uppercase tracking-wider">
              <th className="p-4 font-normal">Artwork</th>
              <th className="p-4 font-normal">Buyer</th>
              <th className="p-4 font-normal">Date</th>
              <th className="p-4 font-normal">Amount</th>
              <th className="p-4 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-gray-800/30">
            {SALES_HISTORY.map((s) => (
              <tr key={s.id} className="hover:bg-gray-800/10 transition-colors">
                <td className="p-4 font-medium text-gray-200">{s.artworkTitle}</td>
                <td className="p-4 text-gray-400">{s.buyer}</td>
                <td className="p-4 text-gray-500">{formatDate(s.date)}</td>
                <td className="p-4 text-[#C5A880] font-semibold">${s.amount}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 uppercase">Completed</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ─── Page: Profile Settings ───────────────────────────────────────────────────
function ProfileSettings({ showToast }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const inputClass = "w-full bg-[#070B13] border border-gray-800 focus:border-[#C5A880]/40 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-700 focus:outline-none";

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-medium text-gray-100">Profile Settings</h2>
        <p className="text-xs text-gray-500">Manage your profile visibility and info</p>
      </div>
      <div className="border border-gray-800 bg-[#090E17]/50 p-5 rounded-xl space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Display Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Email Address</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="Your email" />
        </div>
        <button onClick={() => showToast("Profile settings saved")} className="px-5 py-2 rounded-xl bg-[#C5A880] text-[#070B13] text-xs font-semibold">
          Save Settings
        </button>
      </div>
    </motion.div>
  );
}
const SERVER_URL=process.env.NEXT_PUBLIC_SERVER_URL;
// ─── Main ArtistDashboard Component ─────────────────
export default function ArtistDashboard() {
  const [activeTab, setActiveTab] = useState("artworks");
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast, clearToast } = useToast();
  
  const { data: session } = useSession();
  const user = session?.user;
  const userId = user?.id;

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const res = await fetch(`${SERVER_URL}/artworks?id=${userId}`);
        const resData = await res.json();
        if (resData && resData.data) {
          setArtworks(resData.data);
        } else {
          setArtworks([]);
        }
      } catch (error) {
        console.error("Error loading artworks:", error);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const totalSpentOrEarned = artworks.reduce((acc, curr) => acc + (curr.status === 'sold' ? curr.price : 0), 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#070B13] flex items-center justify-center text-gray-400 text-xs">
        <Loader2 className="animate-spin text-[#C5A880] mr-2" size={16} /> Authenticating session...
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-[#070B13] text-gray-100 flex flex-col md:flex-row p-4 md:p-6 gap-6 font-sans">
      
      {/* ─── LEFT SIDEBAR ─── */}
      <aside className="w-full md:w-65 flex flex-col gap-4 shrink-0">
        <div className="bg-[#090E17] border border-gray-800/70 rounded-2xl p-5 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
          <div className="relative mt-2">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-800">
              <img src={user?.image || "https://via.placeholder.com/150"} alt={user?.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#090E17] rounded-full animate-pulse" />
          </div>

          <h2 className="text-base font-semibold text-gray-100 mt-3 tracking-wide">{user?.name}</h2>
          <p className="text-xs text-gray-500 mb-3">{user?.email}</p>
          
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/20">
            <Palette size={11} /> ARTIST
          </span>

          <div className="w-full grid grid-cols-2 border-t border-gray-800/50 pt-4 mt-4 text-center">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Artworks</p>
              <p className="text-sm font-bold text-gray-200 mt-0.5">{loading ? "..." : artworks.length}</p>
            </div>
            <div className="border-l border-gray-800/50">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Earned</p>
              <p className="text-sm font-bold text-[#C5A880] mt-0.5">${totalSpentOrEarned.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#090E17] border border-gray-800/70 rounded-2xl p-2 flex flex-col gap-1 shadow-lg">
          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? "bg-[#131B2A] text-[#C5A880] border-l-2 border-[#C5A880] rounded-l-none pl-3"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={14} className={isActive ? "text-[#C5A880]" : "text-gray-500 group-hover:text-gray-400"} />
                    {item.label}
                  </div>
                  {isActive && <ChevronRight size={12} className="text-[#C5A880]" />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="bg-[#090E17] border border-gray-800/70 rounded-2xl p-2 shadow-lg">
          <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-400/90 hover:bg-rose-950/20 hover:text-rose-400 transition-colors group">
            <LogOut size={14} className="text-rose-400/60 group-hover:text-rose-400" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ─── RIGHT MAIN PANEL ─── */}
      <main className="flex-1 bg-[#090E17]/40 border border-gray-800/50 rounded-2xl p-5 md:p-6 shadow-xl overflow-x-hidden min-h-[500px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-xs gap-2">
            <Loader2 className="animate-spin text-[#C5A880]" size={16} /> Loading assets...
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              {activeTab === "artworks" && (
                <MyArtworks artworks={artworks} setArtworks={setArtworks} setActiveTab={setActiveTab} showToast={showToast} />
              )}
              {activeTab === "add" && (
                <AddArtwork setArtworks={setArtworks} setActiveTab={setActiveTab} showToast={showToast} />
              )}
              {activeTab === "sales" && <SalesHistory />}
              {activeTab === "settings" && <ProfileSettings showToast={showToast} />}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
      </AnimatePresence>
    </div>
  );
}