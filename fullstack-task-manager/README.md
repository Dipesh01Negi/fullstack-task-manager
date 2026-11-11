# Taskflow | Full-Stack Task Manager

A modular task management application built with Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase Auth, and PostgreSQL.

## Features

- Email/password authentication with Supabase Auth
- Protected dashboard and session refresh middleware
- Task CRUD with server-side validation
- Per-user database access enforced by PostgreSQL Row-Level Security
- Task title, description, due date, priority, category, and status
- Search, filtering, due-date sorting, and summary statistics
- Responsive layout, light/dark/system theme, toast notifications, and loading skeletons
- REST API routes under `/api/tasks`

## Requirements

- Node.js 18.17 or newer
- npm
- A Supabase project

## 1. Install

```bash
npm install
```

Copy `.env.example` to `.env.local` and add the Project URL and anon/public key from your Supabase project settings:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

These are public client credentials intended for browser use. Never add a Supabase service-role key to this application or commit secrets.

## 2. Configure Supabase

1. Create a project in the Supabase dashboard.
2. Open **SQL Editor**.
3. Paste and run the contents of `supabase/schema.sql`.
4. Open **Authentication → URL Configuration** and set your local Site URL to `http://localhost:3000`.
5. Add your deployed Vercel URL to the allowed redirect URLs. For example: `https://your-app.vercel.app/**`.
6. For a quick development test, configure email confirmation under **Authentication → Providers → Email** according to your project requirements.

The SQL script creates the tasks table, constraints, indexes, update timestamp trigger, and RLS policies. Users can only access rows whose `user_id` matches their authenticated Supabase user ID.

## 3. Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
npm run typecheck
npm run build
```

## 4. Deploy to Vercel

1. Push this project to a Git repository and import it into Vercel.
2. In **Project Settings → Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for Production, Preview, and Development as needed.
3. Deploy. Add the production domain to Supabase Authentication's Site URL and Redirect URLs.

Vercel detects Next.js automatically. No custom build command is required.

## Project structure

```text
src/
  app/
    (auth)/
      login/
      signup/
    api/
      tasks/
        [id]/
    dashboard/
    globals.css
    layout.tsx
  components/
    auth/
    tasks/
    ui/
    providers.tsx
    theme-toggle.tsx
  lib/
    supabase/
      client.ts
      env.ts
      server.ts
    http.ts
    utils.ts
  middleware.ts
  types/
    task.ts
supabase/
  schema.sql
```

## API

All task endpoints require an authenticated Supabase session.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/tasks` | List the signed-in user's tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update one or more task fields |
| DELETE | `/api/tasks/:id` | Delete a task |

Example create request:

```json
{
  "title": "Finish database assignment",
  "description": "Complete schema and test queries",
  "due_date": "2026-12-01",
  "priority": "High",
  "category": "Study",
  "status": "Todo"
}
```

## Customization

- Add task fields in `src/types/task.ts`, then update `supabase/schema.sql` and the task form.
- Change global design tokens in `src/app/globals.css`.
- Reusable controls live in `src/components/ui`.
- Task-specific UI lives in `src/components/tasks`.
- API validation and persistence live in `src/app/api/tasks`.

## Notes

- Row-Level Security is the database security boundary. API handlers also scope reads, updates, and deletes to the authenticated user.
- The application intentionally uses the Supabase anon key with the signed-in user's session. A service-role key is not needed.
- If email confirmation is enabled, signup may require the user to confirm their email before a session is created.
