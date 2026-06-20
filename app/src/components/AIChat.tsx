import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase, extractErrorMessage } from "../lib/supabase";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  options?: { label: string; action: string }[];
}

const welcome: Message = {
  id: 1,
  sender: "bot",
  text: "Hello! I'm the RFC assistant. I can help with food safety compliance questions or book a consultation. What would you like to do?",
  options: [
    { label: "Book a consultation", action: "book" },
    { label: "Learn about our services", action: "services" },
    { label: "Check audit readiness", action: "quiz" },
    { label: "Speak to a human", action: "whatsapp" },
  ],
};

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [sessionId] = useState(() => crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, typing]);
  useEffect(() => { const t = setTimeout(() => setShowTooltip(false), 6000); return () => clearTimeout(t); }, []);

  const sendToAssistant = async (history: Message[]) => {
    setTyping(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          sessionId,
          messages: history.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        },
      });

      if (error) throw new Error(await extractErrorMessage(error));
      if (data?.error) throw new Error(data.error);

      const reply = data?.message?.trim();
      if (!reply) throw new Error("No response from assistant.");

      setMessages((prev) => [...prev, { id: Date.now(), sender: "bot", text: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        sender: "bot",
        text: err instanceof Error
          ? `Sorry, something went wrong: ${err.message}. Please try again or reach us on WhatsApp at +27 83 415 0748.`
          : "Sorry, something went wrong. Please try again or reach us on WhatsApp at +27 83 415 0748.",
      }]);
    } finally {
      setTyping(false);
    }
  };

  const handleOption = (action: string) => {
    if (typing) return;
    const selected = messages[messages.length - 1]?.options?.find((o) => o.action === action);
    if (!selected) return;
    const next: Message[] = [...messages, { id: Date.now(), sender: "user", text: selected.label }];
    setMessages(next);
    void sendToAssistant(next);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || typing) return;
    const next: Message[] = [...messages, { id: Date.now(), sender: "user", text }];
    setMessages(next);
    setInput("");
    void sendToAssistant(next);
  };

  const handleQuickAction = (action: string) => {
    if (action === "book") { window.location.href = "#/book"; setOpen(false); return; }
    if (action === "quiz") { window.location.href = "#/audit-readiness"; setOpen(false); return; }
    if (action === "academy") { window.open("https://rfcacademy.co.za", "_blank"); return; }
    if (action === "whatsapp") { window.open("https://wa.me/27834150748", "_blank"); return; }
  };

  return (
    <>
      {/* Tooltip */}
      {showTooltip && !open && (
        <div className="fixed bottom-24 right-6 z-50 bg-[#1a1a1e] text-white text-xs px-4 py-2.5 shadow-xl max-w-[200px]">
          Need help? Chat with our AI assistant
          <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-[#1a1a1e] rotate-45" />
        </div>
      )}

      {/* Toggle button */}
      <button onClick={() => { setOpen(!open); setShowTooltip(false); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#4A7C2F] hover:bg-[#3d6a27] text-white flex items-center justify-center shadow-xl transition-all hover:scale-105 rounded-full"
        aria-label="Open chat">
        <span className="material-icon text-[24px]">{open ? "close" : "support_agent"}</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[390px] max-w-[calc(100vw-48px)] h-[540px] bg-white border border-[#d8d8d8] shadow-2xl flex flex-col rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 bg-[#4A7C2F] flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center shrink-0">
              <span className="material-icon text-white text-[22px]">support_agent</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-tight">RFC Assistant</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                <p className="text-[12px] text-white/75 font-medium uppercase tracking-wider">Food Safety AI · Online</p>
              </div>
            </div>
            <Link to="/book" onClick={() => setOpen(false)} className="flex items-center gap-1 text-[12px] font-semibold text-white/80 hover:text-white transition-colors">
              <span className="material-icon text-[13px]">calendar_month</span> Book
            </Link>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id}>
                <div className={`flex gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                  {msg.sender === "bot" && (
                    <div className="w-6 h-6 bg-[#4A7C2F] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-icon text-white text-[12px]">psychology</span>
                    </div>
                  )}
                  {msg.sender === "user" && (
                    <div className="w-6 h-6 bg-[#e8e8e8] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-icon text-[#666] text-[12px]">person</span>
                    </div>
                  )}
                  <div className={`text-[13px] leading-relaxed whitespace-pre-line ${msg.sender === "user" ? "bg-[#4A7C2F] text-white px-4 py-2.5 max-w-[85%]" : "bg-[#f8f8f7] text-[#333] px-4 py-3 max-w-[90%] border border-[#eee]"}`}>
                    {msg.text}
                  </div>
                </div>
                {msg.options && msg.sender === "bot" && (
                  <div className="ml-8 mt-3 space-y-1.5">
                    {msg.options.map((opt) => (
                      <button key={opt.action} onClick={() => handleOption(opt.action)}
                        className="flex items-center gap-2 w-full text-left px-3.5 py-2.5 text-[12px] font-medium text-[#4A7C2F] bg-[#f8f8f7] border border-[#eee] hover:border-[#4A7C2F]/30 hover:bg-white transition-all group">
                        {opt.label}
                        <span className="material-icon text-[12px] ml-auto opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex gap-2.5">
                <div className="w-6 h-6 bg-[#4A7C2F] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-icon text-white text-[12px]">psychology</span>
                </div>
                <div className="bg-[#f8f8f7] border border-[#eee] rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5" aria-label="Assistant is typing">
                  <span className="w-1.5 h-1.5 bg-[#4A7C2F] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#4A7C2F] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#4A7C2F] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="px-4 pt-3 flex flex-wrap gap-1.5 border-t border-[#eee]">
            {[
              { label: "Book", action: "book", icon: "calendar_month" },
              { label: "Audit quiz", action: "quiz", icon: "fact_check" },
              { label: "Academy", action: "academy", icon: "school" },
              { label: "WhatsApp", action: "whatsapp", icon: "chat" },
            ].map((qa) => (
              <button key={qa.action} onClick={() => handleQuickAction(qa.action)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium text-[#4A7C2F] bg-[#f8f8f7] border border-[#eee] hover:border-[#4A7C2F]/30 hover:bg-white transition-all">
                <span className="material-icon text-[12px]">{qa.icon}</span>
                {qa.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-3 flex items-center gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 text-[13px] px-3 py-2.5 bg-[#f8f8f7] border border-[#eee] focus:outline-none focus:border-[#4A7C2F] transition-colors" />
            <button onClick={handleSend} className="w-9 h-9 bg-[#4A7C2F] flex items-center justify-center text-white hover:bg-[#3d6a27] transition-colors shrink-0">
              <span className="material-icon text-[16px]">send</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
