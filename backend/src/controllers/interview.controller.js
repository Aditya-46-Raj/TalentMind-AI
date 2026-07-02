import InterviewSession from "../models/InterviewSession.js";
import Resume from "../models/Resume.js";
import JobAnalysis from "../models/JobAnalysis.js";
import { generateInterviewQuestions, evaluateInterview } from "../services/gemini.service.js";

// POST /api/interview/start
export const startInterview = async (req, res) => {
    try {
        const { role, company, difficulty } = req.body;

        if (!role) {
            return res.status(400).json({ success: false, message: "Role is required" });
        }

        // Fetch context
        const [resume, jobAnalysis] = await Promise.all([
            Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 }).select("skills analysis"),
            JobAnalysis.findOne({ user: req.user._id }).sort({ createdAt: -1 }).select("jobTitle company matchedSkills missingSkills"),
        ]);

        const questions = await generateInterviewQuestions(role, company, difficulty, resume, jobAnalysis);

        const session = await InterviewSession.create({
            user: req.user._id,
            role,
            company: company || "General",
            difficulty: difficulty || "Medium",
            questions,
            answers: [],
        });

        res.status(201).json({
            success: true,
            session
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to start interview" });
    }
};

// POST /api/interview/submit
export const submitInterview = async (req, res) => {
    try {
        const { sessionId, answers } = req.body;

        if (!sessionId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ success: false, message: "Valid session ID and answers array are required" });
        }

        const session = await InterviewSession.findOne({ _id: sessionId, user: req.user._id });
        if (!session) {
            return res.status(404).json({ success: false, message: "Interview session not found" });
        }

        const evaluation = await evaluateInterview(session.role, session.company, answers);

        session.answers = answers;
        session.score = evaluation.score;
        session.feedback = evaluation.feedback;
        session.improvementPlan = evaluation.improvementPlan;
        
        session.completedAt = new Date();
        if (session.startedAt) {
            session.duration = Math.floor((session.completedAt - session.startedAt) / 1000);
        }
        
        await session.save();

        res.status(200).json({
            success: true,
            session
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to submit interview" });
    }
};

// GET /api/interview/history
export const getInterviewHistory = async (req, res) => {
    try {
        const history = await InterviewSession.find({ user: req.user._id })
            .select("role company score createdAt")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            history
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch history" });
    }
};

// GET /api/interview/:id
export const getInterviewById = async (req, res) => {
    try {
        const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user._id });
        
        if (!session) {
            return res.status(404).json({ success: false, message: "Interview session not found" });
        }

        res.status(200).json({
            success: true,
            session
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch interview" });
    }
};

// DELETE /api/interview/:id
export const deleteInterview = async (req, res) => {
    try {
        const session = await InterviewSession.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!session) {
            return res.status(404).json({ success: false, message: "Interview session not found" });
        }

        res.status(200).json({
            success: true,
            message: "Interview deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to delete interview" });
    }
};
