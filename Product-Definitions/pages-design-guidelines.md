

# Page-by-Page Design & Layout Specs

## Shared tokens (use everywhere)

* **Grid:** 8-pt spacing. Page padding 16px (mobile), 24–32px (desktop).
* **Typography:** Inter / SF Pro.

  * H1 28/34 semi-bold, H2 22/28 semi-bold, H3 18/24 medium, Body 15/22 regular, Caption 13/18.
* **Colors:**

  * bg/base `#0B0C1A`, surface `#101226`, border `#ffffff14`.
  * text/primary `#FFFFFF`, text/secondary `#FFFFFFCC` (80%), text/tertiary `#FFFFFF99` (60%).
  * accent gradient: `#5B5FFF → #9A6BFF`. Success `#32D583`.
* **Buttons:** Pill radius 999px. Primary = gradient fill, Secondary = 1px border `#ffffff33`.
* **Card:** Radius 16px, surface, 1px border `#ffffff14`, inner padding 16.
* **Icon sizes:** 20–24px.
* **Tap target:** ≥44×44.
* **Safe area:** Leave 16px bottom padding above iOS home indicator; sticky elements respect it.

---

## 1) Search / Generate Page

### Purpose

Collect a free-text topic and send to suggestions.

### Anatomy (top → bottom)

1. **App Bar** (48px): hamburger (left), app logo/title center, settings (right).
2. **Hero Block**:

   * H1: “What do you want to learn today?”
   * **Input** (full-width, height 52, radius 12, left icon 🔍).
   * Helper row (12px gap): three ghost chips “Metabolism”, “Stock market”, “Quantum basics” (tap fills input).
3. **Primary CTA**: **Generate** (height 48, full-width).
4. **Footnote** (Caption): “AI-generated course suggestions. You can refine later.”

### Layout

* Vertical gaps: H1→Input 16, Input→chips 8, chips→CTA 16.
* On submit: disable input + show inline spinner on button.

### States

* **Empty**: disabled Generate until ≥3 chars.
* **Loading**: skeleton card rows (see Suggestions).
* **Error**: inline red caption below input, secondary button “Try again”.

---

## 2) Course Suggestions Page

### Purpose

Disambiguate intent with 1–3 options, then pick one.

### Anatomy

1. **App Bar**: back (to Search), title “Choose Your Learning Path”.
2. **Subtitle** (Body): “Based on ‘{query}’, pick a direction.”
3. **Suggestion Cards** (1–3): each card contains:

   * Title (H3)
   * Summary (Body, ≤3 lines)
   * Meta row: Difficulty chip + “~{minutes}” chip
   * **Select** button (Primary, full-width inside card)
   * Optional: “Show details” chevron → expands **Detail** (Body) + 3–5 outcomes (bullets, Caption)
4. **Footer row**: Secondary “Regenerate” (left), Text link “Edit input” (right)

### Layout

* Card padding 16; inter-card spacing 12.
* Keep Select pinned to the bottom of the card (use flex column).
* Subtitle→first card gap 12.

### Loading & Error

* **Skeleton**: 3 placeholder cards (title line, 2 body lines, disabled button).
* **No results**: Empty state illustration + Secondary “Try different phrasing”.

### Interaction

* Tapping **Select** immediately routes to **Loading Course Generation**, then to **Course Page**.

---

## 3) Course Main Page (Program Dashboard)

### Purpose

Show course overview and top-level modules. Primary action: **Continue Learning** or open a module.

### Anatomy

1. **Breadcrumbs**: “My Courses › {Course}” (Caption, tappable crumbs).
2. **Header**:

   * H1 Course title
   * Progress bar (2px) + % text right (“37%”)
   * Meta chips row: Difficulty · Total time · Modules count
   * **Continue** (Primary, full-width) if there’s a `last_viewed`; else “Start course”
3. **What You’ll Learn** (Card):

   * H2 label
   * Overview detail (Body, 2–3 short paragraphs)
   * Outcomes (3–6 bullets, Caption)
4. **Modules** (List of Cards): each module card contains

   * Title (H3) + optional check if module itself is done
   * Synopsis (Body, ≤2 lines)
   * Meta row: “{done}/{total} topics” (Caption) + “~{minutes}” chip
   * Right-aligned **Open** button or chevron
5. **FAB** (optional MVP): “+ Add Modules” bottom-right.

### Layout

* H1→progress 8, progress→chips 8, chips→Continue 12.
* Section gaps 16. Card-to-card gap 12.

### Loading

* Skeleton for H1 bar + 4 module cards (title line, 1 body line, meta pill).

### Empty

* If modules = 0: show empty state card with **Generate Modules** (Primary).

---

## 4) Node Page (universal for any depth)

### Purpose

Read content, generate subtopics, mark done.

### Anatomy (top → bottom)

