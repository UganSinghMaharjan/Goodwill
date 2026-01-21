import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Features"; // Renamed internally but file is Features.tsx
import ProductHighlight from "@/components/ProductHighlight";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories />
      <ProductHighlight />
      <Footer />
    </main>
  );
}
