# InfraTrack — Infrastructure Asset Inventory

InfraTrack is a production-style internal asset management application that provides a centralized, auditable record of infrastructure from planning through disposal. It combines lifecycle controls, assignments, maintenance, warranty monitoring, role-based governance, reporting, and a responsive enterprise UI.

## Features

- Governed lifecycle: Planned → Ordered → Received → Deployed ⇄ In Maintenance → Retired → Disposed
- Indexed server-side search, filters, sorting, and pagination
- Full asset profiles, assignment/location controls, maintenance, and audit history
- JWT authentication with bcrypt password hashing and Admin / Asset Manager / Viewer authorization
- Operational dashboard with KPIs, Recharts visualizations, warranty alerts, and activity
- User, location, and vendor administration with referential deletion safeguards
- Reports with portfolio breakdowns, maintenance costs, and CSV inventory export
- Loading, error, empty, toast, confirmation, and responsive states

## Stack and architecture

The client uses React 19, Vite, React Router, Axios, Lucide, Recharts, and a custom Tailwind-inspired utility/design-token stylesheet. The API uses Node.js, Express, MongoDB/Mongoose, JWT, bcrypt, Helmet, CORS, and input sanitization.

The server follows `routes → controllers → services → models`. Lifecycle rules and history creation live in services, authentication/authorization in middleware, and transport concerns in controllers. MongoDB relationships use references for ownership, assignees, vendors, locations, maintenance, and history.

```text
.
├── client/
│   └── src/{api,components,context,pages}
└── server/
    ├── config/ controllers/ middleware/ models/
    ├── routes/ services/ utils/ seed/
    ├── app.js
    └── server.js
```

## Database models

- `User`: identity, password hash, role, department
- `Asset`: commercial, technical, ownership, lifecycle, and warranty record
- `AssetHistory`: immutable asset events with actor and status context
- `Maintenance`: service schedule, technician, cost, and completion
- `Location` and `Vendor`: normalized operational reference data
- `Counter`: atomic human-readable asset number allocation

## Setup

Prerequisites: Node.js 20+ and MongoDB 7+ (local or Atlas).

```bash
cp server/.env.example server/.env
npm run install:all
npm run seed
```

Update `server/.env` with a long random `JWT_SECRET` and your `MONGO_URI`. Then run both applications from the repository root:

```bash
npm install
npm run dev
```

Or run them independently:

```bash
cd server && npm run dev
cd client && npm run dev
```

Client: `http://localhost:5173` · API: `http://localhost:5000/api`

### Seed accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@infratrack.local | Admin@123 |
| Asset Manager | maya@infratrack.local | Manager@123 |
| Viewer | rhea@infratrack.local | Viewer@123 |

The seed safely resets only the application collections and creates 6 users, 24 assets, 4 locations, 4 vendors, maintenance schedules, and asset history.

## API

All routes except registration, login, and health require `Authorization: Bearer <token>`.

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Assets | `GET/POST /assets`, `GET/PATCH/DELETE /assets/:id` |
| Lifecycle | `PATCH /assets/:id/status`, `/assign`, `/location` |
| History | `GET /assets/:id/history`, `GET /audit` (Admin) |
| Maintenance | `GET/POST /maintenance`, `GET/PATCH/DELETE /maintenance/:id` |
| Reference data | CRUD under `/locations` and `/vendors` |
| Users | `GET /users`, `GET/PATCH/DELETE /users/:id` (mutations Admin) |
| Dashboard | `GET /dashboard/stats` |

Asset query parameters include `search`, `category`, `status`, `condition`, `criticality`, `department`, `location`, `assignedTo`, `warranty`, `sort`, `page`, and `limit`.

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@infratrack.local","password":"Admin@123"}'

curl "http://localhost:5000/api/assets?status=Deployed&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Security notes

Password fields are excluded by default and removed during JSON serialization. Public registration always creates a Viewer. Mutation routes enforce roles on the server, lifecycle transitions are allow-listed, secrets are environment-only, and production errors omit stack traces. Set `CLIENT_URL` to the exact deployed frontend origin and use TLS in production.
