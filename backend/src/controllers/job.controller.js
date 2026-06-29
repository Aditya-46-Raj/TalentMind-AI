import JobAnalysis from "../models/JobAnalysis.js";
import Resume from "../models/Resume.js";
import { extractSkills } from "../services/ats.service.js";
import { generateJobAnalysis } from "../services/gemini.service.js";

export const analyzeJob = async (req, res) => {
    try {
        const { jobTitle, company, jobDescription } = req.body;

        if (!jobTitle || !company || !jobDescription) {
            return res.status(400).json({
                success: false,
                message: "Please provide job title, company, and job description",
            });
        }

        // Fetch the user's latest resume
        const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "No resume found. Please upload a resume first.",
            });
        }

        // 1. Extract Skills from JD
        const jdSkills = extractSkills(jobDescription);
        const resumeSkills = resume.skills || [];

        // 2. Match Engine Logic
        const matchedSkills = jdSkills.filter(skill => resumeSkills.includes(skill));
        const missingSkills = jdSkills.filter(skill => !resumeSkills.includes(skill));
        
        let matchScore = 0;
        if (jdSkills.length > 0) {
            matchScore = Math.round((matchedSkills.length / jdSkills.length) * 100);
        }

        // 3. Gemini Integration
        const analysisText = await generateJobAnalysis(
            resumeSkills,
            jdSkills,
            matchedSkills,
            missingSkills,
            matchScore
        );

        let analysisData;
        try {
            const cleaned = analysisText
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            analysisData = JSON.parse(cleaned);
        } catch (err) {
            analysisData = {
                strengths: [],
                weaknesses: [],
                suggestions: [],
                roadmap: [],
            };
        }

        // 4. Save to Database
        const jobAnalysis = await JobAnalysis.create({
            user: req.user._id,
            resume: resume._id,
            jobTitle,
            company,
            jobDescription,
            matchedSkills,
            missingSkills,
            matchScore,
            roadmap: analysisData.roadmap || [],
            analysis: {
                strengths: analysisData.strengths || [],
                weaknesses: analysisData.weaknesses || [],
                suggestions: analysisData.suggestions || [],
            }
        });

        res.status(201).json({
            success: true,
            jobAnalysis
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const getJobAnalyses = async (req, res) => {
    try {
        const analyses = await JobAnalysis.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            analyses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const getJobAnalysisById = async (req, res) => {
    try {
        const analysis = await JobAnalysis.findOne({ _id: req.params.id, user: req.user._id });
        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found",
            });
        }
        res.status(200).json({
            success: true,
            analysis
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
