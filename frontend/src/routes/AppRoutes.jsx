import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import SettingsPage from "../features/settings/pages/SettingsPage";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import JDInputPage from "../features/job/pages/JDInputPage";
import AnalysisResultPage from "../features/job/pages/AnalysisResultPage";
import ChatPage from "../features/chat/pages/ChatPage";
import InterviewSetupPage from "../features/interview/pages/InterviewSetupPage";
import InterviewSessionPage from "../features/interview/pages/InterviewSessionPage";
import InterviewReportPage from "../features/interview/pages/InterviewReportPage";
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import ErrorBoundary from "../components/ui/error-boundary";

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
                <LoginPage />
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
                <RegisterPage />
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
                <DashboardPage />
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
                <ProfilePage />
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
                <JDInputPage />
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
                <AnalysisResultPage />
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
              <ChatPage />
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
                <ChatPage />
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
                <InterviewSetupPage />
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
                <InterviewSessionPage />
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
                <InterviewReportPage />
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
                <SettingsPage />
              </MainLayout>
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;