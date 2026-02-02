"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/lib/api";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [products, orders, users] = await Promise.all([
          apiFetch<any[]>("/products"),
          apiFetch<any[]>("/orders"),
          apiFetch<any[]>("/users"),
        ]);

        const revenue = orders.reduce(
          (sum, order) => sum + (order.total_amount || 0),
          0,
        );

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalRevenue: revenue,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      isPositive: true,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Active Orders",
      value: stats.totalOrders.toString(),
      change: "+3 since yesterday",
      isPositive: true,
      icon: ShoppingCart,
      color: "text-[#9f4d2c]",
      bg: "bg-[#9f4d2c]/5",
    },
    {
      title: "Asset Catalog",
      value: stats.totalProducts.toString(),
      change: "2 new this week",
      isPositive: true,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Client Registry",
      value: stats.totalUsers.toString(),
      change: "+4.2%",
      isPositive: true,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-[#9f4d2c]/10 border-t-[#9f4d2c]"></div>
        <span className="text-xs font-bold text-[#4a403a]/40 uppercase tracking-[0.2em]">
          Assembling Intelligence...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#1a120e] tracking-tight">
            Executive Dashboard
          </h1>
          <p className="text-[#4a403a] font-medium opacity-70 mt-1">
            Real-time surveillance of your architectural enterprise.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#9f4d2c]/10 rounded-xl shadow-sm">
          <Clock className="w-4 h-4 text-[#9f4d2c]" />
          <span className="text-sm font-bold text-[#1a120e]">
            Auto-Sync Active
          </span>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2rem] border border-[#9f4d2c]/5 shadow-sm hover:shadow-xl transition-all duration-500 group"
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-500`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${stat.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
              >
                {stat.isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-[11px] font-bold text-[#4a403a]/40 uppercase tracking-[0.15em]">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-[#1a120e] tracking-tighter">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mock Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-[#9f4d2c]/5 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-[#1a120e]">
              Revenue Trajectory
            </h3>
            <select className="bg-[#fcf9f5] border-none text-xs font-bold text-[#4a403a] rounded-lg px-4 py-2 focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-4">
            {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-4 group"
              >
                <div className="w-full relative">
                  <div
                    className="w-full bg-[#9f4d2c]/10 rounded-t-xl group-hover:bg-[#9f4d2c]/20 transition-all duration-500"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#9f4d2c] to-[#9f4d2c]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-xl" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#4a403a]/40 uppercase tracking-widest">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#1a120e] p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 blur-3xl rounded-full -mr-20 -mt-20" />
          <h3 className="text-xl font-bold text-white mb-8 relative z-10">
            Acquisition Source
          </h3>
          <div className="space-y-6 relative z-10">
            {[
              { label: "Direct Organic", value: "64%", color: "bg-[#9f4d2c]" },
              { label: "Referral Link", value: "23%", color: "bg-white" },
              { label: "Social Media", value: "13%", color: "bg-white/20" },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/60">{item.label}</span>
                  <span className="text-white">{item.value}</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: item.value }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5 border-dashed">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 text-center">
              System Health
            </p>
            <div className="flex justify-center items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-white">
                All Ports Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
