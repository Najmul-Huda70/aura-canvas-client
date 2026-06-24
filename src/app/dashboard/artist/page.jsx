"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  PlusCircle,
  Settings,
  LogOut,
  Palette,
  ChevronRight,
  Edit3,
  Trash2,
  Upload,
  X,
  CheckCircle,
  XCircle,
  Loader2,
  History,
  ImageIcon,
  RotateCcw,
  Camera,
  EyeOff,
  Eye,
  Check,
  AlertCircle,
  Icon,
  Package,
} from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import AddArtwork from "@/components/dashboard/artist/AddArtwork";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API;
const CATEGORIES = [
  "Landscape",
  "Abstract",
  "Watercolor",
  "Oil",
  "Portrait",
  "Digital",
  "Sculpture",
  "Photography",
];

const SALES_HISTORY = [
  {
    id: "s1",
    artworkTitle: "Solitude at 3AM",
    buyer: "Lucas Ferreira",
    date: "2024-11-22",
    amount: 520,
  },
  {
    id: "s2",
    artworkTitle: "Watercolor Monsoon",
    buyer: "Arjun Bose",
    date: "2024-12-04",
    amount: 640,
  },
];
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const NAV_ITEMS = [
  { key: "artworks", label: "My Artworks", icon: LayoutGrid },
  { key: "add", label: "Add Artwork", icon: PlusCircle },
  { key: "sales", label: "Sales History", icon: History },
  { key: "settings", label: "Profile Settings", icon: Settings },
];

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Toast({ message, type = "success", onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm ${
        type === "success"
          ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
          : "bg-rose-950/90 border-rose-500/30 text-rose-300"
      } backdrop-blur-md`}
    >
      {type === "success" ? <CheckCircle size={15} /> : <XCircle size={15} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X size={13} />
      </button>
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
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    { method: "POST", body: formData },
  );
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || "Upload failed");
  return data.data.url;
}

export function ImageUploadZone({ onUpload, previewUrl, setPreviewUrl }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef();

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files allowed.");
      return;
    }

    setUploadError("");
    setUploading(true);
    setProgress(0);

    const interval = setInterval(
      () => setProgress((p) => Math.min(p + 15, 90)),
      150,
    );

    try {
      const url = await uploadToImgBB(file);
      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        setUploading(false);
        setPreviewUrl(url);
        onUpload(url);
      }, 300);
    } catch (err) {
      clearInterval(interval);
      setUploading(false);
      setUploadError("Upload failed. Please try again.");
    }
  }

  return (
    <div className="relative">
      <div
        className={`relative rounded-xl border border-dashed transition-all duration-200 cursor-default overflow-hidden bg-[#070B13] ${
          previewUrl
            ? "border-[#C5A880]/40"
            : "border-gray-800 hover:border-gray-700 cursor-pointer"
        }`}
        style={{ minHeight: 140 }}
        onClick={() => !previewUrl && !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div key="preview" className="relative group">
              <img
                src={previewUrl}
                alt="artwork"
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C5A880]/20 border border-[#C5A880]/40 rounded-full text-xs font-semibold text-[#C5A880]"
                >
                  <RotateCcw size={12} /> Change Image
                </button>
              </div>
            </motion.div>
          ) : uploading ? (
            <motion.div
              key="loading"
              className="flex flex-col items-center justify-center h-40 gap-3"
            >
              <Loader2 size={24} className="text-[#C5A880] animate-spin" />
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-200">
                  Uploading Piece ({progress}%)
                </p>
              </div>
              <div className="w-24 h-0.5 bg-gray-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[#C5A880]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="flex flex-col items-center justify-center h-40 gap-2.5 text-center px-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-600">
                <ImageIcon size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-300">
                  Click or Drag & Drop Image
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {uploadError && (
        <p className="text-xs text-rose-400 mt-1">{uploadError}</p>
      )}
    </div>
  );
}

function ArtworkForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [desc, setDesc] = useState(initial?.description || "");
  const [price, setPrice] = useState(initial?.price || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || "");

  const inputClass =
    "w-full bg-[#070B13] border border-gray-800/80 focus:border-[#C5A880]/40 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors";

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !price || !category || !imageUrl) return;
    onSubmit({
      title,
      description: desc,
      price: Number(price),
      category,
      imageUrl,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label className="block text-[11px] text-gray-400 mb-1.5">
          Artwork Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-[11px] text-gray-400 mb-1.5">
          Description
        </label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] text-gray-400 mb-1.5">
            Price ($ USD)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-[11px] text-gray-400 mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[11px] text-gray-400 mb-1.5">
          Upload Image
        </label>
        <ImageUploadZone
          onUpload={setImageUrl}
          previewUrl={imageUrl}
          setPreviewUrl={setImageUrl}
        />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#C5A880] text-[#070B13] text-xs font-semibold hover:bg-[#bfa075] transition-colors"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-gray-800 text-gray-400 text-xs hover:bg-gray-800/30"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function DeleteModal({ title, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#090E17] border border-gray-800 rounded-xl p-5 w-full max-w-xs text-center shadow-xl">
        <p className="text-sm font-semibold text-gray-200">Delete Artwork?</p>
        <p className="text-xs text-gray-500 mt-1">
          Are you sure you want to delete `{title}`?
        </p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-rose-600 text-white text-xs font-medium"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-gray-800 text-gray-400 text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function MyArtworks({ artworks, setArtworks, setActiveTab, showToast }) {
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditSubmit = async (updatedData) => {
    try {
      setIsUpdating(true);
      const res = await fetch(`${BASE_URL}/artworks/${editTarget._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        setArtworks((p) =>
          p.map((a) =>
            a._id === editTarget._id ? { ...a, ...updatedData } : a,
          ),
        );
        showToast("Artwork updated successfully!");
        setEditTarget(null);
      } else {
        showToast(resData.message || "Failed to update artwork", "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      showToast("Server error. Could not update.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-medium text-gray-100">My Artworks</h2>
        <p className="text-xs text-gray-500">Manage your gallery collection</p>
      </div>

      <AnimatePresence mode="wait">
        {editTarget ? (
          <motion.div
            key="edit-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-gray-800 bg-[#090E17]/60 p-5 rounded-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-[#C5A880]">
                Edit Artwork: {editTarget.title}
              </h3>
              <button
                onClick={() => setEditTarget(null)}
                className="text-xs text-gray-500 hover:text-gray-300"
              >
                Cancel
              </button>
            </div>

            <ArtworkForm
              initial={editTarget}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditTarget(null)}
              submitLabel={isUpdating ? "Saving..." : "Save Changes"}
            />
          </motion.div>
        ) : artworks.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-gray-800/60 rounded-xl bg-[#090E17]/20 p-12 flex flex-col items-center justify-center text-center min-h-[340px]"
          >
            <div className="w-14 h-14 bg-[#131B2A] border border-gray-800 rounded-2xl flex items-center justify-center text-[#C5A880]/60 mb-4">
              <ImageIcon size={24} />
            </div>
            <h3 className="text-sm font-semibold text-gray-300">
              No Artworks Found
            </h3>
            <button
              onClick={() => setActiveTab("add")}
              className="flex items-center gap-2 px-4 py-2 bg-[#C5A880]/10 border border-[#C5A880]/20 rounded-xl text-xs font-semibold text-[#C5A880] hover:bg-[#C5A880]/20 transition-all"
            >
              <PlusCircle size={14} /> Add First Artwork
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            className="border border-gray-800/60 rounded-xl bg-[#090E17]/40 overflow-hidden"
          >
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
                  <tr
                    key={art._id}
                    className="hover:bg-gray-800/10 transition-colors"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={art.imageUrl}
                        className="w-9 h-9 object-cover rounded-lg bg-gray-800"
                      />
                      <span className="font-medium text-gray-200">
                        {art.title}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{art.category}</td>
                    <td className="p-4 text-[#C5A880] font-semibold">
                      ${art.price.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide border ${
                          art.status === "available"
                            ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-400"
                            : "bg-amber-950/30 border-amber-500/20 text-amber-400"
                        }`}
                      >
                        {art.status || "available"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditTarget(art)}
                          className="p-1.5 border border-gray-800 rounded-lg text-gray-400 hover:text-[#C5A880]"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(art)}
                          className="p-1.5 border border-gray-800 rounded-lg text-gray-400 hover:text-rose-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.title}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            try {
              const res = await fetch(
                `${BASE_URL}/artworks/${deleteTarget._id}`,
                { method: "DELETE" },
              );
              const resData = await res.json();
              if (res.ok && resData.success) {
                setArtworks((p) => p.filter((a) => a._id !== deleteTarget._id));
                showToast("Artwork permanently deleted");
              } else {
                showToast(resData.message || "Failed to delete", "error");
              }
            } catch (error) {
              console.error(error);
              showToast("Server error", "error");
            } finally {
              setDeleteTarget(null);
            }
          }}
        />
      )}
    </motion.div>
  );
}

function SalesHistory({ sales }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-medium text-gray-100">Sales History</h2>
        <p className="text-xs text-gray-500">
          Track and monitor earnings from your artwork sales
        </p>
      </div>
      <div className="border border-gray-800/60 rounded-xl bg-[#090E17]/40 overflow-hidden">
        {sales.length > 0 ? (
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
              {sales.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-gray-800/10 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-200">
                    {s.artworkTitle}
                  </td>
                  <td className="p-4 text-gray-400">{s.buyer}</td>
                  <td className="p-4 text-gray-500">{formatDate(s.date)}</td>
                  <td className="p-4 text-[#C5A880] font-semibold">
                    ${s.amount}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 uppercase">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-center max-w-md mx-auto my-10">
            <div className="w-16 h-16 bg-[#E6C594]/10 rounded-full flex items-center justify-center text-[#E6C594] mb-5 animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-medium text-white mb-2 tracking-wide">
              No Sales History
            </h3>
            <p className="text-gray-400 text-sm max-w-xs mb-6 leading-relaxed">
              You haven't sold any artworks yet. Once someone purchases your
              art, the transaction details will appear here.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ProfileSettings({ user }) {
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
        window.location.href = "/";
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/20">
            <Palette size={11} /> ARTIST
          </span>
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
        <button
          onClick={handleDelete}
          className="text-xs text-rose-500 border border-rose-800/50 px-4 py-2 rounded-lg hover:bg-rose-900/20 transition-colors font-medium"
        >
          Delete account
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function ArtistDashboard() {
  const [activeTab, setActiveTab] = useState("artworks");
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast, clearToast } = useToast();
  const [sales, setSales] = useState([]);
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userId = user?.id;

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        const [artworksRes, salesRes] = await Promise.all([
          fetch(`${BASE_URL}/artworks?userId=${userId}`),
          fetch(`${BASE_URL}/purchase?userId=${userId}`),
        ]);

        const artworksData = await artworksRes.json();
        const salesData = await salesRes.json();

        if (artworksData && artworksData.success && artworksData.data) {
          setArtworks(artworksData.data);
        } else {
          setArtworks([]);
        }

        if (salesData && salesData.success && salesData.data) {
          setSales(salesData.data);
        } else {
          setSales([]);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setArtworks([]);
        setSales([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userId]);

  const totalSpentOrEarned = artworks.reduce(
    (acc, curr) => acc + (curr.status === "sold" ? curr.price : 0),
    0,
  );
  useEffect(() => {
    if (isPending) return;
    if (!user) {
      redirect("/unauthorized");
    } else if (user?.role !== "artist") {
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

  return (
    <div className="min-h-screen mt-20 bg-[#070B13] text-gray-100 flex flex-col md:flex-row p-4 md:p-6 gap-6 font-sans">
      <aside className="w-full md:w-65 flex flex-col gap-4 shrink-0">
        <div className="bg-[#090E17] border border-gray-800/70 rounded-2xl p-5 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
          <div className="relative mt-2">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-800">
              <img
                src={user?.image || "https://via.placeholder.com/150"}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#090E17] rounded-full animate-pulse" />
          </div>

          <h2 className="text-base font-semibold text-gray-100 mt-3 tracking-wide">
            {user?.name}
          </h2>
          <p className="text-xs text-gray-500 mb-3">{user?.email}</p>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/20">
            <Palette size={11} /> ARTIST
          </span>

          <div className="w-full grid grid-cols-2 border-t border-gray-800/50 pt-4 mt-4 text-center">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                Artworks
              </p>
              <p className="text-sm font-bold text-gray-200 mt-0.5">
                {loading ? "..." : artworks.length}
              </p>
            </div>
            <div className="border-l border-gray-800/50">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                Earned
              </p>
              <p className="text-sm font-bold text-[#C5A880] mt-0.5">
                ${totalSpentOrEarned.toLocaleString()}
              </p>
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
                    <Icon
                      size={14}
                      className={
                        isActive
                          ? "text-[#C5A880]"
                          : "text-gray-500 group-hover:text-gray-400"
                      }
                    />
                    {item.label}
                  </div>
                  {isActive && (
                    <ChevronRight size={12} className="text-[#C5A880]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-5 md:p-6 overflow-x-hidden min-h-255 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-xs gap-2">
            <Loader2 className="animate-spin text-[#C5A880]" size={16} />{" "}
            Loading assets...
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              {activeTab === "artworks" && (
                <MyArtworks
                  artworks={artworks}
                  setArtworks={setArtworks}
                  setActiveTab={setActiveTab}
                  showToast={showToast}
                />
              )}
              {activeTab === "add" && (
                <AddArtwork
                  setArtworks={setArtworks}
                  setActiveTab={setActiveTab}
                  showToast={showToast}
                  userId={userId}
                  userName={user?.name}
                />
              )}
              {activeTab === "sales" && <SalesHistory sales={sales} />}
              {activeTab === "settings" && <ProfileSettings user={user} />}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={clearToast}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
