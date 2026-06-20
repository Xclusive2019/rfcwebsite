import { useState } from "react";

const industries = [
  { name: "Food Manufacturing", desc: "Full-scale consulting for production facilities including HACCP implementation, FSSC 22000 certification, allergen management, and supplier verification." },
  { name: "Retail & Supermarkets", desc: "R638 compliance, cold chain management, shelf-life validation, and point-of-sale food safety protocols for retail environments." },
  { name: "Hospitality & Catering", desc: "Kitchen safety audits, hygiene training, event catering compliance, and restaurant certification to meet municipal health requirements." },
  { name: "Farming & Agriculture", desc: "On-farm food safety, GLOBALG.A.P. certification, harvest hygiene, and packhouse compliance for agricultural producers." },
  { name: "Export & Import", desc: "Export certification, import compliance, and international standards alignment for cross-border food trade." },
  { name: "Commercial & Healthcare", desc: "Food safety for hospitals, corporate canteens, aged care facilities, and educational institutions." },
];

export default function IndustriesSection() {
  const [active, setActive] = useState(0);
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 md:gap-12 lg:gap-20">
          <div className="lg:col-span-5 reveal">
            <p className="label mb-4">Industries We Serve</p>
            <h2 className="heading-lg mb-8 md:mb-10">Specialised Expertise for Every Food Sector</h2>
            <div className="border-t border-[#e0e0e0]">
              {industries.map((ind, i) => (
                <button key={ind.name} onClick={() => setActive(i)}
                  className={`block w-full text-left py-3.5 md:py-4 border-b border-[#eee] transition-colors ${active === i ? "text-[#1a1a1e]" : "text-[#bbb] hover:text-[#777]"}`}>
                  <span className="text-[14px] md:text-[15px] font-medium">{ind.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 flex items-center reveal reveal-delay-1">
            <div className="bg-[#f8f8f7] p-6 md:p-10 lg:p-14 w-full">
              <h3 className="heading-md mb-5 md:mb-6">{industries[active].name}</h3>
              <p className="text-body leading-relaxed">{industries[active].desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
