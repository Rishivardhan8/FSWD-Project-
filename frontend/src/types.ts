export interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  light: number;
  timestamp: string;
}

export interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon: string;
  status: "Normal" | "Warning" | "Critical";
  onSelect?: () => void;
}

export interface HistoryPoint {
  time: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
}

export interface Sensor {
  id: number;
  name: string;
  type: string;
  unit: string;
  location: string;
  active: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AlertItem {
  id: number;
  type: string;
  message: string;
  severity: "info" | "warning" | "critical";
  createdAt: string;
}
