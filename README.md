# LOGICLENS — Powered by TraceWise AI

See how beginner Java programs actually think.

## Project Overview

LogicLens is a full-stack educational platform for beginner programmers who struggle to understand what happens inside a Java program after they press run. Instead of showing only final output, LogicLens traces how variables change, why branches are taken, how loops evolve over time, and how output is built step by step.

TraceWise AI is the internal tracing layer. LogicLens is the product experience around it.

## Real-World Problem

Beginner programmers often memorize syntax without understanding execution. That leads to weak fundamentals, confusion during interview preparation, and difficulty debugging basic control-flow problems.

LogicLens addresses that gap by turning structured beginner Java programs into an interactive execution walkthrough with:

- category and subtype detection
- variable tracking and history
- branch and loop explanations
- synced code highlighting
- React Flow visualization
- output simulation
- saved traces and favorites

## Features

- JWT-based authentication with student and admin roles
- Protected dashboard, workspace, saved traces, favorites, and admin routes
- MongoDB persistence for users, saved traces, favorites, and program library
- Seedable sample program library covering 5 learning categories
- TraceWise AI analysis endpoints for detect, explain, and final summary
- Rule-based preprocessing, parsing, normalization, and simulation for beginner Java code
- Interactive React Flow graph with custom nodes, active glow, visited state, and branch labels
- Step timeline, autoplay, reset, and node details drawer
- Learning Mode vs Demo Mode toggle
- Admin program management and simple usage overview
- Responsive layouts for desktop, tablet, and mobile
- Automated backend tests for auth validation and execution engine behavior

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Flow
- Backend: Node.js, Express.js
- Database: MongoDB Atlas with Mongoose
- Auth: JWT + bcryptjs
- Deployment targets: Vercel for client, Render for server

## Architecture

```text
logiclens-ai-powered-code-execution-visualizer/
  client/   React + Vite frontend
  server/   Express API + MongoDB models + tracing engine
```

Core engine modules live in `server/engines/` and expose:

- `detectCategory.js`
- `detectSubtype.js`
- `extractStatements.js`
- `normalizeProgram.js`
- `simulationEngine.js`
- `explainStep.js`
- `explainFinalOutput.js`
- `buildFlowNodes.js`
- `buildFlowEdges.js`
- `layoutGraph.js`

## Setup

1. Install dependencies from the repo root:

```bash
npm install --workspaces
```

2. Copy environment variables:

```bash
cp .env.example .env
cp client/.env.example client/.env
cp server/.env.example server/.env
```

3. Fill in your MongoDB Atlas connection string and JWT secret.

4. Seed the sample library and default admin:

```bash
npm run seed
```

5. Start the backend:

```bash
npm run dev:server
```

6. Start the frontend:

```bash
npm run dev:client
```

7. Run the backend test suite:

```bash
npm run test
```

## Environment Variables

Root / server:

- `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `PORT`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Client:

- `VITE_API_URL`

## API Overview

Auth:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

Tracing:

- `POST /api/detect`
- `POST /api/explain`
- `POST /api/final-summary`

User traces:

- `POST /api/traces`
- `GET /api/traces`
- `GET /api/traces/:id`
- `DELETE /api/traces/:id`

Favorites:

- `POST /api/favorites`
- `GET /api/favorites`
- `DELETE /api/favorites/:id`

Admin:

- `GET /api/admin/programs`
- `POST /api/admin/programs`
- `PUT /api/admin/programs/:id`
- `DELETE /api/admin/programs/:id`

## Deployment

### Frontend on Vercel

Deploy the `client/` folder as the Vercel project root.

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing config: `client/vercel.json`
- Required environment variable:
  - `VITE_API_URL=https://your-render-api.onrender.com`

### Backend on Render

- Deploy the repo with the included `render.yaml`, or create a Render web service manually using the same settings.
- Blueprint file: `render.yaml`
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm run start`
- Health check path: `/api/health`
- Environment variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `FRONTEND_URL`
  - `ADMIN_NAME`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`

## Demo Credentials

After seeding, the default admin account is created from environment variables:

- email: `ADMIN_EMAIL`
- password: `ADMIN_PASSWORD`

Student accounts are created through the signup page.

## Notes

- The tracer is intentionally scoped to beginner-friendly structured Java programs.
- Unsupported constructs return a support-level response instead of pretending to fully simulate advanced Java.
- The most polished demo flows are Even/Odd, Greatest of 3 Numbers, Factorial, Sum of n Natural Numbers, Multiplication Table, Prime Number, Palindrome Number, Fibonacci Series, Right Triangle Star Pattern, and Pyramid.
- When MongoDB is unavailable locally, LogicLens falls back to demo mode so auth and tracing still work for hackathon demos.
