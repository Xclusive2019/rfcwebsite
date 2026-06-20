import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { usePublicSettings } from "../hooks/usePublicSettings";

export default function TrainingHubPage() {
  useScrollReveal();
  const settings = usePublicSettings();

  const options = [
    {
      icon: "laptop_mac",
      name: "E-Learning",
      tag: "Self-paced online",
      desc: "SAATCA-accredited online courses you complete at your own pace, anywhere in South Africa. Instant enrolment and certificates accepted across all 9 provinces.",
      action: { type: "external" as const, href: settings.elearning_url, label: "Go to RFC Academy" },
      image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Person studying online with headphones",
    },
    {
      icon: "videocam",
      name: "Virtual Facilitation",
      tag: "Live online sessions",
      desc: "Scheduled instructor-led courses delivered live online via Teams. View the upcoming training calendar and register for a session that suits your team.",
      action: { type: "internal" as const, href: "/training/virtual", label: "View Training Calendar" },
      image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Team collaborating on laptops virtually",
    },
    {
      icon: "groups",
      name: "Classroom",
      tag: "On-site facilitation",
      desc: "A qualified RFC facilitator comes to your site and delivers the training in person to your team. Tailored to your operation — request a quotation to get started.",
      action: { type: "internal" as const, href: "/training/classroom", label: "Learn More & Enquire" },
      image: "https://images.unsplash.com/photo-1758691736067-b309ee3ef7b9?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Professional classroom training presentation",
    },
  ];

  return (
    <main className="pt-24 min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#1a1a1e] py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80)" }}>
          <div className="absolute inset-0 bg-[#1a1a1e]/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1e]/80 via-[#1a1a1e]/40 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="label text-white/40 mb-4 reveal">Food Safety Training</p>
          <h1 className="heading-lg text-white max-w-2xl mb-6 reveal">Choose How You Want to Learn</h1>
          <p className="text-white/60 text-base leading-relaxed max-w-xl reveal">
            RFC delivers SAATCA-accredited food safety training in three formats. Select the option that best fits your team and schedule.
          </p>
        </div>
      </section>

      {/* Three options */}
      <section className="py-16 md:py-24 bg-[#f8f8f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {options.map((opt, i) => (
              <div key={opt.name} className={`bg-white flex flex-col reveal reveal-delay-${i + 1}`}>
                <div className="overflow-hidden">
                  <img
                    src={opt.image}
                    alt={opt.imageAlt}
                    className="w-full aspect-video object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div className="p-8 md:p-10 flex flex-col flex-1">
                <span className="material-icon text-[#4A7C2F] text-[32px] mb-5 block">{opt.icon}</span>
                <p className="text-[12px] font-semibold text-[#4A7C2F] uppercase tracking-widest mb-2">{opt.tag}</p>
                <h2 className="text-xl font-semibold text-[#1a1a1e] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>{opt.name}</h2>
                <p className="text-[15px] text-[#4a4a4e] leading-relaxed mb-8 flex-1">{opt.desc}</p>
                {opt.action.type === "external" ? (
                  <a
                    href={opt.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors"
                  >
                    {opt.action.label}
                    <span className="material-icon text-[15px]">open_in_new</span>
                  </a>
                ) : (
                  <Link
                    to={opt.action.href}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors"
                  >
                    {opt.action.label}
                    <span className="material-icon text-[15px]">arrow_forward</span>
                  </Link>
                )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help strip */}
      <section className="py-12 bg-white border-t border-[#eee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[15px] text-[#4a4a4e]">Not sure which format is right for your team?</p>
          <Link to="/contact" className="inline-flex items-center gap-2 text-[#4A7C2F] text-sm font-semibold hover:underline">
            Talk to our training team <span className="material-icon text-[15px]">arrow_forward</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
