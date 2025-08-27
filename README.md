# Olejra — Minimal React Client (Jira‑lite)

A beginner‑friendly pet project inspired by Jira, currently focused on the frontend. This step delivers a **React + Vite** client with a simple login form (no real backend yet).

## 🚀 Tech Stack

* **React 18**
* **Vite** (bundler)
* **JavaScript (no TS)**
* **CSS** (minimal styles)

> **Database requirement:** The backend uses **PostgreSQL only** (no MySQL/SQLite). Managed options like **Neon** or **Supabase** are recommended.
> Backend stack (planned): **Node.js 20 + Fastify + Prisma + PostgreSQL**. This README covers the client only.

## Branching Strategy (Minimal)

- **main** — stable; deploys to production (Render / Neon). **Direct pushes are prohibited.**
- **dev** — integration (daily development). **Direct pushes should be avoided/prohibited.**
- **feature/*** — short-lived branches for tasks; merged into `dev` via Pull Request.
- **hotfix/*** — urgent fixes branched from `main`; PR into `main`, then sync `main` → `dev`.

## Naming Conventions

- Feature: `feature/login-form`, `feature/tasks-advance-rule`
- Fix: `fix/task-move-bug`
- Chore: `chore/eslint-prettier`
- (Optional ticket prefix) `feature/OLE-12-login-form`

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

## ▶️ Getting Started (Cloned Repo)
**Requirements:** Node.js 20+, npm

```
npm i
npm run dev

create .env for future API calls
сlient/.env
VITE_API_URL="http://localhost:5174"
```

Open [http://localhost:5173](http://localhost:5173).



