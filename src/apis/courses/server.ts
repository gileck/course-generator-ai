export * from './index';

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

import { generateCourseSuggestions } from './handlers/generateCourseSuggestions';
import { selectCourseSuggestion } from './handlers/selectCourseSuggestion';
import { getCourses } from './handlers/getCourses';
import { getCourse } from './handlers/getCourse';
import { getNode } from './handlers/getNode';
import { setLastViewed } from './handlers/setLastViewed';
import { generateSubtopics } from './handlers/generateSubtopics';
import { markNodeDone } from './handlers/markNodeDone';
import { markNodeUndone } from './handlers/markNodeUndone';
import { deleteCourse } from './handlers/deleteCourse';

export const coursesApiHandlers = {
    [API_GENERATE_COURSE_SUGGESTIONS]: { process: generateCourseSuggestions },
    [API_SELECT_COURSE_SUGGESTION]: { process: selectCourseSuggestion },
    [API_GET_COURSES]: { process: getCourses },
    [API_GET_COURSE]: { process: getCourse },
    [API_GET_NODE]: { process: getNode },
    [API_SET_LAST_VIEWED]: { process: setLastViewed },
    [API_GENERATE_SUBTOPICS]: { process: generateSubtopics },
    [API_MARK_NODE_DONE]: { process: markNodeDone },
    [API_MARK_NODE_UNDONE]: { process: markNodeUndone },
  [API_DELETE_COURSE]: { process: deleteCourse },
};


