import mongoose from "mongoose";

const jobAnalysisSchema =
    new mongoose.Schema(
        {
            user: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref: "User",
                required: true,
            },

            jobTitle: String,

            company: String,

            jobDescription: String,

            matchedSkills: [String],

            missingSkills: [String],

            matchScore: Number,

            roadmap: [String],

            analysis: {
                strengths: [String],
                weaknesses: [String],
                suggestions: [String],
            },
        },
        {
            timestamps: true,
        }
    );

const JobAnalysis =
    mongoose.model(
        "JobAnalysis",
        jobAnalysisSchema
    );

export default JobAnalysis;