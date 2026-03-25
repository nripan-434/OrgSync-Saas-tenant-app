# Architecture Overview

## Stack
- Backend: Node.js (ESM), Express 5, MongoDB (Mongoose), JWT Auth
- Frontend: React + Vite, Redux Toolkit, Axios, react-hot-toast
- AI engine: Hugging Face inference (Qwen/Qwen2.5-7B-Instruct)

## High-Level Flow
1. User interacts with frontend UI (register/login/project/task management).
2. Frontend dispatches Redux thunks in slices (`AuthSlice`, `ProjectSlice`, `TaskSlice`, `AiSlice`).
3. Axios middleware sends bearer token to backend.
4. Backend middleware (`authmiddleware`) validates JWT and attaches `req.user`.
5. Controller actions interact with MongoDB models (users, projects, tasks, invitations, orgs).
6. AI routes call Hugging Face API and persist task information in state only.

## Routing
- `/auth`: register, login, invite, accept invite, get members, assign/remove members
- `/project`: create project, list projects, member project list, deallocate member, list members
- `/task`: create, update, delete, assign tasks, fetch tasks
- `/ai`: generate AI tasks for a project

## Authorization
- `authmiddleware` required for all protected routes.
- `adminonly` required for admin-only operations (project/task management, invitations, user list).

## Data ownership
- `organizationId` ties users/projects/tasks to one tenant.
- Admin users can operate inside their own organization.
