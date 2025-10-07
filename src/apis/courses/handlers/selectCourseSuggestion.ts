import type { ApiHandlerContext } from '@/apis/types';
import { ObjectId } from 'mongodb';
import { SelectCourseSuggestionRequest, SelectCourseSuggestionResponse } from '../types';
import { generateCourseStructure } from '@/server/ai/helpers/courseGenerator';
import { generateNodeSubtopics } from '@/server/ai/helpers/nodeGenerator';
import { courses, nodes } from '@/server/database/collections';

export const selectCourseSuggestion = async (
    params: SelectCourseSuggestionRequest,
    context: ApiHandlerContext
): Promise<SelectCourseSuggestionResponse> => {
    const { suggestion, focus_notes } = params;
    console.log('[selectCourseSuggestion] Generating course structure for:', suggestion.title);
    const raw = await generateCourseStructure(suggestion, focus_notes, params.ai_model || 'gpt-4o-mini');
    console.log('[selectCourseSuggestion] Raw AI response:', JSON.stringify(raw, null, 2));
    // Expected raw: { course: {...}, modules: [...] }
    // Normalize modules: some models may nest or rename the array
    type ModuleLike = { title: string; short_title?: string; synopsis: string; time_est_minutes?: number };
    const isModuleArray = (arr: unknown): arr is ModuleLike[] => Array.isArray(arr) && arr.every(it => it && typeof (it as ModuleLike).title === 'string' && typeof (it as ModuleLike).synopsis === 'string');
    const extractModules = (input: unknown): ModuleLike[] => {
        if (!input || typeof input !== 'object') return [];
        const root = input as Record<string, unknown>;
        // 1) direct modules
        const direct = (root as { modules?: unknown }).modules;
        if (isModuleArray(direct)) return direct;
        // 2) course.modules
        if (root.course && typeof root.course === 'object') {
            const nestedModules = (root.course as { modules?: unknown }).modules;
            if (isModuleArray(nestedModules)) return nestedModules;
        }
        // 3) search any array field with title/synopsis objects
        for (const v of Object.values(root)) {
            if (isModuleArray(v)) {
                return v as ModuleLike[];
            }
            if (v && typeof v === 'object') {
                const nested = extractModules(v);
                if (nested.length) return nested;
            }
        }
        return [];
    };
    let rawModules = extractModules(raw);
    const now = new Date();

    const toShortTitle = (t: string): string => {
        const first = t.split(/[–—:\-|]/)[0];
        const cleaned = first.trim();
        return cleaned.length <= 42 ? cleaned : cleaned.slice(0, 39).trimEnd() + '…';
    };

    const courseDoc = await courses.createCourse({
        title: suggestion.title,
        shortTitle: toShortTitle(suggestion.title),
        overviewSummary: suggestion.overview_summary,
        overviewDetail: suggestion.overview_detail,
        difficulty: suggestion.difficulty,
        estTotalMinutes: suggestion.est_total_minutes,
        createdByUserId: context.userId ? new ObjectId(context.userId) : undefined,
        createdAt: now,
        updatedAt: now,
    });

    // Fallback: if AI didn't return modules, synthesize top-level modules using subtopics generator
    if (rawModules.length === 0) {
        console.log('[selectCourseSuggestion] No modules from AI, attempting fallback generation...');
        const fallback = await generateNodeSubtopics({
            courseTitle: suggestion.title,
            contextChain: [suggestion.title],
            currentNodeTitle: 'Course Outline',
            count: 5,
            granularity: 'survey',
            aiModelId: params.ai_model || 'gpt-4o-mini',
        });
        const subs = (fallback as unknown as { subtopics?: ModuleLike[] } | undefined)?.subtopics;
        rawModules = Array.isArray(subs) ? subs : [];
        console.log('[selectCourseSuggestion] Fallback generated', rawModules.length, 'modules');
    }

    // CRITICAL: Do not create a course without modules
    if (rawModules.length === 0) {
        throw new Error('Failed to generate course modules. The AI did not return any modules. Please try again with a different topic or model.');
    }

    const moduleNodes = rawModules.map((m, idx) => ({
        courseId: courseDoc._id,
        parentId: null,
        title: m.title,
        shortTitle: m.short_title || toShortTitle(m.title),
        synopsis: m.synopsis,
        orderIndex: idx,
        depth: 1,
        timeEstMinutes: m.time_est_minutes,
        isDone: false,
        createdAt: now,
        updatedAt: now,
    }));

    const createdModules = await nodes.createNodesBulk(moduleNodes);

    return {
        course_id: courseDoc._id.toHexString(),
        course: {
            _id: courseDoc._id.toHexString(),
            title: courseDoc.title,
            shortTitle: courseDoc.shortTitle,
            overviewSummary: courseDoc.overviewSummary,
            overviewDetail: courseDoc.overviewDetail,
            difficulty: courseDoc.difficulty,
            estTotalMinutes: courseDoc.estTotalMinutes,
            createdByUserId: courseDoc.createdByUserId?.toHexString(),
            createdAt: courseDoc.createdAt.toISOString(),
            updatedAt: courseDoc.updatedAt.toISOString(),
        },
        modules: createdModules.map(m => ({
            _id: m._id.toHexString(),
            courseId: m.courseId.toHexString(),
            parentId: null,
            title: m.title,
            shortTitle: m.shortTitle,
            synopsis: m.synopsis,
            orderIndex: m.orderIndex,
            depth: m.depth,
            timeEstMinutes: m.timeEstMinutes,
            isDone: m.isDone,
            createdAt: m.createdAt.toISOString(),
            updatedAt: m.updatedAt.toISOString(),
        })),
    };
};


