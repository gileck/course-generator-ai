export const buildSelectCoursePrompt = (userInput: string): string => {
    return `You are an expert curriculum designer. Interpret the learner's topic and propose up to three distinct course directions.

User input:
"${userInput}"

Requirements:
- Offer 1–3 diverse course options.
- Each option must include: title, overview_summary, overview_detail, difficulty, est_total_minutes, learning_outcomes (3–6).
- Keep titles ≤ 70 chars; summaries ≤ 180 chars; outcomes each ≤ 120 chars.
- Choose the most appropriate difficulty.
- Estimate duration in minutes for a focused mini-degree.
- Output JSON only conforming to the provided schema.
`;
};


