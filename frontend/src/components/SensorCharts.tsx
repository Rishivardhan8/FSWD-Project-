import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HistoryPoint } from "../types";

interface Props {
  data: HistoryPoint[];
}

function ChartCard({
  title,
  data,
  dataKey,
  unit,
}: {
  title: string;
  data: HistoryPoint[];
  dataKey: "temperature" | "humidity" | "soilMoisture";
  unit: string;
}) {
  return (
    <div className="panel chart-card">
      <div className="panel-title-row">
        <div>
          <h3>{title}</h3>
          <p>Last live readings</p>
        </div>
        <span className="chart-unit">{unit}</span>
      </div>

      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              name={title}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function SensorCharts({ data }: Props) {
  return (
    <section className="charts-grid">
      <ChartCard
        title="Temperature"
        data={data}
        dataKey="temperature"
        unit="°C"
      />
      <ChartCard
        title="Humidity"
        data={data}
        dataKey="humidity"
        unit="%"
      />
      <ChartCard
        title="Soil Moisture"
        data={data}
        dataKey="soilMoisture"
        unit="%"
      />
    </section>
  );
}
