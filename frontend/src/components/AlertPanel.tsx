import type { SensorData } from "../types";

interface Props {
  data: SensorData;
}

export default function AlertPanel({ data }: Props) {
  const alerts = [
    data.temperature > 32
      ? { level: "critical", message: "Temperature is above the safe range." }
      : null,
    data.humidity < 40
      ? { level: "warning", message: "Humidity is below the recommended range." }
      : null,
    data.soilMoisture < 30
      ? { level: "warning", message: "Soil moisture is low. Irrigation may be required." }
      : null,
    data.light > 1200
      ? { level: "info", message: "High light intensity detected." }
      : null,
  ].filter(Boolean) as { level: string; message: string }[];

  return (
    <div className="panel">
      <div className="panel-title-row">
        <div>
          <h3>Recent Alerts</h3>
          <p>Automatically evaluated from current telemetry</p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="empty-alert">
          <span>✓</span>
          <div>
            <strong>All systems normal</strong>
            <p>No critical environmental conditions detected.</p>
          </div>
        </div>
      ) : (
        <div className="alert-list">
          {alerts.map((alert) => (
            <div className={`alert-item ${alert.level}`} key={alert.message}>
              <strong>{alert.level.toUpperCase()}</strong>
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
