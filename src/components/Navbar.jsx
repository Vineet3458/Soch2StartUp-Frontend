import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ArrowRightIcon, ChevronDownIcon } from "./Icons.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user && ["admin", "superadmin"].includes(user.role);
  const isHome = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (!isHome) {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="site-navbar">
      <div className="site-navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="site-brand">
          <img
            src="/assets/nav-logo-hd.png"
            alt="Soch2Startup"
            className="brand-logo-img"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="brand-logo-fallback">
            Soch<span>2</span>Startup
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className={`site-nav-links ${mobileMenuOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>

          <button
            type="button"
            className="nav-item nav-link-btn"
            onClick={() => handleNavClick("features")}
          >
            Features
          </button>

          <button
            type="button"
            className="nav-item nav-link-btn"
            onClick={() => handleNavClick("how-it-works")}
          >
            How It Works
          </button>

          <button
            type="button"
            className="nav-item nav-link-btn"
            onClick={() => handleNavClick("about")}
          >
            About
          </button>

          {/* Resources Dropdown */}
          <div
            className="resources-dropdown-wrap"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button
              type="button"
              className="nav-item nav-link-btn dropdown-trigger"
              onClick={() => setResourcesOpen(!resourcesOpen)}
            >
              Resources <ChevronDownIcon />
            </button>

            {resourcesOpen && (
              <div className="resources-dropdown-menu">
                <a href="#how-it-works" onClick={() => setResourcesOpen(false)}>
                  Startup Playbook
                </a>
                <a href="#features" onClick={() => setResourcesOpen(false)}>
                  Validation Framework
                </a>
                <Link to="/register" onClick={() => setResourcesOpen(false)}>
                  Market Insights
                </Link>
                <a href="#about" onClick={() => setResourcesOpen(false)}>
                  Mentor Network
                </a>
              </div>
            )}
          </div>

          {/* Authenticated Links inside mobile/desktop if logged in */}
          {user && (
            <>
              <NavLink
                to="/dashboard"
                className="nav-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/validate"
                className="nav-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                Validate Idea
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </NavLink>
              )}
            </>
          )}
        </div>

        {/* Right CTA Actions */}
        <div className="site-nav-actions">
          {user ? (
            <div className="auth-user-controls">
              <span className="role-tag-badge">
                {user.role.replace("_", " ")}
              </span>
              <button
                type="button"
                className="nav-login-pill-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="guest-controls">
              <Link to="/login" className="nav-login-pill-btn">
                Login
              </Link>
              <Link to="/register" className="nav-get-started-btn">
                Get Started <ArrowRightIcon />
              </Link>
            </div>
          )}

          {/* Mobile menu hamburger toggle */}
          <button
            type="button"
            className="mobile-toggle-btn"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
