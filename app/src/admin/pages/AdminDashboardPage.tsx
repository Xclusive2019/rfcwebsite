import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  totalPosts: number;
  publishedPosts: number;
  totalContacts: number;
}

interface RecentBooking {
  id: string;
  name: string;
  email: string;
  service: string;
  booking_date: string;
  booking_time: string;
  status: string;
}

function StatCard({ label, value, sub, icon }: { label: string; value: number; sub?: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <span className="material-icon text-[#4A7C2F] text-2xl opacity-70">{icon}</span>
      </div>
    </div>
  );
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [bookingsRes, pendingRes, postsRes, publishedRes, contactsRes, recentRes] = await Promise.all([
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("contacts").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("id,name,email,service,booking_date,booking_time,status").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        totalBookings: bookingsRes.count ?? 0,
        pendingBookings: pendingRes.count ?? 0,
        totalPosts: postsRes.count ?? 0,
        publishedPosts: publishedRes.count ?? 0,
        totalContacts: contactsRes.count ?? 0,
      });
      setRecentBookings(recentRes.data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Bookings" value={stats!.totalBookings} sub={`${stats!.pendingBookings} pending`} icon="calendar_today" />
        <StatCard label="Pending Bookings" value={stats!.pendingBookings} icon="pending_actions" />
        <StatCard label="Blog Posts" value={stats!.totalPosts} sub={`${stats!.publishedPosts} published`} icon="article" />
        <StatCard label="Contact Submissions" value={stats!.totalContacts} icon="mail" />
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-sm text-[#4A7C2F] hover:underline">
            View all
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">No bookings yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Service</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Time</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{b.name}</td>
                  <td className="px-5 py-3 text-gray-600">{b.service}</td>
                  <td className="px-5 py-3 text-gray-600">{b.booking_date}</td>
                  <td className="px-5 py-3 text-gray-600">{b.booking_time}</td>
                  <td className="px-5 py-3">{statusBadge(b.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
