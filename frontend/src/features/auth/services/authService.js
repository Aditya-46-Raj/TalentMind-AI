import api from "@/lib/axios";

export const registerUser =
  async (data) => {
    const res =
      await api.post(
        "/auth/register",
        data
      );

    return res.data;
  };

export const loginUser =
  async (data) => {
    const res =
      await api.post(
        "/auth/login",
        data
      );

    return res.data;
  };

export const getCurrentUser =
  async () => {
    const res =
      await api.get("/auth/me");

    return res.data;
  };