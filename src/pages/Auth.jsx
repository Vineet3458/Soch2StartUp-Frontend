import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, Lock, Mail, Rocket, Award, Sparkles, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useConfig } from "../context/ConfigContext.jsx";
import { errMsg } from "../api/client.js";
import { Alert, Button, Field } from "../components/ui.jsx";
import { BrandMark } from "../components/Brand.jsx";
import PublicNav from "../components/PublicNav.jsx";
import { Spotlight, SpotlightCard } from "../components/aceternity/index.js";

export const DEMO = [
  ["Founder", "entrepreneur@soch2startup.com", "S2S#Founder!2026"],
  ["Mentor", "mentor@soch2startup.com", "S2S#Mentor!2026"],
  ["Expert", "expert@soch2startup.com", "S2S#Expert!2026"],
  ["Moderator", "moderator@soch2startup.com", "S2S#Moderator!2026"],
  ["Admin", "admin@soch2startup.com", "S2S#Admin!2026"],
  ["Superadmin", "superadmin@soch2startup.com", "S2S#SuperAdmin!2026"],
];

export const BREACHED_PASSWORDS = new Set([
  "password", "password12", "password123", "password1234", "password12345", "password@123", "pass@1234",
  "12345678", "123456789", "1234567890", "12345678a", "12345678b", "123456789a",
  "admin123", "admin1234", "admin12345", "admin123456", "admin@123", "admin@1234", "admin@12345", "administrator",
  "superadmin123", "superadmin@123", "superadmin@12345",
  "founder123", "founder@123", "founder@1234", "founder@12345",
  "mentor123", "mentor@123", "mentor@1234", "mentor@12345",
  "expert123", "expert@123", "expert@1234", "expert@12345",
  "moderator123", "moderator@123", "moderator@1234", "moderator@12345",
  "qwerty123", "qwertyuiop", "welcome123", "welcome@123", "welcome1234", "letmein123",
  "iloveyou123", "pass1234", "changeme123", "changeme@123", "soch2startup123", "startup123", "startup@123"
]);

export const isEmailValid = (email) => /^\S+@\S+\.\S+$/.test(email);

export const isPasswordValid = (pw) =>
  typeof pw === "string" && pw.length >= 8 && pw.length <= 128 && /[A-Za-z]/.test(pw) && /[0-9]/.test(pw);

export const isBreachedPassword = (pw) =>
  typeof pw === "string" && BREACHED_PASSWORDS.has(pw.toLowerCase().trim());

export const getSafeRedirect = (from) => {
  if (typeof from !== "string" || !from.startsWith("/") || from.startsWith("//") || from.includes("\\")) return "/app";
  const path = from.split("?")[0].split("#")[0];
  if (path === "/login" || path === "/register") return "/app";
  return from;
};

export function AuthLayout({ children }) {
  const cfg = useConfig();
  const platform = cfg?.platform || {};
  return (
    <div className="auth-wrapper">
      <div className="pub"><PublicNav /></div>
      <main className="auth-page">
        <div className="auth-container">
          <section className="auth-art" aria-label="Platform introduction" style={{ position: "relative", overflow: "hidden" }}>
            <Spotlight className="auth-spotlight" />
            <div className="auth-art-panel">
              <img
                className="startup-illustration"
                src="/assets/founderverse/startup-validation.svg"
                alt="Startup founders reviewing an idea validation dashboard"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="auth-art-copy">
              <h2>{platform.tagline || "Turn your startup idea into a scalable business"}</h2>
              <p className="muted">AI validation · expert evaluation · mentor guidance — all in one live workspace.</p>
            </div>
            <div className="auth-chips-row">
              {["AI-scored reports", "Real-time updates", "Role-based workspaces"].map((t) => (
                <span key={t} className="chip">
                  <Sparkles size={13} color="var(--primary)" />
                  {t}
                </span>
              ))}
            </div>
          </section>
          <section className="auth-form-side">{children}</section>
        </div>
      </main>
    </div>
  );
}

