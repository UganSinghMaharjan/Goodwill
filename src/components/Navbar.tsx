"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

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
          Goodwill<span className="text-foreground">.</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/#collections"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Collections
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/#showroom"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Showroom
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button className="px-5 py-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
            Sign In
          </button>
          <Link
            href="/#collections"
            className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-hover transition-shadow hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
