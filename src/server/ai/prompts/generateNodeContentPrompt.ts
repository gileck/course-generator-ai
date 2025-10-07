export const buildGenerateNodeContentPrompt = (args: {
  courseTitle: string;
  contextChain: string[];
  currentNodeTitle: string;
  readingLevel?: 'plain' | 'intermediate' | 'technical';
  language?: string;
}) => {
  const { courseTitle, contextChain, currentNodeTitle, readingLevel = 'plain' } = args;
  return `Write concise, accurate learning content for the current node. Use the full context chain to stay consistent with the course’s direction. Generate the three tab views.

Context:
- Course: "${courseTitle}"
- Path: ${JSON.stringify(contextChain)}
- Current node: "${currentNodeTitle}"
- Reading level: ${readingLevel}

Tab requirements:
- OVERVIEW (markdown): 2–4 short paragraphs + 3–6 bullet learning outcomes. Plain language; max ~350 words.
- DEEP_DIVE (markdown): Focused technical detail, mechanisms, caveats, and common misconceptions. Add 1 short illustrative example. Max ~500 words.
- TERMINOLOGY (markdown): 8–15 concise term: definition pairs in bullet list form (e.g., **Term** — definition).

JSON output schema (STRICT):
{
  "overview": string,               // markdown (2–4 short paragraphs + 3–6 bullets)
  "deepDive": string,               // markdown (focused technical detail + 1 example)
  "terminology": string,            // markdown bullets: "**Term** — definition"
  "difficulty": "Beginner" | "Intermediate" | "Advanced"
}

Example (format only):
{
  "overview": "## Overview...\n- ...",
  "deepDive": "## Deep Dive...",
  "terminology": "- **ATP** — ...\n- **Glycolysis** — ...",
  "difficulty": "Beginner"
}

Style:
- Avoid fluff; be precise and neutral.
- Use markdown headings (##) sparingly.
- No external links or citations.
- Output ONLY valid JSON per the schema, with EXACT keys. No extra fields.
- Do NOT wrap the JSON in code fences.
`;
};


