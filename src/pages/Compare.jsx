import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import VerdictBadge from "../components/VerdictBadge.jsx";
import { LABELS } from "../components/MetricsChart.jsx";

export default function Compare() {
  const [params] = useSearchParams();
  const [ideas, setIdeas] = useState(null);

  useEffect(() => {
    api.get(`/ideas/compare?ids=${params.get("ids")}`).then((res) => setIdeas(res.data));
  }, [params]);

  if (!ideas) return <Loader />;
  if (ideas.length < 2) return <p>Select two ideas on the dashboard to compare. <Link to="/dashboard">Go back</Link></p>;

  // One row per metric, one column per idea
  const data = Object.keys(LABELS).map((key) => ({
    name: LABELS[key],
    [ideas[0].title]: ideas[0].report.metrics[key],
    [ideas[1].title]: ideas[1].report.metrics[key],
  }));

  return (
    <>
      <h2>Idea comparison</h2>
      <div className="grid grid-2">
        {ideas.map((idea) => (
          <div className="card center" key={idea._id}>
            <h3>{idea.title}</h3>
            <p className="big-score">{idea.report.score}</p>
            <VerdictBadge verdict={idea.report.verdict} />
          </div>
        ))}
      </div>
      <div className="card gap-top">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey={ideas[0].title} fill="#5b5bf0" radius={[6, 6, 0, 0]} />
            <Bar dataKey={ideas[1].title} fill="#14b8a6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
