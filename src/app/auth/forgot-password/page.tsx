"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.new_password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8001/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            new_password: formData.new_password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successfully");
        router.push("/auth/login");
      } else {
        toast.error(data.detail || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-accent/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Reset Password
          </h1>
          <p className="text-foreground/80 text-sm">
            Enter your email and new password to regain access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-accent/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              New Password
            </label>
            <input
              type="password"
              name="new_password"
              required
              value={formData.new_password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-accent/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirm_password"
              required
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-accent/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-foreground/80 text-sm">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="font-bold text-primary hover:text-primary-hover hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
