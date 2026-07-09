import { lazy, Suspense } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Loader2 } from "lucide-react";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import ErrorBoundary from "../components/ui/error-boundary";

// Lazy Loaded Pages
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage"));
const DashboardPage = lazy(() => import("../features/dashboard/pages/DashboardPage"));
const ProfilePage = lazy(() => import("../features/profile/pages/ProfilePage"));
const SettingsPage = lazy(() => import("../features/settings/pages/SettingsPage"));
const JDInputPage = lazy(() => import("../features/job/pages/JDInputPage"));
const AnalysisResultPage = lazy(() => import("../features/job/pages/AnalysisResultPage"));
const ChatPage = lazy(() => import("../features/chat/pages/ChatPage"));
const InterviewSetupPage = lazy(() => import("../features/interview/pages/InterviewSetupPage"));
const InterviewSessionPage = lazy(() => import("../features/interview/pages/InterviewSessionPage"));
const InterviewReportPage = lazy(() => import("../features/interview/pages/InterviewReportPage"));

const FallbackLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-10 h-10 animate-spin text-primary" />
  </div>
);

const PageWrapper = ({ children }) => (
  <Suspense fallback={<FallbackLoader />}>
    {children}
  </Suspense>
);

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Public Routes with AuthLayout */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <ErrorBoundary>
              <AuthLayout>
                <PageWrapper><LoginPage /></PageWrapper>
              </AuthLayout>
            </ErrorBoundary>
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <ErrorBoundary>
              <AuthLayout>
                <PageWrapper><RegisterPage /></PageWrapper>
              </AuthLayout>
            </ErrorBoundary>
          </PublicRoute>
        }
      />

      {/* Protected Routes with MainLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <MainLayout>
                <PageWrapper><DashboardPage /></PageWrapper>
              </MainLayout>
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <MainLayout>
                <PageWrapper><ProfilePage /></PageWrapper>
              </MainLayout>
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/job/analyze"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <MainLayout>
                <PageWrapper><JDInputPage /></PageWrapper>
              </MainLayout>
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/job/results/:id"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <MainLayout>
                <PageWrapper><AnalysisResultPage /></PageWrapper>
              </MainLayout>
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PageWrapper><ChatPage /></PageWrapper>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:id"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <MainLayout>
                <PageWrapper><ChatPage /></PageWrapper>
              </MainLayout>
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview/setup"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <MainLayout>
                <PageWrapper><InterviewSetupPage /></PageWrapper>
              </MainLayout>
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview/session/:id"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <MainLayout>
                <PageWrapper><InterviewSessionPage /></PageWrapper>
              </MainLayout>
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview/report/:id"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <MainLayout>
                <PageWrapper><InterviewReportPage /></PageWrapper>
              </MainLayout>
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <MainLayout>
                <PageWrapper><SettingsPage /></PageWrapper>
              </MainLayout>
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;