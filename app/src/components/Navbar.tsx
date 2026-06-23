import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Facebook, Instagram, Linkedin } from "lucide-react";

type NavLink = {
  label: string;
  href?: string;
  external?: boolean;
  children?: { label: string; href: string; external?: boolean }[];
};

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    children: [
      { label: "Food Safety Management System Development", href: "/services/fsms-development" },
      { label: "Internal and Pre-Audit Assessments", href: "/services/internal-audits" },
      { label: "Retail and Food Service Assessments", href: "/services/retail-assessments" },
      { label: "Labelling, Product Audits and Development", href: "/services/labelling-product-audits" },
      { label: "Training", href: "/training" },
      { label: "Comply Cloud", href: "/comply-cloud" },
      { label: "Health & Safety", href: "/training/health-safety" },
    ],
  },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const closeServices = (delay = 140) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), delay);
  };

  useEffect(() => {
    if (!servicesOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [servicesOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !scrolled;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent text-white"
            : "bg-white/95 backdrop-blur-sm border-b border-[#e8e8e8] text-[#1a1a1e]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center shrink-0">
              <img
                src="/RFC_logo-removebg-preview.png"
                alt="RFC Food Safety Consulting"
                className="h-20 w-auto"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    ref={servicesRef}
                    className="relative"
                    onMouseEnter={openServices}
                    onMouseLeave={() => closeServices()}
                  >
                    <button
                      onClick={() => setServicesOpen((open) => !open)}
                      aria-expanded={servicesOpen}
                      aria-haspopup="true"
                      className={`flex items-center gap-1 px-3 py-2 text-[14px] font-medium transition-colors ${
                        isTransparent ? "text-white hover:text-white/80" : "text-[#1a1a1e] hover:text-[#4A7C2F]"
                      }`}
                    >
                      {link.label}
                      <span className={`material-icon text-[14px] transition-transform ${servicesOpen ? "rotate-180" : ""}`}>expand_more</span>
                    </button>
                    {servicesOpen && (
                      <div className="absolute top-full left-0 pt-2 w-80 z-50">
                      <div className="bg-white border border-[#e8e8e8] shadow-lg py-1.5">
                        {link.children.map((child) =>
                          child.external ? (
                            <a
                              key={child.label}
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setServicesOpen(false)}
                              className="flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium text-[#1a1a1e] hover:text-[#4A7C2F] hover:bg-[#f8f8f7] transition-colors"
                            >
                              {child.label}
                              <span className="material-icon text-[14px] text-[#bbb]">open_in_new</span>
                            </a>
                          ) : (
                            <Link
                              key={child.label}
                              to={child.href}
                              onClick={() => setServicesOpen(false)}
                              className="block px-4 py-2.5 text-[14px] font-medium text-[#1a1a1e] hover:text-[#4A7C2F] hover:bg-[#f8f8f7] transition-colors"
                            >
                              {child.label}
                            </Link>
                          )
                        )}
                      </div>
                      </div>
                    )}
                  </div>
                ) : link.href ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`px-3 py-2 text-[14px] font-medium transition-colors ${
                      isTransparent ? "text-white hover:text-white/80" : "text-[#1a1a1e] hover:text-[#4A7C2F]"
                    } ${location.pathname === link.href && !isTransparent ? "text-[#4A7C2F]" : ""}`}
                  >
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 mr-1">
                <a href="https://www.facebook.com/rethafaulconsulting" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className={`transition-colors ${isTransparent ? "text-white/60 hover:text-white" : "text-[#999] hover:text-[#4A7C2F]"}`}>
                  <Facebook size={16} />
                </a>
                <a href="https://www.instagram.com/rfc_foodsafetyconsulting/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className={`transition-colors ${isTransparent ? "text-white/60 hover:text-white" : "text-[#999] hover:text-[#4A7C2F]"}`}>
                  <Instagram size={16} />
                </a>
                <a href="https://www.linkedin.com/in/retha-faul-b04a2678/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className={`transition-colors ${isTransparent ? "text-white/60 hover:text-white" : "text-[#999] hover:text-[#4A7C2F]"}`}>
                  <Linkedin size={16} />
                </a>
              </div>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 transition-colors ${isTransparent ? "text-white" : "text-[#1a1a1e]"}`}
                aria-label="Toggle menu"
              >
                <span className="material-icon text-[22px]">{mobileOpen ? "close" : "menu"}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden fixed top-20 left-0 right-0 z-40 bg-white border-t border-[#e8e8e8] shadow-xl">
          <div className="px-5 py-5 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="py-2">
                  <span className="block text-[12px] font-semibold text-[#999] uppercase tracking-[0.15em] mb-2 px-1">
                    {link.label}
                  </span>
                  <div className="space-y-0.5">
                    {link.children.map((child) =>
                      child.external ? (
                        <a
                          key={child.label}
                          href={child.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-3 py-3 text-[14px] font-medium text-[#1a1a1e] hover:text-[#4A7C2F] hover:bg-[#f8f8f7] rounded-md transition-colors"
                        >
                          {child.label}
                          <span className="material-icon text-[14px] text-[#bbb] ml-auto">open_in_new</span>
                        </a>
                      ) : (
                        <Link
                          key={child.label}
                          to={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-3 text-[14px] font-medium text-[#1a1a1e] hover:text-[#4A7C2F] hover:bg-[#f8f8f7] rounded-md transition-colors"
                        >
                          {child.label}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              ) : link.href ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-3 text-[14px] font-medium rounded-md transition-colors ${
                    location.pathname === link.href
                      ? "text-[#4A7C2F] bg-[#f8f8f7]"
                      : "text-[#1a1a1e] hover:text-[#4A7C2F] hover:bg-[#f8f8f7]"
                  }`}
                >
                  {link.label}
                </Link>
              ) : null
            )}
          </div>
        </div>
      )}
    </>
  );
}
