import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SidebarIcon } from "./sidebarIcons.jsx";
import SidebarItem from "./SidebarItem.jsx";

export default function SidebarGroup({
  label,
  icon,
  children = [],
  defaultExpanded = true,
  onItemClick,
}) {
  const location = useLocation();
  const currentUrl = location.pathname + location.search;
  const hasActiveChild = children.some(
    (child) => child.path === currentUrl || (child.path && currentUrl.startsWith(child.path) && location.search)
  );

  const [isOpen, setIsOpen] = useState(defaultExpanded || hasActiveChild);

  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  const toggleGroup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar-group ${isOpen ? "open" : "collapsed"}`}>
      <button
        type="button"
        className="sidebar-group-header"
        onClick={toggleGroup}
        aria-expanded={isOpen}
      >
        <div className="sidebar-group-header-left">
          <span className="sidebar-item-icon-wrap">
            {icon && <SidebarIcon name={icon} size={18} />}
          </span>
          <span className="sidebar-group-title">{label}</span>
        </div>
        <span className={`sidebar-group-chevron ${isOpen ? "expanded" : ""}`}>
          <SidebarIcon name="chevron-down" size={14} />
        </span>
      </button>

      {isOpen && (
        <div className="sidebar-group-children">
          <div className="sidebar-sub-tree-line" />
          <div className="sidebar-sub-items-list">
            {children.map((child) => (
              <SidebarItem
                key={child.id || child.label}
                label={child.label}
                path={child.path}
                badge={child.badge}
                isSubItem={true}
                onClick={onItemClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
