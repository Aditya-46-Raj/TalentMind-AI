import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ProfilePage from "../features/profile/pages/ProfilePage";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import JDInputPage from "../features/job/pages/JDInputPage";
import AnalysisResultPage from "../features/job/pages/AnalysisResultPage";
import ChatPage from "../features/chat/pages/ChatPage";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" />}
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/job/analyze"
        element={
          <ProtectedRoute>
            <JDInputPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/job/results/:id"
        element={
          <ProtectedRoute>
            <AnalysisResultPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:id"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;