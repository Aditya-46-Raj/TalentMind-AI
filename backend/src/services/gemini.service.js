import ai
    from "../config/gemini.js";

export const generateResumeSuggestions =
    async (
        resumeText,
        atsScore,
        skills
    ) => {
        const prompt = `
You are an expert ATS and career mentor.

Analyze the following resume.

ATS Score: ${atsScore}

Skills:
${skills.join(", ")}

Resume:
${resumeText}

Return JSON only.

{
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}
`;

        try {
            const response =
                await ai.models.generateContent({
                    model:
                        "gemini-2.5-flash",
                    contents: prompt,
                });

            return response.text;
        } catch (error) {
            console.error(error);

            return JSON.stringify({
                strengths: [],
                weaknesses: [],
                suggestions: [],
            });
        }
    };