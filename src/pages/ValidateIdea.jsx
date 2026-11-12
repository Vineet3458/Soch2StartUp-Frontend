import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errMsg } from "../api/axios.js";
import Loader from "../components/Loader.jsx";

const INDUSTRIES = ["FoodTech", "EdTech", "HealthTech", "FinTech", "E-commerce", "SaaS", "AgriTech", "Other"];
const BUDGETS = ["Under ₹1 lakh", "₹1–10 lakh", "Above ₹10 lakh"];
const TEAMS = ["Solo founder", "2–3 members", "4+ members"];

export default function ValidateIdea() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", industry: INDUSTRIES[0], budget: BUDGETS[1], teamSize: TEAMS[1] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/ideas", form);
      navigate(`/ideas/${data._id}`);
    } catch (err) {
      setError(errMsg(err));
      setLoading(false);
    }
  };

  if (loading) return <Loader text="AI is analyzing your idea..." />;

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h2>Validate a startup idea</h2>
      {error && <p className="error">{error}</p>}
      <label>Idea title</label>
      <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. FarmFresh Meal Boxes" required />
      <label>Describe your idea</label>
      <textarea name="description" rows={5} value={form.description} onChange={handleChange} minLength={30}
        placeholder="What problem does it solve, for whom, and how?" required />
      <div className="grid grid-3">
        <div><label>Industry</label>
          <select name="industry" value={form.industry} onChange={handleChange}>{INDUSTRIES.map((x) => <option key={x}>{x}</option>)}</select></div>
        <div><label>Budget</label>
          <select name="budget" value={form.budget} onChange={handleChange}>{BUDGETS.map((x) => <option key={x}>{x}</option>)}</select></div>
        <div><label>Team</label>
          <select name="teamSize" value={form.teamSize} onChange={handleChange}>{TEAMS.map((x) => <option key={x}>{x}</option>)}</select></div>
      </div>
      <button className="btn">Analyze my idea</button>
    </form>
  );
}
