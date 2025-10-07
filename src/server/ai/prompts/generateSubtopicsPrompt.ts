export const buildGenerateSubtopicsPrompt = (args: {
    courseTitle: string;
    contextChain: string[];
    currentNodeTitle: string;
    count?: number;
    granularity?: 'survey' | 'balanced' | 'deep';
    focus?: string;
    language?: string;
}) => {
    const { courseTitle, contextChain, currentNodeTitle, count = 6, granularity = 'balanced', focus = '' } = args;
    return `Generate subtopics for the current node, using the full context chain. Avoid overlap with ancestors or sibling concepts; keep each subtopic distinct and teachable.

Context:
- Course: "${courseTitle}"
- Path: ${JSON.stringify(contextChain)}
- Current node: "${currentNodeTitle}"
- Desired count: ${count}
- Granularity: ${granularity}
- Focus notes: "${focus}"

Requirements:
- Return ${count} subtopics unless context reasonably limits fewer (min 3).
- Each subtopic: title (≤ 70 chars), short_title (up to 3 words), synopsis (≤ 140 chars), time_est_minutes (5–40).
- short_title must be a human-readable concise label, not truncated mid-word.
- Order from prerequisite → advanced.
- Output JSON only per schema.

Schema (STRICT):
{
  "subtopics": [
    { "title": string, "short_title": string, "synopsis": string, "time_est_minutes": number }
  ]
}
`;
};


