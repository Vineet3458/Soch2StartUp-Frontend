import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useConfig } from "../context/ConfigContext.jsx";
import { BrandMark, BrandName } from "./Brand.jsx";
import { PlatformBanner } from "./AppShell.jsx";

export default function PublicNav() {
  const { user } = useAuth();
  const cfg = useConfig();
  const nav = useNavigate();
  const loc = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 20); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);

  const go = (id) => { setOpen(false); const run = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); if (loc.pathname === "/") run(); else { nav("/"); setTimeout(run, 150); } };
  return (
    <div className={`nav-pub ${scrolled ? "scrolled" : ""}`}>
      <PlatformBanner />
      <div className="nav-in">
        <Link to="/" className="nav-brand"><BrandMark size={36} /><BrandName name={cfg.platform.name} /></Link>
        <div className={`nav-links ${open ? "open" : ""}`}>
          <button onClick={() => go("top")}>Home</button><button onClick={() => go("features")}>Features</button><button onClick={() => go("how")}>How it works</button><button onClick={() => go("roles")}>Who it's for</button><button onClick={() => go("stats")}>Live stats</button>
        </div>
        <div className="row spacer" style={{ marginLeft: "auto" }}>
          <button className="icon-btn" onClick={() => cfg.setTheme(cfg.theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">{cfg.theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
          {user ? <Link to="/app" className="btn btn-sm">Open dashboard <ArrowRight size={15} /></Link> : <>
            <Link to="/login" className="btn btn-outline btn-sm hide-m">Log in</Link>
            <Link to="/register" className="btn btn-sm">Get started <ArrowRight size={15} /></Link></>}
          <button className="icon-btn mobile-only" style={{ display: undefined }} onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>
    </div>
  );
}
