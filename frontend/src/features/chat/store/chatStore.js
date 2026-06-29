import { create } from "zustand";

const useChatStore = create((set) => ({
    chats: [],
    currentChat: null,
    loading: false,

    setChats: (chats) => set({ chats }),
    setCurrentChat: (chat) => set({ currentChat: chat }),
    setLoading: (loading) => set({ loading }),
    
    addMessageToCurrent: (message) => set((state) => ({
        currentChat: state.currentChat 
            ? { ...state.currentChat, messages: [...state.currentChat.messages, message] }
            : null
    }))
}));

export default useChatStore;
