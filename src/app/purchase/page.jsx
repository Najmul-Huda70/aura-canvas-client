"use client";

import { use } from "react"; // Next.js-এ searchParams আনর‍্যাপ করার জন্য

export default function PurchasePage({ searchParams }) {
   const { artworkId, userId } = use(searchParams);

  console.log("Artwork ID:", artworkId);
  console.log("User ID:", userId);

  return (
    <div className="min-h-screen bg-[#111117] text-white p-10">
      <h1 className="text-2xl font-medium text-[#E6C594] mb-4">Checkout Page</h1>
      <p>Buying Artwork ID: <span className="text-gray-400">{artworkId}</span></p>
      <p>Buyer User ID: <span className="text-gray-400">{userId}</span></p>
      
      {/* এখানে আপনার পেমেন্ট বা গেটওয়ে ফর্ম থাকবে */}
    </div>
  );
}