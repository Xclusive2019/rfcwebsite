import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { usePublicSettings } from "../hooks/usePublicSettings";

// ── Level styling (mirrors a Basic → Expert progression) ──────────────────
type Level = "basic" | "intermediate" | "advanced" | "expert";
const levelStyles: Record<Level, { label: string; cls: string }> = {
  basic:        { label: "Basic · L1–2",      cls: "bg-[#4A7C2F]/10 text-[#4A7C2F] border-[#4A7C2F]/30" },
  intermediate: { label: "Intermediate · L3", cls: "bg-[#0d7a6e]/10 text-[#0d7a6e] border-[#0d7a6e]/30" },
  advanced:     { label: "Advanced · L4",     cls: "bg-[#1d4e89]/10 text-[#1d4e89] border-[#1d4e89]/30" },
  expert:       { label: "Expert · L5",       cls: "bg-[#8B1A1A]/10 text-[#8B1A1A] border-[#8B1A1A]/30" },
};

// ── Delivery method metadata ──────────────────────────────────────────────
type Delivery = "online" | "virtual" | "classroom";
const deliveryMeta: Record<Delivery, { icon: string; label: string }> = {
  online:    { icon: "laptop_mac", label: "Online Self-Paced" },
  virtual:   { icon: "videocam",   label: "Virtual" },
  classroom: { icon: "groups",     label: "In-Person" },
};

type Course = {
  code: string;
  title: string;
  desc: string;
  level: Level;
  duration: string;
  delivery: Delivery[];
  online?: boolean; // available on RFC Academy (rfcademy.co.za)
  accredited?: boolean;
};

type Category = {
  id: string;
  label: string;
  badge?: string;
  heading: string;
  description: string;
  courses: Course[];
};

