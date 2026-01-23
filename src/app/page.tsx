import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Features";
import FeaturedProducts from "@/components/FeaturedProducts";
import ProductHighlight from "@/components/ProductHighlight";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <ProductHighlight />
      <Footer />
    </main>
  );
}
