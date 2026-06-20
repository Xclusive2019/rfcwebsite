const features = [
  "Digital checklists with photo capture",
  "Real-time compliance dashboards",
  "Automated alerts and notifications",
  "Mobile-first, works on any device",
  "Audit-ready, tamper-evident records",
  "80% faster audit preparation",
];

export default function ComplyCloudSection() {
  return (
    <section id="comply-cloud" className="py-14 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080)" }}>
        <div className="absolute inset-0 bg-[#1a1a1e]/80" />
      </div>
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,#4A7C2F_1px,transparent_0)] bg-[length:24px_24px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
          <div className="reveal">
            <div className="inline-block bg-white rounded-lg px-5 py-3 mb-5 shadow-md border border-[#e8e8e8]">
              <img src="/comply-cloud-logo-removebg-preview.png" alt="Comply Cloud" className="h-28 w-auto" />
            </div>
            <h2 className="heading-lg text-white mb-6">Comply Cloud</h2>
            <p className="text-white/80 leading-relaxed mb-8 font-medium">
              South Africa's first cloud-based food safety compliance management platform. Replace spreadsheets, paper checklists, and filing cabinets with one intelligent system.
            </p>
            <div className="space-y-3 mb-10">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <span className="material-icon text-[16px] text-[#5a9e3f]">check</span>
                  <span className="text-[14px] text-white/80 font-medium">{f}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#/book" className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#345e20] transition-colors shadow-md">
                <span className="material-icon text-[16px]">calendar_month</span>
                Book a Free Demo
              </a>
            </div>
          </div>
          <div className="reveal reveal-delay-2">
            <img src="/comply-cloud-dashboard.jpg" alt="Comply Cloud dashboard" className="w-full shadow-lg rounded-sm"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
