import { useState } from "react";
import { Modal } from "../../../components/common/index.jsx";

const AVAILABLE_ROLES = [
  { key: "entrepreneur", label: "Entrepreneur", desc: "Can submit, validate, and compare startup ideas." },
  { key: "mentor", label: "Mentor", desc: "Can review startups and post guidance and feedback." },
  { key: "industry_expert", label: "Industry Expert / Evaluator", desc: "Can assess ideas and score evaluation rubrics." },
  { key: "moderator", label: "Moderator", desc: "Can review reported content and toggle active status." },
  { key: "admin", label: "Admin", desc: "Can manage platform operations, ideas, and active status." },
  { key: "superadmin", label: "Superadmin", desc: "Full root access to permissions, settings, and logs." },
];

export default function RoleSelectModal({
  isOpen,
  onClose,
  user,
  onSaveRole,
  loading = false,
}) {
  const [selectedRole, setSelectedRole] = useState(user?.role || "entrepreneur");

  if (!user) return null;

  const handleConfirm = () => {
    onSaveRole(user._id, selectedRole);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Platform Role for ${user.name}`}
      maxWidth={520}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", width: "100%" }}>
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="btn" onClick={handleConfirm} disabled={loading}>
            {loading ? "Updating..." : "Save Role"}
          </button>
        </div>
      }
    >
      <p className="muted small" style={{ marginBottom: "16px" }}>
        Assigning elevated permissions grants access to administrative controls and user records.
      </p>

      <div className="role-options-list">
        {AVAILABLE_ROLES.map((r) => (
          <label
            key={r.key}
            className={`role-option-card ${selectedRole === r.key ? "selected" : ""}`}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "12px",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              marginBottom: "8px",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="role-select"
              value={r.key}
              checked={selectedRole === r.key}
              onChange={() => setSelectedRole(r.key)}
              style={{ marginTop: "4px" }}
            />
            <div>
              <strong>{r.label}</strong>
              <p className="muted small" style={{ margin: "2px 0 0" }}>
                {r.desc}
              </p>
            </div>
          </label>
        ))}
      </div>
    </Modal>
  );
}
