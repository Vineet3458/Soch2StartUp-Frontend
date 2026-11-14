import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ValidateIdea from "./pages/ValidateIdea.jsx";
import IdeaReport from "./pages/IdeaReport.jsx";
import Compare from "./pages/Compare.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

export default function App() {
  return (
    <Routes>
      {/* 1. Public Landing Page */}
      <Route
        path="/"
        element={
          <div className="site-wrapper">
            <Navbar />
            <main className="landing-page-root">
              <Home />
            </main>
          </div>
        }
      />

      {/* 2. Public Auth Pages */}
      <Route
        path="/login"
        element={
          <div className="site-wrapper">
            <Navbar />
            <main className="container main-container">
              <Login />
            </main>
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="site-wrapper">
            <Navbar />
            <main className="container main-container">
              <Register />
            </main>
          </div>
        }
      />

      {/* 3. Authenticated Dashboard Pages (Sidebar + Content Layout) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/validate"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ValidateIdea />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ideas/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <IdeaReport />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/compare"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Compare />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin", "superadmin"]}>
            <DashboardLayout>
              <AdminPanel />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute roles={["admin", "superadmin"]}>
            <DashboardLayout>
              <AdminPanel />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor"
        element={
          <ProtectedRoute roles={["mentor", "admin", "superadmin"]}>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 4. Catch-all: Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
