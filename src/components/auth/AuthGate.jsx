import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api } from "../../api/axios";

export default function AuthGate({ children }) {
  const [isLoading, setLoading] = useState(true);
  const [isAllowed, setAllowed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    // Check current user session on mount.
    (async () => {
      try {
        await api.get("/auth/me"); // throws on 401 now
        if (!cancelled) {
          setAllowed(true);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("AuthGate: /auth/me failed", error); // simple debug log
          setAllowed(false);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!isAllowed) return <Navigate to="/" replace state={{ from: location }} />;

  return children;
}
