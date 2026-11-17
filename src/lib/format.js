export const fmtDate = (d, opts = { day: "2-digit", month: "short", year: "numeric" }) => (d ? new Date(d).toLocaleDateString("en-IN", opts) : "—");
export const fmtDateTime = (d) => (d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—");
export const ago = (d) => {
  const s = Math.max(1, Math.round((Date.now() - new Date(d)) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60); if (h < 24) return `${h}h ago`;
  const dd = Math.round(h / 24); if (dd < 30) return `${dd}d ago`;
  return fmtDate(d);
};
export const roleLabel = (r) => ({ entrepreneur: "Entrepreneur", mentor: "Mentor", industry_expert: "Industry Expert", admin: "Admin", superadmin: "Superadmin", moderator: "Moderator" }[r] || r);
export const statusLabel = (s) => ({ draft: "Draft", submitted: "Submitted", under_review: "Under review", approved: "Approved", rejected: "Rejected", changes_requested: "Changes requested", archived: "Archived" }[s] || s);
export const scoreColor = (s) => (s >= 70 ? "var(--success)" : s >= 50 ? "var(--warning)" : "var(--danger)");
export const initials = (n = "") => n.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();
export const METRIC_LABELS = { marketDemand: "Market demand", competition: "Competition (higher = easier)", feasibility: "Feasibility", financial: "Financial viability", risk: "Risk (higher = safer)" };
export const METRIC_SHORT = { marketDemand: "Demand", competition: "Competition", feasibility: "Feasibility", financial: "Financial", risk: "Risk" };
export const csvDownload = (name, rows) => {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const blob = new Blob([[keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n")], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click(); URL.revokeObjectURL(a.href);
};
