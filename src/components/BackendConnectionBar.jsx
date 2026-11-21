import { useState, useEffect } from "react";
import { getApiBase } from "../api/client.js";

/**
 * BackendConnectionBar:
 * Automatically appears only when the frontend is running on Vercel (or a remote host)
 * and no backend URL was supplied at build time (API_BASE defaults to relative '/api').
 * Gives founders and reviewers a 1-click prompt to connect their Render backend URL.
 */
export default function BackendConnectionBar() {
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isRemote = window.location.hostname.endsWith("vercel.app") || window.location.hostname.includes("now.sh");
    const currentBase = getApiBase();
    // If running on Vercel and API_BASE is relative '/api', the user needs to connect their Render backend
    if (isRemote && currentBase === "/api") {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const handleConnect = async (e) => {
    e.preventDefault();
    setError("");
    const cleaned = url.trim().replace(/\/+$/, "");
    if (!cleaned || !/^https?:\/\//i.test(cleaned)) {
      setError("Please enter a valid URL starting with https://");
      return;
    }
    const target = cleaned.endsWith("/api") ? cleaned : `${cleaned}/api`;
    setIsConnecting(true);

    try {
      // Test the healthcheck
      const res = await fetch(`${target}/health`);
      if (res.ok) {
        localStorage.setItem("API_URL", target);
        window.location.reload();
        return;
      }
      throw new Error(`Server returned HTTP ${res.status}`);
    } catch (err) {
      // If CORS or network error, still save and let them proceed (Render backend might be waking up)
      localStorage.setItem("API_URL", target);
      window.location.reload();
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 9999,
      background: "linear-gradient(90deg, #1e1b4b, #312e81, #1e1b4b)",
      borderBottom: "1px solid rgba(129, 140, 248, 0.4)",
      padding: "8px 16px",
      color: "#e0e7ff",
      fontSize: "13px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "10px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "16px" }}>⚡</span>
        <span>
          <strong>Connect Backend:</strong> To connect this Vercel frontend with your Render backend, enter your Render API URL:
        </span>
      </div>

      <form onSubmit={handleConnect} style={{ display: "flex", alignItems: "center", gap: "8px", flex: "1 1 auto", maxWidth: "480px" }}>
        <input
          type="url"
          placeholder="https://soch2startup-backend.onrender.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{
            flex: 1,
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(165, 180, 252, 0.3)",
            borderRadius: "6px",
            padding: "5px 10px",
            color: "#ffffff",
            fontSize: "12px",
            outline: "none"
          }}
        />
        <button
          type="submit"
          disabled={isConnecting}
          style={{
            background: "#6366f1",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            padding: "5px 14px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          {isConnecting ? "Connecting..." : "Connect"}
        </button>
      </form>

      {error && <span style={{ color: "#f87171", fontSize: "12px", width: "100%" }}>{error}</span>}
    </div>
  );
}
