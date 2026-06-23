import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

const ohsServices = [
  {
    icon: "fact_check",
    title: "OHS Compliance Assessments",
    desc: "Comprehensive workplace assessments to identify legal compliance gaps, with practical solutions aligned to applicable legislation and industry best practices.",
    bullets: [] as string[],
  },
  {
    icon: "manage_search",
    title: "Risk Assessments",
    desc: "Our consultants assist with:",
    bullets: ["Baseline Risk Assessments", "Issue-Based Risk Assessments", "Continuous Risk Assessments", "Job Hazard Analysis (JHA)", "Task-Based Risk Assessments"],
  },
  {
    icon: "description",
    title: "OHS Documentation Development",
    desc: "We develop and implement:",
    bullets: ["Health & Safety Policies", "Safe Work Procedures", "Emergency Preparedness Plans", "Incident Investigation Procedures", "Contractor Management Systems", "Legal Registers", "Health & Safety Files", "Method Statements", "Toolbox Talk Programs"],
  },
  {
    icon: "verified_user",
    title: "Health & Safety Audits",
    desc: "We conduct:",
    bullets: ["Internal Health & Safety Audits", "Legal Compliance Audits", "Contractor Audits", "Workplace Inspections", "Gap Analysis Audits"],
  },
  {
    icon: "troubleshoot",
    title: "Incident Investigation & Root Cause Analysis",
    desc: "Our specialists assist with:",
    bullets: ["Incident Investigations", "Near-Miss Investigations", "Root Cause Analysis", "Corrective Action Development", "Preventive Action Programs"],
  },
];

const labourInspectionItems = [
  "Pre-inspection compliance assessments",
  "Preparation of legal documentation",
  "Assistance during official inspections",
  "Corrective Action Plans",
  "Follow-up compliance verification",
  "Guidance on Notices and Contraventions",
];

const whyChooseItems = [
  { icon: "person_check",   label: "Experienced OHS Consultants" },
  { icon: "factory",        label: "Practical, Industry-Specific Solutions" },
  { icon: "gavel",          label: "Assistance with Department of Labour Inspections" },
  { icon: "tune",           label: "Customised Health & Safety Systems" },
  { icon: "manage_search",  label: "Comprehensive Risk Assessments" },
  { icon: "school",         label: "Accredited and Workplace-Based Training" },
  { icon: "cloud_done",     label: "Digital Compliance Management through Comply Cloud" },
  { icon: "public",         label: "Nationwide Service Across South Africa" },
];

const ohsIndustries = [
  { icon: "precision_manufacturing", label: "Manufacturing & Food Processing" },
  { icon: "construction",            label: "Construction & Engineering" },
  { icon: "agriculture",             label: "Agriculture & Farming" },
  { icon: "local_shipping",          label: "Warehousing & Logistics" },
  { icon: "storefront",              label: "Retail & Hospitality" },
  { icon: "corporate_fare",          label: "Any Regulated Industry" },
];

const trainingCourses = [
  {
    icon: "medical_services",
    title: "First Aid Training",
    desc: "Equip employees with life-saving skills to respond effectively during medical emergencies.",
    duration: "1 Day", price: "R1 190",
  },
  {
    icon: "local_fire_department",
    title: "Fire Fighting",
    desc: "Identify fire risks, use fire-fighting equipment correctly, and respond safely during emergencies.",
    duration: "Half Day", price: "R980",
  },
  {
    icon: "shield_person",
    title: "SHE Representative",
    desc: "Train H&S Representatives to fulfil their legal responsibilities and actively contribute to workplace safety.",
    duration: "1 Day", price: "R1 190",
  },
  {
    icon: "stairs",
    title: "Working at Heights",
    desc: "Knowledge and practical skills required to work safely at elevated locations.",
    duration: "1 Day", price: "R1 190",
  },
  {
    icon: "troubleshoot",
    title: "Incident Investigation",
    desc: "Develop the skills required to investigate workplace incidents and identify root causes.",
    duration: "1 Day", price: "R1 190",
  },
  {
    icon: "manage_search",
    title: "Hazard ID & Risk Assessment (HIRA)",
    desc: "Teach employees how to identify workplace hazards and assess risks effectively.",
    duration: "1 Day", price: "R1 190",
  },
  {
    icon: "emergency",
    title: "Emergency Evacuation",
    desc: "Prepare teams to respond confidently and safely during emergency situations.",
    duration: "Half Day", price: "R980",
  },
  {
    icon: "groups",
    title: "H&S Committee Training",
    desc: "Ensure committee members understand their legal duties and responsibilities.",
    duration: "1 Day", price: "R1 190",
  },
  {
    icon: "back_hand",
    title: "Manual Handling & Ergonomics",
    desc: "Reduce injuries from lifting, carrying, repetitive tasks, and poor workstation design.",
    duration: "Half Day", price: "R980",
  },
  {
    icon: "engineering",
    title: "Contractor Safety Management",
    desc: "Ensure contractors understand and comply with site-specific safety requirements.",
    duration: "1 Day", price: "R1 190",
  },
  {
    icon: "lock",
    title: "Lockout / Tagout (LOTO)",
    desc: "Protect employees from hazardous energy sources during maintenance and servicing activities.",
    duration: "Half Day", price: "R980",
  },
  {
    icon: "health_and_safety",
    title: "General OHS Awareness",
    desc: "An ideal introduction to workplace safety principles and legal requirements.",
    duration: "1 Day", price: "R1 190",
  },
];

