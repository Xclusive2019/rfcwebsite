import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase, extractErrorMessage } from "../lib/supabase";
import { useScrollReveal } from "../hooks/useScrollReveal";

type Answer = "yes" | "no" | "partial";
type Tier = "Excellent" | "Good" | "Needs Improvement" | "Critical";
type Domain = "food-safety" | "health-safety" | "comply-cloud";

const domainOptions: { id: Domain; icon: string; label: string; desc: string }[] = [
  { id: "food-safety", icon: "restaurant", label: "Food Safety", desc: "HACCP, R638, FSSC 22000, BRCGS, traceability & more" },
  { id: "health-safety", icon: "health_and_safety", label: "Health & Safety", desc: "OHS compliance, risk assessments, PPE, incidents & more" },
  { id: "comply-cloud", icon: "cloud_done", label: "Digital Compliance", desc: "Paperless food safety, cloud records, system readiness" },
];

const questionsByDomain: Record<Domain, { id: number; text: string; cat: string }[]> = {
  "food-safety": [
    { id: 1, text: "Do you have a documented HACCP plan covering all products and processes?", cat: "HACCP" },
    { id: 2, text: "Are all food handlers trained in basic food safety hygiene?", cat: "Training" },
    { id: 3, text: "Do you have a valid Certificate of Acceptability (COA)?", cat: "R638" },
    { id: 4, text: "Are temperature records maintained for cold and hot holding equipment?", cat: "Documentation" },
    { id: 5, text: "Do you conduct regular internal audits of your food safety system?", cat: "Audits" },
    { id: 6, text: "Is there a traceability system that tracks one step forward and back?", cat: "Traceability" },
    { id: 7, text: "Do you have a documented allergen management programme?", cat: "Allergens" },
    { id: 8, text: "Are cleaning schedules documented and verified?", cat: "Sanitation" },
    { id: 9, text: "Do you have a supplier approval and monitoring programme?", cat: "Suppliers" },
    { id: 10, text: "Is there a documented recall procedure tested at least annually?", cat: "Recall" },
  ],
  "health-safety": [
    { id: 1, text: "Do you have a documented Health & Safety Policy signed by senior management?", cat: "Policy" },
    { id: 2, text: "Are all employees trained on basic OHS legislation (OHSA 85 of 1993)?", cat: "Training" },
    { id: 3, text: "Is there a designated Safety Officer or OHS representative appointed in writing?", cat: "Governance" },
    { id: 4, text: "Are risk assessments conducted and documented for all work activities?", cat: "Risk" },
    { id: 5, text: "Is there a documented emergency evacuation plan, tested in the last 12 months?", cat: "Emergency" },
    { id: 6, text: "Are all incidents and near-misses recorded in an incident register?", cat: "Incidents" },
    { id: 7, text: "Is PPE provided, maintained and documented for all applicable roles?", cat: "PPE" },
    { id: 8, text: "Are Safety Data Sheets (SDS) available for all hazardous substances on site?", cat: "Hazardous" },
    { id: 9, text: "Is there a current first aid kit and a qualified first aider available on site?", cat: "First Aid" },
    { id: 10, text: "Do you conduct regular workplace safety inspections with documented findings?", cat: "Inspections" },
  ],
  "comply-cloud": [
    { id: 1, text: "Are your food safety records currently stored digitally (not paper-only)?", cat: "Digitisation" },
    { id: 2, text: "Can your team access compliance checklists and logs from a mobile device?", cat: "Accessibility" },
    { id: 3, text: "Do you have a centralised system to track corrective actions to closure?", cat: "Corrective Actions" },
    { id: 4, text: "Are temperature monitoring logs automatically captured or linked to a system?", cat: "Monitoring" },
    { id: 5, text: "Can you generate an audit-ready compliance report in under 10 minutes?", cat: "Reporting" },
    { id: 6, text: "Is there a system that alerts staff when tasks or verifications are overdue?", cat: "Alerts" },
    { id: 7, text: "Are cleaning and sanitation schedules completed and verified digitally?", cat: "Sanitation" },
    { id: 8, text: "Do you have a digital supplier register with approval status tracked?", cat: "Suppliers" },
    { id: 9, text: "Are training records and certificates stored in an accessible digital system?", cat: "Training Records" },
    { id: 10, text: "Has your team received onboarding or training on your current compliance software?", cat: "Adoption" },
  ],
};