const categories: Category[] = [
  {
    id: "r638",
    label: "R638 Regulation",
    badge: "SAATCA Accredited",
    heading: "R638 Food Safety Regulation Courses",
    description:
      "SAATCA-accredited training on the Regulations Governing General Hygiene Requirements for Food Premises, the Transport of Food and Related Matters (R638). Certificates are nationally recognised.",
    courses: [
      { code: "R6-01", title: "R638 Basic Food Handler",     desc: "Foundational food safety for all food-handling staff — personal hygiene, contamination control and legal duties under R638.", level: "basic",        duration: "1 Day",  delivery: ["online", "virtual", "classroom"], online: true, accredited: true },
      { code: "R6-02", title: "R638 Food Safety Supervisor", desc: "For team leaders monitoring compliance on the floor — HACCP basics, record-keeping and corrective actions.", level: "intermediate", duration: "2 Days", delivery: ["virtual", "classroom"],            accredited: true },
      { code: "R6-03", title: "R638 Food Safety Manager",    desc: "Advanced course covering full regulatory requirements, audit readiness, documentation systems and supplier control.", level: "advanced",     duration: "3 Days", delivery: ["virtual", "classroom"],            accredited: true },
    ],
  },
  {
    id: "gmp",
    label: "Basic Food Safety & GMP",
    heading: "Basic Food Safety & Good Manufacturing Practices",
    description:
      "Core courses covering food safety fundamentals and Good Manufacturing Practices — ideal for onboarding, refresher training and floor-level compliance.",
    courses: [
      { code: "FS-01", title: "Basic Food Safety & GMP",            desc: "The fundamentals of food safety, hygiene, cross-contamination prevention and good manufacturing practices for food handlers.", level: "basic",        duration: "1 Day", delivery: ["online", "virtual", "classroom"], online: true },
      { code: "FS-02", title: "Personal Hygiene for Food Handlers", desc: "Build correct hygiene habits — handwashing, protective clothing and health reporting — to keep product safe.", level: "basic",        duration: "½ Day", delivery: ["online", "classroom"],            online: true },
      { code: "FS-03", title: "Cleaning & Sanitation",              desc: "Effective cleaning and sanitation programmes, chemical safety and validation of cleaning in food environments.", level: "basic",        duration: "1 Day", delivery: ["online", "virtual", "classroom"], online: true },
      { code: "FS-04", title: "Allergen Awareness",                 desc: "Identify, manage and communicate food allergens — labelling, segregation and cleaning to prevent cross-contact.", level: "basic",        duration: "1 Day", delivery: ["online", "virtual", "classroom"], online: true },
      { code: "FS-05", title: "TACCP & VACCP (Food Defence & Food Fraud)", desc: "Protect your supply chain from intentional adulteration and fraud through threat and vulnerability assessment.", level: "intermediate", duration: "1 Day", delivery: ["virtual", "classroom"] },
      { code: "FS-06", title: "Food Safety Culture",               desc: "Build a proactive food safety culture through leadership, behaviour change and measuring culture maturity.", level: "intermediate", duration: "1 Day", delivery: ["virtual", "classroom"] },
      { code: "FS-07", title: "Food Safety for Maintenance & Utility Workers", desc: "Food safety essentials for maintenance and utility teams working in and around production areas.", level: "basic", duration: "1 Day", delivery: ["virtual", "classroom"] },
      { code: "FS-08", title: "Cold Chain Requirements",           desc: "Maintain temperature control and integrity across storage and distribution to keep perishable product safe.", level: "intermediate", duration: "1 Day", delivery: ["virtual", "classroom"] },
    ],
  },
  {
    id: "haccp",
    label: "HACCP",
    heading: "HACCP Implementation & Management",
    description:
      "Hazard Analysis and Critical Control Points (HACCP) training — from awareness through implementation to internal verification.",
    courses: [
      { code: "HC-01", title: "Introduction to HACCP",     desc: "Understand the 7 HACCP principles and the prerequisite programmes that form the basis of a food safety system.", level: "basic",        duration: "1 Day",  delivery: ["online", "virtual", "classroom"], online: true },
      { code: "HC-02", title: "HACCP for Supervisors",     desc: "Equip supervisors to monitor critical control points, take corrective action and maintain HACCP records.", level: "intermediate", duration: "1 Day",  delivery: ["virtual", "classroom"] },
      { code: "HC-03", title: "HACCP Implementation",      desc: "Practical, team-based course on conducting a hazard analysis and building a compliant HACCP plan for your process.", level: "intermediate", duration: "2 Days", delivery: ["virtual", "classroom"] },
      { code: "HC-04", title: "HACCP Internal Auditor",    desc: "Verify and validate HACCP systems, conduct gap analyses and raise non-conformance reports with confidence.", level: "advanced",     duration: "2 Days", delivery: ["virtual", "classroom"] },
    ],
  },
  {
    id: "iso22000",
    label: "ISO 22000",
    heading: "ISO 22000 Food Safety Management",
    description:
      "Training aligned with ISO 22000:2018 and the ISO 22002 prerequisite programme standards for food safety management across the entire chain.",
    courses: [
      { code: "ISO-01", title: "ISO 22000:2018 Awareness",                 desc: "Introduction to the structure, requirements and benefits of ISO 22000:2018 for everyone involved in food safety.", level: "basic",        duration: "1 Day",  delivery: ["online", "virtual", "classroom"], online: true },
      { code: "ISO-02", title: "ISO 22000 Implementation",                 desc: "Step-by-step guidance on building and implementing an ISO 22000-compliant management system from the ground up.", level: "intermediate", duration: "3 Days", delivery: ["virtual", "classroom"] },
      { code: "ISO-03", title: "ISO 22002-1:2025 (Prerequisite Programmes)", desc: "Implement the prerequisite programmes for food manufacturing required to support an ISO 22000 / FSSC system.", level: "intermediate", duration: "1 Day", delivery: ["virtual", "classroom"] },
      { code: "ISO-04", title: "ISO 22000 Internal Auditor",               desc: "Plan, conduct, report and follow up on internal audits of an ISO 22000:2018 food safety management system.", level: "advanced",     duration: "3 Days", delivery: ["virtual", "classroom"] },
      { code: "ISO-05", title: "ISO 22000 Lead Auditor",                   desc: "Advanced auditor training to lead full management-system audits to ISO 22000 against accreditation criteria.", level: "expert",       duration: "5 Days", delivery: ["classroom"] },
    ],
  },
  {
    id: "fssc22000",
    label: "FSSC 22000",
    heading: "FSSC 22000 Certification Training",
    description:
      "Prepare your team for FSSC 22000 — a GFSI-benchmarked scheme recognised by major global retailers and food manufacturers. Includes v6 and v7 transition training.",
    courses: [
      { code: "FSSC-01", title: "FSSC 22000 Foundation",        desc: "Overview of the FSSC 22000 scheme, its additional requirements and how it builds on ISO 22000 and sector PRPs.", level: "basic",        duration: "1 Day",  delivery: ["online", "virtual", "classroom"], online: true },
      { code: "FSSC-02", title: "FSSC V6 Implementation",       desc: "Implement FSSC 22000 version 6 requirements and prepare your site for third-party certification audits.", level: "intermediate", duration: "2 Days", delivery: ["virtual", "classroom"] },
      { code: "FSSC-03", title: "FSSC V7 Implementation",       desc: "Implement the latest FSSC 22000 version 7 requirements across your food safety management system.", level: "intermediate", duration: "2 Days", delivery: ["virtual", "classroom"] },
      { code: "FSSC-04", title: "FSSC V7 Transition Training",  desc: "Understand what's new in version 7 and how to transition your existing FSSC 22000 system efficiently.", level: "intermediate", duration: "1 Day",  delivery: ["online", "virtual"], online: true },
      { code: "FSSC-05", title: "FSSC 22000 Internal Auditor",  desc: "Audit an FSSC 22000 system including the additional FSSC requirements, and report findings effectively.", level: "advanced",     duration: "2 Days", delivery: ["virtual", "classroom"] },
    ],
  },
  {
    id: "brcgs",
    label: "BRCGS",
    heading: "BRCGS Global Standard Training",
    description:
      "Training for the BRCGS Global Standard for Food Safety (Issue 9) — covering awareness, implementation and internal auditing.",
    courses: [
      { code: "BRC-01", title: "BRCGS Issue 9 Awareness",    desc: "Understand the structure and requirements of the BRCGS Global Standard for Food Safety, Issue 9.", level: "basic",        duration: "1 Day",  delivery: ["online", "virtual", "classroom"], online: true },
      { code: "BRC-02", title: "BRCGS V9 Implementation",    desc: "Build and implement a BRCGS Issue 9 compliant system and prepare your site for a successful audit.", level: "intermediate", duration: "3 Days", delivery: ["virtual", "classroom"] },
      { code: "BRC-03", title: "BRCGS Internal Auditor",     desc: "Develop the skills to plan and conduct internal audits against the BRCGS Global Standard.", level: "advanced",     duration: "2 Days", delivery: ["virtual", "classroom"] },
    ],
  },
  {
    id: "globalgap",
    label: "GLOBALG.A.P.",
    heading: "GLOBALG.A.P. Courses",
    description:
      "GLOBALG.A.P. training for agricultural operations, plant production and export-aligned supply chains in South Africa.",
    courses: [
      { code: "GG-01", title: "GLOBALG.A.P. Awareness",             desc: "Introduction to GLOBALG.A.P. certification and its role in safe, sustainable, export-ready production.", level: "basic",        duration: "1 Day",  delivery: ["online", "virtual", "classroom"], online: true },
      { code: "GG-02", title: "GLOBALG.A.P. v6 IFA Implementation", desc: "Implement the Integrated Farm Assurance (IFA) v6 standard for crops and prepare for certification.", level: "intermediate", duration: "2 Days", delivery: ["virtual", "classroom"] },
      { code: "GG-03", title: "GLOBALG.A.P. Internal Inspector",    desc: "Train internal inspectors to verify GLOBALG.A.P. compliance and maintain certification readiness.", level: "advanced",     duration: "2 Days", delivery: ["classroom"] },
      { code: "GG-04", title: "GRASP Module",                       desc: "Implement the GLOBALG.A.P. Risk Assessment on Social Practice (GRASP) add-on for worker welfare.", level: "intermediate", duration: "1 Day",  delivery: ["virtual", "classroom"] },
    ],
  },
  {
    id: "microbiology",
    label: "Food Microbiology",
    heading: "Food Microbiology",
    description:
      "Understand the micro-organisms that affect food safety and how to monitor and control them in your environment.",
    courses: [
      { code: "MB-01", title: "Food Microbiology Basics",          desc: "The key micro-organisms behind spoilage and foodborne illness, and how growth is controlled in food.", level: "basic",        duration: "1 Day", delivery: ["online", "virtual"], online: true },
      { code: "MB-02", title: "Environmental Monitoring Programmes", desc: "Design and run an environmental monitoring programme to detect and control pathogens in your facility.", level: "intermediate", duration: "1 Day", delivery: ["virtual", "classroom"] },
    ],
  },
  {
    id: "social",
    label: "Social & Ethical",
    heading: "Social & Ethical Compliance Training",
    description:
      "Training for social, ethical and cold-chain compliance schemes required by retailers and export markets.",
    courses: [
      { code: "SC-01", title: "SIZA Social Training",                desc: "Meet the SIZA social standard requirements for ethical labour practices across your operation.", level: "intermediate", duration: "1–2 Days", delivery: ["virtual", "classroom"] },
      { code: "SC-02", title: "SIZA Social / Cold Chain Requirements", desc: "Combined session covering SIZA social compliance and cold-chain controls for export supply chains.", level: "intermediate", duration: "1 Day", delivery: ["virtual", "classroom"] },
    ],
  },
  {
    id: "other",
    label: "Other Training",
    heading: "Other Food Safety & Quality Training",
    description:
      "Specialist and skills-based courses that strengthen your food safety and quality management system.",
    courses: [
      { code: "OT-01", title: "Internal Auditors Training",          desc: "Two-day course building the core skills to plan, conduct and report internal audits of any FSMS.", level: "intermediate", duration: "2 Days", delivery: ["online", "virtual", "classroom"], online: true },
      { code: "OT-02", title: "Root Cause Analysis",                 desc: "Use structured tools to find the true root cause of non-conformances and put lasting fixes in place.", level: "intermediate", duration: "1 Day",  delivery: ["virtual", "classroom"] },
      { code: "OT-03", title: "Pest Control Awareness",              desc: "Recognise pest activity, understand integrated pest management and protect your premises from infestation.", level: "basic",        duration: "½ Day", delivery: ["online", "classroom"],            online: true },
      { code: "OT-04", title: "Labelling & Legislation (R146)",      desc: "Comply with South African food labelling regulations (R146) including claims, allergens and nutrition.", level: "intermediate", duration: "1 Day",  delivery: ["virtual", "classroom"] },
      { code: "OT-05", title: "Train-the-Trainer",                   desc: "Develop in-house trainers to deliver food safety training confidently and consistently to your teams.", level: "advanced",     duration: "2 Days", delivery: ["classroom"] },
    ],
  },
];

