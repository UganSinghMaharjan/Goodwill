"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/app/lib/api";

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

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Fetch products from 'bedroom' category as an example
        const data = await apiFetch<Product[]>("/products/bedroom");
        setProducts(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
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
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute bottom-6 left-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <button className="w-full py-4 bg-white/90 backdrop-blur-md rounded-xl font-bold text-primary shadow-lg hover:bg-white transition-colors">
                    Quick View
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-1">{product.name}</h3>
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
