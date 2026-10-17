import AlertPanel from "../components/AlertPanel";
import type { SensorData } from "../types";

interface Props {
  data: SensorData;
}

export default function Alerts({ data }: Props) {
  return (
    <>
      <section className="page-heading">
        <span className="eyebrow">RULE ENGINE</span>
        <h1>Environmental Alerts</h1>
        <p>
          Simple threshold-based alert evaluation for the greenhouse.
        </p>
      </section>

      <AlertPanel data={data} />

      <div className="panel explanation">
        <h3>How alerts work</h3>
        <p>
          The frontend evaluates the latest sensor object and assigns Normal,
          Warning or Critical states. In a production version, these rules can
          be moved to the backend so every client receives the same alert event.
        </p>
      </div>
    </>
  );
}
