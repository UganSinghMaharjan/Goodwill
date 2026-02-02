"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Truck,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/app/lib/api";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    if (user) {
      const names = user.name.split(" ");
      setFormData((prev) => ({
        ...prev,
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        items: cart.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: cartTotal,
      };

      await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });

      toast.success(
        "Order placed successfully! Architectural masterpieces coming your way.",
      );
      clearCart();
    } catch (error: any) {
      console.error("Failed to place order:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !isProcessing) {
    return (
      <main className="min-h-screen bg-[#fcf9f5]">
        <Navbar />
        <div className="container mx-auto px-6 py-40 text-center">
          <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <Package className="w-12 h-12 text-primary/20" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-secondary font-medium mb-12 max-w-md mx-auto">
            You haven't selected any masterpieces yet. Explore our collections
            to find the perfect addition to your space.
          </p>
          <Link
            href="/collections/living-room"
            className="px-10 py-5 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all inline-block"
          >
            Browse Collections
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcf9f5]">
      <Navbar />

      <div className="container mx-auto px-6 py-32 mt-10">
        <Link
          href="/collections/living-room"
          className="flex items-center gap-2 text-sm font-bold text-foreground/40 hover:text-primary transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Continue Selecting
        </Link>

        <h1 className="text-5xl font-bold text-foreground mb-16 tracking-tight">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Form */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handlePlaceOrder} className="space-y-10">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary font-bold text-sm">
                    01
                  </div>
                  <h2 className="text-xl text-foreground font-bold">
                    Delivery Details
                  </h2>
                </div>
                <div className="text-foreground grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="px-6 py-4 bg-white border border-primary/5 rounded-2xl focus:outline-none focus:border-primary/20 transition-all"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="px-6 py-4 bg-white border border-primary/5 rounded-2xl focus:outline-none focus:border-primary/20 transition-all"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="px-6 py-4 bg-white border border-primary/5 rounded-2xl focus:outline-none focus:border-primary/20 transition-all md:col-span-2"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="px-6 py-4 bg-white border border-primary/5 rounded-2xl focus:outline-none focus:border-primary/20 transition-all md:col-span-2"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="px-6 py-4 bg-white border border-primary/5 rounded-2xl focus:outline-none focus:border-primary/20 transition-all"
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="px-6 py-4 bg-white border border-primary/5 rounded-2xl focus:outline-none focus:border-primary/20 transition-all"
                  />
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary font-bold text-sm">
                    02
                  </div>
                  <h2 className="text-foreground text-xl font-bold">
                    Payment Access
                  </h2>
                </div>
                <div className="p-8 bg-white border border-primary/5 rounded-[2rem] shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <span className="font-bold text-foreground">
                        Card Payment
                      </span>
                    </div>
                    <div className="flex gap-2 opacity-30">
                      <div className="w-10 h-6 bg-foreground rounded" />
                      <div className="w-10 h-6 bg-foreground rounded" />
                    </div>
                  </div>
                  <div className="text-foreground space-y-4">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full px-6 py-4 bg-[#fcf9f5] border border-primary/5 rounded-2xl focus:outline-none transition-all"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-6 py-4 bg-[#fcf9f5] border border-primary/5 rounded-2xl focus:outline-none transition-all"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="px-6 py-4 bg-[#fcf9f5] border border-primary/5 rounded-2xl focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-6 bg-primary text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-primary/20 hover:scale-[1.01] transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isProcessing
                  ? "Validating Manifest..."
                  : "Complete Acquisition"}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 bg-white rounded-[2.5rem] p-10 border border-primary/5 shadow-2xl shadow-primary/5">
              <h2 className="text-foreground text-2xl font-bold mb-8">
                Acquisition Summary
              </h2>
              <div className="space-y-6 mb-10 max-h-96 overflow-y-auto pr-4 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-5 items-center">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-accent flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-foreground flex-1 min-w-0">
                      <h4 className="font-bold text-foreground truncate">
                        {item.name}
                      </h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm font-bold opacity-40 uppercase tracking-widest italic">
                          {item.quantity} Unit{item.quantity > 1 ? "s" : ""}
                        </span>
                        <span className="font-bold text-primary">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-primary/5">
                <div className="flex justify-between text-foreground text-sm font-bold opacity-60">
                  <span>Subtotal Valuation</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-foreground text-sm font-bold opacity-60">
                  <span>Architecture Logistics</span>
                  <span className="text-green-600">Complimentary</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-4 text-foreground">
                  <span>Grand Total</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] justify-center">
                  <ShieldCheck className="w-4 h-4" /> Secure Transmission
                  <span className="mx-1">•</span>
                  <Truck className="w-4 h-4" /> Premium Logistics
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
