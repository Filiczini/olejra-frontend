// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { getAuthErrorMessage } from "../helpers/error-handling";

import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");

    const emailTrim = email.trim();
    if (!emailTrim || !password) {
      setError("Please fill email and password");
      return;
    }

    setSubmitting(true);
    try {
      const res = await login({ email: emailTrim, password });

      if (res.ok) {
        navigate("/board", { replace: true });
        return;
      }

      setError(getAuthErrorMessage(res.status));
    } catch (err) {
      setError("Failed to connect to the backend");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        {/* Logo pill */}
        <div className="login-card__logo" aria-hidden="true">
          O
        </div>

        <h1 className="login-card__title">Welcome back</h1>
        <p className="login-card__subtitle">Enter your email to sign in to Olejra</p>

        <div className="login-card__field">
          <label htmlFor="email" className="login-card__field-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="login-card__input"
            inputMode="email"
            autoComplete="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-card__field">
          <label htmlFor="password" className="login-card__field-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="login-card__input"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-card__submit" disabled={isSubmitting} aria-busy={isSubmitting}>
          <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
        </button>

        {error && (
          <p className="login-card__error" role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <div className="login-card__footer">
          <span>No account?</span>
          <a href="mailto:filiczini@gmail.com" className="login-card__footer-link">
            Contact admin
          </a>
        </div>
      </form>
    </div>
  );
}
