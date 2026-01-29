"use client";

import Link from "next/link";
import { useState } from "react";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiFetch } from "@/app/lib/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        return;
      }

      await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      toast.success("Successfully logged in!");
      router.push("/");
    } catch (err: any) {
      console.error("Login failed:", err);
      const message =
        err.message?.replace(/^API \d+: /, "") || "Invalid email or password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center pt-32 pb-24 px-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-primary/10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Welcome Back
            </h1>
            <p className="text-secondary font-semibold italic">
              Continue your journey with Goodwill.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm font-bold text-foreground mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-5 py-3 rounded-xl border border-primary/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="your@email.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  className="text-sm font-bold text-foreground"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-primary hover:underline font-bold"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                className="w-full px-5 py-3 rounded-xl border border-primary/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Logging In..." : "Log In"}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-secondary font-semibold">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-primary hover:underline font-bold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
