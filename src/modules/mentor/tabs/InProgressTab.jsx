import React, { useState } from "react";
import {
  MentorHeader,
  MentorMetricCards,
  MentorCard,
  exportToCsv,
} from "../MentorSharedComponents.jsx";
import { Modal } from "../../../components/common/index.jsx";

const INITIAL_TRACKER = [
  {
    id: "prog-1",
    startup: "GreenCart",
    currentFocus: "Customer discovery",
    nextMilestone: "Interview insights",
    dueDate: "Nov 18",
    progress: 68,
    actionItems: "Synthesize 15 founder interviews and extract primary buyer persona.",
  },
  {
    id: "prog-2",
    startup: "MedRoute",
    currentFocus: "MVP scope",
    nextMilestone: "Feature prioritization",
    dueDate: "Nov 20",
    progress: 52,
    actionItems: "Cut secondary patient portal features; focus only on doctor appointment flow.",
  },
  {
    id: "prog-3",
    startup: "FarmLink",
    currentFocus: "Revenue model",
    nextMilestone: "Pricing review",
    dueDate: "Nov 22",
    progress: 76,
    actionItems: "Review tiered subscription model vs per-transaction fee with 3 anchor farms.",
  },
  {
    id: "prog-4",
    startup: "SkillBridge",
    currentFocus: "Market sizing",
    nextMilestone: "TAM/SAM/SOM",
    dueDate: "Nov 25",
    progress: 35,
    actionItems: "Bottom-up estimation based on 45,000 enrolled higher-ed students in regional cluster.",
  },
  {
    id: "prog-5",
    startup: "AquaSense",
    currentFocus: "Pitch deck",
    nextMilestone: "Problem statement",
    dueDate: "Nov 28",
    progress: 60,
    actionItems: "Refine slide 3 problem narrative with hard water loss economic metrics.",
  },
  {
    id: "prog-6",
    startup: "LocalLoop",
    currentFocus: "Prototype testing",
    nextMilestone: "Beta cohort feedback",
    dueDate: "Dec 02",
    progress: 45,
    actionItems: "Run closed alpha test with 5 local merchants and log dispatch latencies.",
  },
  {
    id: "prog-7",
    startup: "HealthTrack",
    currentFocus: "Regulatory checklist",
    nextMilestone: "HIPAA baseline",
    dueDate: "Dec 05",
    progress: 28,
    actionItems: "Audit wearable sensor cloud payload encryption and consent disclaimers.",
  },
];

export default function InProgressTab() {
  const [trackerList, setTrackerList] = useState(INITIAL_TRACKER);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingMilestone, setEditingMilestone] = useState(false);

  const metrics = [
    { label: "IN PROGRESS", value: "7", sub: "Active engagements" },
    { label: "SESSIONS THIS WEEK", value: "5", sub: "+1 vs last week" },
    { label: "MILESTONES DUE", value: "3", sub: "Next 7 days" },
    { label: "AT RISK", value: "1", sub: "Follow-up suggested" },
  ];

  const filtered = trackerList.filter((item) =>
    item.startup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.currentFocus.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nextMilestone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    exportToCsv(
      "Mentor_In_Progress",
      ["Startup", "Current Focus", "Next Milestone", "Due Date", "Progress"],
      filtered.map((item) => [
        item.startup,
        item.currentFocus,
        item.nextMilestone,
        item.dueDate,
        `${item.progress}%`,
      ])
    );
  };

  const handleUpdateProgress = (id, delta) => {
    setTrackerList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextVal = Math.min(100, Math.max(0, item.progress + delta));
          return { ...item, progress: nextVal };
        }
        return item;
      })
    );
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem((prev) => ({
        ...prev,
        progress: Math.min(100, Math.max(0, prev.progress + delta)),
      }));
    }
  };

  return (
    <div className="mentor-module-root">
      <MentorHeader
        title="In Progress"
        subtitle="Track active mentoring engagements and next milestones"
      />

      <MentorMetricCards cards={metrics} />

      <MentorCard
        title="Active mentoring tracker"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter by startup or focus..."
        onExport={handleExport}
      >
        <div className="mentor-table-wrapper">
          <table className="mentor-table">
            <thead>
              <tr>
                <th>STARTUP</th>
                <th>CURRENT FOCUS</th>
                <th>NEXT MILESTONE</th>
                <th>DUE DATE</th>
                <th>PROGRESS</th>
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
                  <td>{item.currentFocus}</td>
                  <td>{item.nextMilestone}</td>
                  <td>{item.dueDate}</td>
                  <td>
                    <div className="mentor-progress-cell">
                      <div className="mentor-progress-track">
                        <div
                          className="mentor-progress-bar"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="mentor-progress-text">{item.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="mentor-empty-state">
                    No active engagements match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </MentorCard>

      {/* Milestone Details & Progress Modal */}
      {selectedItem && (
        <Modal
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={`Milestone Tracker: ${selectedItem.startup}`}
          maxWidth={540}
        >
          <div className="mentor-modal-body">
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Current Focus Area</span>
              <span className="mentor-modal-value">{selectedItem.currentFocus}</span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Next Target Milestone</span>
              <span className="mentor-modal-value">{selectedItem.nextMilestone}</span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Target Completion Date</span>
              <span className="mentor-modal-value">{selectedItem.dueDate}</span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Progress: {selectedItem.progress}%</span>
              <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                <button
                  type="button"
                  className="mentor-subnav-btn"
                  style={{ border: "1px solid #E2E8F0" }}
                  onClick={() => handleUpdateProgress(selectedItem.id, -10)}
                >
                  - 10%
                </button>
                <button
                  type="button"
                  className="mentor-btn-primary"
                  onClick={() => handleUpdateProgress(selectedItem.id, +10)}
                >
                  + 10%
                </button>
                <button
                  type="button"
                  className="mentor-btn-primary"
                  style={{ background: "#10B981" }}
                  onClick={() => {
                    handleUpdateProgress(selectedItem.id, 100 - selectedItem.progress);
                    alert(`Marked ${selectedItem.startup} milestone as 100% complete!`);
                  }}
                >
                  Mark 100% Complete
                </button>
              </div>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Action Items</span>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#334155" }}>
                {selectedItem.actionItems}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <button
                type="button"
                className="mentor-subnav-btn"
                style={{ border: "1px solid #E2E8F0" }}
                onClick={() => setSelectedItem(null)}
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
