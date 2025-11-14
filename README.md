# Olejra — Minimal React Client (Jira‑lite)

A minimal React client for the Olejra task board. Uses React + Vite and connects to the Olejra backend (Fastify + PostgreSQL + Prisma) via Axios. Includes login page, board page, and task movement using the new POST /tasks/advance payload API.

## 🚀 Tech Stack

- **React 18**
- **Vite** (bundler)
- **JavaScript (no TS yet)**
- **Axios** (API client)
- **React Router**
- **CSS modules / plain CSS**

## Naming Conventions

- **feat:** New feature
- **fix:** Bug fix
- **refactor:** Code refactoring without changing behavior or adding features
- **docs:** Documentation-only changes
- **chore:** Maintenance tasks (config, build, tooling)
- **test:** Add or update tests

## 📦 Project Structure

```
src/
  main.jsx
  App.jsx
  api/
    axios.jsx        # shared axios client
    tasks.js         # tasks API wrapper
  components/
    pages/
      LoginPage.jsx
      BoardPage.jsx
  utils/
    status.js        # STATUS_FLOW and canTransition
  styles/
    *.css
```

## ▶️ Getting Started (Cloned Repo)

**Requirements:** Node.js 20+, npm

```
npm i
npm run dev

Create `olejra-frontend/.env`:
VITE_API_BASE_URL="http://localhost:5174/api"
```

Open [http://localhost:5173](http://localhost:5173).

## Task Movement

The frontend now uses the backend transition API:
POST /tasks/advance with payload { taskId, from, to }
Local validation ensures only valid forward transitions based on STATUS_FLOW.
