"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/app/lib/api";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await apiFetch<Product[]>("/products"); // Fetch all products
        // Filter for featured ones
        const featured = data.filter((p: any) => p.is_featured && !p.is_hidden);
        setProducts(featured.slice(0, 3)); // Show top 3 featured
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading || products.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
            Featured Masterpieces
          </h2>
          <p className="text-foreground text-lg font-bold max-w-2xl mx-auto">
            A glimpse into our most celebrated designs, where every curve and
            texture is a testament to our dedication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="relative aspect-square overflow-hidden rounded-3xl mb-6 shadow-sm hover:shadow-xl transition-shadow duration-500">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  unoptimized={true}
                  onError={(e) => {
                    console.error(
                      `Failed to load image for featured product ${product.id}:`,
                      product.image_url,
                    );
                  }}
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute bottom-6 left-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button className="p-4 bg-white/90 backdrop-blur-md rounded-xl font-bold text-primary shadow-lg hover:bg-white transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl text-foreground font-bold mb-1">
                    {product.name}
                  </h3>
                  <p className="text-foreground text-xs font-extrabold uppercase tracking-widest">
                    {product.category.replace("-", " ")}
                  </p>
                </div>
                <p className="text-primary font-bold text-lg">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
