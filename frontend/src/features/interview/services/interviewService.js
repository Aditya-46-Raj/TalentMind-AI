import api from "@/lib/axios";

export const startInterview = async (data) => {
    const res = await api.post("/interview/start", data);
    return res.data;
};

export const submitInterview = async (data) => {
    const res = await api.post("/interview/submit", data);
    return res.data;
};

export const getInterviewHistory = async () => {
    const res = await api.get("/interview/history");
    return res.data;
};

export const getInterviewById = async (id) => {
    const res = await api.get(`/interview/${id}`);
    return res.data;
};

export const deleteInterview = async (id) => {
    const res = await api.delete(`/interview/${id}`);
    return res.data;
};
