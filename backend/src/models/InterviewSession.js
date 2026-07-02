import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        company: {
            type: String,
        },
        difficulty: {
            type: String,
            default: "medium"
        },
        questions: [
            {
                type: String,
            }
        ],
        answers: [
            {
                question: String,
                answer: String,
            }
        ],
        feedback: {
            strengths: [String],
            weaknesses: [String],
            suggestions: [String]
        },
        score: {
            technicalAccuracy: Number,
            communication: Number,
            problemSolving: Number,
            projectKnowledge: Number,
            total: Number,
        },
        improvementPlan: {
            topicsToStudy: [String],
            projectsToBuild: [String],
            resourcesToLearn: [String],
            thirtyDayPlan: String,
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        completedAt: {
            type: Date,
        },
        duration: {
            type: Number, // in seconds
        },
    },
    {
        timestamps: true,
    }
);

const InterviewSession = mongoose.model("InterviewSession", interviewSessionSchema);

export default InterviewSession;
