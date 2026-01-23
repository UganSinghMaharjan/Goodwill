"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
}

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryTitle =
    typeof category === "string"
      ? category
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8001/products/${category}`,
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24 container mx-auto px-6">
        <div className="mb-12">
          <Link
            href="/"
            className="text-foreground font-extrabold hover:text-primary transition-colors mb-4 inline-block text-sm"
          >
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {categoryTitle} Collection
          </h1>
          <p className="mt-4 text-xl text-foreground font-bold max-w-2xl opacity-90">
            A curated selection of {categoryTitle.toLowerCase()} pieces,
            designed for timeless appeal and modern living.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((product, idx) => (
              <div
                key={product.id}
                className="group cursor-pointer opacity-0 animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-forwards"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 bg-accent shadow-sm group-hover:shadow-2xl transition-all duration-500 group-hover:translate-y-[-4px]">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-6 right-6 bg-background/90 backdrop-blur-md px-5 py-2 rounded-full font-bold text-primary shadow-sm">
                    ${product.price}
                  </div>
                </div>
                <div className="px-2 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-foreground line-clamp-2 text-sm leading-relaxed mb-6 italic font-bold">
                    {product.description}
                  </p>
                  <button className="w-full py-4 bg-transparent border-2 border-primary/20 rounded-2xl font-bold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/20">
                    View Masterpiece
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-accent/10 rounded-3xl">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-secondary">
              We couldn't find any products in this collection yet.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
