import type { SensorCardProps } from "../types";

export default function SensorCard({
  title,
  value,
  unit,
  icon,
  status,
  onSelect,
}: SensorCardProps) {
  return (
    <button className="sensor-card" onClick={onSelect} type="button">
      <div className="sensor-card-top">
        <span className="sensor-icon">{icon}</span>
        <span className={`badge status-${status.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <h3>{title}</h3>

      <div className="sensor-value">
        {value}
        <small>{unit}</small>
      </div>

      <div className="sensor-card-footer">
        <span className="live-dot" />
        Live reading
      </div>
    </button>
  );
}
