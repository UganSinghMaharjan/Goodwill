"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  LogOut,
  Settings,
  ShoppingCart,
  Plus,
  Minus,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cart, removeFromCart, updateQuantity, itemsCount, cartTotal } =
    useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Close other menus when one opens
  useEffect(() => {
    if (mobileMenuOpen) {
      setCartOpen(false);
      setProfileOpen(false);
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (cartOpen) {
      setMobileMenuOpen(false);
      setProfileOpen(false);
    }
  }, [cartOpen]);

  useEffect(() => {
    if (profileOpen) {
      setMobileMenuOpen(false);
      setCartOpen(false);
    }
  }, [profileOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".relative")) {
        setCartOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <Link href="/" className="relative w-40 h-12 md:w-56 md:h-16 -ml-2">
          <Image
            src={scrolled ? "/images/logo.png" : "/images/logo.png"}
            alt="Goodwill Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/#showroom"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Showroom
          </Link>
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
                className="block px-6 py-2 text-sm text-foreground font-bold hover:text-primary hover:bg-accent/5 transition-colors"
              >
                Living Room
              </Link>
              <Link
                href="/collections/bedroom"
                className="block px-6 py-2 text-sm text-foreground font-bold hover:text-primary hover:bg-accent/5 transition-colors"
              >
                Bedroom
              </Link>
              <Link
                href="/collections/dining-room"
                className="block px-6 py-2 text-sm text-foreground font-bold hover:text-primary hover:bg-accent/5 transition-colors"
              >
                Dining Room
              </Link>
              <div className="mx-6 my-2 h-px bg-foreground/5" />
              <Link
                href="/collections"
                className="block px-6 py-2 text-sm text-primary font-bold hover:bg-primary/5 transition-colors"
              >
                View All Collections
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
            href="/contact"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Cart Dropdown */}
          <div className="relative mr-2">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="p-2 rounded-full hover:bg-accent/10 transition-colors relative"
            >
              <ShoppingCart
                className={`w-6 h-6 ${scrolled ? "text-foreground" : "text-primary"}`}
              />
              {itemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-background animate-in zoom-in duration-300">
                  {itemsCount}
                </span>
              )}
            </button>

            <div
              className={`absolute top-full right-0 w-[calc(100vw-2rem)] sm:w-80 bg-background backdrop-blur-xl border border-primary/10 rounded-2xl shadow-2xl py-6 px-4 transition-all duration-300 translate-y-2 z-50 ${
                cartOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible pointer-events-none"
              }`}
            >
              <h3 className="text-lg text-foreground/70 font-bold mb-4 px-2">
                Your Cart
              </h3>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingCart className="w-6 h-6 text-foreground/20" />
                  </div>
                  <p className="text-sm text-foreground/40 font-bold">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group/item">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-accent flex-shrink-0">
                        {/* standard img for robustness as requested before */}
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-foreground truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-primary font-bold mt-0.5">
                          ${item.price}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center bg-accent/10 rounded-lg p-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1 hover:text-primary transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-[10px] font-bold w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1 hover:text-primary transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[10px] font-bold text-red-400 hover:text-red-500 transition-colors uppercase tracking-widest mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-primary/5 mt-4">
                    <div className="flex justify-between items-center mb-4 px-2">
                      <span className="text-sm font-bold opacity-40">
                        Total Amount
                      </span>
                      <span className="text-lg font-bold text-primary">
                        ${cartTotal.toLocaleString()}
                      </span>
                    </div>
                    <Link
                      href="/checkout"
                      className="block w-full py-3 bg-primary text-white text-center rounded-xl font-bold shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                      Checkout Now
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <span
                className={`text-sm font-semibold hidden sm:block transition-colors duration-300 ${
                  scrolled ? "text-foreground" : "text-secondary"
                }`}
              >
                Hello, {user?.name}
              </span>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="p-2 rounded-full hover:bg-accent/10 transition-colors"
                >
                  <User
                    className={`w-7 h-7 ${scrolled ? "text-secondary" : "text-primary"}`}
                  />
                </button>
                <div
                  className={`absolute top-full right-0 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 transition-all duration-300 translate-y-2 z-50 ${
                    profileOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible pointer-events-none"
                  }`}
                >
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
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
            <div className="hidden md:flex items-center gap-2">
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
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 top-[72px] bg-background/95 backdrop-blur-lg z-40 transition-all duration-500 md:hidden ${
          mobileMenuOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4"
        }`}
      >
        <div className="container mx-auto px-6 py-10 flex flex-col gap-8">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="relative w-32 h-10"
          >
            <Image
              src="/images/logo.png"
              alt="Goodwill Logo"
              fill
              className="object-contain"
            />
          </Link>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-4">
              Collections
            </h4>
            <Link
              href="/collections/living-room"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-2xl font-bold text-foreground hover:text-primary transition-colors"
            >
              Living Room
            </Link>
            <Link
              href="/collections/bedroom"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-2xl font-bold text-foreground hover:text-primary transition-colors"
            >
              Bedroom
            </Link>
            <Link
              href="/collections/dining-room"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-2xl font-bold text-foreground hover:text-primary transition-colors"
            >
              Dining Room
            </Link>
            <div className="pt-2">
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-block text-sm font-bold text-primary border-b-2 border-primary/20 pb-1"
              >
                View All Collections
              </Link>
            </div>
          </div>

          <div className="h-px bg-foreground/5" />

          <div className="space-y-6">
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              Our Story
            </Link>
            <Link
              href="/#showroom"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              Showroom
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>

          {!isAuthenticated && (
            <div className="mt-auto grid grid-cols-2 gap-4 pb-10">
              <Link
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="py-4 text-center text-sm font-bold text-primary border-2 border-primary/10 rounded-2xl"
              >
                Sign Up
              </Link>
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-4 text-center text-sm font-bold text-white bg-primary rounded-2xl shadow-lg shadow-primary/20"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
