import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MentorHeader,
  MentorMetricCards,
  MentorCard,
  exportToCsv,
} from "../MentorSharedComponents.jsx";
import { Modal } from "../../../components/common/index.jsx";

const INITIAL_RESOURCES = [
  {
    id: "kb-1",
    resource: "Customer Discovery Playbook",
    category: "Validation",
    format: "Guide",
    updated: "Nov 12",
    access: "Open",
    bookmarked: true,
    summary: "The definitive 20-page tactical framework for conducting Mom Test interviews, avoiding bias, and isolating authentic problem signals.",
    keyTakeaway: "Never mention your solution until the interviewee has vividly articulated their painful status quo.",
  },
  {
    id: "kb-2",
    resource: "Lean Canvas Guide",
    category: "Business model",
    format: "Template",
    updated: "Nov 10",
    access: "Open",
    bookmarked: false,
    summary: "A step-by-step 1-page business modeling canvas designed specifically for fast iterative testing with mentors.",
    keyTakeaway: "Unfair advantage is the most commonly misunderstood box; must be impossible to copy or buy.",
  },
  {
    id: "kb-3",
    resource: "TAM/SAM/SOM Primer",
    category: "Market research",
    format: "Article",
    updated: "Nov 08",
    access: "Open",
    bookmarked: true,
    summary: "Comprehensive mathematical guide comparing top-down vs bottom-up market sizing methodologies for early-stage decks.",
    keyTakeaway: "Top-down Gartner estimates are rejected by top angels; always derive SOM via unit-economics bottom-up.",
  },
  {
    id: "kb-4",
    resource: "MVP Prioritization",
    category: "Product",
    format: "Worksheet",
    updated: "Nov 05",
    access: "Open",
    bookmarked: false,
    summary: "MoSCoW and RICE scoring matrix worksheet to help non-technical founders trim 60% of unnecessary features from release 1.0.",
    keyTakeaway: "If you are not embarrassed by the first version of your product, you’ve launched too late.",
  },
  {
    id: "kb-5",
    resource: "Pitch Story Framework",
    category: "Fundraising",
    format: "Guide",
    updated: "Oct 30",
    access: "Open",
    bookmarked: true,
    summary: "The narrative structure used by YC and Techstars alumni to pitch pre-seed and seed angel syndicates in under 3 minutes.",
    keyTakeaway: "Investors invest in lines, not dots. Highlight velocity and learning cadence above vanity numbers.",
  },
  {
    id: "kb-6",
    resource: "CAC/LTV Calculator",
    category: "Finance",
    format: "Spreadsheet",
    updated: "Oct 26",
    access: "Open",
    bookmarked: false,
    summary: "Interactive financial modeling tool to compute customer acquisition payback months and lifetime value margins.",
    keyTakeaway: "Early stage payback period must be under 12 months to avoid working capital insolvency.",
  },
  {
    id: "kb-7",
    resource: "B2B Enterprise Script",
    category: "Sales",
    format: "Document",
    updated: "Oct 20",
    access: "Open",
    bookmarked: false,
    summary: "Cold email scripts and discovery call agendas proven to achieve 35% response rates with mid-market CTOs.",
    keyTakeaway: "Sell the problem, not the product. Align with existing operational pain points.",
  },
];

