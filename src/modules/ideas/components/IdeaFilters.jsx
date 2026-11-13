import React from "react";

export default function IdeaFilters({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  industryFilter,
  onIndustryChange,
  viewMode,
  onViewModeChange,
  tabs = [],
  industries = [],
}) {
  return (
    <div className="module-filter-bar">
      {/* Tabs */}
      <div className="filter-tabs-row">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`filter-tab-pill ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label} {tab.count !== undefined ? `(${tab.count})` : ""}
          </button>
        ))}
      </div>

      {/* Search, Industry Select, and View Toggle */}
      <div className="filter-controls-row">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search startup ideas, industries..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="filter-search-input"
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange("")}
            >
              ✕
            </button>
          )}
        </div>

        {industries.length > 0 && (
          <select
            value={industryFilter}
            onChange={(e) => onIndustryChange(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        )}

        {/* Table vs Grid View Toggle */}
        <div className="view-mode-toggle">
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => onViewModeChange("table")}
            title="Table View"
          >
            ☰
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => onViewModeChange("grid")}
            title="Card Grid View"
          >
            ☵
          </button>
        </div>
      </div>
    </div>
  );
}
