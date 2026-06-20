import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

const focusAreas = [
  "Global Food Safety Initiative (GFSI – Basic and Intermediate Levels)",
  "SANS 10330 (HACCP)",
  "ISO 22000 and FSSC Certifications",
  "ISO/TS 22002 and SANS 10049 (Pre-requisite Programs)",
  "ISO 45001:2018 Health and Safety",
  "GlobalG.A.P. V6 Implementation",
  "ISO 9001:2015 Quality Management",
  "SMETA, SIZA and GRASP Implementation",
];

const processSteps = [
  "GAP assessments",
  "Documented project plans",
  "Hygiene management system documentation",
  "HACCP plans",
  "On-site implementation",
  "Employee training",
  "Product descriptions",
  "Microbiological testing programmes",
  "Labelling evaluations",
  "Process flow charts",
  "Verification and validation",
  "Management reviews",
  "Internal audits",
];

export default function ServiceFSMSDevelopmentPage() {
  useScrollReveal();
  return (
    <main className="pt-24 min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#1a1a1e] py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(/hero-food-safety-management.jpg)" }}>
          <div className="absolute inset-0 bg-[#1a1a1e]/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1e]/80 via-[#1a1a1e]/40 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="label text-white/50 mb-4 reveal">Service 01</p>
          <h1 className="heading-lg text-white max-w-2xl reveal">
            Food Safety Management System Development
          </h1>
          <p className="mt-6 text-white/60 text-base max-w-xl leading-relaxed reveal">
            Specialist support and a practical approach to assist companies in establishing comprehensive food safety frameworks — from initial gap assessment through to certification.
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

      {/* Focus Areas */}
      <section className="py-16 md:py-24 bg-[#f8f8f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">Standards & Frameworks</p>
          <h2 className="heading-md max-w-lg mb-12 reveal">Focus Areas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {focusAreas.map((area, i) => (
              <div key={i} className={`bg-[#f8f8f7] p-6 reveal reveal-delay-${(i % 4) + 1}`}>
                <span className="material-icon text-[#4A7C2F] text-[20px] mb-3 block">check_circle</span>
                <p className="text-sm font-medium text-[#1a1a1e] leading-snug">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">How We Work</p>
          <h2 className="heading-md max-w-lg mb-12 reveal">Implementation Process</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step, i) => (
              <div key={i} className={`flex items-start gap-4 reveal reveal-delay-${(i % 3) + 1}`}>
                <span className="text-[12px] font-semibold text-[#ccc] w-6 shrink-0 pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] text-[#4a4a4e] leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#4A7C2F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Ready to build your food safety system?</h3>
            <p className="text-white/60 text-[15px]">Our consultants will guide you from gap assessment to certification.</p>
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