const allCourses = [
  { duration: "1 Day",    name: "SHE Representative",                                price: "R1 190" },
  { duration: "1 Day",    name: "First Aid Level 1",                                 price: "R1 190" },
  { duration: "Half Day", name: "Basic Fire Fighting",                               price: "R980"   },
  { duration: "1 Day",    name: "Hazardous Identification & Risk Assessment (HIRA)", price: "R1 190" },
  { duration: "Half Day", name: "Hand Tools",                                        price: "R980"   },
  { duration: "Half Day", name: "Power Hand Tools",                                  price: "R980"   },
  { duration: "1 Day",    name: "Scaffold Erect",                                    price: "R1 190" },
  { duration: "1 Day",    name: "Scaffold Inspect",                                  price: "R1 190" },
  { duration: "Half Day", name: "Flagmen",                                           price: "R980"   },
  { duration: "Half Day", name: "Stacking and Storage",                              price: "R980"   },
  { duration: "1 Day",    name: "Hazardous Material Handling (HCS)",                 price: "R1 190" },
  { duration: "1 Day",    name: "Confined Spaces",                                   price: "R1 190" },
  { duration: "1 Day",    name: "Construction Regulation",                           price: "R1 190" },
  { duration: "1 Day",    name: "Incident & Accident Investigation",                 price: "R1 190" },
  { duration: "1 Day",    name: "Legal Liability",                                   price: "R1 190" },
  { duration: "Half Day", name: "Safety Supervisor",                                 price: "R980"   },
  { duration: "1 Day",    name: "Working at Heights",                                price: "R1 190" },
  { duration: "1 Day",    name: "OHS Act",                                           price: "R1 190" },
  { duration: "1 Day",    name: "Fall Protection Planner",                           price: "R1 190" },
  { duration: "5 Days",   name: "Forklift (Novice / Beginner)",                     price: "R4 110" },
  { duration: "1 Day",    name: "Forklift Refresher",                                price: "R1 950" },
];

const howItWorks = [
  { title: "Choose your courses",        desc: "Select from 21 available courses based on your team's roles and legal obligations." },
  { title: "We come to you",             desc: "A qualified RFC H&S facilitator travels to your site — travelling costs charged per km plus tollgates." },
  { title: "On-site facilitation",       desc: "Training is delivered using real examples relevant to your facility, equipment, and processes." },
  { title: "Assessment & certificates",  desc: "Delegates are assessed on the day. Certificates are issued to all who successfully complete the course." },
];

