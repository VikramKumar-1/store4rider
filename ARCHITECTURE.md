# Architecture

## Monorepo
We use Turborepo and pnpm workspaces to manage the codebase.
The `frontend` and `backend` are distinct applications sharing code via the `packages` directory.

## Backend (DDD)
Strict Layered Pattern:
Route → Controller → Service → Repository → Model

All business logic lives in the Service layer.

## Frontend (UI Only)
The frontend solely renders the UI and relies on the backend for all business logic, calculations, and validations.
