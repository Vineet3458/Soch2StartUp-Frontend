import React from "react";

export default function UserTable({
  users = [],
  currentRole = "admin",
  onToggleActive,
  onEditRole,
  toggleLoading = false,
}) {
  const isSuperadmin = currentRole === "superadmin";

  if (users.length === 0) {
    return (
      <div className="card center empty-state-box">
        <span className="empty-icon">👥</span>
        <h3>No users match this filter</h3>
        <p className="muted small">Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="card table-wrap module-table-card">
      <table className="module-data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Registered</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const initial = (u.name || "U").charAt(0).toUpperCase();
            const isSuperTarget = u.role === "superadmin";

            return (
              <tr key={u._id}>
                <td>
                  <div className="user-table-cell">
                    <span className="user-table-avatar">{initial}</span>
                    <div>
                      <strong>{u.name}</strong>
                      <small className="muted">{u.email}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`role-badge-tag role-${u.role}`}>
                    {u.role.replace("_", " ")}
                  </span>
                </td>
                <td>
                  <span className={`status-pill ${u.isActive ? "active" : "disabled"}`}>
                    {u.isActive ? "● Active" : "○ Disabled"}
                  </span>
                </td>
                <td className="muted small">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style={{ textAlign: "right" }}>
                  <div className="table-actions-cell" style={{ justifyContent: "flex-end" }}>
                    {/* Superadmin can edit role */}
                    {isSuperadmin && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => onEditRole && onEditRole(u)}
                      >
                        Change Role
                      </button>
                    )}

                    {/* Admin / Superadmin / Moderator can toggle status */}
                    {!isSuperTarget && (
                      <button
                        type="button"
                        className={`btn btn-sm ${u.isActive ? "btn-outline" : "btn-primary"}`}
                        onClick={() => onToggleActive && onToggleActive(u._id)}
                        disabled={toggleLoading}
                      >
                        {u.isActive ? "Disable" : "Enable"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
