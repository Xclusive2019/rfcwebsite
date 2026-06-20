const divisions = [
  { num: "01", name: "RFC Consulting", tagline: "Food safety consulting & certification", desc: "Full-service consulting for FSSC 22000, HACCP, BRCGS, GLOBALG.A.P., R638 compliance, internal audits, and supplier audits. From gap assessment to certification.", href: "#/consulting" },
  { num: "02", name: "RFC Academy", tagline: "SAATCA-accredited online training", desc: "Online food safety courses from R638 Person-in-Charge to HACCP Principles, Internal Auditor, and Food Safety Culture. Learn at your own pace, anywhere.", href: "https://rfcacademy.co.za", ext: true },
  { num: "03", name: "Comply Cloud", tagline: "Cloud compliance software", desc: "South Africa's first cloud-based food safety compliance platform. Paperless audits, real-time monitoring, automated checklists, instant reporting.", href: "#/comply-cloud" },
  { num: "04", name: "Health & Safety", tagline: "OHS courses & workplace safety", desc: "Comprehensive health and safety training including OHS compliance, forklift operation, working at heights, and more — keeping your workplace safe and legally compliant.", href: "/training/health-safety" },
];

export default function DivisionsSection() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 md:gap-12 lg:gap-20">
          <div className="lg:col-span-4 reveal">
            <p className="label mb-4">Our Ecosystem</p>
            <h2 className="heading-lg mb-6">Four Integrated Divisions</h2>
            <p className="text-body leading-relaxed mb-8">
              Unlike competitors who offer only one service, RFC provides consulting, training, software, and health & safety — a complete ecosystem for food safety compliance.
            </p>
            <div className="overflow-hidden">
              <img
                src="/facility-exterior.jpg"
                alt="RFC food safety facility"
                className="w-full aspect-[4/3] object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </div>
          <div className="lg:col-span-8">
            {divisions.map((d, i) => (
              <a key={d.num} href={d.ext ? d.href : d.href.replace("#", "")} target={d.ext ? "_blank" : undefined} rel={d.ext ? "noopener noreferrer" : undefined}
                className={`group block py-6 md:py-8 border-t border-[#e8e8e8] first:border-t-0 reveal reveal-delay-${i + 1}`}>
                <div className="flex items-start gap-4 md:gap-6 lg:gap-10">
                  <span className="text-[12px] text-[#ccc] font-medium mt-1 shrink-0 w-6">{d.num}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base md:text-lg font-semibold text-[#1a1a1e] group-hover:text-[#4A7C2F] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>{d.name}</h3>
                      {d.ext && <span className="material-icon text-[14px] text-[#ccc]">open_in_new</span>}
                    </div>
                    <p className="text-[14px] text-[#4A7C2F] font-medium mb-2">{d.tagline}</p>
                    <p className="text-body text-[14px] leading-relaxed max-w-xl">{d.desc}</p>
                  </div>
                  <span className="material-icon text-[18px] text-[#ddd] group-hover:text-[#4A7C2F] group-hover:translate-x-1 transition-all shrink-0 mt-1 hidden sm:block">arrow_forward</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