export default function HealthSafetyCoursesPage() {
  useScrollReveal();

  return (
    <main className="pt-24 min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#1a1a1e] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80)" }}>
          <div className="absolute inset-0 bg-[#1a1a1e]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1e]/85 via-[#1a1a1e]/50 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-block bg-white rounded-lg px-4 py-2.5 mb-6 reveal shadow-sm border border-white/10">
            <img src="/Health_and_safety.png" alt="Health & Safety" className="h-16 w-auto object-contain" />
          </div>
          <p className="label text-white/40 mb-4 reveal">Health &amp; Safety</p>
          <h1 className="heading-lg text-white max-w-3xl mb-4 reveal">
            Occupational Health &amp; Safety Consulting &amp; Training
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-2xl mb-10 reveal">
            RFC provides comprehensive OHS Consulting Services and on-site Training Programs to help South African businesses comply with the Occupational Health and Safety Act (Act 85 of 1993) — protecting your people and your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 reveal">
            <button
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors"
            >
              <span className="material-icon text-[16px]">shield</span>
              Our OHS Services
            </button>
            <button
              onClick={() => document.getElementById("training")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/15 text-white/80 text-sm font-medium hover:bg-white/5 hover:border-white/25 transition-all"
            >
              <span className="material-icon text-[16px]">school</span>
              Training Programs
            </button>
          </div>
        </div>
      </section>

      {/* ── CONSULTING INTRO ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <p className="label mb-4 reveal">OHS Consulting &amp; Compliance</p>
              <h2 className="heading-md mb-6 reveal">Protecting Your People. Protecting Your Business.</h2>
              <p className="text-[15px] text-[#4a4a4e] leading-relaxed mb-4 reveal">
                At RFC Food Safety Consulting, we do more than food safety. We provide comprehensive Occupational Health &amp; Safety (OHS) Consulting Services to help businesses comply with the requirements of the Occupational Health and Safety Act (Act 85 of 1993) and all applicable South African Regulations.
              </p>
              <p className="text-[15px] text-[#4a4a4e] leading-relaxed mb-4 reveal">
                Our experienced consultants assist organisations in creating safe working environments, reducing workplace incidents, ensuring legal compliance, and preparing for inspections by regulatory authorities.
              </p>
              <p className="text-[15px] text-[#4a4a4e] leading-relaxed mb-8 reveal">
                Whether you operate in manufacturing, food processing, agriculture, warehousing, logistics, retail, hospitality, or any other industry, RFC can help you build and maintain an effective OHS Management System.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors reveal"
              >
                <span className="material-icon text-[16px]">mail</span>
                Discuss Your OHS Requirements
              </Link>
            </div>
            <div>
              <p className="text-[12px] text-[#888] uppercase tracking-widest font-semibold mb-5 reveal">Industries we serve</p>
              <div className="grid grid-cols-1 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
                {ohsIndustries.map((item, i) => (
                  <div key={i} className={`bg-white px-5 py-4 flex items-center gap-4 reveal reveal-delay-${(i % 4) + 1}`}>
                    <span className="material-icon text-[#4A7C2F] text-[20px] shrink-0">{item.icon}</span>
                    <span className="text-[14px] font-medium text-[#1a1a1e]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OHS SERVICES ─────────────────────────────────────────────────── */}
      <section id="services" className="py-16 md:py-24 bg-[#f8f8f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">Our Services</p>
          <h2 className="heading-md max-w-xl mb-12 reveal">Occupational Health &amp; Safety Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {ohsServices.map((service, i) => (
              <div key={i} className={`bg-[#f8f8f7] p-6 md:p-8 reveal reveal-delay-${(i % 4) + 1}`}>
                <span className="material-icon text-[#4A7C2F] text-[28px] mb-4 block">{service.icon}</span>
                <h3 className="text-sm font-semibold text-[#1a1a1e] mb-2">{service.title}</h3>
                <p className="text-[15px] text-[#4a4a4e] leading-relaxed mb-3">{service.desc}</p>
                {service.bullets.length > 0 && (
                  <ul className="space-y-1.5">
                    {service.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-2 text-[14px] text-[#4a4a4e]">
                        <span className="material-icon text-[#4A7C2F] text-[14px] mt-0.5 shrink-0">arrow_right</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPT OF LABOUR ───────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#1a1a1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <p className="label text-white/40 mb-4 reveal">Regulatory Compliance</p>
              <h2 className="heading-md text-white mb-6 reveal">Department of Employment and Labour Inspection Support</h2>
              <p className="text-white/60 text-[15px] leading-relaxed mb-4 reveal">
                Facing a Department of Employment and Labour inspection? RFC provides professional assistance before, during, and after inspections to ensure your business is prepared and compliant.
              </p>
              <p className="text-white/60 text-[15px] leading-relaxed reveal">
                We work alongside your team to ensure inspections are managed professionally and efficiently.
              </p>
            </div>
            <div>
              <p className="text-[12px] text-white/40 uppercase tracking-widest font-semibold mb-6 reveal">Our support includes:</p>
              <div className="grid gap-3">
                {labourInspectionItems.map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 reveal reveal-delay-${(i % 4) + 1}`}>
                    <span className="material-icon text-[#4A7C2F] text-[20px] shrink-0 mt-0.5">check_circle</span>
                    <span className="text-white/80 text-[15px] leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE RFC ───────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">Why RFC</p>
          <h2 className="heading-md max-w-xl mb-12 reveal">Why Choose RFC for Your OHS Needs?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {whyChooseItems.map((item, i) => (
              <div key={i} className={`bg-white p-6 flex items-start gap-3 reveal reveal-delay-${(i % 4) + 1}`}>
                <span className="material-icon text-[#4A7C2F] text-[22px] shrink-0 mt-0.5">{item.icon}</span>
                <span className="text-[14px] font-medium text-[#1a1a1e] leading-snug">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRAINING DIVIDER ─────────────────────────────────────────────── */}
      <div id="training" className="bg-[#4A7C2F] py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-white/60 text-[12px] uppercase tracking-widest font-semibold mb-1">OHS Training Programs</p>
            <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight">Accredited &amp; Workplace-Based Training</h2>
          </div>
          <button
            onClick={() => document.getElementById("price-table")?.scrollIntoView({ behavior: "smooth" })}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1a1a1e] text-sm font-semibold hover:bg-[#f0f0f0] transition-colors"
          >
            <span className="material-icon text-[16px]">list</span>
            View All 21 Courses &amp; Prices
          </button>
        </div>
      </div>

      {/* ── TRAINING INTRO ───────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#f8f8f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[15px] text-[#4a4a4e] leading-relaxed max-w-2xl mb-14 reveal">
            RFC offers accredited and non-accredited Occupational Health &amp; Safety training programs delivered on-site at your facility — using real examples relevant to your equipment, processes, and workplace hazards.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {trainingCourses.map((course, i) => (
              <div key={i} className={`bg-[#f8f8f7] p-6 md:p-7 reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="material-icon text-[#4A7C2F] text-[24px]">{course.icon}</span>
                  <div className="text-right shrink-0">
                    <span className="block text-[11px] text-[#888] uppercase tracking-wider">{course.duration}</span>
                    <span className="block text-[13px] font-bold text-[#4A7C2F]">{course.price}</span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-[#1a1a1e] mb-1.5">{course.title}</h3>
                <p className="text-[13px] text-[#4a4a4e] leading-relaxed">{course.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW ON-SITE TRAINING WORKS ───────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 mb-12 reveal">
            <div className="lg:col-span-5">
              <p className="label mb-4">How It Works</p>
              <h2 className="heading-md">On-Site Training, Step by Step</h2>
            </div>
            <div className="lg:col-span-7 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1760963301666-582b92218a19?auto=format&fit=crop&w=1000&q=80"
                alt="Health and safety professionals in hard hats on site"
                className="w-full aspect-[16/7] object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {howItWorks.map((step, i) => (
              <div key={i} className={`bg-white p-6 md:p-8 reveal reveal-delay-${(i % 4) + 1}`}>
                <span className="text-[12px] text-[#ccc] font-medium block mb-3">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-sm font-semibold text-[#1a1a1e] mb-2">{step.title}</h3>
                <p className="text-[15px] text-[#4a4a4e] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL COURSE PRICE TABLE ──────────────────────────────────────── */}
      <section id="price-table" className="py-16 md:py-24 bg-[#f8f8f7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">Courses &amp; Pricing</p>
          <h2 className="heading-md max-w-lg mb-12 reveal">Complete Course List</h2>

          <div className="hidden sm:grid grid-cols-[120px_1fr_130px] gap-px bg-[#4A7C2F] border border-[#4A7C2F] mb-px reveal">
            <div className="bg-[#4A7C2F] px-5 py-3">
              <span className="text-[12px] font-semibold text-white uppercase tracking-widest">Duration</span>
            </div>
            <div className="bg-[#4A7C2F] px-5 py-3">
              <span className="text-[12px] font-semibold text-white uppercase tracking-widest">Course</span>
            </div>
            <div className="bg-[#4A7C2F] px-5 py-3 text-right">
              <span className="text-[12px] font-semibold text-white uppercase tracking-widest">Price / learner</span>
            </div>
          </div>

          <div className="flex flex-col gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {allCourses.map((c, i) => (
              <div key={i} className={`bg-white grid sm:grid-cols-[120px_1fr_130px] gap-px reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="bg-white px-5 py-4 flex items-center">
                  <span className="text-[12px] font-semibold text-[#4A7C2F] uppercase tracking-wider sm:tracking-normal sm:text-sm sm:font-medium sm:text-[#4a4a4e] whitespace-nowrap">
                    {c.duration}
                  </span>
                </div>
                <div className="bg-white px-5 py-4 flex items-center">
                  <span className="text-sm font-semibold text-[#1a1a1e] uppercase tracking-wide leading-snug">{c.name}</span>
                </div>
                <div className="bg-white px-5 py-4 flex items-center sm:justify-end">
                  <span className="text-sm font-bold text-[#4A7C2F]">{c.price}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[13px] text-[#888] reveal">
            * On-site training only — travelling charged per km + tollgates. Prices are per learner and exclude VAT.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#4A7C2F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Build a Safer Workplace Today</h3>
            <p className="text-white/70 text-[15px]">
              Whether you need legal compliance, risk assessments, audits, training, or a complete OHS Management System — RFC is your trusted compliance partner.
            </p>
          </div>
          <Link
            to="/book"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1a1a1e] text-sm font-semibold hover:bg-[#f0f0f0] transition-colors"
          >
            <span className="material-icon text-[16px]">calendar_month</span>
            Book a Consultation
          </Link>
        </div>
      </section>

    </main>
  );
}
