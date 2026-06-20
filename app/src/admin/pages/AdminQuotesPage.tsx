import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  product_code: string | null;
  product_name: string | null;
  product_pack: string | null;
  unit_price: number | null;
  quantity: number | null;
  message: string | null;
  created_at: string;
}

function formatPrice(value: number | null): string {
  if (value == null) return "—";
  return "R" + value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<QuoteRequest | null>(null);

  useEffect(() => {
    supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setQuotes(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quote Requests</h1>
        <span className="text-sm text-gray-400">{quotes.length} total</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : quotes.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">No quote requests yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Company</th>
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-5 py-3">Qty</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotes.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{new Date(q.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{q.name}</td>
                  <td className="px-5 py-3 text-gray-600">{q.company ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-600 max-w-xs truncate">{q.product_name ?? "General enquiry"}</td>
                  <td className="px-5 py-3 text-gray-600">{q.quantity ?? "—"}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setSelected(q)}
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

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Quote request from {selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <span className="material-icon text-xl">close</span>
              </button>
            </div>
            <dl className="space-y-3 text-sm">
              <div><dt className="text-gray-500">Date</dt><dd className="text-gray-900">{new Date(selected.created_at).toLocaleString()}</dd></div>
              <div><dt className="text-gray-500">Email</dt><dd className="text-gray-900">{selected.email}</dd></div>
              {selected.phone && <div><dt className="text-gray-500">Phone</dt><dd className="text-gray-900">{selected.phone}</dd></div>}
              {selected.company && <div><dt className="text-gray-500">Company</dt><dd className="text-gray-900">{selected.company}</dd></div>}
              <div className="rounded-lg bg-gray-50 p-3 space-y-2">
                <div><dt className="text-gray-500">Product</dt><dd className="text-gray-900">{selected.product_name ?? "General / bulk enquiry"}</dd></div>
                {selected.product_code && <div><dt className="text-gray-500">Item code</dt><dd className="text-gray-900">{selected.product_code}</dd></div>}
                {selected.product_pack && <div><dt className="text-gray-500">Pack</dt><dd className="text-gray-900">{selected.product_pack}</dd></div>}
                <div><dt className="text-gray-500">Listed price</dt><dd className="text-gray-900">{formatPrice(selected.unit_price)}{selected.unit_price != null ? " ea. excl. VAT" : ""}</dd></div>
                <div><dt className="text-gray-500">Quantity required</dt><dd className="text-gray-900">{selected.quantity ?? "Not specified"}</dd></div>
              </div>
              {selected.message && (
                <div>
                  <dt className="text-gray-500 mb-1">Message</dt>
                  <dd className="text-gray-900 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{selected.message}</dd>
                </div>
              )}
            </dl>
            <a
              href={`mailto:${selected.email}?subject=${encodeURIComponent("Your RFC quote request")}`}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-[#4A7C2F] text-white text-sm font-medium rounded-lg hover:bg-[#3d6827] transition-colors"
            >
              <span className="material-icon text-[16px]">reply</span>
              Reply by email
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
