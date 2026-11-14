import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MentorHeader,
  MentorMetricCards,
  MentorCard,
  exportToCsv,
} from "../MentorSharedComponents.jsx";
import { Modal } from "../../../components/common/index.jsx";

const INITIAL_TEMPLATES = [
  {
    id: "tmpl-1",
    template: "Mentor Session Notes",
    purpose: "Capture discussion",
    format: "Doc",
    lastUsed: "Nov 12",
    description: "Standardized 4-section documentation template covering: 1. Previous Commitments, 2. Current Blockers, 3. Strategic Discussion, 4. 7-Day Action Items.",
    contentSnippet: "SESSION DATE:\nSTARTUP:\nMENTOR:\n1. ACCOMPLISHED SINCE LAST SESSION:\n2. CRITICAL BLOCKERS:\n3. ADVISORY DISCUSSION:\n4. 7-DAY ACTION ITEMS & RESPONSIBILITIES:",
  },
  {
    id: "tmpl-2",
    template: "Startup Review",
    purpose: "Structured review",
    format: "Form",
    lastUsed: "Nov 09",
    description: "10-point diagnostic scorecard evaluating team readiness, product moat, unit economics health, and customer validation momentum.",
    contentSnippet: "STARTUP DIAGNOSTIC SCORECARD (1-10 Scale):\n- Problem Urgency:\n- Solution Uniqueness:\n- Customer Validation Proof:\n- Distribution / Go-To-Market Plan:\n- Unit Economics Viability:\n- Founder Execution Speed:",
  },
  {
    id: "tmpl-3",
    template: "Action Plan",
    purpose: "Track next steps",
    format: "Sheet",
    lastUsed: "Nov 07",
    description: "Milestone accountability worksheet detailing deliverable description, target metrics, owner, and due date.",
    contentSnippet: "| Milestone | Owner | Target Metric | Deadline | Status |\n| Customer Discovery Synthesis | Founder | 20 Interviews | Nov 20 | In Progress |\n| MVP Scoping Spec | CTO | 3 Core Workflows | Nov 25 | Pending |",
  },
  {
    id: "tmpl-4",
    template: "Customer Interview Plan",
    purpose: "Research prep",
    format: "Doc",
    lastUsed: "Nov 03",
    description: "User research preparation protocol with 12 open-ended non-leading interview questions tailored to discovery stages.",
    contentSnippet: "USER RESEARCH SCRIPT:\n1. What is the hardest part about [problem domain] today?\n2. Can you tell me about the last time that happened?\n3. Why was that so frustrating?\n4. What have you tried doing to solve that?",
  },
  {
    id: "tmpl-5",
    template: "Pitch Feedback",
    purpose: "Deck review",
    format: "Form",
    lastUsed: "Oct 28",
    description: "Slide-by-slide investor presentation evaluation framework highlighting clarity, narrative cohesion, and defensibility.",
    contentSnippet: "DECK EVALUATION SLIDE-BY-SLIDE:\nSlide 1 (Hero Hook): Score /10\nSlide 2 (Problem): Quantified economic loss?\nSlide 3 (Solution): Is it 10x better?\nSlide 4 (Traction): Evidence of pull?\nSlide 5 (Market): Bottom-up SOM validation?",
  },
  {
    id: "tmpl-6",
    template: "Weekly Founder Check-in",
    purpose: "Progress sync",
    format: "Doc",
    lastUsed: "Oct 24",
    description: "Asynchronous 15-minute weekly update form used by founders to submit progress before live mentor calls.",
    contentSnippet: "WEEKLY ASYNC UPDATE:\n- High of the week:\n- Low of the week:\n- Top metric this week vs last week:\n- Top 1 question for mentor call:",
  },
  {
    id: "tmpl-7",
    template: "Pivot Evaluation Matrix",
    purpose: "Strategic pivot",
    format: "Sheet",
    lastUsed: "Oct 17",
    description: "Strategic decision matrix comparing customer problem validity against execution difficulty when considering a pivot.",
    contentSnippet: "| Candidate Direction | Market Demand Score | Tech Feasibility | Time-to-MVP | Mentor Recommendation |",
  },
];

export default function TemplatesTab({ onSwitchTab = null }) {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [copied, setCopied] = useState(false);

  const metrics = [
    { label: "TEMPLATES", value: "24", sub: "Available" },
    { label: "MY SAVED", value: "6", sub: "Your collection" },
    { label: "RECENTLY USED", value: "4", sub: "This month" },
    { label: "SHARED", value: "3", sub: "With founders" },
  ];

  const filtered = templates.filter((item) =>
    item.template.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.format.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    exportToCsv(
      "Mentor_Templates",
      ["Template", "Purpose", "Format", "Last Used"],
      filtered.map((item) => [
        item.template,
        item.purpose,
        item.format,
        item.lastUsed,
      ])
    );
  };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mentor-module-root">
      <MentorHeader
        title="Templates"
        subtitle="Reusable templates for sessions, reviews and founder guidance"
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
          className="mentor-subnav-btn active"
          aria-current="page"
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
        title="Mentor templates"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter templates..."
        onExport={handleExport}
      >
        <div className="mentor-table-wrapper">
          <table className="mentor-table">
            <thead>
              <tr>
                <th>TEMPLATE</th>
                <th>PURPOSE</th>
                <th>FORMAT</th>
                <th>LAST USED</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedTemplate(item);
                    setCopied(false);
                  }}
                >
                  <td className="mentor-cell-primary">{item.template}</td>
                  <td>{item.purpose}</td>
                  <td>{item.format}</td>
                  <td>{item.lastUsed}</td>
                  <td>
                    <button
                      type="button"
                      className="mentor-action-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(item);
                        setCopied(false);
                      }}
                    >
                      Use
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="mentor-empty-state">
                    No templates match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </MentorCard>

      {/* Template Preview & Use Modal */}
      {selectedTemplate && (
        <Modal
          isOpen={Boolean(selectedTemplate)}
          onClose={() => setSelectedTemplate(null)}
          title={`Use Template: ${selectedTemplate.template}`}
          maxWidth={580}
        >
          <div className="mentor-modal-body">
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Purpose &amp; Format</span>
              <span className="mentor-modal-value">
                {selectedTemplate.purpose} – {selectedTemplate.format} document (Last used {selectedTemplate.lastUsed})
              </span>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Overview</span>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#334155" }}>
                {selectedTemplate.description}
              </p>
            </div>
            <div className="mentor-modal-field">
              <span className="mentor-modal-label">Template Content Preview</span>
              <pre
                style={{
                  margin: 0,
                  padding: "12px",
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  fontFamily: "monospace",
                  color: "#1E293B",
                  whiteSpace: "pre-wrap",
                  maxHeight: "180px",
                  overflowY: "auto",
                }}
              >
                {selectedTemplate.contentSnippet}
              </pre>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
              <button
                type="button"
                className="mentor-subnav-btn"
                style={{ border: "1px solid #E2E8F0" }}
                onClick={() => handleCopy(selectedTemplate.contentSnippet)}
              >
                {copied ? "✓ Copied to Clipboard!" : "📋 Copy Template Text"}
              </button>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="mentor-subnav-btn"
                  style={{ border: "1px solid #E2E8F0" }}
                  onClick={() => setSelectedTemplate(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="mentor-btn-primary"
                  onClick={() => {
                    alert(`Template '${selectedTemplate.template}' attached to current mentee workspace!`);
                    setSelectedTemplate(null);
                  }}
                >
                  Apply to Mentee
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