const resultsByDomain: Record<Domain, (s: number) => { title: string; desc: string; color: string; bg: string; border: string; bar: string; icon: string; recs: string[] }> = {
  "food-safety": (s) => {
    if (s >= 85) return { title: "Excellent — Audit Ready", desc: "Your food safety system is well-developed. Focus on continuous improvement.", color: "text-[#2e7d32]", bg: "bg-[#e8f5e9]", border: "border-[#a5d6a7]", bar: "bg-[#4caf50]", icon: "verified", recs: ["Consider FSSC 22000 or BRCGS certification", "Implement Comply Cloud for digital compliance", "Train additional internal auditors"] };
    if (s >= 60) return { title: "Good — Minor Gaps", desc: "Solid foundation with some gaps to address before a certification audit.", color: "text-[#9e7b00]", bg: "bg-[#fff8e1]", border: "border-[#ffe082]", bar: "bg-[#ffc107]", icon: "check_circle", recs: ["Book a gap assessment with RFC", "Enrol key staff in RFC Academy courses", "Document informal procedures"] };
    if (s >= 40) return { title: "Needs Improvement", desc: "Several critical elements are missing. Professional consulting support is recommended.", color: "text-[#bf360c]", bg: "bg-[#fbe9e7]", border: "border-[#ffab91]", bar: "bg-[#ff5722]", icon: "warning", recs: ["Contact RFC for a gap assessment", "Start with R638 PIC training", "Develop a phased implementation plan"] };
    return { title: "Critical — Urgent Action", desc: "Major gaps that pose significant compliance risk. Immediate intervention needed.", color: "text-[#b71c1c]", bg: "bg-[#fdecea]", border: "border-[#ef9a9a]", bar: "bg-[#f44336]", icon: "error", recs: ["Urgently contact RFC for support", "Enrol your PIC in R638 training immediately", "Suspend high-risk operations if needed"] };
  },
  "health-safety": (s) => {
    if (s >= 85) return { title: "Excellent — OHS Compliant", desc: "Your health and safety system is well-managed. Maintain and review regularly.", color: "text-[#2e7d32]", bg: "bg-[#e8f5e9]", border: "border-[#a5d6a7]", bar: "bg-[#4caf50]", icon: "verified", recs: ["Book an independent OHS compliance audit with RFC", "Consider ISO 45001 certification", "Train additional OHS representatives"] };
    if (s >= 60) return { title: "Good — Minor Gaps", desc: "Solid OHS foundation with some gaps to address before an inspection.", color: "text-[#9e7b00]", bg: "bg-[#fff8e1]", border: "border-[#ffe082]", bar: "bg-[#ffc107]", icon: "check_circle", recs: ["Address gaps with RFC OHS consulting", "Enrol staff in RFC Academy OHS courses", "Document any informal safety procedures"] };
    if (s >= 40) return { title: "Needs Improvement", desc: "Several OHS elements are missing. Professional support is strongly recommended.", color: "text-[#bf360c]", bg: "bg-[#fbe9e7]", border: "border-[#ffab91]", bar: "bg-[#ff5722]", icon: "warning", recs: ["Contact RFC for an OHS gap assessment", "Enrol staff in OHSA compliance training", "Develop a phased OHS implementation plan"] };
    return { title: "Critical — Urgent Action", desc: "Significant OHS gaps expose your business to legal liability. Act immediately.", color: "text-[#b71c1c]", bg: "bg-[#fdecea]", border: "border-[#ef9a9a]", bar: "bg-[#f44336]", icon: "error", recs: ["Urgently contact RFC for OHS support", "Review high-risk operations immediately", "Appoint a qualified Safety Officer"] };
  },
  "comply-cloud": (s) => {
    if (s >= 85) return { title: "Digitally Ready", desc: "Your compliance processes are well-digitalised. Comply Cloud can take you further.", color: "text-[#2e7d32]", bg: "bg-[#e8f5e9]", border: "border-[#a5d6a7]", bar: "bg-[#4caf50]", icon: "verified", recs: ["Explore Comply Cloud's advanced modules", "Integrate real-time temperature monitoring", "Onboard additional sites onto one platform"] };
    if (s >= 60) return { title: "Good — Partial Digitalisation", desc: "You've made progress but manual gaps remain. Comply Cloud can close them fast.", color: "text-[#9e7b00]", bg: "bg-[#fff8e1]", border: "border-[#ffe082]", bar: "bg-[#ffc107]", icon: "check_circle", recs: ["Book a Comply Cloud demo with RFC", "Migrate paper checklists to digital forms", "Set up automated task reminders"] };
    if (s >= 40) return { title: "Needs Improvement", desc: "Heavy reliance on paper creates audit risk. Digital compliance is achievable quickly.", color: "text-[#bf360c]", bg: "bg-[#fbe9e7]", border: "border-[#ffab91]", bar: "bg-[#ff5722]", icon: "warning", recs: ["Contact RFC for a Comply Cloud walkthrough", "Start with digital checklists and logs", "Train staff on digital compliance basics"] };
    return { title: "Critical — High Audit Risk", desc: "Your current system leaves you highly exposed. A digital solution is urgently needed.", color: "text-[#b71c1c]", bg: "bg-[#fdecea]", border: "border-[#ef9a9a]", bar: "bg-[#f44336]", icon: "error", recs: ["Urgently contact RFC to implement Comply Cloud", "Stop relying on paper records for critical logs", "Book an emergency compliance review"] };
  },
};

