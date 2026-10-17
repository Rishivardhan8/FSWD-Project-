import express from "express";
import { config } from "../config.js";
import { query } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";
import { getHistory, getLatest } from "../store.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/latest", async (req, res, next) => {
  try {
    if (config.useDatabase) {
      const result = await query(
        `SELECT temperature, humidity, soil_moisture AS "soilMoisture",
                light, recorded_at AS timestamp
         FROM sensor_readings
         ORDER BY recorded_at DESC
         LIMIT 1`
      );

      if (!result.rows[0]) {
        return res.json(getLatest());
      }

      return res.json(result.rows[0]);
    }

    return res.json(getLatest());
  } catch (error) {
    next(error);
  }
});

router.get("/history", async (req, res, next) => {
  try {
    const hours = Math.min(
      Math.max(Number(req.query.hours ?? 24), 1),
      168
    );

    if (config.useDatabase) {
      const result = await query(
        `SELECT
           to_char(recorded_at AT TIME ZONE 'UTC', 'HH24:MI') AS time,
           ROUND(AVG(temperature), 2) AS temperature,
           ROUND(AVG(humidity), 2) AS humidity,
           ROUND(AVG(soil_moisture), 2) AS "soilMoisture"
         FROM sensor_readings
         WHERE recorded_at >= NOW() - ($1 * INTERVAL '1 hour')
         GROUP BY time
         ORDER BY MIN(recorded_at)`,
        [hours]
      );

      return res.json(result.rows);
    }

    const cutoff = Date.now() - hours * 60 * 60 * 1000;

    const history = getHistory()
      .filter((reading) => new Date(reading.timestamp).getTime() >= cutoff)
      .map((reading) => ({
        time: new Date(reading.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temperature: reading.temperature,
        humidity: reading.humidity,
        soilMoisture: reading.soilMoisture,
      }));

    return res.json(history);
  } catch (error) {
    next(error);
  }
});

export default router;
