# 🏍️ Store4Riders

Enterprise e-commerce platform for motorcycle riding gear & accessories.

## Tech Stack
- **Frontend:** Next.js 15 (App Router) + Tailwind + Framer Motion
- **Backend:** Next.js 15 (API Routes) + MongoDB + Redis
- **Payments:** Razorpay
- **Search:** Meilisearch
- **Storage:** AWS S3
- **Email:** AWS SES

## Quick Start
```bash
git clone <repo-url>
cd store4riders
cp .env.example .env # Fill in your keys
pnpm install
pnpm run dev # Frontend: 3000, Backend: 4000
```

## Folder Structure
```
frontend/ → Customer-facing UI (React)
backend/ → API server (DDD architecture)
packages/ → Shared types, validation, utils
e2e/ → Playwright end-to-end tests
```

## Scripts
| Command | Description |
|---|---|
| `pnpm dev` | Start all dev servers |
| `pnpm build` | Production build |
| `pnpm test` | Run all unit + integration tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm lint` | Lint all workspaces |
