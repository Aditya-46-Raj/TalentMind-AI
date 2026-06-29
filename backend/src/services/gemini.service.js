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

export const generateJobAnalysis =
    async (
        resumeSkills,
        jdSkills,
        matchedSkills,
        missingSkills,
        matchScore
    ) => {
        const prompt = `
You are an expert ATS and career mentor.

Analyze the user's resume skills against the Job Description skills.

Match Score: ${matchScore}%
Resume Skills: ${resumeSkills.join(", ")}
JD Skills: ${jdSkills.join(", ")}
Matched Skills: ${matchedSkills.join(", ")}
Missing Skills: ${missingSkills.join(", ")}

Return JSON only with the following structure:
{
  "strengths": ["string"],
  "weaknesses": ["string"],
  "suggestions": ["string"],
  "roadmap": ["string"]
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
                roadmap: [],
            });
        }
    };

export const generateChatResponse = async (context, chatHistory, userMessage) => {
    const prompt = `
You are TalentMind AI, an expert career mentor.

Here is the user's profile:
${JSON.stringify(context.profile || "No profile available", null, 2)}

Here is the user's latest resume details:
${JSON.stringify(context.resume || "No resume available", null, 2)}

Here is the user's latest job analysis:
${JSON.stringify(context.jobAnalysis || "No job analysis available", null, 2)}

Answer the user's question concisely, helpfully, and highly personalized based on the provided context. Do not repeat the context back to them.

Chat History:
${chatHistory.map(m => `${m.role === 'user' ? 'User' : 'TalentMind AI'}: ${m.content}`).join('\n')}

User: ${userMessage}
TalentMind AI:
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error(error);
        return "I'm sorry, I'm currently experiencing high demand. Please try again later.";
    }
};