# Taskr

A fullstack task management app: add, edit, complete, delete, search, and filter tasks.

## Dependencies

- Node.js 18.18+ (developed on Node 22)
- A PostgreSQL database (local or hosted, e.g. [Neon](https://neon.tech))
- Next.js 16 (App Router), React 19, TypeScript, Prisma ORM, GSAP

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure the database connection**

   Copy `.env.example` to `.env` and set `DATABASE_URL` to point at your Postgres instance:

   ```
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/taskr?schema=public"
   ```

3. **Run migrations**

   ```bash
   npx prisma migrate dev
   ```

## Running the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
