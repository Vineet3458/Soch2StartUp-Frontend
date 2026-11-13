import { useState, useMemo } from "react";
import ResourceGrid from "./components/ResourceGrid.jsx";
import { Modal } from "../../components/common/index.jsx";

const MASTER_RESOURCES = [
  // Entrepreneur Resources
  {
    id: "res-1",
    title: "Lean Canvas 1-Page Business Model",
    category: "Templates",
    description: "Deconstruct your startup idea into 9 fundamental building blocks: Problem, Solution, Key Metrics, Cost Structure.",
    tags: ["MVP", "BusinessModel", "Strategy"],
    roles: ["entrepreneur", "mentor", "admin", "superadmin"],
    fileType: "PDF / Notion",
    readTime: "8 min read",
    icon: "📋",
    content: "The Lean Canvas is an actionable 1-page business plan template that helps founders quickly iterate on assumptions before writing code. Focus on the Top 3 problems of your target user segment and specify unique value proposition.",
  },
  {
    id: "res-2",
    title: "Indian AgriTech & B2B Market Sizing 2026",
    category: "Market Insights",
    description: "Macroeconomic dataset covering rural smartphone penetration, UPI transactions, and FPO procurement trends.",
    tags: ["MarketData", "AgriTech", "B2B"],
    roles: ["entrepreneur", "admin", "superadmin", "evaluator"],
    fileType: "Report",
    readTime: "12 min read",
    icon: "📊",
    content: "Tier-2/3 digital adoption in India reached 68% in 2025. Key growth vectors include hyper-local input distribution, vernacular voice-first AI interfaces, and working-capital financing for retail supply chains.",
  },
  {
    id: "res-3",
    title: "Seed Pitch Deck Blueprint (10 Slides)",
    category: "Templates",
    description: "The battle-tested 10-slide investor deck structure used to raise angel and pre-seed rounds in India.",
    tags: ["PitchDeck", "Fundraising", "InvestorReady"],
    roles: ["entrepreneur", "mentor", "superadmin"],
    fileType: "PPTX / Slides",
    readTime: "15 min read",
    icon: "💼",
    content: "Slide 1: Title & Mission. Slide 2: Problem statement with quantifiable pain. Slide 3: Solution & Product Demo. Slide 4: Market Size (TAM, SAM, SOM). Slide 5: Business Model & Pricing. Slide 6: Moat & Defensibility. Slide 7: Traction & Early Proof. Slide 8: Competitor Matrix. Slide 9: Team. Slide 10: The Ask.",
  },

  // Mentor & Evaluator Resources
  {
    id: "res-4",
    title: "Startup Validation Scoring Rubric & Guide",
    category: "Guidelines",
    description: "Standardized 5-pillar scoring methodology for evaluating market demand, feasibility, and risk.",
    tags: ["Rubric", "Evaluation", "Standards"],
    roles: ["evaluator", "industry_expert", "mentor", "admin", "superadmin"],
    fileType: "Rubric PDF",
    readTime: "10 min read",
    icon: "⚖️",
    content: "Pillar 1: Market Demand (30%). Pillar 2: Technical & Operational Feasibility (20%). Pillar 3: Financial Viability & Margins (20%). Pillar 4: Competitive Advantage (15%). Pillar 5: Execution & Regulatory Risk (15%). Rate each metric on 0-100 scale.",
  },
  {
    id: "res-5",
    title: "Founder Mentorship Session Framework",
    category: "Best Practices",
    description: "Structured agenda for conducting high-impact 30-minute founder advisory sessions and review milestones.",
    tags: ["Mentorship", "Coaching", "OKRs"],
    roles: ["mentor", "admin", "superadmin"],
    fileType: "Guide",
    readTime: "6 min read",
    icon: "🎓",
    content: "First 5 mins: Wins and key metric progress. Next 15 mins: Deep dive into the primary bottleneck (customer acquisition, hiring, or tech hurdle). Last 10 mins: Actionable commitments for next review checkpoint.",
  },

  // Moderator Resources
  {
    id: "res-6",
    title: "Community Guidelines & Content Standards",
    category: "Compliance",
    description: "Rules against misleading return guarantees, unlicensed financial advisory, and toxic feedback.",
    tags: ["Moderation", "Safety", "Compliance"],
    roles: ["moderator", "admin", "superadmin"],
    fileType: "Policy Doc",
    readTime: "7 min read",
    icon: "🛡️",
    content: "Prohibit all schemes promising guaranteed daily crypto returns or unauthorized securities trading. Ensure mentor feedback remains constructive, objective, and professional. Flag repeat violators for administrative deactivation.",
  },
];

export default function ResourceHubModule({ role = "entrepreneur" }) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingResource, setViewingResource] = useState(null);

  // Filter resources applicable to current role
  const roleResources = useMemo(() => {
    return MASTER_RESOURCES.filter(
      (r) => !r.roles || r.roles.includes(role) || ["admin", "superadmin"].includes(role)
    );
  }, [role]);

  // Extract available categories
  const categories = useMemo(() => {
    const set = new Set(roleResources.map((r) => r.category));
    return ["ALL", ...Array.from(set)];
  }, [roleResources]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return roleResources.filter((r) => {
      const matchesCat = selectedCategory === "ALL" || r.category === selectedCategory;
      const matchesSearch =
        !searchTerm ||
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCat && matchesSearch;
    });
  }, [roleResources, selectedCategory, searchTerm]);

  return (
    <div className="resource-hub-module-root">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Knowledge &amp; Resource Hub</h2>
          <p className="muted small">
            Curated startup playbooks, pitch deck templates, evaluation rubrics, and industry guides.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="module-filter-bar">
        <div className="filter-tabs-row">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-tab-pill ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "ALL" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        <div className="filter-controls-row">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search guides, templates, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-search-input"
            />
          </div>
        </div>
      </div>

      {/* Grid of Resources */}
      <ResourceGrid
        resources={filteredResources}
        onSelect={(res) => setViewingResource(res)}
      />

      {/* Resource Detail Viewer Modal */}
      {viewingResource && (
        <Modal
          isOpen={Boolean(viewingResource)}
          onClose={() => setViewingResource(null)}
          title={viewingResource.title}
          maxWidth={620}
          footer={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <span className="muted small">Category: {viewingResource.category}</span>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setViewingResource(null)}
              >
                Done Reading
              </button>
            </div>
          }
        >
          <div className="resource-modal-content">
            <div className="resource-modal-badges">
              <span className="resource-category-pill">{viewingResource.category}</span>
              <span className="resource-file-pill">{viewingResource.fileType}</span>
              <small className="muted">{viewingResource.readTime}</small>
            </div>

            <p className="resource-modal-lead">{viewingResource.description}</p>
            <hr style={{ margin: "16px 0", borderColor: "var(--border)" }} />
            <div className="resource-modal-body-text">
              <p>{viewingResource.content}</p>
            </div>

            <div className="resource-tags-row" style={{ marginTop: "16px" }}>
              {viewingResource.tags.map((t, idx) => (
                <span key={idx} className="resource-tag-item">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
