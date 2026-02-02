import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function AboutPage() {
  const suggestedHours = [
    { day: "Monday", hours: "9:00 AM – 7:00 PM", status: "Open" },
    { day: "Tuesday", hours: "9:00 AM – 7:00 PM", status: "Open" },
    { day: "Wednesday", hours: "9:00 AM – 7:00 PM", status: "Open" },
    { day: "Thursday", hours: "9:00 AM – 7:00 PM", status: "Open" },
    { day: "Friday", hours: "9:00 AM – 7:00 PM", status: "Open" },
    {
      day: "Saturday",
      hours: "10:00 AM – 2:00 PM",
      status: "Weekend Hours",
      note: "Suggested",
    },
    { day: "Sunday", hours: "9:00 AM – 7:00 PM", status: "Open" },
  ];

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="pt-32 pb-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-12 text-foreground tracking-tight">
              Our Story <span className="text-primary">&</span> Heritage
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-24">
              <div>
                <p className="text-xl text-secondary leading-relaxed mb-8 italic">
                  "Established with a vision to bring timeless elegance to every
                  home in Lalitpur, Goodwill has grown from a local workshop
                  into a premier furniture destination."
                </p>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                    Founders
                  </h3>
                  <div className="flex flex-col space-y-2 text-foreground">
                    <span className="text-2xl font-bold">
                      Madan Kaji Maharjan
                    </span>
                    <span className="text-2xl font-bold">Nanda Maharjan</span>
                  </div>
                </div>
              </div>
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/cat-living.png"
                  alt="Goodwill Showroom"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
              <div className="p-8 bg-accent/20 rounded-3xl">
                <h4 className="font-bold text-lg text-foreground mb-4">
                  Location
                </h4>
                <p className="text-foreground text-sm font-semibold leading-relaxed">
                  M8P8+GWH, Lalitpur 44600
                </p>
              </div>
              <div className="p-8 bg-accent/20 rounded-3xl border-2 border-primary/20">
                <h4 className="font-bold text-lg text-foreground mb-4">
                  Service Options
                </h4>
                <div className="flex items-center space-x-2 text-primary">
                  <svg
                    className="w-5 h-5"
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
                  <span className="font-bold uppercase tracking-tighter">
                    Same-day Delivery
                  </span>
                </div>
              </div>
              <div className="p-8 bg-accent/20 rounded-3xl">
                <h4 className="font-bold text-lg text-foreground mb-4">
                  Contact Info
                </h4>
                <p className="text-secondary text-sm font-semibold">
                  01-5523697
                </p>
                <p className="text-secondary text-sm font-semibold">
                  +977-9851026442
                </p>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm border border-accent rounded-[2rem] p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-foreground tracking-tight">
                    Showroom Hours
                  </h2>
                  <p className="text-secondary text-sm">
                    We've updated our hours slightly to better serve you.
                  </p>
                </div>
                <span className="px-4 py-1.5 text-xs font-bold bg-primary text-white rounded-full">
                  Recommended Schedule
                </span>
              </div>

              <div className="overflow-hidden border border-accent/20 rounded-2xl">
                <table className="w-full text-left">
                  <thead className="bg-primary/50 text-foreground text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Day</th>
                      <th className="px-6 py-4">Hours</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/20 text-sm">
                    {suggestedHours.map((row, i) => (
                      <tr key={i} className={row.note ? "bg-primary/5" : ""}>
                        <td className="px-6 py-4 font-bold text-foreground">
                          {row.day}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {row.hours}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                              row.status === "Open"
                                ? "bg-green-100 text-green-700"
                                : "bg-primary/20 text-primary"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
