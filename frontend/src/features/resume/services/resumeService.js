import api from "@/lib/axios";

export const uploadResume = async (formData) => {
    const res = await api.post("/resume/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const getLatestResume = async () => {
    const res = await api.get("/resume/latest");
    return res.data;
};
