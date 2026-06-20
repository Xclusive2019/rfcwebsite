import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

const auditTypes = [
  { title: "GFSI Standards", desc: "Internal audits against all Global Food Safety Initiative benchmarked standards." },
  { title: "SANS 10330 (HACCP)", desc: "Verification audits of your HACCP system to confirm ongoing compliance and effectiveness." },
  { title: "ISO 22000 & FSSC", desc: "Pre-audit assessments to ensure readiness before your certification body visit." },
  { title: "GlobalG.A.P. V6", desc: "Farm and supply chain assessments against GlobalG.A.P. Version 6 requirements." },
  { title: "Occupational Health & Safety", desc: "ISO 45001:2018 compliance audits and pre-audit readiness checks." },
  { title: "Quality & Legal Compliance", desc: "Assessments against quality management and applicable food legislation requirements." },
  { title: "Retail Standards", desc: "Internal audits for Nando's, YUM, McDonald's and other retail food service standards." },
  { title: "BRCGS", desc: "Pre-assessment audits against BRC Global Standards for food safety and packaging." },
];

export default function ServiceAuditsPage() {
  useScrollReveal();
  return (
    <main className="pt-24 min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#1a1a1e] py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(/hero-internal-audits.jpg)" }}>
          <div className="absolute inset-0 bg-[#1a1a1e]/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1e]/80 via-[#1a1a1e]/40 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="label text-white/50 mb-4 reveal">Service 03</p>
          <h1 className="heading-lg text-white max-w-2xl reveal">
            Internal and Pre-Audit Assessments
          </h1>
          <p className="mt-6 text-white/60 text-base max-w-xl leading-relaxed reveal">
            RFC delivers internal audit services and pre-audit assessments to ensure your system is maintained and fully prepared for your next certification or compliance audit.
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

      {/* Audit Types */}
      <section className="py-16 md:py-24 bg-[#f8f8f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">What We Cover</p>
          <h2 className="heading-md max-w-lg mb-12 reveal">Audit Types</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {auditTypes.map((item, i) => (
              <div key={i} className={`bg-[#f8f8f7] p-6 md:p-8 reveal reveal-delay-${(i % 4) + 1}`}>
                <span className="text-[12px] text-[#ccc] font-medium">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-sm font-semibold text-[#1a1a1e] mt-3 mb-2">{item.title}</h3>
                <p className="text-[15px] text-[#4a4a4e] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why RFC */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">Why RFC</p>
          <h2 className="heading-md max-w-lg mb-8 reveal">Independent. Thorough. Practical.</h2>
          <p className="text-[#4a4a4e] text-base max-w-2xl leading-relaxed reveal">
            Our auditors bring deep industry experience across manufacturing, retail, and food service. Every assessment delivers a detailed non-conformance report with actionable corrective actions — giving you a clear roadmap to close gaps before the certification body arrives.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#4A7C2F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Don't wait for the certification body to find the gaps.</h3>
            <p className="text-white/60 text-[15px]">Book an internal or pre-audit assessment today.</p>
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
