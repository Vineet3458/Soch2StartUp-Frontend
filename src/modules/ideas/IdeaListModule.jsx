import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import IdeaTable from "./components/IdeaTable.jsx";
import IdeaCardGrid from "./components/IdeaCardGrid.jsx";
import IdeaFilters from "./components/IdeaFilters.jsx";

export default function IdeaListModule({
  ideas = [],
  role = "entrepreneur",
  onDelete,
  onEvaluate,
  initialTab = "all",
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("table");
  const [selected, setSelected] = useState([]);

  // Extract unique industries for filter dropdown
  const industries = useMemo(() => {
    const set = new Set(ideas.map((i) => i.industry).filter(Boolean));
    return Array.from(set).sort();
  }, [ideas]);

  // Dynamic Tabs by Role
  const tabs = useMemo(() => {
    if (role === "mentor" || role === "evaluator" || role === "industry_expert") {
      return [
        { id: "all", label: "Assigned Startups", count: ideas.length },
        { id: "pending", label: "Pending Review", count: ideas.filter((i) => !i.feedback || i.feedback.length === 0).length },
        { id: "reviewed", label: "Reviewed", count: ideas.filter((i) => i.feedback && i.feedback.length > 0).length },
      ];
    }

    if (role === "admin" || role === "superadmin") {
      return [
        { id: "all", label: "All Ideas", count: ideas.length },
        { id: "go", label: "GO (High Potential)", count: ideas.filter((i) => i.report?.verdict === "GO").length },
        { id: "improve", label: "Needs Improvement", count: ideas.filter((i) => i.report?.verdict === "IMPROVE").length },
        { id: "avoid", label: "High Risk", count: ideas.filter((i) => i.report?.verdict === "AVOID").length },
      ];
    }

    if (role === "moderator") {
      return [
        { id: "all", label: "All Ideas", count: ideas.length },
        { id: "flagged", label: "Flagged / High Risk", count: ideas.filter((i) => i.report?.verdict === "AVOID").length },
        { id: "verified", label: "Approved Ideas", count: ideas.filter((i) => i.report?.verdict !== "AVOID").length },
      ];
    }

    // Default: Entrepreneur
    return [
      { id: "all", label: "All Ideas", count: ideas.length },
      { id: "validated", label: "Validated", count: ideas.filter((i) => i.report?.score !== undefined).length },
      { id: "submitted", label: "Submitted", count: ideas.length },
      { id: "drafts", label: "Drafts", count: 0 },
    ];
  }, [role, ideas]);

  // Filtered Ideas calculation
  const filteredIdeas = useMemo(() => {
    return ideas.filter((item) => {
      // 1. Search filter
      const matchesSearch =
        !searchTerm ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Industry filter
      if (industryFilter !== "ALL" && item.industry !== industryFilter) {
        return false;
      }

      // 3. Tab filter
      if (activeTab === "validated") return Boolean(item.report?.score !== undefined);
      if (activeTab === "drafts") return !item.report;
      if (activeTab === "go") return item.report?.verdict === "GO";
      if (activeTab === "improve") return item.report?.verdict === "IMPROVE";
      if (activeTab === "avoid" || activeTab === "flagged") return item.report?.verdict === "AVOID";
      if (activeTab === "verified") return item.report?.verdict !== "AVOID";
      if (activeTab === "pending") return !item.feedback || item.feedback.length === 0;
      if (activeTab === "reviewed") return item.feedback && item.feedback.length > 0;

      return true;
    });
  }, [ideas, searchTerm, industryFilter, activeTab]);

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-2)
    );

  return (
    <div className="idea-list-module-container">
      {/* Header with Title and Primary Actions */}
      <div className="module-header-row">
        <div>
          <h2 className="module-title">
            {role === "mentor"
              ? "Assigned Startups & Review Queue"
              : role === "evaluator" || role === "industry_expert"
              ? "Evaluation Tasks & Startups"
              : role === "admin" || role === "superadmin"
              ? "Platform Startup Ideas"
              : role === "moderator"
              ? "Content & Idea Moderation"
              : "My Startup Portfolio"}
          </h2>
          <p className="muted small">
            Manage, evaluate, and track startup ideas with AI validation metrics.
          </p>
        </div>

        <div className="module-actions-group">
          {role === "entrepreneur" && (
            <>
              <button
                type="button"
                className="btn btn-outline"
                disabled={selected.length !== 2}
                onClick={() => navigate(`/compare?ids=${selected.join(",")}`)}
              >
                Compare selected ({selected.length}/2)
              </button>
              <Link to="/validate" className="btn">
                + Validate New Idea
              </Link>
            </>
          )}

          {["admin", "superadmin"].includes(role) && (
            <Link to="/validate" className="btn btn-outline">
              Test New Validation →
            </Link>
          )}
        </div>
      </div>

      {/* Filters & Tabs */}
      <IdeaFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        industryFilter={industryFilter}
        onIndustryChange={setIndustryFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        tabs={tabs}
        industries={industries}
      />

      {/* Active View: Table or Grid */}
      {viewMode === "table" ? (
        <IdeaTable
          ideas={filteredIdeas}
          role={role}
          selected={selected}
          onToggleSelect={toggleSelect}
          onDelete={onDelete}
          onEvaluate={onEvaluate}
        />
      ) : (
        <IdeaCardGrid
          ideas={filteredIdeas}
          role={role}
          selected={selected}
          onToggleSelect={toggleSelect}
          onDelete={onDelete}
          onEvaluate={onEvaluate}
        />
      )}
    </div>
  );
}
