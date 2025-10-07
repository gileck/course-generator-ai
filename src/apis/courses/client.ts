import apiClient from '@/client/utils/apiClient';
import { CacheResult } from '@/common/cache/types';
import type { ApiOptions } from '@/client/utils/apiClient';
import {
    API_GENERATE_COURSE_SUGGESTIONS,
    API_SELECT_COURSE_SUGGESTION,
    API_GET_COURSES,
    API_GET_COURSE,
    API_GET_NODE,
    API_SET_LAST_VIEWED,
    API_GENERATE_SUBTOPICS,
    API_MARK_NODE_DONE,
    API_MARK_NODE_UNDONE,
    API_DELETE_COURSE,
} from './index';
import {
    GenerateCourseSuggestionsRequest,
    GenerateCourseSuggestionsResponse,
    SelectCourseSuggestionRequest,
    SelectCourseSuggestionResponse,
    GetCoursesResponse,
    GetCourseRequest,
    GetCourseResponse,
    GetNodeRequest,
    GetNodeResponse,
    SetLastViewedRequest,
    SetLastViewedResponse,
    GenerateSubtopicsRequest,
    GenerateSubtopicsResponse,
    MarkNodeDoneRequest,
    MarkNodeDoneResponse,
    DeleteCourseRequest,
    DeleteCourseResponse,
} from './types';

export const generateCourseSuggestions = async (
    params: GenerateCourseSuggestionsRequest,
    options?: ApiOptions
): Promise<CacheResult<GenerateCourseSuggestionsResponse>> => {
    return apiClient.post(API_GENERATE_COURSE_SUGGESTIONS, params, options);
};

export const selectCourseSuggestion = async (
    params: SelectCourseSuggestionRequest
): Promise<CacheResult<SelectCourseSuggestionResponse>> => {
    return apiClient.post(API_SELECT_COURSE_SUGGESTION, params);
};

export const getCourses = async (
    options?: ApiOptions
): Promise<CacheResult<GetCoursesResponse>> => {
    return apiClient.call(API_GET_COURSES, {}, options);
};

export const getCourse = async (
    params: GetCourseRequest,
    options?: ApiOptions
): Promise<CacheResult<GetCourseResponse>> => {
    return apiClient.call(API_GET_COURSE, params, options);
};

export const getNode = async (
    params: GetNodeRequest,
    options?: ApiOptions
): Promise<CacheResult<GetNodeResponse>> => {
    return apiClient.call(API_GET_NODE, params, options);
};

export const setLastViewed = async (
    params: SetLastViewedRequest
): Promise<CacheResult<SetLastViewedResponse>> => {
    return apiClient.post(API_SET_LAST_VIEWED, params);
};

export const generateSubtopics = async (
    params: GenerateSubtopicsRequest
): Promise<CacheResult<GenerateSubtopicsResponse>> => {
    return apiClient.post(API_GENERATE_SUBTOPICS, params);
};

export const markNodeDone = async (
    params: MarkNodeDoneRequest
): Promise<CacheResult<MarkNodeDoneResponse>> => {
    return apiClient.post(API_MARK_NODE_DONE, params);
};

export const markNodeUndone = async (
    params: MarkNodeDoneRequest
): Promise<CacheResult<MarkNodeDoneResponse>> => {
    return apiClient.post(API_MARK_NODE_UNDONE, params);
};

export const deleteCourse = async (
    params: DeleteCourseRequest
): Promise<CacheResult<DeleteCourseResponse>> => {
    return apiClient.post(API_DELETE_COURSE, params);
};


