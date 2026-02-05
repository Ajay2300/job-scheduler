Job Scheduler & Automation System
1. Project Overview

This project is a mini job scheduling and automation system that allows users to:

Create background jobs (tasks)

Store jobs in a database

Run jobs manually

Track job status (Pending → Running → Completed)

Trigger a webhook automatically when a job completes

Real-world use cases: Sending emails, generating reports, syncing data between systems, running automated background tasks.

2. Tech Stack
Layer	Technology
Frontend	Next.js, React, Tailwind CSS
Backend	Node.js, Express
Database	MySQL
Optional	TypeScript, Prisma/Sequelize
Deployment	Vercel (frontend), local/Render (backend)
3. AI Tools Used
Tool	Model / Version	Prompts / Usage	Part of Project Helped
ChatGPT	GPT-4.1	Prompts for frontend code, backend API, React state management, debugging	UI design, backend logic, debugging, README writing
GitHub Copilot	N/A	Auto-completed repetitive code snippets	Backend & frontend boilerplate
Optional	N/A	N/A	N/A

Notes: AI helped in generating code faster, debugging errors, and writing documentation. Logic and architecture were manually reviewed and customized.

4. Setup Instructions
Backend
cd backend
npm install
npm run dev


Backend runs on http://localhost:5000

Frontend
cd frontend
npm install
npm run dev


Frontend runs on http://localhost:3000

Database

MySQL (or SQLite)

Create table jobs:

CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  taskName VARCHAR(255) NOT NULL,
  payload JSON,
  priority VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

5. ER Diagram / Schema Design

Table: jobs

id → Primary Key

taskName → string

payload → JSON

priority → Low / Medium / High

status → pending / running / completed

createdAt, updatedAt → timestamps

(Optional: Attach an image of the ER diagram here if you have one)

6. Architecture Explanation

Frontend (Next.js)

Pages: /, /jobs

Components: JobList, AddJobForm

Fetches data from backend APIs

Filters jobs by status & priority

Shows job details and allows running jobs

Backend (Node.js + Express)

REST APIs: /jobs, /jobs/:id, /run-job/:id

Handles job creation, listing, updating status, and simulating background tasks

Triggers webhook on job completion

Database (MySQL)

Stores job data with JSON payload

Tracks status and timestamps

Webhook

Triggered when a job is completed

Sends POST request to WEBHOOK_URL with job data

7. API Documentation
Endpoint	Method	Description
/jobs	POST	Create a new job. Body: { taskName, payload, priority }
/jobs	GET	Get all jobs. Optional query: ?status=&priority=
/jobs/:id	GET	Get job details by ID
/run-job/:id	POST	Run a pending job (simulates execution)
/webhook-test	POST	Optional local endpoint to test webhook

Example payload for POST /jobs:

{
  "taskName": "Send Test Email",
  "payload": { "email": "example@test.com" },
  "priority": "High"
}

8. How Webhook Works

When a job status changes to completed, backend triggers a POST request to WEBHOOK_URL.

Payload sent:

{
  "jobId": 1,
  "taskName": "Send Test Email",
  "priority": "High",
  "payload": { "email": "example@test.com" },
  "completedAt": "2026-02-05T15:00:00Z"
}


Webhook receiver (e.g., webhook.site) logs this request for verification.