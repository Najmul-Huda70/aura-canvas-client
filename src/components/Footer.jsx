'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FacebookIcon, InstagramIcon, SendIcon, TwitterIcon } from './SVG';


const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed successfully with: ${email}`);
    setEmail('');
  };

 
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <footer className="bg-[#1A1A1A] dark:bg-[#0B0F19] text-[#9CA3AF] pt-20 pb-8 border-t border-gray-800/60 transition-colors duration-300 overflow-hidden z-999">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <Link href="/" className="font-serif text-xl tracking-[0.25em] text-[#FDFBF7] font-light">
              AURA<span className="font-bold text-[#E2C799]">CANVAS</span>
            </Link>
            <p className="font-sans font-light text-xs leading-relaxed tracking-wider text-gray-400 pt-2">
              A curated virtual haven empowering visionaries and connecting global connoisseurs with masterfully crafted digital art.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-3">
              <a href="#" className="text-gray-500 hover:text-[#E2C799] transition duration-300"><InstagramIcon /></a>
              <a href="#" className="text-gray-500 hover:text-[#E2C799] transition duration-300"><FacebookIcon /></a>
              <a href="#" className="text-gray-500 hover:text-[#E2C799] transition duration-300"><TwitterIcon /></a>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-serif text-xs text-[#E2C799] tracking-[0.2em] uppercase mb-6 font-semibold">Exhibitions</h3>
            <ul className="space-y-3 font-sans text-xs uppercase tracking-widest font-light">
              <li><Link href="/about" className="hover:text-[#E2C799] hover:pl-1 transition-all duration-300">About Gallery</Link></li>
              <li><Link href="/browse" className="hover:text-[#E2C799] hover:pl-1 transition-all duration-300">Browse Artworks</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#E2C799] hover:pl-1 transition-all duration-300">Privacy Policy</Link></li>
            </ul>
          </motion.div>

          {/* Collections */}
          <motion.div variants={itemVariants}>
            <h3 className="font-serif text-xs text-[#E2C799] tracking-[0.2em] uppercase mb-6 font-semibold">Collections</h3>
            <ul className="space-y-3 font-sans text-xs uppercase tracking-widest font-light">
              <li><a href="#" className="hover:text-[#E2C799] hover:pl-1 transition-all duration-300">Digital Impressionism</a></li>
              <li><a href="#" className="hover:text-[#E2C799] hover:pl-1 transition-all duration-300">3D Abstract Sculptures</a></li>
              <li><a href="#" className="hover:text-[#E2C799] hover:pl-1 transition-all duration-300">Vector Minimalism</a></li>
            </ul>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-serif text-xs text-[#E2C799] tracking-[0.2em] uppercase mb-2 font-semibold">Newsletter</h3>
            <p className="font-sans font-light text-xs tracking-wider text-gray-400">
              Receive private invitations for high-profile digital artist drops.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 pt-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-gray-600 border-b border-gray-700 pb-3 pt-1 rounded-none focus:outline-none focus:border-[#E2C799] text-xs tracking-widest uppercase transition-colors duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-0 pb-2 text-gray-500 hover:text-[#E2C799] transition-colors duration-300"
                  aria-label="Subscribe"
                >
                  <SendIcon/>
                </button>
              </div>
            </form>
          </motion.div>

        </div>

        {/* Bottom Copyright Section */}
        <motion.div 
          variants={itemVariants}
          className="pt-8 border-t border-gray-800/60 text-center font-sans text-[10px] tracking-[0.25em] uppercase text-gray-600"
        >
          <p>&copy; {new Date().getFullYear()} AuraCanvas Studio. All Rights Reserved.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;