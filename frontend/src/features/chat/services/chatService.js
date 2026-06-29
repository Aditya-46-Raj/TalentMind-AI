import api from "@/lib/axios";

export const createOrSendMessage = async (message, chatId = null) => {
    const payload = { message };
    if (chatId) {
        payload.chatId = chatId;
    }
    const res = await api.post("/chat", payload);
    return res.data;
};

export const fetchChats = async () => {
    const res = await api.get("/chat");
    return res.data;
};

export const fetchChatById = async (id) => {
    const res = await api.get(`/chat/${id}`);
    return res.data;
};

export const deleteChat = async (id) => {
    const res = await api.delete(`/chat/${id}`);
    return res.data;
};
