import { api } from "../../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data?.csrfToken) {
        sessionStorage.setItem("csrfToken", res.data.csrfToken);
      }
      navigate("/board");
    } catch (err) {
      if (err.response) {
        // Backend responded with a status code
        if (err.response.status === 401) {
          setError("Невірна пошта або пароль");
        } else {
          setError(`Помилка сервера: ${err.response.status}`);
        }
      } else if (err.request) {
        setError("Не вдалося під’єднатися до бекенда");
      } else {
        setError(`Помилка: ${err.message}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Вхід</h1>
      <input type="email" placeholder="логін@приклад.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Увійти</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
