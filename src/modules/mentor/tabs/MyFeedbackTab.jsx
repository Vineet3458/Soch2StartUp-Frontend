import React, { useState } from "react";
import {
  MentorHeader,
  MentorMetricCards,
  MentorCard,
  exportToCsv,
} from "../MentorSharedComponents.jsx";
import { Modal } from "../../../components/common/index.jsx";

const INITIAL_FEEDBACK = [
  {
    id: "fb-1",
    from: "Founder - GreenCart",
    startupProgram: "GreenCart",
    date: "Nov 12",
    rating: 5.0,
    feedback: "Very helpful",
    fullComment: "The mentor helped us completely rethink how we validate customer demand without spending marketing budget prematurely. Highly appreciated!",
    replied: true,
    replyText: "Great execution on the interviews, Aarav! Keep focusing on actual buying behavior.",
  },
  {
    id: "fb-2",
    from: "Founder - MedRoute",
    startupProgram: "MedRoute",
    date: "Nov 09",
    rating: 4.8,
    feedback: "Clear direction",
    fullComment: "Gave us actionable advice on scoping our MVP to avoid developer burnout. The doctor scheduling workflow recommendation was spot on.",
    replied: true,
    replyText: "Happy to help, Dr. Priya. Keep the backlog lean.",
  },
  {
    id: "fb-3",
    from: "Program Lead",
    startupProgram: "Cohort A",
    date: "Nov 07",
    rating: 4.7,
    feedback: "Strong engagement",
    fullComment: "Consistently on time, deeply invested in cohort founders, and provides rigorous milestone evaluations. Excellent mentorship contribution.",
    replied: false,
    replyText: "",
  },
  {
    id: "fb-4",
    from: "Founder - FarmLink",
    startupProgram: "FarmLink",
    date: "Nov 04",
    rating: 4.9,
    feedback: "Practical advice",
    fullComment: "Helped us structure our B2B commission structure and avoid regulatory traps in mandi direct-dispatching.",
    replied: true,
    replyText: "Cheering for your pilot launch with the co-op!",
  },
  {
    id: "fb-5",
    from: "Founder - SkillBridge",
    startupProgram: "SkillBridge",
    date: "Oct 30",
    rating: 4.6,
    feedback: "Useful insights",
    fullComment: "Pushed us hard on TAM realism. Tough feedback to hear initially, but definitely made our investor deck 10x stronger.",
    replied: false,
    replyText: "",
  },
  {
    id: "fb-6",
    from: "Founder - AquaSense",
    startupProgram: "AquaSense",
    date: "Oct 25",
    rating: 4.9,
    feedback: "Excellent feedback",
    fullComment: "Detailed guidance on our commercial IoT leak detection presentation. Rehearsal was transformative.",
    replied: true,
    replyText: "Proud of your progress Devendra!",
  },
  {
    id: "fb-7",
    from: "Founder - LocalLoop",
    startupProgram: "LocalLoop",
    date: "Oct 19",
    rating: 5.0,
    feedback: "Changed our trajectory",
    fullComment: "Pointed out our unit economics blind spots before we burned cash on ads. True lifesaver for early stage founders.",
    replied: true,
    replyText: "You have a solid business Sneha, keep building sustainably.",
  },
];

