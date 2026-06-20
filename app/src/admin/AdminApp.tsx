import { Routes, Route, NavLink, useNavigate, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { supabase } from "../lib/supabase";

const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminBookingsPage = lazy(() => import("./pages/AdminBookingsPage"));
const AdminAvailabilityPage = lazy(() => import("./pages/AdminAvailabilityPage"));
const AdminBlogPage = lazy(() => import("./pages/AdminBlogPage"));
const AdminBlogEditorPage = lazy(() => import("./pages/AdminBlogEditorPage"));
const AdminContactsPage = lazy(() => import("./pages/AdminContactsPage"));
const AdminProductsPage = lazy(() => import("./pages/AdminProductsPage"));
const AdminQuotesPage = lazy(() => import("./pages/AdminQuotesPage"));
const AdminQuizPage = lazy(() => import("./pages/AdminQuizPage"));
const AdminChatPage = lazy(() => import("./pages/AdminChatPage"));
const AdminTrainingPage = lazy(() => import("./pages/AdminTrainingPage"));
const AdminSettingsPage = lazy(() => import("./pages/AdminSettingsPage"));

const ADMIN_LOGIN_PATH = import.meta.env.VITE_ADMIN_LOGIN_PATH || "rfcsa-admin-portal";

const navItems = [
  { to: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/admin/bookings", icon: "calendar_today", label: "Bookings" },
  { to: "/admin/availability", icon: "schedule", label: "Availability" },
  { to: "/admin/training", icon: "school", label: "Training" },
  { to: "/admin/blog", icon: "article", label: "Blog" },
  { to: "/admin/products", icon: "inventory_2", label: "Shop Products" },
  { to: "/admin/contacts", icon: "mail", label: "Contacts" },
  { to: "/admin/quotes", icon: "request_quote", label: "Quote Requests" },
  { to: "/admin/quiz", icon: "quiz", label: "Quiz Results" },
  { to: "/admin/chat", icon: "chat", label: "Chat Sessions" },
  { to: "/admin/settings", icon: "settings", label: "Settings" },
];

export default function AdminApp() {
  const navigate = useNavigate();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate(`/${ADMIN_LOGIN_PATH}`);
  }

  return (
    <div className="flex min-h-screen bg-[#f8f8f7]">
      {/* Sidebar */}
      <aside className="w-56 fixed inset-y-0 left-0 flex flex-col bg-[#0a0a0c] border-r border-white/10 z-40">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-white/10 shrink-0 gap-3">
          <img
            src="/RFC_logo-removebg-preview.png"
            alt="RFC"
            className="h-10 w-auto"
          />
          <span className="text-white font-medium text-sm opacity-70">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "text-white bg-[#4A7C2F]/20 border-r-2 border-[#4A7C2F]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <span className="material-icon text-[18px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="material-icon text-[18px]">logout</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 min-h-screen">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="availability" element={<AdminAvailabilityPage />} />
            <Route path="blog" element={<AdminBlogPage />} />
            <Route path="blog/new" element={<AdminBlogEditorPage />} />
            <Route path="blog/:id" element={<AdminBlogEditorPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="contacts" element={<AdminContactsPage />} />
            <Route path="quotes" element={<AdminQuotesPage />} />
            <Route path="quiz" element={<AdminQuizPage />} />
            <Route path="chat" element={<AdminChatPage />} />
            <Route path="training" element={<AdminTrainingPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
