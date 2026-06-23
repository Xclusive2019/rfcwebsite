import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

const scope = [
  { icon: "storefront", title: "Retail Assessments", desc: "Food hygiene and food safety system assessments for supermarkets, grocery chains, and retail food environments." },
  { icon: "restaurant", title: "Food Service Assessments", desc: "Compliance assessments for restaurants, caterers, quick-service chains, and institutional food service operations." },
  { icon: "fact_check", title: "Food Safety Systems", desc: "Review of documented food safety and quality management systems against applicable standards and legislation." },
  { icon: "rule", title: "Hygiene Assessments", desc: "On-site food hygiene evaluations measuring compliance with R638 and HACCP-based requirements." },
];

const industries = [
  "Supermarkets & Grocery Retail",
  "Quick Service Restaurants",
  "Casual Dining & Full-Service Restaurants",
  "Institutional Catering",
  "Hospital & Healthcare Catering",
  "Hotels & Hospitality",
  "Food Courts & Malls",
  "School & Corporate Canteens",
];

export default function ServiceRetailAssessmentsPage() {
  useScrollReveal();
  return (
    <main className="pt-24 min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#1a1a1e] py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1920&q=80)" }}>
          <div className="absolute inset-0 bg-[#1a1a1e]/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1e]/80 via-[#1a1a1e]/40 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-block bg-white rounded-lg px-4 py-2.5 mb-6 reveal shadow-sm border border-white/10">
            <img src="/RFC_logo-removebg-preview.png" alt="RFC Consulting" className="h-16 w-auto object-contain" />
          </div>
          <p className="label text-white/50 mb-4 reveal">Service 04</p>
          <h1 className="heading-lg text-white max-w-2xl reveal">
            Retail and Food Service Assessments
          </h1>
          <p className="mt-6 text-white/60 text-base max-w-xl leading-relaxed reveal">
            RFC conducts food hygiene and food safety and quality systems assessments for retailers and the food service industry — measuring your compliance against current regulatory and standard requirements.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 reveal">
            <Link to="/book" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors">
              <span className="material-icon text-[16px]">calendar_today</span>
              Book an Assessment
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
              Enquire Now
            </Link>
          </div>
        </div>
      </section>

      {/* Scope */}
      <section className="py-16 md:py-24 bg-[#f8f8f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">What We Assess</p>
          <h2 className="heading-md max-w-lg mb-12 reveal">Assessment Scope</h2>
          <div className="grid sm:grid-cols-2 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {scope.map((item, i) => (
              <div key={i} className={`bg-[#f8f8f7] p-6 md:p-10 reveal reveal-delay-${i + 1}`}>
                <span className="material-icon text-[#4A7C2F] text-[28px] mb-4 block">{item.icon}</span>
                <h3 className="text-base font-semibold text-[#1a1a1e] mb-2">{item.title}</h3>
                <p className="text-[15px] text-[#4a4a4e] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">Who We Serve</p>
          <h2 className="heading-md max-w-lg mb-12 reveal">Industries</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {industries.map((item, i) => (
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
            <h3 className="text-lg font-semibold text-white mb-1">Measure your compliance before the inspector does.</h3>
            <p className="text-white/60 text-[15px]">Book a retail or food service assessment with RFC today.</p>
          </div>
          <Link to="/book" className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1a1a1e] text-sm font-semibold hover:bg-[#f0f0f0] transition-colors">
            <span className="material-icon text-[16px]">arrow_forward</span>
            Book Assessment
          </Link>
        </div>
      </section>
    </main>
  );
}
