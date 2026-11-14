import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { getSidebarConfig, ALL_ROLES } from "./sidebarConfig.js";
import SidebarItem from "./SidebarItem.jsx";
import SidebarGroup from "./SidebarGroup.jsx";
import { SidebarIcon } from "./sidebarIcons.jsx";
import "./sidebar.css";

export default function Sidebar({ roleOverride = null, onNavigate = null }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");

  const isOnAdmin = location.pathname.startsWith("/admin") || location.pathname.startsWith("/superadmin");
  const fallbackRole = isOnAdmin
    ? user?.role === "superadmin" || location.pathname.startsWith("/superadmin")
      ? "superadmin"
      : "admin"
    : user?.role || "entrepreneur";
  const currentRole = roleOverride || roleParam || fallbackRole;
  const [activeRole, setActiveRole] = useState(currentRole);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  useEffect(() => {
    if (roleParam) {
      setActiveRole(roleParam);
    } else if (roleOverride) {
      setActiveRole(roleOverride);
    } else if (user?.role) {
      setActiveRole(user.role);
    } else if (isOnAdmin) {
      setActiveRole(location.pathname.startsWith("/superadmin") ? "superadmin" : "admin");
    }
  }, [roleParam, user?.role, roleOverride, isOnAdmin, location.pathname]);

  const effectiveRole = roleOverride || roleParam || activeRole;
  const config = getSidebarConfig(effectiveRole);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleItemClick = () => {
    if (onNavigate) onNavigate();
  };

  const resolveItemPath = (path) => {
    if (!path) return path;
    let target = path;

    // If currently on /superadmin route, preserve /superadmin as the base path
    if (location.pathname.startsWith("/superadmin") && target.startsWith("/admin")) {
      target = target.replace(/^\/admin/, "/superadmin");
    }

    // Preserve roleParam if present in current URL
    if (roleParam && !target.includes("role=")) {
      const sep = target.includes("?") ? "&" : "?";
      return `${target}${sep}role=${roleParam}`;
    }

    // If viewing superadmin console, maintain role=superadmin across tab clicks
    if (
      effectiveRole === "superadmin" &&
      target.startsWith("/admin") &&
      !target.includes("role=") &&
      user?.role !== "superadmin"
    ) {
      const sep = target.includes("?") ? "&" : "?";
      return `${target}${sep}role=superadmin`;
    }

    return target;
  };

  return (
    <aside className="app-sidebar-container cosmic-sidebar">
      {/* 1. BRAND LOGO HEADER WITH FOUNDERVERSE TAGLINE */}
      <div className="sidebar-brand-header">
        <Link to="/" className="sidebar-brand-link" title="Soch2Startup Home">
          <img
            src="/assets/founderverse/s-mark-retina.png"
            alt="Soch2Startup Logo"
            className="sidebar-brand-logo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fb = e.currentTarget.nextElementSibling;
              if (fb) fb.style.display = "flex";
            }}
          />
          <div className="sidebar-brand-logo-fallback" style={{ display: "none" }}>
            <span>S</span>
          </div>
          <div className="sidebar-brand-text-group">
            <span className="sidebar-brand-text">
              Soch<span>2</span>Startup
            </span>
            <span className="sidebar-brand-tagline">
              {effectiveRole === "superadmin"
                ? "SUPERADMIN CONSOLE"
                : effectiveRole === "admin"
                ? "ADMIN WORKSPACE"
                : "Idea → Validate → Build → Grow"}
            </span>
          </div>
        </Link>
      </div>

      {/* Role Switcher Pill */}
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
                  if (r.key === "superadmin") {
                    navigate("/admin?role=superadmin&tab=overview");
                  } else if (r.key === "admin") {
                    navigate("/admin?role=admin&tab=analytics");
                  } else {
                    navigate(`/dashboard?role=${r.key}`);
                  }
                }}
              >
                <strong>{r.label}</strong>
                <small>{r.subtitle}</small>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. OVERVIEW SECTION (DASHBOARD) - Hidden for Superadmin as CONTROL CENTER -> System Overview is primary */}
      {effectiveRole !== "superadmin" && (
        <div className="sidebar-section-block">
          <span className="sidebar-section-label">OVERVIEW</span>
          <SidebarItem
            label="Dashboard"
            icon="home"
            path={
              effectiveRole === "admin"
                ? "/admin?tab=analytics"
                : roleParam
                ? `/dashboard?role=${roleParam}`
                : "/dashboard"
            }
            isPrimary={false}
            onClick={handleItemClick}
          />
        </div>
      )}

      {/* 3. SCROLLABLE CATEGORIZED ROLE MENU */}
      <div className="sidebar-scrollable-menu-area">
        <nav className="sidebar-nav-list">
          {config.sections ? (
            config.sections.map((sec, sIdx) => (
              <div key={sIdx} className="sidebar-section-block">
                <span className="sidebar-section-label">{sec.title}</span>
                {sec.items.map((item) => {
                  if (item.isGroup) {
                    return (
                      <SidebarGroup
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        children={item.children?.map((c) => ({
                          ...c,
                          path: resolveItemPath(c.path),
                        }))}
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
                      path={resolveItemPath(item.path)}
                      badge={item.badge}
                      onClick={handleItemClick}
                    />
                  );
                })}
              </div>
            ))
          ) : (
            config.menu.map((item) => {
              if (item.isGroup) {
                return (
                  <SidebarGroup
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    children={item.children?.map((c) => ({
                      ...c,
                      path: resolveItemPath(c.path),
                    }))}
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
                  path={resolveItemPath(item.path)}
                  badge={item.badge}
                  onClick={handleItemClick}
                />
              );
            })
          )}
        </nav>
      </div>

      {/* 4. BOTTOM FIXED COMMON SECTION */}
      <div className="sidebar-bottom-fixed-section">
        <div className="sidebar-divider-line" />

        <div className="sidebar-common-menu">
          {effectiveRole !== "superadmin" && (
            <SidebarItem
              label="Settings"
              icon="settings"
              path="/dashboard?view=settings"
              onClick={handleItemClick}
            />
          )}
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
            label="Logout"
            icon="logout"
            onClick={handleLogout}
          />
        </div>

        {/* 5. ROLE IDENTITY CARD - Hidden for Superadmin matching UI screenshots */}
        {effectiveRole !== "superadmin" && (
          <div className="sidebar-role-card">
            <div className="role-card-icon-wrap">
              <SidebarIcon name={config.roleCard.icon} size={20} color="#FFFFFF" />
            </div>
            <div className="role-card-info">
              <h4 className="role-card-title">{config.roleCard.title}</h4>
              <p className="role-card-subtitle">{config.roleCard.subtitle}</p>
            </div>
          </div>
        )}
      </div>

      {/* 6. SUBTLE PLANET HORIZON WATERMARK (From Image 3) */}
      <div className="sidebar-planet-watermark" aria-hidden="true">
        <img
          src="/assets/founderverse/sidebar-planet.png"
          alt=""
          className="sidebar-planet-img"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    </aside>
  );
}