export default function KnowledgeBaseTab({ onSwitchTab = null }) {
  const navigate = useNavigate();
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedResource, setSelectedResource] = useState(null);

  const metrics = [
    { label: "RESOURCES", value: "86", sub: "Curated library" },
    { label: "CATEGORIES", value: "8", sub: "Topic areas" },
    { label: "NEW THIS MONTH", value: "12", sub: "Recently added" },
    { label: "SAVED", value: "9", sub: "Your bookmarks" },
  ];

  const filtered = resources.filter((item) => {
    const matchesSearch =
      item.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.format.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleExport = () => {
    exportToCsv(
      "Mentor_Knowledge_Base",
      ["Resource", "Category", "Format", "Updated", "Access"],
      filtered.map((item) => [
        item.resource,
        item.category,
        item.format,
        item.updated,
        item.access,
      ])
    );
  };

  const toggleBookmark = (id) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, bookmarked: !r.bookmarked } : r))
    );
    if (selectedResource && selectedResource.id === id) {
      setSelectedResource((prev) => ({ ...prev, bookmarked: !prev.bookmarked }));
    }
  };

  return (
    <div className="mentor-module-root">
      <MentorHeader
        title="Knowledge Base"
        subtitle="Browse curated resources for startup mentoring"
      />

      {/* Subnavigation Bar for Resources Suite */}
      <div className="mentor-subnav-bar">
        <button
          type="button"
          className="mentor-subnav-btn active"
          aria-current="page"
        >
          📚 Knowledge Base
        </button>
        <button
          type="button"
          className="mentor-subnav-btn"
          onClick={() => (onSwitchTab ? onSwitchTab("templates") : navigate("/dashboard?tab=templates"))}
        >
          📝 Templates
        </button>
        <button
          type="button"
          className="mentor-subnav-btn"
          onClick={() => (onSwitchTab ? onSwitchTab("best-practices") : navigate("/dashboard?tab=best-practices"))}
        >
          🎯 Best Practices
        </button>
      </div>

      <MentorMetricCards cards={metrics} />

      <MentorCard
        title="Mentor resource library"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter resources or categories..."
        filterValue={categoryFilter}
        onFilterChange={setCategoryFilter}
        filterOptions={[
          { value: "ALL", label: "All Categories" },
          { value: "Validation", label: "Validation" },
          { value: "Business model", label: "Business model" },
          { value: "Market research", label: "Market research" },
          { value: "Product", label: "Product" },
          { value: "Fundraising", label: "Fundraising" },
          { value: "Finance", label: "Finance" },
          { value: "Sales", label: "Sales" },
        ]}
        onExport={handleExport}
      >
        <div className="mentor-table-wrapper">
          <table className="mentor-table">
            <thead>
              <tr>
                <th>RESOURCE</th>
                <th>CATEGORY</th>
                <th>FORMAT</th>
                <th>UPDATED</th>
                <th>ACCESS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedResource(item)}
                >
                  <td className="mentor-cell-primary">{item.resource}</td>
                  <td>{item.category}</td>
                  <td>{item.format}</td>
                  <td>{item.updated}</td>
                  <td>
                    <button
                      type="button"
                      className="mentor-action-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedResource(item);
                      }}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="mentor-empty-state">
                    No resources match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </MentorCard>

      {/* Resource Viewer Modal */}
      {selectedResource && (
        <Modal
          isOpen={Boolean(selectedResource)}
          onClose={() => setSelectedResource(null)}
          title={`Resource: ${selectedResource.resource}`}
          maxWidth={560}
        >
          <div className="mentor-modal-body">
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Category &amp; Format</span>
              <span className="mentor-modal-value">
                {selectedResource.category} • {selectedResource.format} (Updated {selectedResource.updated})
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Overview &amp; Executive Summary</span>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#334155", lineHeight: "1.6" }}>
                {selectedResource.summary}
              </p>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Core Mentoring Takeaway</span>
              <div
                style={{
                  padding: "10px 14px",
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  borderRadius: "8px",
                  fontSize: "13.5px",
                  color: "#166534",
                  fontWeight: 500,
                }}
              >
                💡 {selectedResource.keyTakeaway}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
              <button
                type="button"
                className="mentor-subnav-btn"
                style={{
                  border: "1px solid #E2E8F0",
                  color: selectedResource.bookmarked ? "#EAB308" : "#64748B",
                }}
                onClick={() => toggleBookmark(selectedResource.id)}
              >
                {selectedResource.bookmarked ? "★ Bookmarked" : "☆ Save Bookmark"}
              </button>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="mentor-subnav-btn"
                  style={{ border: "1px solid #E2E8F0" }}
                  onClick={() => setSelectedResource(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="mentor-btn-primary"
                  onClick={() => {
                    alert(`Opened full ${selectedResource.format} document for ${selectedResource.resource}!`);
                  }}
                >
                  Download Asset
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
