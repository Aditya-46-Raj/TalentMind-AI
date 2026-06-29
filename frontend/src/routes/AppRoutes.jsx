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
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          </PublicRoute>
        }
      />

      {/* Protected Routes with MainLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/job/analyze"
        element={
          <ProtectedRoute>
            <MainLayout>
              <JDInputPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/job/results/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AnalysisResultPage />
            </MainLayout>
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
            <MainLayout>
              <ChatPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview/setup"
        element={
          <ProtectedRoute>
            <MainLayout>
              <InterviewSetupPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview/session/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <InterviewSessionPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview/report/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <InterviewReportPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;