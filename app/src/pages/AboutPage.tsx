import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
import CountUp from "../components/CountUp";

const aboutImages = [
  { src: "/About/488845067_1246443390815052_1796137431506123538_n.jpg", alt: "RFC team at work" },
  { src: "/About/489303032_1246434014149323_6054333950648451515_n.jpg", alt: "RFC food safety consulting" },
  { src: "/About/489757982_1247009954091729_2859317504629776677_n.jpg", alt: "RFC professional team" },
  { src: "/About/Comply cloud being used.jpg", alt: "Comply Cloud being used" },
  { src: "/About/Comply cloud.jpg", alt: "Comply Cloud" },
  { src: "/About/Da rocha.jpg", alt: "Da Rocha" },
  { src: "/About/Expo 2.jpg", alt: "Expo" },
  { src: "/About/Expo.jpg", alt: "Expo" },
  { src: "/About/Farm.jpg", alt: "Farm" },
  { src: "/About/man on tractor.jpg", alt: "Man on tractor" },
  { src: "/About/Man on tree.jpg", alt: "Man on tree" },
  { src: "/About/Presentation.jpg", alt: "Presentation" },
  { src: "/About/Screen.jpg", alt: "Screen" },
  { src: "/About/Training group.jpg", alt: "Training group" },
  { src: "/About/Training onsite.jpg", alt: "Training onsite" },
];

const stats = [
  { value: 2013, suffix: "", label: "Established", noFormat: true },
  { value: 10, suffix: "+", label: "Standards Covered" },
  { value: 9, suffix: "", label: "Provinces Served" },
  { value: 100, suffix: "%", label: "Certified" },
];

const values = [
  {
    icon: "verified_user",
    title: "Integrity",
    desc: "We build every client relationship on honesty and accountability — doing what is right, even when no one is watching.",
  },
  {
    icon: "handshake",
    title: "Trust",
    desc: "Our clients rely on us to protect their brands. We earn that trust through consistent, dependable, expert support.",
  },
  {
    icon: "visibility",
    title: "Transparency",
    desc: "Clear advice, honest assessments and no surprises. We keep you informed at every stage of your compliance journey.",
  },
  {
    icon: "favorite",
    title: "Passion",
    desc: "Food safety is more than a service to us — it is a genuine passion that drives the quality of everything we deliver.",
  },
];

const team = [
  {
    name: "Retha Faul",
    role: "Director & Founder",
    photo: "/team/retha-faul1.jpg",
    bio: "Lead auditor in FSSC, HACCP and ISO 22000, and a consultant in FSSC, BRCGS, HACCP and GLOBALG.A.P. A GLOBALG.A.P. registered trainer with over 18 years of food industry experience and specialist expertise in food and beverage management.",
  },
  {
    name: "Lindie van Deventer",
    role: "Administrator & Training Coordinator",
    photo: "/team/lindie-van-deventer.jpg",
    bio: "Coordinates our training programmes and administration, keeping courses, schedules and clients running smoothly across the country.",
  },
  {
    name: "Annie Hemphill",
    role: "Food Safety Management Consultant",
    photo: "/team/annie-hemphill.jpg",
    bio: "Consults on FSSC, FSA, GLOBALG.A.P, BRCGS and SIZA. “Food safety is truly a passion of mine and I find it remarkably rewarding.”",
  },
  {
    name: "Carien Jacobs",
    role: "Training Assistant",
    photo: "/team/carien-jacobs.jpg",
    bio: "Brings 35 years of food industry experience to supporting and delivering our training programmes.",
  },
  {
    name: "Tanino Febbraio",
    role: "Food Safety Consultant",
    photo: "/team/tanino-febbraio.jpg",
    bio: "Consultant in BRC, FSSC, FSA, SIZA and GLOBALG.A.P, and internal auditor in FSA, FSSC, BRC and GLOBALG.A.P. An EDT training practitioner and online systems developer.",
  },
  {
    name: "Lou-Mari Coetzee",
    role: "Food Safety Consultant & Internal Auditor",
    photo: "/team/lou-mari-coetzee.jpg",
    bio: "Internal auditor in FSSC 22000, FSA, YUM, SQMS and GLOBALG.A.P.",
  },
  {
    name: "Frances Oliver",
    role: "Food Safety Consultant",
    photo: "/team/frances-oliver.jpg",
    bio: "Develops and implements Food Safety Management Systems (FSSC 22000, SANS 10330, Intertek FSA) and conducts audits and assessments, specialising in multiple FSSC 22000 categories including production, transport, storage and packaging materials.",
  },
  {
    name: "Michael Jay-Vos",
    role: "Food Scientist & Legal Professional",
    photo: "/team/WhatsApp Image 2026-06-19 at 16.37.20.jpeg",
    bio: "Passionate food scientist and legal professional with expertise spanning food safety, regulatory compliance and intellectual property. Holds BSc & BSc Hons (Food Science) and LLB degrees, with leadership in technical management and food safety systems (FSSC 22000, ISO 22000, YUM!, IBL, SQMS).",
  },
];

