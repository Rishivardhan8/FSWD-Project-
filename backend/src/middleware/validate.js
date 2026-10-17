export function validateSensor(req, res, next) {
  const { name, type, unit } = req.body;

  if (req.method !== "PUT" && !name) {
    return res.status(400).json({
      message: "Sensor name is required.",
    });
  }

  if (req.method !== "PUT" && !type) {
    return res.status(400).json({
      message: "Sensor type is required.",
    });
  }

  if (req.method !== "PUT" && !unit) {
    return res.status(400).json({
      message: "Sensor unit is required.",
    });
  }

  next();
}
