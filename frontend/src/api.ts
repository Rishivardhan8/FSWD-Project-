import type { Sensor, SensorData, User, HistoryPoint } from "./types";

export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

function getToken(): string | null {
  return localStorage.getItem("agrosense_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message ?? `Request failed: ${response.status}`);
  }

  return body;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe(): Promise<User> {
  return request("/auth/me");
}

export async function getLatest(): Promise<SensorData> {
  return request("/readings/latest");
}

export async function getHistory(): Promise<HistoryPoint[]> {
  return request("/readings/history?hours=24");
}

export async function getSensors(): Promise<Sensor[]> {
  return request("/sensors");
}

export async function createSensor(
  sensor: Omit<Sensor, "id">
): Promise<Sensor> {
  return request("/sensors", {
    method: "POST",
    body: JSON.stringify(sensor),
  });
}

export async function updateSensor(
  id: number,
  sensor: Partial<Sensor>
): Promise<Sensor> {
  return request(`/sensors/${id}`, {
    method: "PUT",
    body: JSON.stringify(sensor),
  });
}

export async function deleteSensor(id: number): Promise<void> {
  await request(`/sensors/${id}`, { method: "DELETE" });
}

export async function publishMqtt(payload: SensorData): Promise<void> {
  await request("/mqtt/publish", {
    method: "POST",
    body: JSON.stringify({
      payload,
    }),
  });
}
