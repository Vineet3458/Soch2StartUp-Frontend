import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MentorHeader,
  MentorMetricCards,
  MentorCard,
  exportToCsv,
} from "../MentorSharedComponents.jsx";
import { Modal } from "../../../components/common/index.jsx";

const INITIAL_PRACTICES = [
  {
    id: "bp-1",
    practice: "Ask before advising",
    topic: "Founder communication",
    level: "Core",
    readTime: "4 min",
    bookmarked: true,
    principle: "Always ask leading diagnostic questions before dispensing strategic solutions. The founder must discover the insight themselves to build genuine conviction.",
    tacticalChecklist: [
      "Ask: 'What data led you to this conclusion?' before critiquing their roadmap.",
      "Listen 70% of the session; advise 30%.",
      "Avoid saying 'You should...'; instead say 'Have you considered how X behaves when Y happens?'",
    ],
  },
  {
    id: "bp-2",
    practice: "Validate problems first",
    topic: "Idea validation",
    level: "Core",
    readTime: "6 min",
    bookmarked: true,
    principle: "Entrepreneurs fall in love with their technology or product solution rather than the customer's problem. Enforce rigorous problem validation before any coding.",
    tacticalChecklist: [
      "Demand proof of active, painful workarounds customers are currently paying for.",
      "Reject hypothetical willingness-to-pay statements.",
      "Verify minimum 20 user interviews before approving MVP engineering sprints.",
    ],
  },
  {
    id: "bp-3",
    practice: "Use milestone-based goals",
    topic: "Execution",
    level: "Advanced",
    readTime: "5 min",
    bookmarked: false,
    principle: "Vague mentoring produces vague results. Structure every mentoring relationship around 3 high-impact, non-negotiable milestones tied to dates.",
    tacticalChecklist: [
      "Keep milestone windows under 21 days to preserve momentum.",
      "Define binary outcomes: Pass or Fail, no intermediate ambiguity.",
      "Review past milestone completion within first 5 minutes of each session.",
    ],
  },
  {
    id: "bp-4",
    practice: "Give evidence-led feedback",
    topic: "Feedback",
    level: "Core",
    readTime: "3 min",
    bookmarked: false,
    principle: "Never base mentoring recommendations on subjective personal taste or outdated historical anecdotes. Ground every critique in observable market metrics.",
    tacticalChecklist: [
      "Reference benchmark conversion rates for the founder's specific industry vertical.",
      "Separate objective facts from mentor intuition clearly.",
      "Document written takeaways immediately after each session.",
    ],
  },
  {
    id: "bp-5",
    practice: "Encourage small experiments",
    topic: "MVP strategy",
    level: "Advanced",
    readTime: "7 min",
    bookmarked: true,
    principle: "Reduce the cycle time of learning. Coach founders to run cheap 48-hour smoke tests rather than 6-month product development cycles.",
    tacticalChecklist: [
      "Use fake-door landing pages or concierge manual delivery to test demand first.",
      "Cap testing budget per experiment to INR 5,000 / $100.",
      "Measure conversion velocity rather than vanity signups.",
    ],
  },
  {
    id: "bp-6",
    practice: "Establish safe candor",
    topic: "Mentorship culture",
    level: "Core",
    readTime: "5 min",
    bookmarked: false,
    principle: "Founders often mask reality out of fear of disappointing mentors or investors. Cultivate radical transparency and psychological safety.",
    tacticalChecklist: [
      "Acknowledge early that 80% of hypotheses fail; that failure is data.",
      "Never scold or reprimand bad news; celebrate swift discovery of truth.",
      "Keep mentor-mentee discussions strictly confidential.",
    ],
  },
  {
    id: "bp-7",
    practice: "Deconstruct unit economics",
    topic: "Financial discipline",
    level: "Advanced",
    readTime: "8 min",
    bookmarked: true,
    principle: "Growth on broken unit economics accelerates bankruptcy. Ensure contribution margin 1 and 2 are positive before scaling acquisition.",
    tacticalChecklist: [
      "Include payment gateway fees, refunds, and return shipping in COGS.",
      "Target LTV/CAC ratio > 3.0 within 12-month cohorts.",
      "Stress test gross margins against 15% inflation in supplier rates.",
    ],
  },
];

