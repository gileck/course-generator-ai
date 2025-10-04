Excellent.
Below you’ll find **text-based wireframes** (ASCII-style block layouts) for each major screen in the *Learn Anything* app.
They show **hierarchy, spacing, and flow** — the visual skeleton your designer or front-end team can map directly into Figma frames or component blueprints.

---

# 🧱 TEXT-BASED WIREFRAMES

---

## **1️⃣ Search / Generate Page**

```
────────────────────────────────────────────
🧠  Learn Anything
────────────────────────────────────────────
        "What do you want to learn today?"
 ┌───────────────────────────────────────┐
 │  [  Type a topic or question...   🔍 ] │
 └───────────────────────────────────────┘
 Examples:
  - The science of sleep
  - How AI works
  - Metabolism and health

              [ Generate ▶ ]

────────────────────────────────────────────
        AI-powered structured learning
────────────────────────────────────────────
```

**Notes**

* Full-screen centered layout.
* Input is large and rounded; Generate button directly below.
* Background: dark gradient; soft animated glow behind input.
* Typography hierarchy: logo (20 pt semi-bold), question (18 pt medium), hints (14 pt regular).

---

## **2️⃣ Course Suggestions Page**

```
────────────────────────────────────────────
←  Back                  🧩  Choose your path
────────────────────────────────────────────
"Based on your topic, here are some courses"

┌──────────────────────────────────────────┐
│ 🔹  Foundations of Metabolic Health       │
│ Understand energy, hormones & longevity. │
│ Level: Intermediate   ⏱  ~4h             │
│ [ Select ]                             ↴ │
└──────────────────────────────────────────┘
   ▼ Expanded
   What you'll learn:
    • How metabolism converts energy
    • Role of hormones
    • Strategies to optimize health

┌──────────────────────────────────────────┐
│ 🔹  Metabolism Explained: From Food...    │
│ Learn how your body converts food energy │
│ Level: Beginner   ⏱  ~3h                │
│ [ Select ]                              │
└──────────────────────────────────────────┘

       ↻ Regenerate suggestions
           ✏️ Edit my input
```

**Notes**

* Each card expands accordion-style for details.
* “Select” scrolls to loading screen.
* Cards have 16 px radius, frosted glass, hover glow.

---

## **3️⃣ Loading Screen**

```
────────────────────────────────────────────
          ⚙️  Building your course...
────────────────────────────────────────────
  [ glowing spinner / AI orb animation ]

   “Generating modules and learning goals…”
   “Learning is exploration.”
────────────────────────────────────────────
  [ shimmer placeholders for course cards ]
────────────────────────────────────────────
```

**Notes**

* Full-screen gradient background; animated shimmer.
* Center-aligned text.

---

## **4️⃣ Course Main Page (Dashboard)**

```
────────────────────────────────────────────
←  My Courses                 ⋯
────────────────────────────────────────────
📘  Metabolism and Health
Progress ▓▓▓▓▓░░░░░  37%
[ Intermediate • ~4h • 6 Modules ]
[ ▶ Continue Learning ]

────────────────────────────────────────────
📖  What You’ll Learn
────────────────────────────────────────────
  Metabolism drives every energy process…
  • Understand ATP production
  • Learn major pathways
  • Improve metabolic health
  ↻ Regenerate Overview
────────────────────────────────────────────
📚  Modules
────────────────────────────────────────────
1️⃣  Metabolic Foundations
   “Learn the building blocks of metabolism”
   2 / 5 topics done   ⏱  45 min
   [ Continue → ]

2️⃣  Energy Systems
   “Discover how the body produces energy”
   0 / 4 topics done  ⏱  35 min
   [ Open → ]

✅  Completed modules show green check.

────────────────────────────────────────────
[ + Add More Modules  ✚ ]   (Floating)
────────────────────────────────────────────
```

**Notes**

* Scrollable vertical layout.
* Progress bar thin gradient line under title.
* FAB bottom-right.

---

## **5️⃣ Node Page**

