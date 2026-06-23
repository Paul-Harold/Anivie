# CLAUDE.md
//anivie
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AniVie** — a fullstack anime and movie watchlist app. Users discover content, add it to a personal list, and track watch status, ratings, and diary notes per item.

Deployed at:
- Frontend: `https://anivie.vercel.app`
- Backend: `https://anivie-backend.vercel.app`

## Commands

### Client (from `client/`)
```bash
npm run dev      # start Vite dev server on http://localhost:5173
npm run build    # production build
npm run lint     # ESLint
npm run preview  # preview production build
```

### Server (from `server/`)
```bash
npm run dev   # nodemon server.js (auto-restart on changes)
```

There are no tests. Both packages require their own `npm install`.

## Architecture

The repo is a monorepo with two independent packages: `client/` and `server/`. They are not linked by a root `package.json` — run commands from inside each directory.

### Backend (`server/`)

Express v5 (CommonJS) connected to MongoDB Atlas via Mongoose. Entry point is `server.js`.

**Routes:**
- `POST /api/auth/register` — creates user, sends verification email, blocks login until email is clicked
- `GET  /api/auth/verify/:token` — marks user as verified, redirects to frontend
- `POST /api/auth/login` — returns JWT (7-day expiry) + user object
- `GET/POST/PUT/DELETE /api/watchlist` — CRUD for watchlist items; all routes protected by `middleware/auth.js`

**Auth middleware** (`middleware/auth.js`): reads `Authorization: Bearer <token>` header, verifies JWT, attaches decoded payload to `req.user`.

**Email verification** (`utils/sendEmail.js`): uses Nodemailer with a Gmail app password. Configured via `EMAIL_USER` and `EMAIL_PASS` env vars.

**WatchlistItem schema** is defined inline in `routes/watchlist.js` (not a separate model file). Fields: `userId`, `apiId`, `title`, `posterUrl`, `mediaType`, `watchStatus`, `userRating`, `personalNotes`.

**User model** (`models/User.js`): `email`, `username`, `password` (bcrypt), `isVerified`, `verificationToken`.

### Frontend (`client/`)

React 19 + Vite, styled with Tailwind CSS. State management is props + React Context only.

**AuthContext** (`src/context/AuthContext.jsx`): wraps the entire app. Stores `user` and `loading` in state; persists `token` and `user` to `localStorage`. An **axios request interceptor** is registered globally here — it attaches `Authorization: Bearer <token>` to all backend calls and strips it for calls to `jikan.moe` or `themoviedb.org`.

**External data sources:**
- **Jikan API** (`https://api.jikan.moe/v4`) — anime data, no API key needed
- **TMDB API** (`https://api.themoviedb.org/3`) — movie data, requires `VITE_TMDB_API_KEY` in `client/.env`

**ID convention:** Anime items use the MAL integer ID from Jikan. Movie items use the string `tmdb-{id}` as `apiId` to avoid collisions. `ItemDetails.jsx` strips the `tmdb-` prefix before calling TMDB.

**Pages and their purpose:**
- `/` — `Dashboard.jsx`: anime discovery (trending, popular, top 100 via Jikan)
- `/movies` — `MovieDashboard.jsx`: movie discovery via TMDB
- `/category/:type` — `CategoryPage.jsx`: paginated anime category listing
- `/movies/category/:type` — `MovieCategoryPage.jsx`: paginated movie category listing
- `/details/:type/:id` — `ItemDetails.jsx`: detail view with trailer, synopsis, and personal diary (status/rating/notes)
- `/mylist` — `MyWatchlist.jsx`: the logged-in user's saved list
- `/auth` — `AuthPage.jsx`: login / register form

**Tailwind custom colors** (defined in `tailwind.config.js`):
```
ani-dark    #0b1622   (page background)
ani-card    #151f2e   (card/panel background)
ani-blue    #3db4f2   (primary accent)
ani-text    #edf1f5   (primary text)
ani-subtext #9fadbd   (secondary text)
ani-red     #e2626b   (danger/error)
```

### Environment Variables

**`server/.env`** (required):
```
PORT=5000
MONGO_URI=<MongoDB Atlas connection string>
JWT_SECRET=<secret>
EMAIL_USER=<gmail address>
EMAIL_PASS=<gmail app password>
```

**`client/.env`** (required):
```
VITE_TMDB_API_KEY=<TMDB API key>
```

The backend `vercel.json` routes all requests through `server.js` for serverless deployment. The CORS allowlist in `server.js` must include the frontend origin.
