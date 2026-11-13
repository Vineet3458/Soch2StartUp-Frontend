import React from "react";
import { Link } from "react-router-dom";
import VerdictBadge from "../../../components/VerdictBadge.jsx";

export default function IdeaTable({
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
  const isAdminOrMod = ["admin", "superadmin", "moderator"].includes(role);

  return (
    <div className="card table-wrap module-table-card">
      <table className="module-data-table">
        <thead>
          <tr>
            {isEntrepreneur && <th style={{ width: "40px" }}>Compare</th>}
            <th>Startup Idea</th>
            <th>Industry</th>
            {!isEntrepreneur && <th>Founder</th>}
            <th>Score</th>
            <th>Verdict</th>
            <th>Feedback</th>
            <th>Submitted</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ideas.map((idea) => {
            const isSelected = selected.includes(idea._id);
            const feedbackCount = idea.feedback?.length || 0;
            const score = idea.report?.score ?? "—";
            const verdict = idea.report?.verdict;

            return (
              <tr key={idea._id} className={isSelected ? "row-selected" : ""}>
                {isEntrepreneur && (
                  <td>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect && onToggleSelect(idea._id)}
                      title="Select for comparison (up to 2)"
                    />
                  </td>
                )}
                <td>
                  <Link to={`/ideas/${idea._id}`} className="table-idea-title">
                    <strong>{idea.title}</strong>
                  </Link>
                  <p className="muted small line-clamp-1">{idea.description}</p>
                </td>
                <td>
                  <span className="industry-pill">{idea.industry}</span>
                </td>
                {!isEntrepreneur && (
                  <td>
                    <div className="founder-info-cell">
                      <span className="founder-avatar">
                        {(idea.user?.name || "Founder").charAt(0)}
                      </span>
                      <div>
                        <strong>{idea.user?.name || "Unknown"}</strong>
                        <small className="muted">{idea.user?.email}</small>
                      </div>
                    </div>
                  </td>
                )}
                <td>
                  <strong className="table-score-highlight">{score}</strong>
                </td>
                <td>
                  <VerdictBadge verdict={verdict} />
                </td>
                <td>
                  <span className={`feedback-count-tag ${feedbackCount > 0 ? "has-feedback" : ""}`}>
                    💬 {feedbackCount}
                  </span>
                </td>
                <td className="muted small">
                  {new Date(idea.createdAt).toLocaleDateString()}
                </td>
                <td style={{ textAlign: "right" }}>
                  <div className="table-actions-cell">
                    <Link
                      to={`/ideas/${idea._id}`}
                      className="btn btn-outline btn-sm"
                      title="View Full Report"
                    >
                      Report →
                    </Link>

                    {isEvaluatorOrMentor && onEvaluate && (
                      <button
                        type="button"
                        className="btn btn-sm btn-eval-action"
                        onClick={() => onEvaluate(idea)}
                      >
                        Evaluate
                      </button>
                    )}

                    {(isEntrepreneur || isAdminOrMod) && onDelete && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm btn-delete-action"
                        onClick={() => onDelete(idea._id)}
                        title="Delete Idea"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
