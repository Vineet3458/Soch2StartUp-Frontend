import React, { useState } from "react";
import {
  MentorHeader,
  MentorMetricCards,
  MentorCard,
  exportToCsv,
} from "../MentorSharedComponents.jsx";
import { Modal } from "../../../components/common/index.jsx";

const INITIAL_ASSIGNMENTS = [
  {
    id: "assign-1",
    startup: "GreenCart",
    founder: "Aarav Patel",
    stage: "Idea validation",
    lastActivity: "Today",
    priority: "High",
    status: "Active",
    email: "aarav@greencart.io",
    notes: "Conducting customer discovery interviews with 25 organic grocery stores.",
  },
  {
    id: "assign-2",
    startup: "MedRoute",
    founder: "Dr. Priya Sen",
    stage: "MVP planning",
    lastActivity: "Yesterday",
    priority: "Medium",
    status: "Active",
    email: "priya@medroute.in",
    notes: "Prioritizing telemedicine doctor scheduling workflow for MVP v1.",
  },
  {
    id: "assign-3",
    startup: "SkillBridge",
    founder: "Rohan Verma",
    stage: "Market research",
    lastActivity: "Nov 11",
    priority: "High",
    status: "Pending",
    email: "rohan@skillbridge.org",
    notes: "Awaiting mentor review of competitive pricing matrix.",
  },
  {
    id: "assign-4",
    startup: "FarmLink",
    founder: "Kavita Reddy",
    stage: "Business model",
    lastActivity: "Nov 09",
    priority: "Medium",
    status: "Active",
    email: "kavita@farmlink.ag",
    notes: "Drafted B2B supply contract unit economics with 12% margin.",
  },
  {
    id: "assign-5",
    startup: "AquaSense",
    founder: "Devendra Rao",
    stage: "Pitch readiness",
    lastActivity: "Nov 07",
    priority: "Low",
    status: "Active",
    email: "dev@aquasense.ai",
    notes: "Finalizing 10-slide seed pitch deck and financial model assumptions.",
  },
  {
    id: "assign-6",
    startup: "LocalLoop",
    founder: "Sneha Nair",
    stage: "Idea validation",
    lastActivity: "Nov 05",
    priority: "Medium",
    status: "Active",
    email: "sneha@localloop.co",
    notes: "Testing hyperlocal delivery route optimization with 5 merchants.",
  },
  {
    id: "assign-7",
    startup: "EduSpark",
    founder: "Vikram Malhotra",
    stage: "Market research",
    lastActivity: "Nov 03",
    priority: "High",
    status: "Pending",
    email: "vikram@eduspark.edu",
    notes: "Submitted user persona research survey results across 3 tier-2 colleges.",
  },
];

export default function MyAssignmentsTab() {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState(null);

  const metrics = [
    { label: "TOTAL ASSIGNMENTS", value: "12", sub: "+2 this month" },
    { label: "ACTIVE", value: "7", sub: "Currently mentoring" },
    { label: "PENDING REVIEW", value: "3", sub: "Needs your attention" },
    { label: "COMPLETED", value: "2", sub: "This quarter" },
  ];

  const filtered = assignments.filter((item) => {
    const matchesSearch =
      item.startup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.founder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === "ALL" || item.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const handleExport = () => {
    exportToCsv(
      "Mentor_My_Assignments",
      ["Startup", "Founder", "Stage", "Last Activity", "Priority", "Status"],
      filtered.map((item) => [
        item.startup,
        item.founder,
        item.stage,
        item.lastActivity,
        item.priority,
        item.status,
      ])
    );
  };

  return (
    <div className="mentor-module-root">
      <MentorHeader
        title="My Assignments"
        subtitle="Startups assigned to you for mentoring"
      />

      <MentorMetricCards cards={metrics} />

      <MentorCard
        title="Assigned startup portfolio"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter startups or founders..."
        filterValue={stageFilter}
        onFilterChange={setStageFilter}
        filterOptions={[
          { value: "ALL", label: "All Stages" },
          { value: "Idea validation", label: "Idea validation" },
          { value: "MVP planning", label: "MVP planning" },
          { value: "Market research", label: "Market research" },
          { value: "Business model", label: "Business model" },
          { value: "Pitch readiness", label: "Pitch readiness" },
        ]}
        onExport={handleExport}
      >
        <div className="mentor-table-wrapper">
          <table className="mentor-table">
            <thead>
              <tr>
                <th>STARTUP / FOUNDER</th>
                <th>STAGE</th>
                <th>LAST ACTIVITY</th>
                <th>PRIORITY</th>
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
                  <td className="mentor-cell-primary">
                    <div>{item.startup}</div>
                    <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 400 }}>
                      {item.founder}
                    </div>
                  </td>
                  <td>{item.stage}</td>
                  <td>{item.lastActivity}</td>
                  <td>
                    <span
                      className={`mentor-priority-pill mentor-priority-${item.priority.toLowerCase()}`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td>
                    <span className="mentor-text-purple">{item.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="mentor-empty-state">
                    No startups match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </MentorCard>

      {/* Startup Details Modal */}
      {selectedItem && (
        <Modal
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={`Assigned Startup: ${selectedItem.startup}`}
          maxWidth={540}
        >
          <div className="mentor-modal-body">
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Founder Contact</span>
              <span className="mentor-modal-value">
                {selectedItem.founder} ({selectedItem.email})
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Current Stage</span>
              <span className="mentor-modal-value">{selectedItem.stage}</span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Status & Priority</span>
              <span className="mentor-modal-value">
                {selectedItem.status} – {selectedItem.priority} Priority
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Mentoring Notes</span>
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
                onClick={() => {
                  alert(`Direct message sent to ${selectedItem.founder}`);
                  setSelectedItem(null);
                }}
              >
                Message Mentee
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