export default function AboutPage() {
  useScrollReveal();
  return (
    <main className="pt-24 min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#1a1a1e] py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=80)" }}>
          <div className="absolute inset-0 bg-[#1a1a1e]/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1e]/80 via-[#1a1a1e]/40 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="label text-white/50 mb-4 reveal">About RFC</p>
          <h1 className="heading-lg text-white max-w-3xl reveal">
            Retha Faul Food Safety Consultants
          </h1>
          <p className="mt-6 text-white/60 text-base max-w-2xl leading-relaxed reveal">
            Founded in 2013 in Pretoria, RFC is a leading independent food safety
            consulting company in South Africa. We deliver tailored HACCP, ISO 22000,
            GLOBALG.A.P. and retailer-specific solutions that protect brands and drive
            food safety excellence.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 reveal">
            <Link to="/book" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors">
              <span className="material-icon text-[16px]">calendar_today</span>
              Book a Consultation
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16 bg-white border-b border-[#eee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((s) => (
              <div key={s.label} className="reveal">
                <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#1a1a1e] tracking-tight">
                  {s.noFormat ? s.value : <CountUp end={s.value} suffix={s.suffix} />}
                </p>
                <p className="text-[12px] uppercase tracking-[0.2em] text-[#999] mt-2 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story / Mission */}
      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden bg-[#1a1a1e]">
        {/* Background image marquee */}
        <div className="absolute inset-0 flex flex-col gap-3 opacity-40">
          {/* Row 1 - left to right */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="animate-marquee h-full items-center gap-3">
              {[...aboutImages, ...aboutImages].map((img, i) => (
                <div key={`r1-${i}`} className="h-full shrink-0">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-auto max-w-none object-cover rounded-sm"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Row 2 - right to left */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="animate-marquee-reverse h-full items-center gap-3">
              {[...aboutImages.slice().reverse(), ...aboutImages.slice().reverse()].map((img, i) => (
                <div key={`r2-${i}`} className="h-full shrink-0">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-auto max-w-none object-cover rounded-sm"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Row 3 - left to right, slower */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="animate-marquee h-full items-center gap-3" style={{ animationDuration: '95s' }}>
              {[...aboutImages.slice(5), ...aboutImages.slice(0, 5), ...aboutImages.slice(5), ...aboutImages.slice(0, 5)].map((img, i) => (
                <div key={`r3-${i}`} className="h-full shrink-0">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-auto max-w-none object-cover rounded-sm"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1e]/35 via-[#1a1a1e]/20 to-[#1a1a1e]/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(26,26,30,0.1)_0%,_rgba(26,26,30,0.3)_100%)]" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="label text-[#7bc45a] mb-4 reveal">Our Story</p>
          <h2 className="heading-md text-white mb-10 reveal">
            A passion for food safety
          </h2>
          <div className="space-y-6 reveal">
            <p className="text-[17px] md:text-[18px] text-white/80 leading-relaxed">
              Since 2013, RFC has grown into a trusted partner for producers, packhouses,
              processors and retailers across South Africa. Our mission is to provide
              efficient, competitive, realistic and cost-effective support and solutions
              to every client we work with.
            </p>
            <p className="text-[17px] md:text-[18px] text-white/80 leading-relaxed">
              We optimise operational efficiency and maximise our clients&rsquo; potential,
              equipping them with current legislative knowledge and competitive strategies.
              Above all, we are driven by a genuine passion for food safety and a commitment
              to supporting small businesses on their journey to compliance.
            </p>
            <p className="text-[17px] md:text-[18px] text-white/80 leading-relaxed">
              Everything we do is built on integrity, trust and transparency — combined with
              deep expertise, personal service and lasting client relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">What We Stand For</p>
          <h2 className="heading-md max-w-lg mb-12 reveal">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {values.map((v, i) => (
              <div key={v.title} className={`bg-white p-6 md:p-8 reveal reveal-delay-${(i % 4) + 1}`}>
                <span className="material-icon text-[#4A7C2F] text-[24px] mb-4 block">{v.icon}</span>
                <h3 className="text-base font-semibold text-[#1a1a1e] mb-2">{v.title}</h3>
                <p className="text-[15px] text-[#4a4a4e] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 md:py-24 bg-[#f8f8f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label mb-4 reveal">The RFC Comply Team</p>
          <h2 className="heading-md max-w-lg mb-4 reveal">Meet the Team</h2>
          <p className="text-body max-w-2xl mb-12 reveal">
            Experienced auditors, consultants and trainers dedicated to keeping your
            business compliant and your customers safe.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {team.map((member, i) => (
              <div key={member.name} className={`bg-white p-6 md:p-8 reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="aspect-square w-full overflow-hidden bg-[#eee] mb-5">
                  <img
                    src={member.photo}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="text-base font-semibold text-[#1a1a1e]">{member.name}</h3>
                <p className="text-[13px] uppercase tracking-[0.12em] text-[#4A7C2F] font-medium mt-1 mb-3">
                  {member.role}
                </p>
                <p className="text-[15px] text-[#4a4a4e] leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#4A7C2F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Work with a team that cares about your compliance</h3>
            <p className="text-white/60 text-[15px]">Book a free consultation and let us assess your path to certification.</p>
          </div>
          <Link to="/book" className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1a1a1e] text-sm font-semibold hover:bg-[#f0f0f0] transition-colors">
            <span className="material-icon text-[16px]">arrow_forward</span>
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}
