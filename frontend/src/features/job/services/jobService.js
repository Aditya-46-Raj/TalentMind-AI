import api from "@/lib/axios";

export const analyzeJob = async (jobData) => {
    const res = await api.post("/job/analyze", jobData);
    return res.data;
};

export const getJobAnalyses = async () => {
    const res = await api.get("/job");
    return res.data;
};

export const getJobAnalysisById = async (id) => {
    const res = await api.get(`/job/${id}`);
    return res.data;
};
