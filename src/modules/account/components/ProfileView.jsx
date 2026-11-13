import React from "react";

export default function ProfileView({ user }) {
  if (!user) return null;

  const initial = (user.name || "U").charAt(0).toUpperCase();
  const roleDisplay = (user.role || "entrepreneur").replace("_", " ").toUpperCase();

  const permissionsByRole = {
    superadmin: ["Full Database Access", "Role Permissions Management", "Audit Logs", "System Settings", "User Management"],
    admin: ["Platform Operations", "User Status Toggle", "Startup Approvals", "Analytics & Insights"],
    moderator: ["Content & Feedback Moderation", "User Flagging", "Community Guidelines Review"],
    industry_expert: ["Idea Evaluation & Scoring", "Rubric Assessment", "Evaluation Reports Access"],
    mentor: ["Startup Guidance", "Founder Advisory Sessions", "Feedback Threads"],
    entrepreneur: ["Startup Idea Submissions", "AI Report Generations", "Comparison Matrix", "Roadmap Tracking"],
  };

  const perms = permissionsByRole[user.role] || permissionsByRole.entrepreneur;

  return (
    <div className="profile-view-card card" style={{ maxWidth: "780px", margin: "0 auto" }}>
      <div className="profile-card-header">
        <div className="profile-avatar-large">{initial}</div>
        <div className="profile-header-meta">
          <h2 className="profile-user-name">{user.name}</h2>
          <div className="profile-badges-line">
            <span className="role-tag-badge">{roleDisplay}</span>
            <span className="status-pill active">● Active Account</span>
            <span className="verified-badge">✔ Verified</span>
          </div>
          <p className="muted small" style={{ marginTop: "6px" }}>
            Email: <strong>{user.email}</strong>
          </p>
        </div>
      </div>

      <hr style={{ margin: "24px 0", borderColor: "var(--border)" }} />

      <div className="profile-details-grid">
        <div className="detail-item">
          <label>Full Legal Name</label>
          <input type="text" value={user.name} disabled className="disabled-input" />
        </div>

        <div className="detail-item">
          <label>Registered Email</label>
          <input type="email" value={user.email} disabled className="disabled-input" />
        </div>

        <div className="detail-item">
          <label>Platform Role</label>
          <input type="text" value={roleDisplay} disabled className="disabled-input" />
        </div>

        <div className="detail-item">
          <label>Session Security</label>
          <input type="text" value="JWT (7 Days Auto-Refresh)" disabled className="disabled-input" />
        </div>
      </div>

      <div className="profile-permissions-box" style={{ marginTop: "24px" }}>
        <h4>Role Capabilities &amp; Permissions</h4>
        <div className="permission-chips-wrap">
          {perms.map((p, i) => (
            <span key={i} className="permission-chip">
              ✓ {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
