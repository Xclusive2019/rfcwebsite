import { Link } from "react-router-dom";

const services = [
  {
    icon: "verified",
    title: "Food Safety Management System Development",
    tags: ["FSSC 22000", "HACCP", "BRCGS", "GLOBALG.A.P."],
    desc: "Full FSMS implementation from gap assessment through Stage 1 & 2 audits to certification. Version 6 compliant.",
    href: "/services/fsms-development",
  },
  {
    icon: "rule",
    title: "R638 Compliance",
    tags: ["Regulation R638", "DoH"],
    desc: "Ensure full compliance with South Africa's Regulations Governing General Hygiene Requirements for Food Premises.",
    href: "/contact",
  },
  {
    icon: "assignment_turned_in",
    title: "Internal & Pre-Audit Assessments",
    tags: ["Internal Audits", "Supplier Audits"],
    desc: "Independent internal audits and pre-audit assessments against any GFSI-benchmarked standard with detailed NCR reports.",
    href: "/services/internal-audits",
  },
  {
    icon: "storefront",
    title: "Retail & Food Service Assessments",
    tags: ["Retail", "Food Service"],
    desc: "Comprehensive assessments for retail and food service environments to ensure full regulatory and standards compliance.",
    href: "/services/retail-assessments",
  },
  {
    icon: "label",
    title: "Labelling, Product Audits & Development",
    tags: ["R146", "NPD"],
    desc: "Regulatory-compliant labelling reviews, product audits, and new product development support for food businesses.",
    href: "/services/labelling-product-audits",
  },
  {
    icon: "groups",
    title: "Food Safety Culture",
    tags: ["Culture", "FSSC 22000 v6"],
    desc: "Build a workplace culture of food safety from the ground up — management commitment, training, communication and measurement.",
    href: "/contact",
  },
];

export default function ConsultingServicesSection() {
  return (
    <section id="consulting" className="py-16 md:py-24 lg:py-32 bg-[#f8f8f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end mb-12 md:mb-16 reveal">
          <div>
            <p className="label mb-4">Consulting Services</p>
            <h2 className="heading-lg">End-to-End Food Safety Certification</h2>
          </div>
          <div className="lg:pb-1">
            <p className="text-[15px] text-[#4a4a4e] leading-relaxed max-w-lg">
              We guide South African food businesses from initial gap assessment through to internationally recognised certification — and beyond.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-1.5 mt-5 text-[13px] font-semibold text-[#4A7C2F] hover:underline underline-offset-2">
              Enquire about a service <span className="material-icon text-[14px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
          {services.map((s, i) => (
            <Link
              key={s.title}
              to={s.href}
              className={`group bg-[#f8f8f7] hover:bg-white transition-colors p-6 md:p-8 flex flex-col reveal reveal-delay-${Math.min(i + 1, 3)}`}
            >
              {/* Icon */}
              <div className="w-10 h-10 bg-[#4A7C2F]/10 flex items-center justify-center mb-5">
                <span className="material-icon text-[#4A7C2F] text-[20px]">{s.icon}</span>
              </div>

              {/* Title */}
              <h3
                className="text-[15px] md:text-base font-semibold text-[#1a1a1e] group-hover:text-[#4A7C2F] transition-colors mb-2.5 leading-snug"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {s.title}
              </h3>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {s.tags.map((t) => (
                  <span key={t} className="text-[10px] font-semibold uppercase tracking-wider text-[#4A7C2F] bg-[#4A7C2F]/8 px-2 py-0.5">
                    {t}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-[14px] text-[#4a4a4e] leading-relaxed flex-1">{s.desc}</p>

              {/* Learn more */}
              <span className="inline-flex items-center gap-1 mt-5 text-[13px] font-semibold text-[#4A7C2F] opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <span className="material-icon text-[13px]">arrow_forward</span>
              </span>
            </Link>
          ))}
        </div>

        {/* Quiz CTA */}
        <div className="mt-10 md:mt-12 bg-[#4A7C2F] p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 reveal">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-white mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Not Sure Where to Start?
            </h3>
            <p className="text-white/60 text-[14px] md:text-[15px]">
              Take our 2-minute audit readiness quiz to assess your current compliance level.
            </p>
          </div>
          <Link
            to="/audit-readiness"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1a1a1e] text-sm font-semibold hover:bg-[#f0f0f0] transition-colors"
          >
            <span className="material-icon text-[16px]">quiz</span>
            Take the Quiz
          </Link>
        </div>
      </div>
    </section>
  );
}
