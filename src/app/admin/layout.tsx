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
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiFetch } from "@/app/lib/api";
import { format } from "date-fns";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [todaysNote, setTodaysNote] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodaysNote = () => {
      const savedNotes = localStorage.getItem("intelligence_notes");
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        setTodaysNote(parsedNotes[dateStr] || null);
      }
    };

    fetchTodaysNote();
    // Also check when notifications open to get latest
    if (notificationsOpen) fetchTodaysNote();
  }, [notificationsOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".relative")) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const orders = await apiFetch<any[]>("/orders");
        // Sort by date descending and take last 5
        const recentOrders = orders
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 5);

        setNotifications(recentOrders);

        // Calculate unread count based on last seen ID in localStorage
        const lastSeenId = localStorage.getItem("last_seen_order_id");
        if (recentOrders.length > 0) {
          if (!lastSeenId) {
            // First time, count all as unread
            setUnreadCount(recentOrders.length);
          } else {
            // Count orders that are newer than lastSeenId
            // We assume IDs or created_at timestamps can be used to determine "newness"
            // Since they are already sorted desc, we count until we hit lastSeenId
            const newCount = recentOrders.findIndex(
              (o) => String(o.id) === lastSeenId,
            );
            setUnreadCount(newCount === -1 ? recentOrders.length : newCount);
          }
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

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
        className={`fixed lg:sticky top-0 left-0 w-72 h-screen bg-white border-r border-[#9f4d2c]/20 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-8">
          <Link href="/" className="block relative w-48 h-10 group">
            <Image
              src="/images/logo.png"
              alt="Goodwill Logo"
              fill
              className="object-contain"
            />
          </Link>
          <div className="mt-2 text-xs font-bold text-foreground/50 uppercase tracking-widest px-1">
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
                    ? "bg-[#9f4d2c]/5 text-[#9f4d2c] border border-[#9f4d2c]/20 shadow-sm"
                    : "text-[#4a403a] hover:bg-[#9f4d2c]/5 hover:text-[#9f4d2c] border border-transparent"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}

          <div className="my-6 border-t border-[#9f4d2c]/15 mx-4" />

          <Link
            href="/admin/settings" // Changed href to /admin/settings
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 ${
              pathname === "/admin/settings"
                ? "bg-[#9f4d2c]/5 text-[#9f4d2c] border border-[#9f4d2c]/20 shadow-sm"
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
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#1a120e] bg-[#fcf9f5] border border-[#9f4d2c]/20 rounded-2xl hover:bg-[#9f4d2c] hover:text-white transition-all duration-500 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Public View
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-[#9f4d2c]/15 flex items-center justify-between px-6 lg:px-10 z-40">
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
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (!notificationsOpen) {
                    // When opening, mark the top order as the last seen
                    setUnreadCount(0);
                    if (notifications.length > 0) {
                      localStorage.setItem(
                        "last_seen_order_id",
                        String(notifications[0].id),
                      );
                    }
                  }
                }}
                className="relative p-2 text-[#4a403a] hover:text-[#9f4d2c] transition-colors"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#9f4d2c] text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-[#9f4d2c]/10 rounded-2xl shadow-xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-[#9f4d2c]/5 flex justify-between items-center bg-[#fdfbf7]">
                    <h3 className="text-sm font-bold text-[#1a120e]">
                      Intelligence Feed
                    </h3>
                    <span className="text-[10px] font-bold text-[#9f4d2c] uppercase tracking-widest">
                      Recent Activity
                    </span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {/* Tactical Reminder Note */}
                    {todaysNote && (
                      <div className="p-4 bg-[#9f4d2c]/5 border-b border-[#9f4d2c]/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#9f4d2c]/5 blur-2xl -mr-12 -mt-12" />
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 bg-[#9f4d2c] rounded-full animate-pulse" />
                          <span className="text-[9px] font-black text-[#9f4d2c] uppercase tracking-[0.2em]">
                            Tactical Reminder
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#1a120e] leading-relaxed italic">
                          "{todaysNote}"
                        </p>
                        <Link
                          href="/admin"
                          onClick={() => setNotificationsOpen(false)}
                          className="mt-3 inline-flex items-center gap-1.5 text-[9px] font-bold text-[#9f4d2c]/60 hover:text-[#9f4d2c] transition-colors uppercase tracking-widest"
                        >
                          Modify Intel Briefing{" "}
                          <ArrowLeft className="w-2.5 h-2.5 rotate-180" />
                        </Link>
                      </div>
                    )}

                    {notifications.length > 0 ? (
                      notifications.map((order) => (
                        <div
                          key={order.id}
                          className="p-4 border-b border-[#9f4d2c]/5 hover:bg-[#fdfbf7] transition-colors cursor-pointer group"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-[#1a120e] group-hover:text-[#9f4d2c] transition-colors">
                              New Order Received
                            </span>
                            <span className="text-[9px] font-medium text-[#4a403a]/40 italic">
                              {format(new Date(order.created_at), "HH:mm")}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#4a403a]/70 line-clamp-1">
                            Customer:{" "}
                            <span className="font-bold text-[#1a120e]">
                              {order.customer_name}
                            </span>
                          </p>
                          <p className="text-[11px] text-[#4a403a]/70 mt-0.5">
                            Amount:{" "}
                            <span className="font-bold text-[#9f4d2c]">
                              ${order.total_amount.toLocaleString()}
                            </span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-[#4a403a]/10 mx-auto mb-2" />
                        <p className="text-xs text-[#4a403a]/40 font-bold uppercase tracking-widest">
                          No New Intelligence
                        </p>
                      </div>
                    )}
                  </div>
                  <Link
                    href="/admin/orders"
                    className="block p-3 text-center text-[10px] font-bold text-[#9f4d2c] hover:bg-[#9f4d2c]/5 transition-colors uppercase tracking-[0.2em]"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    View All Logistics
                  </Link>
                </div>
              )}
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#9f4d2c] to-[#9f4d2c]/40 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 relative">
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
