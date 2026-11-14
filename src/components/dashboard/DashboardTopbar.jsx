import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { SidebarIcon } from "../sidebar/sidebarIcons.jsx";
import { getSidebarConfig } from "../sidebar/sidebarConfig.js";

export default function DashboardTopbar({ onSearch = null }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef(null);

  const roleParam = searchParams.get("role");
  const isOnAdmin = location.pathname.startsWith("/admin") || location.pathname.startsWith("/superadmin");
  const role =
    roleParam ||
    (isOnAdmin
      ? user?.role === "superadmin" || location.pathname.startsWith("/superadmin")
        ? "superadmin"
        : "admin"
      : user?.role || "entrepreneur");
  const config = getSidebarConfig(role);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getInitials = () => {
    if (role === "admin") return "AD";
    if (role === "superadmin") return "SA";
    if (role === "mentor") return "ME";
    if (role === "industry_expert" || role === "evaluator") return "EV";
    if (role === "moderator") return "MO";
    if (user?.name) {
      const parts = user.name.split(" ");
      return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
    }
    return "EN";
  };

  const getRoleDisplayName = () => {
    if (role === "admin") return "Admin";
    if (role === "superadmin") return "Superadmin";
    if (role === "mentor") return "Mentor";
    if (role === "industry_expert" || role === "evaluator") return "Evaluator";
    if (role === "moderator") return "Moderator";
    return user?.name?.split(" ")[0] || "Founder";
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setShowSearchResults(val.trim().length > 0);
    if (onSearch) onSearch(val);
  };

  const isSuper = role === "superadmin";
  const superPrefix = isSuper ? "/admin?role=superadmin&tab=" : "/admin?tab=";

  const QUICK_LINKS = [
    // 11 SuperAdmin Modules
    { label: "System Overview", path: `${superPrefix}overview`, tag: "Control Center" },
    { label: "Platform Settings", path: `${superPrefix}settings`, tag: "Control Center" },
    { label: "Feature Management", path: `${superPrefix}features`, tag: "Control Center" },
    { label: "System Logs", path: `${superPrefix}logs`, tag: "Security" },
    { label: "Audit & Activity", path: `${superPrefix}audit`, tag: "Security" },
    { label: "Roles & Permissions", path: `${superPrefix}roles-permissions`, tag: "Security" },
    { label: "Idea Categories", path: `${superPrefix}categories`, tag: "Intelligence" },
    { label: "Validation Engine", path: `${superPrefix}engine`, tag: "Intelligence" },
    { label: "Scoring Configuration", path: `${superPrefix}scoring`, tag: "Intelligence" },
    { label: "Integrations", path: `${superPrefix}integrations`, tag: "Platform Services" },
    { label: "Analytics & Reports", path: `${superPrefix}reports`, tag: "Platform Services" },

    // 11 Mentor Modules
    { label: "My Assignments", path: "/dashboard?tab=assignments&role=mentor", tag: "Mentor" },
    { label: "In Progress Mentoring", path: "/dashboard?tab=in-progress&role=mentor", tag: "Mentor" },
    { label: "Completed Assignments", path: "/dashboard?tab=completed&role=mentor", tag: "Mentor" },
    { label: "Archived Mentoring", path: "/dashboard?tab=archived&role=mentor", tag: "Mentor" },
    { label: "Schedule Mentor Session", path: "/dashboard?tab=schedule&role=mentor", tag: "Mentor" },
    { label: "Mentor Session History", path: "/dashboard?tab=history&role=mentor", tag: "Mentor" },
    { label: "Provide Guidance", path: "/dashboard?tab=guidance&role=mentor", tag: "Mentor" },
    { label: "Mentor Feedback Inbox", path: "/dashboard?tab=my-feedback&role=mentor", tag: "Mentor" },
    { label: "Mentor Knowledge Base", path: "/dashboard?tab=knowledge&role=mentor", tag: "Mentor" },
    { label: "Mentor Templates", path: "/dashboard?tab=templates&role=mentor", tag: "Mentor" },
    { label: "Mentor Best Practices", path: "/dashboard?tab=best-practices&role=mentor", tag: "Mentor" },

    // Admin & Entrepreneur Module Links
    { label: "Startup Ideas", path: "/dashboard?tab=all", tag: "Module" },
    { label: "Validation Reports", path: "/dashboard?view=reports", tag: "Reports" },
    { label: "Market Insights", path: "/dashboard?view=market", tag: "Analytics" },
    { label: "Users Management", path: "/admin?tab=users", tag: "Admin" },
    { label: "Role Management", path: "/admin?tab=roles", tag: "Admin" },
    { label: "Smart Hostel Marketplace", path: "/dashboard?tab=submitted", tag: "Idea" },
    { label: "AI Travel Assistant", path: "/dashboard?tab=validated", tag: "Idea" },
    { label: "KrishiMitra AI", path: "/dashboard?tab=validated", tag: "Idea" },
  ];

  const filteredLinks = QUICK_LINKS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const getSearchPlaceholder = () => {
    if (role === "superadmin") {
      return "Search settings, users, logs and reports...";
    }
    if (role === "mentor") {
      return "Search assigned startups, sessions, guidance, playbooks...";
    }
    const tab = searchParams.get("tab");
    if (["ideas", "review", "approved", "rejected"].includes(tab)) {
      return "Search startup ideas, founders...";
    }
    if (["reports", "mentors", "requests", "analytics"].includes(tab)) {
      return "Search platform records...";
    }
    return "Search users, ideas, reports...";
  };

  return (
    <header className="dashboard-topbar">
      {/* 1. Global Search Box with Ctrl + K */}
      <div className="dashboard-search-wrap">
        <span className="search-icon-wrap">
          <SidebarIcon name="search" size={17} color="#94A3B8" />
        </span>
        <input
          ref={searchInputRef}
          type="text"
          className="dashboard-search-input"
          placeholder={getSearchPlaceholder()}
          value={query}
          onChange={handleSearchChange}
          onFocus={() => query.trim() && setShowSearchResults(true)}
          onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
        />
        <kbd className="search-kbd-pill">Ctrl + K</kbd>

        {showSearchResults && filteredLinks.length > 0 && (
          <div className="search-dropdown-results">
            {filteredLinks.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="search-result-item"
                onMouseDown={() => {
                  navigate(item.path);
                  setQuery("");
                  setShowSearchResults(false);
                }}
              >
                <span className="search-result-title">{item.label}</span>
                <span className="search-result-tag">{item.tag}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Right Section: Notification & User Pill */}
      <div className="dashboard-topbar-actions">
        {/* User Avatar & Name Pill matching screenshots: ● Admin ▾ */}
        <div className="user-profile-pill-wrap">
          <button
            type="button"
            className="user-profile-pill"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <span style={{ color: "#0f172a", fontSize: "11px", marginRight: "6px" }}>●</span>
            <span className="user-profile-name">{getRoleDisplayName()}</span>
            <SidebarIcon name="chevron-down" size={13} color="#64748B" />
          </button>

          {showProfileMenu && (
            <div className="user-profile-popover">
              <div className="profile-popover-header">
                <strong>{user?.name || getRoleDisplayName()}</strong>
                <small>{user?.email || `${role}@soch2startup.com`}</small>
                <span className="profile-popover-role-tag">{config.roleCard.title}</span>
              </div>
              <div className="profile-popover-divider" />
              <button
                type="button"
                className="profile-popover-item"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/dashboard?view=profile");
                }}
              >
                <SidebarIcon name="user" size={15} /> My Profile
              </button>
              <button
                type="button"
                className="profile-popover-item"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/dashboard?view=settings");
                }}
              >
                <SidebarIcon name="settings" size={15} /> Settings
              </button>
              <div className="profile-popover-divider" />
              <button
                type="button"
                className="profile-popover-item text-danger"
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  navigate("/");
                }}
              >
                <SidebarIcon name="logout" size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
