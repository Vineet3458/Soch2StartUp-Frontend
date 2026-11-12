import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import VerdictBadge from "../components/VerdictBadge.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/ideas").then((res) => setIdeas(res.data)).finally(() => setLoading(false));
  }, []);

  // Allow at most 2 ideas to be selected for comparison
  const toggleSelect = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-2)));

  const handleDelete = async (id) => {
    if (!confirm("Delete this idea?")) return;
    await api.delete(`/ideas/${id}`);
    setIdeas(ideas.filter((i) => i._id !== id));
    setSelected(selected.filter((x) => x !== id));
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="row-between">
        <div>
          <h2>Hello, {user.name} 👋</h2>
          <p className="muted">Your validated ideas</p>
        </div>
        <div className="actions">
          <button className="btn btn-outline" disabled={selected.length !== 2} onClick={() => navigate(`/compare?ids=${selected.join(",")}`)}>
            Compare selected ({selected.length}/2)
          </button>
          <Link to="/validate" className="btn">+ New idea</Link>
        </div>
      </div>

      {ideas.length === 0 && <div className="card center">No ideas yet. Validate your first one!</div>}

      {ideas.map((idea) => (
        <div className="card idea-row hover" key={idea._id}>
          <input type="checkbox" checked={selected.includes(idea._id)} onChange={() => toggleSelect(idea._id)} />
          <div className="grow">
            <Link to={`/ideas/${idea._id}`}><strong>{idea.title}</strong></Link>
            <p className="muted small">{idea.industry} · {new Date(idea.createdAt).toLocaleDateString()}</p>
          </div>
          <strong className="score">{idea.report.score}</strong>
          <VerdictBadge verdict={idea.report.verdict} />
          <button className="btn btn-outline btn-sm" onClick={() => handleDelete(idea._id)}>Delete</button>
        </div>
      ))}
    </>
  );
}
