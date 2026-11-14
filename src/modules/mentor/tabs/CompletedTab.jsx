import React, { useState } from "react";
import {
  MentorHeader,
  MentorMetricCards,
  MentorCard,
  exportToCsv,
} from "../MentorSharedComponents.jsx";
import { Modal } from "../../../components/common/index.jsx";

const INITIAL_COMPLETED = [
  {
    id: "comp-1",
    startup: "LocalLoop",
    focusArea: "Business model",
    completedOn: "Nov 08",
    outcome: "Validation ready",
    duration: "5 weeks",
    founder: "Sneha Nair",
    learnings: "Achieved strong product-market fit indicator with 65% repeat weekly order rate in pilot cluster.",
    signoffStatus: "Approved for Seed Stage Incubator",
  },
  {
    id: "comp-2",
    startup: "EduSpark",
    focusArea: "Market research",
    completedOn: "Oct 29",
    outcome: "Research complete",
    duration: "6 weeks",
    founder: "Vikram Malhotra",
    learnings: "Verified customer willingness-to-pay of INR 499/mo across 1,200 survey responses.",
    signoffStatus: "Validated – Proceeding to Product Prototyping",
  },
  {
    id: "comp-3",
    startup: "CareNest",
    focusArea: "MVP planning",
    completedOn: "Oct 15",
    outcome: "MVP scoped",
    duration: "7 weeks",
    founder: "Ananya Deshmukh",
    learnings: "Streamlined caregiver onboarding workflow down to 4 minutes with automated verification.",
    signoffStatus: "Scoped – Beta Launching Q1",
  },
  {
    id: "comp-4",
    startup: "ReFarm",
    focusArea: "Pitch readiness",
    completedOn: "Sep 30",
    outcome: "Pitch reviewed",
    duration: "4 weeks",
    founder: "Suresh Joshi",
    learnings: "Mastered storytelling arc; deck approved for angel syndicate pitch day.",
    signoffStatus: "Investor Ready",
  },
  {
    id: "comp-5",
    startup: "TripMint",
    focusArea: "Go-to-market",
    completedOn: "Sep 12",
    outcome: "Action plan set",
    duration: "8 weeks",
    founder: "Tara Kapoor",
    learnings: "Constructed low-cost micro-influencer acquisition pipeline targeting travel vloggers.",
    signoffStatus: "Graduated with Honors",
  },
  {
    id: "comp-6",
    startup: "FinPulse",
    focusArea: "Financial model",
    completedOn: "Aug 22",
    outcome: "Model verified",
    duration: "6 weeks",
    founder: "Raghav Mehra",
    learnings: "Demonstrated 18-month cash runway resilience under stress-tested churn scenarios.",
    signoffStatus: "Financial Model Audited",
  },
  {
    id: "comp-7",
    startup: "UrbanLogiq",
    focusArea: "Unit economics",
    completedOn: "Jul 19",
    outcome: "Scaled profitably",
    duration: "9 weeks",
    founder: "Karan Johar",
    learnings: "Optimized logistics dead-head miles by 22% using shared fleet agreements.",
    signoffStatus: "Series A Ready",
  },
  {
    id: "comp-8",
    startup: "SafeRide",
    focusArea: "Safety compliance",
    completedOn: "Jun 14",
    outcome: "Certified",
    duration: "5 weeks",
    founder: "Simran Kaur",
    learnings: "Passed third-party background verification safety compliance certification.",
    signoffStatus: "Fully Compliant",
  },
];

export default function CompletedTab() {
  const [completedList, setCompletedList] = useState(INITIAL_COMPLETED);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const metrics = [
    { label: "COMPLETED", value: "8", sub: "All time" },
    { label: "THIS QUARTER", value: "2", sub: "+1 this month" },
    { label: "AVG. DURATION", value: "6 weeks", sub: "Per assignment" },
    { label: "FOLLOW-UP OPEN", value: "1", sub: "Post-mentoring" },
  ];

  const filtered = completedList.filter((item) =>
    item.startup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.focusArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.outcome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    exportToCsv(
      "Mentor_Completed_Assignments",
      ["Startup", "Focus Area", "Completed On", "Outcome", "Duration"],
      filtered.map((item) => [
        item.startup,
        item.focusArea,
        item.completedOn,
        item.outcome,
        item.duration,
      ])
    );
  };

  return (
    <div className="mentor-module-root">
      <MentorHeader
        title="Completed"
        subtitle="Review completed mentorship assignments and outcomes"
      />

      <MentorMetricCards cards={metrics} />

      <MentorCard
        title="Completed assignments"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter completed assignments..."
        onExport={handleExport}
      >
        <div className="mentor-table-wrapper">
          <table className="mentor-table">
            <thead>
              <tr>
                <th>STARTUP</th>
                <th>FOCUS AREA</th>
                <th>COMPLETED ON</th>
                <th>OUTCOME</th>
                <th>REPORT</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedReport(item)}
                >
                  <td className="mentor-cell-primary">{item.startup}</td>
                  <td>{item.focusArea}</td>
                  <td>{item.completedOn}</td>
                  <td>{item.outcome}</td>
                  <td>
                    <button
                      type="button"
                      className="mentor-action-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(item);
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
                    No completed assignments match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </MentorCard>

      {/* Assignment Completion Report Modal */}
      {selectedReport && (
        <Modal
          isOpen={Boolean(selectedReport)}
          onClose={() => setSelectedReport(null)}
          title={`Mentorship Completion Report: ${selectedReport.startup}`}
          maxWidth={580}
        >
          <div className="mentor-modal-body">
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Founder &amp; Duration</span>
              <span className="mentor-modal-value">
                {selectedReport.founder} – {selectedReport.duration} (Completed on {selectedReport.completedOn})
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Primary Focus Area</span>
              <span className="mentor-modal-value">{selectedReport.focusArea}</span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Final Outcome</span>
              <span className="mentor-modal-value" style={{ color: "#16A34A", fontWeight: 700 }}>
                {selectedReport.outcome}
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Mentor Sign-off Status</span>
              <span className="mentor-modal-value">{selectedReport.signoffStatus}</span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Key Milestones &amp; Learnings</span>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#334155", lineHeight: "1.6" }}>
                {selectedReport.learnings}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
              <button
                type="button"
                className="mentor-subnav-btn"
                style={{ border: "1px solid #E2E8F0" }}
                onClick={() => setSelectedReport(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="mentor-btn-primary"
                onClick={() => {
                  alert(`Downloaded PDF Report for ${selectedReport.startup}`);
                  setSelectedReport(null);
                }}
              >
                Download PDF Report
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
