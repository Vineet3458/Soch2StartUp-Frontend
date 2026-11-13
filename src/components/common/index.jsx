import React from "react";

export function Badge({ children, variant = "default", className = "" }) {
  const variantStyles = {
    default: "badge-default",
    primary: "badge-primary",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
    outline: "badge-outline",
    GO: "badge-GO",
    IMPROVE: "badge-IMPROVE",
    AVOID: "badge-AVOID",
  };

  const styleClass = variantStyles[variant] || "badge-default";

  return <span className={`ui-badge ${styleClass} ${className}`}>{children}</span>;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  type = "button",
  className = "",
  icon = null,
}) {
  const btnClass = [
    "ui-btn",
    `ui-btn-${variant}`,
    `ui-btn-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={btnClass} disabled={disabled} onClick={onClick}>
      {icon && <span className="ui-btn-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export function Modal({ isOpen, onClose, title, children, footer = null, maxWidth = 560 }) {
  if (!isOpen) return null;

  return (
    <div className="ui-modal-overlay" onClick={onClose}>
      <div
        className="ui-modal-card"
        style={{ maxWidth: `${maxWidth}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ui-modal-header">
          <h3 className="ui-modal-title">{title}</h3>
          <button type="button" className="ui-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="ui-modal-body">{children}</div>
        {footer && <div className="ui-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="ui-tabs-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`ui-tab-item ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon && <span className="ui-tab-icon">{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span className="ui-tab-count">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
