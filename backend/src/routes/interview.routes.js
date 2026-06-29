import express from "express";
import {
    startInterview,
    submitInterview,
    getInterviewHistory,
    getInterviewById,
    deleteInterview
} from "../controllers/interview.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/start", protect, startInterview);
router.post("/submit", protect, submitInterview);
router.get("/history", protect, getInterviewHistory);
router.get("/:id", protect, getInterviewById);
router.delete("/:id", protect, deleteInterview);

export default router;
