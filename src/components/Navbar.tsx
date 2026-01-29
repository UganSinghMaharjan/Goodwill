"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, LogOut, Settings } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-accent/20 py-4 shadow-sm"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-primary"
        >
          Goodwill<span className="text-foreground"></span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <div className="relative group">
            <button className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
              Collections
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="absolute top-full -left-4 w-48 bg-background backdrop-blur-md border border-primary/10 rounded-2xl shadow-xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <Link
                href="/collections/living-room"
                className="block px-6 py-2 text-sm text-secondary font-bold hover:text-primary hover:bg-accent/5 transition-colors"
              >
                Living Room
              </Link>
              <Link
                href="/collections/bedroom"
                className="block px-6 py-2 text-sm text-secondary font-bold hover:text-primary hover:bg-accent/5 transition-colors"
              >
                Bedroom
              </Link>
              <Link
                href="/collections/dining-room"
                className="block px-6 py-2 text-sm text-secondary font-bold hover:text-primary hover:bg-accent/5 transition-colors"
              >
                Dining Room
              </Link>
            </div>
          </div>
          <Link
            href="/about"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/#showroom"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Showroom
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span
                className={`text-sm font-semibold hidden sm:block transition-colors duration-300 ${
                  scrolled ? "text-foreground" : "text-accent"
                }`}
              >
                Hello, {user?.name}
              </span>
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-accent/10 transition-colors">
                  <User className="w-5 h-5 text-primary" />
                </button>
                <div className="absolute top-full right-0 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/auth/signup"
                className="px-5 py-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/auth/login"
                className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-hover transition-shadow hover:shadow-lg"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
