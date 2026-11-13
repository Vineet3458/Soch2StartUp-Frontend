import { useState } from "react";

export default function SettingsView() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [reportReadyAlerts, setReportReadyAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="card settings-view-card" style={{ maxWidth: "780px", margin: "0 auto" }}>
      <div className="settings-header">
        <h3>Platform &amp; Account Settings ⚙️</h3>
        <p className="muted small">Customize notification channels, privacy controls, and security.</p>
      </div>

      {savedSuccess && <div className="success-banner">Preferences saved successfully!</div>}

      <form onSubmit={handleSave}>
        {/* Notification Settings */}
        <div className="settings-section">
          <h4>Email &amp; In-App Notifications</h4>
          <p className="muted small">Choose which events trigger real-time alerts.</p>

          <label className="settings-toggle-row">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
            />
            <div>
              <strong>Mentor &amp; Evaluator Feedback</strong>
              <p className="muted small">Receive an email when an advisor reviews your startup.</p>
            </div>
          </label>

          <label className="settings-toggle-row">
            <input
              type="checkbox"
              checked={reportReadyAlerts}
              onChange={(e) => setReportReadyAlerts(e.target.checked)}
            />
            <div>
              <strong>Validation Report Ready</strong>
              <p className="muted small">Alert when Gemini completes scoring your startup idea.</p>
            </div>
          </label>

          <label className="settings-toggle-row">
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => setWeeklyDigest(e.target.checked)}
            />
            <div>
              <strong>Weekly Ecosystem Digest</strong>
              <p className="muted small">Curated industry trends, venture benchmarks, and grant updates.</p>
            </div>
          </label>
        </div>

        <hr style={{ margin: "24px 0", borderColor: "var(--border)" }} />

        {/* Security Section */}
        <div className="settings-section">
          <h4>Account Security</h4>
          <p className="muted small">Manage session expiration and authentication.</p>
          <div className="grid grid-2" style={{ marginTop: "12px" }}>
            <div>
              <label>Current Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div>
              <label>New Password (min 6 chars)</label>
              <input type="password" placeholder="••••••••" />
            </div>
          </div>
        </div>

        <div className="settings-footer-actions" style={{ marginTop: "24px" }}>
          <button type="submit" className="btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
