# Learn Anything - Implementation Plan

This document provides a detailed, actionable task list for implementing the Learn Anything MVP, organized by user flow and following the app guidelines.

---

## Table of Contents

1. [Phase 0: Database & Infrastructure Setup](#phase-0-database--infrastructure-setup)
2. [Phase 1: Generate Course Flow](#phase-1-generate-course-flow)
3. [Phase 2: View Course & Navigate to Nodes](#phase-2-view-course--navigate-to-nodes)
4. [Phase 3: Generate Node Content](#phase-3-generate-node-content)
5. [Phase 4: Generate Subtopics Flow](#phase-4-generate-subtopics-flow)
6. [Phase 5: Polish & Compliance](#phase-5-polish--compliance)

---

## Foundations: Database & AI

### Database Collections

- [ ] **Create Course Collection** (`src/server/database/collections/courses.ts`)
  - [ ] Define collection name constant
  - [ ] Create TypeScript interface matching schema: `id`, `created_by_user_id`, `title`, `overview_summary`, `overview_detail`, `difficulty`, `est_total_minutes`, `learning_outcomes`, `created_at`, `updated_at`
  - [ ] Implement `getCourseCollection()` helper
  - [ ] Create indexes: `created_by_user_id`, `created_at`

- [ ] **Create Node Collection** (`src/server/database/collections/nodes.ts`)
  - [ ] Define collection name constant
  - [ ] Create TypeScript interface matching schema: `id`, `course_id`, `parent_id`, `title`, `synopsis`, `order_index`, `depth`, `time_est_minutes`, `tab_overview_md`, `tab_deep_dive_md`, `tab_terminology_md`, `is_done`, `done_at`, `last_viewed_at`, `created_at`, `updated_at`
  - [ ] Implement `getNodeCollection()` helper
  - [ ] Create indexes: `course_id`, `parent_id`, `course_id + order_index`, `course_id + parent_id + order_index`

### AI Integration Setup

- [ ] **Setup AI Prompt Templates** (`src/server/ai/prompts/`)
  - [ ] Create `selectCoursePrompt.ts` - template for Prompt #1 from AI-Prompts.md
  - [ ] Create `generateCoursePrompt.ts` - template for Prompt #2 from AI-Prompts.md
  - [ ] Create `generateSubtopicsPrompt.ts` - template for Prompt #3 from AI-Prompts.md
  - [ ] Create `generateNodeContentPrompt.ts` - template for Prompt #4 from AI-Prompts.md
  - [ ] Export all prompts from `src/server/ai/prompts/index.ts`

- [ ] **Create AI Helper Functions** (`src/server/ai/helpers/`)
  - [ ] Create `courseGenerator.ts` with `generateCourseSuggestions()` function
  - [ ] Create `courseGenerator.ts` with `generateCourseStructure()` function
  - [ ] Create `nodeGenerator.ts` with `generateNodeContent()` function
  - [ ] Create `nodeGenerator.ts` with `generateNodeSubtopics()` function
  - [ ] Add JSON schema validation for each AI response
  - [ ] Add retry logic for AI failures
  - [ ] Add token counting and cost tracking

---

## Flow 1: Generate Course

### User Flow: Home → Course Suggestions → Course Generation → Course Dashboard

### 1.1 API: Courses module (generation + fetching)

- [ ] **Create Courses API Module** (`src/apis/courses/`)
  
  - [ ] **Create `index.ts`**
    - [ ] Export API name constants (domain-prefixed):
      - [ ] `export const API_GENERATE_COURSE_SUGGESTIONS = 'courses/generateCourseSuggestions'`
      - [ ] `export const API_SELECT_COURSE_SUGGESTION = 'courses/selectCourseSuggestion'`
      - [ ] `export const API_GET_COURSE = 'courses/getCourse'`
      - [ ] `export const API_GET_USER_COURSES = 'courses/getUserCourses'`

  - [ ] **Create `types.ts`**
    - [ ] Import client-facing DB types from collections (avoid duplication):
      - [ ] `import { CourseClient } from '@/server/database/collections/courses/types'`
      - [ ] `import { NodeClient } from '@/server/database/collections/nodes/types'`
    - [ ] Define `CourseSuggestion`: `title`, `overview_summary`, `overview_detail`, `difficulty`, `est_total_minutes`, `learning_outcomes[]`
    - [ ] Define `GenerateCourseSuggestionsRequest`: `user_input`, `language?`
    - [ ] Define `GenerateCourseSuggestionsResponse`: `suggestions: CourseSuggestion[]`
    - [ ] Define `SelectCourseSuggestionRequest`: `suggestion: CourseSuggestion`, `focus_notes?`
    - [ ] Define `SelectCourseSuggestionResponse`: `course_id: string`, `course: CourseClient`, `modules: NodeClient[]`
    - [ ] Define `Module` alias (top-level node): `NodeClient` with `depth=1`, `parent_id=null`
    - [ ] Define `GetCourseRequest`: `course_id: string`
    - [ ] Define `GetCourseResponse`: `course: CourseClient`, `modules: NodeClient[]`
    - [ ] Define `GetUserCoursesResponse`: `courses: CourseWithProgress[]`
    - [ ] Define `CourseWithProgress`: `CourseClient` + `progress_percentage`, `completed_nodes`, `total_nodes`

  - [ ] **Create `server.ts`**
    - [ ] `export * from './index'`
    - [ ] Import AI helpers: `generateCourseSuggestions`, `generateCourseStructure`
    - [ ] Import DB collection helpers
    - [ ] Export consolidated handlers map `coursesApiHandlers`:
      - [ ] `export const coursesApiHandlers = { [API_X]: { process: handler }, ... }` (same pattern as `todosApiHandlers`)

  - [ ] **Create `handlers/generateCourseSuggestions.ts`**
    - [ ] Validate user input (not empty, reasonable length)
    - [ ] Call AI `generateCourseSuggestions(user_input, language)`
    - [ ] Parse and validate JSON response against schema
    - [ ] Return 1-3 suggestions
    - [ ] Handle errors gracefully

  - [ ] **Create `handlers/selectCourseSuggestion.ts`**
    - [ ] Validate suggestion data
    - [ ] Call AI `generateCourseStructure(suggestion, focus_notes)`
    - [ ] Parse response: course metadata + modules array
    - [ ] Generate unique course ID
    - [ ] Insert course into database with user context
    - [ ] Insert top-level modules as nodes (depth=1, parent_id=null)
    - [ ] Set `order_index` for each module
    - [ ] Return `course_id`, full course, and modules array

  - [ ] **Create `handlers/getCourse.ts`**
    - [ ] Query course by ID
    - [ ] Query all top-level nodes (modules) for the course
    - [ ] Calculate progress: count nodes with `is_done = true` / total nodes
    - [ ] Return course + modules with progress

  - [ ] **Create `handlers/getUserCourses.ts`**
    - [ ] Get user context
    - [ ] Query all courses by user (or all if single-user MVP)
    - [ ] For each course, calculate progress percentage
    - [ ] Sort by `updated_at` DESC
    - [ ] Return array of courses with progress

  - [ ] **Wire handlers in `server.ts`**
    - [ ] Add entries to `coursesApiHandlers`

  - [ ] **Create `client.ts`**
    - [ ] Import API names from `index.ts` only (NEVER from `server.ts`)
    - [ ] Import types from `types.ts`
    - [ ] Create `generateCourseSuggestions()` returning `CacheResult<GenerateCourseSuggestionsResponse>`
    - [ ] Create `selectCourseSuggestion()` returning `CacheResult<SelectCourseSuggestionResponse>`
    - [ ] Create `getCourse()` returning `CacheResult<GetCourseResponse>`
    - [ ] Create `getUserCourses()` returning `CacheResult<GetUserCoursesResponse>`
    - [ ] Use `apiClient` for all calls

  - [ ] **Register API in `src/apis/apis.ts`**
    - [ ] Import `{ coursesApiHandlers }` from `./courses/server`
    - [ ] Spread into `apiHandlers` (like Todos): `...typedCoursesApiHandlers`
    - [ ] Ensure handler signature `(params, context)` matches `processApiCall`

### 1.2 UI: Home Screen (Generate Page) — Update existing route

- [ ] **Update Home Route** (`src/client/routes/Home/`)
  
  - [ ] **Create `index.ts`**
    - [ ] Export `Home` component as default

  - [ ] **Create `Home.tsx`**
    - [ ] Import Layout component
    - [ ] Create state: `userInput` (string), `isGenerating` (boolean)
    - [ ] Render centered input field with gradient background
    - [ ] Apply design tokens: dark gradient background (#0B0C1A → #191B35)
    - [ ] Large rounded text input (glassmorphic style)
    - [ ] Placeholder: "What do you want to learn today?"
    - [ ] Show example hints below input (small chips)
    - [ ] Primary CTA: "Generate" button (gradient pill, #5B5FFF → #9A6BFF)
    - [ ] Disable button and show loading state when generating
    - [ ] Handle button click: validate input, call API, navigate to suggestions
    - [ ] Add error handling with user-friendly messages
    - [ ] Responsive: mobile-first, scales up to desktop

  - [ ] **Create `HomeInput.tsx` component**
    - [ ] Props: `value`, `onChange`, `onSubmit`, `disabled`
    - [ ] Render input with icon
    - [ ] Apply focus states and glow effect
    - [ ] Handle Enter key submission
    - [ ] Minimum 44px touch target

  - [ ] **Create `ExampleHints.tsx` component**
    - [ ] Display 3-4 example topics as small clickable pills
    - [ ] On click, populate input field
    - [ ] Style: subtle border, text/secondary color

### 1.3 UI: Course Suggestions Page

- [ ] **Create Course Suggestions Route** (`src/client/routes/CourseSuggestions/`)
  
  - [ ] **Create `index.ts`**
    - [ ] Export `CourseSuggestions` component as default

  - [ ] **Create `CourseSuggestions.tsx`**
    - [ ] Get suggestions from navigation state or query param
    - [ ] Create state: `suggestions`, `selectedSuggestion`, `isGenerating`
    - [ ] Render header: "Choose Your Learning Path"
    - [ ] Render subtext: "Based on your topic, here are a few ways to explore it."
    - [ ] Render list of course suggestion cards (vertically scrollable)
    - [ ] Each card shows: title, overview_summary, difficulty, duration chips
    - [ ] Cards are expandable (accordion) to show full details + learning outcomes
    - [ ] "Select" button on each card
    - [ ] Footer with "Regenerate suggestions" and "Edit your question" links
    - [ ] Handle selection: call `selectCourseSuggestion` API, show loading, navigate to course dashboard
    - [ ] Apply design tokens: cards with 16px radius, frosted glass effect
    - [ ] Staggered fade-in animation for cards

  - [ ] **Create `CourseSuggestionCard.tsx` component**
    - [ ] Props: `suggestion`, `onSelect`, `isExpanded`, `onToggle`
    - [ ] Render compact view: title, summary, chips
    - [ ] Render expanded view: + learning outcomes list
    - [ ] "Select" button with gradient fill
    - [ ] Hover glow effect
    - [ ] Responsive layout

  - [ ] **Create `LoadingOverlay.tsx` component**
    - [ ] Full-screen overlay with gradient background
    - [ ] Glowing AI orb animation
    - [ ] Text: "Building your personalized course..."
    - [ ] Subtext: "Creating learning goals and modules just for you."
    - [ ] Shimmer placeholders

### 1.4 UI: Course Dashboard Page

- [ ] **Create Course Dashboard Route** (`src/client/routes/CourseDashboard/`)
  
  - [ ] **Create `index.ts`**
    - [ ] Export `CourseDashboard` component as default

  - [ ] **Create `CourseDashboard.tsx`**
    - [ ] Get `course_id` from URL params
    - [ ] Use `DataFetcherWrapper` to fetch course data via `getCourse` API
    - [ ] Render breadcrumbs: "Home › Courses › [Title]"
    - [ ] Render back button: "← My Courses"
    - [ ] Render course title (H1, large)
    - [ ] Render progress bar (thin gradient line, animated)
    - [ ] Render info chips: Difficulty / Duration / Modules count
    - [ ] Primary CTA: "Continue Learning" (navigates to first incomplete module)
    - [ ] Overview section: "What You'll Learn"
      - [ ] Display `overview_detail` (2-3 paragraphs)
      - [ ] Display `learning_outcomes` as bullet list
      - [ ] Small "AI Generated" badge
    - [ ] Modules section: "Modules"
      - [ ] List of module cards
      - [ ] Each card: number, title, synopsis, progress pill (X/Y done), estimated time, "Open" button
      - [ ] Green checkmark if module fully completed
      - [ ] Cards are tappable
    - [ ] Apply design tokens: dark background (#0C0E1A), card shadows
    - [ ] Handle loading, empty, and error states

  - [ ] **Create `CourseHeader.tsx` component**
    - [ ] Props: `course`, `progress`
    - [ ] Render title, progress bar, chips, CTA button
    - [ ] Responsive layout

  - [ ] **Create `CourseOverview.tsx` component**
    - [ ] Props: `overview_detail`, `learning_outcomes`
    - [ ] Render markdown content for overview
    - [ ] Render bullet list for outcomes
    - [ ] "AI Generated" badge

  - [ ] **Create `ModuleCard.tsx` component**
    - [ ] Props: `module`, `onClick`, `progress`, `isComplete`
    - [ ] Render module number, title, synopsis
    - [ ] Progress indicator: "X/Y done"
    - [ ] Estimated time
    - [ ] Completion checkmark
    - [ ] Hover and pressed states
    - [ ] Navigate to node page on click

  - [ ] **Create `ProgressBar.tsx` component**
    - [ ] Props: `percentage`
    - [ ] Render thin gradient line
    - [ ] Animate from 0 to target percentage on mount
    - [ ] Use ease-out animation

---

## Flow 2: Generate Node Content

### 2.1 API: Get Node Data

- [ ] **Extend Courses API Module** (`src/apis/courses/`)

  - [ ] **Update `index.ts`**
    - [ ] Export `API_GET_NODE` constant

  - [ ] **Update `types.ts`**
    - [ ] Define `NodeDetail` type: full node with all tab content
    - [ ] Define `GetNodeRequest`: `node_id: string`
    - [ ] Define `GetNodeResponse`: `node: NodeDetail`, `children: Node[]`, `breadcrumbs: Breadcrumb[]`, `parent_id?: string`
    - [ ] Define `Breadcrumb` type: `id`, `title`

  - [ ] **Create `handlers/getNode.ts`**
    - [ ] Query node by ID
    - [ ] Query child nodes (ordered by `order_index`)
    - [ ] Build breadcrumb trail by traversing `parent_id` chain up to course
    - [ ] Return node, children, breadcrumbs, parent_id

  - [ ] **Update `server.ts`**
    - [ ] Export `getNode` handler

  - [ ] **Update `client.ts`**
    - [ ] Create `getNode()` returning `CacheResult<GetNodeResponse>`

  - [ ] **Register in `src/apis/apis.ts`**
    - [ ] Add getNode handler to API registry

---

### 2.2 API: Generate Node Content (Tabs)

- [ ] **Extend Courses API Module** (`src/apis/courses/`)

  - [ ] **Update `index.ts`**
    - [ ] Export `API_GENERATE_NODE_CONTENT` constant

  - [ ] **Update `types.ts`**
    - [ ] Define `GenerateNodeContentRequest`: `node_id: string`, `reading_level?: string`
    - [ ] Define `GenerateNodeContentResponse`: `overview_md`, `deep_dive_md`, `terminology_md`, `suggested_time_minutes`, `suggested_difficulty`

  - [ ] **Create `handlers/generateNodeContent.ts`**
    - [ ] Query node by ID
    - [ ] Build context chain: traverse up to course, collect all ancestor titles
    - [ ] Validate node exists and belongs to user's course
    - [ ] Call AI `generateNodeContent(course_title, context_chain, node_title, reading_level)`
    - [ ] Parse and validate JSON response
    - [ ] Update node with tab content: `tab_overview_md`, `tab_deep_dive_md`, `tab_terminology_md`
    - [ ] Update `updated_at` timestamp
    - [ ] Return generated content

  - [ ] **Update `server.ts`**
    - [ ] Export `generateNodeContent` handler

  - [ ] **Update `client.ts`**
    - [ ] Create `generateNodeContent()` returning `CacheResult<GenerateNodeContentResponse>`

  - [ ] **Register in `src/apis/apis.ts`**
    - [ ] Add generateNodeContent handler to API registry

### 2.3 UI: Node Page (Without Subtopics)

- [ ] **Create Node Page Route** (`src/client/routes/NodePage/`)
  
  - [ ] **Create `index.ts`**
    - [ ] Export `NodePage` component as default

  - [ ] **Create `NodePage.tsx`**
    - [ ] Get `node_id` from URL params
    - [ ] Use `DataFetcherWrapper` to fetch node data via `getNode` API
    - [ ] Render breadcrumbs from breadcrumb trail
    - [ ] Render back button: "← Back to [Parent]"
    - [ ] Render node title (H1)
    - [ ] Render horizontal tab bar: Overview / Deep Dive / Terminology
    - [ ] Active tab has gradient underline
    - [ ] Tab content area with fade transition
    - [ ] If tab content is empty, show "Generate Content" button
    - [ ] Call `generateNodeContent` API when generating
    - [ ] Show loading shimmer while generating
    - [ ] Subtopics section (initially empty - Phase 4)
    - [ ] Bottom sticky footer with "Mark as Done" button
    - [ ] Handle "Mark as Done": update node, show green flash, navigate back to parent
    - [ ] Apply design tokens: dark background (#0A0A17), gradient tab underline

  - [ ] **Create `Breadcrumbs.tsx` component**
    - [ ] Props: `breadcrumbs: Breadcrumb[]`
    - [ ] Render path: "Course › Module › Node"
    - [ ] Truncate middle with ellipsis on mobile
    - [ ] Each crumb is clickable (except last)
    - [ ] Navigate to respective page on click

  - [ ] **Create `NodeTabs.tsx` component**
    - [ ] Props: `activeTab`, `onTabChange`
    - [ ] Render 3 tabs with underline animation
    - [ ] Horizontally scrollable on mobile
    - [ ] Apply gradient underline to active tab

  - [ ] **Create `NodeTabContent.tsx` component**
    - [ ] Props: `content`, `isLoading`, `onGenerate`
    - [ ] If content exists, render markdown
    - [ ] If empty and not loading, show "Generate Content" button
    - [ ] If loading, show shimmer placeholder
    - [ ] Markdown rendering with proper styling

  - [ ] **Create `MarkAsDoneButton.tsx` component**
    - [ ] Props: `onMarkDone`, `isDone`
    - [ ] Full-width gradient pill button
    - [ ] Checkmark icon + "Mark as Done" text
    - [ ] If already done, show "✓ Completed" with green styling
    - [ ] Sticky to bottom
    - [ ] Minimum 44px height

### 2.4 API: Mark Node as Done

- [ ] **Extend Courses API Module** (`src/apis/courses/`)

  - [ ] **Update `index.ts`**
    - [ ] Export `API_MARK_NODE_DONE` constant
    - [ ] Export `API_MARK_NODE_UNDONE` constant

  - [ ] **Update `types.ts`**
    - [ ] Define `MarkNodeDoneRequest`: `node_id: string`
    - [ ] Define `MarkNodeDoneResponse`: `success: boolean`, `node: NodeDetail`

  - [ ] **Create `handlers/markNodeDone.ts`**
    - [ ] Query node by ID
    - [ ] Update `is_done = true`, `done_at = NOW()`
    - [ ] Update course's `updated_at` timestamp
    - [ ] Return success + updated node

  - [ ] **Create `handlers/markNodeUndone.ts`**
    - [ ] Query node by ID
    - [ ] Update `is_done = false`, `done_at = null`
    - [ ] Return success + updated node

  - [ ] **Update `server.ts`**
    - [ ] Export both handlers

  - [ ] **Update `client.ts`**
    - [ ] Create `markNodeDone()` returning `CacheResult<MarkNodeDoneResponse>`
    - [ ] Create `markNodeUndone()` returning `CacheResult<MarkNodeDoneResponse>`

  - [ ] **Register in `src/apis/apis.ts`**
    - [ ] Add both handlers to API registry

---

## Flow 3: Generate Subtopics

### User Flow: Node Page → Generate Subtopics → View Subtopics → Navigate to Child Node

### 3.1 API: Generate Subtopics

- [ ] **Extend Courses API Module** (`src/apis/courses/`)

  - [ ] **Update `index.ts`**
    - [ ] Export `API_GENERATE_SUBTOPICS` constant

  - [ ] **Update `types.ts`**
    - [ ] Define `GenerateSubtopicsRequest`: `node_id: string`, `count?: number`, `granularity?: string`, `focus?: string`
    - [ ] Define `SubtopicData`: `title`, `synopsis`, `time_est_minutes`
    - [ ] Define `GenerateSubtopicsResponse`: `subtopics: Node[]` (newly created child nodes)

  - [ ] **Create `handlers/generateSubtopics.ts`**
    - [ ] Query parent node by ID
    - [ ] Build context chain: traverse up to course, collect all ancestor titles
    - [ ] Call AI `generateNodeSubtopics(course_title, context_chain, node_title, count, granularity, focus)`
    - [ ] Parse and validate JSON response (3-8 subtopics)
    - [ ] For each subtopic in response:
      - [ ] Generate unique ID
      - [ ] Create node record: `course_id`, `parent_id`, `title`, `synopsis`, `time_est_minutes`, `order_index`, `depth = parent.depth + 1`
      - [ ] Leave tab content empty (generated on demand)
    - [ ] Insert all child nodes into database
    - [ ] Update parent node's `updated_at`
    - [ ] Return array of created nodes

  - [ ] **Update `server.ts`**
    - [ ] Export `generateSubtopics` handler

  - [ ] **Update `client.ts`**
    - [ ] Create `generateSubtopics()` returning `CacheResult<GenerateSubtopicsResponse>`

  - [ ] **Register in `src/apis/apis.ts`**
    - [ ] Add generateSubtopics handler to API registry

### 3.2 UI: Node Page with Subtopics Section

- [ ] **Update Node Page Route** (`src/client/routes/NodePage/`)

  - [ ] **Update `NodePage.tsx`**
    - [ ] Add subtopics section below tab content
    - [ ] State A (no subtopics yet):
      - [ ] Show illustration or icon
      - [ ] Message: "No subtopics yet."
      - [ ] CTA: "Generate Subtopics" button
    - [ ] State B (subtopics exist):
      - [ ] List of subtopic cards
      - [ ] Each card shows: checkbox (is_done), title, synopsis, time estimate, "Open" button
      - [ ] Cards are clickable → navigate to child node page
    - [ ] State C (generating):
      - [ ] Shimmer placeholder cards
      - [ ] Loading animation
    - [ ] Handle "Generate Subtopics" button click
    - [ ] Call `generateSubtopics` API
    - [ ] Smooth animation: placeholders → reveal

  - [ ] **Create `SubtopicsSection.tsx` component**
    - [ ] Props: `subtopics`, `onGenerate`, `isGenerating`
    - [ ] Render state A, B, or C based on props
    - [ ] "Generate Subtopics" gradient button
    - [ ] List of subtopic cards

  - [ ] **Create `SubtopicCard.tsx` component**
    - [ ] Props: `subtopic`, `onClick`
    - [ ] Render checkbox (completion status)
    - [ ] Render title, synopsis, time estimate
    - [ ] Checkmark glow animation when completed
    - [ ] Navigate to subtopic node page on click
    - [ ] Hover and pressed states

  - [ ] **Create `EmptySubtopicsState.tsx` component**
    - [ ] Illustration or icon
    - [ ] Message text
    - [ ] "Generate Subtopics" button

  - [ ] **Create `SubtopicsLoadingState.tsx` component**
    - [ ] Shimmer placeholder cards (3-5 cards)
    - [ ] Match final card layout

---

## Cross-cutting: Design, Accessibility, Performance, Compliance

### Design System & Theming (applies across all four pages)

- [ ] **Create Design Tokens** (`src/client/styles/tokens.css` or TS config)
  - [ ] Define color palette from design-guidelines.md
  - [ ] Define spacing scale (4/8/12/16/24/32px)
  - [ ] Define typography scale (28/22/18/16/14/12px)
  - [ ] Define border radius values (16/20/999px)
  - [ ] Define elevation/shadow values
  - [ ] Define gradients (accent gradient, background gradient)

- [ ] **Create Shared UI Components** (`src/client/components/ui/`)
  - [ ] `Button.tsx` - Primary, Secondary, Tertiary variants
  - [ ] `Card.tsx` - Standard card with consistent styling
  - [ ] `Tabs.tsx` - Reusable tab component
  - [ ] `Checkbox.tsx` - Completion checkbox
  - [ ] `Badge.tsx` - Info chips (difficulty, duration)
  - [ ] `LoadingSpinner.tsx` - Loading state
  - [ ] `ShimmerPlaceholder.tsx` - Skeleton loading
  - [ ] Apply all design tokens and states (hover, focus, pressed, disabled)

- [ ] **Animations** (`src/client/styles/animations.css` or framer-motion)
  - [ ] Fade-in animation (150-250ms)
  - [ ] Slide transitions
  - [ ] Tab underline animation
  - [ ] Progress bar sweep animation (ease-out)
  - [ ] Shimmer loading animation
  - [ ] Checkmark tick animation
  - [ ] Button glow effect on hover
  - [ ] Respect "reduce motion" settings

### Navigation & Routing

- [ ] **Update Router** (`src/client/router/index.tsx`)
  - [ ] Add route: `/` → Home
  - [ ] Add route: `/course-suggestions` → CourseSuggestions (with state)
  - [ ] Add route: `/courses/:courseId` → CourseDashboard
  - [ ] Add route: `/courses/:courseId/nodes/:nodeId` → NodePage
  - [ ] Add 404 fallback → NotFound
  - [ ] Implement deep linking support
  - [ ] Handle navigation state (passing data between routes)

- [ ] **Create Breadcrumb Navigation Helper**
  - [ ] Utility to build breadcrumb trail from DB
  - [ ] Utility to navigate up one level
  - [ ] Handle edge cases (orphaned nodes)

### Error Handling & Edge Cases

- [ ] **API Error Handling**
  - [ ] Wrap all API calls with try-catch
  - [ ] Return user-friendly error messages
  - [ ] Log errors for debugging
  - [ ] Handle network failures gracefully
  - [ ] Implement retry logic for AI failures (3 retries)
  - [ ] Handle rate limiting

- [ ] **UI Error States**
  - [ ] Empty state components for each list view
  - [ ] Error state components with retry buttons
  - [ ] Loading state components (shimmer placeholders)
  - [ ] Validation error messages for inputs
  - [ ] Toast notifications for actions (mark done, generate complete)

- [ ] **Data Validation**
  - [ ] Validate user input length (min/max)
  - [ ] Validate AI response format against JSON schemas
  - [ ] Handle malformed JSON from AI
  - [ ] Validate node/course IDs before queries
  - [ ] Check user permissions (if multi-user)

### Accessibility

- [ ] **ARIA Labels**
  - [ ] Add ARIA labels to all buttons
  - [ ] Add ARIA labels to tabs
  - [ ] Add ARIA labels to progress indicators
  - [ ] Add landmark regions (main, nav, etc.)

- [ ] **Keyboard Navigation**
  - [ ] All interactive elements keyboard accessible
  - [ ] Tab order is logical
  - [ ] Focus indicators visible (outline)
  - [ ] Escape key to close modals/overlays
  - [ ] Arrow keys for tab navigation (optional)

- [ ] **Contrast & Touch Targets**
  - [ ] Verify WCAG AA contrast (4.5:1 body, 3:1 large text)
  - [ ] All buttons minimum 44x44px
  - [ ] All clickable areas meet size requirements

### Performance Optimization

- [ ] **Code Splitting**
  - [ ] Lazy load route components
  - [ ] Split large AI prompt templates

- [ ] **Caching**
  - [ ] Implement cache strategy for `getCourse` (short TTL)
  - [ ] Implement cache strategy for `getNode` (medium TTL)
  - [ ] Cache AI responses (consider cost savings)
  - [ ] Clear cache on updates

- [ ] **Database Optimization**
  - [ ] Ensure all queries use indexes
  - [ ] Limit query results (pagination if needed)
  - [ ] Use projections to fetch only needed fields

### Guidelines Compliance Check

- [ ] **Run Full Guidelines Checklist**
  
  - [ ] **1. API Guidelines Check**
    - [ ] Verify courses API has: `index.ts`, `types.ts`, `server.ts`, `client.ts`
    - [ ] Verify API names defined ONLY in `index.ts`
    - [ ] Verify server re-exports API names from `index.ts`
    - [ ] Verify client imports API names from `index.ts` (NOT from `server.ts`)
    - [ ] Verify types defined in `types.ts` only (no duplication)
    - [ ] Verify client functions return `CacheResult<ResponseType>`
    - [ ] Verify API handlers in `apis.ts` use consistent API names

  - [ ] **2. Routes Check**
    - [ ] Verify each route implements loading states
    - [ ] Verify each route implements error handling
    - [ ] Verify routes use `DataFetcherWrapper` appropriately
    - [ ] Verify routes are simple and well-organized
    - [ ] Verify routes split into multiple components where needed

  - [ ] **3. React Components Check**
    - [ ] Verify components follow naming conventions
    - [ ] Verify components use TypeScript interfaces for props
    - [ ] Verify components don't import server-side code
    - [ ] Verify components use proper React hooks
    - [ ] Verify components don't redefine API types
    - [ ] Verify proper error handling in components
    - [ ] Verify consistent styling approach

  - [ ] **4. Server Code Check**
    - [ ] Verify server code doesn't import client-side code
    - [ ] Verify proper error handling in server functions
    - [ ] Verify clean separation of concerns

  - [ ] **5. TypeScript and Coding Standards Check**
    - [ ] Verify no usage of `any` type
    - [ ] Verify consistent type definitions
    - [ ] Verify no circular dependencies
    - [ ] Verify no type duplications across project

  - [ ] **6. Final Verification**
    - [ ] Run `yarn checks` - must complete with 0 errors
    - [ ] Fix all TypeScript errors
    - [ ] Fix all ESLint errors
    - [ ] Test all user flows manually

### Testing & QA

- [ ] **Manual Testing**
  - [ ] Test full flow: Home → Generate → Select → View Course → Open Node → Generate Content → Generate Subtopics
  - [ ] Test navigation: forward and back
  - [ ] Test marking nodes as done
  - [ ] Test progress calculation
  - [ ] Test on mobile viewport
  - [ ] Test on desktop viewport
  - [ ] Test with slow network
  - [ ] Test error scenarios (API failures)

- [ ] **Cross-browser Testing**
  - [ ] Chrome
  - [ ] Safari
  - [ ] Firefox
  - [ ] Mobile Safari
  - [ ] Mobile Chrome

---

## Summary

This implementation plan covers all major components needed for the MVP:

### Key Deliverables:
1. ✅ Database schema for Courses and Nodes
2. ✅ AI integration with 4 prompt templates
3. ✅ Complete API layer (courses API module with 9 endpoints)
4. ✅ 4 main pages: Home, Course Suggestions, Course Dashboard, Node Page
5. ✅ 3 user flows: Generate Course, Generate Node Content, Generate Subtopics
6. ✅ Design system implementation
7. ✅ Full guidelines compliance

### Total Estimated Tasks: ~200+ individual tasks

### Suggested Implementation Order:
1. **Phase 0** - Setup infrastructure (database, AI helpers)
2. **Phase 1** - Generate course flow (highest priority, most valuable)
3. **Phase 2** - View course and navigation
4. **Phase 3** - Generate node content
5. **Phase 4** - Generate subtopics (completes core loop)
6. **Phase 5** - Polish, compliance, testing

Each phase builds on the previous one and delivers incremental value. The plan follows the app guidelines and maintains consistency with the product definitions.

