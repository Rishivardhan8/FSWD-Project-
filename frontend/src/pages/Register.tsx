import { useState } from "react";
import { registerUser } from "../api";

interface Props {
  onRegister: (token: string, name: string) => void;
  onLogin: () => void;
}

export default function Register({ onRegister, onLogin }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      const result = await registerUser(name, email, password);
      onRegister(result.token, result.user.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo">🌱</div>
        <span className="eyebrow">AGROSENSE</span>
        <h1>Create account</h1>
        <p>Register to access your smart greenhouse dashboard.</p>

        <label>
          Full Name
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

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
          Create Account
        </button>

        <button className="text-btn" type="button" onClick={onLogin}>
          Already have an account? Sign in
        </button>
      </form>
    </div>
  );
}
