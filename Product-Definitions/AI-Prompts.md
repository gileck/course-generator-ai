# ai_prompts.md

Authoritative prompt templates for the MVP.
Each template includes:

* **Inputs**: variables you substitute before sending.
* **Prompt**: what you send to the model (return **JSON only**).
* **JSON Schema**: the contract the output must satisfy.
* **Example Response**: realistic sample you can test your parser against.

> Notes
>
> * Return **JSON only**, no prose.
> * Use concise, accurate text.
> * Length guidance is given per field to keep UIs tidy.
> * Difficulty enum: `"beginner" | "intermediate" | "advanced"`.

---

## 1) Select Course (from first user input)

### Inputs

* `{{user_input}}` — the raw subject/question the user typed (string)
* Optional: `{{language}}` (default `"en"`)

### Prompt

```text
You are an expert curriculum designer. Interpret the learner's topic and propose up to three distinct course directions.

User input:
"{{user_input}}"

Requirements:
- Offer 1–3 **diverse** course options.
- Each option must include: title, overview_summary, overview_detail, difficulty, learning_outcomes (3–6).
- Keep titles ≤ 70 chars; summaries ≤ 180 chars; outcomes each ≤ 120 chars.
- Choose the most appropriate difficulty.
- Estimate duration in minutes for a focused mini-degree.
- Output **JSON only** conforming to the JSON Schema below. Do not include commentary.

JSON Schema (Draft-07):
{
  "type": "object",
  "required": ["suggestions"],
  "properties": {
    "suggestions": {
      "type": "array",
      "minItems": 1,
      "maxItems": 3,
      "items": {
        "type": "object",
"required": ["title","overview_summary","overview_detail","difficulty","learning_outcomes"],
        "properties": {
          "title": { "type": "string", "maxLength": 70 },
          "overview_summary": { "type": "string", "maxLength": 180 },
          "overview_detail": { "type": "string" },
          "difficulty": { "type": "string", "enum": ["beginner","intermediate","advanced"] },
          "learning_outcomes": {
            "type": "array",
            "minItems": 3,
            "maxItems": 6,
            "items": { "type": "string", "maxLength": 120 }
          }
        }
      }
    }
  }
}
```

### Example Response

```json
{
  "suggestions": [
    {
      "title": "Foundations of Metabolic Health",
      "overview_summary": "How metabolism drives energy, hormones, and longevity.",
      "overview_detail": "Build a working model of human metabolism, from macronutrient fate to regulation and health-span. Balance core biochemistry with practical interpretation.",
      "difficulty": "intermediate",
      
      "learning_outcomes": [
        "Explain major metabolic pathways and their control",
        "Relate metabolism to glycemic control, lipids, and body composition",
        "Interpret common metabolic biomarkers",
        "Identify lifestyle levers that improve metabolic health"
      ]
    },
    {
      "title": "Metabolism Explained: From Food to Fuel",
      "overview_summary": "Beginner-friendly tour from molecules to energy.",
      "overview_detail": "Understand how food becomes ATP, the role of enzymes, and how cells allocate energy at rest and during exercise.",
      "difficulty": "beginner",
      
      "learning_outcomes": [
        "Describe ATP and why cells need it",
        "Outline glycolysis, Krebs, and the ETC in plain language",
        "Differentiate carbs, fats, and protein roles in energy"
      ]
    },
    {
      "title": "Optimizing Metabolic Health: A Practical Playbook",
      "overview_summary": "Apply evidence-based levers to improve metabolic fitness.",
      "overview_detail": "Translate metabolism into actionable routines for nutrition, activity, sleep, and stress with safety guardrails.",
      "difficulty": "intermediate",
      
      "learning_outcomes": [
        "Prioritize behaviors that enhance insulin sensitivity",
        "Plan meals around protein and fiber without rigid tracking",
        "Use simple metrics to monitor progress"
      ]
    }
  ]
}
```

---

## 2) Generate Course (after user selects a suggestion)

### Inputs

* `{{selected_title}}`
* `{{selected_overview_summary}}`
* `{{selected_overview_detail}}`
* `{{selected_difficulty}}`
 
* Optional focus tags: `{{focus_notes}}` (string; e.g., “prioritize practical applications”)
* Optional `{{language}}` (default `"en"`)

### Prompt

