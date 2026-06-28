import { SKILLS }
    from "../constants/skills.js";

export const extractSkills =
    (text) => {
        const lower =
            text.toLowerCase();

        const found =
            SKILLS.filter((skill) =>
                lower.includes(
                    skill.toLowerCase()
                )
            );

        return [...new Set(found)];
    };

export const calculateATSScore =
    (text, skills) => {
        let score = 0;

        if (
            text.includes("@")
        )
            score += 10;

        if (
            text
                .toLowerCase()
                .includes(
                    "education"
                )
        )
            score += 15;

        if (
            text
                .toLowerCase()
                .includes(
                    "projects"
                )
        )
            score += 25;

        score += Math.min(
            skills.length,
            25
        );

        if (
            text
                .toLowerCase()
                .includes(
                    "achievements"
                )
        )
            score += 15;

        if (
            text.length > 1000
        )
            score += 10;

        return Math.min(
            score,
            100
        );
    };

export const findMissingSkills =
    (
        extractedSkills,
        requiredSkills
    ) => {
        return requiredSkills.filter(
            (skill) =>
                !extractedSkills.includes(
                    skill
                )
        );
    };

export const calculateMatch =
    (
        resumeSkills,
        jdSkills
    ) => {
        const matched =
            jdSkills.filter(
                (skill) =>
                    resumeSkills.includes(
                        skill
                    )
            );

        const missing =
            jdSkills.filter(
                (skill) =>
                    !resumeSkills.includes(
                        skill
                    )
            );

        const score =
            jdSkills.length === 0
                ? 0
                : Math.round(
                    (
                        matched.length /
                        jdSkills.length
                    ) * 100
                );

        return {
            matchedSkills:
                matched,

            missingSkills:
                missing,

            matchScore:
                score,
        };
    };