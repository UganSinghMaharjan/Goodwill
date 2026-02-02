"use client";
import { useState, useEffect } from "react";

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
      const res = await fetch("http://localhost:8001/orders");
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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">View Orders</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Order ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Items</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-sm text-gray-500">{order.id}</td>
                  <td className="p-2">
                    <div>{order.customer_name}</div>
                    <div className="text-sm text-gray-400">{order.email}</div>
                  </td>
                  <td className="p-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm">
                        {item.quantity}x {item.product_name}
                      </div>
                    ))}
                  </td>
                  <td className="p-2">${order.total_amount}</td>
                  <td className="p-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-2 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
