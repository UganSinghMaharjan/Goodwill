"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/lib/api";
import toast from "react-hot-toast";
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

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  notes: Record<string, string>;
}

function ExecutiveCalendar({
  selectedDate,
  onDateSelect,
  notes,
}: CalendarProps) {
  const [currentViewDate, setCurrentViewDate] = useState(
    new Date(selectedDate),
  );

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const monthName = currentViewDate.toLocaleString("default", {
    month: "long",
  });
  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const prevMonth = () => {
    setCurrentViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentViewDate(new Date(year, month + 1, 1));
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

  const isSelected = (day: number | null) => {
    if (!day) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  const hasNote = (day: number | null) => {
    if (!day) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return !!notes[dateStr];
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

      <div className="grid grid-cols-7 gap-y-2 text-center">
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
            onClick={() => day && onDateSelect(new Date(year, month, day))}
            className={`text-[11px] font-bold py-2 relative cursor-pointer rounded-lg transition-all duration-300 ${
              day ? "hover:bg-white/5 active:scale-95" : "pointer-events-none"
            } ${isSelected(day) ? "bg-[#9f4d2c] text-white" : day ? "text-white/60" : ""} ${isToday(day) && !isSelected(day) ? "text-[#9f4d2c]" : ""}`}
          >
            {day}
            {hasNote(day) && (
              <div
                className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSelected(day) ? "bg-white" : "bg-[#9f4d2c]"}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-[#9f4d2c] rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">
            Selected surveillance date: {selectedDate.getDate()}{" "}
            {selectedDate.toLocaleString("default", { month: "short" })}
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
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [currentNote, setCurrentNote] = useState("");

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem("intelligence_notes");
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes);

      const dateStr = formatDateKey(selectedDate);
      setCurrentNote(parsedNotes[dateStr] || "");
    }
  }, []);

  const formatDateKey = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateStr = formatDateKey(date);
    setCurrentNote(notes[dateStr] || "");
  };

  const saveNote = () => {
    const dateStr = formatDateKey(selectedDate);
    const updatedNotes = { ...notes, [dateStr]: currentNote };
    setNotes(updatedNotes);
    localStorage.setItem("intelligence_notes", JSON.stringify(updatedNotes));
    toast.success("Intelligence note archived");
  };

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

        // Sort orders by date descending and take last 4 for the feed
        const sortedOrders = orders
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 4);
        setRecentOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-[#fcf5ed] text-[#9f4d2c]";
      case "processing":
        return "bg-[#3b2b24] text-[#fcf9f5]";
      case "shipped":
        return "bg-[#6b5c54] text-[#fcf9f5]";
      case "delivered":
        return "bg-[#4a7862] text-[#fcf9f5]";
      case "cancelled":
        return "bg-[#8b3a3a] text-[#fcf9f5]";
      default:
        return "bg-[#fcf9f5] text-[#4a403a]";
    }
  };

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
            className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#9f4d2c]/5 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative"
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#1a120e] p-6 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/5">
            {/* Subtle architectural background detail */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#9f4d2c]/5 blur-[100px] -mr-32 -mt-32" />

            <div className="flex justify-between items-center mb-10 relative z-10 gap-4">
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

            <div className="relative h-56 z-10 w-full overflow-hidden">
              {/* Background Grid */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-full h-px bg-white/10" />
                ))}
              </div>

              <div className="relative h-full flex items-end justify-between gap-2 md:gap-4 overflow-x-auto pb-2 no-scrollbar">
                {dailyRevenue.map((data, i) => (
                  <div
                    key={i}
                    className="flex-1 min-w-[30px] flex flex-col items-center group h-full"
                  >
                    <div className="flex-1 w-full relative group/bar cursor-pointer flex items-end justify-center">
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-[#1a120e] text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all duration-300 pointer-events-none z-20 whitespace-nowrap shadow-xl">
                        ${data.amount.toLocaleString()}
                      </div>
                      <div
                        className="w-full bg-white/5 rounded-t-xl group-hover/bar:bg-white/10 transition-all duration-500 relative"
                        style={{
                          height: `${Math.max(data.height, data.amount > 0 ? 5 : 0)}%`,
                        }}
                      >
                        {data.amount > 0 && (
                          <div className="absolute inset-0 bg-gradient-to-t from-[#9f4d2c] to-[#9f4d2c]/40 opacity-90 rounded-t-xl" />
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-4">
                      {data.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Operations Feed */}
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-[#9f4d2c]/5 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#1a120e]">
                  Recent Tactical Operations
                </h3>
                <p className="text-[10px] font-bold text-[#4a403a]/40 uppercase tracking-widest leading-none">
                  Live order intelligence feed
                </p>
              </div>
              <ShoppingCart className="w-5 h-5 text-[#9f4d2c]/20" />
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-[#fcf9f5]/50 border border-[#9f4d2c]/5 hover:bg-[#fcf9f5] transition-colors gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="p-2.5 bg-white border border-[#9f4d2c]/10 rounded-xl text-[10px] font-bold text-[#9f4d2c] flex-shrink-0">
                      #{order.id.slice(-6).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#1a120e] truncate">
                        {order.customer_name}
                      </h4>
                      <p className="text-[10px] font-medium text-[#4a403a]/40 truncate">
                        {order.items.length} units •{" "}
                        {new Date(order.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#9f4d2c]/5">
                    <div
                      className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}
                    >
                      {order.status}
                    </div>
                    <span className="text-sm font-bold text-[#1a120e] tabular-nums">
                      ${order.total_amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#1a120e] p-6 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 blur-3xl rounded-full -mr-20 -mt-20" />
            <h3 className="text-xl font-bold text-white mb-8 relative z-10">
              Intelligence Briefing
            </h3>

            <div className="space-y-6 relative z-10">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Notes for {formatDateKey(selectedDate)}
                  </span>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Draft tactical notes for this date..."
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-medium text-white/80 placeholder:text-white/20 focus:ring-1 focus:ring-[#9f4d2c]/40 outline-none resize-none transition-all"
                />
                <button
                  onClick={saveNote}
                  className="w-full py-3 bg-[#9f4d2c] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#9f4d2c]/90 transition-all active:scale-95 shadow-lg shadow-[#9f4d2c]/10"
                >
                  Archive Intelligence
                </button>
              </div>

              <div className="pt-6 border-t border-white/10">
                <ExecutiveCalendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  notes={notes}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
