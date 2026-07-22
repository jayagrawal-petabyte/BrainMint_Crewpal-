# Daily Progress Log - CREWPAL Task Management

*This document tracks the daily progress of the 30-day CREWPAL Task Management frontend assignment.*

---

## 🟢 Week 1: Project Setup & Design System

### Day 1
- **Status:** ✅ Completed
- **Tasks Done:**
  - Initialized the Vite + React + TypeScript project boilerplate.
  - Installed and configured Tailwind CSS (v4) for custom styling.
  - Set up the foundational folder structure (`src/components`, `src/pages`, `src/layouts`, etc.).
  - Added clean `App.tsx` and global styles.
  - Initialized the Git repository and pushed the clean base setup to GitHub.

### Day 2
- **Status:** ✅ Completed
- **Tasks Done:**
  - Configured global styles with Tailwind v4 custom theme and color palettes.
  - Created reusable base UI components: `Button`, `Input`, and `Card` components.
  - Established initial component structure in `src/components/common`.

### Day 3
- **Status:** ✅ Completed
- **Tasks Done:**
  - Setup React Router DOM for client-side routing.
  - Created application layout structure with `MainLayout`, `Sidebar`, and `Header`.
  - Added placeholder pages for Dashboard, Tasks, and Projects.
  - Integrated routing and layouts in `App.tsx` and `src/routes/index.tsx`.

### Day 4
- **Status:** 🔄 Reverted (Out of Scope)
- **Notes:** Auth/Login implementation was built but reverted — authentication is handled by other team members. Harsh's scope is Task Management only.

### Day 5
- **Status:** ✅ Completed
- **Tasks Done:**
  - Defined `Task` TypeScript interface with all required fields (`id`, `title`, `description`, `techTag`, `status`, `priority`, `dueDate`, `assignees[]`, timestamps) in `src/types/task.ts`.
  - Created Zustand task store (`src/store/tasks/index.ts`) with full CRUD actions: `addTask`, `updateTask`, `deleteTask`, `assignTask`, `updateStatus`, `updatePriority`.
  - Added filter logic (`setSearch`, `setStatusFilter`, `setPriorityFilter`) and selector `getFilteredTasks()`.
  - Seeded store with 7 mock tasks matching the CREWPAL design data (School ERP, Mobile App, Management Project, etc.).
  - Wired store to Tasks page for build verification — `npm run build` passes ✅.

### Day 6
- **Status:** ✅ Completed
- **Tasks Done:**
  - Built the full Task List UI in `src/pages/tasks/index.tsx` matching the `Project → Task.jpg` CREWPAL mockup exactly.
  - Tasks are grouped into 3 status sections: **ON TRACK** (olive background), **DELAYED** (rose background), **COMPLETED** (sage/cream background).
  - Each task card displays: tech tag label, task title, assignee avatar stack (overlapping circles), and a row of action icons (Add, Calendar, Pin, Flag, More).
  - Implemented live search bar (rose pill input with magnifier icon and dropdown chevron) that filters tasks by name in real-time using the Zustand store.
  - Added **New Task** forest-green pill button (hooks up to modal in Day 10).
  - Added empty state when no tasks match the search query.
  - `npm run build` passes ✅ — zero TypeScript errors.

### Day 7
- **Status:** ✅ Completed
- **Tasks Done:**
  - Extracted `TaskCard` into its own reusable component (`src/components/cards/TaskCard.tsx`) with hover scale/shadow effects and smooth transitions.
  - Added priority dot indicator (red for high, olive for medium, grey for low) on each card.
  - Added formatted due date display on cards with red highlight for overdue tasks.
  - Built click-to-open Task Detail view matching the `Project → Task-1.jpg` mockup — shows expanded card with title, tech tag, assignees, description area, and Back button.
  - Action icon buttons use `stopPropagation` so they don't trigger card click.
  - `npm run build` passes ✅ — zero TypeScript errors.

---

## 🟡 Week 2: Layouts & Task Cards

### Day 8
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 8)*

### Day 9
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 9)*

### Day 10
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 10)*

### Day 11
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 11)*

### Day 12
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 12)*

### Day 13
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 13)*

### Day 14
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 14)*

---

## 🟠 Week 3: State Management & CRUD Modals

### Day 15
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 15)*

### Day 16
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 16)*

### Day 17
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 17)*

### Day 18
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 18)*

### Day 19
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 19)*

### Day 20
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 20)*

### Day 21
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 21)*

---

## 🟣 Week 4: Polish & Final Review

### Day 22
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 22)*

### Day 23
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 23)*

### Day 24
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 24)*

### Day 25
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 25)*

### Day 26
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 26)*

### Day 27
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 27)*

### Day 28
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 28)*

### Day 29
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 29)*

### Day 30
- **Status:** ⏳ Pending
- **Tasks Done:**
  - *(Will be updated after Day 30)*
