import { useState } from "react";
import NotificationCenter from "./components/NotificationCenter.jsx";
import ProfileView from "./components/ProfileView.jsx";
import SettingsView from "./components/SettingsView.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AccountShellModule({ defaultView = "profile" }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultView);

  return (
    <div className="account-shell-module-root">
      {/* Top Tab Navigation */}
      <div className="account-sub-nav no-print" style={{ marginBottom: "20px" }}>
        <button
          type="button"
          className={`filter-tab-pill ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          👤 My Profile
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${activeTab === "notifications" ? "active" : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          🔔 Notifications
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Render Active View */}
      {activeTab === "profile" && <ProfileView user={user} />}
      {activeTab === "notifications" && <NotificationCenter />}
      {activeTab === "settings" && <SettingsView />}
    </div>
  );
}