const whyRfc = [
  { icon: "construction",  title: "Practical & Workplace-Relevant", desc: "Courses are built around real South African food operations — not generic theory — so learning applies the moment your team is back on the floor." },
  { icon: "trending_up",   title: "Clear Level Progression",        desc: "Structured pathways from Basic (L1–2) through to Expert (L5) so individuals and teams can grow their competence over time." },
  { icon: "verified",      title: "SAATCA-Accredited R638",         desc: "As an accredited SAATCA Training Course Provider, our R638 certificates are nationally recognised and audit-ready." },
  { icon: "tune",          title: "Flexible Delivery",              desc: "Learn your way — self-paced online via RFC Academy, live virtual sessions, or in-person facilitation at your site." },
];

const deliveryOptions = [
  {
    icon: "laptop_mac",
    name: "E-Learning",
    tag: "Self-paced online",
    desc: "SAATCA-accredited online courses you complete at your own pace, anywhere in South Africa. Instant enrolment and certificates accepted across all 9 provinces.",
    action: { type: "external" as const, href: "", label: "Go to RFC Academy" },
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Person studying online with headphones",
  },
  {
    icon: "videocam",
    name: "Virtual Facilitation",
    tag: "Live online sessions",
    desc: "Scheduled instructor-led courses delivered live online via Teams. View the upcoming training calendar and register for a session that suits your team.",
    action: { type: "internal" as const, href: "/training/virtual", label: "View Training Calendar" },
    image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Team collaborating on laptops virtually",
  },
  {
    icon: "groups",
    name: "Classroom",
    tag: "On-site facilitation",
    desc: "A qualified RFC facilitator comes to your site and delivers the training in person to your team. Tailored to your operation — request a quotation to get started.",
    action: { type: "internal" as const, href: "/training/classroom", label: "Learn More & Enquire" },
    image: "https://images.unsplash.com/photo-1758691736067-b309ee3ef7b9?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Professional classroom training presentation",
  },
];

