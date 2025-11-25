import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";

import "./LoginPage.css";
import { getAuthErrorMessage } from "../../helpers/error-handling";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // prevent double submit
    setError("");

    // Minimal client-side checks before calling API
    const emailTrim = email.trim();
    const pass = password;
    if (!emailTrim || !pass) {
      setError("Please fill email and password");
      return;
    }

    setSubmitting(true);
    try {
      // Use login helper so we handle status codes explicitly instead of relying on axios errors
      const res = await login({ email: emailTrim, password: pass });

      if (res.ok) {
        navigate("/board", { replace: true });
        return;
      }

      setError(getAuthErrorMessage(res.status));
    } catch (err) {
      // Network-level or unexpected error (no response from backend)
      setError("Failed to connect to the backend");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Access your workspace</h1>

      <input type="email" inputMode="email" autoComplete="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <input type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />

      <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} aria-disabled={isSubmitting}>
        {isSubmitting ? "Log in..." : "Log in"}
      </button>

      {error && (
        <p style={{ color: "red" }} role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </form>
  );
}
