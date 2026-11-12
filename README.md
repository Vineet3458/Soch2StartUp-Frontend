# Soch2StartUp – Frontend

React + Vite + React Router + Axios + Recharts.

## Setup
1. `npm install`
2. Start the backend first (see the backend README), then run `npm run dev`
3. Open http://localhost:5173

In development, `/api` requests are proxied to http://localhost:5000 (see `vite.config.js`).
For production, set `VITE_API_URL` in `.env` and run `npm run build`.

## Folder structure
```
src/
  api/          Axios instance (adds the JWT automatically)
  context/      AuthContext – login, register, logout, current user
  components/   Reusable UI: Navbar, ProtectedRoute, ScoreGauge, MetricsChart, SwotGrid...
  pages/        One file per screen: Home, Login, Register, Dashboard,
                ValidateIdea, IdeaReport, Compare, AdminPanel
  styles/       Global CSS with animations
  App.jsx       Route definitions
  main.jsx      App entry point
```

## Role-based access
- Everyone logged in: Dashboard, Validate Idea, Report, Compare
- Mentor / Industry Expert: can also leave feedback on ideas
- Admin / Superadmin: Admin panel (only Superadmin can change roles)
