import { useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/admin.css";
import "../styles/superadmin.css";

// 12 Admin Role Modules matching UI Screenshots
import RoleManagementTab from "../modules/admin/tabs/RoleManagementTab.jsx";
import AllUsersTab from "../modules/admin/tabs/AllUsersTab.jsx";
import PendingVerificationTab from "../modules/admin/tabs/PendingVerificationTab.jsx";
import BlockedUsersTab from "../modules/admin/tabs/BlockedUsersTab.jsx";
import AllIdeasTab from "../modules/admin/tabs/AllIdeasTab.jsx";
import PendingReviewTab from "../modules/admin/tabs/PendingReviewTab.jsx";
import ApprovedIdeasTab from "../modules/admin/tabs/ApprovedIdeasTab.jsx";
import RejectedIdeasTab from "../modules/admin/tabs/RejectedIdeasTab.jsx";
import ValidationReportsTab from "../modules/admin/tabs/ValidationReportsTab.jsx";
import MentorsExpertsTab from "../modules/admin/tabs/MentorsExpertsTab.jsx";
import RequestsApprovalsTab from "../modules/admin/tabs/RequestsApprovalsTab.jsx";
import AnalyticsInsightsTab from "../modules/admin/tabs/AnalyticsInsightsTab.jsx";
import ResourceHubModule from "../modules/resources/ResourceHubModule.jsx";

// 11 SuperAdmin Role Modules matching exact reference UI Screenshots
import {
  SystemOverviewTab,
  PlatformSettingsTab,
  FeatureManagementTab,
  SystemLogsTab,
  AuditActivityTab,
  RolesPermissionsTab,
  IdeaCategoriesTab,
  ValidationEngineTab,
  ScoringConfigurationTab,
  IntegrationsTab,
  AnalyticsReportsTab,
} from "../modules/superadmin/index.js";

export default function AdminPanel() {
  const { user: me } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const roleParam = searchParams.get("role");
  const isSuperadminPath = location.pathname.startsWith("/superadmin");
  const effectiveRole =
    roleParam || (isSuperadminPath ? "superadmin" : me?.role) || "admin";
  const isSuperadmin = effectiveRole === "superadmin";

  const defaultTab = isSuperadmin ? "overview" : "analytics";
  const tab = searchParams.get("tab") || defaultTab;

  const renderActiveModule = () => {
    switch (tab) {
      // 1. System Overview (CONTROL CENTER)
      case "overview":
      case "system-overview":
        return <SystemOverviewTab />;

      // 2. Platform Settings (CONTROL CENTER)
      case "settings":
      case "platform-settings":
        return <PlatformSettingsTab />;

      // 3. Feature Management (CONTROL CENTER)
      case "features":
      case "feature-management":
        return <FeatureManagementTab />;

      // 4. System Logs (SECURITY & GOVERNANCE)
      case "logs":
      case "system-logs":
        return <SystemLogsTab />;

      // 5. Audit & Activity (SECURITY & GOVERNANCE)
      case "audit":
      case "audit-activity":
        return <AuditActivityTab />;

      // 6. Roles & Permissions (SECURITY & GOVERNANCE)
      case "roles-permissions":
      case "permissions":
        return <RolesPermissionsTab />;

      // 7. Idea Categories (STARTUP INTELLIGENCE)
      case "categories":
      case "idea-categories":
        return <IdeaCategoriesTab />;

      // 8. Validation Engine (STARTUP INTELLIGENCE)
      case "engine":
      case "validation-engine":
        return <ValidationEngineTab />;

      // 9. Scoring Configuration (STARTUP INTELLIGENCE)
      case "scoring":
      case "scoring-configuration":
        return <ScoringConfigurationTab />;

      // 10. Integrations (PLATFORM SERVICES)
      case "integrations":
        return <IntegrationsTab />;

      // 11. Analytics & Reports (PLATFORM SERVICES)
      case "analytics-reports":
        return <AnalyticsReportsTab />;

      // Shared / Dual-Mode Tabs
      case "roles":
        return isSuperadmin ? <RolesPermissionsTab /> : <RoleManagementTab />;

      case "reports":
        return isSuperadmin ? <AnalyticsReportsTab /> : <ValidationReportsTab />;

      // Standard Admin Operations Tabs
      case "users":
        return <AllUsersTab />;

      case "pending":
        return <PendingVerificationTab />;

      case "blocked":
        return <BlockedUsersTab />;

      case "ideas":
        return <AllIdeasTab />;

      case "review":
        return <PendingReviewTab />;

      case "approved":
        return <ApprovedIdeasTab />;

      case "rejected":
        return <RejectedIdeasTab />;

      case "mentors":
        return <MentorsExpertsTab />;

      case "requests":
        return <RequestsApprovalsTab />;

      // Content Management fallback
      case "guidelines":
      case "announcements":
      case "library":
      case "templates":
        return <ResourceHubModule role={me?.role || "admin"} />;

      case "analytics":
        return isSuperadmin ? <AnalyticsReportsTab /> : <AnalyticsInsightsTab />;

      // Default fallback
      default:
        return isSuperadmin ? <SystemOverviewTab /> : <AnalyticsInsightsTab />;
    }
  };

  return (
    <div className="admin-panel-module-root">
      {renderActiveModule()}
    </div>
  );
}
