import { useEffect, useState } from "react";
import { api } from "../../api/axios";

export default function Demo() {
  const [hello, setHello] = useState("");
  const [echo, setEcho] = useState("нічо");
  const [echoPending, setEchoPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/api/hello").then((r) => setHello(r.data.message));
  }, []);

  const sendEcho = async () => {
    try {
      setError(null);
      setEchoPending(true);
      const r = await api.post("/api/echo", "Чо", {
        headers: { "Content-Type": "text/plain" }, // щоб не загортало в JSON
        responseType: "text",
      });
      setEcho(r.data);
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setEchoPending(false);
    }
  };

  return (
    <div>
      <p>hello: {hello}</p>

      <button onClick={sendEcho} disabled={echoPending}>
        {echoPending ? "Шлю..." : "Send echo"}
      </button>

      {error && <p style={{ color: "red" }}>Помилка: {error}</p>}
      <pre>{JSON.stringify(echo, null, 2)}</pre>
    </div>
  );
}
