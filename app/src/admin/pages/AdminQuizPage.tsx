import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface QuizSubmission {
  id: string;
  full_name: string | null;
  email: string;
  company: string | null;
  score: number;
  tier: string | null;
  answers: Record<string, string>;
  created_at: string;
}

const tierColors: Record<string, string> = {
  Excellent: "bg-green-100 text-green-800",
  Good: "bg-blue-100 text-blue-800",
  "Needs Improvement": "bg-yellow-100 text-yellow-800",
  Critical: "bg-red-100 text-red-800",
};

export default function AdminQuizPage() {
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<QuizSubmission | null>(null);

  useEffect(() => {
    supabase
      .from("quiz_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSubmissions((data as QuizSubmission[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quiz Submissions</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : submissions.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">No quiz submissions yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Company</th>
                <th className="text-left px-5 py-3">Score</th>
                <th className="text-left px-5 py-3">Tier</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{new Date(s.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{s.full_name ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-600">{s.email}</td>
                  <td className="px-5 py-3 text-gray-600">{s.company ?? "—"}</td>
                  <td className="px-5 py-3 font-semibold text-gray-900">{s.score}/100</td>
                  <td className="px-5 py-3">
                    {s.tier && (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${tierColors[s.tier] ?? "bg-gray-100 text-gray-700"}`}>
                        {s.tier}
                      </span>
                    )}
                  </td>
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

      {/* Detail dialog */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Quiz Result — {selected.full_name ?? selected.email}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <span className="material-icon text-xl">close</span>
              </button>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="text-3xl font-bold text-gray-900">{selected.score}/100</div>
              {selected.tier && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${tierColors[selected.tier] ?? "bg-gray-100 text-gray-700"}`}>
                  {selected.tier}
                </span>
              )}
            </div>
            <dl className="space-y-2 text-sm mb-5">
              <div><dt className="text-gray-500">Email</dt><dd className="text-gray-900">{selected.email}</dd></div>
              {selected.company && <div><dt className="text-gray-500">Company</dt><dd className="text-gray-900">{selected.company}</dd></div>}
              <div><dt className="text-gray-500">Date</dt><dd className="text-gray-900">{new Date(selected.created_at).toLocaleString()}</dd></div>
            </dl>
            {selected.answers && Object.keys(selected.answers).length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Answers</h3>
                <div className="space-y-1.5">
                  {Object.entries(selected.answers).map(([q, a]) => (
                    <div key={q} className="flex justify-between text-sm bg-gray-50 rounded px-3 py-2">
                      <span className="text-gray-600">Q{q}</span>
                      <span className={`font-medium ${a === "yes" ? "text-green-700" : a === "partial" ? "text-yellow-700" : "text-red-700"}`}>
                        {a}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
