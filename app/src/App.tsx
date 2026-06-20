import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIChat from "./components/AIChat";
import AdminAuthGuard from "./admin/AdminAuthGuard";

const ADMIN_LOGIN_PATH = import.meta.env.VITE_ADMIN_LOGIN_PATH || "rfcsa-admin-portal";

const HomePage = lazy(() => import("./pages/HomePage"));
const AuditQuizPage = lazy(() => import("./pages/AuditQuizPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const ServiceFSMSDevelopmentPage = lazy(() => import("./pages/ServiceFSMSDevelopmentPage"));
const ServiceAuditsPage = lazy(() => import("./pages/ServiceAuditsPage"));
const ServiceRetailAssessmentsPage = lazy(() => import("./pages/ServiceRetailAssessmentsPage"));
const ServiceLabellingPage = lazy(() => import("./pages/ServiceLabellingPage"));
const ComplyCloudPage = lazy(() => import("./pages/ComplyCloudPage"));
const TrainingHubPage = lazy(() => import("./pages/TrainingHubPage"));
const TrainingCalendarPage = lazy(() => import("./pages/TrainingCalendarPage"));
const ClassroomTrainingPage = lazy(() => import("./pages/ClassroomTrainingPage"));
const HealthSafetyCoursesPage = lazy(() => import("./pages/HealthSafetyCoursesPage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));

const AdminLoginPage = lazy(() => import("./admin/pages/AdminLoginPage"));
const AdminApp = lazy(() => import("./admin/AdminApp"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/audit-readiness" element={<AuditQuizPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/services/fsms-development" element={<ServiceFSMSDevelopmentPage />} />
          <Route path="/services/internal-audits" element={<ServiceAuditsPage />} />
          <Route path="/services/retail-assessments" element={<ServiceRetailAssessmentsPage />} />
          <Route path="/services/labelling-product-audits" element={<ServiceLabellingPage />} />
          <Route path="/comply-cloud" element={<ComplyCloudPage />} />
          <Route path="/training" element={<TrainingHubPage />} />
          <Route path="/training/virtual" element={<TrainingCalendarPage />} />
          <Route path="/training/classroom" element={<ClassroomTrainingPage />} />
          <Route path="/training/health-safety" element={<HealthSafetyCoursesPage />} />
          <Route path="/shop" element={<ShopPage />} />

          {/* Hidden admin login */}
          <Route path={`/${ADMIN_LOGIN_PATH}`} element={<AdminLoginPage />} />
          <Route path="/admin/login" element={<Navigate to="/" replace />} />

          {/* Admin routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/*"
            element={
              <AdminAuthGuard>
                <AdminApp />
              </AdminAuthGuard>
            }
          />
        </Routes>
      </Suspense>
      {!isAdmin && <Footer />}
      {!isAdmin && <AIChat />}
    </div>
  );
}
