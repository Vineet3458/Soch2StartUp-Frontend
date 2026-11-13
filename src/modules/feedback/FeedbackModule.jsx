import { useState } from "react";
import FeedbackList from "./components/FeedbackList.jsx";
import EvaluationForm from "./components/EvaluationForm.jsx";
import api, { errMsg } from "../../api/axios.js";

export default function FeedbackModule({
  ideaId,
  feedback = [],
  role = "entrepreneur",
  onFeedbackAdded,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canGiveFeedback = [
    "mentor",
    "industry_expert",
    "evaluator",
    "admin",
    "superadmin",
  ].includes(role);

  const handleSubmitFeedback = async (payload) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.post(`/ideas/${ideaId}/feedback`, payload);
      setSuccess("Feedback posted successfully!");
      if (onFeedbackAdded) {
        onFeedbackAdded(res.data.feedback);
      }
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-module-root">
      <div className="feedback-module-header">
        <h3>Mentor &amp; Expert Feedback ({feedback.length})</h3>
        <p className="muted small">
          Peer reviews, rubric evaluations, and strategic guidance from verified industry advisors.
        </p>
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success-banner">{success}</p>}

      {/* 1. Existing Feedback Thread */}
      <FeedbackList feedback={feedback} role={role} />

      {/* 2. Feedback Form if Role is Allowed */}
      {canGiveFeedback && (
        <div style={{ marginTop: "24px" }}>
          <EvaluationForm
            role={role}
            loading={loading}
            onSubmit={handleSubmitFeedback}
          />
        </div>
      )}
    </div>
  );
}
