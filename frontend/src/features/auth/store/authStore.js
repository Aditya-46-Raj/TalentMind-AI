import { create } from "zustand";
import { getCurrentUser } from "../services/authService";

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,

  setUser: (user) =>
    set({ user }),

  updateAvatar: (avatar) =>
    set((state) => ({ user: state.user ? { ...state.user, avatar } : null })),

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

  checkAuth: async () => {
    try {
      const data = await getCurrentUser();
      set({ user: data.user });
    } catch (error) {
      get().logout();
    }
  }
}));

export default useAuthStore;