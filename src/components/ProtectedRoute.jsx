import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "./Loader.jsx";

// Blocks pages for logged-out users, and for roles that are not allowed
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  const effectiveRole = roleParam || user?.role;

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(effectiveRole)) return <Navigate to="/dashboard" replace />;
  return children;
}
