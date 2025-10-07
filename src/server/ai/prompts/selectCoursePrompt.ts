export const buildSelectCoursePrompt = (
    userInput: string,
    refineInput?: string,
    previousSuggestions?: unknown[]
): string => {
    const refineSection = refineInput && refineInput.trim().length > 0
        ? `\nRefinement notes (higher priority, provided later by the user):\n"${refineInput}"\n`
        : '';
    const previousSection = Array.isArray(previousSuggestions) && previousSuggestions.length > 0
        ? `\nPreviously shown suggestions (avoid repeating unless clearly the best):\n${JSON.stringify(previousSuggestions, null, 2)}\n`
        : '';
    return `You are an expert curriculum designer. Interpret the learner's topic and propose up to three distinct course directions.

Original user input:
"${userInput}"
${refineSection}${previousSection}
Requirements:
    - Offer 1–3 diverse course options that better align with the latest refinement while respecting the original intent.
    - If refinement conflicts with the original input, prefer the refinement.
    - Avoid duplicating earlier options unless the refinement suggests the same direction explicitly.
    - Each option must include: title, overview_summary, overview_detail, difficulty, learning_outcomes (3–6).
    - Keep titles ≤ 70 chars; summaries ≤ 180 chars; outcomes each ≤ 120 chars.
    - Choose the most appropriate difficulty.
    - Do not include any time/duration fields.
    - Output JSON only conforming to the provided schema.
`;
};


