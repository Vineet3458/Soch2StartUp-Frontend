import Sidebar from "./sidebar/Sidebar.jsx";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout-container">
      <Sidebar />
      <div className="dashboard-main-content">
        {children}
      </div>
    </div>
  );
}
