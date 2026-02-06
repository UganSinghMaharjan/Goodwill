import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-accent">
      {/* Newsletter Section
      <div className="border-b border-white/5">
        <div className="container mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center lg:text-left">
              <h3 className="text-3xl font-bold text-white mb-4">
                Join our interior design circle
              </h3>
              <p className="text-accent/60 font-medium">
                Subscribe to receive curated interior inspiration, exclusive
                furniture launches, and early access to our seasonal
                collections.
              </p>
            </div>
            <div className="w-full max-w-md">
              <form className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-accent/5 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-primary/50 transition-all font-medium text-white placeholder:text-accent/30"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-6 bg-primary hover:bg-primary-hover text-white rounded-xl transition-all flex items-center gap-2 group-hover:shadow-lg shadow-primary/20"
                >
                  <span className="hidden sm:inline">Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div> */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 max-w-sm">
            <Link href="/" className="relative w-52 h-20 block mb-8 -ml-2">
              <Image
                src="/images/logo.png"
                alt="Goodwill Logo"
                fill
                className="object-contain"
                priority
              />
            </Link>
            <p className="text-accent/60 font-medium leading-relaxed mb-10">
              Crafting timeless furniture pieces that blend traditional
              craftsmanship with modern silhouettes. Your home is a story; we
              help you tell it beautifully.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group"
              >
                <Instagram className="w-5 h-5 text-accent group-hover:text-white" />
              </Link>
              <Link
                href="#"
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group"
              >
                <Facebook className="w-5 h-5 text-accent group-hover:text-white" />
              </Link>
              <Link
                href="#"
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group"
              >
                <Twitter className="w-5 h-5 text-accent group-hover:text-white" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="space-y-8 text-center sm:text-left">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                Collections
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/collections/living-room"
                    className="text-accent/50 hover:text-primary transition-colors font-medium"
                  >
                    Living Room
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/bedroom"
                    className="text-accent/50 hover:text-primary transition-colors font-medium"
                  >
                    Bedroom
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/dining-room"
                    className="text-accent/50 hover:text-primary transition-colors font-medium"
                  >
                    Dining Room
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections"
                    className="text-accent/50 hover:text-primary transition-colors font-medium"
                  >
                    Signature Collection
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-8 text-center sm:text-left">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                Our World
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/about"
                    className="text-accent/50 hover:text-primary transition-colors font-medium"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-accent/50 hover:text-primary transition-colors font-medium"
                  >
                    Craftsmanship
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-accent/50 hover:text-primary transition-colors font-medium"
                  >
                    Sustainabiltiy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-accent/50 hover:text-primary transition-colors font-medium"
                  >
                    Showrooms
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-8 text-center sm:text-left col-span-2 sm:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                Assistance
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/contact"
                    className="text-accent/50 hover:text-primary transition-colors font-medium"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-accent/50 hover:text-primary transition-colors font-medium"
                  >
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-accent/50 hover:text-primary transition-colors font-medium"
                  >
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-accent/50 hover:text-primary transition-colors font-medium"
                  >
                    Care Guide
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8 text-xs text-accent/60 font-bold uppercase tracking-widest">
            <p>
              © {new Date().getFullYear()} Goodwill Furniture. All Rights
              Reserved.
            </p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-accent/50 font-bold italic tracking-wider">
            <span>Designed for Excellence</span>
            <div className="w-8 h-px bg-white/10" />
            <span>Modern Living</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