const faqs = [
  { q: "Are your courses accredited?", a: "Our R638 food safety regulation courses are accredited through SAATCA, where RFC is a registered Training Course Provider. Many other courses are aligned to international standards (ISO 22000, FSSC 22000, BRCGS, GLOBALG.A.P.) and issue an RFC certificate of completion." },
  { q: "Will the certificate be recognised?", a: "Yes. R638 certificates carry the authority of an officially accredited SAATCA provider and are recognised nationally. Standard-aligned course certificates demonstrate competence to your auditors and certification bodies." },
  { q: "How do the online courses work?", a: "Online self-paced courses run on the RFC Academy platform (rfcademy.co.za). You enrol instantly, learn at your own pace from any device, complete the assessment, and download your certificate immediately." },
  { q: "Can you train my whole team on-site?", a: "Absolutely. We deliver in-person facilitation at your premises using examples relevant to your equipment and processes. Request a quotation and we'll tailor the session to your operation." },
  { q: "Which course is right for my business?", a: "Use the level badges (Basic → Expert) as a guide, or talk to our training team. We'll recommend a pathway based on your roles, certification goals and regulatory requirements." },
  { q: "Do you offer training outside Gauteng?", a: "Yes — online and virtual courses are available nationwide across all 9 provinces, and on-site facilitation can be arranged countrywide (travel charged separately)." },
];

