import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { supabase, extractErrorMessage } from "../lib/supabase";

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const services = [
  "Food Safety Consulting (FSSC 22000, HACCP, R638)",
  "Comply Cloud Software Demo",
  "RFC Academy Training Enquiry",
  "Pest Control Solutions",
  "Internal / Supplier Audits",
  "General Enquiry",
];

function getNextDays() {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    days.push(d);
    if (days.length >= 10) break;
  }
  return days;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function BookingPage() {
  useScrollReveal();
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [service, setService] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const available = getNextDays();
  const [blockedSlots, setBlockedSlots] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase
      .from("booking_availability")
      .select("available_date, start_time")
      .eq("is_available", false)
      .then(({ data }) => {
        const keys = (data ?? []).map(
          (s: { available_date: string; start_time: string }) => `${s.available_date}-${s.start_time.slice(0, 5)}`
        );
        setBlockedSlots(new Set(keys));
      });
  }, []);

  function isSlotBlocked(d: Date, t: string) {
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return blockedSlots.has(`${dateStr}-${t}`);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !name || !email || !service) return;

    // Format the selected date as YYYY-MM-DD using local parts to avoid timezone shifts.
    const bookingDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-booking", {
        body: {
          name,
          email,
          phone,
          company,
          service,
          notes,
          bookingDate,
          bookingTime: time,
        },
      });

      if (error) {
        throw new Error(await extractErrorMessage(error));
      }
      if (data && data.success === false) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      toast.success("Booking confirmed — a confirmation has been sent to your email.");
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => { setDate(null); setTime(null); setService(""); setName(""); setEmail(""); setPhone(""); setCompany(""); setNotes(""); setSubmitted(false); };

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="bg-[#0a0a0c] py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80)" }}>
          <div className="absolute inset-0 bg-[#0a0a0c]/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/85 via-[#0a0a0c]/50 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
            <span className="material-icon text-[16px]">arrow_back</span> Back to Home
          </Link>
          <p className="label text-white/35 mb-4">Schedule a Meeting</p>
          <h1 className="heading-xl text-white max-w-xl">Book Your Free Consultation</h1>
          <p className="text-white/50 mt-4 max-w-lg">Choose a date and time that works for you. Our team will confirm within 2 hours.</p>
        </div>
      </section>

      {submitted ? (
        <section className="py-20 bg-white">
          <div className="max-w-lg mx-auto px-6 text-center">
            <div className="w-16 h-16 bg-[#e8f5e9] flex items-center justify-center mx-auto mb-6">
              <span className="material-icon text-[28px] text-[#4A7C2F]">check_circle</span>
            </div>
            <h2 className="heading-md mb-3">Booking Confirmed</h2>
            <p className="text-[#4a4a4e] mb-2">
              Your consultation is scheduled for <strong className="text-[#1a1a1e]">{date && `${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]} at ${time}`}</strong>
            </p>
            <p className="text-[15px] text-[#999] mb-8">A confirmation has been sent to {email}. Our team will call you at the scheduled time.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={reset} className="px-6 py-3 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors">Book Another</button>
              <Link to="/" className="px-6 py-3 border border-[#ddd] text-[#1a1a1e] text-sm font-medium hover:bg-[#f8f8f7] transition-colors">Back to Home</Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Left - Calendar & Form */}
              <div className="lg:col-span-3 reveal">
                {/* Date picker */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="material-icon text-[16px] text-[#4A7C2F]">calendar_month</span>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1a1a1e]">Select a Date</h2>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {available.map((d) => {
                      const sel = date?.toDateString() === d.toDateString();
                      return (
                        <button key={d.toISOString()} onClick={() => { setDate(d); setTime(null); }}
                          className={`p-3 border text-center transition-all ${sel ? "border-[#4A7C2F] bg-[#4A7C2F] text-white" : "border-[#e0e0e0] hover:border-[#4A7C2F]/40 bg-white"}`}>
                          <span className={`block text-[12px] font-medium uppercase tracking-wider ${sel ? "text-white/70" : "text-[#999]"}`}>{dayNames[d.getDay()]}</span>
                          <span className={`block text-lg font-semibold mt-0.5 ${sel ? "text-white" : "text-[#1a1a1e]"}`}>{d.getDate()}</span>
                          <span className={`block text-[12px] ${sel ? "text-white/70" : "text-[#999]"}`}>{monthNames[d.getMonth()]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time picker */}
                {date && (
                  <div className="mb-10">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="material-icon text-[16px] text-[#4A7C2F]">schedule</span>
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1a1a1e]">Select a Time</h2>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {timeSlots.map((t) => {
                        const sel = time === t;
                        const blocked = isSlotBlocked(date, t);
                        return (
                          <button key={t} onClick={() => !blocked && setTime(t)} disabled={blocked}
                            title={blocked ? "This slot is unavailable" : undefined}
                            className={`py-2.5 px-3 border text-sm font-medium transition-all ${blocked ? "border-[#e0e0e0] bg-[#f5f5f5] text-[#bbb] cursor-not-allowed line-through" : sel ? "border-[#4A7C2F] bg-[#4A7C2F] text-white" : "border-[#e0e0e0] hover:border-[#4A7C2F]/40 text-[#1a1a1e]"}`}>
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Contact form */}
                {time && (
                  <form onSubmit={handleSubmit} className="space-y-5 reveal">
                    <div className="rule mb-8" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1a1a1e] mb-5">Your Details</h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Full Name *</label>
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] transition-colors" placeholder="Your name" />
                      </div>
                      <div>
                        <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Email *</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] transition-colors" placeholder="you@company.com" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Phone *</label>
                        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] transition-colors" placeholder="+27 XX XXX XXXX" />
                      </div>
                      <div>
                        <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Company</label>
                        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] transition-colors" placeholder="Your company" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Service *</label>
                      <select required value={service} onChange={(e) => setService(e.target.value)} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] cursor-pointer transition-colors bg-white">
                        <option value="">Select a service</option>
                        {services.map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Notes (optional)</label>
                      <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] resize-none transition-colors" placeholder="Anything we should know before the call..." />
                    </div>
                    <button type="submit" disabled={submitting} className="w-full py-4 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      <span className="material-icon text-[16px]">check_circle</span> {submitting ? "Confirming..." : "Confirm Booking"}
                    </button>
                  </form>
                )}
              </div>

              {/* Right sidebar */}
              <div className="lg:col-span-2 reveal reveal-delay-1">
                <div className="bg-[#f8f8f7] p-8 sticky top-24">
                  <h3 className="text-sm font-semibold text-[#1a1a1e] uppercase tracking-wider mb-6">What to Expect</h3>
                  <div className="space-y-5">
                    {[
                      { title: "30-minute call", desc: "A focused discussion about your food safety needs and compliance goals." },
                      { title: "Gap assessment", desc: "We identify where you stand against relevant regulations and standards." },
                      { title: "Clear next steps", desc: "You leave with a tailored action plan and cost estimate — no obligation." },
                    ].map((item) => (
                      <div key={item.title} className="flex gap-4">
                        <div className="w-1 bg-[#4A7C2F] shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-[#1a1a1e] mb-1">{item.title}</p>
                          <p className="text-[14px] text-[#999] leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rule my-8" />
                  <div className="space-y-3 text-[15px]">
                    <div className="flex items-center gap-3 text-[#4a4a4e]"><span className="material-icon text-[14px] text-[#999]">phone</span> +27 83 415 0748</div>
                    <div className="flex items-center gap-3 text-[#4a4a4e]"><span className="material-icon text-[14px] text-[#999]">mail</span> info@rfcsa.co.za</div>
                    <div className="flex items-center gap-3 text-[#4a4a4e]"><span className="material-icon text-[14px] text-[#999]">schedule</span> Mon-Fri, 08:00-17:00</div>
                  </div>
                  {date && time && (
                    <div className="mt-8 p-4 bg-[#4A7C2F]/5 border border-[#4A7C2F]/20">
                      <p className="text-[12px] text-[#4A7C2F] font-semibold uppercase tracking-wider mb-1">Selected</p>
                      <p className="text-sm font-semibold text-[#1a1a1e]">{dayNames[date.getDay()]}, {date.getDate()} {monthNames[date.getMonth()]} at {time}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
