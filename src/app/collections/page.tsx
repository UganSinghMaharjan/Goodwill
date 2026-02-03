"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  is_hidden?: boolean;
}

function AuthProductButton({ product }: { product: Product }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const handleView = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      router.push(`/products/${product.id}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleView}
        className="flex-[2] py-4 bg-transparent border-2 border-primary/20 rounded-2xl font-bold text-primary hover:bg-white hover:border-white hover:text-primary transition-all duration-500"
      >
        View
      </button>
      <button
        onClick={handleAddToCart}
        className="flex-1 py-4 bg-primary rounded-2xl font-bold text-white hover:bg-primary-hover shadow-lg shadow-primary/10 transition-all duration-500 flex items-center justify-center"
      >
        <ShoppingCart className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function AllCollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<Product[]>("/products");
        // Filter out hidden products if the API doesn't already do it
        setProducts(data.filter((p) => !p.is_hidden));
      } catch (err: any) {
        console.error("Error fetching all products:", err);
        setError(err.message || "Failed to load catalog");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-40 pb-32 bg-accent/20">
        <div className="container mx-auto px-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-bold text-foreground/40 hover:text-primary transition-colors mb-16"
          >
            <ArrowLeft className="w-4 h-4 transform transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
              Full Catalog
            </h1>
            <p className="text-lg text-secondary max-w-2xl mx-auto font-medium">
              Explore the complete Goodwill collection. From sculptural seating
              to architectural tables, discover the full range of our minimalist
              heritage pieces.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <ProtectedRoute>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
              <h3 className="text-xl font-bold text-red-600 mb-2">
                Connection Error
              </h3>
              <p className="text-red-500 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
              >
                Retry Connection
              </button>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer transition-all duration-500"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 bg-accent shadow-sm group-hover:shadow-2xl transition-all duration-500 group-hover:translate-y-[-4px]">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={true}
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-6 right-6 bg-background/90 backdrop-blur-md px-5 py-2 rounded-full font-bold text-primary shadow-sm">
                      ${product.price}
                    </div>
                  </div>
                  <div className="px-2 text-center md:text-left">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {product.name}
                      </h3>
                      <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-md uppercase tracking-wider">
                        {product.category.replace("-", " ")}
                      </span>
                    </div>
                    <p className="text-foreground line-clamp-2 text-sm leading-relaxed mb-6 italic font-bold">
                      {product.description}
                    </p>
                    <AuthProductButton product={product} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-accent/10 rounded-3xl">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Catalog empty
              </h3>
              <p className="text-secondary">
                We haven't unleashed any architectural pieces to the public yet.
                Please check back soon.
              </p>
            </div>
          )}
        </ProtectedRoute>
      </div>

      <Footer />
    </main>
  );
}