export default function TrainingHubPage() {
  useScrollReveal();
  const settings = usePublicSettings();
  const academyUrl = settings.elearning_url;

  const [activeCategory, setActiveCategory] = useState("r638");
  const [activeDelivery, setActiveDelivery] = useState<"all" | Delivery>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const options = deliveryOptions.map((o) =>
    o.icon === "laptop_mac" ? { ...o, action: { ...o.action, href: academyUrl } } : o
  );

  const activeCat = categories.find((c) => c.id === activeCategory)!;

  const visibleCourses = useMemo(
    () =>
      activeDelivery === "all"
        ? activeCat.courses
        : activeCat.courses.filter((c) => c.delivery.includes(activeDelivery)),
    [activeCat, activeDelivery]
  );

  return (
    <main className="pt-24 min-h-screen bg-white">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#1a1a1e] py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80)" }}>
          <div className="absolute inset-0 bg-[#1a1a1e]/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1e]/80 via-[#1a1a1e]/40 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex-1">
            <p className="label text-white/40 mb-4 reveal">Food Safety Training</p>
            <h1 className="heading-lg text-white max-w-2xl mb-6 reveal">Food Safety &amp; Quality Training for Every Level</h1>
            <p className="text-white/60 text-base leading-relaxed max-w-xl reveal">
              From basic food handling to expert auditing — RFC delivers a complete catalogue of food safety courses online, virtually, or on-site, including our SAATCA-accredited R638 programme.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8 reveal">
              <a
                href={academyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors"
              >
                <span className="material-icon text-[16px]">laptop_mac</span>
                Browse Online Courses
              </a>
              <button
                onClick={() => document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/15 text-white/80 text-sm font-medium hover:bg-white/5 hover:border-white/25 transition-all"
              >
                <span className="material-icon text-[16px]">list</span>
                View Full Catalogue
              </button>
            </div>
          </div>
          <div className="shrink-0 reveal">
            <img
              src="/RFC Food (R638) - SAATCA TCP Logo - ONLINE - JPEG.jpg"
              alt="SAATCA TCP Accredited Training Provider"
              className="h-24 md:h-32 object-contain bg-white/95 rounded-lg p-3 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* ── WHY RFC TRAINING ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">Why Train With RFC</p>
          <h2 className="heading-md max-w-xl mb-12 reveal">Training Built for Real Food Operations</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {whyRfc.map((item, i) => (
              <div key={i} className={`bg-white p-6 md:p-8 reveal reveal-delay-${(i % 4) + 1}`}>
                <span className="material-icon text-[#4A7C2F] text-[28px] mb-4 block">{item.icon}</span>
                <h3 className="text-sm font-semibold text-[#1a1a1e] mb-2">{item.title}</h3>
                <p className="text-[15px] text-[#4a4a4e] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DELIVERY FORMATS ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#f8f8f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">How You Learn</p>
          <h2 className="heading-md max-w-xl mb-12 reveal">Choose Your Delivery Format</h2>
          <div className="grid md:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {options.map((opt, i) => (
              <div key={opt.name} className={`bg-white flex flex-col reveal reveal-delay-${i + 1}`}>
                <div className="overflow-hidden">
                  <img
                    src={opt.image}
                    alt={opt.imageAlt}
                    className="w-full aspect-video object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <div className="p-8 md:p-10 flex flex-col flex-1">
                  <span className="material-icon text-[#4A7C2F] text-[32px] mb-5 block">{opt.icon}</span>
                  <p className="text-[12px] font-semibold text-[#4A7C2F] uppercase tracking-widest mb-2">{opt.tag}</p>
                  <h3 className="text-xl font-semibold text-[#1a1a1e] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>{opt.name}</h3>
                  <p className="text-[15px] text-[#4a4a4e] leading-relaxed mb-8 flex-1">{opt.desc}</p>
                  {opt.action.type === "external" ? (
                    <a
                      href={opt.action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors"
                    >
                      {opt.action.label}
                      <span className="material-icon text-[15px]">open_in_new</span>
                    </a>
                  ) : (
                    <Link
                      to={opt.action.href}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors"
                    >
                      {opt.action.label}
                      <span className="material-icon text-[15px]">arrow_forward</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSE CATALOGUE ─────────────────────────────────────────────── */}
      <section id="catalogue" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 reveal">
            <p className="label text-[#4A7C2F] mb-3">Our Curriculum</p>
            <h2 className="heading-md text-[#1a1a1e] max-w-xl mb-4">Courses We Offer</h2>
            <p className="text-[15px] text-[#4a4a4e] leading-relaxed max-w-2xl">
              Browse our full catalogue by category. Each course shows its level, duration and available delivery formats. Courses marked online can be enrolled instantly on RFC Academy.
            </p>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-5 reveal">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setActiveDelivery("all"); }}
                className={`px-4 py-2 text-[13px] font-semibold rounded-full border transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#1a1a1e] text-white border-[#1a1a1e]"
                    : "bg-white text-[#4a4a4e] border-[#d0d0d0] hover:border-[#4A7C2F] hover:text-[#4A7C2F]"
                }`}
              >
                {cat.label}
                {cat.badge && (
                  <span className="ml-2 text-[10px] bg-[#4A7C2F] text-white px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                    {cat.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Delivery filter */}
          <div className="flex flex-wrap items-center gap-2 mb-8 reveal">
            <span className="text-[12px] text-[#888] uppercase tracking-widest font-semibold mr-1">Filter:</span>
            {(["all", "online", "virtual", "classroom"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setActiveDelivery(d)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-full border transition-all ${
                  activeDelivery === d
                    ? "bg-[#4A7C2F] text-white border-[#4A7C2F]"
                    : "bg-white text-[#4a4a4e] border-[#d0d0d0] hover:border-[#4A7C2F]"
                }`}
              >
                {d !== "all" && <span className="material-icon text-[13px]">{deliveryMeta[d].icon}</span>}
                {d === "all" ? "All Formats" : deliveryMeta[d].label}
              </button>
            ))}
          </div>

          {/* Virtual scheduling hint */}
          {activeDelivery === "virtual" && (
            <div className="-mt-4 mb-8 flex items-center gap-2 text-[13px] text-[#4a4a4e] reveal">
              <span className="material-icon text-[16px] text-[#4A7C2F]">event</span>
              Virtual sessions run on scheduled dates —
              <Link to="/training/virtual" className="font-semibold text-[#4A7C2F] hover:underline inline-flex items-center gap-1">
                view the live training calendar <span className="material-icon text-[13px]">arrow_forward</span>
              </Link>
            </div>
          )}

          {/* Active category panel */}
          <div className="border border-[#e0e0e0] reveal">
            {/* Panel header */}
            <div className="bg-[#f8f8f7] border-b border-[#e0e0e0] px-6 md:px-10 py-6 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                {activeCat.badge && (
                  <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#4A7C2F] bg-[#4A7C2F]/10 px-3 py-1 rounded-full mb-3">
                    {activeCat.badge}
                  </span>
                )}
                <h3 className="text-xl font-semibold text-[#1a1a1e] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {activeCat.heading}
                </h3>
                <p className="text-[14px] text-[#4a4a4e] leading-relaxed max-w-2xl">{activeCat.description}</p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 bg-[#8B1A1A] text-white text-[13px] font-semibold px-3 py-1.5 rounded-full">
                  {visibleCourses.length} course{visibleCourses.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Course cards */}
            {visibleCourses.length === 0 ? (
              <div className="px-6 md:px-10 py-12 text-center text-[14px] text-[#888]">
                No {activeDelivery !== "all" ? deliveryMeta[activeDelivery as Delivery].label.toLowerCase() : ""} courses in this category. Try another filter.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e0e0e0]">
                {visibleCourses.map((course) => (
                  <div key={course.code} className="group bg-white aspect-square p-6 flex flex-col hover:bg-[#fafafa] transition-colors">
                    {/* Top: level badge + SAATCA online badge */}
                    <div className="flex items-start justify-between gap-2 mb-4 min-h-[28px]">
                      <span className={`text-[10px] font-semibold uppercase tracking-wide border px-2 py-0.5 rounded ${levelStyles[course.level].cls}`}>
                        {levelStyles[course.level].label}
                      </span>
                      {course.online && course.accredited && (
                        <img
                          src="/RFC Food (R638) - SAATCA TCP Logo - ONLINE - JPEG.jpg"
                          alt="SAATCA TCP Online Accredited"
                          className="h-11 w-auto object-contain shrink-0 -mt-1"
                        />
                      )}
                    </div>

                    {/* Code + title */}
                    <span className="text-[11px] font-mono text-[#888] tracking-wide mb-1.5">{course.code}</span>
                    <h4 className="text-[17px] font-semibold text-[#1a1a1e] leading-snug mb-2.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {course.title}
                    </h4>

                    {/* Description */}
                    <p className="text-[13px] text-[#4a4a4e] leading-relaxed line-clamp-4">{course.desc}</p>

                    {/* Delivery pills */}
                    <div className="mt-auto pt-4 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#4a4a4e] bg-[#f2f2f0] border border-[#e0e0e0] px-2 py-1 rounded-full">
                        <span className="material-icon text-[12px] text-[#888]">schedule</span>
                        {course.duration}
                      </span>
                      {course.accredited && !course.online && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#4A7C2F] bg-[#4A7C2F]/10 border border-[#4A7C2F]/20 px-2 py-1 rounded-full">
                          <span className="material-icon text-[12px]">verified</span>
                          SAATCA
                        </span>
                      )}
                      {course.delivery.map((d) => (
                        <span key={d} className="inline-flex items-center gap-1 text-[10px] font-medium text-[#4a4a4e] bg-[#f2f2f0] border border-[#e0e0e0] px-2 py-1 rounded-full">
                          <span className="material-icon text-[12px] text-[#4A7C2F]">{deliveryMeta[d].icon}</span>
                          {deliveryMeta[d].label}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-4 border-t border-[#eee]">
                      {course.online ? (
                        <a
                          href={academyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 bg-[#4A7C2F] text-white text-[13px] font-semibold hover:bg-[#3d6a27] transition-colors rounded-sm"
                        >
                          Enrol Online <span className="material-icon text-[14px]">open_in_new</span>
                        </a>
                      ) : course.delivery.includes("virtual") ? (
                        <Link
                          to="/training/virtual"
                          className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 border border-[#4A7C2F] text-[#4A7C2F] text-[13px] font-semibold hover:bg-[#4A7C2F] hover:text-white transition-colors rounded-sm"
                        >
                          View Dates <span className="material-icon text-[14px]">event</span>
                        </Link>
                      ) : (
                        <Link
                          to="/training/classroom"
                          className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 border border-[#4A7C2F] text-[#4A7C2F] text-[13px] font-semibold hover:bg-[#4A7C2F] hover:text-white transition-colors rounded-sm"
                        >
                          Request Quote <span className="material-icon text-[14px]">arrow_forward</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SAATCA ACCREDITATION ─────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[#f0f4eb] border-y border-[#d4e4c0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="reveal">
              <p className="label text-[#4A7C2F] mb-3">Accreditation</p>
              <h2 className="heading-md text-[#1a1a1e] mb-5">Accredited by SAATCA for R638 Training</h2>
              <p className="text-[15px] text-[#4a4a4e] leading-relaxed mb-5">
                RFC Food Solutions is registered with the <strong>South African Auditor and Training Certification Association (SAATCA)</strong> as an accredited Training Course Provider (TCP) for R638 food safety regulation training.
              </p>
              <p className="text-[15px] text-[#4a4a4e] leading-relaxed mb-8">
                This accreditation means that all certificates issued for our R638 courses are nationally recognised and carry the authority of an officially accredited provider — giving your business the compliance confidence it needs.
              </p>
              <a
                href="https://saatca.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors rounded-sm"
              >
                Verify our listing on SAATCA
                <span className="material-icon text-[15px]">open_in_new</span>
              </a>
            </div>

            {/* Certificate */}
            <div className="reveal reveal-delay-2 flex justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white border border-[#d4e4c0] rounded-lg p-4 shadow-sm">
                  <img
                    src="/Certificate.jpg"
                    alt="RFC SAATCA Accreditation Certificate"
                    className="w-full max-w-[280px] object-contain"
                  />
                </div>
                <p className="text-[12px] text-[#4a4a4e] font-medium text-center">Accreditation Certificate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ─────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">Questions</p>
          <h2 className="heading-md mb-12 reveal">Frequently Asked Questions</h2>
          <div className="border-t border-[#e0e0e0]">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-[#e0e0e0] reveal">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-[15px] font-semibold text-[#1a1a1e]">{faq.q}</span>
                  <span className={`material-icon text-[#4A7C2F] text-[20px] shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}>
                    expand_more
                  </span>
                </button>
                {openFaq === i && (
                  <p className="text-[14px] text-[#4a4a4e] leading-relaxed pb-5 pr-8">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ────────────────────────────────────────────────────── */}
      <section className="py-12 bg-[#4A7C2F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Not sure which course is right for your team?</h3>
            <p className="text-white/70 text-[15px]">Talk to our training team and we'll recommend a pathway for your operation.</p>
          </div>
          <Link to="/contact" className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1a1a1e] text-sm font-semibold hover:bg-[#f0f0f0] transition-colors">
            <span className="material-icon text-[16px]">mail</span>
            Talk to Our Training Team
          </Link>
        </div>
      </section>
    </main>
  );
}
