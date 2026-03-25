# Backend API Reference

## Authentication

### POST /auth/register
- Body: `{ orgname, name, email, password }`
- Response: `201` { message }

### POST /auth/login
- Body: `{ email, password }`
- Response: `200` { message, token, currentuser }

### GET /auth/getallusers
- Auth: Bearer token (admin)
- Response: `200` list of user objects

### POST /auth/invite
- Auth: Bearer token (admin)
- Body: `{ email, role }`
- Response: `200` { message }

### POST /auth/acceptinvite
- Body: `{ token, name, password }`
- Response: `201` { message }

### GET /auth/getallmembers/:orgId
- Response: `200` { members }

### PATCH /auth/projectmember/:userId/:projectId
- Body: `{ confirm }` (optional)
- Logic: avoid duplicate project assignment, confirm reassign

### DELETE /auth/removemember/:userId/:orgId
- Delete user from org


## Projects

### POST /project/createproject
- Auth: Bearer token
- Body: `{ name, description, organizationId }`
- Response: `201` { message }

### GET /project/getallprojects
- Auth: Bearer token
- Response: `200` { prj, count }

### GET /project/getmemberprjs/:orgId/:userId
- Auth: Bearer token
- Response: `200` { prjs }

### PATCH /project/deallocatemember/:userId/:projectId
- Auth: Bearer token
- Response: `200` { message, project }

### GET /project/getallprojectmembers/:projectId
- Response: project object with members and nested projects


## Tasks

### POST /task/addnewtask
- Auth: Bearer token (admin)
- Body: `{ task: { title, description, priority }, projectId }`
- Response: `201` { message, task }

### POST /task/addaitask
- Auth: Bearer token (admin)
- Body: `{ task: {title, description, priority}, projectId }`
- Response: `200` { message, restask }

### GET /task/getalltask?projectId=...
- Auth: Bearer token (admin)
- Response: `200` { tasks }

### PUT /task/updatetask/:taskId
- Auth: Bearer token (admin)
- Body: `{ task: { title, description, priority, status } }
- Response: `200` { message, task }

### PATCH /task/taskassign/:taskId
- Auth: Bearer token (admin)
- Body: `{ memberId }`
- Response: `200` { message, task }

### DELETE /task/removetask/:taskId
- Auth: Bearer token (admin)
- Response: `200` { message, taskId }

### GET /task/getmembertasks?projectId=&userId=
- Auth: Bearer token
- Response: `200` { tasks }


## AI

### POST /ai/createAitask
- Auth: Bearer token (admin)
- Body: `{ projectId, prompt }`
- Action: reads `project.description`, sends instructions to HF chatCompletion, parses JSON
- Response: `200` { tasks, projectId }
- Errors: 404 if JSON parse fails
