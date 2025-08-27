import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    if (!email || !pass) return alert("Вкажіть email і пароль");
    alert(`Логін OK як ${email}`);
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
