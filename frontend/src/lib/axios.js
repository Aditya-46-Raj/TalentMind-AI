import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only show toast if we are in browser environment and have toast available
    // We import toast dynamically to avoid circular dependencies if any
    import("sonner").then(({ toast }) => {
      if (!error.response) {
        toast.error("Network error. Please check your connection.");
        return;
      }
      
      const status = error.response.status;
      const message = error.response.data?.message || "Something went wrong";

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (status === 403) {
        toast.error("You don't have permission to perform this action.");
      } else if (status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(message);
      }
    });
    
    return Promise.reject(error);
  }
);

export default api;