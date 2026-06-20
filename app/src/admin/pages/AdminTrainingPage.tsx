import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

interface TrainingSession {
  id: string;
  course_code: string | null;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  price: string | null;
  register_url: string | null;
  is_active: boolean;
  sort_order: number;
}

type Draft = Omit<TrainingSession, "id">;

const emptyDraft: Draft = {
  course_code: "",
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  price: "",
  register_url: "",
  is_active: true,
  sort_order: 0,
};

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmt(d: string | null) {
  if (!d) return "";
  const [y, m, day] = d.split("-").map(Number);
  return `${day} ${MONTH[m - 1]} ${y}`;
}

export default function AdminTrainingPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TrainingSession | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);

  function load() {
    supabase
      .from("training_sessions")
      .select("*")
      .order("start_date", { ascending: true })
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setSessions((data as TrainingSession[]) ?? []);
        setLoading(false);
      });
  }

  useEffect(load, []);

  function openNew() {
    setDraft({ ...emptyDraft });
    setEditing("new");
  }

  function openEdit(s: TrainingSession) {
    setDraft({
      course_code: s.course_code ?? "",
      title: s.title,
      description: s.description ?? "",
      start_date: s.start_date,
      end_date: s.end_date ?? "",
      price: s.price ?? "",
      register_url: s.register_url ?? "",
      is_active: s.is_active,
      sort_order: s.sort_order,
    });
    setEditing(s);
  }

  function set<K extends keyof Draft>(key: K, val: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: val }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim() || !draft.start_date) {
      toast.error("Title and start date are required");
      return;
    }
    setSaving(true);
    const payload = {
      course_code: draft.course_code?.trim() || null,
      title: draft.title.trim(),
      description: draft.description?.trim() || null,
      start_date: draft.start_date,
      end_date: draft.end_date || null,
      price: draft.price?.trim() || null,
      register_url: draft.register_url?.trim() || null,
      is_active: draft.is_active,
      sort_order: Number(draft.sort_order) || 0,
    };

    let error;
    if (editing === "new") {
      ({ error } = await supabase.from("training_sessions").insert(payload));
    } else if (editing) {
      ({ error } = await supabase.from("training_sessions").update(payload).eq("id", editing.id));
    }
    setSaving(false);
    if (error) {
      toast.error("Failed to save session");
    } else {
      toast.success(editing === "new" ? "Session added" : "Session updated");
      setEditing(null);
      load();
    }
  }

  async function toggleActive(s: TrainingSession) {
    const { error } = await supabase.from("training_sessions").update({ is_active: !s.is_active }).eq("id", s.id);
    if (error) {
      toast.error("Failed to update");
    } else {
      setSessions((prev) => prev.map((x) => (x.id === s.id ? { ...x, is_active: !x.is_active } : x)));
    }
  }

  async function remove(s: TrainingSession) {
    if (!confirm(`Delete "${s.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("training_sessions").delete().eq("id", s.id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Session deleted");
      setSessions((prev) => prev.filter((x) => x.id !== s.id));
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the Virtual Facilitation sessions shown on the public training calendar. Inactive sessions are hidden from visitors.
          </p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2.5 bg-[#4A7C2F] hover:bg-[#3d6827] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shrink-0"
        >
          <span className="material-icon text-[18px]">add</span>
          Add Session
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <span className="material-icon text-[40px] text-gray-300 mb-3">event_note</span>
          <p className="text-sm text-gray-500">No training sessions yet. Add one to populate the public calendar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{s.title}</div>
                    {s.course_code && <div className="text-xs text-gray-400">{s.course_code}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {fmt(s.start_date)}
                    {s.end_date && s.end_date !== s.start_date ? ` – ${fmt(s.end_date)}` : ""}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.price || "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(s)}
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                        s.is_active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <span className="material-icon text-[13px]">{s.is_active ? "visibility" : "visibility_off"}</span>
                      {s.is_active ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 hover:text-[#4A7C2F] rounded-md hover:bg-gray-100" title="Edit">
                        <span className="material-icon text-[18px]">edit</span>
                      </button>
                      <button onClick={() => remove(s)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100" title="Delete">
                        <span className="material-icon text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">{editing === "new" ? "Add Session" : "Edit Session"}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-700">
                <span className="material-icon">close</span>
              </button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Course Code</label>
                  <input value={draft.course_code ?? ""} onChange={(e) => set("course_code", e.target.value)} placeholder="e.g. 4.1.1" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4A7C2F]" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Title *</label>
                  <input required value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="Course title" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4A7C2F]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
                <textarea rows={2} value={draft.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Short description" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4A7C2F] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Start Date *</label>
                  <input type="date" required value={draft.start_date} onChange={(e) => set("start_date", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4A7C2F]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">End Date <span className="text-gray-300">(optional)</span></label>
                  <input type="date" value={draft.end_date ?? ""} onChange={(e) => set("end_date", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4A7C2F]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Price</label>
                  <input value={draft.price ?? ""} onChange={(e) => set("price", e.target.value)} placeholder="e.g. R1,790 p/p (incl. VAT)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4A7C2F]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Sort Order</label>
                  <input type="number" value={draft.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4A7C2F]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Register URL <span className="text-gray-300">(optional — defaults to the system link in Settings)</span></label>
                <input value={draft.register_url ?? ""} onChange={(e) => set("register_url", e.target.value)} placeholder="https://complycloud.flowsheet.co.za/..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4A7C2F]" />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                <input type="checkbox" checked={draft.is_active} onChange={(e) => set("is_active", e.target.checked)} className="w-4 h-4 accent-[#4A7C2F]" />
                <span className="text-sm text-gray-700">Active (visible on the public calendar)</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-[#4A7C2F] hover:bg-[#3d6827] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors">
                  {saving ? "Saving…" : "Save Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
