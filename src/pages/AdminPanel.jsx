import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";

const ROLES = ["entrepreneur", "mentor", "industry_expert", "moderator", "admin", "superadmin"];
const COLORS = { GO: "#16a34a", IMPROVE: "#d97706", AVOID: "#dc2626" };

export default function AdminPanel() {
  const { user: me } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/admin/stats"), api.get("/admin/users"), api.get("/admin/ideas")]).then(([s, u, i]) => {
      setStats(s.data);
      setUsers(u.data);
      setIdeas(i.data);
    });
  }, []);

  const replaceUser = (updated) => setUsers(users.map((u) => (u._id === updated._id ? updated : u)));

  const changeRole = async (id, role) => replaceUser((await api.patch(`/admin/users/${id}/role`, { role })).data);
  const toggleActive = async (id) => replaceUser((await api.patch(`/admin/users/${id}/toggle`)).data);
  const deleteIdea = async (id) => {
    await api.delete(`/admin/ideas/${id}`);
    setIdeas(ideas.filter((i) => i._id !== id));
  };

  if (!stats) return <Loader />;

  return (
    <>
      <h2>Admin panel</h2>
      <div className="grid grid-3">
        <div className="card center"><p className="big-score">{stats.users}</p><p className="muted">Users</p></div>
        <div className="card center"><p className="big-score">{stats.ideas}</p><p className="muted">Ideas validated</p></div>
        <div className="card">
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={stats.verdicts} dataKey="count" nameKey="verdict" outerRadius={50}>
                {stats.verdicts.map((v) => <Cell key={v.verdict} fill={COLORS[v.verdict]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3>Users</h3>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th /></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  {me.role === "superadmin" ? (
                    <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)}>
                      {ROLES.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
                    </select>
                  ) : u.role.replace("_", " ")}
                </td>
                <td>{u.isActive ? "Active" : "Disabled"}</td>
                <td>{u.role !== "superadmin" && <button className="btn btn-outline btn-sm" onClick={() => toggleActive(u._id)}>{u.isActive ? "Disable" : "Enable"}</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>All ideas</h3>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Idea</th><th>Owner</th><th>Score</th><th>Verdict</th><th /></tr></thead>
          <tbody>
            {ideas.map((i) => (
              <tr key={i._id}>
                <td>{i.title}</td><td>{i.user?.name}</td><td>{i.report.score}</td><td>{i.report.verdict}</td>
                <td><button className="btn btn-outline btn-sm" onClick={() => deleteIdea(i._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
