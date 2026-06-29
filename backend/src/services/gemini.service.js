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

export const generateInterviewQuestions = async (role, company, difficulty, resumeContext, jdContext) => {
    const resumeSkills = resumeContext?.skills || [];
    const missingSkills = jdContext?.missingSkills || [];

    const prompt = `
You are an expert technical interviewer at ${company || "a top tech company"}, interviewing a candidate for the role of ${role}.
The difficulty level of this interview should be: ${difficulty || "Medium"}.
Based on the candidate's profile:
- Their existing skills: ${resumeSkills.join(", ")}
- Skills they might be missing or need to improve: ${missingSkills.join(", ")}

Generate exactly 5 to 7 highly relevant interview questions.
Ensure there is a mix of:
1. Technical Questions (testing their core skills)
2. Behavioral Questions (communication, teamwork)
3. Project Questions (based on their practical experience)

Return ONLY a valid JSON array of strings containing the questions. Do NOT wrap it in markdown code blocks. Example:
[
  "Tell me about a time you...",
  "How would you optimize..."
]
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Failed to generate questions:", error);
        return [
            "Tell me about your background and experience.",
            `Why are you interested in the ${role} role?`,
            "What is your greatest technical strength?",
            "Describe a challenging project you worked on.",
            "Where do you see yourself in 5 years?"
        ];
    }
};

export const evaluateInterview = async (role, company, answers) => {
    const prompt = `
You are an expert technical interviewer at ${company || "a top tech company"} evaluating a candidate for the role of ${role}.
The candidate was asked the following questions and provided these answers:
${JSON.stringify(answers, null, 2)}

For each answer, evaluate the candidate on:
- Correctness
- Communication
- Depth
- Examples provided

Score the candidate using this exact rubric:
- Technical Accuracy (0-40)
- Communication (0-20)
- Problem Solving (0-20)
- Project Knowledge (0-20)

Based on their performance, create a detailed improvement plan.
Format the output as a valid JSON object matching this schema exactly:
{
  "score": {
    "technicalAccuracy": number,
    "communication": number,
    "problemSolving": number,
    "projectKnowledge": number,
    "total": number // sum of the above
  },
  "feedback": {
    "strengths": ["list", "of", "strengths"],
    "weaknesses": ["list", "of", "weaknesses"],
    "suggestions": ["list", "of", "actionable", "suggestions"]
  },
  "improvementPlan": {
    "topicsToStudy": ["topic 1", "topic 2"],
    "projectsToBuild": ["project idea 1"],
    "resourcesToLearn": ["resource 1"],
    "thirtyDayPlan": "Detailed markdown string explaining a day-by-day or week-by-week 30 day learning plan."
  }
}
Return ONLY the JSON object. Do not include markdown code blocks around the JSON.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Failed to evaluate interview:", error);
        return {
            score: { technicalAccuracy: 0, communication: 0, problemSolving: 0, projectKnowledge: 0, total: 0 },
            feedback: { strengths: [], weaknesses: [], suggestions: ["Evaluation failed."] },
            improvementPlan: { topicsToStudy: [], projectsToBuild: [], resourcesToLearn: [], thirtyDayPlan: "N/A" }
        };
    }
};