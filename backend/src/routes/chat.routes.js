import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
    createChat,
    getChats,
    getChatById,
    deleteChat
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", protect, createChat);
router.get("/", protect, getChats);
router.get("/:id", protect, getChatById);
router.delete("/:id", protect, deleteChat);

export default router;
