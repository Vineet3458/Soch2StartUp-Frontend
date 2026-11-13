import { useState } from "react";

export default function EvaluationForm({ onSubmit, loading = false, role = "mentor" }) {
  const [comment, setComment] = useState("");
  const [score, setScore] = useState(4.0);
  const [recommendation, setRecommendation] = useState("IMPROVE");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit({
      comment,
      score: Number(score),
      recommendation,
    });
    setComment("");
  };

  const isEvaluator = role === "evaluator" || role === "industry_expert";

  return (
    <form className="card evaluation-form-card" onSubmit={handleSubmit}>
      <div className="eval-form-header">
        <h4>{isEvaluator ? "📝 Submit Formal Idea Evaluation" : "💡 Provide Mentor Guidance"}</h4>
        <p className="muted small">
          {isEvaluator
            ? "Score the startup against the platform rubric and provide actionable critique."
            : "Share strategic advice, industry connections, and roadmap feedback."}
        </p>
      </div>

      <div className="grid grid-2" style={{ marginBottom: "16px" }}>
        <div>
          <label>Evaluation Score (1.0 - 5.0)</label>
          <div className="score-input-slider-wrap">
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.5"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="eval-range-slider"
            />
            <span className="slider-display-val">★ {score}</span>
          </div>
        </div>

        <div>
          <label>Expert Recommendation</label>
          <select
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            className="filter-select"
          >
            <option value="GO">GO – High Viability, Build MVP</option>
            <option value="IMPROVE">IMPROVE – Address Risks & Iterate</option>
            <option value="AVOID">AVOID – Significant Market Friction</option>
          </select>
        </div>
      </div>

      <label>Feedback &amp; Strategic Guidance</label>
      <textarea
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write detailed observations on unit economics, GTM strategy, customer retention, and potential partnerships..."
        required
      />

      <div className="eval-form-actions">
        <button type="submit" className="btn" disabled={loading || !comment.trim()}>
          {loading ? "Submitting..." : isEvaluator ? "Submit Evaluation Report" : "Post Mentor Guidance"}
        </button>
      </div>
    </form>
  );
}
