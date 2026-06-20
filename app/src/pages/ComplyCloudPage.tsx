import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

const features = [
  { icon: "check_box", title: "Digital Checklists", desc: "Convert any paper-based system into mobile-friendly digital forms with photo capture and instant submission." },
  { icon: "dashboard", title: "Real-Time Dashboards", desc: "Live compliance dashboards with real-time trend generation — see your compliance status at a glance." },
  { icon: "notifications_active", title: "Automated Alerts", desc: "Ad-hoc or scheduled tasks with automated SMS and email alerts. Checklists can also trigger non-conformance and deviation notifications." },
  { icon: "smartphone", title: "Any Device, No Download", desc: "Android, Apple, and Windows compatible. Works in Chrome on any smartphone or tablet — a checklist can be opened on more than one device simultaneously." },
  { icon: "lock", title: "Tamper-Evident Records", desc: "Audit-ready records stored securely on Google Cloud Platform with full traceability and security breach monitoring." },
  { icon: "integration_instructions", title: "API Integration", desc: "Integrates with existing systems via the API builder. Supports calculations, reporting, and infinite organisation and staff structures." },
];

const faqs = [
  {
    q: "Is the system flexible by means of expanding and or integrating?",
    a: "The system is flexible — it is capable of doing what is needed depending on your requirements. We sit together to discuss exactly what you want out of the system, then approach the programmers to discuss it together.",
  },
  {
    q: "Will staff be allowed to open a checklist on more than one device at a time?",
    a: "Yes, a checklist is allowed to be opened on more than one device at the same time. Users can complete any checklist on a web-enabled smartphone or tablet using the Chrome browser.",
  },
  {
    q: "Is there a trigger function — email, SMS, other?",
    a: "Yes. When a checklist is designed it can trigger SMS, email, non-conformance, deviations, and more, based on the responses captured.",
  },
  {
    q: "Can the system generate reports from checks done on checklists?",
    a: "Yes. The system is able to generate reports and do trending as required, giving you full visibility of compliance performance over time.",
  },
  {
    q: "Is the system cloud or server based?",
    a: "All information is stored on Google Cloud Platform — currently Europe West 1C (Belgium), considered one of the best hosting providers for security and data privacy. Each customer database is a separate instance.",
  },
  {
    q: "Do you provide training?",
    a: "Yes. Training is free of charge for the first 3 months, provided the trainee is dedicated to the task. Additional training is charged at R450 per hour. Travel and accommodation costs are for the customer's account and will be quoted in advance.",
  },
  {
    q: "How long will implementation take?",
    a: "3 months, provided dedicated support is available from your side throughout the process.",
  },
  {
    q: "Is this an offline solution?",
    a: "No. Comply Cloud is a compliance software — not an offline solution. An active internet connection is required at all times.",
  },
];

const benefits = [
  "80% faster audit preparation",
  "Enhanced data security",
  "Improved accessibility across teams",
  "Complete traceability",
  "Instant access to data",
  "Easier to maintain than paper systems",
  "Real-time trend generation",
  "User friendly — minimal training required",
];

const techSpecs = [
  { label: "Cloud Infrastructure", value: "Google Cloud Platform — Europe West 1C (Belgium)" },
  { label: "Compatibility", value: "Android, Apple and Windows — no download required" },
  { label: "Implementation Timeline", value: "3 months with dedicated customer support" },
  { label: "Training Included", value: "Free for the first 3 months (dedicated trainee required)" },
  { label: "Additional Training", value: "R450 per hour after the initial period" },
  { label: "Support", value: "24-hour support services provided" },
  { label: "Connectivity", value: "Web-based only — active internet connection required" },
];

