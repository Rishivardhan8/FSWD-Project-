const sensors = [
  {
    id: 1,
    name: "Temperature Sensor",
    type: "temperature",
    unit: "°C",
    location: "Greenhouse A",
    active: true,
  },
  {
    id: 2,
    name: "Humidity Sensor",
    type: "humidity",
    unit: "%",
    location: "Greenhouse A",
    active: true,
  },
  {
    id: 3,
    name: "Soil Moisture Sensor",
    type: "soilMoisture",
    unit: "%",
    location: "Greenhouse A",
    active: true,
  },
  {
    id: 4,
    name: "Light Sensor",
    type: "light",
    unit: "lux",
    location: "Greenhouse A",
    active: true,
  },
];

let nextSensorId = 5;

let latest = {
  temperature: 28.5,
  humidity: 65,
  soilMoisture: 48,
  light: 720,
  timestamp: new Date().toISOString(),
};

const readings = [];

export function listSensors() {
  return sensors;
}

export function getSensor(id) {
  return sensors.find((sensor) => sensor.id === id);
}

export function addSensor(sensor) {
  const created = {
    ...sensor,
    id: nextSensorId++,
  };

  sensors.push(created);
  return created;
}

export function updateSensor(id, changes) {
  const index = sensors.findIndex((sensor) => sensor.id === id);

  if (index === -1) return null;

  sensors[index] = {
    ...sensors[index],
    ...changes,
    id,
  };

  return sensors[index];
}

export function removeSensor(id) {
  const index = sensors.findIndex((sensor) => sensor.id === id);

  if (index === -1) return false;

  sensors.splice(index, 1);
  return true;
}

export function getLatest() {
  return latest;
}

export function saveReading(reading) {
  latest = {
    ...reading,
    timestamp: reading.timestamp ?? new Date().toISOString(),
  };

  readings.push(latest);

  if (readings.length > 500) {
    readings.shift();
  }

  return latest;
}

export function getHistory() {
  return readings;
}