```
────────────────────────────────────────────
🏠 Course › Module › Node
← Back to Energy Systems
────────────────────────────────────────────
🔬  Cellular Respiration
────────────────────────────────────────────
[ Overview ]  [ Deep Dive ]  [ Terminology ]
────────────────────────────────────────────
📄  Overview Tab
────────────────────────────────────────────
  Cellular respiration is the process …
  • Glycolysis
  • Krebs Cycle
  • Electron Transport Chain
  Chips: ⏱ 20 min  |  Level Medium
────────────────────────────────────────────
📚  Subtopics
────────────────────────────────────────────
-- State A (no subtopics) -----------------
  [ Illustration ]
  “No subtopics yet.”
  “Tap below to explore deeper.”
           [ Generate Subtopics ]
--------------------------------------------
-- State B (subtopics generated) -----------
  ☑  Glycolysis       10 min
  ☐  Krebs Cycle      15 min
  ☐  Electron Transport Chain  12 min
--------------------------------------------
────────────── Sticky Footer ──────────────
[ ✅ Mark as Done ]  (Full-width pill)
────────────────────────────────────────────
```

**Notes**

* Tabs are horizontally scrollable; underline animation.
* “Generate Subtopics” button appears only when empty.
* Footer always visible; triggers green flash + navigate back.

---

## **6️⃣ All Courses List (Library)**

```
────────────────────────────────────────────
🧠  My Courses                       [+ New]
────────────────────────────────────────────
┌──────────────────────────────────────────┐
│ 📘  Metabolism and Health               │
│ Progress ▓▓▓▓▓▓░░░░  63%   ⏱  4h       │
│ “Understand energy and longevity.”      │
│ [ Continue → ]                         │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ 📗  Fundamentals of AI                  │
│ Progress ▓▓▓░░░░░░░  28%   ⏱  3h        │
│ “Learn how AI systems work.”            │
│ [ Continue → ]                         │
└──────────────────────────────────────────┘

( Swipe left → Delete / Rename )
────────────────────────────────────────────
```

**Notes**

* Vertical scroll list; consistent card style.
* FAB bottom-right opens Search / Generate Page.

---

# 🎨 APP-WIDE STYLE GUIDE

| Element            | Spec                                                               |
| ------------------ | ------------------------------------------------------------------ |
| **Background**     | Gradient dark navy → violet (#0B0C1A → #191B35)                    |
| **Primary Accent** | Electric blue → violet gradient (#5B5FFF → #9A6BFF)                |
| **Success Accent** | Soft green #3DD68C                                                 |
| **Typography**     | Inter / SF Pro Rounded; Headings 22–28 pt semi-bold; Body 15–16 pt |
| **Buttons**        | Pill shape; gradient fill; glowing hover; white text               |
| **Cards**          | 16–20 px radius; matte dark surface; subtle inner border glow      |
| **Tabs**           | Scrollable; animated underline; accent gradient                    |
| **Progress Bars**  | Thin 2–3 px line; animated fill                                    |
| **Icons**          | Lucide/Feather white stroke                                        |
| **Animations**     | Fade transitions, shimmer load, tick animation on Done             |
| **Spacing**        | 24 px page padding; 16 px between cards                            |
| **Tone**           | Calm futuristic mentor vibe; no clutter                            |

---

# 🧭 NAVIGATION MAP

```
All Courses (Library)
 ├── + New Course → Search / Generate
 │        ↓
 │   Course Suggestions
 │        ↓
 │   Loading Screen
 │        ↓
 │   Course Main Page
 │            ↓
 │         Node Page → (Deeper Nodes…∞)
 │
 └── Continue Learning → Last Node
```

---

# 💬 INTERACTION HIGHLIGHTS

| Trigger                | Visual Feedback                                     |
| ---------------------- | --------------------------------------------------- |
| **Generate**           | Spinner + AI pulse animation                        |
| **Select Course**      | Card press → fade to loading                        |
| **Generate Subtopics** | Placeholder cards shimmer → fill in                 |
| **Mark Done**          | Check tick + green glow + slide-back                |
| **Course Complete**    | Confetti + “🎉 You’ve finished this course!”        |
| **Navigation**         | Slide transitions (left/right); breadcrumbs fade-in |

---

# 🌈 EMOTIONAL DESIGN

* **Personality:** Intelligent + supportive mentor.
* **Feeling:** Calm focus, like you’re in a digital library at night.
* **Interactions:** Small rewards for progress (create momentum).
* **Goal:** Make learning feel smooth, adaptive, and personal.

---

Would you like me to create the **Figma layout specification** next (component naming, constraints, and responsive rules for each screen) so your designer can start production-ready frames?
