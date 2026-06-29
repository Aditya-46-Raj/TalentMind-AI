import { create } from "zustand";

const useJobStore = create((set) => ({
    currentAnalysis: null,
    history: [],

    setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
    setHistory: (history) => set({ history }),
    clearCurrentAnalysis: () => set({ currentAnalysis: null }),
}));

export default useJobStore;
