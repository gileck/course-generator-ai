

# 🧭 PRODUCT DEFINITION DOCUMENT

### Product Name: **Learn Anything**

*(working name: “AI Learning Explorer”)*

---

## 🎯 PRODUCT OVERVIEW

### **Concept**

“Learn Anything” is an **AI-powered learning companion** that turns any curiosity — a question, topic, or goal — into a complete, structured, and adaptive learning program.
The user can start from a single prompt and end with a personalized **mini-degree** that grows with them, one node at a time.

The app merges:

* The curiosity-driven freedom of ChatGPT,
* The structure of a digital course, and
* The motivation of a progress-based dashboard.

---

## 🌱 CORE EXPERIENCE

| Principle                    | Description                                                         |
| ---------------------------- | ------------------------------------------------------------------- |
| **Instant Learning Path**    | User types *anything* → AI generates a complete learning path.      |
| **Infinite Depth**           | Each topic can expand indefinitely (nested nodes).                  |
| **Adaptive Exploration**     | AI tailors each layer based on the user’s focus.                    |
| **Visible Progress**         | Every node and course tracks completion visually.                   |
| **Calm, Intelligent Design** | Minimalist, glowing, and intuitive interface — AI as a calm mentor. |

---

## 🧩 CORE USER FLOWS

There are two main journeys:

1. **Create a new learning program** (from scratch).
2. **Continue an existing course** (from saved list).

---

### 1️⃣ FLOW — **Create a New Learning Program**

#### Overview:

User wants to learn something → AI interprets → suggests courses → user picks → course is generated → user learns.

#### Step-by-Step:

| Step | Screen                      | User Action                                                                                   | AI/System Behavior                                       | Next                      |
| ---- | --------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------- |
| 1    | **Search / Generate Page**  | Types a question or topic (“Metabolism and health”) → clicks **Generate**                     | AI analyzes input intent                                 | → 2                       |
| 2    | **Course Suggestions Page** | Reviews 3–5 AI-suggested course ideas (Title + Description + What you’ll learn) → chooses one | Selected course triggers AI course generation            | → 3                       |
| 3    | **Loading State**           | Waits while AI builds structure                                                               | Generates: overview, learning goals, first-level modules | → 4                       |
| 4    | **Course Page (Dashboard)** | Views overview, goals, and list of modules → clicks a module                                  | Opens first-level node                                   | → 5                       |
| 5    | **Node Page**               | Reads content, navigates tabs (Overview, Deep Dive, Terminology) → can generate subtopics     | AI generates subtopics or expands deeper                 | → 6                       |
| 6    | **Completion**              | Clicks “✅ Done”                                                                               | Marks node complete and returns to parent node           | Continue learning or exit |

---

### 2️⃣ FLOW — **Continue Existing Learning**

| Step | Screen               | User Action                                            | Result                    |
| ---- | -------------------- | ------------------------------------------------------ | ------------------------- |
| 1    | **All Courses List** | Opens the app → sees saved programs with progress bars | Selects course to resume  |
| 2    | **Course Page**      | Clicks “Continue Learning”                             | Opens last active node    |
| 3    | **Node Page**        | Reads, explores, marks done                            | Progress updates globally |

---

## 📱 APPLICATION STRUCTURE (Pages Overview)

1. **Search / Generate Page** – Start input
2. **Course Suggestions Page** – AI presents options
3. **Loading Screen** – Animated transition
4. **Course Page (Dashboard)** – Overview + top-level modules
5. **Node Page** – Learn, expand, and track progress
6. **All Courses List** – User’s library of programs

---

## 🧭 PAGE-BY-PAGE UX + UI SPECIFICATIONS

---

### **1. Search / Generate Page**

**Purpose:** Entry point for user intent.
**User Goal:** Express what they want to learn.

#### Layout

* **Header:** App logo + tagline “Learn Anything with AI.”
* **Main Input Area:**

  * Large rounded text box (centered).
  * Placeholder: “What do you want to learn today?”
  * Example hints below (“Metabolism and health,” “How AI works,” “Understanding climate change”).
  * Primary CTA: **Generate** (large gradient pill button).
