import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-[#3d6b28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center">
          <div className="reveal">
            <h2 className="heading-lg text-white mb-6">Ready to Achieve Food Safety Compliance?</h2>
            <p className="text-white/65 leading-relaxed">
              Book a free consultation. We will assess your current compliance level and recommend the most efficient path to certification.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:justify-end reveal reveal-delay-1">
            <Link to="/book" className="inline-flex items-center justify-center gap-2.5 px-7 md:px-8 py-3.5 md:py-4 bg-white text-[#1a1a1e] text-sm font-semibold hover:bg-[#f0f0f0] transition-colors">
              <span className="material-icon text-[16px]">calendar_month</span>
              Book Free Consultation
            </Link>
            <Link to="/audit-readiness" className="inline-flex items-center justify-center gap-2.5 px-7 md:px-8 py-3.5 md:py-4 border border-white/25 text-white/90 text-sm font-medium hover:bg-white/5 hover:border-white/35 transition-all">
              <span className="material-icon text-[16px]">quiz</span>
              Take Audit Quiz
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
