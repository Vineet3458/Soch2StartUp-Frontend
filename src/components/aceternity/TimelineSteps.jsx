import { SpotlightCard } from "./SpotlightCard.jsx";

export function TimelineSteps({ steps = [], className = "" }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className={`aceternity-timeline-steps ${className}`}>
      <div className="timeline-connecting-beam" aria-hidden="true" />
      <div className="timeline-steps-grid">
        {steps.map((step, idx) => {
          const isStringArray = Array.isArray(step);
          const title = isStringArray ? step[0] : step.title;
          const desc = isStringArray ? step[1] : step.desc;
          const tag = !isStringArray ? step.tag : null;
          const icon = !isStringArray ? step.icon : null;

          return (
            <div key={title || idx} className="timeline-step-column">
              <div className="timeline-step-indicator">
                <div className="timeline-step-node">
                  <span className="step-num">{idx + 1}</span>
                  <div className="step-node-glow" aria-hidden="true" />
                </div>
              </div>
              <SpotlightCard className="timeline-step-card">
                <div className="step-card-header">
                  {tag && <span className="step-tag">{tag}</span>}
                  {icon && <span className="step-icon">{icon}</span>}
                </div>
                <h3 className="step-title">{title}</h3>
                <p className="step-desc">{desc}</p>
              </SpotlightCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
