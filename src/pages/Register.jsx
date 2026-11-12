import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { errMsg } from "../api/axios.js";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "entrepreneur" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <form className="card auth-card" onSubmit={handleSubmit}>
      <h2>Create your account</h2>
      {error && <p className="error">{error}</p>}
      <label>Full name</label>
      <input name="name" value={form.name} onChange={handleChange} required />
      <label>Email</label>
      <input name="email" type="email" value={form.email} onChange={handleChange} required />
      <label>Password (min 6 characters)</label>
      <input name="password" type="password" minLength={6} value={form.password} onChange={handleChange} required />
      <label>I am a</label>
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="entrepreneur">Entrepreneur</option>
        <option value="mentor">Mentor</option>
        <option value="industry_expert">Industry Expert</option>
      </select>
      <button className="btn full">Sign up</button>
      <p className="muted center">Already registered? <Link to="/login">Login</Link></p>
    </form>
  );
}
