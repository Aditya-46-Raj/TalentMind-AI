import mongoose from "mongoose";

const resumeSchema =
    new mongoose.Schema(
        {
            user: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,

                ref: "User",

                required: true,
            },

            fileName: {
                type: String,
            },

            resumeUrl: {
                type: String,
            },

            extractedText: {
                type: String,
                default: "",
            },

            skills: [
                {
                    type: String,
                },
            ],

            atsScore: {
                type: Number,
                default: 0,
            },

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

const Resume =
    mongoose.model(
        "Resume",
        resumeSchema
    );

export default Resume;