```text
Create a course scaffold (top-level modules only) for the selected direction.

Selected course:
- Title: {{selected_title}}
- Summary: {{selected_overview_summary}}
- Detail: {{selected_overview_detail}}
- Difficulty: {{selected_difficulty}}
 
- Notes: {{focus_notes}}

Requirements:
- Produce 4–8 top-level modules (no subtopics yet).
- Each module: title (≤ 70 chars), synopsis (≤ 140 chars).
- Modules should be ordered from foundational → applied.
- Output **JSON only** per the schema.

JSON Schema:
{
  "type": "object",
  "required": ["course","modules"],
  "properties": {
    "course": {
      "type": "object",
      "required": ["title","overview_summary","overview_detail","difficulty"],
      "properties": {
        "title": { "type": "string" },
        "overview_summary": { "type": "string" },
        "overview_detail": { "type": "string" },
        "difficulty": { "type": "string", "enum": ["beginner","intermediate","advanced"] },
         
      }
    },
    "modules": {
      "type": "array",
      "minItems": 4,
      "maxItems": 8,
      "items": {
        "type": "object",
        "required": ["title","synopsis"],
        "properties": {
          "title": { "type": "string", "maxLength": 70 },
          "synopsis": { "type": "string", "maxLength": 140 },
          
        }
      }
    }
  }
}
```

### Example Response

```json
{
  "course": {
    "title": "Foundations of Metabolic Health",
    "overview_summary": "How metabolism drives energy, hormones, and longevity.",
    "overview_detail": "Build a working model of metabolism from pathways to regulation and health-span.",
    "difficulty": "intermediate",
    "est_total_minutes": 240
  },
  "modules": [
    { "title": "Metabolic Foundations", "synopsis": "Core terms, compartments, and energy logic." },
    { "title": "Macronutrient Fate", "synopsis": "How carbs, fats, proteins are processed and stored." },
    { "title": "Energy Systems", "synopsis": "Glycolysis, Krebs cycle, and electron transport overview." },
    { "title": "Hormonal Regulation", "synopsis": "Insulin, glucagon, thyroid, cortisol in metabolism." },
    { "title": "Biomarkers & Testing", "synopsis": "Glucose, lipids, HbA1c, fasting vs. postprandial." },
    { "title": "Lifestyle Levers", "synopsis": "Nutrition, activity, sleep, stress—safely applied." }
  ]
}
```

---

## 3) Generate Subtopics for a Node (on demand)

> **Context is mandatory.** Pass the full chain of titles from course → … → current node so the model stays on-topic and non-duplicative.

### Inputs

* `{{course_title}}`
* `{{context_chain}}` — JSON array of titles from root to current node, e.g. `["Foundations of Metabolic Health","Energy Systems","Cellular Respiration"]`
* `{{current_node_title}}` (redundant but explicit)
* Optional: `{{count}}` (default 6), `{{granularity}}` (`"survey" | "balanced" | "deep"`), `{{focus}}` (free text), `{{language}}`

### Prompt

```text
Generate subtopics for the current node, using the full context chain. Avoid overlap with ancestors or sibling concepts; keep each subtopic distinct and teachable.

Context:
- Course: "{{course_title}}"
- Path: {{context_chain}}
- Current node: "{{current_node_title}}"
- Desired count: {{count}}
- Granularity: {{granularity}}  // survey = broader; deep = narrower and technical
- Focus notes: "{{focus}}"

Requirements:
- Return {{count}} subtopics unless context reasonably limits fewer (min 3).
- Each subtopic: title (≤ 70 chars), synopsis (≤ 140 chars).
- Order from prerequisite → advanced.
- Output **JSON only** per schema.

JSON Schema:
{
  "type": "object",
  "required": ["subtopics"],
  "properties": {
    "subtopics": {
      "type": "array",
      "minItems": 3,
      "items": {
        "type": "object",
        "required": ["title","synopsis"],
        "properties": {
          "title": { "type": "string", "maxLength": 70 },
          "synopsis": { "type": "string", "maxLength": 140 },
          
        }
      }
    }
  }
}
```

### Example Response

```json
{
  "subtopics": [
    { "title": "Glycolysis", "synopsis": "Cytosolic glucose breakdown to pyruvate and ATP." },
    { "title": "Pyruvate to Acetyl-CoA", "synopsis": "Link reaction feeding the Krebs cycle." },
    { "title": "Krebs (TCA) Cycle", "synopsis": "Mitochondrial hub harvesting electrons for the ETC." },
    { "title": "Electron Transport Chain", "synopsis": "Proton gradient, complexes I–IV, ATP synthase." },
    { "title": "ATP Yield & Efficiency", "synopsis": "Stoichiometry, leaks, and practical limits." }
  ]
}
```

---

## 4) Generate Node Content (tabs for a specific node)

> **Context is mandatory.** Include the course title and full path of ancestor titles. Produce content for **Overview**, **Deep Dive**, and **Terminology** tabs.

