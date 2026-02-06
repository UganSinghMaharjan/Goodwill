"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ContactPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          user_id: user?.id,
        }),
      });
      setStatus({
        type: "success",
        message: "Thank you for your message! We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="pt-32 pb-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">
                Contact Us
              </h4>
              <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-8">
                Get in <span className="text-primary italic">Touch</span>
              </h1>
              <p className="text-xl text-secondary max-w-2xl leading-relaxed">
                Whether you're looking for a bespoke piece or have a question
                about our collections, our team is here to help you create your
                dream space.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Contact Form */}
              <div className="lg:col-span-7">
                <div className="bg-white/50 backdrop-blur-sm border border-accent/20 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-accent/5">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-xs font-bold uppercase tracking-widest text-foreground/80 ml-1"
                        >
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full bg-accent/5 border border-accent/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 focus:bg-white transition-all font-medium text-foreground placeholder:text-foreground/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-xs font-bold uppercase tracking-widest text-foreground/80 ml-1"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full bg-accent/5 border border-accent/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 focus:bg-white transition-all font-medium text-foreground placeholder:text-foreground/40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <div className="space-y-2">
                        <label
                          htmlFor="phone"
                          className="text-xs font-bold uppercase tracking-widest text-foreground/80 ml-1"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+977 9800000000"
                          className="w-full bg-accent/5 border border-accent/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 focus:bg-white transition-all font-medium text-foreground placeholder:text-foreground/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="subject"
                          className="text-xs font-bold uppercase tracking-widest text-foreground/80 ml-1"
                        >
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Inquiry about Custom Sofa"
                          className="w-full bg-accent/5 border border-accent/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 focus:bg-white transition-all font-medium text-foreground placeholder:text-foreground/40"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-xs font-bold uppercase tracking-widest text-foreground/80 ml-1"
                      >
                        How can we help?
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your project..."
                        className="w-full bg-accent/5 border border-accent/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 focus:bg-white transition-all font-medium text-foreground placeholder:text-foreground/40 resize-none"
                      />
                    </div>

                    {status.type && (
                      <div
                        className={`p-4 rounded-xl text-sm font-bold ${
                          status.type === "success"
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}
                      >
                        {status.message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-primary hover:bg-primary-hover text-white rounded-2xl transition-all flex items-center justify-center gap-3 font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{loading ? "Sending..." : "Send Message"}</span>
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-5 space-y-12">
                <div className="space-y-8">
                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-primary/80 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground mb-2">
                        Our Showroom
                      </h4>
                      <p className="text-secondary font-medium leading-relaxed">
                        M8P8+GWH, Lalitpur 44600
                        <br />
                        Nepal
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-primary/80 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground mb-2">
                        Call Us
                      </h4>
                      <p className="text-secondary font-medium">01-5523697</p>
                      <p className="text-secondary font-medium">
                        +977-9851026442/Madan Kaji Maharjan
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-primary/80 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground mb-2">
                        Email
                      </h4>
                      <p className="text-secondary font-medium">
                        info@goodwillfurniture.com
                      </p>
                      <p className="text-secondary font-medium">
                        support@goodwillfurniture.com
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-accent/20">
                  <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/60 mb-6">
                    Follow Our Journey
                  </h4>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="w-12 h-12 rounded-xl border border-accent/20 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 rounded-xl border border-accent/20 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 rounded-xl border border-accent/20 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-[2rem] p-8 mt-12 overflow-hidden relative group">
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold text-foreground mb-3">
                      Visit our Showroom
                    </h4>
                    <p className="text-secondary text-sm font-medium mb-6">
                      Experience the craftsmanship and quality of our pieces
                      firsthand.
                    </p>
                    <a
                      href="https://maps.app.goo.gl/KLDTCsrWF3g85m9Z9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest hover:gap-4 transition-all"
                    >
                      Get Directions <Send className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
