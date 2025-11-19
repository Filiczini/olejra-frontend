import { api } from "../../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./LoginPage.css";

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

    // Minimal client-side checks
    const emailTrim = email.trim();
    const pass = password;
    if (!emailTrim || !pass) {
      setError("Please fill email and password");
      return;
    }

    setSubmitting(true);
    try {
      // Backend sets httpOnly cookie 'olejra_token'
      await api.post("/auth/login", { email: emailTrim, password: pass });
      navigate("/board", { replace: true });
    } catch (err) {
      if (err?.response) {
        const { status, data } = err.response;
        switch (status) {
          case 401:
            setError("Invalid email or password");
            break;
          case 429:
            setError("Too many attempts. Please try again later.");
            break;
          case 422:
            setError(data?.error || "Invalid form data");
            break;
          default:
            if (status >= 500) {
              setError("Server error. Please try again later.");
            } else {
              setError(data?.error || `Server Error: ${status}`);
            }
        }
      } else if (err?.request) {
        setError("Failed to connect to the backend");
      } else {
        setError(`Error: ${err?.message || "unknown error"}`);
      }
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
