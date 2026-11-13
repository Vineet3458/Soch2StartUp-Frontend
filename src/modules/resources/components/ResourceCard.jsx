import React from "react";

export default function ResourceCard({ resource, onSelect }) {
  const { title, category, description, tags = [], readTime, fileType, icon = "📄" } = resource;

  return (
    <div className="card hover resource-card-item">
      <div className="resource-card-top">
        <span className="resource-card-icon">{icon}</span>
        <div className="resource-card-badges">
          <span className="resource-category-pill">{category}</span>
          {fileType && <span className="resource-file-pill">{fileType}</span>}
        </div>
      </div>

      <h4 className="resource-card-title">{title}</h4>
      <p className="resource-card-desc">{description}</p>

      <div className="resource-tags-row">
        {tags.map((t, idx) => (
          <span key={idx} className="resource-tag-item">
            #{t}
          </span>
        ))}
      </div>

      <div className="resource-card-footer">
        <small className="muted">{readTime || "5 min read"}</small>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => onSelect && onSelect(resource)}
        >
          View Resource →
        </button>
      </div>
    </div>
  );
}
