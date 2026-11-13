import React from "react";
import { Link } from "react-router-dom";
import VerdictBadge from "../../../components/VerdictBadge.jsx";

export default function IdeaCardGrid({
  ideas = [],
  role = "entrepreneur",
  selected = [],
  onToggleSelect,
  onDelete,
  onEvaluate,
}) {
  if (ideas.length === 0) {
    return (
      <div className="card center empty-state-box">
        <span className="empty-icon">💡</span>
        <h3>No ideas found</h3>
        <p className="muted">Try adjusting your search or filters.</p>
      </div>
    );
  }

  const isEntrepreneur = role === "entrepreneur";
  const isEvaluatorOrMentor = ["mentor", "industry_expert", "evaluator"].includes(role);

  return (
    <div className="module-grid-layout">
      {ideas.map((idea) => {
        const isSelected = selected.includes(idea._id);
        const feedbackCount = idea.feedback?.length || 0;
        const score = idea.report?.score ?? "—";
        const verdict = idea.report?.verdict;

        return (
          <div
            key={idea._id}
            className={`card hover idea-card-item ${isSelected ? "selected-card" : ""}`}
          >
            <div className="idea-card-header">
              <span className="industry-pill">{idea.industry}</span>
              <VerdictBadge verdict={verdict} />
            </div>

            <div className="idea-card-body">
              <Link to={`/ideas/${idea._id}`} className="idea-card-title-link">
                <h4>{idea.title}</h4>
              </Link>
              <p className="idea-card-description">{idea.description}</p>
            </div>

            <div className="idea-card-meta-row">
              <div className="meta-score-box">
                <span className="meta-score-number">{score}</span>
                <span className="meta-score-label">AI Score</span>
              </div>
              <div className="meta-stat-item">
                <span className="meta-stat-val">💬 {feedbackCount}</span>
                <span className="meta-stat-lbl">Feedback</span>
              </div>
              <div className="meta-stat-item">
                <span className="meta-stat-val">
                  {new Date(idea.createdAt).toLocaleDateString()}
                </span>
                <span className="meta-stat-lbl">Created</span>
              </div>
            </div>

            <div className="idea-card-footer">
              {isEntrepreneur && (
                <label className="compare-checkbox-label">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect && onToggleSelect(idea._id)}
                  />
                  <span>Compare</span>
                </label>
              )}

              <div className="idea-card-actions">
                {isEvaluatorOrMentor && onEvaluate && (
                  <button
                    type="button"
                    className="btn btn-sm btn-eval-action"
                    onClick={() => onEvaluate(idea)}
                  >
                    Evaluate
                  </button>
                )}

                <Link to={`/ideas/${idea._id}`} className="btn btn-outline btn-sm">
                  View Report →
                </Link>

                {onDelete && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm btn-delete-icon"
                    onClick={() => onDelete(idea._id)}
                    title="Delete Idea"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
