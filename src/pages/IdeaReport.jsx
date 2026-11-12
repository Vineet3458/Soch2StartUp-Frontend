import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { errMsg } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import ScoreGauge from "../components/ScoreGauge.jsx";
import MetricsChart from "../components/MetricsChart.jsx";
import SwotGrid from "../components/SwotGrid.jsx";
import VerdictBadge from "../components/VerdictBadge.jsx";

const List = ({ title, items }) => (
  <div className="card">
    <h4>{title}</h4>
    <ul>{items?.map((x, i) => <li key={i}>{x}</li>)}</ul>
  </div>
);

export default function IdeaReport() {
  const { id } = useParams();
  const { user } = useAuth();
  const [idea, setIdea] = useState(null);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    api.get(`/ideas/${id}`).then((res) => setIdea(res.data)).catch((err) => setError(errMsg(err)));
  }, [id]);

  const sendFeedback = async (e) => {
    e.preventDefault();
    const { data } = await api.post(`/ideas/${id}/feedback`, { comment });
    setIdea({ ...idea, feedback: data.feedback });
    setComment("");
  };

  if (error) return <p className="error">{error}</p>;
  if (!idea) return <Loader />;

  const { report } = idea;
  const canGiveFeedback = ["mentor", "industry_expert"].includes(user.role);

  return (
    <>
      <div className="card report-top">
        <ScoreGauge score={report.score} verdict={report.verdict} />
        <div>
          <VerdictBadge verdict={report.verdict} />
          <h2>{idea.title}</h2>
          <p className="muted">{idea.industry} · Budget: {idea.budget} · Team: {idea.teamSize}</p>
          <p>{idea.description}</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card"><h4>📈 Validation metrics</h4><MetricsChart metrics={report.metrics} /></div>
        <div className="card">
          <h4>📊 Market research</h4><p>{report.marketResearch}</p>
          <h4>⚙️ Feasibility</h4><p>{report.feasibilityNote}</p>
        </div>
      </div>

      <h3>SWOT analysis</h3>
      <SwotGrid swot={report.swot} />

      <div className="grid grid-3 gap-top">
        <List title="🎯 Target customers" items={report.targetCustomers} />
        <List title="🥊 Competitors" items={report.competitors} />
        <List title="⚠️ Key risks" items={report.risks} />
      </div>
      <div className="gap-top"><List title="💡 AI recommendations" items={report.recommendations} /></div>

      <h3>Mentor &amp; expert feedback</h3>
      {idea.feedback.length === 0 && <p className="muted">No feedback yet.</p>}
      {idea.feedback.map((f, i) => (
        <div className="card" key={i}>
          <strong>{f.byName}</strong> <span className="role-tag">{f.role.replace("_", " ")}</span>
          <p>{f.comment}</p>
        </div>
      ))}
      {canGiveFeedback && (
        <form className="card" onSubmit={sendFeedback}>
          <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your feedback..." required />
          <button className="btn">Submit feedback</button>
        </form>
      )}
    </>
  );
}
