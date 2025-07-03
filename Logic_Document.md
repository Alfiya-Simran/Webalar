
---

## 📄 2. `Logic_Document.md`

Place in the root or `/docs/` folder:

```markdown
# 🧠 Logic_Document.md

## Smart Assign Logic

The system auto-assigns a task to the user with the **fewest current active tasks**:

- "Active tasks" = tasks with status `Todo` or `In Progress`
- On button click:
  1. Count active tasks for each user
  2. Choose user with the lowest count
  3. Assign the task to that user
  4. Log and emit the update via Socket.IO

This ensures fair task distribution across users.

---

## Conflict Handling Logic

Conflict handling ensures that two users do not overwrite each other’s changes:

- Each task has an `updatedAt` field
- Before updating, client sends its copy's `updatedAt`
- Server checks:
  - If client's timestamp is **older** than server version → **Conflict**
- Server returns `409` with the current version
- UI displays both versions and offers:
  - ✅ Overwrite with local version
  - 🔄 Keep server version
  - ❌ Cancel

This encourages intentional collaboration and avoids silent overwrites.
