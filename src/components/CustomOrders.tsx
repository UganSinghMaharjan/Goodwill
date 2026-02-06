import Image from "next/image";
import { ArrowRight, PenTool, Ruler, Sparkles } from "lucide-react";

const CustomOrders = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <div className="relative group">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
              <Image
                src="/images/bespoke-workshop.png"
                alt="Bespoke furniture workshop"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a120e]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Floating Detail Card */}
            <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-2xl shadow-2xl border border-[#9f4d2c]/10 max-w-xs animate-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#9f4d2c]/10 rounded-lg text-[#9f4d2c]">
                  <PenTool className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9f4d2c]">
                  Atelier Note
                </span>
              </div>
              <p className="text-sm font-bold text-[#1a120e] leading-relaxed italic">
                "Every custom piece begins with a dialogue between history and
                your space."
              </p>
            </div>
          </div>

          {/* Text Column */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#9f4d2c]/5 rounded-full">
                <Sparkles className="w-4 h-4 text-[#9f4d2c]" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#9f4d2c]">
                  Bespoke Commissions
                </span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-bold text-[#1a120e] leading-[0.9] tracking-tighter">
                Crafted for your <br />
                <span className="text-[#9f4d2c]">Personal History.</span>
              </h2>
            </div>

            <p className="text-xl text-[#4a403a]/70 font-medium leading-relaxed max-w-xl">
              While our catalog represents our foundational philosophy, we
              believe true architectural furniture should be as unique as the
              space it inhabits. We offer full customization for any residential
              or commercial project.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
              {[
                {
                  icon: Ruler,
                  title: "Architectural Fit",
                  desc: "Precision dimensions tailored to your specific room layout.",
                },
                {
                  icon: PenTool,
                  title: "Material Selection",
                  desc: "Choose from our curated collection of rare woods and textiles.",
                },
              ].map((feature, i) => (
                <div key={i} className="space-y-3">
                  <div className="p-3 bg-[#fcf9f5] border border-[#9f4d2c]/10 rounded-xl w-fit text-[#9f4d2c]">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#1a120e] uppercase tracking-wider">
                    {feature.title}
                  </h4>
                  <p className="text-xs font-medium text-[#4a403a]/60 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            <button className="flex items-center gap-4 py-6 px-10 bg-[#1a120e] text-white rounded-full font-bold shadow-2xl hover:bg-[#9f4d2c] transition-all duration-500 group">
              Start Custom Consultation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomOrders;
