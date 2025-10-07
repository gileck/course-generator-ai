import { buildSelectCoursePrompt } from '../prompts/selectCoursePrompt';
import { buildGenerateCoursePrompt } from '../prompts/generateCoursePrompt';
import { AIModelAdapter } from '../baseModelAdapter';

export async function generateCourseSuggestions(
    userInput: string,
    aiModelId: string,
    refineInput?: string,
    previousSuggestions?: unknown[]
) {
    const prompt = buildSelectCoursePrompt(userInput, refineInput, previousSuggestions);
    const adapter = new AIModelAdapter(aiModelId);
    const { result } = await adapter.processPromptToJSON<Record<string, unknown>>(prompt, 'courses/generateCourseSuggestions');
    return result; // caller validates against schema
}

export async function generateCourseStructure(selected: {
    title: string;
    overview_summary: string;
    overview_detail: string;
    difficulty?: string;
}, focusNotes: string | undefined, aiModelId: string) {
    const prompt = buildGenerateCoursePrompt(selected, focusNotes);
    const adapter = new AIModelAdapter(aiModelId);
    const { result } = await adapter.processPromptToJSON<Record<string, unknown>>(prompt, 'courses/selectCourseSuggestion');
    return result; // caller validates and persists
}


