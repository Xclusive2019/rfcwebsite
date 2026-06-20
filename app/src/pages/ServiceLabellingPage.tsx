import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

const offerings = [
  { icon: "label", title: "Labelling Assessments", desc: "Regulatory review of product labels against R146, R638, and applicable South African food labelling legislation to ensure full compliance." },
  { icon: "science", title: "Product Audits", desc: "Systematic audits of existing products against food safety, quality, and legal requirements — identifying gaps before they become non-conformances." },
  { icon: "inventory_2", title: "Product Development", desc: "End-to-end support for new product development including formulation guidance, HACCP integration, and launch-ready compliance documentation." },
  { icon: "biotech", title: "Labelling Development", desc: "Creation and review of compliant label artwork and copy — nutritional information, allergen declarations, claims, and country-of-origin requirements." },
];

const highlights = [
  "R146 food labelling compliance",
  "Allergen declaration review",
  "Nutritional information verification",
  "Health and nutrition claims assessment",
  "Country-of-origin requirements",
  "New product development support",
  "HACCP integration for new products",
  "Pre-launch compliance sign-off",
];

export default function ServiceLabellingPage() {
  useScrollReveal();
  return (
    <main className="pt-24 min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#1a1a1e] py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1920&q=80)" }}>
          <div className="absolute inset-0 bg-[#1a1a1e]/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1e]/80 via-[#1a1a1e]/40 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="label text-white/50 mb-4 reveal">Service 05</p>
          <h1 className="heading-lg text-white max-w-2xl reveal">
            Labelling, Product Audits and Development
          </h1>
          <p className="mt-6 text-white/60 text-base max-w-xl leading-relaxed reveal">
            RFC provides specialist services in product development, product audits, and labelling assessments — ensuring your products are compliant, market-ready, and fully aligned with South African food legislation.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 reveal">
            <Link to="/book" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors">
              <span className="material-icon text-[16px]">calendar_today</span>
              Book a Consultation
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
              Enquire Now
            </Link>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="py-16 md:py-24 bg-[#f8f8f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">What We Offer</p>
          <h2 className="heading-md max-w-lg mb-12 reveal">Our Services</h2>
          <div className="grid sm:grid-cols-2 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {offerings.map((item, i) => (
              <div key={i} className={`bg-[#f8f8f7] p-6 md:p-10 reveal reveal-delay-${i + 1}`}>
                <span className="material-icon text-[#4A7C2F] text-[28px] mb-4 block">{item.icon}</span>
                <h3 className="text-base font-semibold text-[#1a1a1e] mb-2">{item.title}</h3>
                <p className="text-[15px] text-[#4a4a4e] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">Key Areas</p>
          <h2 className="heading-md max-w-lg mb-12 reveal">What We Cover</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-4 border border-[#e8e8e8] reveal reveal-delay-${(i % 4) + 1}`}>
                <span className="material-icon text-[#4A7C2F] text-[18px] shrink-0">check</span>
                <span className="text-sm font-medium text-[#1a1a1e]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#4A7C2F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Is your labelling legislation-compliant?</h3>
            <p className="text-white/60 text-[15px]">Let RFC review your labels and products before they hit the shelf.</p>
          </div>
          <Link to="/book" className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1a1a1e] text-sm font-semibold hover:bg-[#f0f0f0] transition-colors">
            <span className="material-icon text-[16px]">arrow_forward</span>
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}