1. **Breadcrumbs** (Caption): “{Course} › {Parent} › {Node}” (truncate middle; each crumb tappable).
2. **Back Row**: “← Back to {Parent}” (Text button).
3. **Node Title** (H1).
4. **Tabs** (segmented, sticky under header): **Overview** (default) · **Deep Dive** · **Terminology**.
5. **Tab Content Area**:

   * **Overview**: 2–4 short paragraphs + “Learning outcomes” (3–6 bullets).
   * **Deep Dive**: 3–5 tight sections (H3 + body, ≤500 words total).
   * **Terminology**: 8–15 bullet items (**Term** — definition).
   * Meta chips (time, difficulty) at bottom of content card.
6. **Subtopics Section**

   * Header H2 “Subtopics”
   * **Empty state**: Light illustration + one-liner + **Generate Subtopics** (Primary).
   * **List state**: Card per subtopic:

     * Left: checkbox (completion), middle: Title + 1-line synopsis, right: “10 min” and chevron.
     * Tapping the row opens subtopic node; tapping checkbox toggles done.
7. **Sticky Footer**

   * Full-width **✅ Done** (Primary) → marks node done, navigates to **parent**.
   * Respect safe-area inset; add 12px top shadow gradient to separate.

### Layout

* Breadcrumbs→Back 4, Back→Title 8, Title→Tabs 8, Tabs→Content 12, Content→Subtopics 16.
* Subtopic row height 56; gap 12 between rows.

### Loading

* On first open (if tabs not generated): show **content skeleton** (3 text lines + bullets).
* Generate Subtopics → replace button with 3–6 **skeleton rows**; then fill.

### Behaviors

* Tabs are sticky; scrolling content moves under them.
* Done button always visible (sticky bottom).
* Checkbox toggling should not navigate; row tap navigates.

---

## 5) All Courses List (Library)

### Purpose

Entry hub. Pick a course or create a new one.

### Anatomy

1. **App Bar**: title “My Courses”, settings avatar on right.
2. **Courses** (grid or list; MVP = list): card per course with

   * Title (H3)
   * Summary (Body, 1–2 lines)
   * Progress bar (2px) + small %
   * Meta: minutes (chip)
   * **Continue** (Primary, small) if `last_viewed`, else **Open** (Secondary)
3. **FAB**: “+ New Course” (routes to Search).

### Layout

* List spacing 12; page padding 16.
* For desktop ≥1024px: switch to 2-column grid, card min-width 420.

### Empty state

* Illustration + “No courses yet” + **Create your first course** (Primary).

---

# Modal / Overlay Specs

## Generate Subtopics (bottom sheet)

* **Handle** bar at top; title “Generate Subtopics”.
* Context preview (Caption): “Path: Course › … › Current Node”.
* Controls (stacked, 12px gaps):

  * Depth: segmented 1 / 2 / 3 (default 1)
  * Granularity: segmented “Survey / Balanced / Deep” (default Balanced)
  * Count: stepper 3–8 (default 5)
  * Optional focus (textarea 3 rows, helper “e.g., clinical examples”)
* **Generate** (Primary) + **Cancel** (Text).
* On submit: close sheet, show skeleton rows in Subtopics section.

---

# Component Specs (reusable)

## Progress Bar (thin)

* Height 2px; rounded ends. Track `#ffffff14`; fill = accent gradient.
* Animate fill 250ms ease-out when value changes.

## Chip

* Height 24, radius 12, 12px horizontal padding, Caption text.
* Filled (accent) for primary meta; subtle border for secondary.

## Card (list)

* Min height 96, padding 16, title + body + meta row.
* Hover/press: surface brighten + border to `#ffffff26`.

## Checkbox (completion)

* 20×20, 2px border `#ffffff66`. Checked fill success `#32D583`, white checkmark.
* Tap area: entire row toggles if tapped within 24px of box.

---

# Content Limits (so designs don’t explode)

* Titles ≤ 70 chars (truncate with ellipsis).
* Synopses ≤ 140 chars; max 2 lines in cards.
* Overview ≤ ~350 words; Deep Dive ≤ ~500 words.
* Terminology: max 15 bullets.

---

# Accessibility & QA (per page)

* Contrast AA for all text; verify chips and disabled states.
* Focus rings visible on Tabs, Buttons, Checkboxes.
* Screen reader labels:

  * Suggestion card “Select {title}”.
  * Subtopic row “{title}, {minutes} minutes, {done/not done}”.
  * Done button “Mark node done and go back to {parent title}”.
* Test keyboard: Tab through headers → tabs → actions; Enter/Space activates.

---

# Desktop Adaptation (quick rules)

* Increase page padding to 24–32px.
* Two-column for Suggestions and Courses; Node Page keeps a single main column (640–720px) centered; Subtopics in a side column at ≥1280px if desired.
* Sticky elements (Tabs, Footer) remain sticky with 64px max width gutters.

---

# “Done” Definition (visual)

* Node Page shows green check on title for 2 seconds after press, then navigates up.
* Module cards compute done/total child nodes; if total=0 use node’s own `is_done`.

---

