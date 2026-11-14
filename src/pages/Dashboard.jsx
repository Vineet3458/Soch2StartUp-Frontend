import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import api, { errMsg } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import { Modal } from "../components/common/index.jsx";

// 6 Dedicated Independent Role Dashboard Modules
import {
  EntrepreneurDashboard,
  AdminDashboard,
  SuperadminDashboard,
  MentorDashboard,
  EvaluatorDashboard,
  ModeratorDashboard,
} from "../modules/dashboards/index.js";

// 11 Dedicated Mentor Role Modules matching UI Screenshots
import {
  MyAssignmentsTab,
  InProgressTab,
  CompletedTab,
  ArchivedTab,
  ScheduleSessionTab,
  SessionHistoryTab,
  ProvideGuidanceTab,
  MyFeedbackTab,
  KnowledgeBaseTab,
  TemplatesTab,
  BestPracticesTab,
} from "../modules/mentor/index.js";

// 7 Consolidated Common React Modules
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
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const tab = searchParams.get("tab");
  const view = searchParams.get("view");
  const roleParam = searchParams.get("role");
  const isMentorPath = location.pathname.startsWith("/mentor");

  // Effective role: checks URL role param, /mentor route, or falls back to authenticated role
  const effectiveRole = roleParam || (isMentorPath ? "mentor" : null) || user?.role || "entrepreneur";

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

  // 1. ROUTE TO MODULE 7: Account Utilities (Notifications, Profile, Settings)
  if (view === "notifications" || view === "profile" || view === "settings") {
    return <AccountShellModule defaultView={view} />;
  }

  // MENTOR ROLE MODULE ROUTING (100% Matches 11 UI Screens in Reference PDF)
  if (effectiveRole === "mentor") {
    const roleQuery = roleParam ? `&role=${roleParam}` : (isMentorPath ? "&role=mentor" : "");
    const switchTab = (nextTab) => {
      navigate(`/dashboard?tab=${nextTab}${roleQuery}`);
    };

    if (tab === "assignments" || tab === "my-assignments" || (tab === "all" && !view)) {
      return <MyAssignmentsTab />;
    }
    if (tab === "in-progress" || tab === "progress") {
      return <InProgressTab />;
    }
    if (tab === "completed") {
      return <CompletedTab />;
    }
    if (tab === "archived") {
      return <ArchivedTab />;
    }
    if (tab === "schedule" || tab === "schedule-session" || tab === "sessions") {
      return <ScheduleSessionTab onSwitchTab={switchTab} />;
    }
    if (tab === "history" || tab === "session-history") {
      return <SessionHistoryTab onSwitchTab={switchTab} />;
    }
    if (tab === "guidance" || tab === "provide-guidance" || tab === "submitted") {
      return <ProvideGuidanceTab />;
    }
    if (tab === "my-feedback" || tab === "feedback") {
      return <MyFeedbackTab />;
    }
    if (tab === "templates" || view === "templates") {
      return <TemplatesTab onSwitchTab={switchTab} />;
    }
    if (tab === "best-practices" || view === "best-practices" || view === "playbooks") {
      return <BestPracticesTab onSwitchTab={switchTab} />;
    }
    if (
      tab === "knowledge" ||
      tab === "knowledge-base" ||
      view === "knowledge" ||
      view === "saved"
    ) {
      return <KnowledgeBaseTab onSwitchTab={switchTab} />;
    }
  }

  // 2. ROUTE TO MODULE 5: Analytics & Quality Insights
  if (view === "market" || view === "analytics" || tab === "analytics" || tab === "quality") {
    return <AnalyticsModule role={effectiveRole} ideas={ideas} />;
  }

  // 3. ROUTE TO MODULE 6: Knowledge & Resource Hub
  if (
    view === "saved" ||
    view === "plan" ||
    view === "roadmap" ||
    view === "guidelines" ||
    (tab && (
      tab.includes("resource") ||
      tab.includes("template") ||
      tab.includes("knowledge") ||
      tab.includes("guidelines") ||
      tab.includes("best-practices")
    ))
  ) {
    return <ResourceHubModule role={effectiveRole} />;
  }

  // 4. ROUTE TO MODULE 2: Validation Report & Scorecard
  if (view === "reports") {
    const targetIdea = ideas.length > 0 ? ideas[0] : null;
    return (
      <div className="fv-subview-wrapper">
        <div className="fv-subview-header">
          <div>
            <h2 className="fv-subview-title">Startup Validation Reports</h2>
            <p className="fv-subview-subtitle">Comprehensive AI scorecard &amp; SWOT analysis</p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Overview
          </button>
        </div>
        {targetIdea ? (
          <ValidationReportModule idea={targetIdea} />
        ) : (
          <div className="card center" style={{ padding: "40px" }}>
            <p className="muted">No validated ideas submitted yet.</p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: "12px" }}
              onClick={() => navigate("/validate")}
            >
              + Submit Idea for Validation
            </button>
          </div>
        )}
      </div>
    );
  }

  // 5. ROUTE TO MODULE 4: User Directory (if Admin/Superadmin/Moderator on users tab)
  if (tab === "users" && ["admin", "superadmin", "moderator"].includes(effectiveRole)) {
    return (
      <div className="fv-subview-wrapper">
        <div className="fv-subview-header">
          <div>
            <h2 className="fv-subview-title">User &amp; Directory Management</h2>
            <p className="fv-subview-subtitle">Platform accounts, roles, and status control</p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Overview
          </button>
        </div>
        <UserManagementModule role={effectiveRole} />
      </div>
    );
  }

  // 6. ROUTE TO MODULE 1: Idea / Startup Table (if explicitly requested via view or specific tab)
  const isSpecificTab = Boolean(tab && tab !== "all");
  const isTableView = view === "ideas-table" || searchParams.get("view") === "table" || isSpecificTab;

  if (isTableView) {
    return (
      <div className="fv-subview-wrapper">
        <div className="fv-subview-header">
          <div>
            <h2 className="fv-subview-title">Startup Ideas &amp; Submissions</h2>
            <p className="fv-subview-subtitle">Review, track and filter startup pipelines</p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Overview
          </button>
        </div>

        <IdeaListModule
          ideas={ideas}
          role={effectiveRole}
          initialTab={tab || "all"}
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
              role={effectiveRole}
              loading={evalSubmitting}
              onSubmit={handleSubmitEvaluation}
            />
          </Modal>
        )}
      </div>
    );
  }

  // 7. DEFAULT: ROLE-BASED DEDICATED DASHBOARD MODULE
  const renderRoleDashboard = () => {
    switch (effectiveRole) {
      case "admin":
        return (
          <AdminDashboard
            ideas={ideas}
            onViewAll={() => navigate("/admin?tab=ideas")}
          />
        );

      case "superadmin":
        return (
          <SuperadminDashboard
            ideas={ideas}
            onViewAll={() => navigate("/admin?tab=overview")}
          />
        );

      case "mentor": {
        const mentorRoleQuery = roleParam ? `&role=${roleParam}` : (isMentorPath ? "&role=mentor" : "");
        return (
          <MentorDashboard
            ideas={ideas}
            onViewAll={() => navigate(`/dashboard?tab=assignments${mentorRoleQuery}`)}
            onEvaluate={(idea) => setEvaluatingIdea(idea)}
          />
        );
      }

      case "industry_expert":
      case "evaluator":
        return (
          <EvaluatorDashboard
            ideas={ideas}
            onViewAll={() => navigate("/dashboard?tab=submitted")}
            onEvaluate={(idea) => setEvaluatingIdea(idea)}
          />
        );

      case "moderator":
        return (
          <ModeratorDashboard
            ideas={ideas}
            onViewAll={() => navigate("/dashboard?tab=flagged")}
          />
        );

      case "entrepreneur":
      default:
        return (
          <EntrepreneurDashboard
            ideas={ideas}
            onViewAll={() => navigate("/dashboard?tab=all")}
          />
        );
    }
  };

  return (
    <div className="dashboard-content-pane">
      {renderRoleDashboard()}

      {/* Shared Evaluation Modal if triggered from role dashboards */}
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
            role={effectiveRole}
            loading={evalSubmitting}
            onSubmit={handleSubmitEvaluation}
          />
        </Modal>
      )}
    </div>
  );
}
