import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    if (!email || !pass) return alert("Вкажіть email і пароль");
    if (username && password) navigate("/board");
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Вхід</h1>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="••••••••"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />
      <button type="submit">Увійти</button>
    </form>
  );
}
