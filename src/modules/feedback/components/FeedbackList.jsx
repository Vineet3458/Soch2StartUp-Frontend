import React from "react";

export default function FeedbackList({
  feedback = [],
  role = "entrepreneur",
  onFlagComment,
}) {
  const isModOrAdmin = ["moderator", "admin", "superadmin"].includes(role);

  if (!feedback || feedback.length === 0) {
    return (
      <div className="card center empty-feedback-box">
        <span className="empty-icon">💬</span>
        <h4>No feedback recorded yet</h4>
        <p className="muted small">
          Mentors and industry evaluators will review this startup idea and post guidance here.
        </p>
      </div>
    );
  }

  return (
    <div className="feedback-threads-container">
      {feedback.map((item, idx) => {
        const initial = (item.byName || "Mentor").charAt(0).toUpperCase();
        const roleLabel = (item.role || "mentor").replace("_", " ");

        return (
          <div className="card feedback-card-item" key={item._id || idx}>
            <div className="feedback-card-header">
              <div className="feedback-author-row">
                <span className="feedback-author-avatar">{initial}</span>
                <div>
                  <strong className="feedback-author-name">
                    {item.byName || "Advisor"}
                  </strong>
                  <span className="role-tag feedback-role-badge">{roleLabel}</span>
                </div>
              </div>

              <div className="feedback-header-meta">
                {item.score && (
                  <span className="rubric-score-badge">
                    ★ {item.score}/5.0
                  </span>
                )}
                <span className="muted small">
                  {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                </span>
                {isModOrAdmin && onFlagComment && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm flag-btn"
                    onClick={() => onFlagComment(item)}
                    title="Flag comment for moderation"
                  >
                    🚩 Flag
                  </button>
                )}
              </div>
            </div>

            <div className="feedback-card-body">
              <p className="feedback-comment-text">{item.comment}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
