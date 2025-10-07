import { GenerateSubtopicsRequest, GenerateSubtopicsResponse } from '../types';
import { nodes, courses } from '@/server/database/collections';
import { generateNodeSubtopics } from '@/server/ai/helpers/nodeGenerator';

export const generateSubtopics = async (
    params: GenerateSubtopicsRequest
): Promise<GenerateSubtopicsResponse> => {
    const parent = await nodes.findNodeById(params.node_id);
    if (!parent) throw new Error('Parent node not found');
    const course = await courses.findCourseById(parent.courseId);
    if (!course) throw new Error('Course not found');

    const ancestorTitles: string[] = []; // TODO: traverse full chain if needed
    const raw = await generateNodeSubtopics({
        courseTitle: course.title,
        contextChain: [course.title, ...ancestorTitles, parent.title],
        currentNodeTitle: parent.title,
        count: params.count,
        granularity: params.granularity,
        focus: params.focus,
        aiModelId: params.ai_model || 'gpt-4o-mini',
    });

    const now = new Date();
    const docs = ((raw.subtopics as Array<{ title: string; synopsis: string; time_est_minutes?: number }>) || []).map((s, idx) => ({
        courseId: parent.courseId,
        parentId: parent._id,
        title: s.title,
        synopsis: s.synopsis,
        orderIndex: idx,
        depth: parent.depth + 1,
        timeEstMinutes: s.time_est_minutes,
        isDone: false,
        createdAt: now,
        updatedAt: now,
    }));
    const created = await nodes.createNodesBulk(docs);

    return {
        subtopics: created.map(n => ({
            _id: n._id.toHexString(),
            courseId: n.courseId.toHexString(),
            parentId: n.parentId ? n.parentId.toHexString() : null,
            title: n.title,
            synopsis: n.synopsis,
            orderIndex: n.orderIndex,
            depth: n.depth,
            timeEstMinutes: n.timeEstMinutes,
            isDone: n.isDone,
            createdAt: n.createdAt.toISOString(),
            updatedAt: n.updatedAt.toISOString(),
        }))
    };
};


