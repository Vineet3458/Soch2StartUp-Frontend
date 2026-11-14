import React, { useState, useMemo } from "react";
import {
  AdminPageHeader,
  AdminMetricCards,
  AdminCard,
  AdminFilterBar,
  AdminBadge,
} from "../AdminSharedComponents.jsx";

const METRICS = [
  {
    title: "Total users",
    value: "1,248",
    sub: "All registered accounts",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Entrepreneurs",
    value: "986",
    sub: "Founder accounts",
    subType: "green",
    iconColor: "cyan",
  },
  {
    title: "Mentors & experts",
    value: "52",
    sub: "Verified professionals",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "Admins & evaluators",
    value: "24",
    sub: "Platform team accounts",
    subType: "green",
    iconColor: "purple",
  },
];

const INITIAL_USERS = [
  {
    name: "Aarav Mehta",
    email: "aarav.m@example.com",
    role: "Entrepreneur",
    joined: "14 Nov 2026",
    status: "Active",
  },
  {
    name: "Riya Sharma",
    email: "riya.s@example.com",
    role: "Mentor",
    joined: "12 Nov 2026",
    status: "Active",
  },
  {
    name: "Kabir Singh",
    email: "kabir.s@example.com",
    role: "Evaluator",
    joined: "10 Nov 2026",
    status: "Pending",
  },
  {
    name: "Ananya Rao",
    email: "ananya.r@example.com",
    role: "Entrepreneur",
    joined: "08 Nov 2026",
    status: "Active",
  },
  {
    name: "Dev Patel",
    email: "dev.p@example.com",
    role: "Admin",
    joined: "05 Nov 2026",
    status: "Blocked",
  },
  {
    name: "Ishita Gupta",
    email: "ishita.g@example.com",
    role: "Entrepreneur",
    joined: "02 Nov 2026",
    status: "Active",
  },
];

export default function AllUsersTab() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Entrepreneur",
    status: "Active",
  });

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchRole =
        roleFilter === "ALL" ||
        u.role.toLowerCase() === roleFilter.toLowerCase();
      const matchStatus =
        statusFilter === "ALL" ||
        u.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    setUsers([
      {
        ...newUser,
        joined: "14 Nov 2026",
      },
      ...users,
    ]);
    setNewUser({
      name: "",
      email: "",
      role: "Entrepreneur",
      status: "Active",
    });
    setShowAddModal(false);
  };

  return (
    <div className="admin-tab-users-root">
      <AdminPageHeader
        title="All Users"
        subtitle="View, search and manage every registered account on Soch2Startup."
      />

      <AdminMetricCards cards={METRICS} />

      <AdminCard
        title="User directory"
        subtitle="Manage account details, roles and account status."
      >
        <AdminFilterBar
          searchPlaceholder="Search by name or email"
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              value: roleFilter,
              onChange: setRoleFilter,
              options: [
                { value: "ALL", label: "All roles ▾" },
                { value: "Entrepreneur", label: "Entrepreneur" },
                { value: "Mentor", label: "Mentor" },
                { value: "Evaluator", label: "Evaluator" },
                { value: "Admin", label: "Admin" },
              ],
            },
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: "ALL", label: "All statuses ▾" },
                { value: "Active", label: "Active" },
                { value: "Pending", label: "Pending" },
                { value: "Blocked", label: "Blocked" },
              ],
            },
          ]}
          actionButtonText="+ Add user"
          onActionClick={() => setShowAddModal(true)}
        />

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>USER</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>JOINED</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ color: "#475569" }}>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.joined}</td>
                  <td>
                    <AdminBadge status={u.status} />
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                    No users found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Add User Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px 28px",
              width: "100%",
              maxWidth: "440px",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "#0f172a" }}>
              Add New User
            </h3>
            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
                  Role
                </label>
                <select
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="Entrepreneur">Entrepreneur</option>
                  <option value="Mentor">Mentor</option>
                  <option value="Evaluator">Evaluator</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "none", cursor: "pointer" }}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#7c3aed", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