export default function ComplyCloudPage() {
  useScrollReveal();
  return (
    <main className="pt-24 min-h-screen bg-white">
      {/* Hero */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080)" }}>
          <div className="absolute inset-0 bg-[#1a1a1e]/80" />
        </div>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,#4A7C2F_1px,transparent_0)] bg-[length:24px_24px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-block bg-white rounded-lg px-5 py-3 mb-6 reveal shadow-sm border border-[#e8e8e8]">
            <img src="/comply-cloud-logo-removebg-preview.png" alt="Comply Cloud" className="h-28 w-auto" />
          </div>
          <h1 className="heading-lg text-white max-w-2xl mb-6 reveal">Comply Cloud</h1>
          <p className="text-white/80 text-base leading-relaxed max-w-xl mb-4 reveal">
            A dynamic forms builder that converts any paper-based system into an online, mobile-friendly experience — allowing you to schedule and manage multi-tier organisations with precision access to every single component.
          </p>
          <p className="text-white/60 text-[15px] leading-relaxed max-w-xl mb-8 reveal">
            Whether your business is in compliance, governance, construction, or just a coffee shop wanting a QR-code menu — Comply Cloud is for everyone and integrates with any system via our API builder.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 reveal">
            <Link to="/book" className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors shadow-sm">
              <span className="material-icon text-[16px]">calendar_month</span>
              Book a Free Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Video */}
      <section className="bg-[#111114] py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label text-white/30 mb-4 text-center reveal">See It In Action</p>
          <h2 className="heading-md text-white text-center mb-8 reveal">Platform Demo</h2>
          <div className="reveal">
            <video
              src="https://clnwliztxxuwcqskcvty.supabase.co/storage/v1/object/public/media/comply-cloud-demo.mp4"
              controls
              playsInline
              className="w-full"
              poster="/comply-cloud-dashboard.jpg"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-[#f8f8f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">What It Does</p>
          <h2 className="heading-md max-w-lg mb-12 reveal">Platform Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {features.map((f, i) => (
              <div key={i} className={`bg-[#f8f8f7] p-6 md:p-8 reveal reveal-delay-${(i % 3) + 1}`}>
                <span className="material-icon text-[#4A7C2F] text-[26px] mb-4 block">{f.icon}</span>
                <h3 className="text-[15px] font-semibold text-[#1a1a1e] mb-2">{f.title}</h3>
                <p className="text-[15px] text-[#4a4a4e] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">Why Comply Cloud</p>
          <h2 className="heading-md max-w-lg mb-12 reveal">System Benefits</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((b, i) => (
              <div key={i} className={`flex items-center gap-3 p-4 border border-[#e8e8e8] reveal reveal-delay-${(i % 4) + 1}`}>
                <span className="material-icon text-[#4A7C2F] text-[18px] shrink-0">check</span>
                <span className="text-[15px] font-medium text-[#1a1a1e]">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Specs */}
      <section className="py-16 md:py-24 bg-[#f8f8f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">Technical Details</p>
          <h2 className="heading-md max-w-lg mb-12 reveal">Specifications</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {techSpecs.map((s, i) => (
              <div key={i} className={`bg-[#f8f8f7] p-6 md:p-8 reveal reveal-delay-${(i % 3) + 1}`}>
                <p className="text-[12px] text-[#999] font-medium uppercase tracking-widest mb-2">{s.label}</p>
                <p className="text-[15px] font-semibold text-[#1a1a1e]">{s.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[14px] text-[#999] reveal">
            Comply Cloud is a compliance software, not an offline solution — an active internet connection is required at all times.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">Common Questions</p>
          <h2 className="heading-md max-w-lg mb-12 reveal">Frequently Asked Questions</h2>
          <div className="divide-y divide-[#e8e8e8] border-t border-[#e8e8e8]">
            {faqs.map((faq, i) => (
              <div key={i} className={`py-6 reveal reveal-delay-${(i % 3) + 1}`}>
                <h3 className="text-[15px] font-semibold text-[#1a1a1e] mb-2">{faq.q}</h3>
                <p className="text-[15px] text-[#4a4a4e] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#4A7C2F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Ready to go paperless?</h3>
            <p className="text-white/60 text-[15px]">Book a free demo and see Comply Cloud in action for your business.</p>
          </div>
          <Link to="/book" className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1a1a1e] text-sm font-semibold hover:bg-[#f0f0f0] transition-colors">
            <span className="material-icon text-[16px]">arrow_forward</span>
            Book Free Demo
          </Link>
        </div>
      </section>
    </main>
  );
}
