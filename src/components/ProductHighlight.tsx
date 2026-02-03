import Link from "next/link";
import Image from "next/image";

export default function ProductHighlight() {
  return (
    <section className="py-24 bg-accent/20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/furniture-hero.png" // Reusing the high-quality sofa image
                alt="Craftsmanship Details"
                width={800}
                height={600}
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 p-6 bg-white rounded-2xl shadow-xl flex items-center space-x-4 max-w-xs">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-extrabold text-foreground">
                  Premium Materials
                </p>
                <p className="text-xs text-foreground font-bold italic opacity-90">
                  Ethically sourced solid oak & Italian velvet.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <h3 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4 text-center lg:text-left">
              The Art of Living
            </h3>
            <h2 className="text-primary text-4xl md:text-5xl font-bold mb-8 leading-tight text-center lg:text-left">
              Crafted with Integrity, Designed for Comfort.
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-accent font-bold leading-relaxed text-center lg:text-left">
                Every piece at Goodwill tells a story of meticulous
                craftsmanship. We believe that furniture isn't just about
                utility—it's about creating an atmosphere that inspires.
              </p>
              <ul className="space-y-4">
                {[
                  "Hand-finished in our local workshops",
                  "Sustainable and ethically sourced timbers",
                  "Ergonomic designs tailored for modern life",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center space-x-3 text-accent font-extrabold italic"
                  >
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-8 flex justify-center lg:justify-start">
                <Link
                  href="/about"
                  className="px-8 py-4 font-bold text-accent border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5"
                >
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
