
const stories = [
  {
    client: "National Dairy Processor",
    industry: "Food Manufacturing",
    challenge: "Facing repeated non-conformances during FSSC 22000 surveillance audits, risking loss of major retail contracts.",
    result: "Passed Stage 2 audit with zero major non-conformances on the first attempt after RFC's gap assessment and remediation programme.",
    metric: "Zero",
    metricLabel: "Major Non-Conformances",
    service: "FSSC 22000 Consulting",
    image: "https://images.unsplash.com/photo-1651525670114-2b8117390b28?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Workers in a food processing facility",
  },
  {
    client: "Multi-Province Retail Chain",
    industry: "Retail",
    challenge: "Needed to train 200+ staff across 15 locations to meet R638 requirements without disrupting daily operations.",
    result: "All staff completed SAATCA-accredited online training. Certificates accepted by every municipality. Zero operational downtime.",
    metric: "200+",
    metricLabel: "Staff Trained Online",
    service: "RFC Academy",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Retail grocery store aisle",
  },
  {
    client: "Bakery & Confectionery",
    industry: "Hospitality",
    challenge: "Manual paper-based compliance records caused 3-week audit preparation cycles and frequent documentation gaps.",
    result: "Implemented Comply Cloud, reducing audit preparation to 2 days. Full real-time visibility across all compliance metrics.",
    metric: "90%",
    metricLabel: "Faster Audit Prep",
    service: "Comply Cloud",
    image: "https://images.unsplash.com/photo-1711672284661-bd70e38f31b2?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Bakery filled with baked goods and confectionery",
  },
];

export default function ImpactSection() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 md:mb-14 reveal">
          <div>
            <p className="label mb-4">Impact</p>
            <h2 className="heading-lg max-w-lg">Real Results for South African Food Businesses</h2>
          </div>
          <a
            href="https://www.linkedin.com/in/retha-faul-b04a2678/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-2 text-[#4A7C2F] text-[13px] font-semibold hover:underline"
          >
            View All Case Studies
            <span className="material-icon text-[14px]">arrow_forward</span>
          </a>
        </div>

        <div className="space-y-px bg-[#e0e0e0]">
          {stories.map((story, i) => (
            <div
              key={story.client}
              className={`bg-white p-5 md:p-8 lg:p-10 reveal reveal-delay-${i + 1}`}
            >
              <div className="grid lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12">
                {/* Left — context */}
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#999]">
                      {story.industry}
                    </span>
                    <span className="w-1 h-1 bg-[#ddd] rounded-full" />
                    <span className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#4A7C2F]">
                      {story.service}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-[#1a1a1e] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {story.client}
                  </h3>
                  <p className="text-[15px] text-[#4a4a4e] leading-relaxed mb-4">
                    <strong className="text-[#1a1a1e]">Challenge:</strong> {story.challenge}
                  </p>
                  <p className="text-[15px] text-[#4a4a4e] leading-relaxed">
                    <strong className="text-[#1a1a1e]">Result:</strong> {story.result}
                  </p>
                </div>

                {/* Right — metric with image background */}
                <div className="lg:col-span-7 flex items-center">
                  <div className="relative w-full overflow-hidden min-h-[160px] flex items-end">
                    <img
                      src={story.image}
                      alt={story.imageAlt}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1e]/90 via-[#1a1a1e]/40 to-transparent" />
                    <div className="relative z-10 p-5 md:p-8 lg:p-10 w-full flex items-end justify-between">
                      <div>
                        <p className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight">
                          {story.metric}
                        </p>
                        <p className="text-[13px] uppercase tracking-[0.15em] text-white/60 font-medium mt-2">
                          {story.metricLabel}
                        </p>
                      </div>
                      <span className="material-icon text-[32px] md:text-[48px] text-white/30 hidden sm:block">trending_up</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
