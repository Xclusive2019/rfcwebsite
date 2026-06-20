const services = [
  "Cockroach control for food environments",
  "Integrated rodent management",
  "HACCP pest control programmes",
  "Environmentally responsible methods",
];

export default function PestControlSection() {
  return (
    <section id="pest-control" className="py-16 md:py-24 lg:py-32 bg-[#f8f8f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center">
          <div className="reveal">
            <img src="/pest-control.jpg" alt="Professional pest control inspection" className="w-full"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="reveal reveal-delay-1">
            <img
              src="/Pest control logo.jpeg"
              alt="PCS Pest Control Solutions logo"
              className="h-14 w-auto object-contain mb-6"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
<h2 className="heading-lg mb-6">Pest Control Solutions</h2>
            <p className="text-body leading-relaxed mb-8">
              PCS Pest Control Solutions delivers HACCP-compliant integrated pest management specifically designed for the food industry. In partnership with RFC, they provide complete pest management with paperless documentation.
            </p>
            <ul className="space-y-3 mb-10">
              {services.map((s) => (
                <li key={s} className="flex items-start gap-3 text-[14px] text-[#4a4a4e]">
                  <span className="material-icon text-[16px] text-[#4A7C2F] mt-0.5 shrink-0">check</span>
                  {s}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://pestcontrol-solutions.co.za" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#1a1a1e] text-white text-sm font-semibold hover:bg-[#333] transition-colors">
                Visit PCS Website <span className="material-icon text-[14px]">open_in_new</span>
              </a>
              <a href="tel:0762357719" className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 border border-[#ddd] text-[#1a1a1e] text-sm font-medium hover:bg-white transition-colors">
                <span className="material-icon text-[14px]">phone</span>
                076 235 7719
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
