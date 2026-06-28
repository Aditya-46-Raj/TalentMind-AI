import { PDFParse } from "pdf-parse";

import Resume from "../models/Resume.js";
import {
    extractSkills,
    calculateATSScore
} from "../services/ats.service.js";

import {
    uploadToCloudinary,
}
    from "../services/resume.service.js";

import {
    generateResumeSuggestions,
}
    from "../services/gemini.service.js";

export const uploadResume =
    async (req, res) => {
        try {
            if (!req.file) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "No file uploaded",
                    });
            }

            const uploadResult =
                await uploadToCloudinary(
                    req.file.buffer
                );

            const pdf =
                new PDFParse({
                    data: new Uint8Array(
                        req.file.buffer
                    ),
                });
            await pdf.load();
            const pdfData =
                await pdf.getText();

            const skills =
                extractSkills(
                    pdfData.text
                );

            const atsScore =
                calculateATSScore(
                    pdfData.text,
                    skills
                );

            const analysisText =
                await generateResumeSuggestions(
                    pdfData.text,
                    atsScore,
                    skills
                );

            let analysis;

            try {
                const cleaned =
                    analysisText
                        .replace(
                            /```json/g,
                            ""
                        )
                        .replace(
                            /```/g,
                            ""
                        )
                        .trim();

                analysis =
                    JSON.parse(cleaned);
            } catch {
                analysis = {
                    strengths: [],
                    weaknesses: [],
                    suggestions: [],
                };
            }

            const extractedText =
                pdfData.text;

            const resume =
                await Resume.create({
                    user:
                        req.user._id,

                    fileName:
                        req.file.originalname,

                    resumeUrl:
                        uploadResult.secure_url,

                    extractedText,
                    skills,
                    atsScore,
                    analysis,
                });

            res.status(201).json({
                success: true,
                resume,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Server Error",
            });
        }
    };