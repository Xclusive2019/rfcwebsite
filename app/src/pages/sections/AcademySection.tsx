const courses = [
  { code: "R638-PIC", title: "R638 Person in Charge", level: "Beginner", dur: "6 hours", price: "R1,600", popular: true },
  { code: "FD-FF", title: "Food Defence & Food Fraud", level: "Intermediate", dur: "5 hours", price: "R1,600" },
  { code: "FS-CULTURE", title: "Food Safety Culture", level: "Intermediate", dur: "6 hours", price: "R1,600" },
  { code: "HACCP-PRIN", title: "HACCP Principles & Implementation", level: "Intermediate", dur: "15-20 hours", price: "R1,600", isNew: true },
  { code: "ISO-IA", title: "ISO 22000 Internal Auditor", level: "Advanced", dur: "12-15 hours", price: "R1,600", isNew: true },
  { code: "GMP-SAN", title: "GMP & Sanitation", level: "Beginner", dur: "10-12 hours", price: "R1,200", isNew: true },
];

const levelBadge: Record<string, string> = {
  Beginner: "bg-[#e8f5e9] text-[#2e7d32]",
  Intermediate: "bg-[#fff8e1] text-[#9e7b00]",
  Advanced: "bg-[#fce4ec] text-[#c62828]",
};

export default function AcademySection() {
  return (
    <section id="academy" className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 md:gap-12 lg:gap-20">
          <div className="lg:col-span-4 reveal">
            <img src="/Training_academy.png" alt="RFC Academy" className="h-14 w-auto mb-5 opacity-80" />
            <p className="label mb-4">Online Training</p>
            <h2 className="heading-lg mb-6">RFC Academy</h2>
            <p className="text-body leading-relaxed mb-8">
              SAATCA-accredited food safety courses (R638). Learn at your own pace, anywhere in South Africa. All courses include certificates accepted by municipalities across all 9 provinces.
            </p>
            <a href="https://rfcacademy.co.za" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#4A7C2F] text-sm font-semibold hover:underline">
              Visit RFC Academy <span className="material-icon text-[14px]">open_in_new</span>
            </a>
            <div className="mt-8 overflow-hidden">
              <img
                src="/academy-training.jpg"
                alt="Food safety training session"
                className="w-full aspect-[4/3] object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </div>
          <div className="lg:col-span-8">
            <div className="border-t border-[#e0e0e0]">
              {courses.map((c, i) => (
                <div key={c.code} className={`flex items-center justify-between py-4 md:py-5 border-b border-[#eee] reveal reveal-delay-${(i % 3) + 1}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 mb-1 flex-wrap">
                      <h3 className="text-[15px] md:text-base font-semibold text-[#1a1a1e]">{c.title}</h3>
                      {c.popular && <span className="text-[12px] font-bold uppercase tracking-wider bg-[#4A7C2F] text-white px-2 py-0.5">Popular</span>}
                      {c.isNew && !c.popular && <span className="text-[12px] font-bold uppercase tracking-wider bg-[#1a1a1e] text-white px-2 py-0.5">New</span>}
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 text-[14px] text-[#999]">
                      <span className={`text-[13px] font-medium px-2 py-0.5 ${levelBadge[c.level]}`}>{c.level}</span>
                      <span>{c.dur}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 md:gap-6 ml-4 md:ml-6 shrink-0">
                    <span className="text-base md:text-lg font-semibold text-[#1a1a1e]">{c.price}</span>
                    <a href="https://rfcacademy.co.za" target="_blank" rel="noopener noreferrer" className="text-[14px] font-semibold text-[#4A7C2F] hover:underline hidden sm:block">Enrol</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
