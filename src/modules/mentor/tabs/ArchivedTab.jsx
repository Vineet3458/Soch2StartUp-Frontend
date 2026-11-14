import React, { useState } from "react";
import {
  MentorHeader,
  MentorMetricCards,
  MentorCard,
  exportToCsv,
} from "../MentorSharedComponents.jsx";
import { Modal } from "../../../components/common/index.jsx";

const INITIAL_ARCHIVED = [
  {
    id: "arch-1",
    startup: "ByteBloom",
    archivedDate: "Oct 21",
    reason: "Founder paused",
    lastStage: "MVP planning",
    founder: "Kunal Shah",
    documentsCount: 4,
    notes: "Founder paused development to pursue full-time graduate degree. Reopen pending for Spring cohort.",
  },
  {
    id: "arch-2",
    startup: "WellNest",
    archivedDate: "Sep 18",
    reason: "Program ended",
    lastStage: "Validation",
    founder: "Nisha Singhania",
    documentsCount: 5,
    notes: "Cohort 12 concluded. Team transitioned to independent alumni advisory network.",
  },
  {
    id: "arch-3",
    startup: "CraftCloud",
    archivedDate: "Aug 30",
    reason: "No response",
    lastStage: "Idea review",
    founder: "Arjun Rampal",
    documentsCount: 2,
    notes: "Inactive for over 45 days after initial onboarding session. Auto-archived per platform policy.",
  },
  {
    id: "arch-4",
    startup: "UrbanSprout",
    archivedDate: "Aug 12",
    reason: "Completed cohort",
    lastStage: "Market fit",
    founder: "Ritika Goyal",
    documentsCount: 3,
    notes: "Completed standard 12-week incubation mentorship milestone package successfully.",
  },
  {
    id: "arch-5",
    startup: "NovaLearn",
    archivedDate: "Jul 26",
    reason: "Founder withdrew",
    lastStage: "Research",
    founder: "Sameer Saxena",
    documentsCount: 2,
    notes: "Pivoted domain from EdTech to Crypto gaming; withdrew from current incubation track.",
  },
];

export default function ArchivedTab() {
  const [archivedList, setArchivedList] = useState(INITIAL_ARCHIVED);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const metrics = [
    { label: "ARCHIVED", value: "4", sub: "Historical records" },
    { label: "REOPEN REQUESTS", value: "1", sub: "Awaiting decision" },
    { label: "LAST ARCHIVED", value: "Oct 21", sub: "Most recent" },
    { label: "DOCUMENTS", value: "16", sub: "Saved resources" },
  ];

  const filtered = archivedList.filter((item) =>
    item.startup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lastStage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    exportToCsv(
      "Mentor_Archived_Portfolio",
      ["Startup", "Archived Date", "Reason", "Last Stage"],
      filtered.map((item) => [
        item.startup,
        item.archivedDate,
        item.reason,
        item.lastStage,
      ])
    );
  };

  const handleReactivate = (id) => {
    const item = archivedList.find((i) => i.id === id);
    if (!item) return;
    alert(`Reopening request initiated for ${item.startup}! Sent to platform admin.`);
    setSelectedItem(null);
  };

  return (
    <div className="mentor-module-root">
      <MentorHeader
        title="Archived"
        subtitle="Past or inactive mentoring assignments"
      />

      <MentorMetricCards cards={metrics} />

      <MentorCard
        title="Archived portfolio"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter archived startups..."
        onExport={handleExport}
      >
        <div className="mentor-table-wrapper">
          <table className="mentor-table">
            <thead>
              <tr>
                <th>STARTUP</th>
                <th>ARCHIVED DATE</th>
                <th>REASON</th>
                <th>LAST STAGE</th>
                <th>ACTION</th>
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
                  <td>{item.archivedDate}</td>
                  <td>{item.reason}</td>
                  <td>{item.lastStage}</td>
                  <td>
                    <button
                      type="button"
                      className="mentor-action-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="mentor-empty-state">
                    No archived records match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </MentorCard>

      {/* Archived Details Modal */}
      {selectedItem && (
        <Modal
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={`Archived Record: ${selectedItem.startup}`}
          maxWidth={540}
        >
          <div className="mentor-modal-body">
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Founder &amp; Archived Date</span>
              <span className="mentor-modal-value">
                {selectedItem.founder} – Archived on {selectedItem.archivedDate}
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Archive Reason</span>
              <span className="mentor-modal-value">{selectedItem.reason}</span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Last Recorded Stage</span>
              <span className="mentor-modal-value">{selectedItem.lastStage}</span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Stored Documents</span>
              <span className="mentor-modal-value">
                {selectedItem.documentsCount} documents preserved in cloud archive
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Historical Notes</span>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#334155" }}>
                {selectedItem.notes}
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
              <button
                type="button"
                className="mentor-btn-primary"
                onClick={() => handleReactivate(selectedItem.id)}
              >
                Request Reopen
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
