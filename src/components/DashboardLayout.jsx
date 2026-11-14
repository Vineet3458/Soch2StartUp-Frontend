import Sidebar from "./sidebar/Sidebar.jsx";
import DashboardTopbar from "./dashboard/DashboardTopbar.jsx";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout-container">
      <Sidebar />
      <main className="dashboard-main-content">
        <DashboardTopbar />
        <div className="dashboard-page-stage">
          {children}
        </div>
      </main>
    </div>
  );
}
