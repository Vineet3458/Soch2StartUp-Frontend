import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { errMsg } from "../api/axios.js";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      await login(form.email, form.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card auth-card" onSubmit={handleSubmit}>
      <h2>Welcome back</h2>
      <p className="muted small" style={{ marginBottom: "16px" }}>
        Sign in to access your startup dashboard and validation reports.
      </p>
      {error && <p className="error">{error}</p>}
      <label>Email Address</label>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="you@domain.com"
        required
      />
      <label>Password</label>
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="••••••••"
        required
      />
      <button className="btn full" disabled={submitting}>
        {submitting ? "Signing in..." : "Login"}
      </button>
      <p className="muted center" style={{ marginTop: "16px" }}>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </form>
  );
}
