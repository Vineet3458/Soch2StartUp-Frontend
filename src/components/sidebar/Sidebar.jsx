import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { getSidebarConfig, ALL_ROLES } from "./sidebarConfig.js";
import SidebarItem from "./SidebarItem.jsx";
import SidebarGroup from "./SidebarGroup.jsx";
import { SidebarIcon } from "./sidebarIcons.jsx";
import "./sidebar.css";

export default function Sidebar({ roleOverride = null, onNavigate = null }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Selected role: either explicit override, user's authenticated role, or default "entrepreneur"
  const currentRole = roleOverride || user?.role || "entrepreneur";
  const [activeRole, setActiveRole] = useState(currentRole);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  // Synchronize activeRole whenever authenticated user role updates
  useEffect(() => {
    if (user?.role && !roleOverride) {
      setActiveRole(user.role);
    }
  }, [user?.role, roleOverride]);

  // Determine effective role configuration
  const effectiveRole = roleOverride || activeRole;
  const config = getSidebarConfig(effectiveRole);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleItemClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <aside className="app-sidebar-container">
      {/* 1. BRAND LOGO HEADER */}
      <div className="sidebar-brand-header">
        <Link to="/" className="sidebar-brand-link">
          <img
            src="/assets/nav-logo-hd.png"
            alt="Soch2Startup"
            className="sidebar-brand-logo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="sidebar-brand-text">
            Soch<span>2</span>Startup
          </span>
        </Link>
      </div>

      {/* Role Switcher Pill (Preview / Switch between roles seamlessly) */}
      <div className="sidebar-role-selector-bar">
        <button
          type="button"
          className="sidebar-role-selector-btn"
          onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
          title="Click to preview sidebar for other roles"
        >
          <span className="role-selector-indicator">●</span>
          <span className="role-selector-text">View: {config.roleCard.title}</span>
          <SidebarIcon name="chevron-down" size={12} />
        </button>

        {showRoleSwitcher && (
          <div className="sidebar-role-dropdown-popover">
            <div className="role-dropdown-title">Preview Role Sidebar:</div>
            {ALL_ROLES.map((r) => (
              <button
                key={r.key}
                type="button"
                className={`role-dropdown-option ${
                  effectiveRole === r.key ? "selected" : ""
                }`}
                onClick={() => {
                  setActiveRole(r.key);
                  setShowRoleSwitcher(false);
                }}
              >
                <strong>{r.label}</strong>
                <small>{r.subtitle}</small>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. TOP PRIMARY NAVIGATION (DASHBOARD) */}
      <div className="sidebar-top-primary-wrap">
        <SidebarItem
          label="Dashboard"
          icon="home"
          path="/dashboard"
          isPrimary={true}
          onClick={handleItemClick}
        />
      </div>

      {/* 3. SCROLLABLE ROLE-SPECIFIC MENU */}
      <div className="sidebar-scrollable-menu-area">
        <nav className="sidebar-nav-list">
          {config.menu.map((item) => {
            if (item.isGroup) {
              return (
                <SidebarGroup
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  children={item.children}
                  defaultExpanded={item.defaultExpanded ?? true}
                  onItemClick={handleItemClick}
                />
              );
            }

            return (
              <SidebarItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                path={item.path}
                badge={item.badge}
                onClick={handleItemClick}
              />
            );
          })}
        </nav>
      </div>

      {/* 4. BOTTOM FIXED COMMON SECTION */}
      <div className="sidebar-bottom-fixed-section">
        <div className="sidebar-divider-line" />

        <div className="sidebar-common-menu">
          <SidebarItem
            label="Notifications"
            icon="bell"
            path="/dashboard?view=notifications"
            badge={config.notificationCount}
            onClick={handleItemClick}
          />
          <SidebarItem
            label="My Profile"
            icon="user"
            path="/dashboard?view=profile"
            onClick={handleItemClick}
          />
          <SidebarItem
            label="Settings"
            icon="settings"
            path="/dashboard?view=settings"
            onClick={handleItemClick}
          />
          <SidebarItem
            label="Logout"
            icon="logout"
            onClick={handleLogout}
          />
        </div>

        {/* 5. ROLE IDENTITY CARD */}
        <div className="sidebar-role-card">
          <div className="role-card-icon-wrap">
            <SidebarIcon name={config.roleCard.icon} size={20} color="#FFFFFF" />
          </div>
          <div className="role-card-info">
            <h4 className="role-card-title">{config.roleCard.title}</h4>
            <p className="role-card-subtitle">{config.roleCard.subtitle}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
