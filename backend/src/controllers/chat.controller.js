import Chat from "../models/Chat.js";
import Profile from "../models/Profile.js";
import Resume from "../models/Resume.js";
import JobAnalysis from "../models/JobAnalysis.js";
import { generateChatResponse } from "../services/gemini.service.js";

// POST /api/chat
export const createChat = async (req, res) => {
    try {
        const { message, chatId } = req.body;
        
        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        let chat;
        if (chatId) {
            chat = await Chat.findOne({ _id: chatId, user: req.user._id });
            if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });
        } else {
            const title = message.substring(0, 30) + (message.length > 30 ? "..." : "");
            chat = await Chat.create({
                user: req.user._id,
                title,
                messages: []
            });
        }

        // Step 3: Context Builder
        const [profile, resume, jobAnalysis] = await Promise.all([
            Profile.findOne({ user: req.user._id }).select("-__v -createdAt -updatedAt"),
            Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 }).select("skills atsScore analysis"),
            JobAnalysis.findOne({ user: req.user._id }).sort({ createdAt: -1 }).select("jobTitle company matchScore matchedSkills missingSkills roadmap analysis")
        ]);

        const context = {
            profile,
            resume,
            jobAnalysis
        };

        // Save user message
        chat.messages.push({ role: "user", content: message });

        // Step 4: Gemini Prompt (Context Window Optimization: Last 20 messages)
        const fullHistory = chat.messages.slice(0, -1);
        const optimizedHistory = fullHistory.slice(-20);
        
        const aiResponseText = await generateChatResponse(context, optimizedHistory, message);

        // Step 5: Chat Memory
        chat.messages.push({ role: "model", content: aiResponseText });
        await chat.save();

        res.status(201).json({
            success: true,
            chat
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// GET /api/chat
export const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ user: req.user._id }).sort({ updatedAt: -1 }).select("-messages");
        res.status(200).json({
            success: true,
            chats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// GET /api/chat/:id
export const getChatById = async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
        
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        res.status(200).json({
            success: true,
            chat
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// DELETE /api/chat/:id
export const deleteChat = async (req, res) => {
    try {
        const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Chat deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
