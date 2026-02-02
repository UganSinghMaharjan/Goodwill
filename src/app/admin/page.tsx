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
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

function ExecutiveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Add empty slots for days before the first day of the month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Add actual days
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em]">
          {monthName} {year}
        </h4>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-4 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span
            key={`${d}-${i}`}
            className="text-[10px] font-bold text-white/20 uppercase"
          >
            {d}
          </span>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={`text-xs font-bold py-1.5 relative ${
              day ? "text-white/80" : ""
            } ${isToday(day) ? "text-white" : ""}`}
          >
            {day}
            {isToday(day) && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#9f4d2c] rounded-full" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-[#9f4d2c] rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
            Surveillance Day: {new Date().getDate()} {monthName}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  // Initialize with 7 days of empty data to ensure chart labels show immediately
  const [dailyRevenue, setDailyRevenue] = useState<
    { day: string; amount: number; height: number }[]
  >(
    [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        day: d.toLocaleDateString("en-US", { weekday: "narrow" }),
        amount: 0,
        height: 0,
      };
    }),
  );
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

        // Process daily revenue for the last 7 days (Local-Time Robust)
        const dailyTotals = [...Array(7)].map((_, i) => {
          const d = new Date();
          // Adjust to get the correct history window in local time
          d.setDate(d.getDate() - (6 - i));

          // Format as YYYY-MM-DD in local time for robust matching
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          const localDateStr = `${year}-${month}-${day}`;

          const dayTotal = (orders || [])
            .filter((order) => {
              if (!order || !order.created_at) return false;
              // Match strictly on the date part (YYYY-MM-DD)
              const orderDate = order.created_at.split(/[T ]/)[0];
              return orderDate === localDateStr;
            })
            .reduce((sum, order) => sum + (order.total_amount || 0), 0);

          return {
            day: d.toLocaleDateString("en-US", { weekday: "narrow" }),
            amount: dayTotal,
          };
        });

        const revenueSum = dailyTotals.reduce((s, d) => s + d.amount, 0);
        const maxTotal = Math.max(...dailyTotals.map((d) => d.amount), 1);

        const processedDailyData = dailyTotals.map((d) => ({
          ...d,
          height: revenueSum > 0 ? (d.amount / maxTotal) * 100 : 0,
        }));

        setDailyRevenue(processedDailyData);
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
        <div className="lg:col-span-8 bg-[#1a120e] p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/5">
          {/* Subtle architectural background detail */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#9f4d2c]/5 blur-[100px] -mr-32 -mt-32" />

          <div className="flex justify-between items-center mb-10 relative z-10">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">
                Revenue Trajectory
              </h3>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Aggregated performance • Real-time Surveillance
              </p>
            </div>
            <select className="bg-white/5 border border-white/10 text-xs font-bold text-white rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#9f4d2c]/40 outline-none appearance-none cursor-pointer hover:bg-white/10 transition-colors">
              <option className="bg-[#1a120e]">Last 7 Days</option>
              <option className="bg-[#1a120e]">Last 30 Days</option>
            </select>
          </div>

          <div className="relative h-64 z-10">
            {/* Background Grid - Enhanced Visibility */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-full h-px bg-white/10" />
              ))}
            </div>

            {dailyRevenue.every((d) => d.amount === 0) && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-20">
                <div className="p-3 bg-white/5 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white/20" />
                </div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                  No recent revenue recorded
                </p>
              </div>
            )}

            <div className="relative h-full flex items-end justify-between gap-4">
              {dailyRevenue.map((data, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center group h-full"
                >
                  <div className="flex-1 w-full relative group/bar cursor-pointer flex items-end justify-center">
                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-[#1a120e] text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all duration-300 pointer-events-none z-20 whitespace-nowrap shadow-xl translate-y-2 group-hover/bar:translate-y-0">
                      ${data.amount.toLocaleString()}
                    </div>

                    <div
                      className="w-full bg-white/5 rounded-t-xl group-hover/bar:bg-white/10 transition-all duration-500 relative"
                      style={{
                        height: `${Math.max(data.height, data.amount > 0 ? 5 : 0)}%`,
                      }}
                    >
                      {data.amount > 0 && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#9f4d2c] via-[#9f4d2c]/80 to-[#9f4d2c]/40 opacity-90 group-hover/bar:opacity-100 transition-opacity duration-500 rounded-t-xl shadow-[0_0_30px_rgba(159,77,44,0.2)]" />
                          <div className="absolute top-0 left-0 right-0 h-1 bg-[#9f4d2c] blur-sm opacity-50" />
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white transition-colors mt-4">
                    {data.day}
                  </span>
                </div>
              ))}
            </div>
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
              { label: "Social Media", value: "13%", color: "bg-pink-400/20" },
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
          <div className="mt-8">
            <ExecutiveCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}
