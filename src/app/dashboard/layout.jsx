import React from "react";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { Bell, User } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }) {
  // Get active user session from auth server
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  return (
    // pt-20 keeps layout below the 80px main navbar
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B0F19] text-[#1A1A1A] dark:text-[#F3F4F6] font-sans flex transition-colors duration-300 relative pt-20">
      
      {/* Navigation sidebar panel */}
      <Sidebar user={user} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-[calc(100vh-80px)]">
        
        {/* Dynamic page container */}
        <main className="flex-1 p-6 md:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}