import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatSession {
  id: string;
  session_id: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ChatSession | null>(null);

  useEffect(() => {
    supabase
      .from("chat_conversations")
      .select("*")
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        setSessions((data as ChatSession[]) ?? []);
        setLoading(false);
      });
  }, []);

  function messageCount(s: ChatSession) {
    return s.messages.filter((m) => m.role !== "system").length;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Chat Sessions</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">No chat sessions yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Session ID</th>
                <th className="text-left px-5 py-3">Messages</th>
                <th className="text-left px-5 py-3">Started</th>
                <th className="text-left px-5 py-3">Last Activity</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{s.session_id.slice(0, 16)}…</td>
                  <td className="px-5 py-3 text-gray-700">{messageCount(s)}</td>
                  <td className="px-5 py-3 text-gray-500">{new Date(s.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-gray-500">{new Date(s.updated_at).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => setSelected(s)} className="text-[#4A7C2F] hover:underline text-xs font-medium">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Thread dialog */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="font-semibold text-gray-900 text-sm font-mono">{selected.session_id.slice(0, 24)}…</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <span className="material-icon text-xl">close</span>
              </button>
            </div>
            <div className="overflow-y-auto space-y-3 flex-1">
              {selected.messages
                .filter((m) => m.role !== "system")
                .map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                        m.role === "user"
                          ? "bg-[#4A7C2F] text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
