'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, User, LogOut, 
  LayoutDashboard, Sun, Moon, Settings, LogIn, UserPlus 
} from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client'; // Better-Auth signOut ইমপোর্ট করা হয়েছে
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  // console.log('user role:',user?.role);
  useEffect(() => {
    const f=()=>setMounted(true);
    f();
  }, []);

  const isActive = (path) => pathname === path;

  const handleLogout = async () => {
    try {
      await signOut({
        callbackURL: "/login"
      });
      toast.success("Logged out successfully");
      setIsDropdownOpen(false);
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <nav className="bg-[#FDFBF7]/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-gray-200/30 dark:border-gray-800/30 fixed w-full z-999 top-0 left-0 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl tracking-[0.2em] text-[#1A1A1A] dark:text-[#F3F4F6] font-light">
            AURA<span className="font-bold text-[#C5A880] dark:text-[#E2C799]">CANVAS</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 font-sans text-xs uppercase tracking-widest">
            <Link href="/" className={`relative pb-1 transition duration-300 ${isActive('/') ? 'text-[#C5A880]' : 'text-[#1A1A1A] dark:text-[#F3F4F6]'}`}>
              Home
              {isActive('/') && (
                <motion.div layoutId="underline" className="absolute left-0 bottom-0 h-[1px] w-full bg-[#C5A880]" />
              )}
            </Link>
            <Link href="/browse" className={`relative pb-1 transition duration-300 ${isActive('/browse') ? 'text-[#C5A880]' : 'text-[#1A1A1A] dark:text-[#F3F4F6]'}`}>
              Browse Artworks
              {isActive('/browse') && (
                <motion.div layoutId="underline" className="absolute left-0 bottom-0 h-[1px] w-full bg-[#C5A880]" />
              )}
            </Link>
            {user?.role ? <Link href={`/dashboard/${user?.role}`} className={`relative pb-1 transition duration-300 ${isActive(`/dashboard/${user?.role}`) ? 'text-[#C5A880]' : 'text-[#1A1A1A] dark:text-[#F3F4F6]'}`}>
              Dashboard
              {isActive(`/dashboard/${user?.role}`) && (
                <motion.div layoutId="underline" className="absolute left-0 bottom-0 h-[1px] w-full bg-[#C5A880]" />
              )}
            </Link>:""}

            {/* Theme Toggle */}
            {mounted && (
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-[#1A1A1A] dark:text-[#F3F4F6] hover:text-[#C5A880] transition-colors">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {/* Conditional Authentication Rendering */}
            {user ? (
             
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 text-xs text-[#1A1A1A] dark:text-[#F3F4F6] focus:outline-none py-2 font-medium">
                  <User size={16} className="text-[#C5A880]" />
                  <span>{user.name}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-52 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-sm shadow-xl py-2 z-50 text-[11px]"
                    >
                      {/* Dashboard option */}
                      <Link href={`/dashboard/${user.role}`} onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2.5 hover:bg-[#FDFBF7] dark:hover:bg-[#1F2937]/50 text-gray-700 dark:text-gray-300 transition-colors">
                        <LayoutDashboard size={14} className="mr-2.5 text-[#C5A880]" /> Dashboard
                      </Link>

                      <div className="border-t border-gray-100 dark:border-gray-800/60 my-1"></div>

                      {/* Log Out Button */}
                      <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 text-left transition-colors font-medium">
                        <LogOut size={14} className="mr-2.5" /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-[#1A1A1A] dark:text-[#F3F4F6] hover:text-[#C5A880] transition-colors py-2 flex items-center gap-1.5">
                  <LogIn size={14} /> Log In
                </Link>
                <Link href="/register" className="bg-[#1A1A1A] dark:bg-[#C5A880] text-white dark:text-[#0B0F19] px-4 py-2 rounded-sm hover:bg-[#C5A880] dark:hover:bg-[#E2C799] transition-all duration-300 flex items-center gap-1.5 font-medium shadow-sm">
                  <UserPlus size={14} /> Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center space-x-4">
            {mounted && (
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-[#1A1A1A] dark:text-[#F3F4F6]">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#1A1A1A] dark:text-[#F3F4F6] p-1">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Menu Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#FDFBF7] dark:bg-[#0B0F19] border-t border-gray-100 dark:border-gray-800 overflow-hidden text-xs uppercase tracking-widest shadow-lg"
          >
            <div className="px-5 py-5 space-y-4">
              <Link href="/" onClick={() => setIsOpen(false)} className="block py-2 text-[#1A1A1A] dark:text-[#F3F4F6] hover:text-[#C5A880]">Home</Link>
              <Link href="/browse" onClick={() => setIsOpen(false)} className="block py-2 text-[#1A1A1A] dark:text-[#F3F4F6] hover:text-[#C5A880]">Browse Artworks</Link>
              
              <div className="border-t border-gray-100 dark:border-gray-800/80 my-2 pt-2"></div>

              {user ? (
                <div className="space-y-3 pt-1">
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 tracking-[0.15em] mb-1 font-medium">Logged in as: {user.name}</div>
                  <Link href={`/dashboard/${user.role}`} onClick={() => setIsOpen(false)} className="flex items-center py-2 text-gray-700 dark:text-gray-300">
                    <LayoutDashboard size={14} className="mr-2 text-[#C5A880]" /> Dashboard
                  </Link>
                  
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full flex items-center py-2 text-red-600 dark:text-red-400 text-left font-medium">
                    <LogOut size={14} className="mr-2" /> Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="w-full py-2.5 border border-gray-200 dark:border-gray-800 text-center text-[#1A1A1A] dark:text-[#F3F4F6] rounded-sm flex items-center justify-center gap-1.5">
                    <LogIn size={13} /> Log In
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="w-full py-2.5 bg-[#1A1A1A] dark:bg-[#C5A880] text-white dark:text-[#0B0F19] text-center rounded-sm flex items-center justify-center gap-1.5 font-medium">
                    <UserPlus size={13} /> Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;