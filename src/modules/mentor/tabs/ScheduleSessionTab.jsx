import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MentorHeader,
  MentorMetricCards,
  MentorCard,
  exportToCsv,
} from "../MentorSharedComponents.jsx";
import { Modal } from "../../../components/common/index.jsx";

const INITIAL_SESSIONS = [
  {
    id: "sess-1",
    startup: "GreenCart",
    sessionType: "Progress review",
    date: "Nov 16",
    time: "10:30 AM",
    status: "Scheduled",
    meetLink: "https://meet.google.com/grn-cart-ment",
    agenda: "Review customer interview insights & agree on prototype MVP backlog.",
  },
  {
    id: "sess-2",
    startup: "MedRoute",
    sessionType: "MVP consultation",
    date: "Nov 17",
    time: "2:00 PM",
    status: "Pending",
    meetLink: "https://meet.google.com/med-rout-plan",
    agenda: "Evaluate technical feasibility of real-time doctor availability sync.",
  },
  {
    id: "sess-3",
    startup: "FarmLink",
    sessionType: "Business model",
    date: "Nov 19",
    time: "11:00 AM",
    status: "Scheduled",
    meetLink: "https://meet.google.com/farm-link-rev",
    agenda: "Test unit economics under wholesale merchant discount structures.",
  },
  {
    id: "sess-4",
    startup: "SkillBridge",
    sessionType: "Market sizing",
    date: "Nov 21",
    time: "3:30 PM",
    status: "Scheduled",
    meetLink: "https://meet.google.com/skil-bdg-tam",
    agenda: "Calibrate TAM/SAM/SOM assumptions with regional college enrollment data.",
  },
  {
    id: "sess-5",
    startup: "AquaSense",
    sessionType: "Pitch review",
    date: "Nov 24",
    time: "12:00 PM",
    status: "Draft",
    meetLink: "https://meet.google.com/aqua-sens-ptc",
    agenda: "Dry-run demo pitch presentation and formulate Q&A response matrix.",
  },
  {
    id: "sess-6",
    startup: "EduSpark",
    sessionType: "Growth strategy",
    date: "Nov 27",
    time: "4:00 PM",
    status: "Scheduled",
    meetLink: "https://meet.google.com/edu-sprk-gtm",
    agenda: "Analyze pilot retention data across 3 trial schools.",
  },
];

