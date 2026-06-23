import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,

  setUser: (user) =>
    set({ user }),

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
    });
  },
}));

export default useAuthStore;