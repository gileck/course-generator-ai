import { CourseClient } from '@/server/database/collections/courses/types';
import { NodeClient } from '@/server/database/collections/nodes/types';

export type { CourseClient, NodeClient };

export interface CourseSuggestion {
    title: string;
    overview_summary: string;
    overview_detail: string;
    difficulty?: string;
    est_total_minutes?: number;
    learning_outcomes: string[];
}

export interface GenerateCourseSuggestionsRequest {
    user_input: string;
    ai_model?: string;
}
export interface GenerateCourseSuggestionsResponse {
    suggestions: CourseSuggestion[];
}

export interface SelectCourseSuggestionRequest {
    suggestion: CourseSuggestion;
    focus_notes?: string;
    ai_model?: string;
}
export interface SelectCourseSuggestionResponse {
    course_id: string;
    course: CourseClient;
    modules: NodeClient[];
}

export type CourseCard = CourseClient & { progress_percentage: number; completed_nodes: number; total_nodes: number };
export interface GetCoursesResponse {
    courses: CourseCard[];
}

export interface GetCourseRequest { course_id: string; }
export interface GetCourseResponse { course: CourseClient; modules: NodeClient[]; }

export interface GetNodeRequest { node_id: string; }
export interface Breadcrumb { id: string; title: string; }
export type NodeDetail = NodeClient;
export interface GetNodeResponse { node: NodeClient; children: NodeClient[]; breadcrumbs: Breadcrumb[]; parent_id?: string | null; }

export interface SetLastViewedRequest { node_id: string; }
export interface SetLastViewedResponse { success: boolean; }

export interface GenerateSubtopicsRequest { node_id: string; count?: number; granularity?: 'survey' | 'balanced' | 'deep'; focus?: string; ai_model?: string; }
export interface GenerateSubtopicsResponse { subtopics: NodeClient[]; }

export interface MarkNodeDoneRequest { node_id: string; }
export interface MarkNodeDoneResponse { success: boolean; node: NodeClient; }

export interface DeleteCourseRequest { course_id: string }
export interface DeleteCourseResponse { success: boolean }


