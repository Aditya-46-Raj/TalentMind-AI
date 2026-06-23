import { Navigate } from "react-router-dom";
import useAuthStore from "@/features/auth/store/authStore";

function PublicRoute({
  children,
}) {
  const token =
    useAuthStore(
      (state) => state.token
    );

  if (token) {
    return (
      <Navigate
        to="/dashboard"
      />
    );
  }

  return children;
}

export default PublicRoute;