import { useState } from "react";
import { Link } from "react-router-dom";

export function CardHoverEffect({
  items = [],
  className = "",
  renderItem,
  children,
  ...props
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (children) {
    return (
      <div className={`aceternity-hover-grid ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={`aceternity-hover-grid ${className}`} {...props}>
      {items.map((item, idx) => {
        const isHovered = hoveredIdx === idx;
        const Component = item.to ? Link : "div";
        const linkProps = item.to ? { to: item.to } : {};
        const Icon = item.icon;

        return (
          <Component
            key={item.key || item.to || idx}
            {...linkProps}
            className={`aceternity-hover-card-wrapper ${item.className || ""}`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div
              className={`aceternity-hover-backdrop ${isHovered ? "active" : ""}`}
              aria-hidden="true"
            />
            <div className="aceternity-hover-card-inner">
              {renderItem ? (
                renderItem(item, idx, isHovered)
              ) : (
                <>
                  <div className="hover-card-header">
                    {Icon && (
                      <div className="hover-card-icon">
                        <Icon size={20} />
                      </div>
                    )}
                    {item.badge && <span className="hover-card-badge">{item.badge}</span>}
                  </div>
                  {item.title && <div className="hover-card-title">{item.title}</div>}
                  {item.description && (
                    <div className="hover-card-desc">{item.description}</div>
                  )}
                  {item.footer && <div className="hover-card-footer">{item.footer}</div>}
                </>
              )}
            </div>
          </Component>
        );
      })}
    </div>
  );
}
