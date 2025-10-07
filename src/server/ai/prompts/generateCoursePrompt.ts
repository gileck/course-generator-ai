export const buildGenerateCoursePrompt = (selected: {
  title: string;
  overview_summary: string;
  overview_detail: string;
  difficulty?: string;
}, focusNotes: string | undefined): string => {
  const notes = focusNotes ? `\n- Notes: ${focusNotes}` : '';
  return `Create a course scaffold (top-level modules only) for the selected direction.

Selected course:
- Title: ${selected.title}
- Summary: ${selected.overview_summary}
- Detail: ${selected.overview_detail}
- Difficulty: ${selected.difficulty || 'Beginner'}
${notes}

Requirements:
- Produce 4–8 top-level modules (no subtopics yet).
- Each module: title (≤ 70 chars), short_title (concise ≤ 32 chars), synopsis (≤ 140 chars).
- Modules should be ordered from foundational → applied.
- CRITICAL: You MUST return a JSON object with a "modules" array. Do not return an empty array.
- Output ONLY valid JSON in this exact format:
{
  "modules": [
    {
      "title": "Module 1 Title",
      "short_title": "Module 1",
      "synopsis": "Brief description of module 1"
    },
    {
      "title": "Module 2 Title",
      "short_title": "Module 2",
      "synopsis": "Brief description of module 2"
    }
  ]
}
`;
};


