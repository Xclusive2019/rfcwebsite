import CountUp from "../../components/CountUp";

const stats = [
  { value: 500, suffix: "+", label: "Clients" },
  { value: 12, suffix: "+", label: "Years" },
  { value: 3000, suffix: "+", label: "Learners" },
  { value: 95, suffix: "%", label: "Audit Success" },
  { value: 278, suffix: "", label: "Municipalities" },
  { value: 4, suffix: "", label: "Divisions" },
];

export default function StatsSection() {
  return (
    <section className="py-14 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rule mb-12 md:mb-16" />
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-6">
          {stats.map((s) => (
            <div key={s.label} className="reveal">
              <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#1a1a1e] tracking-tight">
                <CountUp end={s.value} suffix={s.suffix} />
              </p>
              <p className="text-[12px] uppercase tracking-[0.2em] text-[#999] mt-2 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
