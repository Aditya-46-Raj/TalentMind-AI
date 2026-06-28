import api from "@/lib/axios";

export const getMyProfile =
    async () => {
        const res =
            await api.get(
                "/profile/me"
            );

        return res.data;
    };

export const updateProfile =
    async (data) => {
        const res =
            await api.put(
                "/profile",
                data
            );

        return res.data;
    };