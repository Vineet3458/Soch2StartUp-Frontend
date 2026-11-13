import { useEffect, useState, useMemo } from "react";
import api, { errMsg } from "../../api/axios.js";
import UserTable from "./components/UserTable.jsx";
import RoleSelectModal from "./components/RoleSelectModal.jsx";
import Loader from "../../components/Loader.jsx";

export default function UserManagementModule({ role = "admin" }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [editingUser, setEditingUser] = useState(null);
  const [savingRole, setSavingRole] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const res = await api.patch(`/admin/users/${id}/toggle`);
      setUsers((prev) => prev.map((u) => (u._id === id ? res.data : u)));
    } catch (err) {
      alert(errMsg(err));
    }
  };

  const handleSaveRole = async (userId, newRole) => {
    try {
      setSavingRole(true);
      const res = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === userId ? res.data : u)));
      setEditingUser(null);
    } catch (err) {
      alert(errMsg(err));
    } finally {
      setSavingRole(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !searchTerm ||
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  if (loading) return <Loader />;

  return (
    <div className="user-management-module-root">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">User &amp; Directory Management</h2>
          <p className="muted small">
            {role === "superadmin"
              ? "Oversee platform members, assign elevated roles, and audit account access."
              : "Manage user verification, status toggling, and membership directory."}
          </p>
        </div>

        <div className="module-actions-group">
          <span className="user-count-pill">
            Total Users: <strong>{users.length}</strong>
          </span>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {/* Filter Controls */}
      <div className="module-filter-bar">
        <div className="filter-tabs-row">
          {["ALL", "entrepreneur", "mentor", "industry_expert", "moderator", "admin", "superadmin"].map((r) => (
            <button
              key={r}
              type="button"
              className={`filter-tab-pill ${roleFilter === r ? "active" : ""}`}
              onClick={() => setRoleFilter(r)}
            >
              {r === "ALL" ? "All Roles" : r.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="filter-controls-row">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by user name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-search-input"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <UserTable
        users={filteredUsers}
        currentRole={role}
        onToggleActive={handleToggleActive}
        onEditRole={(u) => setEditingUser(u)}
      />

      {/* Superadmin Role Change Modal */}
      {editingUser && (
        <RoleSelectModal
          isOpen={Boolean(editingUser)}
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaveRole={handleSaveRole}
          loading={savingRole}
        />
      )}
    </div>
  );
}
