import http from "node:http";
import express from "express";
import cors from "cors";
import adminRoutes from "./routes/admin.js";
import { Server } from "socket.io";
import { config } from "./config.js";
import { query, testDatabase } from "./db.js";
import { saveReading, getLatest } from "./store.js";
import authRoutes from "./routes/auth.js";
import sensorRoutes from "./routes/sensors.js";
import readingRoutes from "./routes/readings.js";
import mqttRoutes from "./routes/mqtt.js";
import { setupMqtt } from "./mqtt.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.frontendUrl,
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: config.frontendUrl,
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AgroSense API",
    database: config.useDatabase ? "enabled" : "in-memory",
    mqtt: config.mqttEnabled ? "enabled" : "disabled",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/readings", readingRoutes);
app.use("/api/mqtt", mqttRoutes);
app.use("/api/admin", adminRoutes);

io.on("connection", (socket) => {
  console.log(`Socket.io client connected: ${socket.id}`);

  socket.emit("sensor:update", getLatest());

  socket.on("disconnect", () => {
    console.log(`Socket.io client disconnected: ${socket.id}`);
  });
});

async function persistReading(reading) {
  if (!config.useDatabase) {
    return saveReading(reading);
  }

  const result = await query(
    `INSERT INTO sensor_readings(
       temperature, humidity, soil_moisture, light
     )
     VALUES($1, $2, $3, $4)
     RETURNING temperature,
               humidity,
               soil_moisture AS "soilMoisture",
               light,
               recorded_at AS timestamp`,
    [
      reading.temperature,
      reading.humidity,
      reading.soilMoisture,
      reading.light,
    ]
  );

  return result.rows[0];
}

function generateMockReading(previous) {
  return {
    temperature: Number(
      Math.max(
        18,
        Math.min(38, previous.temperature + Math.random() - 0.5)
      ).toFixed(1)
    ),
    humidity: Math.round(
      Math.max(
        30,
        Math.min(90, previous.humidity + Math.random() * 2 - 1)
      )
    ),
    soilMoisture: Math.round(
      Math.max(
        20,
        Math.min(85, previous.soilMoisture + Math.random() * 2 - 1)
      )
    ),
    light: Math.round(
      Math.max(
        150,
        Math.min(1300, previous.light + Math.random() * 50 - 25)
      )
    ),
  };
}

let mockTimer;

function startMockTelemetry() {
  if (config.mqttEnabled) return;

  mockTimer = setInterval(async () => {
    try {
      const previous = getLatest();
      const reading = {
        ...generateMockReading(previous),
        timestamp: new Date().toISOString(),
      };

      const saved = await persistReading(reading);

      io.emit("sensor:update", saved);
    } catch (error) {
      console.error("Mock telemetry error:", error.message);
    }
  }, 3000);

  console.log("Mock telemetry enabled: new reading every 3 seconds.");
}

async function start() {
  try {
    if (config.useDatabase) {
      await testDatabase();
      console.log("PostgreSQL connection successful.");
    }

    setupMqtt(io, persistReading);
    startMockTelemetry();

    server.listen(config.port, () => {
      console.log(`AgroSense API running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
}

app.use(notFound);
app.use(errorHandler);

start();

process.on("SIGINT", () => {
  if (mockTimer) clearInterval(mockTimer);
  server.close(() => process.exit(0));
});
