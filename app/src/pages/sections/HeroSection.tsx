import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const divisions = [
  { icon: "corporate_fare", name: "Consulting", desc: "FSSC 22000, HACCP, R638, audits", href: "/#consulting" },
  { icon: "school", name: "Academy", desc: "SAATCA-accredited online training", href: "https://rfcacademy.co.za", ext: true },
  { icon: "cloud", name: "Comply Cloud - Software", desc: "Food safety compliance software", href: "/#comply-cloud" },
  { icon: "health_and_safety", name: "Health & Safety", desc: "OHS courses, forklift, working at heights & more", href: "/training/health-safety" },
];

const capabilities = [
  "FSSC 22000",
  "HACCP",
  "R638",
  "Internal Audits",
  "BRCGS",
  "GLOBALG.A.P.",
];

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedDiv, setSelectedDiv] = useState<string | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col bg-[#0a0a0c]">
      {/* Video background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: "url(/hero-bg.jpg)" }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          poster="/hero-facility.jpg"
          onLoadedData={(e) => {
            const v = e.currentTarget;
            v.playbackRate = 0.75;
            v.style.opacity = "1";
          }}
          onError={() => {
            // Fallback background already active
          }}
        >
          <source src="/hero-video-1.mp4" type="video/mp4" />
        </video>
        {/* Multiple gradient layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/70 via-[#0a0a0c]/30 to-[#0a0a0c]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/60 via-transparent to-[#0a0a0c]/40" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-4 md:pb-6">
        <div className="flex items-end justify-between gap-8">
          <div className="max-w-4xl xl:max-w-5xl flex-1">
            {/* Label */}
            <p className="label label-dark mb-3 md:mb-4 tracking-[0.25em]">South Africa &middot; Since 2013</p>

            {/* Headline — consulting-firm massive type */}
            <h1 className="font-['DM_Serif_Display'] text-white text-[clamp(1.9rem,5vw,4.2rem)] leading-[1.05] md:leading-[1.02] mb-4 md:mb-5 tracking-[-0.02em]">
              Food Safety Consulting, Training, Paperless Solution & Health and Safety
            </h1>

            {/* Subheadline */}
            <p className="text-[15px] md:text-[16px] text-white/50 max-w-2xl leading-[1.7] mb-6 md:mb-8">
              One company, four specialised divisions. From FSSC 22000 certification and SAATCA-accredited training to cloud compliance software and integrated pest management — everything your food business needs to meet every regulation, in one partnership.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4 md:mb-6">
              <Link
                to="/book"
                className="inline-flex items-center justify-center gap-2.5 px-7 md:px-8 py-3.5 md:py-4 bg-white text-[#1a1a1e] text-[14px] font-semibold hover:bg-[#f0f0f0] transition-colors tracking-wide"
              >
                <span className="material-icon text-[16px]">calendar_month</span>
                Book a Consultation
              </Link>
            </div>

          </div>

          {/* Pest Control — aligned above H&S card */}
          <a
            href="https://pestcontrol-solutions.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex flex-col items-center gap-3 px-6 py-5 mb-4 border border-white/20 bg-black/40 backdrop-blur-sm text-white/80 hover:bg-white/10 hover:border-white/40 transition-all group shrink-0"
          >
            <img src="/Pest control logo.jpeg" alt="Pest Control" className="w-28 h-28 object-contain rounded" />
            <span className="text-[15px] font-semibold tracking-wide">Pest Control</span>
            <span className="material-icon text-[13px] text-white/40 group-hover:text-white/60 transition-colors">open_in_new</span>
          </a>
        </div>

        {/* Four Divisions — integrated into hero as interactive cards */}
        <div className="mt-auto lg:mt-0 lg:flex-1 lg:flex lg:flex-col lg:justify-end">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] overflow-visible">
            {divisions.map((div) => {
              const isSelected = selectedDiv === div.name;
              return (
              <a
                key={div.name}
                href={div.href}
                target={div.ext ? "_blank" : undefined}
                rel={div.ext ? "noopener noreferrer" : undefined}
                onClick={() => setSelectedDiv(isSelected ? null : div.name)}
                className={`group relative bg-[#0a0a0c]/40 backdrop-blur-[4px] p-6 sm:p-7 lg:py-14 lg:px-10 transition-all duration-300 border-b-2 z-10 ${
                  isSelected
                    ? "bg-white/[0.18] border-[#4A7C2F] scale-[2.0] z-20 shadow-[0_12px_50px_rgba(0,0,0,0.7)]"
                    : "border-transparent hover:bg-white/[0.12] hover:border-[#4A7C2F] hover:scale-[1.12] hover:z-20 hover:shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
                }`}
              >
                <span className={`material-icon text-[22px] md:text-[26px] lg:text-[38px] mb-3 md:mb-4 lg:mb-6 block transition-colors ${isSelected ? "text-[#7bc45a]" : "text-white/40 group-hover:text-[#7bc45a]"}`}>
                  {div.icon}
                </span>
                <div className="flex items-center gap-1.5 mb-1.5 lg:mb-2.5">
                  <h3 className={`text-[14px] md:text-[15px] lg:text-[17px] font-semibold transition-colors ${isSelected ? "text-white" : "text-white/90 group-hover:text-white"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {div.name}
                  </h3>
                  {div.ext && <span className="material-icon text-[12px] text-white/20">open_in_new</span>}
                </div>
                <p className="text-[13px] md:text-[14px] lg:text-[15px] text-white/40 leading-relaxed">{div.desc}</p>
              </a>
              );
            })}
          </div>

          {/* Pest Control — mobile/tablet only, sits below the four cards */}
          <a
            href="https://pestcontrol-solutions.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="lg:hidden flex items-center gap-3 px-4 py-3 border-t border-white/[0.06] bg-black/40 backdrop-blur-sm text-white/80 hover:bg-white/10 transition-all group"
          >
            <img src="/Pest control logo.jpeg" alt="Pest Control" className="w-9 h-9 object-contain rounded shrink-0" />
            <span className="text-[13px] font-semibold tracking-wide">Pest Control Solutions</span>
            <span className="material-icon text-[13px] text-white/40 group-hover:text-white/60 transition-colors ml-auto">open_in_new</span>
          </a>
        </div>
      </div>

      {/* Bottom capability bar — full-width marquee */}
      <div className="relative z-10 border-t border-white/[0.06] bg-[#0a0a0c]/80 overflow-hidden py-3 md:py-4">
        {/* Fade masks on edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-[#0a0a0c] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-[#0a0a0c] to-transparent" />

        <div className="animate-marquee">
          {[...capabilities, ...capabilities, ...capabilities].map((cap, i) => (
            <span key={`${cap}-${i}`} className="text-[12px] sm:text-[13px] md:text-[14px] text-white/40 font-medium whitespace-nowrap inline-flex items-center gap-2 px-4 sm:px-6 md:px-8">
              <span className="w-1.5 h-1.5 bg-[#4A7C2F] rounded-full shrink-0" />
              {cap}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
