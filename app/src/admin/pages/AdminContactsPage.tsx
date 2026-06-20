import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string;
  created_at: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [serviceFilter, setServiceFilter] = useState("all");

  useEffect(() => {
    supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setContacts(data ?? []);
        setLoading(false);
      });
  }, []);

  const services = ["all", ...Array.from(new Set(contacts.map((c) => c.service).filter(Boolean) as string[]))];
  const filtered = serviceFilter === "all" ? contacts : contacts.filter((c) => c.service === serviceFilter);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4A7C2F]"
        >
          {services.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All services" : s}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">No contact submissions</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Company</th>
                <th className="text-left px-5 py-3">Service</th>
                <th className="text-left px-5 py-3">Message</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-5 py-3 text-gray-600">{c.email}</td>
                  <td className="px-5 py-3 text-gray-600">{c.company ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-600">{c.service ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-600 max-w-xs truncate">{c.message}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setSelected(c)}
                      className="text-[#4A7C2F] hover:underline text-xs font-medium"
                    >
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
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Contact from {selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <span className="material-icon text-xl">close</span>
              </button>
            </div>
            <dl className="space-y-3 text-sm">
              <div><dt className="text-gray-500">Date</dt><dd className="text-gray-900">{new Date(selected.created_at).toLocaleString()}</dd></div>
              <div><dt className="text-gray-500">Email</dt><dd className="text-gray-900">{selected.email}</dd></div>
              {selected.phone && <div><dt className="text-gray-500">Phone</dt><dd className="text-gray-900">{selected.phone}</dd></div>}
              {selected.company && <div><dt className="text-gray-500">Company</dt><dd className="text-gray-900">{selected.company}</dd></div>}
              {selected.service && <div><dt className="text-gray-500">Service</dt><dd className="text-gray-900">{selected.service}</dd></div>}
              <div>
                <dt className="text-gray-500 mb-1">Message</dt>
                <dd className="text-gray-900 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{selected.message}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
