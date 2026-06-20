import { useState } from "react";

const testimonials = [
  { quote: "RFC transformed our food safety programme. We went from constant audit anxiety to passing our FSSC 22000 certification on the first attempt. Their expertise in South African regulations is unmatched.", author: "Quality Manager", company: "Large Food Manufacturer, Gauteng", service: "FSSC 22000 Consulting" },
  { quote: "The online training platform made it possible to train all 47 of our staff members across three provinces without shutting down operations. The certificates were accepted by every municipality.", author: "Operations Director", company: "National Retail Chain", service: "RFC Academy Training" },
  { quote: "Comply Cloud has eliminated our paper-based system entirely. What used to take weeks of document gathering before an audit now takes hours. The real-time dashboards are a game changer.", author: "Technical Manager", company: "Food Processing Facility, KZN", service: "Comply Cloud Software" },
  { quote: "We have worked with multiple food safety consultants over the years, but RFC stands out for their practical approach and deep understanding of what auditors actually look for.", author: "Managing Director", company: "Bakery & Confectionery, Western Cape", service: "HACCP & R638 Compliance" },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-14 md:py-20 bg-[#1a1a1e] relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(/hero-facility.jpg)" }}>
        <div className="absolute inset-0 bg-[#1a1a1e]/70" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 md:gap-12 lg:gap-20">
          <div className="lg:col-span-4 reveal">
            <p className="label text-white/30 mb-4">Testimonials</p>
            <h2 className="heading-lg text-white mb-6">Trusted by Food Businesses Nationwide</h2>
            <div className="flex items-center gap-2">
              <button onClick={prev} className="w-10 h-10 border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors">
                <span className="material-icon text-[16px]">arrow_back</span>
              </button>
              <button onClick={next} className="w-10 h-10 border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors">
                <span className="material-icon text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="lg:col-span-8 reveal reveal-delay-1">
            <span className="material-icon text-[32px] md:text-[40px] text-white/10 block mb-4">format_quote</span>
            <blockquote className="text-lg md:text-xl lg:text-2xl text-white/95 leading-relaxed mb-8 md:mb-10" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              &ldquo;{testimonials[current].quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">{testimonials[current].author.split(" ").map(w => w[0]).join("")}</span>
              </div>
              <div>
                <p className="text-sm text-white font-medium">{testimonials[current].author}</p>
                <p className="text-[14px] text-white/40">{testimonials[current].company}</p>
              </div>
              <span className="ml-auto text-[12px] font-bold uppercase tracking-wider text-[#6aaa4f] bg-[#6aaa4f]/10 px-3 py-1.5">{testimonials[current].service}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
