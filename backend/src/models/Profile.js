import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        headline: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
        },

        skills: [
            {
                type: String,
            },
        ],

        education: [
            {
                institution: String,
                degree: String,
                branch: String,
                startYear: Number,
                endYear: Number,
                cgpa: Number,
            },
        ],

        projects: [
            {
                title: String,
                techStack: [String],
                githubUrl: String,
                description: String,
            },
        ],

        targetRole: {
            type: String,
            default: "",
        },

        targetCompanies: [
            {
                type: String,
            },
        ],

        socialLinks: {
            github: String,
            linkedin: String,
            leetcode: String,
            codeforces: String,
            codechef: String,
        },

        resumeUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Profile = mongoose.model(
    "Profile",
    profileSchema
);

export default Profile;