import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useChatStore from "../store/chatStore";
import { fetchChats, fetchChatById, createOrSendMessage, deleteChat } from "../services/chatService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Plus, Send, Trash2, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

function ChatPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const { chats, setChats, currentChat, setCurrentChat, loading, setLoading, addMessageToCurrent } = useChatStore();
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    // Fetch Sidebar History
    useEffect(() => {
        const loadChats = async () => {
            try {
                const res = await fetchChats();
                if (res.success) {
                    setChats(res.chats);
                }
            } catch (error) {
                console.error("Failed to load chats", error);
            }
        };
        loadChats();
    }, [setChats]);

    // Fetch Active Chat
    useEffect(() => {
        const loadActiveChat = async () => {
            if (id) {
                try {
                    const res = await fetchChatById(id);
                    if (res.success) {
                        setCurrentChat(res.chat);
                    }
                } catch (error) {
                    console.error("Failed to load chat", error);
                    navigate("/chat");
                }
            } else {
                setCurrentChat(null);
            }
        };
        loadActiveChat();
    }, [id, setCurrentChat, navigate]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentChat?.messages, loading]);

    const handleSendMessage = async (e, forcedMessage = null) => {
        if (e) e.preventDefault();
        
        const messageToSend = forcedMessage || inputValue;
        if (!messageToSend.trim() || loading) return;

        setInputValue("");
        
        // Optimistic UI Update
        if (!currentChat) {
            // New Chat Optimistic setup
            setCurrentChat({
                _id: "temp",
                title: messageToSend,
                messages: [{ role: "user", content: messageToSend }]
            });
        } else {
            addMessageToCurrent({ role: "user", content: messageToSend });
        }

        setLoading(true);

        try {
            const res = await createOrSendMessage(messageToSend, currentChat?._id !== "temp" ? currentChat?._id : null);
            if (res.success) {
                // If it was a new chat, update URL and state
                if (!currentChat || currentChat._id === "temp") {
                    navigate(`/chat/${res.chat._id}`);
                    // Refresh sidebar
                    const historyRes = await fetchChats();
                    if (historyRes.success) setChats(historyRes.chats);
                } else {
                    setCurrentChat(res.chat);
                }
            }
        } catch (error) {
            console.error("Failed to send message", error);
            // Optionally remove the optimistic message on failure
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteChat = async (e, chatId) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this chat?")) return;
        
        try {
            await deleteChat(chatId);
            setChats(chats.filter(c => c._id !== chatId));
            if (currentChat?._id === chatId) {
                navigate("/chat");
            }
        } catch (error) {
            console.error("Failed to delete chat", error);
        }
    };

    const suggestedPrompts = [
        "Improve my resume",
        "Create learning roadmap",
        "Suggest projects",
        "Prepare for interviews"
    ];

    return (
        <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
            
            {/* Sidebar */}
            <div className="w-64 border-r bg-muted/20 flex flex-col hidden md:flex">
                <div className="p-4">
                    <Button 
                        onClick={() => navigate("/chat")} 
                        className="w-full justify-start gap-2"
                        variant="outline"
                    >
                        <Plus className="w-4 h-4" />
                        New Chat
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {chats.map(chat => (
                        <div 
                            key={chat._id} 
                            onClick={() => navigate(`/chat/${chat._id}`)}
                            className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                                currentChat?._id === chat._id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                            }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <MessageSquare className="w-4 h-4 shrink-0" />
                                <span className="text-sm truncate font-medium">{chat.title}</span>
                            </div>
                            <button 
                                onClick={(e) => handleDeleteChat(e, chat._id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative bg-background">
                
                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                    {currentChat?.messages?.length > 0 ? (
                        <>
                            {currentChat.messages.map((msg, index) => (
                                <div key={index} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-emerald-500 text-white"}`}>
                                        {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                    </div>
                                    <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                                        msg.role === "user" 
                                            ? "bg-primary text-primary-foreground" 
                                            : "bg-muted text-foreground border border-border"
                                    }`}>
                                        {msg.role === "user" ? (
                                            <p className="text-[15px] whitespace-pre-wrap">{msg.content}</p>
                                        ) : (
                                            <div className="prose prose-sm dark:prose-invert max-w-none text-[15px]">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-4 flex-row">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div className="bg-muted text-muted-foreground border border-border rounded-2xl px-5 py-4 flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8 animate-in fade-in duration-500">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                <Bot className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-semibold tracking-tight">How can I help your career today?</h2>
                            <p className="text-muted-foreground">I'm your personalized AI mentor. I have full context on your resume and job matches.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mt-8">
                                {suggestedPrompts.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSendMessage(null, prompt)}
                                        className="p-4 text-sm text-left border rounded-xl bg-card hover:bg-muted/50 hover:border-primary/50 transition-all text-card-foreground shadow-sm group"
                                    >
                                        <span className="font-medium group-hover:text-primary transition-colors">{prompt} →</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-background">
                    <form 
                        onSubmit={handleSendMessage} 
                        className="max-w-4xl mx-auto relative flex items-center"
                    >
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask your AI Career Mentor..."
                            className="pr-12 py-6 text-base rounded-2xl shadow-sm border-muted-foreground/20 focus-visible:ring-primary/20"
                            disabled={loading}
                        />
                        <Button 
                            type="submit" 
                            size="icon" 
                            disabled={!inputValue.trim() || loading}
                            className="absolute right-2 h-10 w-10 rounded-xl"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                        TalentMind AI analyzes your uploaded resume and job descriptions to provide personalized advice.
                    </p>
                </div>

            </div>
        </div>
    );
}

export default ChatPage;
