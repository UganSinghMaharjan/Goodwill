"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    // Basic protection also on the page itself
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    // Fetch product
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8001/product/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link href="/" className="text-primary hover:underline mt-4">
            Return Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24 container mx-auto px-6">
        <Link
          href={`/collections/${product.category}`}
          className="text-foreground font-extrabold hover:text-primary transition-colors mb-8 inline-block text-sm"
        >
          &larr; Back to Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Image Section */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-accent shadow-lg">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Details Section */}
          <div>
            <span className="text-primary font-bold tracking-widest uppercase text-sm">
              {product.category.replace("-", " ")}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-foreground">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-primary mb-8">
              ${product.price}
            </p>
            <div className="prose prose-lg text-foreground/80 mb-12">
              <p>{product.description}</p>
            </div>

            <button className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