export function Login() {
  const { login } = useAuth();
  const cfg = useConfig();
  const platform = cfg?.platform || {};
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const email = form.email.trim();
    if (!email || !form.password) {
      setError("Email and password are required");
      return;
    }
    if (!isEmailValid(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await login(email, form.password);
      nav(getSafeRedirect(loc.state?.from), { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <SpotlightCard as="form" className="card auth-card glow-border" onSubmit={submit}>
        <div className="row" style={{ marginBottom: 18 }}>
          <BrandMark size={44} />
          <div>
            <h2>Welcome back</h2>
            <p className="muted small">Sign in to your {platform.name || "Soch2Startup"} workspace</p>
          </div>
        </div>
        {platform.maintenance?.enabled && (
          <Alert kind="warning">
            {platform.maintenance.message || "Platform under maintenance. Only admins can sign in."}
          </Alert>
        )}
        {error && <Alert kind="error">{error}</Alert>}
        <div className="col" style={{ marginTop: 14 }}>
          <Field label="Email address" htmlFor="login-email">
            <div className="input-icon">
              <Mail size={17} />
              <input
                id="login-email"
                className="input"
                type="email"
                autoComplete="email"
                placeholder="you@domain.com"
                value={form.email}
                disabled={busy}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (error) setError("");
                }}
                required
              />
            </div>
          </Field>
          <Field label="Password" htmlFor="login-password">
            <div className="input-icon">
              <Lock size={17} />
              <input
                id="login-password"
                className="input"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                disabled={busy}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  if (error) setError("");
                }}
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                className="btn-ghost password-toggle"
                disabled={busy}
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </Field>
          <Button loading={busy} className="full" type="submit" disabled={busy}>Sign in</Button>
        </div>
        <p className="muted center small mt">
          New here? <Link to="/register" state={loc.state}>Create an account</Link>
        </p>
        {Boolean(import.meta.env?.DEV) && (
          <>
            <hr className="divider" />
            <div className="tiny faint center" style={{ marginBottom: 8 }}>DEMO ACCOUNTS · click to fill</div>
            <div className="row wrap" style={{ justifyContent: "center", gap: 6 }}>
              {DEMO.map(([l, e, p]) => (
                <button
                  type="button"
                  key={l}
                  className="demo-pill"
                  disabled={busy}
                  title={`${l}: ${e}`}
                  onClick={() => {
                    setForm({ email: e, password: p });
                    setError("");
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </>
        )}
      </SpotlightCard>
    </AuthLayout>
  );
}

export const ROLE_OPTS = [
  ["entrepreneur", "Founder", Rocket],
  ["mentor", "Mentor", GraduationCap],
  ["industry_expert", "Expert", Award]
];

export function Register() {
  const { register } = useAuth();
  const cfg = useConfig();
  const platform = cfg?.platform || {};
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "entrepreneur" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (error) setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (platform.registrationOpen === false) {
      setError("Registration is currently closed by the administrator.");
      return;
    }
    if (platform.maintenance?.enabled) {
      setError(platform.maintenance.message || "Platform under maintenance. Registration is temporarily disabled.");
      return;
    }
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email || !form.password) {
      setError("Please fill in all required fields");
      return;
    }
    if (!isEmailValid(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (form.password.length > 128) {
      setError("Password cannot exceed 128 characters");
      return;
    }
    if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      setError("Password must contain at least one letter and one number");
      return;
    }
    if (BREACHED_PASSWORDS.has(form.password.toLowerCase().trim())) {
      setError("This password is known to be compromised in data breaches. Please choose a more secure password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await register({ ...form, name, email });
      nav(getSafeRedirect(loc.state?.from), { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const isRegistrationDisabled = platform.registrationOpen === false || Boolean(platform.maintenance?.enabled);
  const needsVerify = (platform.requireVerification ?? true) && form.role !== "entrepreneur";

  return (
    <AuthLayout>
      <SpotlightCard as="form" className="card auth-card glow-border" onSubmit={submit}>
        <div className="row" style={{ marginBottom: 18 }}>
          <BrandMark size={44} />
          <div>
            <h2>Create your account</h2>
            <p className="muted small">Validate, mentor or evaluate startup ideas</p>
          </div>
        </div>
        {platform.maintenance?.enabled && (
          <Alert kind="warning">
            {platform.maintenance.message || "Platform under maintenance. Registration is temporarily disabled."}
          </Alert>
        )}
        {platform.registrationOpen === false && !platform.maintenance?.enabled && (
          <Alert kind="warning">Registration is currently closed by the administrator.</Alert>
        )}
        {error && <Alert kind="error">{error}</Alert>}
        <div className="col" style={{ marginTop: 14 }}>
          <Field label="I am a">
            <div className="role-pick" role="radiogroup" aria-label="Account role">
              {ROLE_OPTS.map(([v, l, I]) => (
                <button
                  type="button"
                  key={v}
                  role="radio"
                  aria-checked={form.role === v}
                  tabIndex={form.role === v ? 0 : -1}
                  disabled={busy}
                  className={`role-opt ${form.role === v ? "on" : ""}`}
                  onClick={() => {
                    setForm({ ...form, role: v });
                    if (error) setError("");
                  }}
                >
                  <I size={20} />
                  {l}
                </button>
              ))}
            </div>
          </Field>
          {needsVerify && (
            <div className="hint" style={{ marginTop: 2, marginBottom: 4 }}>
              Mentor and expert accounts are reviewed by an admin before they can give feedback.
            </div>
          )}
          <Field label="Full name" htmlFor="register-name">
            <div className="input-icon">
              <User size={17} />
              <input
                id="register-name"
                className="input"
                placeholder="Aarav Patel"
                autoComplete="name"
                value={form.name}
                disabled={busy}
                onChange={set("name")}
                required
                maxLength={80}
              />
            </div>
          </Field>
          <Field label="Email address" htmlFor="register-email">
            <div className="input-icon">
              <Mail size={17} />
              <input
                id="register-email"
                className="input"
                type="email"
                autoComplete="email"
                placeholder="you@domain.com"
                value={form.email}
                disabled={busy}
                onChange={set("email")}
                required
              />
            </div>
          </Field>
          <Field label="Password" hint="At least 8 characters with letters & numbers" htmlFor="register-password">
            <div className="input-icon">
              <Lock size={17} />
              <input
                id="register-password"
                className="input"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                placeholder="••••••••"
                value={form.password}
                disabled={busy}
                onChange={set("password")}
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                className="btn-ghost password-toggle"
                disabled={busy}
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </Field>
          <Button loading={busy} className="full" type="submit" disabled={isRegistrationDisabled || busy}>
            Create account
          </Button>
        </div>
        <p className="muted center small mt">
          Already registered? <Link to="/login" state={loc.state}>Sign in</Link>
        </p>
      </SpotlightCard>
    </AuthLayout>
  );
}
