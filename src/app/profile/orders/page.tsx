"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function UserOrdersPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
    }
  }, [user?.email]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8001/orders?email=${user?.email}`,
      );
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-[#9f4d2c]/10 border-t-[#9f4d2c]"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-light text-foreground tracking-tight">
            Order History
          </h1>
          <p className="text-secondary font-medium opacity-70 mt-1">
            View and track your current and past orders.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-primary/10 border-t-primary"></div>
          <span className="text-xs font-bold text-secondary/40 uppercase tracking-[0.2em] animate-pulse">
            Loading orders...
          </span>
        </div>
      ) : (
        <div className="bg-white rounded-[20px] overflow-hidden border border-foreground/5">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 gap-3">
              <ShoppingCart className="w-16 h-16 text-foreground/10 stroke-[1.5px]" />
              <h3 className="text-xl font-bold text-foreground/40">
                No Orders Found
              </h3>
              <p className="text-sm text-secondary/30">
                You haven't placed any orders yet.
              </p>
              <Link
                href="/#showroom"
                className="mt-4 px-6 py-3 bg-[#9f4d2c] text-white rounded-xl font-bold shadow-lg shadow-[#9f4d2c]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Browse Collections
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-foreground/5">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">
                      Items
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">
                      Total
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-secondary font-bold text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="group hover:bg-foreground/[0.07] transition-colors"
                    >
                      <td className="px-6 py-6">
                        <span className="font-mono text-xs text-foreground font-medium">
                          #{order.id.substring(0, 6)}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1 max-w-[200px]">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-foreground truncate">
                                {item.product_name}
                              </span>
                              <span className="text-secondary font-medium text-xs ml-2">
                                x{item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="font-medium text-foreground">
                          ${order.total_amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.status.toLowerCase() === "delivered"
                                ? "bg-green-500"
                                : order.status.toLowerCase() === "pending"
                                  ? "bg-amber-500"
                                  : "bg-blue-500"
                            }`}
                          ></span>
                          <span className="text-sm text-foreground font-medium">
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <span className="text-sm text-secondary font-medium">
                          {new Date(order.created_at).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
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
