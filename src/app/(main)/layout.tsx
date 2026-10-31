import React from "react";
import Sidebar from "@/components/navigation/Sidebar";
import RightWidgets from "@/components/navigation/RightWidgets";
import MobileHeader from "@/components/navigation/MobileHeader";
import MobileNav from "@/components/navigation/MobileNav";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col">
      {/* Mobile Header */}
      <MobileHeader />

      <div className="flex-1 max-w-7xl w-full mx-auto flex justify-between">
        {/* Left Sidebar (Desktop) */}
        <Sidebar />

        {/* Central Content Area */}
        <main className="flex-1 min-w-0 max-w-2xl w-full border-x border-white/5 min-h-screen px-3 sm:px-6 py-5 pb-24 lg:pb-8">
          {children}
        </main>

        {/* Right Widgets (Desktop) */}
        <RightWidgets />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
}
