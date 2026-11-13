import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { errMsg } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import ValidationReportModule from "../modules/reports/ValidationReportModule.jsx";
import FeedbackModule from "../modules/feedback/FeedbackModule.jsx";

export default function IdeaReport() {
  const { id } = useParams();
  const { user } = useAuth();
  const [idea, setIdea] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/ideas/${id}`)
      .then((res) => setIdea(res.data))
      .catch((err) => setError(errMsg(err)));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!idea) return <Loader />;

  return (
    <div className="idea-report-page-container">
      <div className="report-page-top-bar no-print" style={{ marginBottom: "20px" }}>
        <Link to="/dashboard" className="btn btn-outline btn-sm">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Module 2: Validation Report & Scorecard */}
      <ValidationReportModule idea={idea} />

      {/* Module 3: Feedback & Evaluation */}
      <div style={{ marginTop: "40px" }} className="no-print">
        <FeedbackModule
          ideaId={id}
          feedback={idea.feedback || []}
          role={user.role}
          onFeedbackAdded={(updatedFeedback) => {
            setIdea({ ...idea, feedback: updatedFeedback });
          }}
        />
      </div>
    </div>
  );
}
