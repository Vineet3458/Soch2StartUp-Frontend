import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { SidebarIcon } from "./sidebarIcons.jsx";

/**
 * Checks if two tab names match, considering standard alias pairs
 */
function tabsMatch(current, target) {
  if (!current || !target) return false;
  if (current === target) return true;

  const aliases = {
    overview: ["system-overview"],
    settings: ["platform-settings"],
    features: ["feature-management"],
    logs: ["system-logs"],
    audit: ["audit-activity"],
    "roles-permissions": ["permissions", "roles"],
    categories: ["idea-categories"],
    engine: ["validation-engine"],
    scoring: ["scoring-configuration"],
    reports: ["analytics-reports", "analytics"],
  };

  for (const [canonical, list] of Object.entries(aliases)) {
    if (
      (current === canonical && list.includes(target)) ||
      (target === canonical && list.includes(current)) ||
      (list.includes(current) && list.includes(target))
    ) {
      return true;
    }
  }
  return false;
}

export default function SidebarItem({
  label,
  icon,
  path,
  badge,
  onClick,
  isSubItem = false,
  isPrimary = false,
  customActive = null,
}) {
  const { user } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab");
  const roleParam = searchParams.get("role");

  // Determine active state: either customActive or matches current pathname + search
  const currentUrl = location.pathname + location.search;
  const isActive = (() => {
    if (customActive !== null) return customActive;
    if (!path) return false;
    if (currentUrl === path) return true;

    // Compare paths and tab parameters
    const [pathBase, pathQuery] = path.split("?");
    const pathParams = new URLSearchParams(pathQuery || "");
    const pathTab = pathParams.get("tab");

    const onAdminOrSuperadmin =
      location.pathname === "/admin" || location.pathname === "/superadmin";
    const pathIsAdmin =
      pathBase === "/admin" || pathBase === "/superadmin";

    if (onAdminOrSuperadmin && pathIsAdmin) {
      if (pathTab && currentTab) {
        return tabsMatch(currentTab, pathTab);
      }
      if (!currentTab) {
        const isSuperAdminContext =
          roleParam === "superadmin" ||
          location.pathname === "/superadmin" ||
          (!roleParam && user?.role === "superadmin");
        if (isSuperAdminContext) {
          return pathTab === "overview" || pathTab === "system-overview";
        }
        return pathTab === "analytics";
      }
    }

    if (path === "/dashboard" && location.pathname === "/dashboard" && !location.search) {
      return true;
    }

    return false;
  })();

  const content = (
    <>
      <span className="sidebar-item-icon-wrap">
        {icon && <SidebarIcon name={icon} size={isSubItem ? 14 : 18} />}
        {isSubItem && !icon && <span className="sidebar-subitem-bullet" />}
      </span>
      <span className="sidebar-item-label">{label}</span>
      {badge !== undefined && badge !== null && (
        <span className="sidebar-item-badge">{badge}</span>
      )}
    </>
  );

  const className = [
    "sidebar-item",
    isPrimary ? "sidebar-item-primary" : "",
    isSubItem ? "sidebar-sub-item" : "",
    isActive ? "active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (onClick && !path) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <Link to={path || "#"} className={className} onClick={onClick}>
      {content}
    </Link>
  );
}
