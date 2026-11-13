import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarIcon } from "./sidebarIcons.jsx";

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
  const location = useLocation();

  // Determine active state: either customActive or matches current pathname + search
  const currentUrl = location.pathname + location.search;
  const isActive =
    customActive !== null
      ? customActive
      : path
      ? currentUrl === path || (path === "/dashboard" && location.pathname === "/dashboard" && !location.search)
      : false;

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
