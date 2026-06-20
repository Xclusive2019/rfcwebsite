import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

const steps = [
  { icon: "event_available", title: "You choose the course & dates", desc: "Tell us which course your team needs and when. We work around your operational schedule." },
  { icon: "person_pin_circle", title: "A facilitator comes to your site", desc: "A qualified RFC facilitator travels to your premises — no need to send staff off-site or lose production time." },
  { icon: "co_present", title: "Training delivered on-site", desc: "Hands-on, in-person facilitation tailored to your facility, products, and processes, using real examples from your operation." },
  { icon: "workspace_premium", title: "Assessment & certification", desc: "Delegates are assessed and issued SAATCA-accredited certificates recognised across all 9 provinces." },
];

const benefits = [
  "Train your whole team at once",
  "No travel or downtime for staff",
  "Content tailored to your facility",
  "Real examples from your operation",
  "Flexible scheduling around production",
  "Cost-effective for groups",
];

export default function ClassroomTrainingPage() {
  useScrollReveal();
  return (
    <main className="pt-24 min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#1a1a1e] py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80)" }}>
          <div className="absolute inset-0 bg-[#1a1a1e]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1e]/85 via-[#1a1a1e]/45 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/training" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
            <span className="material-icon text-[16px]">arrow_back</span> All training options
          </Link>
          <p className="label text-white/40 mb-4 reveal">Classroom — On-Site</p>
          <h1 className="heading-lg text-white max-w-2xl mb-6 reveal">We Bring the Training to You</h1>
          <p className="text-white/60 text-base leading-relaxed max-w-xl mb-8 reveal">
            A qualified RFC facilitator comes to your site and delivers the training in person to your team — tailored to your operation. Request a quotation and we'll build a programme around your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 reveal">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors">
              <span className="material-icon text-[16px]">request_quote</span>
              Enquire Now
            </Link>
            <Link to="/training/virtual" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/15 text-white/80 text-sm font-medium hover:bg-white/5 hover:border-white/25 transition-all">
              See Virtual Sessions
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-[#f8f8f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">How It Works</p>
          <h2 className="heading-md max-w-lg mb-12 reveal">On-Site Facilitation, Step by Step</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {steps.map((s, i) => (
              <div key={i} className={`bg-[#f8f8f7] p-6 md:p-8 reveal reveal-delay-${(i % 4) + 1}`}>
                <span className="material-icon text-[#4A7C2F] text-[26px] mb-4 block">{s.icon}</span>
                <span className="text-[12px] text-[#ccc] font-medium">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-sm font-semibold text-[#1a1a1e] mt-1 mb-2">{s.title}</h3>
                <p className="text-[15px] text-[#4a4a4e] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">Why On-Site</p>
          <h2 className="heading-md max-w-lg mb-12 reveal">Benefits of Classroom Training</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b, i) => (
              <div key={i} className={`flex items-center gap-3 p-4 border border-[#e8e8e8] reveal reveal-delay-${(i % 3) + 1}`}>
                <span className="material-icon text-[#4A7C2F] text-[18px] shrink-0">check</span>
                <span className="text-sm font-medium text-[#1a1a1e]">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#4A7C2F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Ready to train your team on-site?</h3>
            <p className="text-white/70 text-[15px]">Send us your requirements and we'll prepare a tailored quotation.</p>
          </div>
          <Link to="/contact" className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1a1a1e] text-sm font-semibold hover:bg-[#f0f0f0] transition-colors">
            <span className="material-icon text-[16px]">request_quote</span>
            Request a Quotation
          </Link>
        </div>
      </section>
    </main>
  );
}
