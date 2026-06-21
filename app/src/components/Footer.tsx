import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

const services = [
  { label: "Food Safety Management System Development", href: "/services/fsms-development" },
  { label: "Internal and Pre-Audit Assessments", href: "/services/internal-audits" },
  { label: "Retail and Food Service Assessments", href: "/services/retail-assessments" },
  { label: "Labelling, Product Audits and Development", href: "/services/labelling-product-audits" },
];

const divisions = [
  { label: "RFC Consulting", href: "/consulting" },
  { label: "RFC Academy", href: "https://rfcacademy.co.za", ext: true },
  { label: "Comply Cloud", href: "/comply-cloud" },
  { label: "Pest Control Solutions", href: "https://pestcontrol-solutions.co.za", ext: true },
];

const company = [
  { label: "About", href: "/" },
  { label: "Book Consultation", href: "/book" },
  { label: "Audit Readiness Quiz", href: "/audit-readiness" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const socials = [
  { icon: Facebook, href: "https://www.facebook.com/rethafaulconsulting", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/rfc_foodsafetyconsulting/", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/retha-faul-b04a2678/", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0c] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <Link to="/" onClick={() => window.scrollTo(0, 0)} className="inline-block mb-8">
                <img
                  src="/RFC_logo-removebg-preview.png"
                  alt="RFC Food Safety Consulting"
                  className="h-12 w-auto"
                />
              </Link>

              <p className="text-white/60 text-base leading-relaxed max-w-md mb-10">
                South Africa's leading food safety consulting, training and compliance platform — serving businesses across all nine provinces since 2013.
              </p>

              <div className="space-y-4">
                <a
                  href="tel:+27834150748"
                  className="flex items-center gap-4 text-sm text-white/50 hover:text-white transition-colors group"
                >
                  <Phone size={16} className="text-[#4A7C2F]" />
                  <span>083 415 0748</span>
                </a>
                <a
                  href="mailto:info@rfcsa.co.za"
                  className="flex items-center gap-4 text-sm text-white/50 hover:text-white transition-colors group"
                >
                  <Mail size={16} className="text-[#4A7C2F]" />
                  <span>info@rfcsa.co.za</span>
                </a>
                <p className="flex items-center gap-4 text-sm text-white/50">
                  <MapPin size={16} className="text-[#4A7C2F]" />
                  <span>Pretoria, Gauteng — Nationwide Coverage</span>
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                <div>
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-[0.15em] mb-6">
                    Services
                  </h4>
                  <ul className="space-y-3">
                    {services.map((s) => (
                      <li key={s.label}>
                        <Link
                          to={s.href}
                          className="text-sm text-white/60 hover:text-[#4A7C2F] transition-colors"
                        >
                          {s.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-[0.15em] mb-6">
                    Divisions
                  </h4>
                  <ul className="space-y-3">
                    {divisions.map((d) => (
                      <li key={d.label}>
                        <a
                          href={d.href}
                          target={d.ext ? "_blank" : undefined}
                          rel={d.ext ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-[#4A7C2F] transition-colors group"
                        >
                          {d.label}
                          {d.ext && <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-[0.15em] mb-6">
                    Company
                  </h4>
                  <ul className="space-y-3">
                    {company.map((c) => (
                      <li key={c.label}>
                        <Link
                          to={c.href}
                          className="text-sm text-white/60 hover:text-[#4A7C2F] transition-colors"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-icon text-[#4A7C2F] text-[20px]">fact_check</span>
            <div>
              <p className="text-sm font-semibold text-white">Are You Compliant? Take the Assessment</p>
              <p className="text-xs text-white/40">2-min quiz · instant score · no sign-up needed</p>
            </div>
          </div>
          <Link
            to="/audit-readiness"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A7C2F] text-white text-[13px] font-semibold hover:bg-[#3d6a27] transition-colors"
          >
            <span className="material-icon text-[14px]">arrow_forward</span>
            Free Assessment
          </Link>
        </div>

        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-white/30 text-center md:text-left">
              &copy; {new Date().getFullYear()} RFC Food Safety Consulting (Pty) Ltd. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-white/40 hover:text-[#4A7C2F] transition-colors"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/30">
              <Link to="/contact" className="hover:text-white/60 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/contact" className="hover:text-white/60 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
