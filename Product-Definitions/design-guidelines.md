# App Design Guidelines

A shared, high-level rulebook for the *Learn Anything* app. These standards apply across all screens and features.

---

## Principles

* **Clarity first.** Prioritize comprehension over decoration.
* **Consistent primitives.** One color system, one spacing scale, one typographic scale.
* **Focus on flow.** Minimize choices per screen; emphasize the next best action.
* **Progress everywhere.** Always reflect where the user is and what’s done.
* **Mobile-first.** Design for small screens; scale up responsively.
* **AI-first.** Make AI actions visible, explainable, cancellable.

---

## Brand & Themes

* **Default theme:** Dark. Calm, futuristic, minimal.
* **Accent:** Electric blue → violet gradient for primary actions and progress.
* **Light theme:** Optional; apply the same tokens with increased contrast.

---

## Color System

**Palette**

* `bg/base`: #0B0C1A
* `bg/surface`: #101226
* `text/primary`: #FFFFFF
* `text/secondary`: rgba(255,255,255,0.8)
* `text/tertiary`: rgba(255,255,255,0.6)
* `accent/primary`: gradient (#5B5FFF → #9A6BFF)
* `success`: #3DD68C
* `warning`: #FFC857
* `error`: #FF6B6B
* `border`: rgba(255,255,255,0.08)

**Usage**

* Primary buttons, sliders, progress = `accent/primary`.
* Content surfaces (cards, modals) sit on `bg/surface` with subtle borders.
* Never rely on color alone to convey meaning; pair with icon/text.

---

## Typography

* **Family:** Inter (or SF Pro Rounded on Apple).
* **Scale (px, mobile):** 28 / 22 / 18 / 16 / 14 / 12.

  * H1 28 bold, H2 22 semibold, H3 18 semibold, Body 16 regular, Caption 14, Micro 12.
* **Line-height:** 1.35–1.5 depending on size.
* **Casing:** Sentence case for titles/buttons; avoid ALL CAPS in body.
* **Readability:** Max 70–80 characters per line.

---

## Spacing & Layout

* **Base unit:** 8px. Common steps: 4 / 8 / 12 / 16 / 24 / 32.
* **Page padding:** 16–24px mobile, 32–48px desktop.
* **Grid:** 12-column (desktop), 4-column (mobile) with 16px gutters.
* **Density:** Prefer medium density; group related controls in 8–16px clusters.

---

## Elevation & Surfaces

* **No heavy drop shadows.** Use subtle elevation and 1px translucent borders.
* **Card radius:** 16–20px. **Button radius:** 999px (pill).
* **Glass effect:** Optional at low opacity; never reduce contrast.

---

## Components

### Buttons

* **Primary:** Pill, gradient fill, white text. Hover/press adds glow ring.
* **Secondary:** Outline on `accent/primary`; text uses `text/primary`.
* **Tertiary (text button):** For low-risk actions.
* **States:** default / hover / pressed / loading (spinner left of label) / disabled (40% opacity, no glow).
* **Minimum touch target:** 44×44px.

### Inputs

* Large rounded fields; left icon optional.
* Focus: 1px highlight + soft glow.
* Inline validation with icon + short helper text.

### Tabs

* Top-aligned, scrollable on mobile.
* Active tab has gradient underline; transitions fade/slide content.

### Cards

* Title, 1–2 line synopsis, status/metadata row, primary action.
* Use consistent height for lists; allow multi-line wrapping gracefully.

### Progress

* Course: thin line under title + % text.
* Node: `X/Y done` pill; checkbox for items.
* Animate from 0 → target on mount.

### Breadcrumbs

* Truncate middle with ellipsis when space is tight.
* Each crumb tappable; last crumb non-interactive.

### Checkboxes & Toggles

* Checkbox for completion; toggle for settings.
* Provide label on the right; entire row tappable.

### Floating Action Button (FAB)

* Bottom-right circle with gradient; reserved for **primary creation** (e.g., “+ Add Modules”).

---

## Navigation

* **Global:** All Courses → Course → Node (recursive).
* **Back behavior:** Back returns to the previous node or parent page (never dead-end).
* **Keyboard (desktop):** ←/→ to switch siblings, Esc to go up a level.
* **Deep links:** Every node has a shareable URL.

---

## Motion

* **Purposeful, short, 150–250ms.**
* Page transitions: subtle slide/fade.
* Progress updates: ease-out sweep.
* Generation: shimmer placeholders → content reveal.
* Completion: checkmark tick + micro-glow; reserve confetti for full course completion.

---

## States (Loading / Empty / Error)

* **Loading:** Shimmer skeletons matching final layout; avoid spinners only.
* **Empty:** Friendly one-liner, concise guidance, primary CTA.
* **Error:** Plain language, what happened + how to fix, retry button.
* **No data vs. end of list:** Distinguish clearly.

---

## Content & Microcopy

* **Voice:** Supportive mentor, concise, specific.
* **AI transparency:** Add a small “AI-generated” badge where content is produced.
* **Buttons:** Action-oriented (“Generate Subtopics”, “Mark as Done”).
* **Avoid jargon** unless in Deep Dive; provide terms in Terminology tab.

---

## Accessibility

* **Contrast:** WCAG AA minimum (4.5:1 body, 3:1 large text).
* **Targets:** ≥44×44px tap area.
* **Focus states:** Visible outlines for all focusable elements.
* **ARIA:** Labels for landmark regions, buttons, tabs, progress.
* **Motion sensitivity:** Respect “reduce motion” settings; disable nonessential animations.
* **Keyboard:** All interactive elements reachable and operable.

---

## Internationalization

* **Text expansion:** Allow +30% width for translations.
* **RTL:** Support mirrored layouts for RTL locales.
* **Numbers/time:** Localize units and formats.

---

## Data Visualization (optional)

* Use native system colors with tinted accents; avoid saturated backgrounds.
* Provide labels and units; don’t rely only on color.

---

## Iconography & Illustration

* **Icon set:** Lucide/Feather (2px stroke) for consistency.
* **Meaning:** Pair icons with labels unless universally understood.
* **Illustrations:** Abstract, minimal; low contrast so text dominates.

---

## Security & Privacy UX

* **Stateful actions** (generate, mark done) should be undoable where possible.
* **No surprise writes.** Ask for confirmation only on destructive actions (delete course).
* **Loading indicators** on all networked actions.

---

## Dos & Don’ts

**Do**

* Keep primary action visible without scrolling.
* Use one accent gradient per screen.
* Show progress and context (breadcrumbs) at all times.

**Don’t**

* Stack more than two primary CTAs on one view.
* Use caps-lock labels.
* Hide critical navigation behind overflow menus.

---

## Design Tokens (starter)

```json
{
  "color": {
    "bgBase": "#0B0C1A",
    "bgSurface": "#101226",
    "textPrimary": "#FFFFFF",
    "textSecondary": "rgba(255,255,255,0.8)",
    "border": "rgba(255,255,255,0.08)",
    "accentFrom": "#5B5FFF",
    "accentTo": "#9A6BFF",
    "success": "#3DD68C",
    "warning": "#FFC857",
    "error": "#FF6B6B"
  },
  "radius": { "card": 16, "button": 999, "input": 12 },
  "space": [4, 8, 12, 16, 24, 32],
  "shadow": { "elev1": "0 4px 20px rgba(0,0,0,0.25)" },
  "typography": {
    "h1": { "size": 28, "weight": 700, "lh": 1.35 },
    "h2": { "size": 22, "weight": 600, "lh": 1.4 },
    "h3": { "size": 18, "weight": 600, "lh": 1.45 },
    "body": { "size": 16, "weight": 400, "lh": 1.5 },
    "caption": { "size": 14, "weight": 400, "lh": 1.45 }
  }
}
```

---

## QA Checklist (per screen)

* Primary action is obvious and reachable.
* Breadcrumbs and progress visible.
* Loading, empty, and error states implemented.
* All interactive elements have hover, focus, pressed, disabled.
* Contrast and tap targets meet accessibility.
* Strings fit without truncation at common breakpoints.

---

These guidelines intentionally stay **general and enforceable**. Use them as the base for component specs and page-level patterns.
