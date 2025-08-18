# Olejra — Minimal React Client (Jira‑lite)

A beginner‑friendly pet project inspired by Jira, currently focused on the frontend. This step delivers a **React + Vite** client with a simple login form (no real backend yet).

## 🚀 Tech Stack

* **React 18**
* **Vite** (bundler)
* **JavaScript (no TS)**
* **CSS** (minimal styles)

> **Database requirement:** The backend uses **PostgreSQL only** (no MySQL/SQLite). Managed options like **Neon** or **Supabase** are recommended.
> Backend stack (planned): **Node.js 20 + Fastify + Prisma + PostgreSQL**. This README covers the client only.

## 🗄️ Database: PostgreSQL (Required)

Although this repository currently contains the client only, the API is designed for **PostgreSQL**. When you add/clone the API later, use:

* **Local dev:** PostgreSQL 14+ installed locally *or* a dev database on **Neon/Supabase**.
* **Connection string (API/.env):**

  ```env
  DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
  ```
* **Prisma datasource (for API):**

  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  ```
* **Why Postgres?** Strong constraints/relations, JSONB, great Prisma support, easy managed hosting.

> If you only run the **client**, Postgres isn’t required yet. It becomes mandatory once you hook up the API.

## 📦 Project Structure

```
client/
  src/
    main.jsx        # entry point, mounts the app to #root
    App.jsx         # root component
    pages/
      Login.jsx     # simple login form
    index.css       # minimal styles
```

## ✨ Current Features

* Single page: login form (email + password)
* Basic client‑side checks (empty fields → alert)
* Mock login via `alert()` (no API call yet)

## ▶️ Getting Started (Cloned Repo)

If you cloned this repository from GitHub, **you do NOT need to create a new React app**. Just install and run:

**Requirements:** Node.js 20+, npm

```bash
# 1) go to the client app (adjust if your repo root already IS the client)
cd client

# 2) install deps
npm i

# 3) (optional) create .env for future API calls
# client/.env
# VITE_API_URL="http://localhost:5174"

# 4) start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Why not `npm create vite@latest`?

That command is only for **starting a brand‑new project from scratch**. If you already cloned this repo, the client is set up—just install and run.

## 🔧 Configuration

* `client/.env` (optional for now)

  ```env
  VITE_API_URL="http://localhost:5174"
  ```

  Used later when we hook up the real `/auth/login` endpoint.

## 📜 NPM Scripts

```bash
npm run dev      # start Vite dev server
npm run build    # production build
npm run preview  # preview the production build locally
```

## 🧭 Roadmap

* Hook up real backend (Fastify + Prisma)
* Replace `alert()` with POST `/auth/login` and store token
* Add React Router + protected routes
* Implement Projects/Statuses/Issues views (Kanban)
* Basic tests (Vitest + React Testing Library)
* Deploy: Render (static client)
* **DB:** PostgreSQL (Neon/Supabase in prod; local Postgres in dev)

