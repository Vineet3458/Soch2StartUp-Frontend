import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api, { errMsg } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import AnalyticsModule from "../modules/analytics/AnalyticsModule.jsx";
import UserManagementModule from "../modules/users/UserManagementModule.jsx";
import IdeaListModule from "../modules/ideas/IdeaListModule.jsx";
import ResourceHubModule from "../modules/resources/ResourceHubModule.jsx";

export default function AdminPanel() {
  const { user: me } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "analytics";

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/ideas")
      .then((res) => setIdeas(res.data))
      .catch((err) => console.error("Error loading admin ideas:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteIdea = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this startup idea?")) return;
    try {
      await api.delete(`/admin/ideas/${id}`);
      setIdeas((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert(errMsg(err));
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-panel-module-root">
      {/* Module Selector Sub-Navigation */}
      <div className="admin-nav-tabs-bar" style={{ marginBottom: "24px" }}>
        <button
          type="button"
          className={`filter-tab-pill ${tab === "analytics" || tab === "overview" ? "active" : ""}`}
          onClick={() => setSearchParams({ tab: "analytics" })}
        >
          📊 Analytics &amp; Reports
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${tab === "users" || tab === "roles" || tab === "pending" || tab === "blocked" ? "active" : ""}`}
          onClick={() => setSearchParams({ tab: "users" })}
        >
          👥 User Directory &amp; Permissions
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${tab === "ideas" || tab === "review" || tab === "approved" || tab === "rejected" || tab === "reports" ? "active" : ""}`}
          onClick={() => setSearchParams({ tab: "ideas" })}
        >
          💡 Platform Startup Ideas ({ideas.length})
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${tab === "guidelines" || tab === "announcements" || tab === "library" || tab === "templates" ? "active" : ""}`}
          onClick={() => setSearchParams({ tab: "guidelines" })}
        >
          📚 Content &amp; Resource Hub
        </button>
      </div>

      {/* 1. Analytics & Quality Insights Module */}
      {(tab === "analytics" || tab === "overview") && (
        <AnalyticsModule role={me.role} ideas={ideas} />
      )}

      {/* 2. User & Directory Management Module */}
      {(tab === "users" || tab === "roles" || tab === "pending" || tab === "blocked") && (
        <UserManagementModule role={me.role} />
      )}

      {/* 3. Idea / Startup Table Module */}
      {(tab === "ideas" || tab === "review" || tab === "approved" || tab === "rejected" || tab === "reports") && (
        <IdeaListModule
          ideas={ideas}
          role={me.role}
          onDelete={handleDeleteIdea}
        />
      )}

      {/* 4. Knowledge & Resource Hub Module */}
      {(tab === "guidelines" || tab === "announcements" || tab === "library" || tab === "templates") && (
        <ResourceHubModule role={me.role} />
      )}
    </div>
  );
}
