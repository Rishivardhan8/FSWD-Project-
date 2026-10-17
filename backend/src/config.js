import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 5000),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET ?? "development-only-secret",
  useDatabase: process.env.USE_DATABASE === "true",
  databaseUrl: process.env.DATABASE_URL,
  mqttEnabled: process.env.MQTT_ENABLED === "true",
  mqttUrl: process.env.MQTT_URL ?? "mqtt://broker.hivemq.com:1883",
  mqttTopic:
    process.env.MQTT_TOPIC ?? "agrosense/greenhouse/telemetry",
};
