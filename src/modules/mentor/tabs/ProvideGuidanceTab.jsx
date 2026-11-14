import React, { useState } from "react";
import {
  MentorHeader,
  MentorMetricCards,
  MentorCard,
  exportToCsv,
} from "../MentorSharedComponents.jsx";
import { Modal } from "../../../components/common/index.jsx";

const INITIAL_GUIDANCE = [
  {
    id: "guide-1",
    startup: "GreenCart",
    guidanceTopic: "Customer interviews",
    sharedOn: "Nov 12",
    founderResponse: "Viewed",
    status: "Published",
    founder: "Aarav Patel",
    advice: "Do not ask prospective customers if they 'would like' an app. Ask them how they handled grocery restocking last Tuesday. Focus strictly on past behavior.",
  },
  {
    id: "guide-2",
    startup: "MedRoute",
    guidanceTopic: "MVP prioritization",
    sharedOn: "Nov 09",
    founderResponse: "Acknowledged",
    status: "Published",
    founder: "Dr. Priya Sen",
    advice: "Cut the AI diagnosis symptom checker from V1. Build manual WhatsApp doctor scheduling first to prove baseline conversion without heavy backend overhead.",
  },
  {
    id: "guide-3",
    startup: "FarmLink",
    guidanceTopic: "Pricing model",
    sharedOn: "Nov 08",
    founderResponse: "Not yet",
    status: "Follow-up",
    founder: "Kavita Reddy",
    advice: "Shift from flat monthly subscription to a 5% commission on finalized wholesale crate deliveries. Rural farmers resist upfront SaaS software costs.",
  },
  {
    id: "guide-4",
    startup: "SkillBridge",
    guidanceTopic: "Market sizing",
    sharedOn: "Nov 05",
    founderResponse: "Viewed",
    status: "Published",
    founder: "Rohan Verma",
    advice: "Re-calculate serviceable obtainable market (SOM) considering only engineering colleges in NCR for year one. 100% India TAM is unrealistic for seed rounds.",
  },
  {
    id: "guide-5",
    startup: "AquaSense",
    guidanceTopic: "Pitch narrative",
    sharedOn: "Nov 02",
    founderResponse: "Acknowledged",
    status: "Published",
    founder: "Devendra Rao",
    advice: "Lead slide 2 with real rupee loss caused by pipe leaks in manufacturing plants. Commercial B2B buyers care about immediate ROI, not generic ESG platitudes.",
  },
  {
    id: "guide-6",
    startup: "LocalLoop",
    guidanceTopic: "Traction metrics",
    sharedOn: "Oct 28",
    founderResponse: "Acknowledged",
    status: "Published",
    founder: "Sneha Nair",
    advice: "Track 30-day cohort retention religiously. If day-14 retention is under 20%, do not increase marketing ad spend.",
  },
  {
    id: "guide-7",
    startup: "CareNest",
    guidanceTopic: "Retention funnel",
    sharedOn: "Oct 22",
    founderResponse: "Viewed",
    status: "Published",
    founder: "Ananya Deshmukh",
    advice: "Incorporate weekly nurse check-in push notifications to maintain continuous engagement with families.",
  },
];

