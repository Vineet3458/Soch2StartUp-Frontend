import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user && ["admin", "superadmin"].includes(user.role);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo">Soch<span>2</span>StartUp</Link>
        <div className="nav-links">
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/validate">Validate Idea</NavLink>
              {isAdmin && <NavLink to="/admin">Admin</NavLink>}
              <span className="role-tag">{user.role.replace("_", " ")}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link to="/register" className="btn btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
