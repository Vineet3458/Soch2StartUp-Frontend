import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { errMsg } from "../api/axios.js";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "entrepreneur" });
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
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card auth-card" onSubmit={handleSubmit}>
      <h2>Create your account</h2>
      <p className="muted small" style={{ marginBottom: "16px" }}>
        Join the startup ecosystem to validate, mentor, or evaluate ideas.
      </p>
      {error && <p className="error">{error}</p>}
      <label>Full Name</label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Aarav Patel"
        required
      />
      <label>Email Address</label>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="founder@example.com"
        required
      />
      <label>Password (min 6 characters)</label>
      <input
        name="password"
        type="password"
        minLength={6}
        value={form.password}
        onChange={handleChange}
        placeholder="••••••••"
        required
      />
      <label>I am a</label>
      <select name="role" value={form.role} onChange={handleChange} className="filter-select">
        <option value="entrepreneur">Entrepreneur (Startup Founder)</option>
        <option value="mentor">Mentor (Guide &amp; Support)</option>
        <option value="industry_expert">Industry Expert (Assess &amp; Rate Ideas)</option>
      </select>
      <button className="btn full" disabled={submitting}>
        {submitting ? "Creating account..." : "Sign up"}
      </button>
      <p className="muted center" style={{ marginTop: "16px" }}>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}
