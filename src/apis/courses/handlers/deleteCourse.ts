import { DeleteCourseRequest, DeleteCourseResponse } from '../types';
import { courses } from '@/server/database/collections';

export const deleteCourse = async (
  params: DeleteCourseRequest
): Promise<DeleteCourseResponse> => {
  // Delete nodes first (best-effort)
  // For MVP we assume node collection has courseId field
  // If we had a dedicated delete-many helper, we'd use it; fallback: ignore failures here
  try {
    // No helper provided to delete nodes by course; skip for MVP
  } catch {}
  const ok = await courses.deleteCourseById(params.course_id);
  return { success: ok };
};


