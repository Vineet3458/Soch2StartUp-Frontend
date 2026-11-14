import React, { useState, useMemo } from "react";
import {
  AdminPageHeader,
  AdminMetricCards,
  AdminCard,
  AdminFilterBar,
  AdminBadge,
  AdminBanner,
} from "../AdminSharedComponents.jsx";

const METRICS = [
  {
    title: "Total Mentors",
    value: "52",
    sub: "Registered professionals",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Active Mentors",
    value: "41",
    sub: "Available for guidance",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "Pending Applications",
    value: "7",
    sub: "Awaiting verification",
    subType: "green",
    iconColor: "orange",
  },
  {
    title: "Assigned Startups",
    value: "96",
    sub: "Across active mentors",
    subType: "green",
    iconColor: "cyan",
  },
];

const INITIAL_MENTORS = [
  {
    name: "Dr. Meera Nair",
    expertise: "Business Strategy",
    startups: 8,
    rating: "4.9 / 5",
    status: "Active",
  },
  {
    name: "Arjun Malhotra",
    expertise: "Technology",
    startups: 6,
    rating: "4.8 / 5",
    status: "Active",
  },
  {
    name: "Sana Kapoor",
    expertise: "Marketing",
    startups: 5,
    rating: "4.7 / 5",
    status: "Active",
  },
  {
    name: "Rohit Verma",
    expertise: "Finance",
    startups: 0,
    rating: "—",
    status: "Pending",
  },
  {
    name: "Isha Gupta",
    expertise: "Product Design",
    startups: 4,
    rating: "4.9 / 5",
    status: "Active",
  },
  {
    name: "Neel Shah",
    expertise: "Legal & Compliance",
    startups: 3,
    rating: "4.6 / 5",
    status: "Active",
  },
];

export default function MentorsExpertsTab() {
  const [mentors, setMentors] = useState(INITIAL_MENTORS);
  const [search, setSearch] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMentor, setNewMentor] = useState({
    name: "",
    expertise: "Business Strategy",
    startups: 0,
    rating: "5.0 / 5",
    status: "Active",
  });

  const filtered = useMemo(() => {
    return mentors.filter((m) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.expertise.toLowerCase().includes(q);
      const matchExpertise =
        expertiseFilter === "ALL" ||
        m.expertise.toLowerCase() === expertiseFilter.toLowerCase();
      const matchAvail =
        availabilityFilter === "ALL" ||
        (availabilityFilter === "Active" && m.status === "Active") ||
        (availabilityFilter === "Pending" && m.status === "Pending");
      return matchSearch && matchExpertise && matchAvail;
    });
  }, [mentors, search, expertiseFilter, availabilityFilter]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newMentor.name) return;
    setMentors([newMentor, ...mentors]);
    setNewMentor({
      name: "",
      expertise: "Business Strategy",
      startups: 0,
      rating: "5.0 / 5",
      status: "Active",
    });
    setShowAddModal(false);
  };

  return (
    <div className="admin-tab-mentors-root">
      <AdminPageHeader
        title="Mentors & Experts"
        subtitle="Manage mentor profiles, expertise, applications and startup assignments."
      />

      <AdminMetricCards cards={METRICS} />

      <AdminCard
        title="Mentor & expert directory"
        subtitle="Review expertise, availability and mentoring workload."
      >
        <AdminFilterBar
          searchPlaceholder="Search mentor or expertise"
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              value: expertiseFilter,
              onChange: setExpertiseFilter,
              options: [
                { value: "ALL", label: "Expertise ▾" },
                { value: "Business Strategy", label: "Business Strategy" },
                { value: "Technology", label: "Technology" },
                { value: "Marketing", label: "Marketing" },
                { value: "Finance", label: "Finance" },
                { value: "Product Design", label: "Product Design" },
                { value: "Legal & Compliance", label: "Legal & Compliance" },
              ],
            },
            {
              value: availabilityFilter,
              onChange: setAvailabilityFilter,
              options: [
                { value: "ALL", label: "Availability ▾" },
                { value: "Active", label: "Available" },
                { value: "Pending", label: "Pending" },
              ],
            },
          ]}
          actionButtonText="+ Add Mentor"
          onActionClick={() => setShowAddModal(true)}
        />

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>MENTOR / EXPERT</th>
                <th>AREA OF EXPERTISE</th>
                <th>STARTUPS</th>
                <th>RATING</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td style={{ color: "#475569" }}>{item.expertise}</td>
                  <td>{item.startups}</td>
                  <td>{item.rating}</td>
                  <td>
                    <AdminBadge status={item.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                    No mentors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminBanner text="Verify credentials and expertise before assigning mentors to founders." />
      </AdminCard>

      {/* Add Mentor Modal */}
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
              Add New Mentor
            </h3>
            <form onSubmit={handleAdd}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
                  Mentor Name &amp; Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  value={newMentor.name}
                  onChange={(e) => setNewMentor({ ...newMentor, name: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
                  Primary Domain of Expertise
                </label>
                <select
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  value={newMentor.expertise}
                  onChange={(e) => setNewMentor({ ...newMentor, expertise: e.target.value })}
                >
                  <option value="Business Strategy">Business Strategy</option>
                  <option value="Technology">Technology</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Legal & Compliance">Legal & Compliance</option>
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
                  Add Mentor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
