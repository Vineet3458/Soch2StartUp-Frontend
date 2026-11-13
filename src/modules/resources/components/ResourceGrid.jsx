import React from "react";
import ResourceCard from "./ResourceCard.jsx";

export default function ResourceGrid({ resources = [], onSelect }) {
  if (resources.length === 0) {
    return (
      <div className="card center empty-state-box">
        <span className="empty-icon">📚</span>
        <h3>No resources found</h3>
        <p className="muted small">Try selecting another category or clearing your search.</p>
      </div>
    );
  }

  return (
    <div className="module-grid-layout">
      {resources.map((res) => (
        <ResourceCard key={res.id} resource={res} onSelect={onSelect} />
      ))}
    </div>
  );
}
