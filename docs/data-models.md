# Database Models (Mongoose)

## `users` collection
Fields:
- `name` (string, required)
- `email` (string, required, unique, lowercase)
- `password` (string, required, min 6, select false)
- `role` (enum: user|admin, default `user`)
- `projects` (ObjectId[] -> `projects`)
- `organizationId` (ObjectId -> `Organization`, required)
- timestamps

## `organizations` collection
Fields:
- `name` (string, required)
- `plan` (enum: free|pro, default `free`)
- `aiCreditsLimit` (number, default 1000)
- `aiCreditsUsed` (number, default 0)
- timestamps

## `projects` collection
Fields:
- `name` (string, required)
- `description` (string, required)
- `organizationId` (ObjectId -> `Organization`, required)
- `createdBy` (ObjectId -> `users`, required)
- `members` (ObjectId[] -> `users`)
- `aiSummary` (string|null)
- `aiPlanGenerated` (boolean default false)
- `aiGeneratedAt` (Date)
- timestamps

## `tasks` collection
Fields:
- `title` (string, required)
- `description` (string, required)
- `projectId` (ObjectId -> `projects`, required)
- `createdBy` (ObjectId -> `users`, required)
- `taskremoved` (boolean default false)
- `assignedTo` (ObjectId -> `users`)
- `status` (enum: todo|in-progress|done, default todo)
- `priority` (enum: low|medium|high, default medium)
- `dueDate` (Date)
- timestamps

## `Invitations` collection
Fields:
- `email` (string, required)
- `organizationId` (ObjectId -> organizations, required)
- `role` (string, required)
- `token` (string, required, unique)
- `expiration` (Date, required)
- timestamps