const domainLabels: Record<Domain, string> = {
  "food-safety": "Food Safety",
  "health-safety": "Health & Safety",
  "comply-cloud": "Digital Compliance",
};

function score(answers: Record<number, Answer>) {
  let s = 0;
  Object.values(answers).forEach((a) => { if (a === "yes") s += 10; if (a === "partial") s += 5; });
  return s;
}

function tier(s: number): Tier {
  if (s >= 85) return "Excellent";
  if (s >= 60) return "Good";
  if (s >= 40) return "Needs Improvement";
  return "Critical";
}

export default function AuditQuizPage() {
  useScrollReveal();
  const [domain, setDomain] = useState<Domain | null>(null);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [showResult, setShowResult] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const questions = domain ? questionsByDomain[domain] : [];
  const currentQ = Object.keys(answers).length;
  const progress = questions.length > 0 ? (currentQ / questions.length) * 100 : 0;
  const sc = score(answers);
  const res = showResult && domain ? resultsByDomain[domain](sc) : null;

  const submitQuiz = async (finalAnswers: Record<number, Answer>, withEmail?: string) => {
    const finalScore = score(finalAnswers);
    const { data, error } = await supabase.functions.invoke("submit-quiz", {
      body: {
        answers: finalAnswers,
        score: finalScore,
        tier: tier(finalScore),
        domain: domain,
        ...(withEmail ? { email: withEmail } : {}),
      },
    });

    if (error) {
      throw new Error(await extractErrorMessage(error));
    }
    if (data && data.success === false) {
      throw new Error(data.error || "Something went wrong. Please try again.");
    }
  };

  const handleEmailResults = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSending(true);
    try {
      await submitQuiz(answers, email.trim());
      toast.success("Results sent — check your inbox.");
      setEmailSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to email your results. Please try again.");
    } finally {
      setEmailSending(false);
    }
  };

  const handleAnswer = (qId: number, a: Answer) => {
    const next = { ...answers, [qId]: a };
    setAnswers(next);
    if (Object.keys(next).length >= questions.length) {
      setShowResult(true);
      submitQuiz(next)
        .then(() => toast.success("Results saved."))
        .catch((err) =>
          toast.error(err instanceof Error ? err.message : "Failed to save your results. Please try again."),
        );
    }
  };

  const handleBack = () => {
    if (showResult) { setShowResult(false); return; }
    if (currentQ === 0) { setDomain(null); return; }
    const ids = Object.keys(answers).map(Number);
    if (ids.length > 0) { const last = ids[ids.length - 1]; const { [last]: _, ...rest } = answers; setAnswers(rest); }
  };

  if (showResult && res && domain) {
    return (
      <div className="pt-24">
        <section className="bg-[#0a0a0c] py-12 lg:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80)" }}>
            <div className="absolute inset-0 bg-[#0a0a0c]/75" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/85 via-[#0a0a0c]/50 to-transparent" />
          </div>
          <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
              <span className="material-icon text-[16px]">arrow_back</span> Home
            </Link>
            <p className="label text-white/30 mb-4">{domainLabels[domain]} · Free Assessment</p>
            <h1 className="heading-xl text-white mb-4">Your Results</h1>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className={`${res.bg} border ${res.border} p-8 lg:p-10 mb-8`}>
              <div className="flex items-center gap-4 mb-6">
                <span className={`material-icon text-[36px] ${res.color}`}>{res.icon}</span>
                <div>
                  <p className={`text-xl font-semibold ${res.color}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{res.title}</p>
                  <p className="text-[15px] text-[#999]">Score: {sc}/100</p>
                </div>
              </div>
              <p className="text-[#4a4a4e] mb-8">{res.desc}</p>
              <div className="w-full bg-white border border-[#e0e0e0] h-3 mb-8">
                <div className={`h-full ${res.bar} transition-all duration-1000`} style={{ width: `${sc}%` }} />
              </div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#999] mb-4">Recommendations</p>
              <div className="space-y-3">
                {res.recs.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/60 p-3">
                    <span className="material-icon text-[14px] text-[#4A7C2F] mt-0.5 shrink-0">check</span>
                    <span className="text-[15px] text-[#4a4a4e]">{r}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-[#e0e0e0] p-6 lg:p-8 mb-8">
              {emailSent ? (
                <div className="flex items-center gap-3 text-[#2e7d32]">
                  <span className="material-icon text-[20px]">mark_email_read</span>
                  <p className="text-[15px]">A copy of your results is on its way to {email.trim()}.</p>
                </div>
              ) : (
                <>
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-[#999] mb-2">Email my results</p>
                  <p className="text-[15px] text-[#4a4a4e] mb-4">Get your score and recommendations sent to your inbox.</p>
                  <form onSubmit={handleEmailResults} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="flex-1 px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F]"
                    />
                    <button
                      type="submit"
                      disabled={emailSending}
                      className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#1a1a1e] text-white text-sm font-semibold hover:bg-[#000] transition-colors disabled:opacity-60"
                    >
                      <span className="material-icon text-[16px]">send</span>
                      {emailSending ? "Sending…" : "Send"}
                    </button>
                  </form>
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors">
                <span className="material-icon text-[16px]">calendar_month</span> Book Consultation
              </Link>
              <button onClick={() => { setAnswers({}); setShowResult(false); setEmail(""); setEmailSent(false); setDomain(null); }} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[#e0e0e0] text-sm font-medium hover:bg-[#f8f8f7] transition-colors">
                <span className="material-icon text-[16px]">refresh</span> Start Over
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <section className="bg-[#0a0a0c] py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80)" }}>
          <div className="absolute inset-0 bg-[#0a0a0c]/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/85 via-[#0a0a0c]/50 to-transparent" />
        </div>
        <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
            <span className="material-icon text-[16px]">arrow_back</span> Home
          </Link>
          <p className="label text-white/30 mb-4">Free Assessment · 2 minutes · No sign-up</p>
          <h1 className="heading-xl text-white mb-6">Are You Compliant?</h1>
          <p className="text-white/50 max-w-lg">
            {domain
              ? `Answer 10 quick questions about your ${domainLabels[domain].toLowerCase()} system and get an instant readiness score with tailored recommendations.`
              : "Choose an area below to begin your free compliance check — 10 questions, instant results, no sign-up required."}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">

          {/* Domain selector */}
          {!domain && (
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#999] mb-6">Select your assessment area</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {domainOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setDomain(opt.id)}
                    className="p-6 border-2 border-[#eee] text-left hover:border-[#4A7C2F] hover:bg-[#f8fbf5] transition-all group"
                  >
                    <span className="material-icon text-[28px] text-[#4A7C2F] mb-4 block">{opt.icon}</span>
                    <div className="text-base font-semibold text-[#1a1a1e] mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{opt.label}</div>
                    <div className="text-[14px] text-[#999] leading-relaxed">{opt.desc}</div>
                    <div className="mt-4 flex items-center gap-1 text-[12px] font-semibold text-[#4A7C2F] opacity-0 group-hover:opacity-100 transition-opacity">
                      Start <span className="material-icon text-[12px]">arrow_forward</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quiz */}
          {domain && (
            <div>
              <div className="mb-10">
                <div className="flex justify-between text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">
                  <span>Question {currentQ + 1} of {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-[#eee] h-1">
                  <div className="h-full bg-[#4A7C2F] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {currentQ < questions.length && (
                <div>
                  <span className="text-[12px] font-bold text-[#4A7C2F] uppercase tracking-wider">{questions[currentQ].cat}</span>
                  <h2 className="text-xl lg:text-2xl text-[#1a1a1e] mt-3 mb-10 leading-snug" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                    {questions[currentQ].text}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(["yes", "partial", "no"] as Answer[]).map((ans) => (
                      <button key={ans} onClick={() => handleAnswer(questions[currentQ].id, ans)}
                        className={`p-6 border-2 text-left transition-all hover:border-[#4A7C2F] ${answers[questions[currentQ].id] === ans ? (ans === "yes" ? "border-[#4caf50] bg-[#e8f5e9]" : ans === "partial" ? "border-[#ffc107] bg-[#fff8e1]" : "border-[#f44336] bg-[#fdecea]") : "border-[#eee]"}`}>
                        <span className="material-icon text-[20px] mb-2 block">
                          {ans === "yes" ? "check_circle" : ans === "partial" ? "remove_circle" : "cancel"}
                        </span>
                        <div className={`text-lg font-semibold mb-1 capitalize ${ans === "yes" ? "text-[#2e7d32]" : ans === "partial" ? "text-[#9e7b00]" : "text-[#c62828]"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {ans === "partial" ? "Partially" : ans}
                        </div>
                        <div className="text-[13px] text-[#999]">
                          {ans === "yes" ? "Fully implemented" : ans === "partial" ? "Some elements" : "Not implemented"}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button onClick={handleBack} className="mt-8 text-[15px] text-[#999] hover:text-[#666] flex items-center gap-1.5 transition-colors">
                    <span className="material-icon text-[14px]">arrow_back</span> Back
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