### Inputs

* `{{course_title}}`
* `{{context_chain}}` — JSON array of titles course → … → current node
* `{{current_node_title}}`
* Optional: `{{reading_level}}` (`"plain" | "intermediate" | "technical"`), `{{language}}`

### Prompt

```text
Write concise, accurate learning content for the current node. Use the full context chain to stay consistent with the course’s direction. Generate the three tab views.

Context:
- Course: "{{course_title}}"
- Path: {{context_chain}}
- Current node: "{{current_node_title}}"
- Reading level: {{reading_level}}

Tab requirements:
- OVERVIEW (markdown): 2–4 short paragraphs + 3–6 bullet learning outcomes. Plain language; max ~350 words.
- DEEP_DIVE (markdown): Focused technical detail, mechanisms, caveats, and common misconceptions. Add 1 short illustrative example. Max ~500 words.
- TERMINOLOGY (markdown): 8–15 concise term: definition pairs in bullet list form (e.g., **Term** — definition).
- Also suggest a difficulty for this node (no time estimate).

Style:
- Avoid fluff; be precise and neutral.
- Use markdown headings (##) sparingly.
- No external links or citations in MVP.
- Output **JSON only** per the schema.

JSON Schema:
{
  "type": "object",
"required": ["overview_md","deep_dive_md","terminology_md","suggested_difficulty"],
  "properties": {
    "overview_md": { "type": "string" },
    "deep_dive_md": { "type": "string" },
    "terminology_md": { "type": "string" },
    "suggested_difficulty": { "type": "string", "enum": ["beginner","intermediate","advanced"] }
  }
}
```

### Example Response

```json
{
  "overview_md": "## What is Cellular Respiration?\nCellular respiration is the set of processes cells use to extract energy from fuel molecules and convert it into ATP, the usable energy currency.\n\nAt a high level, glucose is split in glycolysis, acetyl-CoA feeds the Krebs cycle, and electron carriers (NADH, FADH2) drive the electron transport chain to power ATP synthase.\n\n**Learning outcomes**\n- Trace carbon flow from glucose to CO₂\n- Explain how NADH/FADH₂ enable ATP production\n- Distinguish aerobic vs. anaerobic routes\n- Identify where regulation constrains output",
  "deep_dive_md": "## Mechanism\nGlycolysis yields 2 ATP and 2 NADH per glucose. Pyruvate dehydrogenase produces acetyl-CoA, regulated by energy charge and substrate availability. The TCA cycle harvests high-energy electrons; ETC complexes establish a proton-motive force across the inner mitochondrial membrane. ATP synthase couples proton flow to ATP formation.\n\n## Efficiency & Control\nTheoretical ATP yield per glucose is ~30–32 but varies with shuttle systems and proton leak. Rate control is distributed (PFK-1, pyruvate dehydrogenase, citrate synthase), influenced by ADP/ATP, NADH/NAD⁺, Ca²⁺, and oxygen. Mitochondrial uncoupling reduces ATP yield while increasing heat.\n\n## Example\nDuring moderate cycling, rising ADP stimulates oxidative phosphorylation; increased citrate can feedback to slow glycolysis, shifting substrate use toward fat oxidation as intensity stabilizes.\n\n## Pitfalls\nConfusing substrate-level phosphorylation with oxidative phosphorylation; assuming a fixed ATP yield across tissues.",
  "terminology_md": "- **ATP** — Primary cellular energy currency.\n- **NADH/FADH₂** — Electron carriers delivering reducing power to the ETC.\n- **ETC** — Protein complexes that create a proton gradient to power ATP synthase.\n- **PFK-1** — Key glycolytic regulatory enzyme.\n- **Pyruvate dehydrogenase** — Converts pyruvate to acetyl-CoA; tightly regulated.\n- **Proton-motive force** — Electrochemical gradient driving ATP synthesis.\n- **Uncoupling** — Proton leak that lowers ATP yield and increases heat.\n- **Oxidative phosphorylation** — ATP generation using oxygen as terminal electron acceptor.\n- **Anaerobic glycolysis** — ATP production without oxygen, yielding lactate.\n- **Citrate** — TCA intermediate that inhibits PFK-1 at high levels.",
  "suggested_difficulty": "intermediate"
}
```

---

## Implementation Notes (MVP)

* For **Generate Course**, persist only course + top-level modules. Node tab content is generated lazily on first open (via **Generate Node Content**).
* For **Generate Subtopics**, persist child nodes with titles/synopses; generate their tab content later on demand.
* Always pass `{{context_chain}}` as an array from course → … → current node (titles only are sufficient in MVP).
