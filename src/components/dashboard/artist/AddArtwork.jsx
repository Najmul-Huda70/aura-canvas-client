"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Upload, Loader2, ImageIcon, RotateCcw } from "lucide-react";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API;
const CATEGORIES = ["Landscape", "Abstract", "Watercolor", "Oil", "Portrait", "Digital", "Sculpture", "Photography"];
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

async function uploadToImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || "Upload failed");
  return data.data.url;
}

function LocalImageUploadZone({ onUpload, previewUrl, setPreviewUrl }) {
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
        onClick={() => !previewUrl && !uploading && inputRef.current?.click()}
        className={`relative rounded-xl border border-dashed transition-all duration-200 cursor-default overflow-hidden bg-[#070B13] ${
          previewUrl ? "border-[#C5A880]/40" : "border-gray-800 hover:border-gray-700 cursor-pointer"
        }`}
        style={{ minHeight: 140 }}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div key="preview" className="relative group">
              <img src={previewUrl} alt="preview" className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2.5">
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C5A880]/20 border border-[#C5A880]/40 rounded-full text-xs font-semibold text-[#C5A880]"
                >
                  <RotateCcw size={12} /> Change Image
                </button>
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

export default function AddArtwork({ setArtworks, setActiveTab, showToast, userId }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublishArtwork = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !price || !category || !imageUrl) {
      showToast("Please fill all required fields", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        title: title.trim(),
        description: desc,
        price: Number(price),
        category: category,
        imageUrl: imageUrl,
        artistId: userId
      };

      const res = await fetch(`${BASE_URL}/artworks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        const newlyCreated = {
          _id: resData.artworkId || resData.data?._id, 
          ...payload,
          status: "available"
        };

        setArtworks(p => [newlyCreated, ...p]);
        showToast("Artwork successfully published!");
        setActiveTab("artworks"); 
      } else {
        showToast(resData.message || "Failed to save artwork", "error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      showToast("Server error. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-[#070B13] border border-gray-800/80 focus:border-[#C5A880]/40 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors";

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-medium text-gray-100">Add New Artwork</h2>
        <p className="text-xs text-gray-500">Publish your latest masterpiece to the marketplace</p>
      </div>
      
      <div className="border border-gray-800 bg-[#090E17]/50 p-5 rounded-xl">
        <form onSubmit={handlePublishArtwork} className="space-y-4">
          <div>
            <label className="block text-[11px] text-gray-400 mb-1.5">Artwork Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter title" className={inputClass} />
          </div>
          
          <div>
            <label className="block text-[11px] text-gray-400 mb-1.5">Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Describe your piece" className={`${inputClass} resize-none`} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1.5">Price ($ USD)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1.5">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1.5">Upload Image</label>
            <LocalImageUploadZone onUpload={setImageUrl} previewUrl={imageUrl} setPreviewUrl={setImageUrl} />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl bg-[#C5A880] text-[#070B13] text-xs font-semibold hover:bg-[#bfa075] transition-colors disabled:opacity-50">
              {isSubmitting ? "Publishing..." : "Publish Artwork"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}