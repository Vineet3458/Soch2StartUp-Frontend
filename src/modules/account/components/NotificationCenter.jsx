import { useState } from "react";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "New Mentor Feedback Received",
    description: "Rohan Sharma (Mentor) posted strategic guidance on KrishiMitra AI: 'Strong wedge via WhatsApp. Focus early GTM on FPOs.'",
    category: "feedback",
    timestamp: "2 hours ago",
    read: false,
    icon: "💬",
  },
  {
    id: 2,
    title: "AI Idea Validation Complete",
    description: "KrishiMitra AI achieved an AI viability score of 79/100 (Verdict: GO - High Potential).",
    category: "reports",
    timestamp: "5 hours ago",
    read: false,
    icon: "✦",
  },
  {
    id: 3,
    title: "Platform Security & Model Update",
    description: "Gemini 2.0 Flash engine upgraded for faster response times and improved market calibration.",
    category: "system",
    timestamp: "1 day ago",
    read: true,
    icon: "⚙️",
  },
  {
    id: 4,
    title: "Ecosystem Peer Review Available",
    description: "Ananya Verma (Industry Expert) verified unit economics for KiranaFlow restock logistics.",
    category: "feedback",
    timestamp: "2 days ago",
    read: true,
    icon: "📝",
  },
];

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "feedback") return n.category === "feedback";
    if (filter === "reports") return n.category === "reports";
    return true;
  });

  return (
    <div className="notification-center-card card">
      <div className="notif-center-header">
        <div>
          <h3>Notification Center 🔔</h3>
          <p className="muted small">
            Stay informed on AI evaluations, mentor feedback, and platform alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button type="button" className="btn btn-outline btn-sm" onClick={markAllRead}>
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      <div className="notif-category-tabs">
        <button
          type="button"
          className={`filter-tab-pill ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${filter === "unread" ? "active" : ""}`}
          onClick={() => setFilter("unread")}
        >
          Unread ({unreadCount})
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${filter === "feedback" ? "active" : ""}`}
          onClick={() => setFilter("feedback")}
        >
          Mentor &amp; Feedback
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${filter === "reports" ? "active" : ""}`}
          onClick={() => setFilter("reports")}
        >
          AI Reports
        </button>
      </div>

      <div className="notif-items-list">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`notification-list-row ${!item.read ? "unread" : ""}`}
            onClick={() => markOneRead(item.id)}
          >
            <span className="notif-icon-badge">{item.icon}</span>
            <div className="notif-content-cell">
              <div className="notif-title-row">
                <strong>{item.title}</strong>
                <small className="muted">{item.timestamp}</small>
              </div>
              <p className="notif-desc-text">{item.description}</p>
            </div>
            {!item.read && <span className="unread-dot" title="Unread" />}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card center empty-state-box">
            <span className="empty-icon">🔔</span>
            <p className="muted">No notifications in this view.</p>
          </div>
        )}
      </div>
    </div>
  );
}
