import { GenerateCourseSuggestionsRequest, GenerateCourseSuggestionsResponse, CourseSuggestion } from '../types';
import { generateCourseSuggestions as aiGenerate } from '@/server/ai/helpers/courseGenerator';

export const generateCourseSuggestions = async (
    params: GenerateCourseSuggestionsRequest
): Promise<GenerateCourseSuggestionsResponse> => {
    const { user_input } = params;
    if (!user_input || user_input.trim().length === 0) {
        return { suggestions: [] };
    }
    const raw = await aiGenerate(user_input, params.ai_model || 'gpt-4o-mini');
    // Normalize various plausible shapes into { suggestions: CourseSuggestion[] }
    let suggestions: CourseSuggestion[] = [];
    try {
        if (Array.isArray(raw)) {
            suggestions = raw as unknown as CourseSuggestion[];
        } else if (raw && typeof raw === 'object') {
            const obj = raw as Record<string, unknown>;
            if (Array.isArray(obj.suggestions)) {
                suggestions = obj.suggestions as CourseSuggestion[];
            } else {
                // Some models return an object keyed by indices {"0": {...}, "1": {...}}
                const values = Object.values(obj).filter(v => v && typeof v === 'object');
                if (values.length > 0) suggestions = values as CourseSuggestion[];
            }
        }
    } catch {
        // Fall back to empty suggestions
    }
    return { suggestions };
};


