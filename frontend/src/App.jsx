import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./features/auth/store/authStore";

function App() {
  const { checkAuth, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, [checkAuth, token]);

  return <AppRoutes />;
}

export default App;