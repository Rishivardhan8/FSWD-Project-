import { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Alerts from "./pages/Alerts";
import Sensors from "./pages/Sensors";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { useSensorData } from "./hooks/useSensorData";

type Page = "home" | "dashboard" | "history" | "alerts" | "sensors";

type AuthPage = "login" | "register";

function App() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("agrosense_token")
  );

  const [userName, setUserName] = useState<string>(
    () => localStorage.getItem("agrosense_user") ?? "User"
  );

  const [page, setPage] = useState<Page>("home");

  const [authPage, setAuthPage] =
    useState<AuthPage>("login");

  const {
    data,
    history,
    connected,
  } = useSensorData();

  const handleLogin = (
    newToken: string,
    name: string
  ) => {
    localStorage.setItem(
      "agrosense_token",
      newToken
    );

    localStorage.setItem(
      "agrosense_user",
      name
    );

    setToken(newToken);
    setUserName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "agrosense_token"
    );

    localStorage.removeItem(
      "agrosense_user"
    );

    setToken(null);
    setAuthPage("login");
  };

  // ==========================================
  // LOGIN / REGISTER
  // ==========================================

 if (!token) {
  return authPage === "login" ? (
    <div>
      <Login
        onLogin={handleLogin}
        onRegister={() =>
          setAuthPage("register")
        }
      />

      <div className="text-center mt-3 mb-4">
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => {
            window.location.href = "/admin.html";
          }}
        >
          Admin Login
        </button>
      </div>
    </div>
  ) : (
    <Register
      onRegister={handleLogin}
      onLogin={() =>
        setAuthPage("login")
      }
    />
  );
}

  // ==========================================
  // MAIN APPLICATION
  // ==========================================

  return (
    <div className="app-shell">

      <Navbar
        page={page}
        onNavigate={(next) =>
          setPage(next as Page)
        }
        userName={userName}
        onLogout={handleLogout}
      />

      <main className="container-fluid app-container">

        {page === "home" && (
          <Home
            userName={userName}
            onNavigate={(next) =>
              setPage(next as Page)
            }
          />
        )}

        {page === "dashboard" && (
          <Dashboard
            data={data}
            history={history}
            connected={connected}
          />
        )}

        {page === "history" && (
          <History />
        )}

        {page === "alerts" && (
          <Alerts data={data} />
        )}

        {page === "sensors" && (
          <Sensors />
        )}

      </main>

      <footer className="app-footer">

        <strong>AgroSense</strong>
        {" · "}
        Smart Greenhouse Telemetry

        <span>
          React + TypeScript · Express ·
          Socket.io · MQTT · PostgreSQL
        </span>

      </footer>

    </div>
  );
}

export default App;