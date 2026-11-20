# Soch2Startup — Frontend Client

A high-performance, responsive single-page web application built with **React 18** and **Vite 5**, featuring custom **Aceternity UI** design components, dark/light theme switching, and real-time **Server-Sent Events (SSE)** synchronization.

---

## Tech Stack & Architecture

- **Core Library:** React 18, Vite 5 (ES modules)
- **Routing:** React Router 6 (SPA routing with role-based access control)
- **Design System:** Custom CSS tokens, responsive flex/grid layouts, light/dark theme persistence
- **Interactive UI:** Aceternity UI component suite (Spotlight, SpotlightCard, FlipWords, BentoGrid, InfiniteMovingCards, Meteors, ShimmerButton, GridBackground, TimelineSteps)
- **Typography:** Geist Variable & Geist Mono Variable (bundled locally via `@fontsource-variable`)
- **Visual Analytics:** Recharts (score meters, radar dimensions, category distributions)
- **Icons:** Lucide React
- **Real-Time Client:** Server-Sent Events (SSE) with automatic cache invalidation and reconnect resilience

---

## Project Structure

```
soch2startup-frontend/
├── public/                 # Static assets (favicons, platform illustrations)
├── src/
│   ├── api/                # Axios HTTP client, token interceptors, error normalization
│   ├── components/         # Reusable UI components
│   │   ├── aceternity/     # Custom Aceternity UI components (zero Framer Motion bloat)
│   │   ├── charts.jsx      # Recharts visualizations and score meters
│   │   ├── fx.jsx          # Motion effects, count-ups, reveal animations
│   │   ├── ui.jsx          # Modals, form fields, buttons, tables, badges
│   │   └── Brand.jsx       # Brand mark, logo typography
│   ├── context/            # React Context providers (AuthContext, ConfigContext)
│   ├── lib/                # Client utilities (live.js for SSE, format.js for dates/labels)
│   ├── pages/              # Top-level route pages (Home, Auth/Login/Register, Legal)
│   ├── styles/             # Modular CSS stylesheets (theme, ui, app, aceternity)
│   ├── views/              # Role-specific workspaces (Founder, Mentor, Expert, Admin)
│   ├── App.jsx             # Route definitions & layout wrapping
│   └── main.jsx            # Application entry point & React root
├── test-frontend.test.mjs  # Automated test suite (routes, RBAC sidebar links, auth, Aceternity)
├── vercel.json             # Vercel SPA routing rewrite rules
├── vite.config.js          # Vite bundler, proxy configuration & build settings
├── eslint.config.js        # ESLint flat configuration (browser + node environments)
└── package.json            # Scripts, dependencies, and metadata
```

---

## Available Scripts

From the `soch2startup-frontend` directory:

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts Vite dev server at `http://localhost:5173` (with HMR) |
| **Production Build** | `npm run build` | Compiles optimized production bundle in `dist/` |
| **Preview Build** | `npm run preview` | Locally serves and previews the production build |
| **Automated Tests** | `npm test` | Runs the 16 automated frontend unit & routing tests |
| **Linting** | `npm run lint` | Runs ESLint verification (0 errors, 0 warnings) |

---

## Environment Variables

Copy `.env.example` to `.env` to configure frontend runtime settings:

```env
# Production Backend URL (on Render or cloud hosting)
# Example: https://soch2startup-backend.onrender.com/api
# If omitted or left empty, defaults to /api for local development with Vite proxy
VITE_API_URL=https://your-backend-service.onrender.com/api

# Local Development Proxy Target (optional, defaults to http://localhost:5000)
VITE_PROXY_TARGET=http://localhost:5000
```

> **Note:** The API client in `src/api/client.js` automatically normalizes `VITE_API_URL`. Whether you supply `https://my-backend.onrender.com` or `https://my-backend.onrender.com/api`, it correctly routes all API calls to the `/api` prefix.

---

## Deploying to Vercel

1. Push your changes to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New...** > **Project**.
3. Import your repository and configure:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `soch2startup-frontend` *(or root, both have `vercel.json`)*
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add the Environment Variable:
   - `VITE_API_URL` = `https://<your-render-backend-url>/api`
5. Click **Deploy**.
6. The included `vercel.json` automatically ensures all client-side routes (`/login`, `/register`, `/app/*`, `/privacy`, `/terms`) are redirected to `/index.html`, eliminating 404 errors on page refresh.

---

## Testing & Quality Assurance

Run the automated test suite anytime:
```bash
npm test
```
The test suite validates:
- Route uniqueness and no route collisions.
- Every sidebar navigation link opens a real page that the given role may access (Entrepreneur, Mentor, Expert, Admin, Superadmin, Moderator).
- Authentication validation logic (email regex, password complexity, safe redirects).
- Aceternity UI component library clean exports.
