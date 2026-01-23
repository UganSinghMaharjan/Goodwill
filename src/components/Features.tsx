import Image from "next/image";
import Link from "next/link";

export default function Categories() {
  const categories = [
    {
      title: "Living Room",
      description: "Sophisticated comfort for your shared spaces.",
      image: "/images/cat-living.png",
      href: "/collections/living-room",
    },
    {
      title: "Bedroom",
      description: "Serene designs for your personal sanctuary.",
      image: "/images/cat-bedroom.png",
      href: "/collections/bedroom",
    },
    {
      title: "Dining Room",
      description: "Elegant settings for memorable gatherings.",
      image: "/images/cat-dining.png",
      href: "/collections/dining-room",
    },
  ];

  return (
    <section id="collections" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Shop by Collection
            </h2>
            <p className="text-foreground text-lg font-medium">
              Explore our curated pieces, each designed with a unique
              personality to fit your home perfectly.
            </p>
          </div>
          <Link
            href="#"
            className="font-bold text-primary border-b-2 border-primary pb-1 hover:text-primary-hover hover:border-primary-hover transition-all"
          >
            View All Collections
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {categories.map((cat, index) => (
            <Link
              key={index}
              href={cat.href}
              className="group overflow-hidden rounded-3xl relative aspect-[4/5]"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {cat.title}
                </h3>
                <p className="text-gray-100 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                  {cat.description}
                </p>
                <span className="mt-4 inline-flex items-center text-white font-bold text-sm">
                  Explore{" "}
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
