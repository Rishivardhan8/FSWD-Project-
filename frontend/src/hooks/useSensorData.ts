import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { API_URL, getLatest } from "../api";
import type { HistoryPoint, SensorData } from "../types";

const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

const initialData: SensorData = {
  temperature: 28.5,
  humidity: 65,
  soilMoisture: 48,
  light: 720,
  timestamp: new Date().toISOString(),
};

function mockReading(previous: SensorData): SensorData {
  return {
    temperature: Number(
      Math.max(15, Math.min(40, previous.temperature + (Math.random() - 0.5)))
        .toFixed(1)
    ),
    humidity: Math.round(
      Math.max(20, Math.min(95, previous.humidity + Math.random() * 2 - 1))
    ),
    soilMoisture: Math.round(
      Math.max(
        0,
        Math.min(100, previous.soilMoisture + Math.random() * 2 - 1)
      )
    ),
    light: Math.round(
      Math.max(100, Math.min(1500, previous.light + Math.random() * 50 - 25))
    ),
    timestamp: new Date().toISOString(),
  };
}

export function useSensorData() {
  const [data, setData] = useState<SensorData>(initialData);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const addReading = useCallback((reading: SensorData) => {
    setData(reading);

    const time = new Date(reading.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    setHistory((previous) => [
      ...previous.slice(-23),
      {
        time,
        temperature: reading.temperature,
        humidity: reading.humidity,
        soilMoisture: reading.soilMoisture,
      },
    ]);
  }, []);

  useEffect(() => {
    let mounted = true;

    getLatest()
      .then((reading) => {
        if (mounted) addReading(reading);
      })
      .catch(() => {
        if (mounted) addReading(initialData);
      });

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("sensor:update", (reading: SensorData) => {
      if (mounted) addReading(reading);
    });

    // Mock mode fallback: if the backend is not available, keep the UI alive.
    const mockTimer = window.setInterval(() => {
      if (mounted && !socket.connected) {
        setData((previous) => {
          const reading = mockReading(previous);
          addReading(reading);
          return reading;
        });
      }
    }, 3000);

    return () => {
      mounted = false;
      window.clearInterval(mockTimer);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [addReading]);

  return {
    data,
    history,
    connected,
  };
}