export default function ProvideGuidanceTab() {
  const [guidanceList, setGuidanceList] = useState(INITIAL_GUIDANCE);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for creating guidance
  const [formStartup, setFormStartup] = useState("GreenCart");
  const [formTopic, setFormTopic] = useState("");
  const [formAdvice, setFormAdvice] = useState("");

  const metrics = [
    { label: "GUIDANCE SHARED", value: "19", sub: "All time" },
    { label: "DRAFTS", value: "2", sub: "Unpublished" },
    { label: "ACKNOWLEDGED", value: "15", sub: "Founder viewed" },
    { label: "FOLLOW-UP DUE", value: "3", sub: "Check progress" },
  ];

  const filtered = guidanceList.filter((item) => {
    const matchesSearch =
      item.startup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.guidanceTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.founderResponse.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    exportToCsv(
      "Mentor_Guidance_Activity",
      ["Startup", "Guidance Topic", "Shared On", "Founder Response", "Status"],
      filtered.map((item) => [
        item.startup,
        item.guidanceTopic,
        item.sharedOn,
        item.founderResponse,
        item.status,
      ])
    );
  };

  const handleCreateGuidance = (e) => {
    e.preventDefault();
    if (!formTopic.trim() || !formAdvice.trim()) return;

    const newGuidance = {
      id: `guide-${Date.now()}`,
      startup: formStartup,
      guidanceTopic: formTopic,
      sharedOn: "Today",
      founderResponse: "Not yet",
      status: "Published",
      founder: "Assigned Founder",
      advice: formAdvice,
    };

    setGuidanceList([newGuidance, ...guidanceList]);
    setShowCreateModal(false);
    setFormTopic("");
    setFormAdvice("");
    alert(`Guidance published and shared with ${formStartup}!`);
  };

  return (
    <div className="mentor-module-root">
      <MentorHeader
        title="Provide Guidance"
        subtitle="Share structured recommendations with assigned founders"
      />

      <MentorMetricCards cards={metrics} />

      <MentorCard
        title="Guidance activity"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter guidance topics..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { value: "ALL", label: "All Statuses" },
          { value: "Published", label: "Published" },
          { value: "Follow-up", label: "Follow-up" },
        ]}
        onExport={handleExport}
        actionBtn={
          <button
            type="button"
            className="mentor-btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            + Provide Guidance
          </button>
        }
      >
        <div className="mentor-table-wrapper">
          <table className="mentor-table">
            <thead>
              <tr>
                <th>STARTUP</th>
                <th>GUIDANCE TOPIC</th>
                <th>SHARED ON</th>
                <th>FOUNDER RESPONSE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedItem(item)}
                >
                  <td className="mentor-cell-primary">{item.startup}</td>
                  <td>{item.guidanceTopic}</td>
                  <td>{item.sharedOn}</td>
                  <td>{item.founderResponse}</td>
                  <td>
                    <span
                      className={
                        item.status === "Published"
                          ? "mentor-text-purple"
                          : "mentor-priority-medium"
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="mentor-empty-state">
                    No guidance records match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </MentorCard>

      {/* View Guidance Details Modal */}
      {selectedItem && (
        <Modal
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={`Guidance: ${selectedItem.startup} – ${selectedItem.guidanceTopic}`}
          maxWidth={540}
        >
          <div className="mentor-modal-body">
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Shared With &amp; Date</span>
              <span className="mentor-modal-value">
                {selectedItem.founder} ({selectedItem.startup}) on {selectedItem.sharedOn}
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Response Status</span>
              <span className="mentor-modal-value">
                Founder Status: <strong>{selectedItem.founderResponse}</strong> | Record: {selectedItem.status}
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Advisory Recommendation</span>
              <p style={{ margin: 0, fontSize: "14px", color: "#1E293B", lineHeight: "1.6" }}>
                {selectedItem.advice}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
              <button
                type="button"
                className="mentor-subnav-btn"
                style={{ border: "1px solid #E2E8F0" }}
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>
              {selectedItem.status === "Follow-up" && (
                <button
                  type="button"
                  className="mentor-btn-primary"
                  onClick={() => {
                    alert(`Follow-up reminder pinged to ${selectedItem.founder}!`);
                    setSelectedItem(null);
                  }}
                >
                  Send Follow-up Ping
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Compose New Guidance Note Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Share Mentorship Guidance Note"
          maxWidth={560}
        >
          <form onSubmit={handleCreateGuidance} className="mentor-modal-body">
            <div className="mentor-modal-field">
              <label className="mentor-modal-label">Select Mentee Startup</label>
              <select
                className="mentor-filter-select"
                style={{ width: "100%", padding: "10px" }}
                value={formStartup}
                onChange={(e) => setFormStartup(e.target.value)}
              >
                <option value="GreenCart">GreenCart (Aarav Patel)</option>
                <option value="MedRoute">MedRoute (Dr. Priya Sen)</option>
                <option value="FarmLink">FarmLink (Kavita Reddy)</option>
                <option value="SkillBridge">SkillBridge (Rohan Verma)</option>
                <option value="AquaSense">AquaSense (Devendra Rao)</option>
                <option value="LocalLoop">LocalLoop (Sneha Nair)</option>
                <option value="EduSpark">EduSpark (Vikram Malhotra)</option>
              </select>
            </div>

            <div className="mentor-modal-field">
              <label className="mentor-modal-label">Guidance Topic</label>
              <input
                type="text"
                className="mentor-search-input"
                style={{ width: "100%" }}
                placeholder="e.g. Unit Economics, Customer Interview Protocol, Pitch Deck"
                value={formTopic}
                onChange={(e) => setFormTopic(e.target.value)}
                required
              />
            </div>

            <div className="mentor-modal-field">
              <label className="mentor-modal-label">Structured Strategic Advice</label>
              <textarea
                className="mentor-modal-textarea"
                rows={4}
                placeholder="Formulate specific, actionable feedback and tactical steps for the founder to execute..."
                value={formAdvice}
                onChange={(e) => setFormAdvice(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
              <button
                type="button"
                className="mentor-subnav-btn"
                style={{ border: "1px solid #E2E8F0" }}
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="mentor-btn-primary">
                Publish Guidance
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
