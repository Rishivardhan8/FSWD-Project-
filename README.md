# AgroSense — Smart Greenhouse Telemetry Dashboard

A syllabus-oriented full-stack web development project.

## Architecture

Browser (React + TypeScript)
        |
        | REST / Socket.io
        v
Node.js + Express
   |             |
   |             +--> Socket.io real-time events
   |
   +--> MQTT broker (optional)
   |
   +--> PostgreSQL / TimescaleDB-compatible schema (optional)

The application has a MOCK mode so it can run immediately without a physical sensor,
MQTT broker, or PostgreSQL. When those are configured, the same frontend can consume
real backend data.

## Syllabus coverage

- HTML5 semantic structure
- CSS3, Flexbox, Grid, responsive design
- Bootstrap
- JavaScript arrays, objects, map/filter/reduce
- Fetch API
- TypeScript interfaces/types
- React components, JSX, props, state, events
- useState, useEffect, useRef
- Custom hook: useSensorData
- Recharts
- Node.js + NPM
- Express routing and REST CRUD
- Middleware, CORS, JWT authentication, error handling
- WebSocket concepts through Socket.io
- MQTT publish/subscribe and MQTT -> Socket.io bridge
- PostgreSQL integration with parameterized queries
- History API and 24-hour view
- Environment variables
- GitHub Actions CI
- Deployment-ready frontend/backend structure

## 1. Frontend

Open a terminal in `frontend`:

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173

## 2. Backend

Open another terminal in `backend`:

```bash
npm install
copy .env.example .env
npm run dev
```

Backend: http://localhost:5000

The frontend defaults to `http://localhost:5000/api`.

## 3. PostgreSQL

Create a database, then run `database/schema.sql`.

Set these in `backend/.env`:

```env
USE_DATABASE=true
DATABASE_URL=postgresql://postgres:password@localhost:5432/agrosense
```

If `USE_DATABASE=false`, the backend uses an in-memory sensor store.

## 4. MQTT

MQTT is optional for the first demo.

Configure:

```env
MQTT_ENABLED=true
MQTT_URL=mqtt://broker.hivemq.com:1883
MQTT_TOPIC=agrosense/greenhouse/telemetry
```

A message can be JSON such as:

```json
{
  "temperature": 28.5,
  "humidity": 65,
  "soilMoisture": 48,
  "light": 720
}
```

The backend subscribes to the topic, stores the reading when the database is enabled,
and broadcasts it to React using Socket.io.

To publish a test reading through the backend, use the authenticated endpoint:

`POST /api/mqtt/publish`

with:

```json
{
  "topic": "agrosense/greenhouse/telemetry",
  "payload": {
    "temperature": 29.1,
    "humidity": 67,
    "soilMoisture": 46,
    "light": 760
  }
}
```

## Demo login

The first user can register from the Register page. For a classroom demo, you can
register any local account. Passwords are hashed with bcryptjs and sessions use JWT.

## Important

This is a teaching/demo project, not a production greenhouse control system.
Before deployment, use strong secrets, TLS, a managed PostgreSQL database, secure MQTT
credentials, input validation, rate limiting, and proper production authentication.
