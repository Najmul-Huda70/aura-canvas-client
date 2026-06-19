"use client";
import React from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

const artists = [
  {
    id: 1,
    name: "Jane Vincent",
    specialty: "Oil Impressionist",
    sales: "14 Sales",
    rank: 1,
    avatar: "https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    banner: "https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=400&h=150&fit=crop",
  },
  {
    id: 2,
    name: "Michael Angelo",
    specialty: "Sculptor & Render Designer",
    sales: "9 Sales",
    rank: 2,
    avatar: "https://images.pexels.com/photos/29995688/pexels-photo-29995688.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    banner: "https://images.pexels.com/photos/1053687/pexels-photo-1053687.jpeg?auto=compress&cs=tinysrgb&w=400&h=150&fit=crop",
  },
  {
    id: 3,
    name: "ArtHub Curator",
    specialty: "Digital Abstract Artist",
    sales: "6 Sales",
    rank: 3,
    avatar: "https://images.pexels.com/photos/30976004/pexels-photo-30976004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=150&fit=crop",
  },
];

const podiumOrder = [1, 0, 2];

function ArtistCard({ artist, index }) {
  const isFirst = artist.rank === 1;

  const cardBase = "relative bg-[#111827] border border-gray-800/40 rounded-2xl overflow-hidden flex flex-col items-center pb-6 shadow-lg transition-all duration-500 ease-out cursor-pointer group hover:-translate-y-2 hover:border-[#C5A880]/30 hover:shadow-[0_20px_40px_rgba(197,168,128,0.09)]";
  const cardFirst = "-translate-y-5 border-[#C5A880]/20 shadow-[0_10px_36px_rgba(197,168,128,0.12)]";

  const avatarSizeClass = isFirst ? "w-[88px] h-[88px]" : "w-20 h-20";
  const badgeClass = isFirst
    ? "absolute bottom-0 right-0 bg-[#FFD700] text-[#0B0F19] font-sans font-bold w-6 h-6 text-[10px] flex items-center justify-center rounded-full shadow-md"
    : "absolute bottom-0 right-0 bg-[#C5A880] text-[#0B0F19] font-sans font-bold w-5 h-5 text-[9px] flex items-center justify-center rounded-full shadow-md";
  const nameClass = isFirst
    ? "text-[17px] font-serif font-medium tracking-wide text-gray-100 group-hover:text-[#C5A880] transition-colors duration-300"
    : "text-[15px] font-serif font-medium tracking-wide text-gray-100 group-hover:text-[#C5A880] transition-colors duration-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: "easeOut" }}
      className={isFirst ? `${cardBase} ${cardFirst}` : cardBase}
    >
      {isFirst && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A880] to-transparent opacity-60" />
      )}

      {/* Banner */}
      <div className="w-full h-28 relative overflow-hidden bg-gray-900 border-b border-gray-800/20">
        <img
          src={artist.banner}
          alt=""
          className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Avatar */}
      <div className="relative -mt-11 mb-3 z-10">
        {isFirst && (
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg select-none" aria-hidden="true">
            👑
          </span>
        )}
        <div className={`${avatarSizeClass} rounded-full border-[3px] border-[#111827] overflow-hidden shadow-xl bg-gray-800 transition-transform duration-500 group-hover:scale-105`}>
          <img
            src={artist.avatar}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        </div>
        <span className={badgeClass}>#{artist.rank}</span>
      </div>

      {/* Content */}
      <div className="text-center px-4 flex flex-col items-center w-full gap-3">
        <div>
          <h3 className={nameClass}>{artist.name}</h3>
          <p className="text-[10px] text-gray-500 mt-1 font-sans font-light tracking-wide">
            {artist.specialty}
          </p>
        </div>
        <span className="inline-block bg-[#C5A880]/5 border border-[#C5A880]/20 text-[#C5A880] text-[9px] font-sans uppercase tracking-[0.15em] font-medium px-4 py-[5px] rounded-full transition-all duration-300 group-hover:bg-[#C5A880] group-hover:text-[#0B0F19]">
          {artist.sales}
        </span>
      </div>
    </motion.div>
  );
}

export default function TopSellingArtists() {
  return (
    <section className="bg-[#0B0F19] text-[#F3F4F6] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 text-xl md:text-2xl font-serif tracking-wide mb-3 text-white">
            <Trophy className="text-[#C5A880]" size={22} />
            <h2>
              Top Selling <span className="text-[#C5A880] font-bold">Artists</span>
            </h2>
          </div>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-sans font-light">
            Displaying the creative minds leading transactions and collections.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {podiumOrder.map((artistIndex, gridPosition) => (
            <ArtistCard
              key={artists[artistIndex].id}
              artist={artists[artistIndex]}
              index={gridPosition}
            />
          ))}
        </div>

        <motion.div
          className="mt-10 flex items-center gap-3 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-[#C5A880]/20" />
          <span className="text-[9px] text-gray-600 uppercase tracking-[0.18em] font-sans font-light">
            Monthly Leaders
          </span>
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-[#C5A880]/20" />
        </motion.div>

      </div>
    </section>
  );
}