# AgroSense — FSWD Handout Mapping

| Handout topic | AgroSense implementation |
|---|---|
| CSS3 Styling | `frontend/src/App.css` |
| Flexbox | navbar, hero, alerts, footer |
| Grid Layout | sensor grid, chart grid, CRUD layout |
| Responsive Design | media queries in App.css |
| Bootstrap | Bootstrap CSS imported in `App.tsx` |
| Variables / data types | TypeScript/JS throughout |
| Functions | React and backend functions |
| Arrow functions | React handlers and array callbacks |
| Higher-order functions | `map`, `filter`, `reduce` |
| Objects / Arrays | sensor arrays and telemetry objects |
| map/filter/reduce | sensor lists, alert filtering, averages |
| Fetch API | `frontend/src/api.ts` |
| TypeScript basics | `frontend/src/types.ts` |
| React architecture | pages/components/hooks |
| Components / JSX | `src/components`, `src/pages` |
| Props | SensorCard, charts, alerts |
| State | `useState` |
| Event handling | forms, buttons, navigation |
| useState | App/pages |
| useEffect | custom hook, history |
| useRef | Socket.io reference in `useSensorData` |
| Custom hooks | `useSensorData.ts` |
| Recharts | `SensorCharts.tsx` |
| Node.js / NPM | `backend/package.json` |
| Express | `backend/src/server.js` |
| Routing | `routes/*.js` |
| REST CRUD | `/api/sensors` |
| HTTP methods/status | GET/POST/PUT/DELETE + 2xx/4xx |
| req.body/params/query | Express routes |
| Middleware | auth, validation, CORS, error handler |
| Authentication | JWT + bcryptjs |
| WebSocket | Socket.io |
| Socket.io | `server.js` + `useSensorData.ts` |
| MQTT publish/subscribe | `mqtt.js` |
| MQTT -> WebSocket bridge | MQTT message -> `io.emit("sensor:update")` |
| PostgreSQL | `db.js` + `schema.sql` |
| TimescaleDB concepts | time-stamped `sensor_readings` table/indexes |
| Express + PostgreSQL | reading/sensor routes |
| History API | `/api/readings/history?hours=24` |
| Environment variables | `backend/.env.example` |
| Deployment | Render + Vercel configs |
| CI/CD | `.github/workflows/ci.yml` |
| AI-assisted development | this project can be iterated with Claude/Copilot |
