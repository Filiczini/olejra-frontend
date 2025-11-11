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
      setError("Заповніть email і пароль");
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
            setError("Невірна пошта або пароль");
            break;
          case 429:
            setError("Забагато спроб. Спробуйте пізніше.");
            break;
          case 422:
            setError(data?.error || "Некоректні дані форми");
            break;
          default:
            if (status >= 500) {
              setError("Помилка сервера. Спробуйте ще раз пізніше.");
            } else {
              setError(data?.error || `Помилка сервера: ${status}`);
            }
        }
      } else if (err?.request) {
        setError("Не вдалося під’єднатися до бекенда");
      } else {
        setError(`Помилка: ${err?.message || "невідома помилка"}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Вхід</h1>

      <input type="email" inputMode="email" autoComplete="email" placeholder="логін@приклад.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <input type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />

      <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} aria-disabled={isSubmitting}>
        {isSubmitting ? "Увійти…" : "Увійти"}
      </button>

      {error && (
        <p style={{ color: "red" }} role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </form>
  );
}
