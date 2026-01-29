"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import { apiFetch } from "@/app/lib/api";

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        return;
      }

      await apiFetch("/users/", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      toast.success("Account created successfully!");
      router.push("/auth/login");
    } catch (err: any) {
      console.error("Signup failed:", err);
      const message = err.message?.replace(/^API \d+: /, "") || "Signup failed";
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
              Create Account
            </h1>
            <p className="text-secondary font-semibold italic">
              Join Goodwill&apos;s community of connoisseurs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-5 py-3 rounded-xl border border-primary/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ex: Leonard Goodwill"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-5 py-3 rounded-xl border border-primary/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-5 py-3 rounded-xl border border-primary/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-secondary font-semibold">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:underline font-bold"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
