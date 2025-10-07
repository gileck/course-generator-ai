// context intentionally unused (auth optional)
import { GetCourseRequest, GetCourseResponse } from '../types';
import { courses, nodes } from '@/server/database/collections';

export const getCourse = async (
    params: GetCourseRequest
): Promise<GetCourseResponse> => {
    const course = await courses.findCourseById(params.course_id);
    if (!course) {
        throw new Error('Course not found');
    }
    const modules = await nodes.findChildren(course._id, null);
    return {
        course: {
            _id: course._id.toHexString(),
            title: course.title,
            shortTitle: course.shortTitle,
            overviewSummary: course.overviewSummary,
            overviewDetail: course.overviewDetail,
            difficulty: course.difficulty,
            estTotalMinutes: course.estTotalMinutes,
            createdByUserId: course.createdByUserId?.toHexString(),
            createdAt: course.createdAt.toISOString(),
            updatedAt: course.updatedAt.toISOString(),
        },
        modules: modules.map(m => ({
            _id: m._id.toHexString(),
            courseId: m.courseId.toHexString(),
            parentId: null,
            title: m.title,
            shortTitle: m.shortTitle,
            synopsis: m.synopsis,
            orderIndex: m.orderIndex,
            depth: m.depth,
            // timeEstMinutes removed from UI
            isDone: m.isDone,
            createdAt: m.createdAt.toISOString(),
            updatedAt: m.updatedAt.toISOString(),
        })),
    };
};


