import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { supabase, extractErrorMessage } from "../lib/supabase";

const services = [
  "Food Safety Consulting (FSSC 22000, HACCP, R638)",
  "RFC Academy (Training & Certification)",
  "Comply Cloud (Software Demo)",
  "Health & Safety (OHS Consulting & Training)",
  "Pest Control Solutions",
  "Internal / Supplier Audits",
  "General Enquiry",
];

const contactMethods = [
  { label: "Phone", value: "+27 83 415 0748", href: "tel:+27834150748", icon: "phone" },
  { label: "Email", value: "info@rfcsa.co.za", href: "mailto:info@rfcsa.co.za", icon: "mail" },
  { label: "WhatsApp", value: "+27 83 415 0748", href: "https://wa.me/27834150748", icon: "chat" },
  { label: "Hours", value: "Mon-Fri, 08:00-17:00", href: null, icon: "schedule" },
];

const divisions = [
  { name: "RFC Consulting", desc: "Food safety consulting & audits", href: "#/consulting", logo: "/RFC_logo-removebg-preview.png" },
  { name: "RFC Academy", desc: "Online training & certification", href: "https://rfcacademy.co.za", ext: true, logo: "/Training_academy.png" },
  { name: "Comply Cloud", desc: "Cloud compliance software", href: "#/comply-cloud", logo: "/comply-cloud-logo-removebg-preview.png" },
  { name: "Health & Safety", desc: "OHS consulting & training", href: "#/training/health-safety", logo: "/Health_and_safety.png" },
  { name: "Pest Control Solutions", desc: "Integrated pest management", href: "https://pestcontrol-solutions.co.za", ext: true, logo: "/Pest control logo.jpeg" },
];

export default function ContactPage() {
  useScrollReveal();
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-contact", {
        body: form,
      });

      if (error) {
        throw new Error(await extractErrorMessage(error));
      }
      if (data && data.success === false) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      toast.success("Message sent — we'll contact you within 24 hours.");
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="bg-[#0a0a0c] py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1920&q=80)" }}>
          <div className="absolute inset-0 bg-[#0a0a0c]/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/80 via-[#0a0a0c]/40 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
            <span className="material-icon text-[16px]">arrow_back</span> Back to Home
          </Link>
          <p className="label text-white/30 mb-4">Get in Touch</p>
          <h1 className="heading-xl text-white max-w-2xl">Contact Us</h1>
        </div>
      </section>

      {/* Contact info bar */}
      <section className="py-10 border-b border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((m) => (
              <div key={m.label}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-icon text-[14px] text-[#999]">{m.icon}</span>
                  <p className="text-[12px] text-[#999] font-medium uppercase tracking-wider">{m.label}</p>
                </div>
                {m.href ? (
                  <a href={m.href} className="text-[15px] text-[#1a1a1e] font-medium hover:text-[#4A7C2F] transition-colors">{m.value}</a>
                ) : (
                  <p className="text-[15px] text-[#1a1a1e] font-medium">{m.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-[#f8f8f7] p-10 text-center">
                  <span className="material-icon text-[36px] text-[#4A7C2F] block mb-4">check_circle</span>
                  <h3 className="text-lg font-semibold text-[#1a1a1e] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Message Sent</h3>
                  <p className="text-[15px] text-[#999]">We will contact you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Full Name *</label>
                      <input name="name" type="text" required value={form.name} onChange={handleChange} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] transition-colors" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Email *</label>
                      <input name="email" type="email" required value={form.email} onChange={handleChange} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] transition-colors" placeholder="you@company.com" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Company</label>
                      <input name="company" type="text" value={form.company} onChange={handleChange} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] transition-colors" placeholder="Your company" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Phone</label>
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] transition-colors" placeholder="+27 XX XXX XXXX" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Service *</label>
                    <select name="service" required value={form.service} onChange={handleChange} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] cursor-pointer transition-colors bg-white">
                      <option value="">Select a service</option>
                      {services.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Message *</label>
                    <textarea name="message" required rows={5} value={form.message} onChange={handleChange} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] resize-none transition-colors" placeholder="Tell us about your food safety needs..." />
                  </div>
                  <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-8 py-4 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors disabled:opacity-50">
                    <span className="material-icon text-[16px]">send</span> {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              {/* Divisions */}
              <div className="bg-[#f8f8f7] p-8 mb-6">
                <h3 className="text-sm font-semibold text-[#1a1a1e] uppercase tracking-wider mb-6">Our Divisions</h3>
                <div className="space-y-4">
                  {divisions.map((d) => (
                    <a key={d.name} href={d.ext ? d.href : d.href.replace("#", "")} target={d.ext ? "_blank" : undefined} rel={d.ext ? "noopener noreferrer" : undefined} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 bg-white border border-[#e8e8e8] flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={d.logo} alt={d.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1a1a1e] group-hover:text-[#4A7C2F] transition-colors">
                          {d.name}
                        </p>
                        <p className="text-[14px] text-[#999]">{d.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              {/* WhatsApp CTA */}
              <a href="https://wa.me/27834150748" target="_blank" rel="noopener noreferrer" className="block bg-[#4A7C2F] p-6 text-white hover:bg-[#3d6a27] transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-icon text-[16px]">chat</span>
                  <p className="text-sm font-medium">Prefer WhatsApp?</p>
                </div>
                <p className="text-[13px] text-white/60">We typically reply within minutes</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
