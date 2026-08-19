# Taskr

A fullstack task management app: add, edit, complete, delete, search, and filter tasks, plus a per-task detail view. Built with Next.js (App Router, frontend + backend in one project), Prisma, and PostgreSQL, styled after the "Modern task manager" design and animated with GSAP.

## Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Next.js Route Handlers (`app/api/`) — a RESTful JSON API running on the same Node.js server as the frontend
- **Database**: PostgreSQL, accessed via Prisma ORM
- **Animation**: GSAP (task add/remove/hover transitions, completed strikethrough)
- **Styling**: Plain CSS custom properties ported from the Taskr design system (no CSS framework)

## Prerequisites

- Node.js 18.18+ (developed on Node 22)
- A running PostgreSQL server (developed on PostgreSQL 17)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure the database connection**

   Copy `.env.example` to `.env` (or edit the existing `.env`) and set `DATABASE_URL` to point at your Postgres instance:

   ```
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/taskr?schema=public"
   ```

   Then create the database if it doesn't exist yet:

   ```bash
   psql -U postgres -h localhost -c "CREATE DATABASE taskr;"
   ```

   **Using Neon instead of local Postgres:** create a project at [neon.tech](https://neon.tech), copy the connection string from the Neon console, and use it as `DATABASE_URL` (Neon requires `?sslmode=require`):

   ```
   DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

   No local Postgres install or `CREATE DATABASE` step is needed — the database already exists in your Neon project.

3. **Run migrations**

   ```bash
   npx prisma migrate dev
   ```

   This creates the `Task` table from `prisma/schema.prisma` and generates the Prisma Client into `app/generated/prisma`.

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

The app is a standard Next.js project, so it deploys to Vercel with no extra config beyond the database connection.

1. **Push this repo to GitHub** (or GitLab/Bitbucket), then [import it in Vercel](https://vercel.com/new). Framework preset is auto-detected as Next.js.

2. **Set the `DATABASE_URL` environment variable** in the Vercel project's Settings → Environment Variables, using your Neon connection string (the same one from `.env`):

   ```
   DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

   Add it to all three environments (Production, Preview, Development) if you want preview deployments to work too. Neon is a good fit here since it's reachable over the public internet — a `localhost` Postgres instance won't be.

3. **Deploy.** Vercel runs `npm install` (which triggers `postinstall` → `prisma generate`, so the Prisma Client is always regenerated for the deployed build) then `npm run build`. No `prisma migrate` step is needed at deploy time as long as migrations were already applied to the Neon database from your machine (`npx prisma migrate deploy`, see Setup above) — Vercel's build only needs the generated client, not a live migration run.

4. **After the first deploy**, any new migration you create locally should be applied to the same Neon database with `npx prisma migrate deploy` before (or right after) pushing the code that depends on it — Vercel does not run migrations automatically.

## Other commands

```bash
npm run build   # production build (also type-checks)
npm run start   # run the production build
npm run lint    # ESLint
npx prisma studio  # browse/edit the database in a GUI
```

## Data model

A single `Task` model (`prisma/schema.prisma`) — no auth, categories, or due dates, per the assignment scope:

| Field       | Type     | Notes                                  |
| ----------- | -------- | --------------------------------------- |
| id          | String   | cuid, primary key                       |
| title       | String   | required                                |
| description | String   | optional, defaults to `""`              |
| completed   | Boolean  | defaults to `false`                     |
| createdAt   | DateTime | set on creation                         |
| updatedAt   | DateTime | bumped on every update                  |

## API

All endpoints live under `app/api/tasks/` and return JSON.

| Method | Route            | Body                                                          | Description                          |
| ------ | ----------------- | -------------------------------------------------------------- | ------------------------------------- |
| GET    | `/api/tasks`      | —                                                              | List all tasks, newest first          |
| POST   | `/api/tasks`      | `{ title: string, description?: string }`                      | Create a task                         |
| PATCH  | `/api/tasks/:id`  | any of `{ title?, description?, completed? }`                  | Update a task (partial)               |
| DELETE | `/api/tasks/:id`  | —                                                              | Delete a task                         |

Validation errors return `400` with `{ error: string }`. Updating/deleting a missing task returns `404`. Unexpected failures return `500`. The frontend surfaces these messages in a dismissible banner (and reverts optimistic UI changes on failure for toggle/delete).

Search and status filtering (All / Incomplete / Completed) happen client-side against the loaded task list, and compose together (e.g. searching "milk" while filtered to "Completed" only shows completed tasks matching "milk").

## Project structure

```
app/
  api/tasks/route.ts          GET, POST
  api/tasks/[id]/route.ts     PATCH, DELETE
  page.tsx                    renders <TaskManager />
  layout.tsx, globals.css     root layout + design tokens
components/
  TaskManager.tsx              top-level state: fetch, search, filter, view (list/detail), dialog
  Sidebar.tsx                  dark gradient nav: stat cards + "New Task"
  TaskList.tsx                 search bar, filter tabs, empty states, row list
  TaskRow.tsx                  single task row + GSAP transitions
  TaskDetail.tsx                full task view (opened by clicking a row)
  TaskFormDialog.tsx           add/edit modal (title + description)
  ui/                          small presentational primitives (Button, Input, Textarea, Checkbox, Dialog, Label)
lib/
  prisma.ts                    Prisma Client singleton (pg driver adapter)
  api.ts                       typed fetch wrappers for the frontend
  types.ts                     shared Task/TaskFilter types
  format.ts, task-ui.ts        date formatting + status badge styling helpers
prisma/
  schema.prisma                Task model
  migrations/                  SQL migration history
```

## Design

Visual design and layout (dark-gradient sidebar with stat cards, segmented filter-tab control, circular checkboxes, and a task detail view reached by clicking a row) follow the "Modern task manager site design" mockup. Design tokens (colors, fonts, radii) live in `app/globals.css`. The detail view is purely a client-side UI state (`TaskManager`'s `view`/`selectedId`), not a separate route — it reuses the same task data and mutation handlers as the list.
