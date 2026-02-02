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
} from "lucide-react";

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8001/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "processing":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "shipped":
        return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case "delivered":
        return "bg-green-50 text-green-600 border-green-100";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-3.5 h-3.5" />;
      case "delivered":
        return <CheckCircle className="w-3.5 h-3.5" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5" />;
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
                    <th className="px-10 py-6 text-[11px] font-bold text-[#4a403a]/40 uppercase tracking-[0.2em]">
                      Acquisition ID
                    </th>
                    <th className="px-6 py-6 text-[11px] font-bold text-[#4a403a]/40 uppercase tracking-[0.2em]">
                      Client
                    </th>
                    <th className="px-6 py-6 text-[11px] font-bold text-[#4a403a]/40 uppercase tracking-[0.2em]">
                      Manifest
                    </th>
                    <th className="px-6 py-6 text-[11px] font-bold text-[#4a403a]/40 uppercase tracking-[0.2em]">
                      Valuation
                    </th>
                    <th className="px-6 py-6 text-[11px] font-bold text-[#4a403a]/40 uppercase tracking-[0.2em]">
                      Lifecycle
                    </th>
                    <th className="px-10 py-6 text-[11px] font-bold text-[#4a403a]/40 uppercase tracking-[0.2em] text-right">
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
                          <span className="font-mono text-[11px] text-[#4a403a]/40 bg-[#fcf9f5] px-2 py-1 rounded border border-[#9f4d2c]/5 uppercase tracking-tighter">
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
                            <span className="text-[11px] font-medium text-[#4a403a]/50 mt-1">
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
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.1em] shadow-sm ${getStatusStyle(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
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
