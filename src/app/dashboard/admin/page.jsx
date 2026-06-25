"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Palette,
  Receipt,
  BarChart3,
  Shield,
  Trash2,
  UserCheck,
  ChevronRight,
  CheckCircle,
  X,
  DollarSign,
  ShoppingBag,
  PieChart,
  LogOut,
  Loader2,
  Check,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import { toast } from "react-hot-toast";
// ─── Mock Data ────────────────────────────────────────────────────────────────

const orders = [
  {
    id: "TXN98321",
    type: "purchase",
    email: "lucas@gmail.com",
    amount: 520,
    date: "Nov 22, 2024",
  },
  {
    id: "TXN98450",
    type: "subscription",
    email: "robin@gmail.com",
    amount: 29,
    date: "Nov 28, 2024",
  },
  {
    id: "TXN98612",
    type: "purchase",
    email: "arjun@gmail.com",
    amount: 640,
    date: "Dec 4, 2024",
  },
  {
    id: "TXN98701",
    type: "subscription",
    email: "hamid@gmail.com",
    amount: 29,
    date: "Dec 10, 2024",
  },
];

const MONTHLY_SALES = [
  { month: "Jan", amount: 450 },
  { month: "Feb", amount: 820 },
  { month: "Mar", amount: 1100 },
  { month: "Apr", amount: 950 },
  { month: "May", amount: 1400 },
  { month: "Jun", amount: 1218 },
];

// Nav Items according to layout
const NAV_ITEMS = [
  { key: "analytics", label: "Analytics Overview", icon: BarChart3 },
  { key: "users", label: "Manage Users", icon: Users },
  { key: "artworks", label: "Manage Artworks", icon: Palette },
  { key: "orders", label: "orders", icon: Receipt },
];

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [users, setUsers] = useState([]);
  const [orders,setOrders]=useState([]);
  const [artworks, setArtworks] = useState([]);
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const router = useRouter();

  // Load Initial Data using apiService
  useEffect(() => {
    const reload = async () => {
      try {
        const [allUser, allArtworks,allOrders] = await Promise.all([
          apiService.getUser(), // Calling your centralized users/reviews route handler
          apiService.getArtworks(), // Calling your centralized artworks route handler
          apiService.getAllOrders(),
        ]);

        if (allUser.success) setUsers(allUser.data);
        if (allArtworks.success) setArtworks(allArtworks.data);
        if(allOrders.success) setOrders(allOrders.data);
      } catch (error) {
        console.error("Fetch failed:", error);
        toast.error("Failed to fetch administrative collections.");
      }
    };
    reload();
  }, []);
console.log('orders:',orders);
  // Data Computations (Variables completely unchanged)
  const totaArtworks = artworks.length;
  const CATEGORY_DATA =
    artworks.length > 0
      ? Object.values(
          artworks.reduce((acc, curr) => {
            const CatName = curr.category || "Uncategory";
            if (!acc[CatName]) {
              const colors = [
                "bg-[#C5A880]", "bg-blue-500", "bg-emerald-500", "bg-purple-500",
                "bg-amber-500", "bg-rose-500", "bg-indigo-500", "bg-cyan-500",
                "bg-orange-500", "bg-fuchsia-500",
              ];
              const currSum = CatName.split("").reduce(
                (sum, c) => sum + c.charCodeAt(0),
                0,
              );
              const index = currSum % colors.length;
              const color = colors[index];
              acc[CatName] = { name: CatName, count: 0, persentage: 0, color };
            }
            acc[CatName].count += 1;
            acc[CatName].persentage = Math.round(
              (acc[CatName].count / totaArtworks) * 100,
            );
            return acc;
          }, {}),
        )
      : [];

  const totalUsers = users.filter((u) => u.role === "user").length;
  const totalArtists = users.filter((u) => u.role === "artist").length;
  const totalArtworksSold = orders.length;
  const totalRevenue = orders.reduce((sum, t) => sum + t.amount, 0);