* **Footer:** “AI-powered structured learning from any question.”

#### Design

* Background: gradient navy → violet (#0B0C1A → #191B35).
* Input field: glassmorphic, subtle inner glow.
* Button: gradient from electric blue → purple (#5B5FFF → #9A6BFF).
* Typography: Inter / SF Rounded.
* Animation: fade-in; slight glow pulse on hover.

---

### **2. Course Suggestions Page**

**Purpose:** Help user clarify their learning intent through course options.

#### Layout

* **Header:** “Choose Your Learning Path.”
* **Subtext:** “Based on your topic, here are a few ways to explore it.”
* **List of Course Cards:** (vertically scrollable)

  * Card includes:

    * Course Title (bold, 18pt)
    * “What you’ll learn” summary (2–3 lines)
    * Chips: difficulty, duration, style (theoretical / practical)
    * Button: **Select**
  * Tap to expand → show bullet list of outcomes.
* **Footer:**

  * “↻ Regenerate suggestions” (secondary button)
  * “✏️ Edit your question” (link)

#### Design

* Background: dark glass with floating gradient blobs.
* Cards: 16px rounded corners, subtle border.
* Accent color: neon blue highlight on hover.
* Animation: cards appear in staggered fade-up sequence.

---

### **3. Loading Screen**

**Purpose:** Transitional delight while AI generates the full course.

#### Layout

* **Centered animated icon:** glowing AI orb or spinner.
* **Text:** “Building your personalized course…”
* **Subtext:** “Creating learning goals and modules just for you.”
* **Optional quotes:** random inspirational learning quotes.

#### Design

* Background: animated gradient waves.
* Accent: blue glow, faint particle motion.
* Typography: semi-bold Inter 18pt center aligned.

---

### **4. Course Page (Program Dashboard)**

**Purpose:** Main course view — overview + modules.

#### Layout

**Top Section:**

* Breadcrumbs: “Home › Courses › [Title]”
* Back button: “← My Courses”
* Title: Course name (large)
* Progress bar: full width
* Info chips: Difficulty / Duration / Modules count
* Primary CTA: “Continue Learning”

**Overview Section:**

* Header: “What You’ll Learn”
* 2–3 paragraphs + bullet list of learning outcomes
* Small “AI Generated” badge
* “↻ Regenerate Overview” option

**Modules Section:**

* Header: “Modules”
* Vertical cards list:

  * Module Title (e.g., “1. Energy Systems”)
  * Short description
  * Progress pill: “2/5 done”
  * Estimated time
  * Button: **Open**
  * Status: checkmark if done
* FAB: “+ Add More Modules” (bottom-right, glowing)

#### Design

* Background: #0C0E1A
* Cards: deep matte with subtle shadow.
* Colors: white text, gradient accents.
* Animations: smooth slide when expanding cards.
* Emotion: “organized calmness.”

---

### **5. Node Page**

**Purpose:** Deep dive into a single topic or subtopic.

#### Layout

1. Breadcrumbs: “Course › Module › Node.”
2. Back link: “← Back to [Previous Node].”
3. Title: current node name.
4. Tabs: Overview / Deep Dive / Terminology (horizontal scroll).
5. Tab content: AI-generated text.
6. Subtopics Section:

   * Title: “Subtopics.”
   * **State A (none yet):**

     * Illustration + “No subtopics yet.”
     * CTA: **Generate Subtopics**.
   * **State B (exists):**

     * List of subtopic cards with titles, brief descriptions, checkbox for completion.
7. Bottom sticky footer:

   * ✅ **Done** button (full width).
   * Marks node complete and returns to parent.

#### Design

* Background: #0A0A17
* Tabs: underlined gradient animation.
* Button: large glowing pill (blue → violet).
* Subtopic cards: flat dark background, checkboxes glow on completion.
* Typography hierarchy:

  * Title: 22pt bold white
  * Body: 15pt 80% white
* Animation:

  * Smooth tab switch fade.
  * Expansion animation when generating subtopics.
  * Subtle confetti or green glow on marking done.

---

### **6. All Courses List (Library)**

**Purpose:** User’s home page for managing their courses.

#### Layout

* Header: “My Courses.”
* FAB: “+ New Course.”
* List of course cards:

  * Course title
  * Short summary
  * Progress bar
  * Chips: difficulty, duration
  * CTA: **Continue** or **Open**
  * Swipe left → Delete / Rename
* Sort options: by progress / name / recent.

#### Design

* Background: same dark base.
* Cards: consistent with Course Page.
* FAB: round gradient glow bottom-right.
* Empty state: “No courses yet. Start learning something new!”

---

## 🎨 VISUAL SYSTEM (UI FOUNDATION)

| Element           | Description                                                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Color Palette** | `#0B0C1A` background, gradient accents `#5B5FFF → #9A6BFF`, success green `#3DD68C`, text white `#FFFFFF` (100%), body text white (80%) |
| **Typography**    | **Primary:** Inter / SF Pro Rounded <br> **Headings:** Semi-bold 22–28px <br> **Body:** Regular 15–16px                                 |
| **Buttons**       | Pill shape, gradient fill, glowing hover, white text                                                                                    |
| **Cards**         | Rounded 16–20px, dark matte surface, subtle border glow                                                                                 |
| **Progress Bars** | Thin gradient line, smooth animation                                                                                                    |
| **Tabs**          | Scrollable, underline gradient, light glow                                                                                              |
| **Icons**         | Line icons (Lucide / Feather), monochrome white                                                                                         |
| **Animations**    | Smooth fade-in, AI shimmer loading, button pulse on hover, confetti or glow feedback on “Done”                                          |

---

## 🧠 INFORMATION ARCHITECTURE

```
All Courses
 ├── Course Page
 │     ├── Node Page (Level 1)
 │     │      ├── Node Page (Level 2)
 │     │      │      └── Node Page (Level 3…∞)
 │     └── Add More Modules
 └── Search / Generate
        └── Course Suggestions
               └── Generated Course
```

Each node behaves the same, making the structure infinitely expandable.

---

## 💬 INTERACTION DESIGN (USER FEEDBACK)

| Interaction        | Feedback                                             |
| ------------------ | ---------------------------------------------------- |
| Generate course    | AI shimmer animation + progress line                 |
| Select suggestion  | Subtle card press, then transition                   |
| Mark node done     | Checkmark tick animation + green glow + haptic pulse |
| Generate subtopics | Placeholder cards shimmer → fade into final list     |
| Complete course    | Animated confetti and “🎉 Course complete” message   |
| Navigation         | Slide transition left/right between pages            |

---

## 🌈 EMOTIONAL & BRAND EXPERIENCE

* **Tone:** Curious, encouraging, intelligent.
* **Emotion:** Calm empowerment — “learning feels effortless.”
* **Voice:** Supportive mentor, not instructor (“Let’s explore how this works…”).
* **Design language:** futuristic minimalism (think Notion × Duolingo × Apple Design).
* **Metaphor:** Climbing a tree of knowledge — each node a new branch, glowing as you master it.

---

## 🗺️ SUMMARY — END-TO-END USER FLOW

```
User opens app
 ↓
All Courses Page
 ↓ (click “+ New Course”)
Search / Generate Page
 ↓
Course Suggestions Page
 ↓ (select)
Loading Screen
 ↓
Course Main Page
 ↓ (select module)
Node Page
 ↓ (read / generate subtopics)
Mark Done → back up one level
 ↓
Course Page updates progress
 ↓
Return to All Courses
```

---

## ✅ OUTCOME

At the end of this flow, the user:

* Has a personalized, AI-generated structured course.
* Can explore endlessly deep nodes.
* Feels a clear sense of progress and mastery.
* Experiences a calm, futuristic interface that makes learning enjoyable and intuitive.