export default function ScheduleSessionTab({ onSwitchTab = null }) {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // Form state for scheduling new session
  const [formStartup, setFormStartup] = useState("GreenCart");
  const [formType, setFormType] = useState("Progress review");
  const [formDate, setFormDate] = useState("Nov 28");
  const [formTime, setFormTime] = useState("11:00 AM");
  const [formAgenda, setFormAgenda] = useState("");

  const metrics = [
    { label: "UPCOMING SESSIONS", value: "4", sub: "Next 14 days" },
    { label: "HOURS THIS MONTH", value: "9.5", sub: "Mentoring time" },
    { label: "REQUESTS", value: "2", sub: "Awaiting confirmation" },
    { label: "AVAILABLE SLOTS", value: "6", sub: "This week" },
  ];

  const filtered = sessions.filter((s) =>
    s.startup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.sessionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    exportToCsv(
      "Mentor_Session_Planner",
      ["Startup", "Session Type", "Date", "Time", "Status"],
      filtered.map((item) => [
        item.startup,
        item.sessionType,
        item.date,
        item.time,
        item.status,
      ])
    );
  };

  const handleCreateSession = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `sess-${Date.now()}`,
      startup: formStartup,
      sessionType: formType,
      date: formDate,
      time: formTime,
      status: "Scheduled",
      meetLink: `https://meet.google.com/${formStartup.toLowerCase().replace(/\s+/g, "-")}-ment`,
      agenda: formAgenda || "Mentoring advisory discussion.",
    };
    setSessions([newEntry, ...sessions]);
    setShowNewModal(false);
    setFormAgenda("");
    alert(`Mentoring session booked with ${formStartup} for ${formDate} at ${formTime}!`);
  };

  const goToHistory = () => {
    if (onSwitchTab) {
      onSwitchTab("history");
    } else {
      navigate("/dashboard?tab=history");
    }
  };

  return (
    <div className="mentor-module-root">
      <MentorHeader
        title="Schedule Session"
        subtitle="Plan a mentoring session with an assigned startup"
      />

      {/* Subnavigation Bar to seamlessly switch to Session History */}
      <div className="mentor-subnav-bar">
        <button
          type="button"
          className="mentor-subnav-btn active"
          aria-current="page"
        >
          📅 Schedule Session
        </button>
        <button
          type="button"
          className="mentor-subnav-btn"
          onClick={goToHistory}
        >
          📜 Session History
        </button>
      </div>

      <MentorMetricCards cards={metrics} />

      <MentorCard
        title="Session planner"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter planned sessions..."
        onExport={handleExport}
        actionBtn={
          <button
            type="button"
            className="mentor-btn-primary"
            onClick={() => setShowNewModal(true)}
          >
            + Schedule Session
          </button>
        }
      >
        <div className="mentor-table-wrapper">
          <table className="mentor-table">
            <thead>
              <tr>
                <th>STARTUP</th>
                <th>SESSION TYPE</th>
                <th>DATE</th>
                <th>TIME</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedSession(item)}
                >
                  <td className="mentor-cell-primary">{item.startup}</td>
                  <td>{item.sessionType}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>
                    <span
                      className={
                        item.status === "Scheduled" || item.status === "Pending"
                          ? "mentor-text-purple"
                          : "mentor-priority-low"
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
                    No scheduled sessions match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </MentorCard>

      {/* View Session Details Modal */}
      {selectedSession && (
        <Modal
          isOpen={Boolean(selectedSession)}
          onClose={() => setSelectedSession(null)}
          title={`Session Details: ${selectedSession.startup}`}
          maxWidth={540}
        >
          <div className="mentor-modal-body">
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Session Topic &amp; Type</span>
              <span className="mentor-modal-value">{selectedSession.sessionType}</span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Time &amp; Date</span>
              <span className="mentor-modal-value">
                {selectedSession.date} at {selectedSession.time}
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Status</span>
              <span className="mentor-modal-value" style={{ fontWeight: 600, color: "#4F46E5" }}>
                {selectedSession.status}
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Meeting Agenda</span>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#334155" }}>
                {selectedSession.agenda}
              </p>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Meeting Link</span>
              <a
                href={selectedSession.meetLink}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#4F46E5", fontSize: "13.5px", textDecoration: "underline" }}
              >
                {selectedSession.meetLink}
              </a>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
              <button
                type="button"
                className="mentor-subnav-btn"
                style={{ border: "1px solid #E2E8F0" }}
                onClick={() => setSelectedSession(null)}
              >
                Close
              </button>
              {selectedSession.status === "Pending" && (
                <button
                  type="button"
                  className="mentor-btn-primary"
                  onClick={() => {
                    setSessions((prev) =>
                      prev.map((s) => (s.id === selectedSession.id ? { ...s, status: "Scheduled" } : s))
                    );
                    setSelectedSession(null);
                    alert(`Confirmed session with ${selectedSession.startup}!`);
                  }}
                >
                  Confirm Slot
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Schedule New Session Modal */}
      {showNewModal && (
        <Modal
          isOpen={showNewModal}
          onClose={() => setShowNewModal(false)}
          title="Schedule New Mentoring Session"
          maxWidth={540}
        >
          <form onSubmit={handleCreateSession} className="mentor-modal-body">
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
              <label className="mentor-modal-label">Session Type</label>
              <select
                className="mentor-filter-select"
                style={{ width: "100%", padding: "10px" }}
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
              >
                <option value="Progress review">Progress review</option>
                <option value="MVP consultation">MVP consultation</option>
                <option value="Business model">Business model</option>
                <option value="Market sizing">Market sizing</option>
                <option value="Pitch review">Pitch review</option>
                <option value="Unit economics check">Unit economics check</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="mentor-modal-field">
                <label className="mentor-modal-label">Date</label>
                <input
                  type="text"
                  className="mentor-search-input"
                  style={{ width: "100%" }}
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  placeholder="e.g. Nov 28"
                  required
                />
              </div>
              <div className="mentor-modal-field">
                <label className="mentor-modal-label">Time</label>
                <input
                  type="text"
                  className="mentor-search-input"
                  style={{ width: "100%" }}
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  placeholder="e.g. 11:00 AM"
                  required
                />
              </div>
            </div>

            <div className="mentor-modal-field">
              <label className="mentor-modal-label">Agenda &amp; Discussion Points</label>
              <textarea
                className="mentor-modal-textarea"
                rows={3}
                placeholder="Key goals, deliverables to review, and expected outcomes..."
                value={formAgenda}
                onChange={(e) => setFormAgenda(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
              <button
                type="button"
                className="mentor-subnav-btn"
                style={{ border: "1px solid #E2E8F0" }}
                onClick={() => setShowNewModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="mentor-btn-primary">
                Book Session
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
