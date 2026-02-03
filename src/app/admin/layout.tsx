"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  ShoppingCart,
  ArrowLeft,
  LayoutDashboard,
  Settings,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: "/admin", label: "Analytics", icon: BarChart3 },
    { href: "/admin/products", label: "Inventory Control", icon: Package },
    { href: "/admin/orders", label: "Order Insights", icon: ShoppingCart },
  ];

  return (
    <div className="flex min-h-screen bg-[#fcf9f5]">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-[#1a120e]/40 z-40 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 w-72 h-screen bg-white border-r border-[#9f4d2c]/10 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-8">
          <Link href="/" className="block relative w-48 h-10 group">
            <Image
              src="/images/TGFWHITE.png"
              alt="Goodwill Logo"
              fill
              className="object-contain"
            />
          </Link>
          <div className="mt-2 text-xs font-bold text-[#4a403a]/50 uppercase tracking-widest px-1">
            Admin Suite
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-[#9f4d2c]/5 text-[#9f4d2c] border border-[#9f4d2c]/10 shadow-sm"
                    : "text-[#4a403a] hover:bg-[#9f4d2c]/5 hover:text-[#9f4d2c] border border-transparent"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}

          <div className="my-6 border-t border-[#9f4d2c]/5 mx-4" />

          <Link
            href="/admin/settings" // Changed href to /admin/settings
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 ${
              pathname === "/admin/settings"
                ? "bg-[#9f4d2c]/5 text-[#9f4d2c] border border-[#9f4d2c]/10 shadow-sm"
                : "text-[#4a403a] hover:bg-[#9f4d2c]/5 hover:text-[#9f4d2c] border border-transparent"
            }`}
          >
            <Settings className="w-5 h-5" />
            System Rules
          </Link>
        </nav>

        <div className="p-6">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#1a120e] bg-[#fcf9f5] border border-[#9f4d2c]/10 rounded-2xl hover:bg-[#9f4d2c] hover:text-white transition-all duration-500 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Public View
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-[#9f4d2c]/5 flex items-center justify-between px-6 lg:px-10 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#4a403a] hover:text-[#9f4d2c] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-[#9f4d2c]" />
              <span className="font-bold text-[#1a120e] hidden xs:block">
                Dashboard Control
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-[#4a403a] hover:text-[#9f4d2c] transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#9f4d2c] rounded-full border-2 border-white" />
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#9f4d2c] to-[#9f4d2c]/40 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#9f4d2c]/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />

          <div className="relative z-10">
            <ProtectedRoute adminOnly={true}>{children}</ProtectedRoute>
          </div>
        </main>
      </div>
    </div>
  );
}
