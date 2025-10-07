Here’s the **leanest possible MVP** that still delivers the core magic: *type anything → pick a course direction → get a structured program → learn it with progress*.

---

# 🎯 MVP Scope — Fundamental Features (P0)

## 1) Generate → Select Course

* **User input**: single text box + “Generate”.
* **AI suggestions**: return 1–3 course options (title, short summary).
* **Select**: choosing one proceeds to course creation.
  **Done when:** from a blank app, a user can see 1–3 options within one tap after entering a topic and pick one.

## 2) Create Course (Top-Level Only)

* **Persist Course** with title, overview (short + long).
* **Persist Modules** as **Nodes** with `parent_id = NULL` (depth=1), ordered.
  **Done when:** course and its top-level modules exist in storage and are visible.

## 3) Course Page (Program Dashboard)

* **Shows**: course title, short/long overview, list of modules.
* **Progress bar**: computed (% nodes done / total nodes).
* **Continue button**: opens last viewed node (or first module if none).
  **Done when:** user sees the course overview and modules; progress shows 0% initially.

## 4) Node Page (Universal for any depth)

* **Header**: breadcrumbs + back to parent.
* **Tabs**: Overview (default), Deep Dive, Terminology.
* **Lazy content**: generate tab content **on first open** and cache it.
* **Subtopics section**:

  * **Empty state**: “Generate Subtopics” button.
  * **List state**: child nodes with title, synopsis, checkmark if done.
* **Footer**: “✅ Done” (marks node done, navigates to parent).
  **Done when:** user can open any module, read Overview, generate subtopics, and mark Done.

## 5) Generate Subtopics (On Demand)

* Button on Node page creates **child Nodes** under that node.
* Each child has title, synopsis, order_index; tab content generated later when opened.
  **Done when:** pressing Generate creates visible subtopic cards.

## 6) Progress (MVP-embedded on Node)

* **Fields on Node**: `is_done`, `done_at`, `last_viewed_at`.
* **Mark as Done**: sets flags; parent page reflects updated progress.
* **Continue**: last viewed node per course from `last_viewed_at`.
  **Done when:** checkmarks/percent update immediately after Done; Continue lands where expected.

## 7) All Courses List

* Shows user’s created courses with small progress bar.
* Actions: open course, create new course.
  **Done when:** returning users can pick up any course quickly.

---

# 🧱 Data (MVP-minimal)

* **Course**: `id`, `title`, `overview_summary`, `overview_detail`, (optional) `difficulty`, `est_total_minutes`, timestamps.
* **Node**: `id`, `course_id`, `parent_id` (NULL for modules), `title`, `synopsis`, `order_index`, `depth`, tab fields (`tab_overview_md`, `tab_deep_dive_md`, `tab_terminology_md`), `time_est_minutes` (optional), **progress** (`is_done`, `done_at`, `last_viewed_at`), timestamps.

> Modules = Nodes with `parent_id = NULL`, `depth = 1`.

---

# 🔌 APIs (only what’s needed)

* `POST /suggestions/courses` → returns up to 3 options (no DB write).
* `POST /courses` → creates Course + top-level Nodes; returns ids.
* `GET /courses` → list courses with computed progress.
* `GET /courses/:courseId` → course + modules with module child-progress.
* `GET /nodes/:nodeId` → node + children; breadcrumb via parent chain.
* `POST /nodes/:nodeId/view` → sets `last_viewed_at`.
* `POST /nodes/:nodeId/subtopics` → creates child Nodes (titles/synopsis).
* `POST /nodes/:nodeId/done` (and optional `/undone`) → toggles progress.

---

# 🖌️ UI/UX Rules (app-wide, MVP)

* **Dark theme**; single accent gradient for primary actions.
* **Primary action visible** without scrolling on each page.
* **Tabs** on Node: simple underline; keep content < ~500 words per tab.
* **Loading**: shimmer skeletons (no spinners-only).
* **Empty states**: one friendly line + one clear CTA.
* **Touch targets**: ≥44px; contrast meets AA.
* **Back** always goes to parent node or previous page (no dead ends).

---

# 🧭 Success Criteria (acceptance checklist)

* From a cold start, a user can:

  1. Enter a topic → see 1–3 course options.
  2. Select one → land on a Course page with modules.
  3. Open a module → see Overview content (auto-generated on first open).
  4. Generate subtopics → see child nodes populate.
  5. Mark nodes done → progress updates on node, module, and course.
  6. Return later → All Courses shows progress; Continue resumes correctly.

---

# 🧰 Deliberate Non-Goals (push to post-MVP)

* Multiple users/collaboration, roles, sharing.
* SavedCourse join table; public catalogs/templates.
* Versioning of AI content; regeneration history.
* Tags, resources, citations, web retrieval.
* Reorder via drag-and-drop; delete/merge nodes.
* Settings, theming beyond dark default.
* Full analytics beyond simple event logging.

---

# 🪄 Minimal polish (if time allows)

* **Rename course/module** (inline).
* **Undo** after “Done” (5–10s toast).
* **Regenerate suggestions** if none fit.

If you implement just the P0 list above, you’ll have a solid, lovable MVP that proves the product’s core value—and it’s all extensible later without rework.
