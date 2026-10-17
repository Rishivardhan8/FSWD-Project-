import { useEffect, useState } from "react";
import {
  createSensor,
  deleteSensor,
  getSensors,
  updateSensor,
} from "../api";
import type { Sensor } from "../types";

const blankSensor: Omit<Sensor, "id"> = {
  name: "",
  type: "temperature",
  unit: "°C",
  location: "Greenhouse A",
  active: true,
};

export default function Sensors() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [form, setForm] = useState(blankSensor);
  const [message, setMessage] = useState("");

  const load = () => {
    getSensors().then(setSensors).catch((error) => setMessage(error.message));
  };

  useEffect(load, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage("Sensor name is required.");
      return;
    }

    try {
      await createSensor(form);
      setForm(blankSensor);
      setMessage("Sensor created.");
      load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create sensor.");
    }
  };

  const toggle = async (sensor: Sensor) => {
    await updateSensor(sensor.id, { active: !sensor.active });
    load();
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete this sensor?")) return;
    await deleteSensor(id);
    load();
  };

  return (
    <>
      <section className="page-heading">
        <span className="eyebrow">REST CRUD</span>
        <h1>Sensor Management</h1>
        <p>GET, POST, PUT and DELETE sensor resources through Express.</p>
      </section>

      <div className="crud-layout">
        <form className="panel form-panel" onSubmit={submit}>
          <h3>Add Sensor</h3>

          <label>
            Name
            <input
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              placeholder="e.g. CO₂ Sensor"
            />
          </label>

          <label>
            Type
            <select
              value={form.type}
              onChange={(event) =>
                setForm({ ...form, type: event.target.value })
              }
            >
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="soilMoisture">Soil Moisture</option>
              <option value="light">Light</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          <label>
            Unit
            <input
              value={form.unit}
              onChange={(event) =>
                setForm({ ...form, unit: event.target.value })
              }
            />
          </label>

          <label>
            Location
            <input
              value={form.location}
              onChange={(event) =>
                setForm({ ...form, location: event.target.value })
              }
            />
          </label>

          <button className="primary-btn" type="submit">
            Add Sensor
          </button>

          {message && <p className="form-message">{message}</p>}
        </form>

        <div className="panel">
          <h3>Registered Sensors</h3>

          <div className="sensor-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sensors.map((sensor) => (
                  <tr key={sensor.id}>
                    <td>{sensor.name}</td>
                    <td>{sensor.type}</td>
                    <td>{sensor.location}</td>
                    <td>
                      <button
                        className="table-status"
                        type="button"
                        onClick={() => toggle(sensor)}
                      >
                        {sensor.active ? "Online" : "Offline"}
                      </button>
                    </td>
                    <td>
                      <button
                        className="danger-btn"
                        type="button"
                        onClick={() => remove(sensor.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
