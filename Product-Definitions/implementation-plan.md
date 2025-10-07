# Learn Anything - Implementation Plan (MVP P0)

This plan strictly follows `Product-Definitions/MVP-features.md` to deliver the leanest possible MVP.

---

## Table of Contents

1. [Data (MVP-minimal)](#data-mvp-minimal)
2. [APIs (only what’s needed)](#apis-only-whats-needed)
3. [UI Pages (four + library)](#ui-pages-four--library)
4. [Progress & Continue](#progress--continue)
5. [Acceptance Checklist](#acceptance-checklist)

---

## Data (MVP-minimal)

- [ ] **Course collection** (`src/server/database/collections/courses.{ts,types.ts}`)
  - [ ] Fields: `id`, `title`, `overview_summary`, `overview_detail`, `difficulty?`, `created_at`, `updated_at`, `created_by_user_id?`
  - [ ] Indexes: `created_by_user_id`, `updated_at`
  - [ ] Export server/client types: `CourseServer`, `CourseClient`

- [ ] **Node collection** (`src/server/database/collections/nodes.{ts,types.ts}`)
  - [ ] Fields: `id`, `course_id`, `parent_id (nullable)`, `title`, `synopsis`, `order_index`, `depth`, `tab_overview_md?`, `tab_deep_dive_md?`, `tab_terminology_md?`, `is_done`, `done_at?`, `last_viewed_at?`, `created_at`, `updated_at`
  - [ ] Indexes: `course_id`, `parent_id`, `(course_id,parent_id,order_index)`
  - [ ] Export server/client types: `NodeServer`, `NodeClient`

Notes
- Modules are Nodes with `parent_id = NULL`, `depth = 1`.
- Tab content is generated lazily on first open.

---

## APIs (only what’s needed)

Follow the existing name-based API pattern (like `todos`) and map 1:1 to MVP operations.

- [ ] **Courses API module** (`src/apis/courses/`)
  - [ ] `index.ts` (names)
    - [ ] `courses/generateCourseSuggestions`
    - [ ] `courses/selectCourseSuggestion`
    - [ ] `courses/getCourses` (list with progress)
    - [ ] `courses/getCourse` (by id with modules)
    - [ ] `courses/getNode`
    - [ ] `nodes/setLastViewed` (or `courses/setNodeLastViewed`)
    - [ ] `nodes/generateSubtopics`
    - [ ] `nodes/markDone`, `nodes/markUndone`
  - [ ] `types.ts`
    - [ ] Import `CourseClient`, `NodeClient` from collections
    - [ ] Define request/response types for all operations
  - [ ] `server.ts`
    - [ ] `export * from './index'`
    - [ ] Export `coursesApiHandlers = { [API_NAME]: { process } }`
  - [ ] `handlers/`
    - [ ] `generateCourseSuggestions.ts` (AI prompt #1)
    - [ ] `selectCourseSuggestion.ts` (AI prompt #2 → create course + modules)
    - [ ] `getCourses.ts` (list + computed progress)
    - [ ] `getCourse.ts` (course by id + modules)
    - [ ] `getNode.ts` (node + children + breadcrumbs)
    - [ ] `setLastViewed.ts` (sets `last_viewed_at`)
    - [ ] `generateSubtopics.ts` (AI prompt #3 → create children)
    - [ ] `markNodeDone.ts`, `markNodeUndone.ts`
  - [ ] `client.ts`
    - [ ] Client functions return `CacheResult<...>` and import names from `index.ts`
  - [ ] Register in `src/apis/apis.ts` (spread `coursesApiHandlers` like Todos)

AI Helpers (`src/server/ai/`)
- [ ] `prompts/` templates for suggestions, course scaffold, subtopics, node content
- [ ] `helpers/` to call model and validate JSON per MVP schemas

---

## UI Pages (four + library)

### 1) Generate → Select Course

- [ ] Home (`src/client/routes/Home/`)
  - [ ] Large input, placeholder: “What do you want to learn today?”
  - [ ] Primary CTA: Generate (gradient pill)
  - [ ] On submit: call `courses/generateCourseSuggestions`, navigate to suggestions
  - [ ] Loading: shimmer skeletons (no spinner-only)
  - [ ] Error: one-line explanation + Retry

- [ ] Course Suggestions (`src/client/routes/CourseSuggestions/`)
  - [ ] List 1–3 options: title + short summary (chip: difficulty)
  - [ ] Expand for learning outcomes
  - [ ] Select → call `courses/selectCourseSuggestion` → navigate to Course page
  - [ ] Optional: “Regenerate suggestions”

### 2) Create Course (Top-Level Only)

- [ ] On select suggestion, persist Course + top-level Modules (Nodes depth=1)
- [ ] Order modules via `order_index`
- [ ] Do not create any subtopics yet

### 3) Course Page (Program Dashboard)

- [ ] Route: `CourseDashboard` (`/courses/:courseId`)
  - [ ] Header: title, progress bar (% done), chips (difficulty)
  - [ ] Overview: short + long
  - [ ] Modules list: title, synopsis, progress pill (X/Y done)
  - [ ] Primary CTA: Continue (opens last viewed or first module)
  - [ ] Loading/Empty/Error per MVP rules

### 4) Node Page (Universal)

- [ ] Route: `NodePage` (`/courses/:courseId/nodes/:nodeId`)
  - [ ] Breadcrumbs + Back to parent
  - [ ] Tabs: Overview (default), Deep Dive, Terminology
  - [ ] Lazy generate tab content on first open via AI prompt #4
  - [ ] Subtopics section
    - [ ] Empty: “Generate Subtopics” button
    - [ ] List: child cards (title, synopsis)
  - [ ] Sticky footer: “✅ Done” (marks node done, navigates to parent)
  - [ ] Loading with shimmer; concise error messages

### 5) All Courses (Library)

- [ ] Route: `AllCourses` (entry view)
  - [ ] Cards: title, short summary, small progress bar, Continue
  - [ ] FAB: “+ New Course” → Home

---

## Progress & Continue

- [ ] Node progress
  - [ ] Fields: `is_done`, `done_at`, `last_viewed_at`
  - [ ] `nodes/markDone`, `nodes/markUndone`
  - [ ] `nodes/setLastViewed` on open

- [ ] Course progress
  - [ ] Computed: (# node.is_done true) / (total nodes)
  - [ ] Show on Course card and Course page header

- [ ] Continue behavior
  - [ ] On Course page: opens last viewed node or first module if none
  - [ ] On Library: Continue opens last viewed for that course

---

## Acceptance Checklist

- [ ] Enter a topic → see 1–3 course options
- [ ] Select one → land on Course page with modules
- [ ] Open a module → Overview content appears (generated lazily)
- [ ] Generate subtopics → child nodes appear under the node
- [ ] Mark nodes done → progress updates on node/module/course
- [ ] Return later → Library shows progress; Continue resumes correctly

Notes on Implementation Fit
- Use existing API structure (name-based, handler map, `CacheResult` clients)
- Keep UI to dark theme, primary CTA visible, tabs with underline, shimmer loading, accessible targets (≥44px), and clear back navigation

