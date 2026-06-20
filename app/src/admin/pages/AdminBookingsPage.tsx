import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string;
  booking_date: string;
  booking_time: string;
  status: string;
  notes: string | null;
  division: string | null;
  created_at: string;
}

type Status = "all" | "pending" | "confirmed" | "cancelled";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Status>("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: false })
      .then(({ data }) => {
        setBookings((data as Booking[]) ?? []);
        setLoading(false);
      });
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    setUpdating(id);
    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Booking ${newStatus}`);
    }
    setUpdating(null);
  }

  async function deleteBooking(id: string) {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete booking");
    } else {
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Booking deleted");
    }
  }

  const filtered = statusFilter === "all" ? bookings : bookings.filter((b) => b.status === statusFilter);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <div className="flex gap-2">
          {(["all", "pending", "confirmed", "cancelled"] as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                statusFilter === s
                  ? "bg-[#4A7C2F] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">No bookings found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Time</th>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Service</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{b.booking_date}</td>
                  <td className="px-5 py-3 text-gray-600">{b.booking_time}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{b.name}</div>
                    <div className="text-xs text-gray-400">{b.email}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{b.service}</td>
                  <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(b)}
                        className="text-xs text-[#4A7C2F] hover:underline"
                      >
                        View
                      </button>
                      {b.status !== "confirmed" && (
                        <button
                          disabled={updating === b.id}
                          onClick={() => updateStatus(b.id, "confirmed")}
                          className="text-xs text-green-700 hover:underline disabled:opacity-50"
                        >
                          Confirm
                        </button>
                      )}
                      {b.status !== "cancelled" && (
                        <button
                          disabled={updating === b.id}
                          onClick={() => updateStatus(b.id, "cancelled")}
                          className="text-xs text-red-600 hover:underline disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => deleteBooking(b.id)}
                        className="text-xs text-gray-400 hover:text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
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
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Booking Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <span className="material-icon text-xl">close</span>
              </button>
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Status</dt><dd><StatusBadge status={selected.status} /></dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Date</dt><dd className="text-gray-900">{selected.booking_date}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Time</dt><dd className="text-gray-900">{selected.booking_time}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Service</dt><dd className="text-gray-900">{selected.service}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Name</dt><dd className="text-gray-900">{selected.name}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Email</dt><dd className="text-gray-900">{selected.email}</dd></div>
              {selected.phone && <div className="flex justify-between"><dt className="text-gray-500">Phone</dt><dd className="text-gray-900">{selected.phone}</dd></div>}
              {selected.company && <div className="flex justify-between"><dt className="text-gray-500">Company</dt><dd className="text-gray-900">{selected.company}</dd></div>}
              {selected.division && <div className="flex justify-between"><dt className="text-gray-500">Division</dt><dd className="text-gray-900">{selected.division}</dd></div>}
              {selected.notes && (
                <div>
                  <dt className="text-gray-500 mb-1">Notes</dt>
                  <dd className="text-gray-900 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{selected.notes}</dd>
                </div>
              )}
            </dl>
            <div className="flex gap-2 mt-5">
              {selected.status !== "confirmed" && (
                <button
                  disabled={updating === selected.id}
                  onClick={() => updateStatus(selected.id, "confirmed")}
                  className="flex-1 bg-[#4A7C2F] hover:bg-[#3d6827] text-white text-sm py-2 rounded-lg disabled:opacity-50"
                >
                  Confirm
                </button>
              )}
              {selected.status !== "cancelled" && (
                <button
                  disabled={updating === selected.id}
                  onClick={() => updateStatus(selected.id, "cancelled")}
                  className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 text-sm py-2 rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
