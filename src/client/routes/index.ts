import { Home } from './Home';
import { NotFound } from './NotFound';
import { AIChat } from './AIChat';
import { Settings } from './Settings';
import { Todos } from './Todos';
import { SingleTodo } from './SingleTodo';
import { createRoutes } from '../router';
import { Profile } from './Profile';
import { CourseSuggestions } from './CourseSuggestions';
import { CourseDashboard } from './CourseDashboard';
import { NodePage } from './NodePage';
import { AllCourses } from './AllCourses';
import { RecentlyViewed } from './RecentlyViewed';
// Define routes
export const routes = createRoutes({
  '/': Home,
  '/courses': AllCourses,
  '/recent': RecentlyViewed,
  '/course-suggestions': CourseSuggestions,
  '/courses/:courseId': CourseDashboard,
  '/courses/:courseId/nodes/:nodeId': NodePage,
  '/ai-chat': AIChat,
  '/todos': Todos,
  '/todos/:todoId': SingleTodo,
  '/settings': Settings,
  '/not-found': NotFound,
  '/profile': Profile,
});
