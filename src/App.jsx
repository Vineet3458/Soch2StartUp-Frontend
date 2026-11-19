import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { ConfirmHost, Loader, Toaster } from "./components/ui.jsx";
import InteractiveBackground from "./components/InteractiveBackground.jsx";
import AppShell from "./components/AppShell.jsx";
import Home from "./pages/Home.jsx";
import { Login, Register } from "./pages/Auth.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";

function Protected({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <Loader text="Restoring your session…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname + loc.search }} />;
  return children;
}

function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? <Navigate to="/app" replace /> : children;
}

const LegacyIdea = () => <Navigate to={`/app/ideas/${useParams().id}`} replace />;

export default function App() {
  return (
    <>
      <InteractiveBackground />
      <div className="app-root">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/app/*" element={<Protected><AppShell /></Protected>} />
          {/* Old URLs keep working */}
          {["/dashboard", "/admin", "/superadmin", "/mentor"].map((p) => <Route key={p} path={p} element={<Navigate to="/app" replace />} />)}
          <Route path="/validate" element={<Navigate to="/app/validate" replace />} />
          <Route path="/compare" element={<Navigate to="/app/compare" replace />} />
          <Route path="/ideas/:id" element={<LegacyIdea />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Toaster />
      <ConfirmHost />
    </>
  );
}