export default function BestPracticesTab({ onSwitchTab = null }) {
  const navigate = useNavigate();
  const [practices, setPractices] = useState(INITIAL_PRACTICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPractice, setSelectedPractice] = useState(null);

  const metrics = [
    { label: "PLAYBOOKS", value: "18", sub: "Curated practices" },
    { label: "TOPICS", value: "7", sub: "Core areas" },
    { label: "READING PROGRESS", value: "72%", sub: "Your progress" },
    { label: "BOOKMARKED", value: "5", sub: "Saved practices" },
  ];

  const filtered = practices.filter((item) =>
    item.practice.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    exportToCsv(
      "Mentor_Best_Practices",
      ["Practice", "Topic", "Level", "Read Time"],
      filtered.map((item) => [
        item.practice,
        item.topic,
        item.level,
        item.readTime,
      ])
    );
  };

  const toggleBookmark = (id) => {
    setPractices((prev) =>
      prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p))
    );
    if (selectedPractice && selectedPractice.id === id) {
      setSelectedPractice((prev) => ({ ...prev, bookmarked: !prev.bookmarked }));
    }
  };

  return (
    <div className="mentor-module-root">
      <MentorHeader
        title="Best Practices"
        subtitle="Practical mentoring principles and proven startup playbooks"
      />

      {/* Subnavigation Bar */}
      <div className="mentor-subnav-bar">
        <button
          type="button"
          className="mentor-subnav-btn"
          onClick={() => (onSwitchTab ? onSwitchTab("knowledge") : navigate("/dashboard?tab=knowledge"))}
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
          className="mentor-subnav-btn active"
          aria-current="page"
        >
          🎯 Best Practices
        </button>
      </div>

      <MentorMetricCards cards={metrics} />

      <MentorCard
        title="Mentor playbook library"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter playbooks or principles..."
        onExport={handleExport}
      >
        <div className="mentor-table-wrapper">
          <table className="mentor-table">
            <thead>
              <tr>
                <th>PRACTICE</th>
                <th>TOPIC</th>
                <th>LEVEL</th>
                <th>READ TIME</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedPractice(item)}
                >
                  <td className="mentor-cell-primary">{item.practice}</td>
                  <td>{item.topic}</td>
                  <td>{item.level}</td>
                  <td>{item.readTime}</td>
                  <td>
                    <button
                      type="button"
                      className="mentor-action-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPractice(item);
                      }}
                    >
                      Read
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="mentor-empty-state">
                    No playbooks match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </MentorCard>

      {/* Playbook Reader Modal */}
      {selectedPractice && (
        <Modal
          isOpen={Boolean(selectedPractice)}
          onClose={() => setSelectedPractice(null)}
          title={`Playbook: ${selectedPractice.practice}`}
          maxWidth={560}
        >
          <div className="mentor-modal-body">
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Core Topic &amp; Level</span>
              <span className="mentor-modal-value">
                {selectedPractice.topic} • {selectedPractice.level} Level ({selectedPractice.readTime} read)
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Guiding Principle</span>
              <p style={{ margin: 0, fontSize: "14px", color: "#0F172A", lineHeight: "1.6" }}>
                {selectedPractice.principle}
              </p>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Actionable Mentoring Checklist</span>
              <ul style={{ paddingLeft: "20px", margin: "4px 0", fontSize: "13.5px", color: "#334155", lineHeight: "1.7" }}>
                {selectedPractice.tacticalChecklist.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
              <button
                type="button"
                className="mentor-subnav-btn"
                style={{
                  border: "1px solid #E2E8F0",
                  color: selectedPractice.bookmarked ? "#EAB308" : "#64748B",
                }}
                onClick={() => toggleBookmark(selectedPractice.id)}
              >
                {selectedPractice.bookmarked ? "★ Bookmarked" : "☆ Save Bookmark"}
              </button>
              <button
                type="button"
                className="mentor-btn-primary"
                onClick={() => setSelectedPractice(null)}
              >
                Done Reading
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
