import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import useAuthStore from "./features/auth/store/authStore";
import { Toaster } from "sonner";

function App() {
  const { checkAuth, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, [checkAuth, token]);

  return (
    <>
      <AppRoutes />
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;