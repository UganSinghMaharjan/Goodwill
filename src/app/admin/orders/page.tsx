"use client";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Calendar,
  User,
  DollarSign,
  Tag as TagIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  ArrowUpRight,
  RefreshCw,
  X,
  ChevronDown,
} from "lucide-react";
import { apiFetch } from "@/app/lib/api";
import toast from "react-hot-toast";

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer_name: string;
  email: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".status-dropdown")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await apiFetch<Order[]>("/orders");
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      toast.error("Failed to sync order records");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await apiFetch(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update acquisition lifecycle");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-[#fcf5ed] text-[#9f4d2c] border-[#9f4d2c]/20";
      case "processing":
        return "bg-[#3b2b24] text-[#fcf9f5] border-white/5";
      case "shipped":
        return "bg-[#6b5c54] text-[#fcf9f5] border-white/5";
      case "delivered":
        return "bg-[#4a7862] text-[#fcf9f5] border-white/5";
      case "cancelled":
        return "bg-[#8b3a3a] text-[#fcf9f5] border-white/5";
      default:
        return "bg-[#fcf9f5] text-[#4a403a] border-[#4a403a]/10";
    }
  };

  const getStatusIcon = (status: string) => {
    const isDarkBg = [
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ].includes(status.toLowerCase());
    const iconClass = isDarkBg ? "text-white" : "text-[#9f4d2c]";
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className={`w-3.5 h-3.5 ${iconClass}`} />;
      case "processing":
        return <RefreshCw className={`w-3.5 h-3.5 ${iconClass}`} />;
      case "shipped":
        return <Package className={`w-3.5 h-3.5 ${iconClass}`} />;
      case "delivered":
        return <CheckCircle className={`w-3.5 h-3.5 ${iconClass}`} />;
      case "cancelled":
        return <X className={`w-3.5 h-3.5 ${iconClass}`} />;
      default:
        return <AlertCircle className={`w-3.5 h-3.5 ${iconClass}`} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#1a120e] tracking-tight text-black">
            Order Repository
          </h1>
          <p className="text-[#4a403a] font-medium opacity-70 mt-1">
            Monitor the lifecycle of every architectural acquisition.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-5 py-2.5 rounded-2xl border border-[#9f4d2c]/10 shadow-sm">
            <span className="text-xs font-bold text-[#4a403a]/40 uppercase tracking-widest mr-2">
              Retention:
            </span>
            <span className="text-sm font-bold text-[#1a120e] tabular-nums">
              {orders.length} Records
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-[#9f4d2c]/10 border-t-[#9f4d2c]"></div>
          <span className="text-xs font-bold text-[#4a403a]/40 uppercase tracking-[0.2em] animate-pulse">
            Syncing orders...
          </span>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.02)] border border-[#9f4d2c]/5">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 gap-3">
              <ShoppingCart className="w-16 h-16 text-[#9f4d2c]/10 stroke-[1.5px]" />
              <h3 className="text-xl font-bold text-[#1a120e]/40">
                No Acquisitions Recorded
              </h3>
              <p className="text-sm text-[#4a403a]/30">
                The order book is currently awaiting its first entry.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fcf9f5]/50 no-border">
                    <th className="px-10 py-6 text-[11px] font-bold text-foreground/70 uppercase tracking-[0.2em]">
                      Acquisition ID
                    </th>
                    <th className="px-6 py-6 text-[11px] font-bold text-foreground/70 uppercase tracking-[0.2em]">
                      Client
                    </th>
                    <th className="px-6 py-6 text-[11px] font-bold text-foreground/70 uppercase tracking-[0.2em]">
                      Manifest
                    </th>
                    <th className="px-6 py-6 text-[11px] font-bold text-foreground/70 uppercase tracking-[0.2em]">
                      Valuation
                    </th>
                    <th className="px-6 py-6 text-[11px] font-bold text-foreground/70 uppercase tracking-[0.2em]">
                      Lifecycle
                    </th>
                    <th className="px-10 py-6 text-[11px] font-bold text-foreground/70 uppercase tracking-[0.2em] text-right">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#9f4d2c]/5">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-[#fcf9f5]/70 transition-all duration-300 group"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                          <span className="font-mono text-[11px] text-foreground/80 bg-[#fcf9f5] px-2 py-1 rounded border border-[#9f4d2c]/5 uppercase tracking-tighter">
                            {order.id.substring(0, 8)}...
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-xl bg-[#f5ebe0] border border-[#9f4d2c]/10 flex items-center justify-center text-[#9f4d2c] font-bold text-sm shadow-sm">
                            {order.customer_name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[#1a120e] text-sm leading-tight">
                              {order.customer_name}
                            </span>
                            <span className="text-[11px] font-medium text-foreground/60 mt-1">
                              {order.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex flex-col gap-1.5 min-w-[180px]">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="w-5 h-5 flex items-center justify-center bg-[#9f4d2c]/10 text-[#9f4d2c] text-[10px] font-bold rounded-md">
                                {item.quantity}
                              </span>
                              <span className="text-sm font-medium text-[#4a403a] truncate max-w-[150px]">
                                {item.product_name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex flex-col items-start">
                          <span className="text-lg font-bold text-[#1a120e] tracking-tighter tabular-nums text-black">
                            ${order.total_amount.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="relative status-dropdown">
                          <button
                            disabled={updatingId === order.id}
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === order.id ? null : order.id,
                              )
                            }
                            className={`flex items-center gap-2 pl-10 pr-4 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-[0.1em] shadow-sm transition-all focus:ring-2 focus:ring-primary/20 ${updatingId === order.id ? "opacity-50 grayscale" : getStatusStyle(order.status)}`}
                          >
                            <span className="flex-1 truncate">
                              {order.status}
                            </span>
                            <ChevronDown
                              className={`w-3 h-3 opacity-40 transition-transform duration-300 ${openDropdownId === order.id ? "rotate-180" : ""}`}
                            />

                            <div
                              className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${updatingId === order.id ? "animate-spin" : ""}`}
                            >
                              {updatingId === order.id ? (
                                <RefreshCw className="w-3.5 h-3.5 text-primary" />
                              ) : (
                                getStatusIcon(order.status)
                              )}
                            </div>
                          </button>

                          {openDropdownId === order.id && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#9f4d2c]/10 rounded-2xl shadow-2xl py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                              {[
                                "Pending",
                                "Processing",
                                "Shipped",
                                "Delivered",
                                "Cancelled",
                              ].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => {
                                    updateOrderStatus(order.id, status);
                                    setOpenDropdownId(null);
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-[#fcf9f5] ${order.status === status ? "text-primary" : "text-[#4a403a]/60"}`}
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full ${status.toLowerCase() === "pending" ? "bg-[#d17b5a]" : status.toLowerCase() === "processing" ? "bg-[#4a3a33]" : status.toLowerCase() === "shipped" ? "bg-[#8a7b75]" : status.toLowerCase() === "delivered" ? "bg-[#5a9e7f]" : "bg-[#c25454]"}`}
                                  />
                                  {status}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold text-[#1a120e]">
                            {new Date(order.created_at).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span className="text-[10px] font-medium text-[#4a403a]/40 mt-1 tracking-widest uppercase">
                            {new Date(order.created_at).toLocaleTimeString(
                              undefined,
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
