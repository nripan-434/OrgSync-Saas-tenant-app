# Frontend Overview

## Structure
- `src/main.jsx`: app root, `BrowserRouter`, redux store provider.
- `src/App.jsx`: route declarations, protected routes.
- `src/store.js`: configure Redux store with slices:
  - `auth`: auth state and member actions
  - `project`: project management
  - `task`: task operations
  - `ai`: AI task generation

## HTTP Layer
- `src/api/axios.js`: baseURL `http://localhost:5000`, request interceptor adds `Authorization: Bearer token` from `sessionStorage`, error shaping.

## Key Pages
- `Landing.jsx`, `Login.jsx`, `Register.jsx`
- Admin pages (in `pages/admin`): `Addmember`, `AddProject`, `Eachproject`, `Members`, `Orgadmin`
- User pages (in `pages/user`): `Memberprj`, `MemberRegister`, `Userhome`

## Components
- `Tasklist`, `Aitasks`, `ProjectEfficiencyGraph`, `MembersCard`, `InvitationCard`, `Menu`, `Navbar`, `Footer`

## Redux workflow
- `createAsyncThunk` executes API request -> dispatches pending/fulfilled/rejected
- Use `react-hot-toast` for user messages
- State persistence via `localStorage` for projects/tasks/ai tasks in slices

## Authentication flow
1. user registers `/auth/register`, then login `/auth/login`
2. on success, sets `sessionStorage.user` and `sessionStorage.token`
3. Axios interceptor attaches token
4. admin-only actions gated by backend role check

## AI integration
- User triggers generation: dispatch `createAitask(projectId,prompt)`.
- Backend calls Hugging Face model and parses JSON output.
- UI displays generated tasks in `Aitasks.jsx`.
