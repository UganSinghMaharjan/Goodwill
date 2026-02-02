import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/furniture-hero.png"
          alt="Luxury Furniture"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary/10 text-primary rounded-full">
            Limited Edition Collection
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8 text-foreground">
            Elevate Your <span className="text-primary italic">Living</span>{" "}
            Space.
          </h1>
          <p className="text-lg md:text-xl text-foreground font-medium mb-10 leading-relaxed">
            Discover a curated selection of premium furniture where timeless
            craftsmanship meets modern design. Crafted for comfort, styled for
            impact.
          </p>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              href="/#collections"
              className="w-full sm:w-auto px-10 py-5 text-lg font-bold text-center text-white bg-primary rounded-xl hover:bg-primary-hover transition-all transform hover:scale-105 shadow-xl shadow-primary/10"
            >
              Explore Collections
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-10 py-5 text-lg font-bold text-center text-foreground border-2 border-foreground rounded-xl hover:bg-accent transition-all"
            >
              Our Story
            </Link>
            s
          </div>
        </div>
      </div>
    </section>
  );
}
