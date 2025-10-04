# schema.md

## Entities

### User *(optional for single-user MVP)*

Represents a learner/owner account.

| Field      | Type      | Description             |
| ---------- | --------- | ----------------------- |
| id         | UUID (PK) | Unique user identifier. |
| email      | STRING    | User email (unique).    |
| name       | STRING    | Display name.           |
| created_at | TIMESTAMP | Creation timestamp.     |

---

### Course

Canonical course (program) generated from user input.

| Field              | Type                          | Description                                        |
| ------------------ | ----------------------------- | -------------------------------------------------- |
| id                 | UUID (PK)                     | Unique course identifier.                          |
| created_by_user_id | UUID (FK → User.id, optional) | Creator/owner; nullable in strict single-user MVP. |
| title              | STRING                        | Course title.                                      |
| overview_summary   | STRING                        | Short “what you’ll learn” summary.                 |
| overview_detail    | TEXT                          | Longer course description / goals.                 |
| created_at         | TIMESTAMP                     | Creation timestamp.                                |
| updated_at         | TIMESTAMP                     | Last update timestamp.                             |

---

### Node

A topic at any depth. Top-level modules are nodes with `parent_id = NULL` and `depth = 1`.

| Field              | Type                          | Description                                    |
| ------------------ | ----------------------------- | ---------------------------------------------- |
| id                 | UUID (PK)                     | Unique node identifier.                        |
| course_id          | UUID (FK → Course.id)         | Course this node belongs to.                   |
| parent_id          | UUID (FK → Node.id, nullable) | Parent node; NULL for top-level module.        |
| title              | STRING                        | Node title.                                    |
| synopsis           | STRING                        | 1–2 line card description.                     |
| order_index        | INT                           | Position among siblings (ascending).           |
| depth              | INT                           | Hierarchy level (1 = module).                  |
| tab_overview_md    | TEXT (nullable)               | Overview tab content (Markdown / rich text).   |
| tab_deep_dive_md   | TEXT (nullable)               | Deep-dive tab content.                         |
| tab_terminology_md | TEXT (nullable)               | Terminology tab content.                       |
| is_done            | BOOL (default false)          | Completion flag (MVP embeds progress on node). |
| done_at            | TIMESTAMP (nullable)          | When node was marked done.                     |
| last_viewed_at     | TIMESTAMP (nullable)          | Last time user viewed this node.               |
| created_at         | TIMESTAMP                     | Creation timestamp.                            |
| updated_at         | TIMESTAMP                     | Last update timestamp.                         |

---

