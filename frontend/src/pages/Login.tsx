import { useState } from "react";
import { loginUser } from "../api";

interface Props {
  onLogin: (token: string, name: string) => void;
  onRegister: () => void;
}

export default function Login({ onLogin, onRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const result = await loginUser(email, password);
      onLogin(result.token, result.user.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo">🌱</div>
        <span className="eyebrow">AGROSENSE</span>
        <h1>Welcome back</h1>
        <p>Sign in to view your greenhouse telemetry.</p>

        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <button className="primary-btn" type="submit">
          Sign In
        </button>

        <button className="text-btn" type="button" onClick={onRegister}>
          New here? Create an account
        </button>
      </form>
    </div>
  );
}
