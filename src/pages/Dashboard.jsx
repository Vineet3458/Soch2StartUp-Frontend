import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api, { errMsg } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import { Modal } from "../components/common/index.jsx";

// 7 Consolidated Common Modules
import IdeaListModule from "../modules/ideas/IdeaListModule.jsx";
import ValidationReportModule from "../modules/reports/ValidationReportModule.jsx";
import FeedbackModule from "../modules/feedback/FeedbackModule.jsx";
import EvaluationForm from "../modules/feedback/components/EvaluationForm.jsx";
import UserManagementModule from "../modules/users/UserManagementModule.jsx";
import AnalyticsModule from "../modules/analytics/AnalyticsModule.jsx";
import ResourceHubModule from "../modules/resources/ResourceHubModule.jsx";
import AccountShellModule from "../modules/account/AccountShellModule.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tab = searchParams.get("tab") || "all";
  const view = searchParams.get("view");

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluatingIdea, setEvaluatingIdea] = useState(null);
  const [evalSubmitting, setEvalSubmitting] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const res = await api.get("/ideas");
      setIdeas(res.data);
    } catch (err) {
      console.error("Error loading ideas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIdea = async (id) => {
    if (!confirm("Are you sure you want to delete this startup idea?")) return;
    try {
      await api.delete(`/ideas/${id}`);
      setIdeas((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert(errMsg(err));
    }
  };

  const handleSubmitEvaluation = async (payload) => {
    if (!evaluatingIdea) return;
    try {
      setEvalSubmitting(true);
      const res = await api.post(`/ideas/${evaluatingIdea._id}/feedback`, payload);
      setIdeas((prev) =>
        prev.map((i) => (i._id === evaluatingIdea._id ? { ...i, feedback: res.data.feedback } : i))
      );
      setEvaluatingIdea(null);
      alert("Evaluation and feedback submitted successfully!");
    } catch (err) {
      alert(errMsg(err));
    } finally {
      setEvalSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  // ROUTE TO MODULE 7: Account Utilities (Notifications, Profile, Settings)
  if (view === "notifications" || view === "profile" || view === "settings") {
    return <AccountShellModule defaultView={view} />;
  }

  // ROUTE TO MODULE 5: Analytics & Quality Insights
  if (view === "market" || view === "analytics" || tab === "analytics" || tab === "quality") {
    return <AnalyticsModule role={user.role} ideas={ideas} />;
  }

  // ROUTE TO MODULE 6: Knowledge & Resource Hub
  if (
    view === "saved" ||
    view === "plan" ||
    view === "roadmap" ||
    tab.includes("resource") ||
    tab.includes("template") ||
    tab.includes("knowledge") ||
    tab.includes("guidelines") ||
    tab.includes("best-practices")
  ) {
    return <ResourceHubModule role={user.role} />;
  }

  // ROUTE TO MODULE 2: Validation Report & Scorecard (if view is reports)
  if (view === "reports" && ideas.length > 0) {
    return (
      <div>
        <div className="row-between no-print" style={{ marginBottom: "20px" }}>
          <div>
            <h2>Startup Validation Reports</h2>
            <p className="muted small">Comprehensive AI scorecard &amp; SWOT analysis</p>
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate("/dashboard")}>
            ← Back to Startup Table
          </button>
        </div>
        <ValidationReportModule idea={ideas[0]} />
      </div>
    );
  }

  // ROUTE TO MODULE 4: User Directory (if Admin/Superadmin on users tab)
  if (tab === "users" && ["admin", "superadmin", "moderator"].includes(user.role)) {
    return <UserManagementModule role={user.role} />;
  }

  // DEFAULT: MODULE 1: Idea / Startup Table
  return (
    <div>
      <IdeaListModule
        ideas={ideas}
        role={user.role}
        initialTab={tab}
        onDelete={handleDeleteIdea}
        onEvaluate={(idea) => setEvaluatingIdea(idea)}
      />

      {/* Shared Evaluation Modal for Mentors & Evaluators */}
      {evaluatingIdea && (
        <Modal
          isOpen={Boolean(evaluatingIdea)}
          onClose={() => setEvaluatingIdea(null)}
          title={`Evaluate Startup: ${evaluatingIdea.title}`}
          maxWidth={620}
        >
          <div style={{ marginBottom: "16px" }}>
            <span className="industry-pill">{evaluatingIdea.industry}</span>
            <p className="muted small" style={{ marginTop: "6px" }}>
              {evaluatingIdea.description}
            </p>
          </div>

          <EvaluationForm
            role={user.role}
            loading={evalSubmitting}
            onSubmit={handleSubmitEvaluation}
          />
        </Modal>
      )}
    </div>
  );
}
