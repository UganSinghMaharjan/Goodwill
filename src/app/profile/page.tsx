"use client";
import { useAuth } from "@/context/AuthContext";
import { Link as LinkIcon, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  created_at: string;
}

export default function ProfileOverview() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    if (user?.email) {
      fetch(`http://127.0.0.1:8001/orders?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          const total = data.reduce(
            (acc: number, order: any) => acc + order.total_amount,
            0,
          );
          setStats({
            totalOrders: data.length,
            totalSpent: total,
          });
        })
        .catch((err) => console.error(err));
    }
  }, [user?.email]);

  // Extract all items from all orders to show "Purchased Products"
  const allItems = orders.flatMap((order) => order.items).slice(0, 5); // Show last 5 items

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-light text-foreground tracking-tight">
          Overview
        </h1>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-foreground font-bold mb-2">
              Spent
            </p>
            <p className="text-3xl font-light text-foreground">
              ${stats.totalSpent.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/70 font-bold mb-2">
              Orders
            </p>
            <p className="text-3xl font-light text-foreground">
              {stats.totalOrders}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-foreground/5 pt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-medium text-foreground">
            Purchased Items
          </h2>
          <Link
            href="/profile/orders"
            className="text-sm text-foreground font-semibold hover:text-black flex items-center gap-2 transition-colors"
          >
            View all orders <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {allItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allItems.map((item, idx) => (
              <div
                key={idx}
                className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-foreground/5"
              >
                <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                  {item.product_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="font-medium text-foreground truncate">
                    {item.product_name}
                  </h3>
                  <p className="text-sm text-foreground/80 font-medium mt-1">
                    Qty: {item.quantity} · ${item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-foreground/[0.05] rounded-2xl">
            <ShoppingCart className="w-8 h-8 mx-auto text-foreground/40 mb-3" />
            <p className="text-foreground/60 text-sm font-medium">
              No items purchased yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
