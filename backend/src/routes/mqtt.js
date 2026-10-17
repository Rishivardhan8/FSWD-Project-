import express from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

let publisher = null;

export function setMqttPublisher(fn) {
  publisher = fn;
}

router.post("/publish", async (req, res, next) => {
  try {
    if (!publisher) {
      return res.status(503).json({
        message: "MQTT publishing is disabled.",
      });
    }

    const payload = req.body.payload ?? req.body;

    await publisher(payload);

    res.status(202).json({
      message: "MQTT message published.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
