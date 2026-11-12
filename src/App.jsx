import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
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
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/validate" element={<ProtectedRoute><ValidateIdea /></ProtectedRoute>} />
          <Route path="/ideas/:id" element={<ProtectedRoute><IdeaReport /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={["admin", "superadmin"]}><AdminPanel /></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
}
