import { buildGenerateSubtopicsPrompt } from '../prompts/generateSubtopicsPrompt';
import { buildGenerateNodeContentPrompt } from '../prompts/generateNodeContentPrompt';
import { AIModelAdapter } from '../baseModelAdapter';

export async function generateNodeSubtopics(args: {
    courseTitle: string;
    contextChain: string[];
    currentNodeTitle: string;
    count?: number;
    granularity?: 'survey' | 'balanced' | 'deep';
    focus?: string;
    aiModelId: string;
}) {
    const prompt = buildGenerateSubtopicsPrompt(args);
    const adapter = new AIModelAdapter(args.aiModelId);
    const { result } = await adapter.processPromptToJSON<Record<string, unknown>>(prompt, 'nodes/generateSubtopics');
    return result;
}

export async function generateNodeContent(args: {
    courseTitle: string;
    contextChain: string[];
    currentNodeTitle: string;
    readingLevel?: 'plain' | 'intermediate' | 'technical';
    aiModelId: string;
}) {
    const prompt = buildGenerateNodeContentPrompt(args);
    const adapter = new AIModelAdapter(args.aiModelId);
    const { result } = await adapter.processPromptToJSON<Record<string, unknown>>(prompt, 'nodes/generateNodeContent');
    return result;
}


