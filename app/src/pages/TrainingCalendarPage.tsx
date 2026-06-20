import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { usePublicSettings } from "../hooks/usePublicSettings";
import { supabase } from "../lib/supabase";

interface TrainingSession {
  id: string;
  course_code: string | null;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  price: string | null;
  register_url: string | null;
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseDate(d: string) {
  // d is YYYY-MM-DD — build a local date to avoid timezone shifts
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}

function formatRange(start: string, end: string | null) {
  const s = parseDate(start);
  if (!end || end === start) {
    return `${dayShort[s.getDay()]}, ${s.getDate()} ${monthNames[s.getMonth()].slice(0, 3)} ${s.getFullYear()}`;
  }
  const e = parseDate(end);
  if (s.getMonth() === e.getMonth()) {
    return `${s.getDate()}–${e.getDate()} ${monthNames[s.getMonth()].slice(0, 3)} ${s.getFullYear()}`;
  }
  return `${s.getDate()} ${monthNames[s.getMonth()].slice(0, 3)} – ${e.getDate()} ${monthNames[e.getMonth()].slice(0, 3)} ${e.getFullYear()}`;
}

export default function TrainingCalendarPage() {
  const settings = usePublicSettings();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  // Re-run after the async fetch so the dynamically-rendered session rows
  // (which carry the `reveal` class) actually get observed and faded in.
  useScrollReveal(0.1, [loading, sessions.length]);

  useEffect(() => {
    // Today as local YYYY-MM-DD (string compare is safe for ISO dates).
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    supabase
      .from("training_sessions")
      .select("id, course_code, title, description, start_date, end_date, price, register_url")
      .eq("is_active", true)
      // Hide past sessions: keep anything that ends today or later (or, for
      // single-day sessions with no end_date, starts today or later).
      .or(`end_date.gte.${today},start_date.gte.${today}`)
      .order("start_date", { ascending: true })
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setSessions((data as TrainingSession[]) ?? []);
        setLoading(false);
      });
  }, []);

  // Group by "Month Year"
  const groups: Record<string, TrainingSession[]> = {};
  for (const s of sessions) {
    const d = parseDate(s.start_date);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    (groups[key] ??= []).push(s);
  }

  return (
    <main className="pt-24 min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#1a1a1e] py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80)" }}>
          <div className="absolute inset-0 bg-[#1a1a1e]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1e]/85 via-[#1a1a1e]/45 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/training" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
            <span className="material-icon text-[16px]">arrow_back</span> All training options
          </Link>
          <p className="label text-white/40 mb-4 reveal">Virtual Facilitation</p>
          <h1 className="heading-lg text-white max-w-2xl mb-6 reveal">Live Online Training Calendar</h1>
          <p className="text-white/60 text-base leading-relaxed max-w-xl reveal">
            Instructor-led courses delivered live online via Microsoft Teams. Browse the upcoming schedule and register for the session that suits your team.
          </p>
        </div>
      </section>

      {/* Calendar */}
      <section className="py-16 md:py-24 bg-[#f8f8f7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-icon text-[40px] text-[#ccc] mb-4 block">event_busy</span>
              <h2 className="text-lg font-semibold text-[#1a1a1e] mb-2">No sessions scheduled right now</h2>
              <p className="text-[15px] text-[#999] mb-6">New virtual training dates are added regularly. Get in touch and we'll let you know what's coming up.</p>
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors">
                Enquire About Dates
              </Link>
            </div>
          ) : (
            Object.entries(groups).map(([month, items]) => (
              <div key={month} className="mb-12 last:mb-0">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[#4A7C2F] mb-5 reveal">{month}</h2>
                <div className="bg-white border border-[#e0e0e0]">
                  {items.map((s) => {
                    const d = parseDate(s.start_date);
                    const registerUrl = s.register_url?.trim() || settings.virtual_training_register_url;
                    return (
                      <div key={s.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 md:p-6 border-b border-[#eee] last:border-b-0 reveal">
                        {/* Date block */}
                        <div className="flex sm:flex-col items-center sm:justify-center gap-2 sm:gap-0 w-full sm:w-20 shrink-0 sm:border-r sm:border-[#eee] sm:pr-6">
                          <span className="text-2xl font-bold text-[#1a1a1e] leading-none">{d.getDate()}</span>
                          <span className="text-[12px] font-medium text-[#999] uppercase tracking-wider">{monthNames[d.getMonth()].slice(0, 3)}</span>
                        </div>
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {s.course_code && <span className="text-[12px] font-semibold text-[#999]">{s.course_code}</span>}
                            <h3 className="text-[15px] font-semibold text-[#1a1a1e]">{s.title}</h3>
                          </div>
                          {s.description && <p className="text-[15px] text-[#4a4a4e] leading-relaxed mb-1.5">{s.description}</p>}
                          <div className="flex items-center gap-4 text-[13px] text-[#999]">
                            <span className="inline-flex items-center gap-1"><span className="material-icon text-[13px]">event</span>{formatRange(s.start_date, s.end_date)}</span>
                            {s.price && <span className="inline-flex items-center gap-1"><span className="material-icon text-[13px]">sell</span>{s.price}</span>}
                          </div>
                        </div>
                        {/* Register */}
                        <div className="shrink-0">
                          <a
                            href={registerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4A7C2F] text-white text-[13px] font-semibold hover:bg-[#3d6a27] transition-colors w-full sm:w-auto"
                          >
                            Register
                            <span className="material-icon text-[14px]">open_in_new</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white border-t border-[#eee]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[15px] text-[#4a4a4e]">Need a course not listed, or prefer on-site training?</p>
          <div className="flex gap-3">
            <Link to="/training/classroom" className="inline-flex items-center gap-2 text-[#4A7C2F] text-sm font-semibold hover:underline">
              On-site option <span className="material-icon text-[15px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
