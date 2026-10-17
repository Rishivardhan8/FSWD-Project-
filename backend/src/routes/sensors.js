import express from "express";
import { config } from "../config.js";
import { query } from "../db.js";
import {
  addSensor,
  getSensor,
  listSensors,
  removeSensor,
  updateSensor,
} from "../store.js";
import { authMiddleware } from "../middleware/auth.js";
import { validateSensor } from "../middleware/validate.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res, next) => {
  try {
    if (config.useDatabase) {
      const result = await query(
        `SELECT id, name, type, unit, location, active
         FROM sensors
         ORDER BY id`
      );

      return res.json(result.rows);
    }

    return res.json(listSensors());
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (config.useDatabase) {
      const result = await query(
        `SELECT id, name, type, unit, location, active
         FROM sensors WHERE id = $1`,
        [id]
      );

      if (!result.rows[0]) {
        return res.status(404).json({ message: "Sensor not found." });
      }

      return res.json(result.rows[0]);
    }

    const sensor = getSensor(id);

    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found." });
    }

    return res.json(sensor);
  } catch (error) {
    next(error);
  }
});

router.post("/", validateSensor, async (req, res, next) => {
  try {
    const sensor = {
      name: req.body.name,
      type: req.body.type,
      unit: req.body.unit,
      location: req.body.location ?? "Greenhouse A",
      active: req.body.active ?? true,
    };

    if (config.useDatabase) {
      const result = await query(
        `INSERT INTO sensors(name, type, unit, location, active)
         VALUES($1, $2, $3, $4, $5)
         RETURNING id, name, type, unit, location, active`,
        [
          sensor.name,
          sensor.type,
          sensor.unit,
          sensor.location,
          sensor.active,
        ]
      );

      return res.status(201).json(result.rows[0]);
    }

    return res.status(201).json(addSensor(sensor));
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validateSensor, async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (config.useDatabase) {
      const existing = await query(
        "SELECT id FROM sensors WHERE id = $1",
        [id]
      );

      if (!existing.rows[0]) {
        return res.status(404).json({ message: "Sensor not found." });
      }

      const result = await query(
        `UPDATE sensors
         SET name = COALESCE($1, name),
             type = COALESCE($2, type),
             unit = COALESCE($3, unit),
             location = COALESCE($4, location),
             active = COALESCE($5, active)
         WHERE id = $6
         RETURNING id, name, type, unit, location, active`,
        [
          req.body.name ?? null,
          req.body.type ?? null,
          req.body.unit ?? null,
          req.body.location ?? null,
          req.body.active ?? null,
          id,
        ]
      );

      return res.json(result.rows[0]);
    }

    const updated = updateSensor(id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Sensor not found." });
    }

    return res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (config.useDatabase) {
      const result = await query(
        "DELETE FROM sensors WHERE id = $1 RETURNING id",
        [id]
      );

      if (!result.rows[0]) {
        return res.status(404).json({ message: "Sensor not found." });
      }

      return res.status(204).send();
    }

    const deleted = removeSensor(id);

    if (!deleted) {
      return res.status(404).json({ message: "Sensor not found." });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
