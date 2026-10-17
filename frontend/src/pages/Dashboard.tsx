import SensorCard from "../components/SensorCard";
import SensorCharts from "../components/SensorCharts";
import AlertPanel from "../components/AlertPanel";
import type { SensorData, HistoryPoint } from "../types";

interface Props {
  data: SensorData;
  history: HistoryPoint[];
  connected: boolean;
}

function statusFor(value: number, min: number, max: number): "Normal" | "Warning" | "Critical" {
  if (value < min - 5 || value > max + 5) return "Critical";
  if (value < min || value > max) return "Warning";
  return "Normal";
}

export default function Dashboard({ data, history, connected }: Props) {
  const avg =
    history.length > 0
      ? (
          history.reduce((sum, point) => sum + point.temperature, 0) /
          history.length
        ).toFixed(1)
      : "--";

  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">GREENHOUSE A • LIVE TELEMETRY</span>
          <h1>Smart Greenhouse Monitoring</h1>
          <p>
            Monitor temperature, humidity, soil moisture and light conditions
            from one full-stack dashboard.
          </p>
        </div>

        <div className={`connection ${connected ? "online" : "mock"}`}>
          <span className="live-dot" />
          {connected ? "Socket.io Connected" : "Demo / Mock Mode"}
        </div>
      </section>

      <section className="sensor-grid">
        <SensorCard
          title="Temperature"
          value={data.temperature}
          unit="°C"
          icon="🌡️"
          status={statusFor(data.temperature, 20, 32)}
        />
        <SensorCard
          title="Humidity"
          value={data.humidity}
          unit="%"
          icon="💧"
          status={statusFor(data.humidity, 40, 85)}
        />
        <SensorCard
          title="Soil Moisture"
          value={data.soilMoisture}
          unit="%"
          icon="🌱"
          status={statusFor(data.soilMoisture, 30, 80)}
        />
        <SensorCard
          title="Light Intensity"
          value={data.light}
          unit="lux"
          icon="☀️"
          status={statusFor(data.light, 200, 1200)}
        />
      </section>

      <section className="stats-row">
        <div className="mini-stat">
          <span>Average Temperature</span>
          <strong>{avg}°C</strong>
        </div>
        <div className="mini-stat">
          <span>Samples in view</span>
          <strong>{history.length}</strong>
        </div>
        <div className="mini-stat">
          <span>Last update</span>
          <strong>
            {new Date(data.timestamp).toLocaleTimeString()}
          </strong>
        </div>
      </section>

      <SensorCharts data={history} />

      <AlertPanel data={data} />
    </>
  );
}
