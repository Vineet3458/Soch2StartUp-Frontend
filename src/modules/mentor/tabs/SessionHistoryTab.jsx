import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MentorHeader,
  MentorMetricCards,
  MentorCard,
  exportToCsv,
} from "../MentorSharedComponents.jsx";
import { Modal } from "../../../components/common/index.jsx";

const INITIAL_ARCHIVE = [
  {
    id: "hist-1",
    startup: "GreenCart",
    sessionDate: "Nov 10",
    topic: "Customer discovery",
    duration: "45 min",
    outcome: "Action plan",
    founder: "Aarav Patel",
    summary: "Reviewed findings from first batch of 10 retailer interviews. Identified high friction in inventory replenishment tracking.",
    actionItems: "Conduct 15 more interviews with kirana shop owners in South Delhi.",
  },
  {
    id: "hist-2",
    startup: "MedRoute",
    sessionDate: "Nov 06",
    topic: "MVP scope",
    duration: "60 min",
    outcome: "Feature list",
    founder: "Dr. Priya Sen",
    summary: "Finalized user journey maps for clinic booking versus home visit consultations.",
    actionItems: "Document sprint 1 user stories for developer onboarding.",
  },
  {
    id: "hist-3",
    startup: "FarmLink",
    sessionDate: "Nov 02",
    topic: "Pricing strategy",
    duration: "40 min",
    outcome: "Next steps",
    founder: "Kavita Reddy",
    summary: "Analyzed competitive farmer commission fee models. Established tiered pricing tiers.",
    actionItems: "Validate proposed 8% transaction rate with co-op leads.",
  },
  {
    id: "hist-4",
    startup: "SkillBridge",
    sessionDate: "Oct 28",
    topic: "Market sizing",
    duration: "50 min",
    outcome: "Research task",
    founder: "Rohan Verma",
    summary: "Debated bottom-up TAM modeling versus macro educational reports.",
    actionItems: "Prepare university partner interview questions.",
  },
  {
    id: "hist-5",
    startup: "AquaSense",
    sessionDate: "Oct 22",
    topic: "Pitch story",
    duration: "45 min",
    outcome: "Deck updates",
    founder: "Devendra Rao",
    summary: "Structured 3-act narrative arc: Water Scarcity → AI Sensor Solution → SaaS Traction.",
    actionItems: "Re-order slide 4 traction metrics ahead of technical architecture.",
  },
  {
    id: "hist-6",
    startup: "LocalLoop",
    sessionDate: "Oct 18",
    topic: "Unit economics",
    duration: "60 min",
    outcome: "Financial sheet",
    founder: "Sneha Nair",
    summary: "Deconstructed delivery cost per drop-off and merchant contribution margin.",
    actionItems: "Simulate surge pricing effect during peak evening rush.",
  },
  {
    id: "hist-7",
    startup: "EduSpark",
    sessionDate: "Oct 12",
    topic: "User persona",
    duration: "45 min",
    outcome: "Survey drafted",
    founder: "Vikram Malhotra",
    summary: "Identified student study habits and motivation triggers for exam prep.",
    actionItems: "Launch 100-student pilot survey on campus.",
  },
];

export default function SessionHistoryTab({ onSwitchTab = null }) {
  const navigate = useNavigate();
  const [archiveList, setArchiveList] = useState(INITIAL_ARCHIVE);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const metrics = [
    { label: "TOTAL SESSIONS", value: "28", sub: "All time" },
    { label: "COMPLETED", value: "24", sub: "86% completion" },
    { label: "CANCELLED", value: "2", sub: "Past sessions" },
    { label: "FOLLOW-UPS", value: "3", sub: "Action items open" },
  ];

  const filtered = archiveList.filter((item) =>
    item.startup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.outcome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    exportToCsv(
      "Mentor_Session_History",
      ["Startup", "Session Date", "Topic", "Duration", "Outcome"],
      filtered.map((item) => [
        item.startup,
        item.sessionDate,
        item.topic,
        item.duration,
        item.outcome,
      ])
    );
  };

  const goToSchedule = () => {
    if (onSwitchTab) {
      onSwitchTab("schedule");
    } else {
      navigate("/dashboard?tab=schedule");
    }
  };

  return (
    <div className="mentor-module-root">
      <MentorHeader
        title="Session History"
        subtitle="A record of past mentoring sessions and action items"
      />

      {/* Subnavigation Bar */}
      <div className="mentor-subnav-bar">
        <button
          type="button"
          className="mentor-subnav-btn"
          onClick={goToSchedule}
        >
          📅 Schedule Session
        </button>
        <button
          type="button"
          className="mentor-subnav-btn active"
          aria-current="page"
        >
          📜 Session History
        </button>
      </div>

      <MentorMetricCards cards={metrics} />

      <MentorCard
        title="Session archive"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter past sessions..."
        onExport={handleExport}
      >
        <div className="mentor-table-wrapper">
          <table className="mentor-table">
            <thead>
              <tr>
                <th>STARTUP</th>
                <th>SESSION DATE</th>
                <th>TOPIC</th>
                <th>DURATION</th>
                <th>OUTCOME</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedRecord(item)}
                >
                  <td className="mentor-cell-primary">{item.startup}</td>
                  <td>{item.sessionDate}</td>
                  <td>{item.topic}</td>
                  <td>{item.duration}</td>
                  <td>
                    <span className="mentor-text-purple">{item.outcome}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="mentor-empty-state">
                    No past session records match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </MentorCard>

      {/* Past Session Record Modal */}
      {selectedRecord && (
        <Modal
          isOpen={Boolean(selectedRecord)}
          onClose={() => setSelectedRecord(null)}
          title={`Session Record: ${selectedRecord.startup} (${selectedRecord.sessionDate})`}
          maxWidth={540}
        >
          <div className="mentor-modal-body">
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Founder &amp; Duration</span>
              <span className="mentor-modal-value">
                {selectedRecord.founder} – {selectedRecord.duration}
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Session Topic &amp; Focus</span>
              <span className="mentor-modal-value">{selectedRecord.topic}</span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Agreed Outcome</span>
              <span className="mentor-modal-value" style={{ color: "#4F46E5", fontWeight: 700 }}>
                {selectedRecord.outcome}
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Meeting Discussion Summary</span>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#334155", lineHeight: "1.5" }}>
                {selectedRecord.summary}
              </p>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Next Action Items</span>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#334155" }}>
                {selectedRecord.actionItems}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <button
                type="button"
                className="mentor-subnav-btn"
                style={{ border: "1px solid #E2E8F0" }}
                onClick={() => setSelectedRecord(null)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
