import React from "react";
import {
  AdminPageHeader,
  AdminMetricCards,
  AdminCard,
} from "../AdminSharedComponents.jsx";

const METRICS = [
  {
    title: "Total roles",
    value: "5",
    sub: "Defined platform roles",
    subType: "green",
    iconColor: "purple",
  },
  {
    title: "Active permissions",
    value: "42",
    sub: "Permission keys configured",
    subType: "green",
    iconColor: "cyan",
  },
  {
    title: "Custom role groups",
    value: "2",
    sub: "Additional access groups",
    subType: "green",
    iconColor: "green",
  },
  {
    title: "Recent changes",
    value: "6",
    sub: "Changes in last 30 days",
    subType: "green",
    iconColor: "orange",
  },
];

const PLATFORM_ROLES = [
  {
    name: "Superadmin",
    desc: "Full platform control",
    count: 1,
    colorClass: "superadmin",
  },
  {
    name: "Admin",
    desc: "Platform operations",
    count: 4,
    colorClass: "admin",
  },
  {
    name: "Entrepreneur",
    desc: "Startup founder",
    count: 986,
    colorClass: "entrepreneur",
  },
  {
    name: "Mentor",
    desc: "Guidance and support",
    count: 41,
    colorClass: "mentor",
  },
  {
    name: "Evaluator",
    desc: "Assess and rate ideas",
    count: 16,
    colorClass: "evaluator",
  },
];

const PERMISSIONS = [
  { name: "Users: view", sa: true, ad: true, en: false, me: false, ev: false },
  { name: "Users: manage", sa: true, ad: true, en: false, me: false, ev: false },
  { name: "Ideas: review", sa: true, ad: true, en: false, me: false, ev: true },
  { name: "Reports: view", sa: true, ad: true, en: true, me: true, ev: true },
  { name: "Platform settings", sa: true, ad: false, en: false, me: false, ev: false },
];

export default function RoleManagementTab() {
  return (
    <div className="admin-tab-roles-root">
      <AdminPageHeader
        title="Role Management"
        subtitle="Configure platform roles and control access through permissions."
      />

      <AdminMetricCards cards={METRICS} />

      <div className="admin-roles-grid">
        {/* Left Column: Platform roles */}
        <AdminCard title="Platform roles">
          <div className="admin-roles-list">
            {PLATFORM_ROLES.map((r, idx) => (
              <div key={idx} className="admin-role-row-card">
                <div className="admin-role-row-left">
                  <div className={`admin-role-box-icon ${r.colorClass}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="7.5" stroke="#ffffff" strokeWidth="2.5" />
                      <circle cx="12" cy="12" r="3" fill="#ffffff" />
                    </svg>
                  </div>
                  <div className="admin-role-row-info">
                    <h4>{r.name}</h4>
                    <p>{r.desc}</p>
                  </div>
                </div>
                <span className="admin-role-row-count">{r.count}</span>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Right Column: Permission matrix */}
        <AdminCard
          title="Permission matrix"
          subtitle="Example access configuration by role."
        >
          <div className="admin-table-wrap">
            <table className="admin-matrix-table">
              <thead>
                <tr>
                  <th>PERMISSION</th>
                  <th>SA</th>
                  <th>AD</th>
                  <th>EN</th>
                  <th>ME</th>
                  <th>EV</th>
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.name}</td>
                    <td>
                      {p.sa ? (
                        <span className="matrix-check">✓</span>
                      ) : (
                        <span className="matrix-dash">—</span>
                      )}
                    </td>
                    <td>
                      {p.ad ? (
                        <span className="matrix-check">✓</span>
                      ) : (
                        <span className="matrix-dash">—</span>
                      )}
                    </td>
                    <td>
                      {p.en ? (
                        <span className="matrix-check">✓</span>
                      ) : (
                        <span className="matrix-dash">—</span>
                      )}
                    </td>
                    <td>
                      {p.me ? (
                        <span className="matrix-check">✓</span>
                      ) : (
                        <span className="matrix-dash">—</span>
                      )}
                    </td>
                    <td>
                      {p.ev ? (
                        <span className="matrix-check">✓</span>
                      ) : (
                        <span className="matrix-dash">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-matrix-footer">
            SA Superadmin • AD Admin • EN Entrepreneur • ME Mentor • EV Evaluator
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
