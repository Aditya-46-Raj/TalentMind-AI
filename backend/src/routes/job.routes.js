import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
    analyzeJob,
    getJobAnalyses,
    getJobAnalysisById
} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/analyze", protect, analyzeJob);
router.get("/", protect, getJobAnalyses);
router.get("/:id", protect, getJobAnalysisById);

export default router;