export default function MyFeedbackTab() {
  const [feedbackList, setFeedbackList] = useState(INITIAL_FEEDBACK);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyInput, setReplyInput] = useState("");

  const metrics = [
    { label: "FEEDBACK RECEIVED", value: "14", sub: "All time" },
    { label: "AVERAGE RATING", value: "4.8 / 5", sub: "Founder feedback" },
    { label: "RESPONSES", value: "11", sub: "You replied" },
    { label: "PENDING", value: "2", sub: "Needs response" },
  ];

  const filtered = feedbackList.filter((item) =>
    item.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.startupProgram.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.feedback.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    exportToCsv(
      "Mentor_Feedback_Inbox",
      ["From", "Startup / Program", "Date", "Rating", "Feedback"],
      filtered.map((item) => [
        item.from,
        item.startupProgram,
        item.date,
        item.rating.toFixed(1),
        item.feedback,
      ])
    );
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyInput.trim() || !selectedFeedback) return;

    setFeedbackList((prev) =>
      prev.map((fb) =>
        fb.id === selectedFeedback.id
          ? { ...fb, replied: true, replyText: replyInput.trim() }
          : fb
      )
    );
    setSelectedFeedback((prev) => ({
      ...prev,
      replied: true,
      replyText: replyInput.trim(),
    }));
    setReplyInput("");
    alert("Response sent to the founder!");
  };

  return (
    <div className="mentor-module-root">
      <MentorHeader
        title="My Feedback"
        subtitle="View feedback received from founders and program coordinators"
      />

      <MentorMetricCards cards={metrics} />

      <MentorCard
        title="Feedback inbox"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter feedback inbox..."
        onExport={handleExport}
      >
        <div className="mentor-table-wrapper">
          <table className="mentor-table">
            <thead>
              <tr>
                <th>FROM</th>
                <th>STARTUP / PROGRAM</th>
                <th>DATE</th>
                <th>RATING</th>
                <th>FEEDBACK</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedFeedback(item);
                    setReplyInput(item.replyText || "");
                  }}
                >
                  <td className="mentor-cell-primary">{item.from}</td>
                  <td>{item.startupProgram}</td>
                  <td>{item.date}</td>
                  <td>
                    <div className="mentor-rating-badge">
                      <span className="mentor-rating-star">★</span>
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td>{item.feedback}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="mentor-empty-state">
                    No feedback records match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </MentorCard>

      {/* View & Reply Feedback Modal */}
      {selectedFeedback && (
        <Modal
          isOpen={Boolean(selectedFeedback)}
          onClose={() => setSelectedFeedback(null)}
          title={`Feedback from ${selectedFeedback.from}`}
          maxWidth={540}
        >
          <div className="mentor-modal-body">
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Startup / Program</span>
              <span className="mentor-modal-value">
                {selectedFeedback.startupProgram} ({selectedFeedback.date})
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Rating</span>
              <div className="mentor-rating-badge" style={{ fontSize: "16px" }}>
                <span className="mentor-rating-star">★</span>
                <span>{selectedFeedback.rating.toFixed(1)} / 5.0</span>
                <span style={{ fontSize: "13px", color: "#64748B", fontWeight: 400, marginLeft: "6px" }}>
                  ("{selectedFeedback.feedback}")
                </span>
              </div>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Detailed Founder Comment</span>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#1E293B", lineHeight: "1.6" }}>
                "{selectedFeedback.fullComment}"
              </p>
            </div>

            {selectedFeedback.replied && selectedFeedback.replyText && (
              <div
                style={{
                  padding: "12px 14px",
                  background: "#EEF2FF",
                  border: "1px solid #C7D2FE",
                  borderRadius: "8px",
                  marginTop: "8px",
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#4F46E5", marginBottom: "4px" }}>
                  Your Reply:
                </div>
                <div style={{ fontSize: "13.5px", color: "#1E293B" }}>
                  {selectedFeedback.replyText}
                </div>
              </div>
            )}

            {!selectedFeedback.replied && (
              <form onSubmit={handleSendReply} style={{ marginTop: "12px" }}>
                <div className="mentor-modal-field">
                  <label className="mentor-modal-label">Reply to Founder</label>
                  <textarea
                    className="mentor-modal-textarea"
                    rows={3}
                    placeholder="Write a message back to the mentee..."
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                  <button
                    type="button"
                    className="mentor-subnav-btn"
                    style={{ border: "1px solid #E2E8F0" }}
                    onClick={() => setSelectedFeedback(null)}
                  >
                    Close
                  </button>
                  <button type="submit" className="mentor-btn-primary">
                    Send Reply
                  </button>
                </div>
              </form>
            )}

            {selectedFeedback.replied && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                <button
                  type="button"
                  className="mentor-subnav-btn"
                  style={{ border: "1px solid #E2E8F0" }}
                  onClick={() => setSelectedFeedback(null)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
