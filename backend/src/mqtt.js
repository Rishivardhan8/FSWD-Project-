import mqtt from "mqtt";
import { config } from "./config.js";
import { setMqttPublisher } from "./routes/mqtt.js";

let client = null;

export function setupMqtt(io, saveReading) {
  if (!config.mqttEnabled) {
    console.log("MQTT disabled. Set MQTT_ENABLED=true to enable it.");
    return;
  }

  client = mqtt.connect(config.mqttUrl);

  client.on("connect", () => {
    console.log(`MQTT connected: ${config.mqttUrl}`);

    client.subscribe(config.mqttTopic, (error) => {
      if (error) {
        console.error("MQTT subscription failed:", error.message);
      } else {
        console.log(`Subscribed to ${config.mqttTopic}`);
      }
    });
  });

  client.on("message", async (topic, message) => {
    if (topic !== config.mqttTopic) return;

    try {
      const parsed = JSON.parse(message.toString());

      const reading = {
        temperature: Number(parsed.temperature),
        humidity: Number(parsed.humidity),
        soilMoisture: Number(
          parsed.soilMoisture ?? parsed.soil_moisture
        ),
        light: Number(parsed.light),
        timestamp: parsed.timestamp ?? new Date().toISOString(),
      };

      if (
        !Number.isFinite(reading.temperature) ||
        !Number.isFinite(reading.humidity) ||
        !Number.isFinite(reading.soilMoisture) ||
        !Number.isFinite(reading.light)
      ) {
        console.warn("Ignored invalid MQTT payload.");
        return;
      }

      const saved = await saveReading(reading);

      io.emit("sensor:update", saved);

      console.log("MQTT -> Socket.io:", saved);
    } catch (error) {
      console.error("MQTT message error:", error.message);
    }
  });

  client.on("error", (error) => {
    console.error("MQTT error:", error.message);
  });

  setMqttPublisher(async (payload) => {
    client.publish(
      config.mqttTopic,
      JSON.stringify(payload),
      { qos: 0 },
      (error) => {
        if (error) throw error;
      }
    );
  });
}
