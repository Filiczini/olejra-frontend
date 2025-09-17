# Olejra — Minimal React Client (Jira‑lite)

A beginner‑friendly pet project inspired by Jira, currently focused on the frontend. This step delivers a **React + Vite** client with a simple login form (no real backend yet).

## 🚀 Tech Stack

* **React 18**
* **Vite** (bundler)
* **JavaScript (no TS)**
* **CSS** (minimal styles)

> **Database requirement:** The backend uses **PostgreSQL only** (no MySQL/SQLite). Managed options like **Neon** or **Supabase** are recommended.
> Backend stack (planned): **Node.js 20 + Fastify + Prisma + PostgreSQL**. This README covers the client only.

## Naming Conventions

- **feat:** New feature
- **fix:** Bug fix
- **refactor:** Code refactoring without changing behavior or adding features
- **docs:** Documentation-only changes
- **chore:** Maintenance tasks (config, build, tooling)
- **test:** Add or update tests

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



