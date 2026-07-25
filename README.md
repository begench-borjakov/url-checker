# URL Checker

Fullstack application for checking multiple URLs in background jobs.

Users can create a job, track its progress, view individual URL results, and cancel active processing.

## Stack

### Backend

- NestJS
- TypeScript
- In-memory storage
- Node.js `fetch`
- class-validator

### Frontend

- React
- TypeScript
- Vite
- Zustand
- Plain CSS

## Run locally

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend API:

```text
http://localhost:3000/api
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

The frontend uses `http://localhost:3000/api` by default. It can be changed with `VITE_API_URL`.

## Run with Docker

```bash
docker compose up -d --build
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3000/api
```

Stop containers:

```bash
docker compose down
```

## API

```text
POST   /api/jobs
GET    /api/jobs
GET    /api/jobs/:id
DELETE /api/jobs/:id
```

### Create a job

```text
POST /api/jobs
```

Request:

```json
{
  "urls": [
    "https://example.com",
    "https://github.com"
  ]
}
```

Response:

```json
{
  "jobId": "uuid"
}
```

## Processing rules

- URL checks run in the background.
- Each URL is checked with an HTTP HEAD request.
- Maximum concurrency is 5 URLs per job.
- Different jobs can run in parallel.
- Request timeout is 10 seconds.
- A random delay from 0 to 10 seconds is applied before saving each result.
- HTTP responses, including 4xx and 5xx, are stored as successful checks with their status code.
- Network, DNS and timeout errors are stored as failed URL checks.
- Cancelling a job stops pending checks. Already running checks are allowed to finish.

## Storage

Jobs are stored in memory and are removed when the backend restarts.
