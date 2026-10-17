CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sensors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    location VARCHAR(100) DEFAULT 'Greenhouse A',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    sensor_id INTEGER REFERENCES sensors(id) ON DELETE SET NULL,
    temperature NUMERIC(6,2),
    humidity NUMERIC(6,2),
    soil_moisture NUMERIC(6,2),
    light NUMERIC(10,2),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_recorded_at
ON sensor_readings(recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_sensor_id
ON sensor_readings(sensor_id);

INSERT INTO sensors (name, type, unit)
SELECT 'Temperature Sensor', 'temperature', '°C'
WHERE NOT EXISTS (SELECT 1 FROM sensors WHERE type = 'temperature');

INSERT INTO sensors (name, type, unit)
SELECT 'Humidity Sensor', 'humidity', '%'
WHERE NOT EXISTS (SELECT 1 FROM sensors WHERE type = 'humidity');

INSERT INTO sensors (name, type, unit)
SELECT 'Soil Moisture Sensor', 'soilMoisture', '%'
WHERE NOT EXISTS (SELECT 1 FROM sensors WHERE type = 'soilMoisture');

INSERT INTO sensors (name, type, unit)
SELECT 'Light Sensor', 'light', 'lux'
WHERE NOT EXISTS (SELECT 1 FROM sensors WHERE type = 'light');