console.log('tatal:',totalRevenue);
  // Security Guards
  useEffect(() => {
    if (isPending) return;
    if (!user) {
      redirect("/unauthorized");
    } else if (user?.role !== "admin") {
      redirect("/forbidden");
    }
  }, [user, isPending]);

  // Actions
  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    );
    toast.success(`User role updated to ${newRole}`);
  };

  const handleApproveArtwork = async (artId) => {
    try {
      // Using centralized apiService wrapper for handling runtime configuration internally
      const resData = await apiService.updateArtworkStatus(artId, "available");

      if (resData.success) {
        setArtworks((prevArtworks) =>
          prevArtworks.map((art) =>
            art._id === artId ? { ...art, status: "available" } : art,
          ),
        );
        toast.success("Artwork approved and published successfully!");
      } else {
        toast.error(resData.message || "Failed to approve artwork");
      }
      router.push('/dashboard/admin');
    } catch (error) {
      console.error("Approval error:", error);
      toast.error(error.message || "Server error. Could not approve artwork.");
    }
  };

  const handleDeleteArtwork = async (artId, title) => {
    try {
      // Using centralized apiService wrapper for processing resource deletion securely
      const resData = await apiService.deleteArtwork(artId);

      if (resData.success) {
        setArtworks((prev) => prev.filter((a) => a._id !== artId));
        toast.success(`"${title}" has been deleted`);
      } else {
        toast.error(resData.message || "Failed to delete artwork");
      }
      router.push('/dashboard/admin');
    } catch (error) {
      console.error("delete error:", error);
      toast.error(error.message || "Server error. Could not delete artwork.");
    }
  };

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
      {/* ─── LEFT SIDEBAR (Matching User/Artist Style) ─── */}
      <aside className="hidden lg:flex w-65 flex-col gap-4 shrink-0 sticky top-24">
        {/* Admin Profile Card */}
        <div className="bg-[#090E17] border border-gray-800/70 rounded-2xl p-5 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
          <div className="relative mt-2">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-800 flex items-center justify-center bg-[#131B2A]">
              <Shield size={28} className="text-[#C5A880]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C5A880] border-2 border-[#090E17] rounded-full animate-pulse" />
          </div>

          <h2 className="text-base font-semibold text-gray-100 mt-3 tracking-wide">
            {user?.name}
          </h2>
          <p className="text-xs text-gray-500 mb-3">{user?.email}</p>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/20">
            <Shield size={11} /> {user?.role.toUpperCase()}
          </span>
        </div>
        {/* Navigation Block */}
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
        {/* Sign Out */}
        <div className="bg-[#090E17] border border-gray-800/70 rounded-2xl p-2 shadow-lg">
          <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-400/90 hover:bg-rose-950/20 hover:text-rose-400 transition-colors group">
            <LogOut
              size={14}
              className="text-rose-400/60 group-hover:text-rose-400"
            />
            Sign out
          </button>
        </div>
      </aside>

      {/* ─── RIGHT MAIN PANEL ─── */}
      <main className="flex-1 p-5 md:p-6 shadow-xl overflow-x-hidden min-h-[530px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            {/* ─── TAB 1: ANALYTICS OVERVIEW ─── */}
            {activeTab === "analytics" && (
              <>
                <div>
                  <h2 className="text-xl font-medium text-gray-100">
                    Analytics Overview
                  </h2>
                  <p className="text-xs text-gray-500">
                    System performance and network health summary
                  </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Users",
                      val: totalUsers,
                      icon: Users,
                      color: "text-blue-400",
                    },
                    {
                      label: "Total Artists",
                      val: totalArtists,
                      icon: Palette,
                      color: "text-purple-400",
                    },
                    {
                      label: "Artworks Sold",
                      val: totalArtworksSold,
                      icon: ShoppingBag,
                      color: "text-emerald-400",
                    },
                    {
                      label: "Total Revenue",
                      val: `$${totalRevenue.toLocaleString()}`,
                      icon: DollarSign,
                      color: "text-[#C5A880]",
                    },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className="bg-[#090E17] border border-gray-800/60 p-5 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                          {card.label}
                        </p>
                        <p className="text-xl font-bold text-gray-100 mt-1">
                          {card.val}
                        </p>
                      </div>
                      <div
                        className={`p-2.5 rounded-xl bg-gray-800/40 border border-gray-700/30 ${card.color}`}
                      >
                        <card.icon size={16} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                  {/* Sales Analytics (Custom Bar Chart) */}
                  <div className="lg:col-span-2 bg-[#090E17] border border-gray-800/50 p-5 rounded-xl flex flex-col justify-between">
                    <div className="mb-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                        <BarChart3 size={13} className="text-[#C5A880]" /> Sales
                        Performance
                      </p>
                    </div>
                    <div className="h-44 flex items-end justify-between gap-2 px-2 pt-4 border-b border-gray-800">
                      {MONTHLY_SALES.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                        >
                          <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                            ${s.amount}
                          </span>
                          <div
                            style={{ height: `${(s.amount / 1400) * 100}%` }}
                            className="w-full bg-[#C5A880]/20 border-t border-[#C5A880]/60 rounded-t-sm group-hover:bg-[#C5A880]/40 transition-all duration-300"
                          />
                          <span className="text-[10px] text-gray-500 pt-1">
                            {s.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pie chart alternative - Artworks by Category */}
                  <div className="bg-[#090E17] border border-gray-800/50 p-5 rounded-xl flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2 mb-4">
                        <PieChart size={13} className="text-[#C5A880]" />{" "}
                        Artworks by Category
                      </p>
                      <div className="space-y-3.5 mt-4">
                        {CATEGORY_DATA.map((cat, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400 font-medium">
                                {cat.name} ({cat.count})
                              </span>
                              <span className="text-gray-500">
                                {cat.percentage}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${cat.color}`}
                                style={{ width: `${cat.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ─── TAB 2: MANAGE USERS ─── */}
            {activeTab === "users" && (
              <>
                <div>
                  <h2 className="text-xl font-medium text-gray-100">
                    Manage Users
                  </h2>
                  <p className="text-xs text-gray-500">
                    Alter roles and system permissions for registered platform
                    members
                  </p>
                </div>
                <div className="border border-gray-800/60 rounded-xl bg-[#090E17]/40 overflow-hidden">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-gray-800/60 bg-[#070B13]/40 text-[11px] text-gray-500 uppercase tracking-wider">
                        <th className="p-4 font-normal">Name</th>
                        <th className="p-4 font-normal">Email</th>
                        <th className="p-4 font-normal">Current Role</th>
                        <th className="p-4 font-normal text-right">
                          Actions / Modify Role
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-gray-800/30">
                      {users.map((user, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-800/10 transition-colors"
                        >
                          <td className="p-4 font-medium text-gray-200">
                            {user.name}
                          </td>
                          <td className="p-4 text-gray-400">{user.email}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                user.role === "admin"
                                  ? "bg-rose-950/30 border-rose-500/20 text-rose-400"
                                  : user.role === "artist"
                                    ? "bg-[#C5A880]/10 border-[#C5A880]/20 text-[#C5A880]"
                                    : "bg-blue-950/30 border-blue-500/20 text-blue-400"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              {["user", "artist", "admin"].map((r) => (
                                <button
                                  key={r}
                                  disabled={user.role === r}
                                  onClick={() => handleRoleChange(user.id, r)}
                                  className={`px-2 py-1 border rounded-lg text-[10px] font-medium transition-all uppercase tracking-wide disabled:opacity-30 disabled:cursor-not-allowed ${
                                    user.role === r
                                      ? "border-gray-800 text-gray-600 bg-transparent"
                                      : "border-gray-800 text-gray-400 hover:border-[#C5A880]/40 hover:text-[#C5A880]"
                                  }`}
                                >
                                  {r}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ─── TAB 3: MANAGE ALL ARTWORKS ─── */}
            {activeTab === "artworks" && (
              <div className="space-y-6 w-full max-w-full">
                <div>
                  <h2 className="text-xl font-medium text-gray-100">
                    Manage All Artworks
                  </h2>
                  <p className="text-xs text-gray-500">
                    Global control to monitor, approve, and purge marketplace
                    assets
                  </p>
                </div>

                <div className="border border-gray-800/60 rounded-xl bg-[#090E17]/40 overflow-hidden w-full">
                  <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-800">
                    <table className="w-full border-collapse text-left min-w-[700px]">
                      <thead>
                        <tr className="border-b border-gray-800/60 bg-[#070B13]/40 text-[11px] text-gray-500 uppercase tracking-wider">
                          <th className="p-4 font-normal">Title</th>
                          <th className="p-4 font-normal">Artist Name</th>
                          <th className="p-4 font-normal">Category</th>
                          <th className="p-4 font-normal">Price</th>
                          <th className="p-4 font-normal">Status</th>
                          <th className="p-4 font-normal text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-gray-800/30">
                        {artworks.map((art, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-800/10 transition-colors"
                          >
                            <td className="p-4 font-medium text-gray-200 max-w-[180px] truncate">
                              {art.title}
                            </td>
                            <td className="p-4 text-gray-400 truncate max-w-[140px]">
                              {art.artistName}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <span className="text-gray-400 bg-gray-800/40 border border-gray-800 px-2 py-0.5 rounded-md text-[11px]">
                                {art.category}
                              </span>
                            </td>
                            <td className="p-4 text-[#C5A880] font-semibold whitespace-nowrap">
                              ${art.price.toLocaleString()}
                            </td>

                            <td className="p-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide border ${
                                  art.status === "available"
                                    ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-400"
                                    : art.status === "pending"
                                      ? "bg-amber-950/30 border-amber-500/20 text-amber-400"
                                      : "bg-rose-950/30 border-rose-500/20 text-rose-400"
                                }`}
                              >
                                {art.status || "available"}
                              </span>
                            </td>

                            <td className="p-4 text-right whitespace-nowrap">
                              <div className="flex justify-end gap-2">
                                {art.status === "pending" && (
                                  <button
                                    onClick={() =>
                                      handleApproveArtwork(art._id)
                                    } // আপনার লজিক অনুযায়ী ফাংশন কল করুন
                                    title="Approve Artwork"
                                    className="p-1.5 border border-gray-800 bg-emerald-950/10 rounded-lg text-emerald-500 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-colors"
                                  >
                                    <Check size={13} />{" "}
                                    {/* Lucide icons থেকে Check ইমপোর্ট করে নিবেন */}
                                  </button>
                                )}

                                <button
                                  onClick={() =>
                                    handleDeleteArtwork(art._id, art.title)
                                  }
                                  title="Delete Artwork"
                                  className="p-1.5 border border-gray-800 rounded-lg text-gray-400 hover:text-rose-400 hover:border-rose-950/50 transition-colors"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 4: VIEW ALL orders ─── */}
            {activeTab === "orders" && (
              <>
                <div>
                  <h2 className="text-xl font-medium text-gray-100">
                    All orders
                  </h2>
                  <p className="text-xs text-gray-500">
                    Audit logs for subscriptions and masterclass marketplace
                    sales
                  </p>
                </div>
                <div className="border border-gray-800/60 rounded-xl bg-[#090E17]/40 overflow-hidden">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-gray-800/60 bg-[#070B13]/40 text-[11px] text-gray-500 uppercase tracking-wider">
                        <th className="p-4 font-normal">Transaction ID</th>
                        <th className="p-4 font-normal">Type</th>
                        <th className="p-4 font-normal">User/Artist Email</th>
                        <th className="p-4 font-normal">Date</th>
                        <th className="p-4 font-normal text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-gray-800/30">
                      {orders.map((txn,index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-800/10 transition-colors"
                        >
                          <td className="p-4 font-mono text-gray-400 tracking-wide">
                            {txn.transactionId}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                txn.type === "purchase"
                                  ? "bg-emerald-950/40 border border-emerald-500/20 text-emerald-400"
                                  : "bg-indigo-950/40 border border-indigo-500/20 text-indigo-400"
                              }`}
                            >
                              {txn.type}
                            </span>
                          </td>
                          <td className="p-4 text-gray-300">{txn.email}</td>
                          <td className="p-4 text-gray-500">{txn.date.split('T')[0]}</td>
                          <td className="p-4 text-right text-[#C5A880] font-semibold">
                            ${txn.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="m-2 rounded-2xl border border-gray-800/60 bg-[#090E17]/95 backdrop-blur-xl">
          <div className="grid grid-cols-4">
            {NAV_ITEMS.map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex flex-col items-center justify-center py-3 ${
                  activeTab === key ? "text-[#C5A880]" : "text-gray-500"
                }`}
              >
                <Icon size={18} />
                <span className="text-[10px] mt-1">
                  {key === "analytics"
                    ? "Analytics"
                    : key === "users"
                      ? "Users"
                      : key === "artworks"
                        ? "Artworks"
                        : "orders"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
     
    </div>
  );
}
