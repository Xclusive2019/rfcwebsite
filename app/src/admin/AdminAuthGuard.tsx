import { Navigate } from "react-router-dom";
import { useAdminSession } from "./hooks/useAdminSession";

const ADMIN_LOGIN_PATH = import.meta.env.VITE_ADMIN_LOGIN_PATH || "rfcsa-admin-portal";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAdminSession();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to={`/${ADMIN_LOGIN_PATH}`} replace />;
  }

  return <>{children}</>;
}
