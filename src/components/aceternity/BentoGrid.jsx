import { SpotlightCard } from "./SpotlightCard.jsx";

export function BentoGrid({ className = "", children, ...props }) {
  return (
    <div className={`aceternity-bento-grid ${className}`} {...props}>
      {children}
    </div>
  );
}

export function BentoGridItem({
  className = "",
  title,
  description,
  header,
  icon,
  badge,
  spotlightColor,
  children,
  ...props
}) {
  return (
    <SpotlightCard
      className={`aceternity-bento-item ${className}`}
      spotlightColor={spotlightColor}
      {...props}
    >
      {header && <div className="bento-header">{header}</div>}
      <div className="bento-body">
        {(icon || badge) && (
          <div className="bento-meta">
            {icon && <div className="bento-icon">{icon}</div>}
            {badge && <span className="bento-badge">{badge}</span>}
          </div>
        )}
        {title && <h3 className="bento-title">{title}</h3>}
        {description && <p className="bento-desc">{description}</p>}
        {children}
      </div>
    </SpotlightCard>
  );
}
