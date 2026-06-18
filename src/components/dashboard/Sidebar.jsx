"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  X,
  ChevronRight,
  PanelLeftOpen,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function Sidebar({ user }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Profile Settings", path: "/dashboard/profile", icon: User },
    { name: "Preferences", path: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await signOut({ callbackURL: "/login" });
      toast.success("Logged out safely");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#111827] border-r border-gray-100 dark:border-gray-800/80 sticky top-20 h-[calc(100vh-80px)]">
        {" "}
        <nav className="flex-1 px-4 py-6 space-y-1.5 text-xs uppercase tracking-widest font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between px-4 py-3.5 transition-all duration-200 rounded-sm group ${
                  isActive
                    ? "bg-[#1A1A1A] dark:bg-[#C5A880] text-white dark:text-[#0B0F19]"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1F2937]/40 hover:text-[#1A1A1A] dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    size={16}
                    className={isActive ? "text-inherit" : "text-[#C5A880]"}
                  />
                  <span>{item.name}</span>
                </div>
                <ChevronRight
                  size={12}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "hidden" : ""}`}
                />
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-xs uppercase tracking-widest font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10 rounded-sm transition-colors text-left"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

    {/* ================= MOBILE HEADER TOP BAR ================= */}
      <header className="h-10 sticky top-12 z-20 flex items-center justify-between px-4 sm:px-3 lg:hidden">
        {/* Menu button to open mobile sidebar */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white transition-colors"
        >
          <PanelLeftOpen size={22} />
        </button>

      </header>

      {/* ================= MOBILE DRAWER (SLIDE IN) ================= */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#111827] z-50 p-6 flex flex-col justify-between shadow-2xl lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                  <span className="font-serif text-md tracking-[0.2em] font-light">
                    AURA<span className="font-bold text-[#C5A880]">CANVAS</span>
                  </span>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="mt-8 space-y-1.5 text-xs uppercase tracking-widest font-medium">
                  {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-sm transition-all ${
                          isActive
                            ? "bg-[#1A1A1A] dark:bg-[#C5A880] text-white dark:text-[#0B0F19]"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1F2937]/40"
                        }`}
                      >
                        <item.icon
                          size={16}
                          className={
                            isActive ? "text-inherit" : "text-[#C5A880]"
                          }
                        />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-xs uppercase tracking-widest font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10 rounded-sm transition-colors text-left"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
