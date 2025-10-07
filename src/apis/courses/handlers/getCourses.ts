import { ApiHandlerContext } from '@/apis/types';
import { GetCoursesResponse } from '../types';
import { courses, nodes } from '@/server/database/collections';

export const getCourses = async (
    _params: unknown,
    context: ApiHandlerContext
): Promise<GetCoursesResponse> => {
    const list = await courses.findCoursesByUser(context.userId);
    const results = await Promise.all(list.map(async (c) => {
        const children = await nodes.findChildren(c._id, null);
        const total = children.length;
        const completed = children.filter(n => n.isDone).length;
        const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
        return {
            _id: c._id.toHexString(),
            title: c.title,
            overviewSummary: c.overviewSummary,
            overviewDetail: c.overviewDetail,
            difficulty: c.difficulty,
            estTotalMinutes: c.estTotalMinutes,
            createdByUserId: c.createdByUserId?.toHexString(),
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
            progress_percentage: pct,
            completed_nodes: completed,
            total_nodes: total,
        };
    }));
    return { courses: results };
};


