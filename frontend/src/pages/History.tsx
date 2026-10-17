import { useEffect, useState } from "react";
import { getHistory } from "../api";
import type { HistoryPoint } from "../types";
import SensorCharts from "../components/SensorCharts";

export default function History() {
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="page-heading">
        <span className="eyebrow">HISTORY API</span>
        <h1>Last 24 Hours</h1>
        <p>Historical telemetry retrieved through the Express REST API.</p>
      </section>

      {loading ? (
        <div className="panel loading">Loading history...</div>
      ) : history.length > 0 ? (
        <SensorCharts data={history} />
      ) : (
        <div className="panel empty-alert">
          <div>
            <strong>No database history yet</strong>
            <p>
              Enable PostgreSQL and insert readings, then refresh this page.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
